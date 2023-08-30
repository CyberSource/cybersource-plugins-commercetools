import path from 'path';
import axios from 'axios';
import fs from 'fs';
import https from 'https';
import paymentService from './../utils/PaymentService';
import commercetoolsApi from './../utils/api/CommercetoolsApi';
import paymentCapture from './../service/payment/PaymentCaptureService';
import paymentAuthReversal from './../service/payment/PaymentAuthorizationReversal';
import deleteToken from '../service/payment/DeleteTokenService';
import conversion from '../service/payment/DecisionSyncService';
import updateToken from '../service/payment/UpdateTokenService';
import createSearchRequest from '../service/payment/CreateTransactionSearchRequest';
import addTokenService from '../service/payment/AddTokenService';
import { Constants } from '../constants';
import multiMid from './config/MultiMid';
import getTransientTokenData from '../service/payment/GetTransientTokenData';

const authorizationHandler = async (updatePaymentObj, updateTransactions) => {
  let paymentMethod: string;
  let authResponse: any;
  let paymentResponse: any;
  let cartObj: any;
  let serviceResponse: any;
  let exceptionData: any;
  let cardTokens: any;
  let customerInfo: any;
  let paymentInstrumentToken = null;
  let orderNo = null;
  let errorFlag = false;
  try {
    if (null != updatePaymentObj && null != updateTransactions) {
      cartObj = await commercetoolsApi.retrieveCartByPaymentId(updatePaymentObj.id);
      if (null == cartObj || (null != cartObj && Constants.VAL_ZERO == cartObj.count)) {
        if (Constants.STRING_CUSTOMER in updatePaymentObj && Constants.STRING_ID in updatePaymentObj.customer) {
          cartObj = await commercetoolsApi.retrieveCartByCustomerId(updatePaymentObj.customer.id);
        } else {
          cartObj = await commercetoolsApi.retrieveCartByAnonymousId(updatePaymentObj.anonymousId);
        }
      }
      if (null != cartObj && Constants.VAL_ZERO < cartObj.count) {
        if (Constants.STRING_CUSTOMER in updatePaymentObj && Constants.STRING_ID in updatePaymentObj.customer) {
          if (Constants.STRING_CUSTOM in updatePaymentObj && Constants.STRING_FIELDS in updatePaymentObj.custom && Constants.ISV_SAVED_TOKEN in updatePaymentObj.custom.fields && Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_savedToken) {
            paymentInstrumentToken = updatePaymentObj.custom.fields.isv_savedToken;
          }
          if (null != updatePaymentObj.customer.id) {
            customerInfo = await commercetoolsApi.getCustomer(updatePaymentObj.customer.id);
            cardTokens = await paymentService.getCardTokens(customerInfo, paymentInstrumentToken);
          }
        }
        orderNo = await paymentService.getOrderId(cartObj, updatePaymentObj.id);
        paymentMethod = updatePaymentObj.paymentMethodInfo.method;
        switch (paymentMethod) {
          case Constants.CREDIT_CARD: {
            serviceResponse = await paymentService.getCreditCardResponse(updatePaymentObj, customerInfo, cartObj.results[Constants.VAL_ZERO], updateTransactions, cardTokens, orderNo);
            paymentResponse = serviceResponse.paymentResponse;
            authResponse = serviceResponse.authResponse;
            errorFlag = serviceResponse.errorFlag;
            break;
          }
          case Constants.CLICK_TO_PAY: {
            serviceResponse = await paymentService.clickToPayResponse(updatePaymentObj, cartObj.results[Constants.VAL_ZERO], updateTransactions, cardTokens, orderNo);
            paymentResponse = serviceResponse.paymentResponse;
            authResponse = serviceResponse.authResponse;
            errorFlag = serviceResponse.errorFlag;
            break;
          }
          case Constants.GOOGLE_PAY: {
            serviceResponse = await paymentService.googlePayResponse(updatePaymentObj, cartObj.results[Constants.VAL_ZERO], updateTransactions, cardTokens, orderNo);
            paymentResponse = serviceResponse.paymentResponse;
            authResponse = serviceResponse.authResponse;
            errorFlag = serviceResponse.errorFlag;
            break;
          }
          case Constants.APPLE_PAY: {
            serviceResponse = await paymentService.getCreditCardResponse(updatePaymentObj, customerInfo, cartObj.results[Constants.VAL_ZERO], updateTransactions, cardTokens, orderNo);
            paymentResponse = serviceResponse.paymentResponse;
            authResponse = serviceResponse.authResponse;
            errorFlag = serviceResponse.errorFlag;
            break;
          }
          case Constants.ECHECK: {
            serviceResponse = await paymentService.getCreditCardResponse(updatePaymentObj, customerInfo, cartObj.results[Constants.VAL_ZERO], updateTransactions, cardTokens, orderNo);
            paymentResponse = serviceResponse.paymentResponse;
            authResponse = serviceResponse.authResponse;
            errorFlag = serviceResponse.errorFlag;
            break;
          }
          default: {
            paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_HANDLER, Constants.LOG_INFO, updatePaymentObj.id, Constants.ERROR_MSG_NO_PAYMENT_METHODS);
            errorFlag = true;
            break;
          }
        }
        if (Constants.CREDIT_CARD == paymentMethod) {
          authResponse = await paymentService.setCustomerTokenData(cardTokens, paymentResponse, authResponse, errorFlag, paymentMethod, updatePaymentObj, cartObj.results[Constants.VAL_ZERO]);
        }
        if (
          (Constants.ISV_SAVED_TOKEN in updatePaymentObj.custom.fields &&
            Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_savedToken &&
            Constants.ISV_TOKEN_VERIFICATION_CONTEXT in updatePaymentObj.custom.fields &&
            null != updatePaymentObj.custom.fields.isv_tokenVerificationContext &&
            Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_tokenVerificationContext) ||
          (Constants.CREDIT_CARD != paymentMethod &&
            Constants.CC_PAYER_AUTHENTICATION != paymentMethod &&
            Constants.ISV_TOKEN_VERIFICATION_CONTEXT in updatePaymentObj.custom.fields &&
            null != updatePaymentObj.custom.fields.isv_tokenVerificationContext &&
            Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_tokenVerificationContext)
        ) {
          authResponse.actions.push({
            action: Constants.SET_CUSTOM_FIELD,
            name: Constants.ISV_TOKEN_VERIFICATION_CONTEXT,
            value: null,
          });
        }
        if (Constants.ISV_CAPTURE_CONTEXT_SIGNATURE in updatePaymentObj.custom.fields && null != updatePaymentObj.custom.fields.isv_tokenCaptureContextSignature && Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_tokenCaptureContextSignature) {
          authResponse.actions.push({
            action: Constants.SET_CUSTOM_FIELD,
            name: Constants.ISV_CAPTURE_CONTEXT_SIGNATURE,
            value: null,
          });
        }
        if (Constants.ISV_SECURITY_CODE in updatePaymentObj.custom.fields && null != updatePaymentObj.custom.fields.isv_securityCode) {
          authResponse.actions.push({
            action: Constants.SET_CUSTOM_FIELD,
            name: Constants.ISV_SECURITY_CODE,
            value: null,
          });
        }
        if (null != paymentResponse && Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode && Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == paymentResponse.status) {
          authResponse = await paymentService.checkAuthReversalTriggered(updatePaymentObj, cartObj, paymentResponse, authResponse);
        }
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_HANDLER, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_EMPTY_CART);
        errorFlag = true;
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_HANDLER, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
      errorFlag = true;
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_HANDLER, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, exceptionData);
    errorFlag = true;
  }
  if (errorFlag) {
    authResponse = paymentService.invalidInputResponse();
  }
  return authResponse;
};

const getPayerAuthReversalHandler = async (updatePaymentObj, paymentResponse, updateTransactions, updateActions) => {
  let cartObj: any;
  if (null != updatePaymentObj && null != updateTransactions && null != updateActions && null != paymentResponse && Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode && Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == paymentResponse.status) {
    cartObj = await commercetoolsApi.retrieveCartByPaymentId(updatePaymentObj.id);
    if (null == cartObj || (null != cartObj && Constants.VAL_ZERO == cartObj.count)) {
      if (Constants.STRING_CUSTOMER in updatePaymentObj && Constants.STRING_ID in updatePaymentObj.customer) {
        cartObj = await commercetoolsApi.retrieveCartByCustomerId(updatePaymentObj.customer.id);
      } else {
        cartObj = await commercetoolsApi.retrieveCartByAnonymousId(updatePaymentObj.anonymousId);
      }
    }
    updateActions = await paymentService.checkAuthReversalTriggered(updatePaymentObj, cartObj, paymentResponse, updateActions);
  } else {
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_REVERSAL_HANDLER, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
  }
  return updateActions;
};

const applePaySessionHandler = async (fields) => {
  let serviceResponse: any;
  let exceptionData: any;
  let httpsAgent: any;
  let cert: any;
  let key: any;
  let certData: any;
  let keyData: any;
  let body: any;
  let domainName: any;
  let applePaySession: any;
  let errorFlag = false;
  try {
    if (null != fields && Constants.ISV_APPLE_PAY_VALIDATION_URL in fields && Constants.STRING_EMPTY != fields.isv_applePayValidationUrl && Constants.ISV_APPLE_PAY_DISPLAY_NAME in fields && Constants.STRING_EMPTY != fields.isv_applePayDisplayName) {
      if (Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_APPLE_PAY_CERTIFICATE_PATH && Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_APPLE_PAY_KEY_PATH) {
        cert = process.env.PAYMENT_GATEWAY_APPLE_PAY_CERTIFICATE_PATH;
        key = process.env.PAYMENT_GATEWAY_APPLE_PAY_KEY_PATH;
        if (Constants.STRING_AWS == process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT || Constants.STRING_AZURE == process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT) {
          certData = await paymentService.getCertificatesData(cert);
          keyData = await paymentService.getCertificatesData(key);
          if (Constants.HTTP_CODE_TWO_HUNDRED == certData.status && null != certData.data && Constants.HTTP_CODE_TWO_HUNDRED == keyData.status && null != keyData.data) {
            httpsAgent = new https.Agent({
              rejectUnauthorized: true,
              cert: certData.data,
              key: keyData.data,
            });
          } else {
            paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_APPLE_PAY_SESSION_HANDLER, Constants.LOG_ERROR, null, Constants.ERROR_MSG_ACCESSING_CERTIFICATES);
            errorFlag = true;
          }
        } else {
          httpsAgent = new https.Agent({
            rejectUnauthorized: true,
            cert: fs.readFileSync(cert),
            key: fs.readFileSync(key),
          });
        }
        domainName = process.env.PAYMENT_GATEWAY_APPLE_PAY_DOMAIN_NAME;
        body = {
          merchantIdentifier: process.env.PAYMENT_GATEWAY_APPLE_PAY_MERCHANT_ID,
          domainName: domainName,
          displayName: fields.isv_applePayDisplayName,
          initiative: Constants.PAYMENT_GATEWAY_APPLE_PAY_INITIATIVE,
          initiativeContext: domainName,
        };
        applePaySession = await axios.post(fields.isv_applePayValidationUrl, body, {
          httpsAgent,
        });
        serviceResponse = {
          actions: [
            {
              action: Constants.SET_CUSTOM_FIELD,
              name: Constants.ISV_PAYMENT_APPLE_PAY_SESSION_DATA,
              value: JSON.stringify(applePaySession.data),
            },
          ],
          errors: [],
        };
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_APPLE_PAY_SESSION_HANDLER, Constants.LOG_ERROR, null, Constants.ERROR_MSG_APPLE_PAY_CERTIFICATES);
        errorFlag = true;
      }
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_SERVICE_PROCESS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_SERVICE_PROCESS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_SERVICE_PROCESS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_APPLE_PAY_SESSION_HANDLER, Constants.LOG_ERROR, null, exceptionData);
    errorFlag = true;
  }
  if (errorFlag) {
    serviceResponse = paymentService.invalidInputResponse();
  }
  return serviceResponse;
};

const orderManagementHandler = async (paymentId, updatePaymentObj, updateTransactions) => {
  let cartObj: any;
  let orderResponse: any;
  let serviceResponse: any;
  let exceptionData: any;
  let authReversalId = null;
  let authId = null;
  let orderNo = null;
  let errorFlag = false;
  let refundAction = false;
  let refundResponse: any;
  let refundAddResponse: any;
  try {
    if (null != updatePaymentObj && null != updateTransactions) {
      cartObj = await commercetoolsApi.retrieveCartByPaymentId(paymentId);
      if (null == cartObj || (null != cartObj && Constants.VAL_ZERO == cartObj.count)) {
        if (Constants.STRING_CUSTOMER in updatePaymentObj && Constants.STRING_ID in updatePaymentObj.customer) {
          cartObj = await commercetoolsApi.retrieveCartByCustomerId(updatePaymentObj.customer.id);
        } else {
          cartObj = await commercetoolsApi.retrieveCartByAnonymousId(updatePaymentObj.anonymousId);
        }
      }
      orderNo = await paymentService.getOrderId(cartObj, paymentId);
      if (Constants.CT_TRANSACTION_TYPE_CHARGE == updateTransactions.type && Constants.CT_TRANSACTION_STATE_INITIAL == updateTransactions.state) {
        updatePaymentObj.transactions.forEach((transaction) => {
          if (Constants.CT_TRANSACTION_TYPE_AUTHORIZATION == transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS == transaction.state) {
            authId = transaction.interactionId;
          }
        });
        if (null != authId) {
          orderResponse = await paymentCapture.captureResponse(updatePaymentObj, updateTransactions, authId, orderNo);
        } else {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ORDER_MANAGEMENT_HANDLER, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + paymentId, Constants.ERROR_MSG_CAPTURE_FAILURE);
          errorFlag = true;
        }
      } else if (Constants.CT_TRANSACTION_TYPE_REFUND == updateTransactions.type && Constants.CT_TRANSACTION_STATE_INITIAL == updateTransactions.state) {
        refundAction = true;
        refundResponse = await paymentService.getRefundResponse(updatePaymentObj, updateTransactions, orderNo);
        if (null != refundResponse && null != refundResponse.refundActions && refundResponse.refundTriggered) {
          serviceResponse = refundResponse.refundActions;
        } else if (!refundResponse.refundTriggered) {
          refundAddResponse = await paymentService.getAddRefundResponse(updatePaymentObj, updateTransactions, orderNo);
          if (null != refundAddResponse) {
            serviceResponse = refundAddResponse;
          }
        } else {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ORDER_MANAGEMENT_HANDLER, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + paymentId, Constants.ERROR_MSG_REFUND_FAILURE);
          errorFlag = true;
        }
      } else if (Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION == updateTransactions.type && Constants.CT_TRANSACTION_STATE_INITIAL == updateTransactions.state) {
        updatePaymentObj.transactions.forEach((transaction) => {
          if (Constants.CT_TRANSACTION_TYPE_AUTHORIZATION == transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS == transaction.state) {
            authReversalId = transaction.interactionId;
          }
        });
        if (null != authReversalId) {
          orderResponse = await paymentAuthReversal.authReversalResponse(updatePaymentObj, cartObj, authReversalId);
        } else {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ORDER_MANAGEMENT_HANDLER, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + paymentId, Constants.ERROR_MSG_REVERSAL_FAILURE);
          errorFlag = true;
        }
      }
      if (null != orderResponse && null != orderResponse.httpCode && !refundAction) {
        serviceResponse = paymentService.getOMServiceResponse(orderResponse, updateTransactions, null, null);
      } else if (refundAction && null != serviceResponse) {
        errorFlag = false;
      } else {
        errorFlag = true;
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ORDER_MANAGEMENT_HANDLER, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + paymentId, Constants.ERROR_MSG_SERVICE_PROCESS);
      errorFlag = true;
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_SERVICE_PROCESS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_SERVICE_PROCESS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_SERVICE_PROCESS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ORDER_MANAGEMENT_HANDLER, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + paymentId, exceptionData);
    errorFlag = true;
  }
  if (errorFlag) {
    serviceResponse = paymentService.invalidInputResponse();
  }
  return serviceResponse;
};

const updateCardHandler = async (tokens, customerId, customerObj) => {
  let updateServiceResponse: any;
  let returnResponse: any;
  let exceptionData: any;
  let existingTokens: any;
  let existingTokensMap: any;
  let newToken: any;
  let parsedTokens: any;
  let customerInfo: any;
  let addressData: any;
  let newExpiryMonth = null;
  let newExpiryYear = null;
  let errorFlag = false;
  let length = Constants.VAL_NEGATIVE_ONE;
  try {
    if (null != customerId) {
      customerInfo = await commercetoolsApi.getCustomer(customerId);
      customerObj.addresses.forEach((address) => {
        if (tokens.addressId == address.id) {
          addressData = address;
        }
      });
      newExpiryMonth = customerObj.custom.fields.isv_cardNewExpiryMonth;
      newExpiryYear = customerObj.custom.fields.isv_cardNewExpiryYear;
      updateServiceResponse = await updateToken.updateTokenResponse(tokens, newExpiryMonth, newExpiryYear, addressData);
      if (
        null != updateServiceResponse &&
        Constants.HTTP_CODE_TWO_HUNDRED == updateServiceResponse.httpCode &&
        updateServiceResponse.hasOwnProperty(Constants.STRING_CARD) &&
        Constants.VAL_ZERO < Object.keys(updateServiceResponse.card).length &&
        updateServiceResponse.card.hasOwnProperty(Constants.STRING_EXPIRATION_MONTH) &&
        null != updateServiceResponse.card.expirationMonth &&
        updateServiceResponse.card.hasOwnProperty(Constants.STRING_EXPIRATION_YEAR) &&
        null != updateServiceResponse.card.expirationYear
      ) {
        if (
          null != customerInfo &&
          Constants.STRING_CUSTOM in customerInfo &&
          Constants.STRING_FIELDS in customerInfo.custom &&
          Constants.ISV_TOKENS in customerInfo.custom.fields &&
          Constants.STRING_EMPTY != customerInfo.custom.fields.isv_tokens &&
          Constants.VAL_ZERO < customerInfo.custom.fields.isv_tokens.length
        ) {
          existingTokens = customerInfo.custom.fields.isv_tokens;
          existingTokensMap = existingTokens.map((item) => item);
          existingTokensMap.forEach((token, index) => {
            newToken = JSON.parse(token);
            if (newToken.paymentToken == tokens.paymentToken) {
              length = index;
            }
          });
          if (Constants.VAL_NEGATIVE_ONE < length) {
            parsedTokens = JSON.parse(existingTokensMap[length]);
            parsedTokens.cardExpiryMonth = updateServiceResponse.card.expirationMonth;
            parsedTokens.cardExpiryYear = updateServiceResponse.card.expirationYear;
            parsedTokens.addressId = tokens.addressId;
            existingTokensMap[length] = JSON.stringify(parsedTokens);
            returnResponse = paymentService.getUpdateTokenActions(existingTokensMap, customerObj.custom.fields.isv_failedTokens, errorFlag, customerObj, null);
          } else {
            paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_CARD_HANDLER, Constants.LOG_INFO, Constants.LOG_CUSTOMER_ID + customerId, Constants.ERROR_MSG_NO_TOKENS);
          }
        } else {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_CARD_HANDLER, Constants.LOG_INFO, Constants.LOG_CUSTOMER_ID + customerId, Constants.ERROR_MSG_NO_TOKENS);
        }
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_CARD_HANDLER, Constants.LOG_INFO, Constants.LOG_CUSTOMER_ID + customerId, Constants.ERROR_MSG_SERVICE_PROCESS);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_CARD_HANDLER, Constants.LOG_INFO, Constants.LOG_CUSTOMER_ID + customerId, Constants.ERROR_MSG_CUSTOMER_DETAILS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_CUSTOMER_UPDATE + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_CUSTOMER_UPDATE + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_CUSTOMER_UPDATE + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_CARD_HANDLER, Constants.LOG_ERROR, Constants.LOG_CUSTOMER_ID + customerId, exceptionData);
  }
  return returnResponse;
};

const deleteCardHandler = async (updateCustomerObj, customerId) => {
  let tokenManagementResponse: any;
  let customerTokenHandlerResponse: any;
  let customerObj: any;
  let parsedToken: any;
  let existingTokensMap: any;
  let length = Constants.VAL_NEGATIVE_ONE;
  if (null != customerId && null != updateCustomerObj) {
    customerObj = await commercetoolsApi.getCustomer(customerId);
    tokenManagementResponse = await deleteToken.deleteCustomerToken(updateCustomerObj);
    if (null != tokenManagementResponse && null != tokenManagementResponse.httpCode && Constants.HTTP_CODE_TWO_HUNDRED_FOUR == tokenManagementResponse.httpCode) {
      if (
        null != customerObj &&
        Constants.STRING_CUSTOM in customerObj &&
        Constants.STRING_FIELDS in customerObj.custom &&
        Constants.ISV_TOKENS in customerObj.custom.fields &&
        Constants.STRING_EMPTY != customerObj.custom.fields.isv_tokens &&
        Constants.VAL_ZERO < customerObj.custom.fields.isv_tokens.length
      ) {
        existingTokensMap = customerObj.custom.fields.isv_tokens.map((item) => item);
        existingTokensMap.forEach((token, index) => {
          parsedToken = JSON.parse(token);
          if (tokenManagementResponse.deletedToken == parsedToken.paymentToken) {
            length = index;
          }
        });
        if (Constants.VAL_NEGATIVE_ONE < length) {
          existingTokensMap.splice(length, Constants.VAL_ONE);
          customerTokenHandlerResponse = paymentService.getUpdateTokenActions(existingTokensMap, customerObj.custom.fields.isv_failedTokens, true, customerObj, null);
        } else {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_DELETE_CARD_HANDLER, Constants.LOG_INFO, Constants.LOG_CUSTOMER_ID + customerId, Constants.ERROR_MSG_NO_TOKENS);
        }
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_DELETE_CARD_HANDLER, Constants.LOG_INFO, Constants.LOG_CUSTOMER_ID + customerId, Constants.ERROR_MSG_NO_TOKENS);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_DELETE_CARD_HANDLER, Constants.LOG_INFO, Constants.LOG_CUSTOMER_ID + customerId, Constants.ERROR_MSG_SERVICE_PROCESS);
    }
  } else {
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_DELETE_CARD_HANDLER, Constants.LOG_INFO, Constants.LOG_CUSTOMER_ID + customerId, Constants.ERROR_MSG_CUSTOMER_DETAILS);
  }
  return customerTokenHandlerResponse;
};

const addCardHandler = async (customerId, addressObj, customerObj) => {
  let addressData: any;
  let cardTokens: any;
  let cardResponse: any;
  let customerTokenResponse: any;
  let existingTokens: any;
  let existingTokensMap: any;
  let newToken: any;
  let parsedTokens: any;
  let tokenData: any;
  let exceptionData: any;
  let failedTokens: any;
  let existingFailedTokens: any;
  let existingFailedTokensMap: any;
  let startTime: any;
  let limiterResponse: any;
  let cardRate: any;
  let cardRateCount: any;
  let paymentInstrumentId = null;
  let instrumentIdentifier = null;
  let customerTokenId = null;
  let newTokenFlag = false;
  let tokensExists = false;
  let dontSaveTokenFlag = false;
  let length = Constants.VAL_NEGATIVE_ONE;
  let failedTokenLength = Constants.VAL_ZERO;
  let ucAddressData: any;
  let addressIdField: any;
  let billToFields: any;
  try {
    if (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ENABLE_RATE_LIMITER && null != customerId && null != customerObj) {
      cardRate = Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME ? process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME : Constants.DEFAULT_PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME;
      cardRateCount = Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE ? process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE : Constants.DEFAULT_PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE;
      startTime = new Date();
      startTime.setHours(startTime.getHours() - cardRate);
      limiterResponse = await paymentService.rateLimiterAddToken(customerObj, new Date(startTime).toISOString(), new Date(Date.now()).toISOString());
      if (null != limiterResponse && limiterResponse >= parseInt(cardRateCount)) {
        dontSaveTokenFlag = true;
      }
    }
    if (!dontSaveTokenFlag && Constants.STRING_EMPTY != customerObj?.custom?.fields?.isv_addressId && customerObj.custom.fields?.isv_token && Constants.STRING_EMPTY != customerObj.custom.fields.isv_token) {
      cardTokens = await paymentService.getCardTokens(customerObj, null);
      if (Constants.UC_ADDRESS == customerObj.custom.fields.isv_addressId) {
        ucAddressData = await getTransientTokenData.transientTokenDataResponse(customerObj, Constants.SERVICE_MY_ACCOUNTS);
        if (Constants.HTTP_CODE_TWO_HUNDRED == ucAddressData?.httpCode) {
          billToFields = JSON.parse(ucAddressData.data).orderInformation.billTo;
        }
        cardResponse = await addTokenService.addTokenResponse(customerId, customerObj, billToFields, cardTokens);
      } else {
        addressObj.forEach((address) => {
          if (customerObj.custom.fields.isv_addressId == address.id) {
            addressData = address;
          }
        });
        cardResponse = await addTokenService.addTokenResponse(customerId, customerObj, addressData, cardTokens);
      }
      if (
        Constants.HTTP_CODE_TWO_HUNDRED_ONE == cardResponse.httpCode &&
        Constants.API_STATUS_AUTHORIZED == cardResponse.status &&
        cardResponse.data.hasOwnProperty(Constants.TOKEN_INFORMATION) &&
        Constants.VAL_ZERO < Object.keys(cardResponse.data.tokenInformation).length &&
        cardResponse.data.tokenInformation.hasOwnProperty(Constants.PAYMENT_INSTRUMENT) &&
        Constants.VAL_ZERO < Object.keys(cardResponse.data.tokenInformation.paymentInstrument).length
      ) {
        customerTokenId = cardResponse.data.tokenInformation.hasOwnProperty(Constants.STRING_CUSTOMER) && Constants.VAL_ZERO < Object.keys(cardResponse.data.tokenInformation.customer).length ? cardResponse.data.tokenInformation.customer.id : cardTokens.customerTokenId;
        paymentInstrumentId = cardResponse.data.tokenInformation.paymentInstrument.id;
        instrumentIdentifier = cardResponse.data.tokenInformation.instrumentIdentifier.id;
        if (customerObj.custom.fields?.isv_tokens && Constants.STRING_EMPTY != customerObj.custom.fields.isv_tokens && Constants.VAL_ZERO < customerObj.custom.fields.isv_tokens.length) {
          existingTokens = customerObj.custom.fields.isv_tokens;
          existingTokensMap = existingTokens.map((item) => item);
          existingTokensMap.forEach((token, index) => {
            newToken = JSON.parse(token);
            if (newToken.cardNumber == customerObj.custom.fields.isv_maskedPan && newToken.value == customerTokenId && newToken.instrumentIdentifier == instrumentIdentifier) {
              length = index;
            }
          });
          if (Constants.VAL_NEGATIVE_ONE < length) {
            parsedTokens = JSON.parse(existingTokensMap[length]);
            parsedTokens.alias = customerObj.custom.fields.isv_tokenAlias;
            parsedTokens.value = customerTokenId;
            parsedTokens.paymentToken = paymentInstrumentId;
            parsedTokens.cardExpiryMonth = customerObj.custom.fields.isv_cardExpiryMonth;
            parsedTokens.cardExpiryYear = customerObj.custom.fields.isv_cardExpiryYear;
            parsedTokens.addressId = customerObj.custom.fields.isv_addressId;
            if (Constants.UC_ADDRESS == customerObj.custom.fields.isv_addressId) {
              parsedTokens.address = billToFields;
            }
            existingTokensMap[length] = JSON.stringify(parsedTokens);
          } else {
            newTokenFlag = true;
            tokensExists = true;
          }
        } else {
          newTokenFlag = true;
        }
        if (newTokenFlag) {
          if (Constants.UC_ADDRESS == customerObj.custom.fields.isv_addressId) {
            addressIdField = billToFields;
            tokenData = {
              alias: customerObj.custom.fields.isv_tokenAlias,
              value: customerTokenId,
              paymentToken: paymentInstrumentId,
              instrumentIdentifier: instrumentIdentifier,
              cardType: customerObj.custom.fields.isv_cardType,
              cardName: customerObj.custom.fields.isv_cardType,
              cardNumber: customerObj.custom.fields.isv_maskedPan,
              cardExpiryMonth: customerObj.custom.fields.isv_cardExpiryMonth,
              cardExpiryYear: customerObj.custom.fields.isv_cardExpiryYear,
              addressId: customerObj.custom.fields.isv_addressId,
              address: addressIdField,
              timeStamp: new Date(Date.now()).toISOString(),
            };
          } else {
            tokenData = {
              alias: customerObj.custom.fields.isv_tokenAlias,
              value: customerTokenId,
              paymentToken: paymentInstrumentId,
              instrumentIdentifier: instrumentIdentifier,
              cardType: customerObj.custom.fields.isv_cardType,
              cardName: customerObj.custom.fields.isv_cardType,
              cardNumber: customerObj.custom.fields.isv_maskedPan,
              cardExpiryMonth: customerObj.custom.fields.isv_cardExpiryMonth,
              cardExpiryYear: customerObj.custom.fields.isv_cardExpiryYear,
              addressId: customerObj.custom.fields.isv_addressId,
              timeStamp: new Date(Date.now()).toISOString(),
            };
          }
          if (tokensExists) {
            length = existingTokensMap.length;
            existingTokensMap[length] = JSON.stringify(tokenData);
          } else {
            existingTokensMap = [JSON.stringify(tokenData)];
          }
          customerTokenResponse = await paymentService.getUpdateTokenActions(existingTokensMap, customerObj.custom.fields.isv_failedTokens, true, customerObj, billToFields);
        } else {
          customerTokenResponse = await paymentService.getUpdateTokenActions(existingTokensMap, customerObj.custom.fields.isv_failedTokens, false, customerObj, billToFields);
        }
      } else {
        if (Constants.UC_ADDRESS == customerObj.custom.fields.isv_addressId) {
          addressIdField = null;
        } else {
          addressIdField = customerObj.custom.fields.isv_addressId;
        }
        failedTokens = {
          alias: customerObj.custom.fields.isv_tokenAlias,
          cardType: customerObj.custom.fields.isv_cardType,
          cardName: customerObj.custom.fields.isv_cardType,
          cardNumber: customerObj.custom.fields.isv_maskedPan,
          cardExpiryMonth: customerObj.custom.fields.isv_cardExpiryMonth,
          cardExpiryYear: customerObj.custom.fields.isv_cardExpiryYear,
          addressId: addressIdField,
          timeStamp: new Date(Date.now()).toISOString(),
        };
        if (customerObj.custom.fields?.isv_failedTokens && customerObj?.custom?.fields?.isv_failedTokens.length) {
          existingFailedTokens = customerObj.custom.fields.isv_failedTokens;
          existingFailedTokensMap = existingFailedTokens.map((item) => item);
          failedTokenLength = customerObj.custom.fields.isv_failedTokens.length;
          existingFailedTokensMap[failedTokenLength] = JSON.stringify(failedTokens);
        } else {
          existingFailedTokensMap = [JSON.stringify(failedTokens)];
        }
        if (customerObj.custom.fields?.isv_tokens && customerObj?.custom?.fields?.isv_tokens.length) {
          existingTokens = customerObj.custom.fields.isv_tokens;
        }
        customerTokenResponse = await paymentService.getUpdateTokenActions(existingTokens, existingFailedTokensMap, true, customerObj, null);
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_CARD_HANDLER, Constants.LOG_ERROR, Constants.LOG_CUSTOMER_ID + customerId, Constants.ERROR_MSG_SERVICE_PROCESS);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_CARD_HANDLER, Constants.LOG_ERROR, Constants.LOG_CUSTOMER_ID + customerId, Constants.ERROR_MSG_INVALID_INPUT);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_ADDING_A_CARD + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_ADDING_A_CARD + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_ADDING_A_CARD + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_CARD_HANDLER, Constants.LOG_ERROR, Constants.LOG_CUSTOMER_ID + customerId, exceptionData);
  }
  return customerTokenResponse;
};

const reportHandler = async () => {
  let conversionDetails: any;
  let latestTransaction: any;
  let paymentDetails: any;
  let conversionDetailsData: any;
  let exceptionData: any;
  let conversionPresent = false;
  var decisionUpdateObject = {
    id: null,
    version: null,
    transactionId: null,
    interactionId: null,
    state: Constants.STRING_EMPTY,
  };
  let decisionSyncResponse = {
    message: Constants.STRING_EMPTY,
    error: Constants.STRING_EMPTY,
  };
  let midCredentials = {
    merchantId: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
    merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
    merchantSecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
  };
  let decisionSyncArray: any;
  let decisionSyncMids: any;
  let decisionMidsArray = [] as any;
  try {
    if (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_DECISION_SYNC) {
      decisionSyncArray = await multiMid.getAllMidDetails();
      decisionSyncArray.push(midCredentials);
      if (undefined != process.env.PAYMENT_GATEWAY_DECISION_SYNC_MULTI_MID && Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_DECISION_SYNC_MULTI_MID) {
        decisionSyncMids = process.env.PAYMENT_GATEWAY_DECISION_SYNC_MULTI_MID;
        decisionMidsArray = decisionSyncMids.split(Constants.REGEX_COMMA);
        for (let decisionElement of decisionSyncArray) {
          if (decisionMidsArray.includes(decisionElement.merchantId)) {
            conversionDetails = await conversion.conversionDetails(decisionElement);
            if (null != conversionDetails && Constants.HTTP_CODE_TWO_HUNDRED == conversionDetails.status) {
              conversionDetailsData = conversionDetails.data;
              for (let element of conversionDetailsData) {
                if (Constants.VAL_THIRTY_SIX == element.merchantReferenceNumber.length) {
                  paymentDetails = await commercetoolsApi.retrievePayment(element.merchantReferenceNumber);
                  if (null != paymentDetails && paymentDetails?.transactions && Constants.VAL_ZERO < paymentDetails.transactions.length) {
                    latestTransaction = paymentDetails.transactions[paymentDetails.transactions.length - Constants.VAL_ONE];
                    if ((Constants.CT_TRANSACTION_TYPE_AUTHORIZATION == latestTransaction.type || Constants.CT_TRANSACTION_TYPE_CHARGE == latestTransaction.type) && Constants.CT_TRANSACTION_STATE_PENDING == latestTransaction.state) {
                      conversionPresent = true;
                      decisionUpdateObject.id = paymentDetails.id;
                      decisionUpdateObject.version = paymentDetails.version;
                      decisionUpdateObject.transactionId = latestTransaction.id;
                      if (Constants.HTTP_STATUS_DECISION_ACCEPT == element.newDecision) {
                        decisionUpdateObject.state = Constants.CT_TRANSACTION_STATE_SUCCESS;
                        await commercetoolsApi.updateDecisionSync(decisionUpdateObject);
                      }
                      if (Constants.HTTP_STATUS_DECISION_REJECT == element.newDecision) {
                        decisionUpdateObject.state = Constants.CT_TRANSACTION_STATE_FAILURE;
                        await commercetoolsApi.updateDecisionSync(decisionUpdateObject);
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (conversionPresent) {
          decisionSyncResponse.message = Constants.SUCCESS_MSG_DECISION_SYNC_SERVICE;
        } else {
          decisionSyncResponse.error = Constants.ERROR_MSG_NO_SYNC_DETAILS;
        }
      } else {
        decisionSyncResponse.error = Constants.ERROR_MSG_ENABLE_DECISION_SYNC_MIDS;
      }
    } else {
      decisionSyncResponse.error = Constants.ERROR_MSG_ENABLE_DECISION_SYNC;
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_CONVERSION_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_CONVERSION_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_CONVERSION_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    decisionSyncResponse.error = Constants.ERROR_MSG_SYNC_PAYMENT_DETAILS;
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_REPORT_HANDLER, Constants.LOG_ERROR, null, exceptionData);
  }
  return decisionSyncResponse;
};

const syncHandler = async () => {
  let createSearchResponse: any;
  let transactionSummaries: any;
  let exceptionData: any;
  let paymentDetails: any;
  let transactions: any;
  let applicationResponse: any;
  let applications: any;
  let updateSyncResponse: any;
  let syncPresent = false;
  let rowPresent = false;
  let syncUpdateObject = {
    id: null,
    transactionId: null,
    version: null,
    interactionId: null,
    amountPlanned: {
      currencyCode: null,
      centAmount: Constants.VAL_ZERO,
    },
    type: Constants.STRING_EMPTY,
    state: Constants.STRING_EMPTY,
    securityCodePresent: false,
  };
  let syncResponse = {
    message: Constants.STRING_EMPTY,
    error: Constants.STRING_EMPTY,
  };
  let midCredentials = {
    merchantId: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
    merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
    merchantSecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
  };
  let multiMidArray: any;
  let fractionDigits = Constants.VAL_ZERO;
  try {
    if (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_RUN_SYNC) {
      multiMidArray = await multiMid.getAllMidDetails();
      multiMidArray.push(midCredentials);
      for (let midElement of multiMidArray) {
        createSearchResponse = await createSearchRequest.getTransactionSearchResponse(Constants.STRING_SYNC_QUERY, Constants.STRING_SYNC_SORT, midElement);
        if (
          null != createSearchResponse &&
          Constants.HTTP_CODE_TWO_HUNDRED_ONE == createSearchResponse.httpCode &&
          undefined != createSearchResponse.data &&
          undefined != createSearchResponse.data._embedded &&
          undefined != createSearchResponse.data._embedded.transactionSummaries
        ) {
          transactionSummaries = createSearchResponse.data._embedded.transactionSummaries;
          for (let element of transactionSummaries) {
            rowPresent = false;
            syncUpdateObject.securityCodePresent = false;
            if (Constants.VAL_THIRTY_SIX == element.clientReferenceInformation.code.length) {
              paymentDetails = await commercetoolsApi.retrievePayment(element.clientReferenceInformation.code);
              if (null != paymentDetails && Constants.STRING_TRANSACTIONS in paymentDetails) {
                fractionDigits = paymentDetails.amountPlanned.fractionDigits;
                if (
                  (Constants.CC_PAYER_AUTHENTICATION == paymentDetails.paymentMethodInfo.method || Constants.CREDIT_CARD == paymentDetails.paymentMethodInfo.method) &&
                  paymentDetails?.custom?.fields?.isv_securityCode &&
                  null != paymentDetails.custom.fields.isv_securityCode
                ) {
                  syncUpdateObject.securityCodePresent = true;
                }
                transactions = paymentDetails.transactions;
                applications = element.applicationInformation.applications;
                if (null != applications && null != transactions) {
                  applicationResponse = await paymentService.getApplicationsPresent(applications);
                  if (null != applicationResponse) {
                    if (transactions.some((item) => item.interactionId == element.id)) {
                      rowPresent = true;
                    }
                    if (!rowPresent) {
                      syncUpdateObject.id = paymentDetails.id;
                      syncUpdateObject.version = paymentDetails.version;
                      syncUpdateObject.interactionId = element.id;
                      if (applicationResponse.authPresent || applicationResponse.capturePresent || applicationResponse.authReversalPresent) {
                        if (null != element.orderInformation && null != element.orderInformation.amountDetails && null != element.orderInformation.amountDetails.currency) {
                          syncUpdateObject.amountPlanned.currencyCode = element.orderInformation.amountDetails.currency;
                        } else {
                          syncUpdateObject.amountPlanned.currencyCode = paymentDetails.amountPlanned.currencyCode;
                        }
                        if (null != element.orderInformation && null != element.orderInformation.amountDetails && null != element.orderInformation.amountDetails.totalAmount) {
                          syncUpdateObject.amountPlanned.centAmount = paymentService.convertAmountToCent(Number(element.orderInformation.amountDetails.totalAmount), fractionDigits);
                        } else {
                          syncUpdateObject.amountPlanned.centAmount = paymentDetails.amountPlanned.centAmount;
                        }
                        if (!applicationResponse.authReasonCodePresent) {
                          if (applicationResponse.capturePresent && applicationResponse.captureReasonCodePresent) {
                            syncUpdateObject.amountPlanned.centAmount = paymentService.convertAmountToCent(Number(element.orderInformation.amountDetails.totalAmount), fractionDigits);
                            syncUpdateObject.amountPlanned.currencyCode = element.orderInformation.amountDetails.currency;
                          } else {
                            syncUpdateObject.amountPlanned.currencyCode = paymentDetails.amountPlanned.currencyCode;
                            syncUpdateObject.amountPlanned.centAmount = paymentDetails.amountPlanned.centAmount;
                          }
                        }
                      } else {
                        syncUpdateObject.amountPlanned.currencyCode = element.orderInformation.amountDetails.currency;
                        syncUpdateObject.amountPlanned.centAmount = paymentService.convertAmountToCent(Number(element.orderInformation.amountDetails.totalAmount), fractionDigits);
                      }
                      if (applicationResponse.authPresent) {
                        if (Constants.ECHECK == paymentDetails.paymentMethodInfo.method) {
                          syncUpdateObject.type = Constants.CT_TRANSACTION_TYPE_CHARGE;
                        } else {
                          if (applicationResponse.capturePresent && applicationResponse.captureReasonCodePresent) {
                            syncUpdateObject.type = Constants.CT_TRANSACTION_TYPE_CHARGE;
                          } else {
                            syncUpdateObject.type = Constants.CT_TRANSACTION_TYPE_AUTHORIZATION;
                          }
                        }
                        updateSyncResponse = await paymentService.runSyncAddTransaction(syncUpdateObject, element.applicationInformation.reasonCode, applicationResponse.authPresent, applicationResponse.authReasonCodePresent);
                        if (null != updateSyncResponse && (Constants.CLICK_TO_PAY == paymentDetails.paymentMethodInfo.method || Constants.APPLE_PAY == paymentDetails.paymentMethodInfo.method)) {
                          await paymentService.updateVisaDetails(paymentDetails, updateSyncResponse.version, element.id);
                        }
                      } else if (applicationResponse.capturePresent) {
                        syncUpdateObject.type = Constants.CT_TRANSACTION_TYPE_CHARGE;
                        updateSyncResponse = await paymentService.runSyncAddTransaction(syncUpdateObject, element.applicationInformation.reasonCode, applicationResponse.authPresent, applicationResponse.authReasonCodePresent);
                      } else if (applicationResponse.authReversalPresent) {
                        syncUpdateObject.type = Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION;
                        updateSyncResponse = await paymentService.runSyncAddTransaction(syncUpdateObject, element.applicationInformation.reasonCode, applicationResponse.authPresent, applicationResponse.authReasonCodePresent);
                      } else if (applicationResponse.refundPresent) {
                        syncUpdateObject.type = Constants.CT_TRANSACTION_TYPE_REFUND;
                        updateSyncResponse = await paymentService.runSyncAddTransaction(syncUpdateObject, element.applicationInformation.reasonCode, applicationResponse.authPresent, applicationResponse.authReasonCodePresent);
                      }
                    }
                    if (null != updateSyncResponse) {
                      syncPresent = true;
                    }
                  }
                }
              } 
            }
          }
        }
      }
      if (syncPresent) {
        syncResponse.message = Constants.SUCCESS_MSG_SYNC_SERVICE;
      } else {
        syncResponse.error = Constants.ERROR_MSG_NO_SYNC_DETAILS;
      }
    } else {
      syncResponse.error = Constants.ERROR_MSG_ENABLE_SYNC;
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    syncResponse.error = Constants.ERROR_MSG_SYNC_PAYMENT_DETAILS;
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SYNC_HANDLER, Constants.LOG_ERROR, null, exceptionData);
  }
  return syncResponse;
};

export default {
  authorizationHandler,
  getPayerAuthReversalHandler,
  applePaySessionHandler,
  orderManagementHandler,
  updateCardHandler,
  deleteCardHandler,
  reportHandler,
  syncHandler,
  addCardHandler,
};
