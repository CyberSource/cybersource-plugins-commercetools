import { _BaseAddress, Cart, Customer, Payment } from '@commercetools/platform-sdk';
import { PtsV2PaymentsPost201Response } from 'cybersource-rest-client';
import { CustomMessages } from '../constants/customMessages';
import { Constants } from '../constants/paymentConstants';
import createSearchRequest from '../service/payment/CreateTransactionSearchRequest';
import conversion from '../service/payment/DecisionSyncService';
import deleteToken from '../service/payment/DeleteTokenService';
import '../service/payment/GetTransactionData';
import paymentAuthReversal from '../service/payment/PaymentAuthorizationReversal';
import paymentCapture from '../service/payment/PaymentCaptureService';
import updateToken from '../service/payment/UpdateTokenService';
import { ActionResponseType, AddressType, CustomerTokensType, InstrumentIdResponse, PaymentCustomFieldsType, PaymentTransactionType, ReportResponseType } from '../types/Types';
import paymentActions from './PaymentActions';
import paymentUtils from './PaymentUtils';
import paymentValidator from './PaymentValidator';
import commercetoolsApi from './api/CommercetoolsApi';
import multiMid from './config/MultiMid';
import orderManagementHelper from './helpers/OrderManagementHelper';
import syncHelper from './helpers/SyncHelper';

const handleSetTokenToNull = async (customFields: Partial<PaymentCustomFieldsType> | undefined, authResponse: ActionResponseType, paymentMethod: string): Promise<any> => {
  const isv_tokenVerificationContext = '';
  const isv_tokenCaptureContextSignature = '';
  const isv_clientLibrary = '';
  const isv_clientLibraryIntegrity = '';
  if ((customFields?.isv_savedToken && customFields?.isv_tokenVerificationContext) || (Constants.CREDIT_CARD !== paymentMethod && Constants.CC_PAYER_AUTHENTICATION !== paymentMethod && customFields?.isv_tokenVerificationContext)) {
    authResponse.actions.push(...paymentUtils.setCustomFieldToNull({ isv_tokenVerificationContext }));
  }
  if (customFields?.isv_tokenCaptureContextSignature) {
    authResponse.actions.push(...paymentUtils.setCustomFieldToNull({ isv_tokenCaptureContextSignature }));
  }
  if (customFields?.isv_clientLibrary) {
    authResponse.actions.push(...paymentUtils.setCustomFieldToNull({ isv_clientLibrary }));
  }
  if (customFields?.isv_clientLibraryIntegrity) {
    authResponse.actions.push(...paymentUtils.setCustomFieldToNull({ isv_clientLibraryIntegrity }));
  }
  return authResponse;
};

const handlePayerAuthReversal = async (updatePaymentObj: Payment, paymentResponse: PtsV2PaymentsPost201Response, updateActions: ActionResponseType): Promise<ActionResponseType> => {
  let cartObj;
  if (updatePaymentObj && updateActions && paymentResponse && Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode && Constants.API_STATUS_AUTHORIZED_RISK_DECLINED === paymentResponse.status) {
    cartObj = await paymentUtils.getCartObject(updatePaymentObj);
    if (cartObj && cartObj?.results && 0 < cartObj?.results?.length) {
      updateActions = await syncHelper.checkAuthReversalTriggered(updatePaymentObj, cartObj?.results[0], paymentResponse, updateActions);
    }
  }
  return updateActions;
};
/**
 * Handles charge operation for order management.
 *
 * @param {Payment} updatePaymentObj - The updated payment object.
 * @param {string} orderNo - The order number.
 * @param {Partial<PaymentTransactionType>} updateTransactions - The updated payment transactions.
 * @returns {Promise<any>} - The order response.
 */
const handleOrderManagementForCharge = async (updatePaymentObj: Payment, orderNo: string, updateTransactions: Partial<PaymentTransactionType>) => {
  let authId = '';
  let orderResponse;
  authId = paymentUtils.getInteractionId(updatePaymentObj);
  if (authId) {
    orderResponse = await paymentCapture.getCaptureResponse(updatePaymentObj, updateTransactions, authId, orderNo);
  }
  return orderResponse;
};

/**
 * Handles different transaction types based on type and state.
 *
 * @async
 * @param {string | undefined} type - The type of transaction.
 * @param {string | undefined} state - The state of the transaction.
 * @param {string} orderNo - The order number associated with the transaction.
 * @param {Payment} updatePaymentObj - The payment update object.
 * @param {Partial<PaymentTransactionType>} updateTransactions - The transaction update object.
 * @param {Cart} cartObj - The cart object associated with the transaction.
 * @returns {Promise<any | null>} The result of the transaction handling, or null if not applicable.
 */
const isInitialState = (state: string | undefined): boolean => Constants.CT_TRANSACTION_STATE_INITIAL === state;

const handleTransactionType = async (type: string | undefined, state: string | undefined, orderNo: string, updatePaymentObj: Payment, updateTransactions: Partial<PaymentTransactionType>, cartObj: Cart) => {
  if (!isInitialState(state)) {
    return null;
  }
  switch (type) {
    case Constants.CT_TRANSACTION_TYPE_CHARGE:
      return await handleOrderManagementForCharge(updatePaymentObj, orderNo, updateTransactions);
    case Constants.CT_TRANSACTION_TYPE_REFUND:
      return await orderManagementHelper.getRefundResponse(updatePaymentObj, updateTransactions, orderNo);
    case Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION:
      return await handleOrderManagementAuthReversal(updatePaymentObj, cartObj);
    default:
      return null;
  }
};



/**
 * Handles authorization reversal operation for order management.
 *
 * @param {Payment} updatePaymentObj - The updated payment object.
 * @param {any} cartObj - The cart object.
 * @returns {Promise<any>} - The order response.
 */
const handleOrderManagementAuthReversal = async (updatePaymentObj: Payment, cartObj: Cart): Promise<any> => {
  let authReversalId = '';
  authReversalId = paymentUtils.getInteractionId(updatePaymentObj);
  let orderResponse;
  if (authReversalId) {
    orderResponse = await paymentAuthReversal.getAuthReversalResponse(updatePaymentObj, cartObj, authReversalId);
  }
  return orderResponse;
};

/**
 * Handles order management operations.
 *
 * @param {string} paymentId - The ID of the payment.
 * @param {Payment} updatePaymentObj - The updated payment object.
 * @param {Partial<PaymentTransactionType>} updateTransactions - The updated transaction object.
 * @returns {Promise<ActionResponseType>} - The action response.
 */
const handleOrderManagement = async (paymentId: string, updatePaymentObj: Payment, updateTransactions: Partial<PaymentTransactionType>): Promise<ActionResponseType> => {
  let isError = false;
  let serviceResponse = paymentUtils.getEmptyResponse();
  let orderResponse;
  let cartObj;
  let orderNo;
  let { state, type } = updateTransactions || {};
  if (updatePaymentObj && updateTransactions) {
    cartObj = await paymentUtils.getCartObject(updatePaymentObj);
    if (cartObj?.results[0]?.id) {
      let { results } = cartObj;
      orderNo = await paymentUtils.getOrderId(results[0].id, paymentId);
    } else {
      orderNo = await paymentUtils.getOrderId('', paymentId);
    }
    orderResponse = await handleTransactionType(type, state, orderNo, updatePaymentObj, updateTransactions, cartObj.results[0]);
    if (orderResponse && orderResponse?.httpCode) {
      serviceResponse = orderManagementHelper.getOMServiceResponse(orderResponse, updateTransactions, '', 0);
    } else if (orderResponse && orderResponse?.actions?.length) {
      serviceResponse = orderResponse;
    } else {
      isError = true;
    }
    if (isError) {
      serviceResponse = paymentUtils.invalidInputResponse();
    }
  }
  return serviceResponse;
};
/**
 * Finds the address matching the given address id. Mirrors the original forEach-based lookup,
 * where the last matching address in the list wins if there happen to be duplicate ids.
 */
const findAddressByIdLastMatch = (addresses: readonly _BaseAddress[], addressId: string | undefined): _BaseAddress | null => {
  let matchedAddress: _BaseAddress | null = null;
  addresses.forEach((address) => {
    if (addressId === address.id) {
      matchedAddress = address;
    }
  });
  return matchedAddress;
};

/**
 * Finds the index of the stored token matching the given payment token. Mirrors the original
 * forEach-based lookup, where the last matching index wins if there happen to be duplicate tokens.
 */
const findTokenIndexByPaymentTokenLastMatch = (existingTokens: string[], paymentToken: string | undefined): number => {
  let matchedIndex = -1;
  existingTokens.forEach((token, tokenIndex) => {
    const parsedToken = JSON.parse(token);
    if (parsedToken.paymentToken === paymentToken) {
      matchedIndex = tokenIndex;
    }
  });
  return matchedIndex;
};

/**
 * Applies a partial field update to the stored token at the given index, in place.
 */
const applyCardTokenPatch = (existingTokens: string[], tokenIndex: number, patch: Partial<CustomerTokensType>): void => {
  const parsedToken = { ...JSON.parse(existingTokens[tokenIndex]), ...patch };
  existingTokens[tokenIndex] = JSON.stringify(parsedToken);
};

/**
 * Handles the update of card details.
 *
 * @param {Partial<CustomerTokensType>} tokens - The tokens associated with the customer.
 * @param {string} customerId - The ID of the customer.
 * @param {CustomerType} customerObj - The customer object.
 * @returns {Promise<ActionResponseType>} - The action response.
 */
const handleUpdateCard = async (tokens: Partial<CustomerTokensType>, customerId: string, customerObj: Customer): Promise<ActionResponseType> => {
  let returnResponse: ActionResponseType = paymentUtils.getEmptyResponse();
  if (!customerId) {
    return returnResponse;
  }

  const customerInfo = await commercetoolsApi.getCustomer(customerId);
  const customerAddresses = customerInfo?.addresses || customerObj?.addresses || [];
  const addressData: _BaseAddress | null = customerAddresses.length ? findAddressByIdLastMatch(customerAddresses, tokens.addressId) : null;
  const { isv_cardNewExpiryMonth, isv_cardNewExpiryYear, isv_failedTokens } = customerObj?.custom?.fields || {};
  const { isv_tokens } = customerInfo?.custom?.fields || {};
  if (isv_tokens?.length) {
    returnResponse = paymentActions.getUpdateTokenActions(isv_tokens as string[], isv_failedTokens, true, customerObj, null);
  }
  if (isv_cardNewExpiryMonth && isv_cardNewExpiryYear) {
    const updateServiceResponse: any = await updateToken.getUpdateTokenResponse(tokens, isv_cardNewExpiryMonth, isv_cardNewExpiryYear, addressData as AddressType | null);
    const isValidUpdateResponse = paymentValidator.isValidUpdateServiceResponse(updateServiceResponse);
    if (isValidUpdateResponse && isv_tokens?.length) {
      const existingTokens = isv_tokens as string[];
      const finalTokenIndex = findTokenIndexByPaymentTokenLastMatch(existingTokens, tokens.paymentToken);
      if (-1 < finalTokenIndex) {
        applyCardTokenPatch(existingTokens, finalTokenIndex, {
          cardExpiryMonth: updateServiceResponse?.card.expirationMonth,
          cardExpiryYear: updateServiceResponse?.card.expirationYear,
          addressId: tokens.addressId,
        });
        returnResponse = paymentActions.getUpdateTokenActions(existingTokens, isv_failedTokens, false, customerObj, null);
      }
    }
  } else if (tokens.addressId && isv_tokens?.length) {
    const existingTokens = isv_tokens as string[];
    const finalTokenIndex = findTokenIndexByPaymentTokenLastMatch(existingTokens, tokens.paymentToken);
    if (-1 < finalTokenIndex) {
      applyCardTokenPatch(existingTokens, finalTokenIndex, { addressId: tokens.addressId });
      returnResponse = paymentActions.getUpdateTokenActions(existingTokens, isv_failedTokens, false, customerObj, null);
    }
  }
  return returnResponse;
};

/**
 * Handles the deletion of a card.
 *
 * @param {Partial<CustomerTokensType>} updateCustomerObj - The tokens associated with the customer.
 * @param {string} customerId - The ID of the customer.
 * @returns {Promise<ActionResponseType>} - The action response.
 */
const handleCardDeletion = async (updateCustomerObj: Partial<CustomerTokensType>, customerId: string): Promise<ActionResponseType> => {
  let customerTokenHandlerResponse: ActionResponseType = paymentUtils.getEmptyResponse();
  let deletedTokenIndex = -1;
  if (customerId && updateCustomerObj) {
    const customerObj = await commercetoolsApi.getCustomer(customerId);
    const tokenManagementResponse = await deleteToken.deleteCustomerToken(updateCustomerObj);
    if (tokenManagementResponse && Constants.HTTP_SUCCESS_NO_CONTENT_STATUS_CODE === tokenManagementResponse.httpCode) {
      if (customerObj?.custom?.fields?.isv_tokens?.length) {
        const existingTokensMap = customerObj.custom.fields.isv_tokens.map((item: any) => item);
        existingTokensMap.forEach((token: any, tokenIndex: number) => {
          const parsedToken = JSON.parse(token);
          if (tokenManagementResponse.deletedToken === parsedToken.paymentToken) {
            deletedTokenIndex = tokenIndex;
          }
        });
        if (-1 < deletedTokenIndex) {
          existingTokensMap.splice(deletedTokenIndex, 1);
          customerTokenHandlerResponse = paymentActions.getUpdateTokenActions(existingTokensMap, customerObj?.custom?.fields?.isv_failedTokens, true, customerObj, null);
          const isv_tokenAction = '';
          customerTokenHandlerResponse.actions.push(...paymentUtils.setCustomFieldToNull({ isv_tokenAction }));
        }
      }
    }
  }
  return customerTokenHandlerResponse;
};

/**
 * Handles the addition of a card.
 *
 * @param {string} customerId - The ID of the customer.
 * @param {readonly AddressType[]} addressObj - The array of addresses associated with the customer.
 * @param {Customer} customerObj - The customer object.
 * @param {string} selectedAddressId - The ID of the selected address (optional, for MyAccounts save card).
 * @returns {Promise<ActionResponseType>} - The action response.
 */

/**
 * Handles the decision sync process.
 *
 * @returns {Promise<ReportResponseType>} - The report response.
 */
const handleReport = async (): Promise<ReportResponseType> => {
  let isDecisionSynced = false;
  let isConversionPresent = false;
  const { PAYMENT_GATEWAY_DECISION_SYNC, PAYMENT_GATEWAY_DECISION_SYNC_MULTI_MID } = process.env;
  const decisionSyncResponse: ReportResponseType = {
    message: '',
    error: '',
  };
  let conversionDetails;
  let conversionDetailsData;
  if (paymentUtils.toBoolean(PAYMENT_GATEWAY_DECISION_SYNC)) {
    try {
      const decisionSyncArray = multiMid.getAllMidDetails();
      decisionSyncArray.push({
        merchantId: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
        merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
        merchantSecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
      });
      if (PAYMENT_GATEWAY_DECISION_SYNC_MULTI_MID) {
        const decisionSyncMids = PAYMENT_GATEWAY_DECISION_SYNC_MULTI_MID;
        const decisionMidsArray = decisionSyncMids.split(Constants.REGEX_COMMA);
        if (decisionMidsArray && 0 < decisionMidsArray.length) {
          for (let decisionElement of decisionSyncArray) {
            if (decisionElement.merchantId && decisionMidsArray.includes(decisionElement.merchantId)) {
              conversionDetails = await conversion.getConversionDetails(decisionElement);
              if (conversionDetails && Constants.HTTP_OK_STATUS_CODE === conversionDetails.status) {
                conversionDetailsData = conversionDetails?.data;
                isConversionPresent = await syncHelper.updateDecisionSyncService(conversionDetailsData);
              }
            }
          }
          if (isConversionPresent) {
            isDecisionSynced = true;
          }
        }
        isDecisionSynced ? (decisionSyncResponse.message = CustomMessages.SUCCESS_MSG_DECISION_SYNC_SERVICE) : (decisionSyncResponse.error = CustomMessages.ERROR_MSG_NO_SYNC_DETAILS);
      } else {
        decisionSyncResponse.error = CustomMessages.ERROR_MSG_ENABLE_DECISION_SYNC_MIDS;
      }
    } catch (exception) {
      decisionSyncResponse.error = CustomMessages.ERROR_MSG_SYNC_PAYMENT_DETAILS;
    }
  } else {
    decisionSyncResponse.error = CustomMessages.ERROR_MSG_ENABLE_DECISION_SYNC;
  }
  return decisionSyncResponse;
};

/**
 * Handles the synchronization process.
 *
 * @returns {Promise<{ message: string, error: string }>} - The sync response.
 */
const handleSync = async (): Promise<{ message: string; error: string }> => {
  let isSyncPresent = false;
  const { PAYMENT_GATEWAY_RUN_SYNC } = process.env;
  const syncResponse = {
    message: '',
    error: '',
  };
  const midCredentials = {
    merchantId: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
    merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
    merchantSecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
  };
  let multiMidArray;
  let paymentDetails: Payment | null;
  let createSearchResponse;
  let transactionSummaries;
  let updateSyncResponse;
  try {
    if (paymentUtils.toBoolean(PAYMENT_GATEWAY_RUN_SYNC)) {
      multiMidArray = multiMid.getAllMidDetails();
      multiMidArray.push(midCredentials);
      for (let midElement of multiMidArray) {
        createSearchResponse = await createSearchRequest.getTransactionSearchResponse(Constants.STRING_SYNC_QUERY, 50, Constants.STRING_SYNC_SORT, midElement);
        if (createSearchResponse && Constants.HTTP_SUCCESS_STATUS_CODE === createSearchResponse?.httpCode && createSearchResponse?.data && createSearchResponse.data?._embedded && createSearchResponse.data._embedded?.transactionSummaries) {
          transactionSummaries = createSearchResponse.data._embedded.transactionSummaries;
          for (let element of transactionSummaries) {
            try {
              paymentDetails = await commercetoolsApi.retrievePaymentByClientReferenceCode(element.clientReferenceInformation.code);
              if (paymentDetails && Constants.STRING_TRANSACTIONS in paymentDetails) {
                updateSyncResponse = await syncHelper.retrieveSyncResponse(paymentDetails, element);
                if (updateSyncResponse) {
                  isSyncPresent = true;
                }
              }
            } catch (elementError) { }
          }
        } else {
        }
      }
      isSyncPresent ? (syncResponse.message = CustomMessages.SUCCESS_MSG_SYNC_SERVICE) : (syncResponse.error = CustomMessages.ERROR_MSG_NO_SYNC_DETAILS);
    } else {
      syncResponse.error = CustomMessages.ERROR_MSG_ENABLE_SYNC;
    }
  } catch (exception) {
    syncResponse.error = CustomMessages.ERROR_MSG_SYNC_PAYMENT_DETAILS;
  }
  return syncResponse;
};

/**
 * Handles the network token update process.
 *
 * @param {string} customerTokenId - The customer token ID.
 * @param {InstrumentIdResponse} retrieveTokenDetailsResponse - The response containing token details.
 * @returns {Promise<any>} - The response of the token update process.
 */
const handleNetworkToken = async (customerTokenId: string, retrieveTokenDetailsResponse: InstrumentIdResponse): Promise<any> => {
  let response = null;
  let parsedTokens: any = [];
  let stringifiedTokens: any = [];
  if (Constants.HTTP_OK_STATUS_CODE === retrieveTokenDetailsResponse?.httpCode) {
    const fetchedCustomers = await commercetoolsApi.retrieveCustomerByCustomField('isv_customerId', customerTokenId);
    const customerObj = fetchedCustomers?.results[0];
    if (customerObj && customerObj?.custom && customerObj.custom?.fields) {
      const existingTokens = customerObj.custom.fields.isv_tokens;
      parsedTokens = await existingTokens.map((token: any) => {
        return JSON.parse(token);
      });
      const tokenToUpdateIndex = parsedTokens.findIndex((card: any) => card.instrumentIdentifier === retrieveTokenDetailsResponse.instrumentIdentifier);
      if (-1 < tokenToUpdateIndex) {
        parsedTokens[tokenToUpdateIndex].cardExpiryMonth = retrieveTokenDetailsResponse.expirationMonth;
        parsedTokens[tokenToUpdateIndex].cardExpiryYear = retrieveTokenDetailsResponse.expirationYear;
        parsedTokens[tokenToUpdateIndex].cardNumber = parsedTokens[tokenToUpdateIndex].cardNumber.slice(0, -4) + retrieveTokenDetailsResponse.cardSuffix;
        stringifiedTokens = parsedTokens.map((token: any) => {
          return JSON.stringify(token);
        });
        response = await commercetoolsApi.updateCustomerToken(stringifiedTokens, customerObj, null, null);
      }
    }
  }
  return response;
};

export default {
  handleSetTokenToNull,
  handlePayerAuthReversal,
  handleOrderManagementForCharge,
  handleTransactionType,
  handleOrderManagementAuthReversal,
  handleOrderManagement,
  handleUpdateCard,
  handleCardDeletion,
  handleReport,
  handleSync,
  handleNetworkToken,
  isInitialState,
  findAddressByIdLastMatch,
  findTokenIndexByPaymentTokenLastMatch,
  applyCardTokenPatch,
};
