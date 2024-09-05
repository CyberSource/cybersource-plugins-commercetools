import fs from 'fs';
import https from 'https';

import axios from 'axios';
import { PtsV2PaymentsPost201Response } from 'cybersource-rest-client';

import { Constants } from '../constants/constants';
import { CustomMessages } from '../constants/customMessages';
import { FunctionConstant } from '../constants/functionConstant';
import addTokenService from '../service/payment/AddTokenService';
import createSearchRequest from '../service/payment/CreateTransactionSearchRequest';
import conversion from '../service/payment/DecisionSyncService';
import deleteToken from '../service/payment/DeleteTokenService';
import updateToken from '../service/payment/UpdateTokenService';
import { ActionResponseType, AddressType, CustomerTokensType, CustomerType, CustomTokenType, InstrumentIdResponse, PaymentCustomFieldsType, PaymentTransactionType, PaymentType, ReportResponseType } from '../types/Types';
import multiMid from '../utils/config/MultiMid';
import syncHelper from '../utils/helpers/SyncHelper';

import paymentAuthReversal from './../service/payment/PaymentAuthorizationReversal';
import paymentCapture from './../service/payment/PaymentCaptureService';
import paymentService from './../utils/PaymentService';
import paymentUtils from './../utils/PaymentUtils';
import commercetoolsApi from './../utils/api/CommercetoolsApi';
import paymentActions from './PaymentActions';
import paymentValidator from './PaymentValidator';
import tokenHelper from './helpers/TokenHelper';
/**
 * Handles the authorization process for a payment.
 * 
 * @param {PaymentType} updatePaymentObj - The updated payment object.
 * @param {PaymentTransactionType} updateTransactions - The updated transaction object.
 * @returns {Promise<ActionResponseType>} - The authorization response.
 */
const handleAuthorization = async (updatePaymentObj: PaymentType, updateTransactions: Partial<PaymentTransactionType>): Promise<ActionResponseType> => {
  let authResponse: ActionResponseType = paymentUtils.getEmptyResponse();
  let cardTokens: CustomTokenType = {
    customerTokenId: '',
    paymentInstrumentId: '',
  };
  let customerInfo: Partial<CustomerType> | null = null;
  let paymentInstrumentToken = '';
  let isError = false;
  let cartObj;
  let paymentId = updatePaymentObj?.id || '';
  try {
    if (updatePaymentObj && updateTransactions) {
      const { custom, customer, id, paymentMethodInfo } = updatePaymentObj;
      cartObj = await paymentUtils.getCartObject(updatePaymentObj);
      if (cartObj && cartObj?.count && cartObj?.results) {
        if (customer?.id) {
          customerInfo = await commercetoolsApi.getCustomer(customer.id);
          paymentInstrumentToken = custom?.fields.isv_savedToken ? custom?.fields.isv_savedToken : '';
          cardTokens = await paymentService.getCardTokens(customerInfo, paymentInstrumentToken);
        }
        let { results } = cartObj;
        const orderNo = await paymentUtils.getOrderId(results[0]?.id, id);
        const paymentMethod = paymentMethodInfo.method;
        const serviceResponse = await handlePaymentAuth(paymentMethod, updatePaymentObj, customerInfo, results[0], updateTransactions, cardTokens, orderNo);
        const authresponse = serviceResponse?.authResponse;
        if (authresponse) {
          authResponse = serviceResponse.authResponse;
          isError = serviceResponse.isError;
        }
        const paymentResponse = serviceResponse.paymentResponse;
        if (Constants.CREDIT_CARD === paymentMethod) {
          authResponse = await paymentService.setCustomerTokenData(cardTokens, paymentResponse, authResponse, isError, updatePaymentObj, results[0]);
        }
        const customFields = updatePaymentObj?.custom?.fields;
        authResponse = await handleSetTokenToNull(customFields, authResponse, paymentMethod);
        if (paymentResponse && Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode && Constants.API_STATUS_AUTHORIZED_RISK_DECLINED === paymentResponse.status) {
          authResponse = await paymentService.checkAuthReversalTriggered(updatePaymentObj, results[0], paymentResponse, authResponse);
        }
      } else {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_AUTHORIZATION, Constants.LOG_INFO, paymentId, CustomMessages.ERROR_MSG_EMPTY_CART);
        isError = true;
      }
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_AUTHORIZATION, Constants.LOG_INFO, paymentId, CustomMessages.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
      isError = true;
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_HANDLE_AUTHORIZATION, CustomMessages.EXCEPTION_MSG_AUTHORIZING_PAYMENT, exception, paymentId, 'PaymentId : ', '');
    isError = true;
  }
  if (isError) {
    authResponse = paymentUtils.invalidInputResponse();
  }
  return authResponse;
};
/**
 * Handles setting certain custom fields to null.
 * 
 * @param {PaymentCustomFieldsType | undefined} customFields - The custom fields of the payment.
 * @param {ActionResponseType} authResponse - The authorization response.
 * @param {string} paymentMethod - The payment method.
 * @returns {Promise<ActionResponseType>} - The updated authorization response.
 */
const handleSetTokenToNull = async (customFields: Partial<PaymentCustomFieldsType> | undefined, authResponse: ActionResponseType, paymentMethod: string): Promise<any> => {
  const isv_tokenVerificationContext = '';
  const isv_tokenCaptureContextSignature = '';
  const isv_securityCode = 0;
  if ((customFields?.isv_savedToken && customFields?.isv_tokenVerificationContext) || (Constants.CREDIT_CARD !== paymentMethod && Constants.CC_PAYER_AUTHENTICATION !== paymentMethod && customFields?.isv_tokenVerificationContext)) {
    authResponse.actions.push(...paymentUtils.setCustomFieldToNull({ isv_tokenVerificationContext }));
  }
  if (customFields?.isv_tokenCaptureContextSignature) {
    authResponse.actions.push(...paymentUtils.setCustomFieldToNull({ isv_tokenCaptureContextSignature }));
  }
  if (customFields?.isv_securityCode) {
    authResponse.actions.push(...paymentUtils.setCustomFieldToNull({ isv_securityCode }));
  }
  return authResponse;
};
/**
 * Handles authorization for different payment methods.
 * 
 * @param {string} paymentMethod - The payment method.
 * @param {PaymentType} updatePaymentObj - The updated payment object.
 * @param {CustomerType | null} customerInfo - Information about the customer.
 * @param {any} cartInfo - Information about the cart.
 * @param {PaymentTransactionType} updateTransactions - The updated transaction object.
 * @param {CustomTokenType} cardTokens - Card tokens associated with the customer.
 * @param {string} orderNo - The order number.
 * @returns {Promise<{ isError: boolean; paymentResponse: any; authResponse: ActionResponseType }>} - The service response.
 */
const handlePaymentAuth = async (paymentMethod: string, updatePaymentObj: PaymentType, customerInfo: Partial<CustomerType> | null, cartInfo: any, updateTransactions: Partial<PaymentTransactionType>, cardTokens: CustomTokenType, orderNo: string) => {
  let serviceResponse: { isError: boolean; paymentResponse: any; authResponse: ActionResponseType };
  let paymentId = updatePaymentObj?.id || '';
  switch (paymentMethod) {
    case Constants.CREDIT_CARD: {
      serviceResponse = await paymentService.getPaymentResponse(updatePaymentObj, customerInfo, cartInfo, updateTransactions, cardTokens, orderNo);
      break;
    }
    case Constants.CLICK_TO_PAY: {
      serviceResponse = await paymentService.getClickToPayResponse(updatePaymentObj, cartInfo, updateTransactions, cardTokens, orderNo);
      break;
    }
    case Constants.GOOGLE_PAY: {
      serviceResponse = await paymentService.getGooglePayResponse(updatePaymentObj, cartInfo, updateTransactions, cardTokens, orderNo);
      break;
    }
    case Constants.APPLE_PAY: {
      serviceResponse = await paymentService.getPaymentResponse(updatePaymentObj, customerInfo, cartInfo, updateTransactions, cardTokens, orderNo);
      break;
    }
    case Constants.ECHECK: {
      serviceResponse = await paymentService.getPaymentResponse(updatePaymentObj, customerInfo, cartInfo, updateTransactions, cardTokens, orderNo);
      break;
    }
    default: {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_PAYMENT_AUTH, Constants.LOG_INFO, paymentId, CustomMessages.ERROR_MSG_NO_PAYMENT_METHODS);
      return { paymentResponse: null, authResponse: null, isError: true };
    }
  }
  return serviceResponse;
};
/**
 * Handles payer authentication reversal.
 * 
 * @param {PaymentType} updatePaymentObj - The updated payment object.
 * @param {any} paymentResponse - The payment response.
 * @param {ActionResponseType} updateActions - The updated actions response.
 * @returns {Promise<ActionResponseType>} - The updated actions response.
 */
const handlePayerAuthReversal = async (updatePaymentObj: PaymentType, paymentResponse: PtsV2PaymentsPost201Response, updateActions: ActionResponseType): Promise<ActionResponseType> => {
  let cartObj;
  let paymentId = updatePaymentObj?.id || '';
  if (updatePaymentObj && updateActions && paymentResponse && Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode && Constants.API_STATUS_AUTHORIZED_RISK_DECLINED === paymentResponse.status) {
    cartObj = await paymentUtils.getCartObject(updatePaymentObj);
    if (cartObj && cartObj?.results && 0 < cartObj?.results?.length) {
      updateActions = await paymentService.checkAuthReversalTriggered(updatePaymentObj, cartObj?.results[0], paymentResponse, updateActions);
    }
  } else {
    paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_PAYER_AUTH_REVERSAL, Constants.LOG_INFO, 'PaymentId : ' + paymentId, CustomMessages.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
  }
  return updateActions;
};
/**
 * Handles Apple Pay session.
 * 
 * @param {PaymentCustomFieldsType} fields - The payment custom fields.
 * @returns {Promise<ActionResponseType>} - The service response.
 */
const handleApplePaySession = async (fields: Partial<PaymentCustomFieldsType>): Promise<ActionResponseType> => {
  let serviceResponse: ActionResponseType = paymentUtils.getEmptyResponse();
  let httpsAgent: https.Agent = new https.Agent({
    rejectUnauthorized: true,
    cert: '',
    key: '',
  });
  const { PAYMENT_GATEWAY_APPLE_PAY_CERTIFICATE_PATH, PAYMENT_GATEWAY_APPLE_PAY_KEY_PATH, PAYMENT_GATEWAY_APPLE_PAY_DOMAIN_NAME, PAYMENT_GATEWAY_APPLE_PAY_MERCHANT_ID, PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT } = process.env || {};
  try {
    if (PAYMENT_GATEWAY_APPLE_PAY_CERTIFICATE_PATH && PAYMENT_GATEWAY_APPLE_PAY_KEY_PATH && PAYMENT_GATEWAY_APPLE_PAY_DOMAIN_NAME && PAYMENT_GATEWAY_APPLE_PAY_MERCHANT_ID) {
      const certificateString = PAYMENT_GATEWAY_APPLE_PAY_CERTIFICATE_PATH;
      const keyString = PAYMENT_GATEWAY_APPLE_PAY_KEY_PATH;
      if (Constants.STRING_AWS === PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT || Constants.STRING_AZURE === PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT) {
        const certData = await paymentUtils.getCertificatesData(certificateString);
        const keyData = await paymentUtils.getCertificatesData(keyString);
        if (Constants.HTTP_OK_STATUS_CODE === certData?.status && certData.data && Constants.HTTP_OK_STATUS_CODE === keyData.status && keyData.data) {
          httpsAgent = new https.Agent({ rejectUnauthorized: true, cert: certData.data, key: keyData.data });
        } else {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_APPLE_PAY_SESSION, Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_ACCESSING_CERTIFICATES);
        }
      } else {
        httpsAgent = new https.Agent({ rejectUnauthorized: true, cert: fs.readFileSync(certificateString), key: fs.readFileSync(keyString) });
      }
      const domainName = PAYMENT_GATEWAY_APPLE_PAY_DOMAIN_NAME;
      const body = {
        merchantIdentifier: PAYMENT_GATEWAY_APPLE_PAY_MERCHANT_ID,
        domainName: domainName,
        displayName: fields.isv_applePayDisplayName,
        initiative: Constants.PAYMENT_GATEWAY_APPLE_PAY_INITIATIVE,
        initiativeContext: domainName,
      };
      const applePaySession = await axios.post(fields.isv_applePayValidationUrl, body, {
        httpsAgent,
      });
      const isv_applePaySessionData = JSON.stringify(applePaySession.data);
      serviceResponse.actions = paymentUtils.setCustomFieldMapper({ isv_applePaySessionData });
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_APPLE_PAY_SESSION, Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_APPLE_PAY_CERTIFICATES);
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_HANDLE_APPLE_PAY_SESSION, CustomMessages.EXCEPTION_MSG_SERVICE_PROCESS, exception, '', '', '');
    serviceResponse = paymentUtils.getEmptyResponse();
  }
  return serviceResponse;
};
/**
 * Handles charge operation for order management.
 * 
 * @param {PaymentType} updatePaymentObj - The updated payment object.
 * @param {string} orderNo - The order number.
 * @param {PaymentTransactionType} updateTransactions - The updated payment transactions.
 * @returns {Promise<any>} - The order response.
 */
const handleOrderManagementForCharge = async (updatePaymentObj: PaymentType, orderNo: string, updateTransactions: Partial<PaymentTransactionType>) => {
  let authId = '';
  let orderResponse;
  let paymentId = updatePaymentObj?.id || '';
  authId = paymentUtils.getInteractionId(updatePaymentObj);
  try {
    authId
      ? (orderResponse = await paymentCapture.getCaptureResponse(updatePaymentObj, updateTransactions, authId, orderNo))
      : paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_ORDER_MANAGEMENT_FOR_CHARGE, Constants.LOG_INFO, 'PaymentId : ' + paymentId, CustomMessages.ERROR_MSG_CAPTURE_FAILURE);
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_HANDLE_ORDER_MANAGEMENT_FOR_CHARGE, '', exception, paymentId, 'PaymentId : ', '');
  }
  return orderResponse;
};

const handleTransactionType = async (type: string | undefined, state: string | undefined, orderNo: string, updatePaymentObj: PaymentType, updateTransactions: Partial<PaymentTransactionType>, cartObj: any) => {
  switch (type) {
    case Constants.CT_TRANSACTION_TYPE_CHARGE:
      return Constants.CT_TRANSACTION_STATE_INITIAL === state ? await handleOrderManagementForCharge(updatePaymentObj, orderNo, updateTransactions) : null;
    case Constants.CT_TRANSACTION_TYPE_REFUND:
      return Constants.CT_TRANSACTION_STATE_INITIAL === state ? await paymentService.getRefundResponse(updatePaymentObj, updateTransactions, orderNo) : null;
    case Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION:
      return Constants.CT_TRANSACTION_STATE_INITIAL === state ? await handleOrderManagementAuthReversal(updatePaymentObj, cartObj.results[0]) : null;
    default:
      return null;
  }
}
/**
 * Handles authorization reversal operation for order management.
 * 
 * @param {PaymentType} updatePaymentObj - The updated payment object.
 * @param {any} cartObj - The cart object.
 * @returns {Promise<any>} - The order response.
 */
const handleOrderManagementAuthReversal = async (updatePaymentObj: PaymentType, cartObj: any): Promise<any> => {
  let authReversalId = '';
  let orderResponse;
  let paymentId = updatePaymentObj?.id || '';
  authReversalId = paymentUtils.getInteractionId(updatePaymentObj);
  try {
    authReversalId
      ? (orderResponse = await paymentAuthReversal.getAuthReversalResponse(updatePaymentObj, cartObj, authReversalId))
      : paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_ORDER_MANAGEMENT_AUTH_REVERSAL, Constants.LOG_INFO, 'PaymentId : ' + paymentId, CustomMessages.ERROR_MSG_REVERSAL_FAILURE);
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_HANDLE_ORDER_MANAGEMENT_AUTH_REVERSAL, '', exception, paymentId, 'PaymentId : ', '');
  }
  return orderResponse;
};
/**
 * Handles order management operations.
 * 
 * @param {string} paymentId - The ID of the payment.
 * @param {PaymentType} updatePaymentObj - The updated payment object.
 * @param {PaymentTransactionType} updateTransactions - The updated transaction object.
 * @returns {Promise<ActionResponseType>} - The action response.
 */
const handleOrderManagement = async (paymentId: string, updatePaymentObj: PaymentType, updateTransactions: Partial<PaymentTransactionType>): Promise<ActionResponseType> => {
  let orderResponse;
  let serviceResponse = paymentUtils.getEmptyResponse();
  let isError = false;
  let cartObj;
  try {
    if (updatePaymentObj && updateTransactions) {
      cartObj = await paymentUtils.getCartObject(updatePaymentObj);
      if (cartObj?.results[0]?.id) {
        let { results } = cartObj;
        let { state, type } = updateTransactions || {};
        const orderNo = await paymentUtils.getOrderId(results[0].id, paymentId);
        orderResponse = await handleTransactionType(type, state, orderNo, updatePaymentObj, updateTransactions, cartObj);
        if (orderResponse && orderResponse?.httpCode) {
          serviceResponse = paymentService.getOMServiceResponse(orderResponse, updateTransactions, '', 0);
        } else if (orderResponse && orderResponse?.actions?.length) {
          serviceResponse = orderResponse;
        } else {
          isError = true;
        }
      } else {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_ORDER_MANAGEMENT, Constants.LOG_INFO, 'PaymentId : ' + paymentId, CustomMessages.ERROR_MSG_SERVICE_PROCESS);
        isError = true;
      }
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_ORDER_MANAGEMENT, Constants.LOG_INFO, 'PaymentId : ' + paymentId, CustomMessages.ERROR_MSG_SERVICE_PROCESS);
      isError = true;
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_HANDLE_ORDER_MANAGEMENT, CustomMessages.EXCEPTION_MSG_SERVICE_PROCESS, exception, paymentId, 'PaymentId : ', '');
    isError = true;
  }
  if (isError) {
    serviceResponse = paymentUtils.invalidInputResponse();
  }
  return serviceResponse;
};
/**
 * Handles the update of card details.
 * 
 * @param {CustomerTokensType} tokens - The tokens associated with the customer.
 * @param {string} customerId - The ID of the customer.
 * @param {CustomerType} customerObj - The customer object.
 * @returns {Promise<ActionResponseType>} - The action response.
 */
const handleUpdateCard = async (tokens: Partial<CustomerTokensType>, customerId: string, customerObj: Partial<CustomerType>): Promise<ActionResponseType> => {
  let returnResponse: ActionResponseType = paymentUtils.getEmptyResponse();
  let parsedTokens: Partial<CustomerTokensType>;
  let addressData: AddressType | null = null;
  const isError = false;
  let finalTokenIndex = -1;
  let updateServiceResponse: any;
  try {
    if (customerId) {
      const customerInfo = await commercetoolsApi.getCustomer(customerId);
      if (customerObj?.addresses?.length) {
        customerObj.addresses.forEach((address) => {
          if (tokens.addressId === address.id) {
            addressData = address;
            return;
          }
        });
      }
      const { isv_cardNewExpiryMonth, isv_cardNewExpiryYear, isv_failedTokens } = customerObj?.custom?.fields || {};
      const { isv_tokens } = customerInfo?.custom?.fields || {};
      if (isv_cardNewExpiryMonth && isv_cardNewExpiryYear) {
        updateServiceResponse = await updateToken.getUpdateTokenResponse(tokens, isv_cardNewExpiryMonth, isv_cardNewExpiryYear, addressData);
        const isValidUpdateResponse = paymentValidator.isValidUpdateServiceResponse(updateServiceResponse);
        if (isValidUpdateResponse) {
          if (customerInfo?.custom?.fields?.isv_tokens?.length) {
            const existingTokens = isv_tokens as string[];
            existingTokens.forEach((token, tokenIndex) => {
              const newToken = JSON.parse(token);
              if (newToken.paymentToken === tokens.paymentToken) {
                finalTokenIndex = tokenIndex;
                return;
              }
            });
            if (-1 < finalTokenIndex) {
              parsedTokens = JSON.parse(existingTokens[finalTokenIndex]);
              parsedTokens.cardExpiryMonth = updateServiceResponse?.card.expirationMonth;
              parsedTokens.cardExpiryYear = updateServiceResponse?.card.expirationYear;
              parsedTokens.addressId = tokens.addressId;
              existingTokens[finalTokenIndex] = JSON.stringify(parsedTokens);
              returnResponse = paymentActions.getUpdateTokenActions(existingTokens, isv_failedTokens, isError, customerObj, null);
            } else {
              paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_UPDATE_CARD, Constants.LOG_INFO, CustomMessages.ERROR_MSG_NO_TOKENS_UPDATE, 'CustomerId : ' + customerId);
            }
          }
        }
      }
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_UPDATE_CARD, Constants.LOG_INFO, CustomMessages.ERROR_MSG_CUSTOMER_DETAILS, 'CustomerId : ' + customerId);
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_HANDLE_UPDATE_CARD, CustomMessages.EXCEPTION_MSG_CUSTOMER_UPDATE, exception, customerId, 'CustomerId : ', '');
  }
  return returnResponse;
};
/**
 * Handles the deletion of a card.
 * 
 * @param {CustomerTokensType} updateCustomerObj - The tokens associated with the customer.
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
        })
        if (-1 < deletedTokenIndex) {
          existingTokensMap.splice(deletedTokenIndex, 1);
          customerTokenHandlerResponse = paymentActions.getUpdateTokenActions(existingTokensMap, customerObj?.custom?.fields?.isv_failedTokens, true, customerObj, null);
          const isv_tokenAction = '';
          customerTokenHandlerResponse.actions.push(...paymentUtils.setCustomFieldToNull({ isv_tokenAction }));
        } else {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_CARD_DELETION, Constants.LOG_INFO, 'CustomerId : ' + customerId, CustomMessages.ERROR_MSG_NO_TOKENS_DELETE);
        }
      }
    }
  } else {
    paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_CARD_DELETION, Constants.LOG_INFO, 'CustomerId : ' + customerId, CustomMessages.ERROR_MSG_CUSTOMER_DETAILS);
  }
  return customerTokenHandlerResponse;
}
/**
 * Handles the addition of a card.
 * 
 * @param {string} customerId - The ID of the customer.
 * @param {readonly AddressType[]} addressObj - The array of addresses associated with the customer.
 * @param {CustomerType} customerObj - The customer object.
 * @returns {Promise<ActionResponseType>} - The action response.
 */
const handleCardAddition = async (customerId: string, addressObj: readonly AddressType[], customerObj: CustomerType) => {
  let customerTokenResponse: ActionResponseType = paymentUtils.getEmptyResponse();
  try {
    const tokenCreateResponse = await paymentService.evaluateTokenCreation(customerObj, null, FunctionConstant.FUNC_HANDLE_CARD_ADDITION);
    if (!tokenCreateResponse.isError) {
      const isSaveToken = tokenCreateResponse.isSaveToken;
      const customFields = customerObj?.custom?.fields || {};
      const { isv_addressId, isv_token } = customFields;
      if (!isSaveToken && isv_addressId && isv_token) {
        const billToFields = await tokenHelper.getBillToFields(customFields, addressObj, customerObj);
        if (!isSaveToken) {
          const cardTokens = await paymentService.getCardTokens(customerObj, '');
          const cardResponse = await addTokenService.getAddTokenResponse(customerId, customerObj, billToFields, cardTokens);
          const isValidResponse = paymentValidator.isValidCardResponse(cardResponse);
          customerTokenResponse = (isValidResponse) ? await tokenHelper.processValidCardResponse(customFields, cardTokens, cardResponse, customerObj, billToFields) : await tokenHelper.processInvalidCardResponse(customFields, customerObj, customerId);
        }
      }
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_CARD_ADDITION, Constants.LOG_INFO, 'CustomerId : ' + customerId, CustomMessages.ERROR_MSG_SERVICE_PROCESS);
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_HANDLE_CARD_ADDITION, CustomMessages.EXCEPTION_MSG_ADDING_A_CARD, exception, customerId, 'CustomerId : ', '');
  }
  return customerTokenResponse;
};
/**
 * Handles the decision sync process.
 * 
 * @returns {Promise<ReportResponseType>} - The report response.
 */
const handleReport = async (): Promise<ReportResponseType> => {
  let conversionDetails;
  let conversionDetailsData;
  let isDecisionSynced = false;
  let isConversionPresent = false;
  const decisionSyncResponse: ReportResponseType = {
    message: '',
    error: '',
  };
  const { PAYMENT_GATEWAY_DECISION_SYNC, PAYMENT_GATEWAY_DECISION_SYNC_MULTI_MID } = process.env;

  if (paymentUtils.toBoolean(PAYMENT_GATEWAY_DECISION_SYNC)) {
    try {
      const decisionSyncArray = await multiMid.getAllMidDetails();
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
            try {
              if (decisionElement.merchantId && decisionMidsArray.includes(decisionElement.merchantId)) {
                conversionDetails = await conversion.getConversionDetails(decisionElement);
                if (conversionDetails && Constants.HTTP_OK_STATUS_CODE === conversionDetails.status) {
                  conversionDetailsData = conversionDetails?.data;
                  isConversionPresent = await syncHelper.updateDecisionSyncService(conversionDetailsData);
                }
              }
            } catch (exception) {
              paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_HANDLE_REPORT, CustomMessages.EXCEPTION_MSG_CONVERSION_DETAILS, exception, '', '', '');
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
      paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_HANDLE_REPORT, CustomMessages.EXCEPTION_MSG_CONVERSION_DETAILS, exception, '', '', '');
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
const handleSync = async (): Promise<{ message: string, error: string }> => {
  let createSearchResponse;
  let transactionSummaries;
  let paymentDetails: PaymentType | null;
  let updateSyncResponse;
  let isSyncPresent = false;
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
  const { PAYMENT_GATEWAY_RUN_SYNC } = process.env;
  try {
    if (paymentUtils.toBoolean(PAYMENT_GATEWAY_RUN_SYNC)) {
      multiMidArray = await multiMid.getAllMidDetails();
      multiMidArray.push(midCredentials);
      for (let midElement of multiMidArray) {
        createSearchResponse = await createSearchRequest.getTransactionSearchResponse(Constants.STRING_SYNC_QUERY, Constants.STRING_SYNC_SORT, midElement);
        if (createSearchResponse && Constants.HTTP_SUCCESS_STATUS_CODE === createSearchResponse?.httpCode && createSearchResponse?.data && createSearchResponse.data?._embedded && createSearchResponse.data._embedded?.transactionSummaries) {
          transactionSummaries = createSearchResponse.data._embedded.transactionSummaries;
          for (let element of transactionSummaries) {
            try {
              paymentDetails = await commercetoolsApi.retrievePayment(element.clientReferenceInformation.code);
              if (paymentDetails && Constants.STRING_TRANSACTIONS in paymentDetails) {
                updateSyncResponse = await syncHelper.retrieveSyncResponse(paymentDetails, element);
                if (updateSyncResponse) {
                  isSyncPresent = true;
                }
              }
            } catch (exception) {
              paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_HANDLE_SYNC, CustomMessages.EXCEPTION_MSG_SYNC_DETAILS, exception, '', '', '');
            }
          }
        }
      }
      isSyncPresent ? (syncResponse.message = CustomMessages.SUCCESS_MSG_SYNC_SERVICE) : (syncResponse.error = CustomMessages.ERROR_MSG_NO_SYNC_DETAILS);
    } else {
      syncResponse.error = CustomMessages.ERROR_MSG_ENABLE_SYNC;
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_HANDLE_SYNC, CustomMessages.EXCEPTION_MSG_SYNC_DETAILS, exception, '', '', '');
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
  let parsedTokens = [];
  let response = null;
  let stringifiedTokens = [];
  let customerId = '';
  if (Constants.HTTP_OK_STATUS_CODE === retrieveTokenDetailsResponse?.httpCode) {
    const fetchedCustomers = await commercetoolsApi.retrieveCustomerByCustomField('isv_customerId', customerTokenId);
    const customerObj = fetchedCustomers?.results[0];
    if (customerObj && customerObj?.custom && customerObj.custom?.fields) {
      customerId = customerObj.id;
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
  } else {
    paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_NETWORK_TOKEN, Constants.LOG_INFO, 'CustomerId : ' + customerId, CustomMessages.ERROR_MSG_INSTRUMENT_ID_RESPONSE);
  }
  return response;
};

export default {
  handleAuthorization,
  handleSetTokenToNull,
  handlePaymentAuth,
  handlePayerAuthReversal,
  handleApplePaySession,
  handleOrderManagementForCharge,
  handleTransactionType,
  handleOrderManagementAuthReversal,
  handleOrderManagement,
  handleUpdateCard,
  handleCardDeletion,
  handleCardAddition,
  handleReport,
  handleSync,
  handleNetworkToken,
};
