import { Cart, Payment } from "@commercetools/platform-sdk";

import { CustomMessages } from "../../constants/customMessages";
import { FunctionConstant } from "../../constants/functionConstant";
import { Constants } from "../../constants/paymentConstants";
import getTransaction from "../../service/payment/GetTransactionData";
import getTransientTokenData from "../../service/payment/GetTransientTokenData";
import { ActionType, VisaUpdateType } from "../../types/Types";
import paymentActions from "../PaymentActions";
import paymentUtils from "../PaymentUtils";
import commercetoolsApi from "../api/CommercetoolsApi";

/**
 * Retrieves cart details by payment ID.
 * 
 * @param {string} paymentId - The ID of the payment.
 * @returns {Promise<any>} - A promise that resolves with the cart details.
 */
const getCartDetailsByPaymentId = async (paymentId: string): Promise<any> => {
  let cartDetails;
  if (paymentId) {
    const cartResponse = await commercetoolsApi.queryCartById(paymentId, Constants.PAYMENT_ID);
    if (cartResponse && 0 < cartResponse?.count) {
      cartDetails = cartResponse.results[0];
    }
  } else {
    paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CART_DETAILS_BY_PAYMENT_ID, Constants.LOG_ERROR, 'PaymentId : ' + paymentId, CustomMessages.ERROR_MSG_PAYMENT_DETAILS);
  }
  return cartDetails;
};
/**
 * Updates the cart with address details obtained from transient token data.
 * 
 * @param {Payment} updatePaymentObj - The payment object containing updated payment details.
 * @param {Cart} cartObj - The cart object to be updated.
 * @returns {Promise<any>} - The updated cart object.
 */
const updateCartWithUCAddress = async (updatePaymentObj: Payment, cartObj: Cart): Promise<any> => {
  let message = '';
  let paymentId = updatePaymentObj.id || '';
  let cartId = cartObj?.id;
  let cartVersion = cartObj?.version || '';
  let transientTokenData: {
    readonly httpCode: number;
    readonly data: any;
    readonly status: string;
  };
  let updatedCart;
  if (updatePaymentObj && cartObj && cartId && cartVersion) {
    transientTokenData = await getTransientTokenData.getTransientTokenDataResponse(updatePaymentObj, 'Payments');
    if (transientTokenData?.httpCode && Constants.HTTP_OK_STATUS_CODE === transientTokenData?.httpCode) {
      let orderInformation = transientTokenData.data.orderInformation;
      if (!paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_UC_ENABLE_EMAIL)) {
        orderInformation.billTo.email = cartObj?.billingAddress?.email;
      }
      updatedCart = await commercetoolsApi.updateCartByPaymentId(cartId, paymentId, cartObj.version, orderInformation);
      message = updatedCart ? CustomMessages.SUCCESS_MSG_UC_ADDRESS_DETAILS : CustomMessages.ERROR_MSG_UC_ADDRESS_DETAILS;
    } else {
      message = CustomMessages.ERROR_MSG_TRANSIENT_TOKEN_DATA;
    }
  }
  paymentUtils.logData(__filename, FunctionConstant.FUNC_UPDATE_CART_WITH_UC_ADDRESS, Constants.LOG_INFO, 'PaymentId : ' + paymentId, message);
  return updatedCart;
};

/**
 * Updates card details for the payment using Visa checkout data.
 * 
 * @param {Payment} payment - The payment object.
 * @param {number} paymentVersion - The version of the payment.
 * @param {string} transactionId - The transaction ID.
 * @returns {Promise<void>} - A promise that resolves when the update is complete.
 */
const updateCardDetails = async (payment: Payment, paymentVersion: number, transactionId: string): Promise<void> => {
  let paymentId = payment.id || '';
  const visaObject = {
    transactionId: '',
  };
  const updateResponse = {
    cartVersion: null,
    paymentVersion: null,
  };
  let actions: Partial<ActionType>[] = [];
  let syncVisaCardDetailsResponse: Payment | null = null;
  if (payment && paymentVersion) {
    visaObject.transactionId = transactionId;
    const visaCheckoutData = await getPaymentData(visaObject, payment)
    if (visaCheckoutData) {
      const cartDetails = await getCartDetailsByPaymentId(paymentId);
      if (cartDetails && 'Active' === cartDetails.cartState && cartDetails?.id && cartDetails?.version) {
        const visaResponse = await commercetoolsApi.updateCartByPaymentId(cartDetails.id, paymentId, cartDetails.version, visaCheckoutData);
        if (visaResponse) {
          updateResponse.cartVersion = visaResponse.version;
          actions = paymentActions.cardDetailsActions(visaCheckoutData);
          if (actions && actions?.length) {
            const visaUpdateObject = {
              actions: actions,
              id: paymentId,
              version: paymentVersion,
            };
            syncVisaCardDetailsResponse = await commercetoolsApi.syncVisaCardDetails(visaUpdateObject as VisaUpdateType);
            if (syncVisaCardDetailsResponse) {
              paymentUtils.logData(__filename, FunctionConstant.FUNC_UPDATE_CARD_DETAILS, Constants.LOG_INFO, 'PaymentId : ' + paymentId, CustomMessages.SUCCESS_MSG_UPDATE_CLICK_TO_PAY_CARD_DETAILS);
            }
          }
        }
      }
    }
  }
};

/**
 * Retrieves cart data based on the provided payment response and payment object.
 * 
 * This function attempts to fetch transaction data associated with a payment response.
 * It first tries to retrieve the data directly, and if unsuccessful, it retries up to a maximum 
 * number of attempts with a specified delay between each attempt.
 * 
 * @param {any} paymentResponse - The response object from the payment process, which includes HTTP status and data.
 * @param {Payment} updatePaymentObj - The payment object that may contain necessary information for the transaction.
 * @returns {Promise<any>} - A promise that resolves to the cart details if successfully retrieved, or undefined if unsuccessful.
 */
const getPaymentData = async (paymentResponse: any, updatePaymentObj: Payment) => {
  let cartDetails: any;
  const transactionId = paymentResponse?.transactionId;
  let getTransactionDataResponse = await getTransaction.getTransactionData(transactionId, updatePaymentObj, null);
  if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode
    && getTransactionDataResponse
    && Constants.HTTP_OK_STATUS_CODE === getTransactionDataResponse.httpCode
    && getTransactionDataResponse?.cardFieldGroup) {
    cartDetails = getTransactionDataResponse;
  }
  return cartDetails;
};

const updateCartWithPayPalAddress = async (updatePaymentObj: Payment, cartObj: Cart, transactionStatus: any): Promise<any> => {
  let message = '';
  let paymentId = updatePaymentObj.id || '';
  let cartId = cartObj?.id;
  let cartVersion = cartObj?.version || '';
  let updatedCart;
  if (updatePaymentObj && cartObj && cartId && cartVersion && transactionStatus.orderInformation.billTo) {
    let orderInformation = transactionStatus.orderInformation;
    updatedCart = await commercetoolsApi.updateCartByPaymentId(cartId, paymentId, cartObj.version, orderInformation);
    message = updatedCart ? CustomMessages.SUCCESS_MSG_PAYPAL_ADDRESS_DETAILS : CustomMessages.ERROR_MSG_PAYPAL_ADDRESS_DETAILS;
  }
  else {
    message = CustomMessages.ERROR_MSG_ADDRESS_NOT_FOUND_IN_TRANSACTION;
  }
  paymentUtils.logData(__filename, FunctionConstant.FUNC_UPDATE_CART_WITH_PAYPAL_ADDRESS, Constants.LOG_INFO, 'PaymentId : ' + paymentId, message);
  return updatedCart;
};

export default {
  getCartDetailsByPaymentId,
  updateCartWithUCAddress,
  updateCardDetails,
  getPaymentData,
  updateCartWithPayPalAddress
}