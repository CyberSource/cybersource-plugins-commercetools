import jwt from 'jsonwebtoken';

import { Constants } from './constants/constants';
import { CustomMessages } from './constants/customMessages';
import { FunctionConstant } from './constants/functionConstant';
import captureContext from './service/payment/CaptureContextService';
import flexKeys from './service/payment/FlexKeys';
import getCardByInstrument from './service/payment/GetCardByInstrumentId';
import keyVerification from './service/payment/GetPublicKeys';
import { ActionResponseType, PaymentTransactionType, PaymentType } from './types/Types';
import paymentActions from './utils/PaymentActions';
import paymentHandler from './utils/PaymentHandler';
import paymentUtils from './utils/PaymentUtils';
import commercetoolsApi from './utils/api/CommercetoolsApi';
import orderManagementHelper from './utils/helpers/OrderManagementHelper';
import payerAuthHelper from './utils/helpers/PayerAuthHelper';
import paymentHelper from './utils/helpers/PaymentHelper';


/**
 * Handles the creation of payment.
 * 
 * @param {PaymentType} paymentObj - The payment object containing payment information.
 * @returns {Promise<ActionResponseType>} - A promise resolving to an action response type.
 */
const paymentCreateApi = async (paymentObj: PaymentType): Promise<ActionResponseType> => {
  let response: ActionResponseType = paymentUtils.getEmptyResponse();
  if (paymentObj?.paymentMethodInfo?.method) {
    const paymentMethod = paymentObj.paymentMethodInfo.method;
    if (paymentObj?.custom?.fields?.isv_transientToken) {
      response = paymentUtils.getEmptyResponse();
    } else if (Constants.CREDIT_CARD === paymentMethod || Constants.CC_PAYER_AUTHENTICATION === paymentMethod) {
      if (paymentObj?.custom?.fields?.isv_savedToken) {
        const actions = paymentUtils.setCustomFieldMapper(paymentObj.custom.fields);
        response.actions = actions;
      } else {
        const microFormKeys = await flexKeys.getFlexKeys(paymentObj);
        if (microFormKeys?.isv_tokenCaptureContextSignature) {
          response = paymentUtils.invalidOperationResponse();
          const verifiedCaptureContext = await keyVerification.getPublicKeys(microFormKeys.isv_tokenCaptureContextSignature, paymentObj);
          if (verifiedCaptureContext) {
            const actions = paymentUtils.setCustomFieldMapper(microFormKeys);
            response.actions = actions;
          }
        } else {
          response = paymentUtils.invalidOperationResponse();
        }
      }
    } else if (Constants.APPLE_PAY === paymentMethod) {
      if (paymentObj?.custom?.fields?.isv_applePayValidationUrl && paymentObj?.custom?.fields?.isv_applePayDisplayName) {
        response = await paymentHandler.handleApplePaySession(paymentObj.custom.fields);
      }
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_PAYMENT_CREATE_API, Constants.LOG_ERROR, '', CustomMessages.ERROR_MSG_EMPTY_PAYMENT_DATA);
    }
  }
  return response;
};

/**
 * Handles the update of a payment.
 * 
 * @param {PaymentType} paymentObj - The payment object containing payment information.
 * @returns {Promise<ActionResponseType>} - A promise resolving to an action response type.
 */
const paymentUpdateApi = async (paymentObj: PaymentType): Promise<ActionResponseType> => {
  let updateResponse: ActionResponseType = paymentUtils.getEmptyResponse();
  if (paymentObj?.id && paymentObj.paymentMethodInfo?.method && paymentObj?.transactions) {
    const paymentMethod = paymentObj.paymentMethodInfo.method;
    const transactionLength = paymentObj.transactions?.length;
    if (paymentObj?.custom?.fields) {
      try {
        if (Constants.CC_PAYER_AUTHENTICATION === paymentMethod && 0 === transactionLength) {
          updateResponse = await payerAuthHelper.processPayerAuthentication(paymentObj);
        }
        if (0 < transactionLength) {
          updateResponse = await paymentHelper.processTransaction(paymentObj);
        }
      } catch (exception) {
        paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_PAYMENT_UPDATE_API, CustomMessages.EXCEPTION_UPDATE_PAYMENT_API, exception, '', '', '');
      }
    }
  }
  return updateResponse;
};

/**
 * Handles the update of a customer.
 * 
 * @param {any} customerObj - The customer object containing customer information.
 * @returns {Promise<ActionResponseType>} - A promise resolving to an action response type.
 */
const customerUpdateApi = async (customerObj: any): Promise<ActionResponseType> => {
  let response: ActionResponseType = paymentUtils.invalidInputResponse();
  try {
    if (customerObj) {
      const { isv_tokenCaptureContextSignature, isv_addressId, isv_tokens, isv_tokenAction, isv_failedTokens } = customerObj?.custom?.fields;
      if ('' === isv_tokenCaptureContextSignature) {
        const paymentObj = customerObj;
        const microFormKeys = await flexKeys.getFlexKeys(paymentObj);
        if (microFormKeys) {
          const actions = paymentUtils.setCustomFieldMapper(microFormKeys);
          response.actions = actions;
          response.errors = [];
        }
      } else if (isv_addressId && customerObj?.addresses) {
        const customerAddress = customerObj.addresses;
        response = await paymentHandler.handleCardAddition(customerObj.id, customerAddress, customerObj);
      } else if (isv_tokens && 0 < isv_tokens?.length) {
        const tokensToUpdate = JSON.parse(customerObj.custom.fields.isv_tokens[0]);
        switch (isv_tokenAction) {
          case 'delete':
            response = await paymentHandler.handleCardDeletion(tokensToUpdate, customerObj.id);
            break;
          case 'update':
            response = await paymentHandler.handleUpdateCard(tokensToUpdate, customerObj.id, customerObj);
            break;
          default:
            response = paymentActions.getUpdateTokenActions(isv_tokens, isv_failedTokens, true, customerObj, null);
        }
      }
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_CUSTOMER_UPDATE_API, CustomMessages.EXCEPTION_UPDATE_CUSTOMER_API, exception, '', '', '');
  }
  return response;
};

/**
 * Retrieves payment details and cart details via API.
 * 
 * @param {string} paymentId - The ID of the payment to retrieve details for.
 * @returns {Promise<{
*   paymentId: string;
*   locale: string;
*   pendingAuthorizedAmount: number;
*   pendingCaptureAmount: number;
*   errorMessage: string;
*   paymentDetails: PaymentType;
*   cartData: any;
*   orderNo: string;
* }>} - A promise resolving to an object containing payment details.
*/
const paymentDetailsApi = async (paymentId: string) => {
  let isAuthReversed = false;
  const paymentDetailsResponse = {
    paymentId: '',
    locale: '',
    pendingAuthorizedAmount: 0,
    pendingCaptureAmount: 0,
    errorMessage: CustomMessages.ERROR_MSG_EMPTY_PAYMENT_DATA,
    paymentDetails: {},
    cartData: {},
    orderNo: ''
  };
  let paymentDetails: PaymentType | null = null;
  let refundTransaction: readonly Partial<PaymentTransactionType>[];
  try {
    if (typeof paymentId === Constants.STR_STRING && paymentId) {
      paymentDetailsResponse.paymentId = paymentId.replace(Constants.FORMAT_PAYMENT_ID_REGEX, '');
      const cartDetails = await commercetoolsApi.queryCartById(paymentDetailsResponse.paymentId, Constants.PAYMENT_ID);
      if (cartDetails?.count) {
        const cartData = cartDetails?.results[0];
        if (cartData && cartData?.locale) {
          paymentDetailsResponse.cartData = cartData;
          paymentDetailsResponse.locale = cartData.locale;
        }
      }
      paymentDetails = await commercetoolsApi.retrievePayment(paymentDetailsResponse.paymentId);
      if (paymentDetails) {
        paymentDetailsResponse.errorMessage = '';
        paymentDetailsResponse.orderNo = await paymentUtils.getOrderId(cartDetails?.results[0]?.id, paymentDetails?.id);
        if (paymentDetails?.transactions) {
          paymentDetailsResponse.paymentDetails = paymentDetails;
          refundTransaction = paymentDetails.transactions;
          if (refundTransaction && 0 < refundTransaction?.length) {
            for (let transaction of refundTransaction) {
              if (Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION === transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS === transaction.state) {
                isAuthReversed = true;
                break;
              }
            }
            if (!isAuthReversed) {
              paymentDetailsResponse.pendingCaptureAmount = orderManagementHelper.getCapturedAmount(paymentDetails);
              paymentDetailsResponse.pendingAuthorizedAmount = orderManagementHelper.getAuthorizedAmount(paymentDetails);
            }
          }
        }
      } else {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_PAYMENT_DETAILS_API, Constants.LOG_ERROR, 'PaymentId :' + paymentDetailsResponse?.paymentId || '', CustomMessages.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS);
      }
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_PAYMENT_DETAILS_API, '', exception, 'PaymentId :' + paymentDetailsResponse?.paymentId || '', '', '');
  }
  return paymentDetailsResponse;
};

/**
 * Handles the ordermanagement services for a payment.
 * 
 * @param {string} paymentId - The ID of the payment to manage transactions for.
 * @param {number | undefined} transactionAmount - The amount of the transaction.
 * @param {string} transactionType - The type of the transaction (charge, refund, or authorization reversal).
 * @returns {Promise<{
*   errorMessage: string;
*   successMessage: string;
* }>} - A promise resolving to an object containing the API response.
*/
const orderManagementApi = async (paymentId: string, transactionAmount: number | undefined, transactionType: string): Promise<{
  errorMessage: string;
  successMessage: string;
}> => {
  let pendingAmount;
  let paymentObject: PaymentType | null = null;
  const apiResponse = {
    errorMessage: '',
    successMessage: '',
  };
  try {
    if (paymentId) {
      paymentObject = await commercetoolsApi.retrievePayment(paymentId);
      if (paymentObject) {
        const fractionDigits = paymentObject?.amountPlanned?.fractionDigits;
        switch (transactionType) {
          case Constants.CT_TRANSACTION_TYPE_CHARGE:
            pendingAmount = orderManagementHelper.getAuthorizedAmount(paymentObject);
            break;
          case Constants.CT_TRANSACTION_TYPE_REFUND:
            pendingAmount = orderManagementHelper.getCapturedAmount(paymentObject);
            break;
        }
        if (0 === transactionAmount) {
          apiResponse.errorMessage = paymentUtils.handleOMErrorMessage(0, transactionType);
        } else if (pendingAmount && transactionAmount && transactionAmount > pendingAmount) {
          apiResponse.errorMessage = paymentUtils.handleOMErrorMessage(1, transactionType);
        } else {
          if (transactionAmount) {
            paymentObject.amountPlanned.centAmount = paymentUtils.convertAmountToCent(transactionAmount, fractionDigits);
          }
          const transactionObject = paymentUtils.createTransactionObject(paymentObject.version, paymentObject.amountPlanned, transactionType, Constants.CT_TRANSACTION_STATE_INITIAL, undefined, undefined);
          const addTransaction = await commercetoolsApi.addTransaction(transactionObject, paymentId);
          if (addTransaction && addTransaction.transactions?.length) {
            const transactionLength = addTransaction.transactions.length;
            const latestTransaction = addTransaction.transactions[transactionLength - 1];
            if (latestTransaction && Constants.CT_TRANSACTION_STATE_SUCCESS === latestTransaction.state) {
              if (latestTransaction?.type) {
                apiResponse.successMessage = paymentUtils.handleOmSuccessMessage(latestTransaction.type);
              }
            } else {
              apiResponse.errorMessage = paymentUtils.handleOMErrorMessage(2, transactionType);
            }
          } else {
            apiResponse.errorMessage = CustomMessages.ERROR_MSG_ADD_TRANSACTION_DETAILS;
          }
        }
      } else {
        apiResponse.errorMessage = CustomMessages.ERROR_MSG_RETRIEVE_PAYMENT_DETAILS;
      }
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_ORDER_MANAGEMENT_API, '', exception, '', '', '');
  }
  return apiResponse;
};

/**
 * Handles generation of capture context.
 * 
 * @param {object} requestObj - The request object containing either cart details or country, locale, and currency information.
 * @returns {Promise<string>} - A promise resolving to the capture context response.
 */
const captureContextApi = async (requestObj: any): Promise<any> => {
  let cartId = requestObj?.cartId || '';
  let response;
  let captureContextResponse;
  const merchantId = requestObj?.merchantId ? requestObj.merchantId : '';
  try {
    if (requestObj?.cartId) {
      const cartDetails = await commercetoolsApi.getCartById(cartId);
      if (cartDetails && cartDetails?.id) {
        captureContextResponse = await captureContext.generateCaptureContext(cartDetails, '', '', '', merchantId, 'Payments');
      }
    } else if (requestObj?.country && requestObj?.locale && requestObj?.currency) {
      const country = requestObj.country;
      const locale = requestObj.locale;
      const currencyCode = requestObj.currency;
      captureContextResponse = await captureContext.generateCaptureContext(null, country, locale, currencyCode, merchantId, 'MyAccounts');
    }
    let decodedCaptureContext = jwt.decode(captureContextResponse);
    if(captureContextResponse && decodedCaptureContext?.ctx?.[0]?.data?.clientLibrary && decodedCaptureContext?.ctx?.[0].data.clientLibraryIntegrity){
      response = {
        captureContextData: captureContextResponse,
        clientLibrary: decodedCaptureContext?.ctx?.[0].data.clientLibrary,
        clientLibraryIntegrity: decodedCaptureContext?.ctx?.[0].data.clientLibraryIntegrity,
      }
    }
    if (!response) {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_CAPTURE_CONTEXT_API, Constants.LOG_ERROR, 'CartId : ' + cartId, CustomMessages.ERROR_MSG_CAPTURE_CONTEXT);
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_CAPTURE_CONTEXT_API, '', exception, '', '', '');
  }
  return response;
};

/**
 * Handles network token update notifications.
 * 
 * @param {object} notification - The notification object received.
 * @returns {Promise<{
*   errorMessage: string;
*   successMessage: string;
* }>} - A promise resolving to the notification API response.
*/
const notificationApi = async (notification: any): Promise<{ errorMessage: string; successMessage: string; }> => {
  let instrumentIdentifier = '';
  let customerTokenId = '';
  let merchantId = '';
  const notificationApiResponse = {
    errorMessage: '',
    successMessage: '',
  };
  let instrumentIdResponse;
  let updateTokenResponse;
  if (Constants.NETWORK_TOKEN_EVENT === notification?.eventType && notification?.payload && notification.payload[0]?.data) {
    try {
      for (let element of notification.payload) {
        instrumentIdentifier = paymentUtils.extractTokenValue(element.data._links.instrumentIdentifiers[0].href);
        customerTokenId = paymentUtils.extractTokenValue(element.data._links.customers[0].href);
        merchantId = element?.organizationId;
        if (merchantId && 0 < instrumentIdentifier?.length) {
          instrumentIdResponse = await getCardByInstrument.getCardByInstrumentResponse(instrumentIdentifier, merchantId);
          if (Constants.HTTP_OK_STATUS_CODE === instrumentIdResponse?.httpCode && Constants.STRING_ACTIVE === instrumentIdResponse?.state) {
            updateTokenResponse = await paymentHandler.handleNetworkToken(customerTokenId, instrumentIdResponse);
            if (updateTokenResponse) {
              notificationApiResponse.successMessage = CustomMessages.SUCCESS_MSG_UPDATED_CUSTOMER_TOKEN;
            }
          } else {
            notificationApiResponse.errorMessage = CustomMessages.ERROR_MSG_INVALID_INSTRUMENT_ID_RESPONSE;
            paymentUtils.logData(__filename, FunctionConstant.FUNC_NOTIFICATION_API, Constants.LOG_DEBUG, '', JSON.stringify(instrumentIdResponse));
          }
        }
      }
    } catch (exception) {
      paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_NOTIFICATION_API, '', exception, '', '', '');
    }
  } else {
    notificationApiResponse.errorMessage = CustomMessages.ERROR_MSG_INVALID_NOTIFICATION_DATA;
  }
  return notificationApiResponse;
};

export default {
  paymentCreateApi,
  paymentUpdateApi,
  customerUpdateApi,
  paymentDetailsApi,
  captureContextApi,
  notificationApi,
  orderManagementApi,
};
