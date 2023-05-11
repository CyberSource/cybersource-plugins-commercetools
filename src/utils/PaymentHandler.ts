import path from 'path';
import axios from 'axios';
import fs from 'fs';
import https from 'https';
import { stringify } from 'flatted';

import paymentAuthorization from './../service/payment/PaymentAuthorizationService';
import paymentService from './../utils/PaymentService';
import commercetoolsApi from './../utils/api/CommercetoolsApi';
import paymentCapture from './../service/payment/PaymentCaptureService';
import paymentRefund from './../service/payment/PaymentRefundService';
import paymentAuthReversal from './../service/payment/PaymentAuthorizationReversal';
import clickToPay from '../service/payment/ClickToPayDetails';
import paymentAuthSetUp from '../service/payment/PayerAuthenticationSetupService';
import deleteToken from '../service/payment/DeleteTokenService';
import conversion from '../service/payment/DecisionSyncService';
import updateToken from '../service/payment/UpdateTokenService';
import createSearchRequest from '../service/payment/CreateTransactionSearchRequest';
import addTokenService from '../service/payment/AddTokenService';
import { Constants } from '../constants';
import multiMid from './config/MultiMid';

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
            cardTokens = await getCardTokens(customerInfo, paymentInstrumentToken);
          }
        }
        orderNo = await getOrderId(cartObj, updatePaymentObj.id);
        paymentMethod = updatePaymentObj.paymentMethodInfo.method;
        switch (paymentMethod) {
          case Constants.CREDIT_CARD: {
            serviceResponse = await getCreditCardResponse(updatePaymentObj, customerInfo, cartObj.results[Constants.VAL_ZERO], updateTransactions, cardTokens, orderNo);
            paymentResponse = serviceResponse.paymentResponse;
            authResponse = serviceResponse.authResponse;
            errorFlag = serviceResponse.errorFlag;
            break;
          }
          case Constants.CLICK_TO_PAY: {
            serviceResponse = await clickToPayResponse(updatePaymentObj, cartObj.results[Constants.VAL_ZERO], updateTransactions, cardTokens, orderNo);
            paymentResponse = serviceResponse.paymentResponse;
            authResponse = serviceResponse.authResponse;
            errorFlag = serviceResponse.errorFlag;
            break;
          }
          case Constants.GOOGLE_PAY: {
            serviceResponse = await googlePayResponse(updatePaymentObj, cartObj.results[Constants.VAL_ZERO], updateTransactions, cardTokens, orderNo);
            paymentResponse = serviceResponse.paymentResponse;
            authResponse = serviceResponse.authResponse;
            errorFlag = serviceResponse.errorFlag;
            break;
          }
          case Constants.APPLE_PAY: {
            serviceResponse = await getCreditCardResponse(updatePaymentObj, customerInfo, cartObj.results[Constants.VAL_ZERO], updateTransactions, cardTokens, orderNo);
            paymentResponse = serviceResponse.paymentResponse;
            authResponse = serviceResponse.authResponse;
            errorFlag = serviceResponse.errorFlag;
            break;
          }
          case Constants.ECHECK: {
            serviceResponse = await getCreditCardResponse(updatePaymentObj, customerInfo, cartObj.results[Constants.VAL_ZERO], updateTransactions, cardTokens, orderNo);
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
          authResponse = await setCustomerTokenData(cardTokens, paymentResponse, authResponse, errorFlag, paymentMethod, updatePaymentObj, cartObj.results[Constants.VAL_ZERO]);
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
          authResponse = await checkAuthReversalTriggered(updatePaymentObj, cartObj, paymentResponse, authResponse);
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

const getCreditCardResponse = async (updatePaymentObj, customerInfo, cartObj, updateTransactions, cardTokens, orderNo) => {
  let authResponse: any;
  let paymentResponse: any;
  let cardDetails: any;
  let actions: any;
  let startTime: any;
  let limiterResponse: any;
  let cardRate: any;
  let cardRateCount: any;
  let dontSaveTokenFlag = false;
  let payerAuthMandateFlag = false;
  let exceptionData: any;
  let returnResponse = {
    paymentResponse: null,
    authResponse: null,
    errorFlag: false,
  };
  try {
    if (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ENABLE_RATE_LIMITER && null != customerInfo) {
      cardRate = Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME ? process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME : Constants.DEFAULT_PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME;
      cardRateCount = Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE ? process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE : Constants.DEFAULT_PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE;
      startTime = new Date();
      startTime.setHours(startTime.getHours() - cardRate);
      limiterResponse = await rateLimiterAddToken(customerInfo, new Date(startTime).toISOString(), new Date(Date.now()).toISOString());
      if (null != limiterResponse && limiterResponse >= parseInt(cardRateCount)) {
        dontSaveTokenFlag = true;
      }
    }
    paymentResponse = await paymentAuthorization.authorizationResponse(updatePaymentObj, cartObj, Constants.STRING_CARD, cardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNo);
    if (null != updatePaymentObj && null != paymentResponse && null != paymentResponse.httpCode) {
      authResponse = paymentService.getAuthResponse(paymentResponse, updateTransactions);
      if (null != authResponse) {
        if (Constants.APPLE_PAY == updatePaymentObj.paymentMethodInfo.method) {
          cardDetails = await clickToPay.getVisaCheckoutData(paymentResponse, updatePaymentObj);
          if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode && Constants.HTTP_CODE_TWO_HUNDRED == cardDetails.httpCode && cardDetails.hasOwnProperty(Constants.CARD_FIELD_GROUP) && Constants.VAL_ZERO < Object.keys(cardDetails.cardFieldGroup).length) {
            actions = paymentService.visaCardDetailsAction(cardDetails);
            if (null != actions && Constants.VAL_ZERO < actions.length) {
              actions.forEach((i) => {
                authResponse.actions.push(i);
              });
            }
          }
          if (Constants.ISV_PAYMENT_APPLE_PAY_SESSION_DATA in updatePaymentObj.custom.fields && Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_applePaySessionData) {
            authResponse.actions.push({
              action: Constants.SET_CUSTOM_FIELD,
              name: Constants.ISV_PAYMENT_APPLE_PAY_SESSION_DATA,
              value: null,
            });
          }
        }
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CREDIT_CARD_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_SERVICE_PROCESS);
        returnResponse.errorFlag = true;
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CREDIT_CARD_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_SERVICE_PROCESS);
      returnResponse.errorFlag = true;
    }
    returnResponse.paymentResponse = paymentResponse;
    returnResponse.authResponse = authResponse;
  }
  catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CREDIT_CARD_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, exceptionData);
    returnResponse.errorFlag = true;
  }
  return returnResponse;
};

const getPayerAuthSetUpResponse = async (updatePaymentObj) => {
  let setUpServiceResponse: any;
  let setUpActionResponse: any;
  let exceptionData: any;
  let cardTokens: any;
  let customerInfo: any;
  let paymentInstrumentToken = null;
  let errorFlag = false;
  try {
    if (
      (null != updatePaymentObj && Constants.ISV_TOKEN in updatePaymentObj.custom.fields && Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_token) ||
      (null != updatePaymentObj && Constants.ISV_SAVED_TOKEN in updatePaymentObj.custom.fields && Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_savedToken)
    ) {
      if (Constants.STRING_CUSTOMER in updatePaymentObj && Constants.STRING_ID in updatePaymentObj.customer) {
        if (Constants.STRING_CUSTOM in updatePaymentObj && Constants.STRING_FIELDS in updatePaymentObj.custom && Constants.ISV_SAVED_TOKEN in updatePaymentObj.custom.fields && Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_savedToken) {
          paymentInstrumentToken = updatePaymentObj.custom.fields.isv_savedToken;
        }
        if (null != updatePaymentObj.customer.id) {
          customerInfo = await commercetoolsApi.getCustomer(updatePaymentObj.customer.id);
          cardTokens = await getCardTokens(customerInfo, paymentInstrumentToken);
        }
      }
      setUpServiceResponse = await paymentAuthSetUp.payerAuthSetupResponse(updatePaymentObj, cardTokens);
      if (null != setUpServiceResponse && null != setUpServiceResponse.httpCode) {
        setUpActionResponse = paymentService.getAuthResponse(setUpServiceResponse, null);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_SETUP_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_SERVICE_PROCESS);
        errorFlag = true;
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_SETUP_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_NO_CARD_DETAILS);
      errorFlag = true;
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_PAYER_AUTH + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_PAYER_AUTH + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_PAYER_AUTH + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_SETUP_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, exceptionData);
    errorFlag = true;
  }
  if (errorFlag) {
    setUpActionResponse = paymentService.invalidInputResponse();
  }
  return setUpActionResponse;
};

const getPayerAuthEnrollResponse = async (updatePaymentObj) => {
  let enrollResponse: any;
  let enrollServiceResponse: any;
  let cartObj: any;
  let exceptionData: any;
  let cardTokens: any;
  let enrollAuthResponse: any;
  let startTime: any;
  let limiterResponse: any;
  let cardRate: any;
  let cardRateCount: any;
  let customerInfo: any;
  let cardinalReferenceId = null;
  let paymentInstrumentToken = null;
  let orderNo = null;
  let errorFlag = false;
  let dontSaveTokenFlag = false;
  let payerAuthMandateFlag = false;
  try {
    if (
      null != updatePaymentObj &&
      Constants.STRING_CUSTOM in updatePaymentObj &&
      Constants.ISV_CARDINAL_REFERENCE_ID in updatePaymentObj.custom.fields &&
      Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_cardinalReferenceId &&
      ((Constants.ISV_TOKEN in updatePaymentObj.custom.fields && Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_token) || (Constants.ISV_SAVED_TOKEN in updatePaymentObj.custom.fields && Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_savedToken))
    ) {
      cardinalReferenceId = updatePaymentObj.custom.fields.isv_cardinalReferenceId;
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
            cardTokens = await getCardTokens(customerInfo, paymentInstrumentToken);
          }
        }
        orderNo = await getOrderId(cartObj, updatePaymentObj.id);
        if (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ENABLE_RATE_LIMITER && null != customerInfo) {
          cardRate = Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME ? process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME : Constants.DEFAULT_PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME;
          cardRateCount = Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE ? process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE : Constants.DEFAULT_PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE;
          startTime = new Date();
          startTime.setHours(startTime.getHours() - cardRate);
          limiterResponse = await rateLimiterAddToken(customerInfo, new Date(startTime).toISOString(), new Date(Date.now()).toISOString());
          if (null != limiterResponse && limiterResponse >= parseInt(cardRateCount)) {
            dontSaveTokenFlag = true;
          }
        }
        if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == updatePaymentObj.custom.fields.isv_payerEnrollHttpCode && Constants.API_STATUS_CUSTOMER_AUTHENTICATION_REQUIRED == updatePaymentObj.custom.fields.isv_payerEnrollStatus) {
          payerAuthMandateFlag = true;
        }
        enrollServiceResponse = await paymentAuthorization.authorizationResponse(updatePaymentObj, cartObj.results[Constants.VAL_ZERO], Constants.STRING_ENROLL_CHECK, cardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNo);
        enrollServiceResponse.cardinalReferenceId = cardinalReferenceId;
        enrollResponse = paymentService.payerEnrollActions(enrollServiceResponse, updatePaymentObj);
        enrollAuthResponse = paymentService.getAuthResponse(enrollServiceResponse, null);
        if (null != enrollAuthResponse && Constants.VAL_ZERO < enrollAuthResponse.actions.length) {
          enrollAuthResponse.actions.forEach((i) => {
            enrollResponse.actions.push(i);
          });
        }
        enrollResponse = await setCustomerTokenData(cardTokens, enrollServiceResponse, enrollResponse, false, updatePaymentObj.paymentMethodInfo.method, updatePaymentObj, cartObj.results[Constants.VAL_ZERO]);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_ENROLL_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_EMPTY_CART);
        errorFlag = true;
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_ENROLL_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_NO_CARD_DETAILS);
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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_ENROLL_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, exceptionData);
    errorFlag = true;
  }
  if (errorFlag) {
    enrollResponse = paymentService.invalidInputResponse();
  }
  return enrollResponse;
};

const getPayerAuthValidateResponse = async (updatePaymentObj) => {
  let authResponse: any;
  let paymentResponse: any;
  let startTime: any;
  let limiterResponse: any;
  let cardRate: any;
  let cardRateCount: any;
  let cartObj: any;
  let cardTokens: any;
  let exceptionData: any;
  let customerInfo: any;
  let dontSaveTokenFlag = false;
  let payerAuthMandateFlag = false;
  let paymentInstrumentToken = null;
  let orderNo = null;
  let errorFlag = false;
  try {
    if (
      null != updatePaymentObj &&
      Constants.STRING_CUSTOM in updatePaymentObj &&
      ((Constants.ISV_TOKEN in updatePaymentObj.custom.fields && Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_token) || (Constants.ISV_SAVED_TOKEN in updatePaymentObj.custom.fields && Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_savedToken))
    ) {
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
            cardTokens = await getCardTokens(customerInfo, paymentInstrumentToken);
          }
        }
        orderNo = await getOrderId(cartObj, updatePaymentObj.id);
        if (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ENABLE_RATE_LIMITER && Constants.STRING_CUSTOMER in updatePaymentObj && Constants.STRING_ID in updatePaymentObj.customer && null != updatePaymentObj.customer.id) {
          cardRate = Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME ? process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME : Constants.DEFAULT_PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME;
          cardRateCount = Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE ? process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE : Constants.DEFAULT_PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE;
          startTime = new Date();
          startTime.setHours(startTime.getHours() - cardRate);
          limiterResponse = await rateLimiterAddToken(customerInfo, new Date(startTime).toISOString(), new Date(Date.now()).toISOString());
          if (null != limiterResponse && limiterResponse >= parseInt(cardRateCount)) {
            dontSaveTokenFlag = true;
          }
        }
        paymentResponse = await paymentAuthorization.authorizationResponse(updatePaymentObj, cartObj.results[Constants.VAL_ZERO], Constants.VALIDATION, cardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNo);
        if (null != paymentResponse && null != paymentResponse.httpCode) {
          authResponse = paymentService.payerEnrollActions(paymentResponse, updatePaymentObj);
          if (null != authResponse) {
            if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode && !paymentResponse.data.hasOwnProperty(Constants.ERROR_INFORMATION)) {
              authResponse.actions.push({
                action: Constants.ADD_INTERFACE_INTERACTION,
                type: {
                  key: Constants.ISV_PAYER_AUTHENTICATION_VALIDATE_RESULT,
                },
                fields: {
                  cavv: paymentResponse.data.consumerAuthenticationInformation.cavv,
                  eciRaw: paymentResponse.data.consumerAuthenticationInformation.eciRaw,
                  paresStatus: paymentResponse.data.consumerAuthenticationInformation.paresStatus,
                  commerceIndicator: paymentResponse.data.consumerAuthenticationInformation.indicator,
                  authenticationResult: paymentResponse.data.consumerAuthenticationInformation.authenticationResult,
                  xid: paymentResponse.data.consumerAuthenticationInformation.xid,
                  cavvAlgorithm: paymentResponse.data.consumerAuthenticationInformation.cavvAlgorithm,
                  authenticationStatusMessage: paymentResponse.data.consumerAuthenticationInformation.authenticationStatusMessage,
                  eci: paymentResponse.data.consumerAuthenticationInformation.eci,
                  specificationVersion: paymentResponse.data.consumerAuthenticationInformation.specificationVersion,
                },
              });
            }
            if (
              Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode &&
              paymentResponse.data.hasOwnProperty(Constants.ERROR_INFORMATION) &&
              Constants.VAL_ZERO < Object.keys(paymentResponse.data.errorInformation).length &&
              paymentResponse.data.errorInformation.hasOwnProperty(Constants.STRING_REASON) &&
              Constants.VAL_ZERO < Object.keys(paymentResponse.data.errorInformation.reason).length &&
              Constants.API_STATUS_CUSTOMER_AUTHENTICATION_REQUIRED == paymentResponse.data.errorInformation.reason
            ) {
              authResponse.actions.push(
                {
                  action: Constants.SET_CUSTOM_FIELD,
                  name: Constants.ISV_PAYER_AUTHENTICATION_ENROLL_STATUS,
                  value: paymentResponse.data.errorInformation.reason,
                },
                {
                  action: Constants.SET_CUSTOM_FIELD,
                  name: Constants.ISV_PAYER_AUTHENTICATION_ENROLL_HTTP_CODE,
                  value: paymentResponse.httpCode,
                }
              );
            }
          } else {
            paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_VALIDATE_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_SERVICE_PROCESS);
            errorFlag = true;
          }
        } else {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_VALIDATE_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_SERVICE_PROCESS);
          errorFlag = true;
        }
        authResponse = await setCustomerTokenData(cardTokens, paymentResponse, authResponse, false, updatePaymentObj.paymentMethodInfo.method, updatePaymentObj, cartObj.results[Constants.VAL_ZERO]);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_VALIDATE_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_NO_CARD_DETAILS);
        errorFlag = true;
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_VALIDATE_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_NO_CARD_DETAILS);
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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_VALIDATE_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, exceptionData);
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
    updateActions = await checkAuthReversalTriggered(updatePaymentObj, cartObj, paymentResponse, updateActions);
  } else {
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_REVERSAL_HANDLER, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
  }
  return updateActions;
};

const clickToPayResponse = async (updatePaymentObj, cartObj, updateTransactions, customerTokenId, orderNo) => {
  let authResponse: any;
  let paymentResponse: any;
  let cartUpdate: any;
  let visaCheckoutData: any;
  let actions: any;
  let dontSaveTokenFlag = false;
  let payerAuthMandateFlag = false;
  let exceptionData: any;
  let returnResponse = {
    paymentResponse: null,
    authResponse: null,
    errorFlag: false,
  };
  try {
    paymentResponse = await paymentAuthorization.authorizationResponse(updatePaymentObj, cartObj, Constants.STRING_VISA, customerTokenId, dontSaveTokenFlag, payerAuthMandateFlag, orderNo);
    if (null != paymentResponse && null != paymentResponse.httpCode) {
      authResponse = paymentService.getAuthResponse(paymentResponse, updateTransactions);
      if (null != authResponse) {
        visaCheckoutData = await clickToPay.getVisaCheckoutData(paymentResponse, updatePaymentObj);
        if (
          Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode &&
          Constants.HTTP_CODE_TWO_HUNDRED == visaCheckoutData.httpCode &&
          visaCheckoutData.hasOwnProperty(Constants.CARD_FIELD_GROUP) &&
          Constants.VAL_ZERO < Object.keys(visaCheckoutData.cardFieldGroup).length
        ) {
          actions = paymentService.visaCardDetailsAction(visaCheckoutData);
          if (null != actions && Constants.VAL_ZERO < actions.length) {
            actions.forEach((i) => {
              authResponse.actions.push(i);
            });
          }
          cartUpdate = await commercetoolsApi.updateCartByPaymentId(cartObj.id, updatePaymentObj.id, cartObj.version, visaCheckoutData);
          if (null != cartUpdate) {
            paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CLICK_TO_PAY, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.SUCCESS_MSG_UPDATE_CLICK_TO_PAY_CARD_DETAILS);
          }
        } else {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CLICK_TO_PAY, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_UPDATE_CLICK_TO_PAY_DATA);
        }
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CLICK_TO_PAY, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_SERVICE_PROCESS);
        returnResponse.errorFlag = true;
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CLICK_TO_PAY, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_SERVICE_PROCESS);
      returnResponse.errorFlag = true;
    }
    returnResponse.paymentResponse = paymentResponse;
    returnResponse.authResponse = authResponse;
  }
  catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CLICK_TO_PAY, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, exceptionData);
    returnResponse.errorFlag = true;
  }
  return returnResponse;
};

const googlePayResponse = async (updatePaymentObj, cartObj, updateTransactions, customerTokenId, orderNo) => {
  let authResponse: any;
  let paymentResponse: any;
  let actions: any;
  let dontSaveTokenFlag = false;
  let payerAuthMandateFlag = false;
  let exceptionData: any;
  let cardDetails = {
    cardFieldGroup: null,
  };
  let returnResponse = {
    paymentResponse: null,
    authResponse: null,
    errorFlag: false,
  };
  try {
    paymentResponse = await paymentAuthorization.authorizationResponse(updatePaymentObj, cartObj, Constants.STRING_GOOGLE, customerTokenId, dontSaveTokenFlag, payerAuthMandateFlag, orderNo);
    if (null != paymentResponse && null != paymentResponse.httpCode) {
      authResponse = paymentService.getAuthResponse(paymentResponse, updateTransactions);
      if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode) {
        if (null != paymentResponse.data.paymentInformation.tokenizedCard && null != paymentResponse.data.paymentInformation.tokenizedCard.expirationMonth) {
          cardDetails.cardFieldGroup = paymentResponse.data.paymentInformation.tokenizedCard;
        } else {
          cardDetails.cardFieldGroup = paymentResponse.data.paymentInformation.card;
        }
        if (null != cardDetails.cardFieldGroup) {
          actions = paymentService.visaCardDetailsAction(cardDetails);
          if (null != actions && Constants.VAL_ZERO < actions.length) {
            actions.forEach((i) => {
              authResponse.actions.push(i);
            });
          }
        }
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GOOGLE_PAY_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_SERVICE_PROCESS);
      returnResponse.errorFlag = true;
    }
    returnResponse.paymentResponse = paymentResponse;
    returnResponse.authResponse = authResponse;
  }
  catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GOOGLE_PAY_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, exceptionData);
    returnResponse.errorFlag = true;
  }
  return returnResponse;
};

const getTransactionSummaries = async (updatePaymentObj) => {
  let query = Constants.STRING_EMPTY;
  let transactionDetail: any;
  let exceptionData: any;
  let transactionSummaryObject = {
    summaries: null,
    historyPresent: false,
  };
  let errorData: any;
  let authMid: any;
  try {
    query = Constants.PAYMENT_GATEWAY_CLIENT_REFERENCE_CODE + updatePaymentObj.id + Constants.STRING_AND + Constants.STRING_SYNC_QUERY;
    authMid = await multiMid.getMidCredentials(updatePaymentObj);
    return await new Promise(async function (resolve, reject) {
      await setTimeout(async () => {
        transactionDetail = await createSearchRequest.getTransactionSearchResponse(query, Constants.STRING_SYNC_SORT, authMid);
        if (null != transactionDetail && Constants.HTTP_CODE_TWO_HUNDRED_ONE == transactionDetail.httpCode && transactionDetail?.data?._embedded?.transactionSummaries && Constants.VAL_ONE < transactionDetail.data.totalCount) {
          transactionSummaryObject.summaries = transactionDetail.data._embedded.transactionSummaries;
          transactionSummaryObject.historyPresent = true;
          resolve(transactionSummaryObject);
        } else {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_TRANSACTION_SUMMARIES, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_RETRY_TRANSACTION_SEARCH);
          reject(transactionSummaryObject);
        }
      }, 1500);
    }).catch((error) => {
      if (typeof error === 'object') {
        errorData = JSON.stringify(error);
      } else {
        errorData = error;
      }
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_TRANSACTION_SUMMARIES, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, Constants.ERROR_MSG_RETRY_TRANSACTION_SEARCH + errorData);
      return transactionSummaryObject;
    });
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_TRANSACTION_SEARCH + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_TRANSACTION_SEARCH + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_TRANSACTION_SEARCH + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_TRANSACTION_SUMMARIES, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, exceptionData);
  }
  return transactionSummaryObject;
};

const checkAuthReversalTriggered = async (updatePaymentObj, cartObj, paymentResponse, updateActions) => {
  let transactionDetail: any;
  let transactionSummaries: any;
  let applications: any;
  let authReversalResponse: any;
  let exceptionData: any;
  let authReversalTriggered = false;
  let returnAction = {
    action: Constants.ADD_TRANSACTION,
    transaction: {
      type: Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION,
      timestamp: new Date(Date.now()).toISOString(),
      amount: null,
      state: Constants.STRING_EMPTY,
      interactionId: null,
    },
  };
  let reversalAction = {
    action: Constants.ADD_TRANSACTION,
    transaction: {
      type: Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION,
      timestamp: new Date(Date.now()).toISOString(),
      amount: null,
      state: Constants.STRING_EMPTY,
      interactionId: null,
    },
  };
  let authAction = {
    action: Constants.ADD_TRANSACTION,
    transaction: {
      type: Constants.CT_TRANSACTION_TYPE_AUTHORIZATION,
      timestamp: new Date(Date.now()).toISOString(),
      amount: null,
      state: Constants.STRING_EMPTY,
      interactionId: null,
    },
  };
  try {
    for (let i = Constants.VAL_ZERO; i < Constants.VAL_THREE; i++) {
      transactionDetail = await getTransactionSummaries(updatePaymentObj);
      if (null != transactionDetail) {
        transactionSummaries = transactionDetail.summaries;
        if (true == transactionDetail.historyPresent) {
          break;
        }
      }
    }
    if (null != transactionSummaries) {
      transactionSummaries.forEach((element) => {
        applications = element.applicationInformation.applications;
        applications.forEach((application) => {
          if (
            Constants.ECHECK != updatePaymentObj.paymentMethodInfo.method &&
            Constants.STRING_CUSTOM in updatePaymentObj &&
            Constants.STRING_FIELDS in updatePaymentObj.custom &&
            Constants.ISV_SALE_ENABLED in updatePaymentObj.custom.fields &&
            updatePaymentObj.custom.fields.isv_saleEnabled &&
            Constants.STRING_SYNC_AUTH_NAME == application.name &&
            undefined != application.reasonCode
          ) {
            if (Constants.VAL_HUNDRED == application.reasonCode) {
              authAction.transaction.state = Constants.CT_TRANSACTION_STATE_SUCCESS;
              authAction.transaction.amount = updatePaymentObj.amountPlanned;
              authAction.transaction.interactionId = element.id;
            } else {
              authAction.transaction.state = Constants.CT_TRANSACTION_STATE_FAILURE;
              authAction.transaction.amount = updatePaymentObj.amountPlanned;
              authAction.transaction.interactionId = element.id;
            }
            updateActions.actions.push(authAction);
          }
          if (Constants.STRING_SYNC_AUTH_REVERSAL_NAME == application.name) {
            if (Constants.APPLICATION_RCODE == application.rCode && Constants.APPLICATION_RFLAG == application.rFlag) {
              authReversalTriggered = true;
              returnAction.transaction.state = Constants.CT_TRANSACTION_STATE_SUCCESS;
            } else {
              returnAction.transaction.state = Constants.CT_TRANSACTION_STATE_FAILURE;
            }
            returnAction.transaction.amount = updatePaymentObj.amountPlanned;
            returnAction.transaction.interactionId = element.id;
            updateActions.actions.push(returnAction);
          }
        });
      });

    }
    if (!authReversalTriggered) {
      authReversalResponse = await paymentAuthReversal.authReversalResponse(updatePaymentObj, cartObj, paymentResponse.transactionId);
      if (null != authReversalResponse && Constants.HTTP_CODE_TWO_HUNDRED_ONE == authReversalResponse.httpCode && Constants.API_STATUS_REVERSED == authReversalResponse.status) {
        reversalAction.transaction.state = Constants.CT_TRANSACTION_STATE_SUCCESS;
      } else {
        reversalAction.transaction.state = Constants.CT_TRANSACTION_STATE_FAILURE;
      }
      reversalAction.transaction.amount = updatePaymentObj.amountPlanned;
      reversalAction.transaction.interactionId = authReversalResponse.transactionId;
      updateActions.actions.push(reversalAction);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_AUTHORIZING_PAYMENT + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CHECK_AUTH_REVERSAL_TRIGGERED, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + updatePaymentObj.id, exceptionData);
  }
  return updateActions;
};

const getCertificatesData = async (url) => {
  let certificateResponse = {
    status: Constants.VAL_ZERO,
    data: null,
  }
  if (null != url) {
    return new Promise(async (resolve, reject) => {
      axios.get(url)
        .then(function (response) {
          if (response.data) {
            certificateResponse.data = response.data;
            certificateResponse.status = response.status;
            resolve(certificateResponse);
          }
          else {
            certificateResponse.status = response.status
            paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CERTIFICATES_DATA, Constants.LOG_ERROR, null, stringify(response));
            reject(stringify(certificateResponse));
          }
        })
        .catch(function (exception) {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CERTIFICATES_DATA, Constants.LOG_ERROR, null, exception);
          reject(exception);
        });
    })
  }
}

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
        if (process.env.PAYMENT_GATEWAY_ENABLE_SERVERLESS_DEPLOYMENT == Constants.STRING_TRUE) {
          certData = await getCertificatesData(cert);
          keyData = await getCertificatesData(key);
          if (Constants.HTTP_CODE_TWO_HUNDRED == certData.status && null != certData.data && Constants.HTTP_CODE_TWO_HUNDRED == keyData.status && null != keyData.data) {
            httpsAgent = new https.Agent({
              rejectUnauthorized: true,
              cert: certData.data,
              key: keyData.data,
            });
          }
          else {
            paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_APPLE_PAY_SESSION_HANDLER, Constants.LOG_ERROR, null, Constants.ERROR_MSG_ACCESSING_CERTIFICATES);
            errorFlag = true
          }
        }
        else {
          httpsAgent = new https.Agent({
            rejectUnauthorized: true,
            cert: fs.readFileSync(cert),
            key: fs.readFileSync(key),
          });
        }
        domainName = process.env.PAYMENT_GATEWAY_TARGET_ORIGIN;
        domainName = domainName.replace(Constants.DOMAIN_REGEX, Constants.STRING_EMPTY);
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
      orderNo = await getOrderId(cartObj, paymentId);
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
        refundResponse = await getRefundResponse(updatePaymentObj, updateTransactions, orderNo);
        if (null != refundResponse && null != refundResponse.refundActions && refundResponse.refundTriggered) {
          serviceResponse = refundResponse.refundActions;
        }
        else if (!(refundResponse.refundTriggered)) {
          refundAddResponse = await getAddRefundResponse(updatePaymentObj, updateTransactions, orderNo);
          if (null != refundAddResponse) {
            serviceResponse = refundAddResponse;
          }
        }
        else {
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


const getRefundResponse = async (updatePaymentObj, updateTransactions, orderNo) => {
  let refundAmount: any;
  let captureId = null;
  let transactionId = null;
  let paymentId: any;
  let pendingTransactionAmount = Constants.VAL_FLOAT_ZERO;
  let orderResponse: any;
  let refundResponse: any;
  let exceptionData: any;
  let returnRefundResponse = {
    refundTriggered: false,
    refundActions: null
  }
  try {
    if (null != updatePaymentObj && null != updateTransactions) {
      paymentId = updatePaymentObj.id;
      refundAmount = updateTransactions.amount.centAmount;
      if (null != refundAmount && refundAmount > Constants.VAL_ZERO) {
        for (let transaction of updatePaymentObj.transactions) {
          if (Constants.CT_TRANSACTION_TYPE_CHARGE == transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS == transaction.state) {
            if (refundAmount <= transaction.amount.centAmount && (!(Constants.STRING_CUSTOM in transaction))) {
              captureId = transaction.interactionId;
              transactionId = transaction.id;
              pendingTransactionAmount = transaction.amount.centAmount - refundAmount;
              break;
            }
            else if (refundAmount <= transaction.amount.centAmount && transaction?.custom?.fields?.isv_availableCaptureAmount && Constants.VAL_ZERO != transaction.custom.fields.isv_availableCaptureAmount && transaction.custom.fields.isv_availableCaptureAmount >= refundAmount) {
              captureId = transaction.interactionId;
              transactionId = transaction.id;
              pendingTransactionAmount = transaction.custom.fields.isv_availableCaptureAmount - refundAmount;
              break;
            }
          }
        }
        if (null != captureId) {
          orderResponse = await paymentRefund.refundResponse(updatePaymentObj, captureId, updateTransactions, orderNo);
          if (null != orderResponse && null != orderResponse.httpCode) {
            refundResponse = paymentService.getOMServiceResponse(orderResponse, updateTransactions, transactionId, pendingTransactionAmount);
            if (null != refundResponse) {
              returnRefundResponse.refundActions = refundResponse;
              returnRefundResponse.refundTriggered = true;
            }
          }
        }
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_REFUND_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + paymentId, Constants.ERROR_MSG_SERVICE_PROCESS);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_REFUND_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + paymentId, Constants.ERROR_MSG_SERVICE_PROCESS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_SERVICE_PROCESS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_SERVICE_PROCESS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_SERVICE_PROCESS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_REFUND_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + paymentId, exceptionData);
  }
  return returnRefundResponse;
}

const getAddRefundResponse = async (updatePaymentObj, updateTransactions, orderNo) => {
  let refundAmount: any;
  let paymentId: any;
  let captureId = null;
  let transactionId = null;
  let pendingTransactionAmount = 0;
  let amount: any;
  let refundAmountUsed: any;
  let orderResponse: any;
  let refundAction: any
  let actions = [] as any;
  let refundResponse = {};
  let setCustomTypeData: any;
  let exceptionData: any;
  try {
    if (null != updatePaymentObj && null != updateTransactions) {
      paymentId = updatePaymentObj.id;
      refundAmount = updateTransactions.amount.centAmount;
      for (let transaction of updatePaymentObj.transactions) {
        captureId = null;
        pendingTransactionAmount = Constants.VAL_FLOAT_ZERO;
        transactionId = null;
        amount = {
          type: null,
          currencyCode: null,
          centAmount: Constants.VAL_ZERO,
          fractionDigits: Constants.VAL_ZERO
        }
        amount.type = updateTransactions.amount.type;
        amount.currencyCode = updateTransactions.amount.currencyCode;
        amount.fractionDigits = updateTransactions.amount.fractionDigits;
        if (Constants.CT_TRANSACTION_TYPE_CHARGE == transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS == transaction.state && refundAmount > 0) {
          captureId = transaction.interactionId;
          transactionId = transaction.id;
          if (transaction?.custom?.fields?.isv_availableCaptureAmount && Constants.VAL_ZERO != transaction.custom.fields.isv_availableCaptureAmount &&
            refundAmount <= transaction.custom.fields.isv_availableCaptureAmount) {
            updateTransactions.amount.centAmount = refundAmount;
            refundAmountUsed = refundAmount;
            amount.centAmount = refundAmountUsed;
            pendingTransactionAmount = transaction.custom.fields.isv_availableCaptureAmount - refundAmountUsed;
          }
          else if (transaction?.custom?.fields?.isv_availableCaptureAmount && Constants.VAL_ZERO != transaction.custom.fields.isv_availableCaptureAmount &&
            refundAmount >= transaction.custom.fields.isv_availableCaptureAmount) {
            updateTransactions.amount.centAmount = Number(transaction.custom.fields.isv_availableCaptureAmount);
            refundAmountUsed = Number(transaction.custom.fields.isv_availableCaptureAmount);
            amount.centAmount = refundAmountUsed;
            pendingTransactionAmount = transaction.custom.fields.isv_availableCaptureAmount - refundAmountUsed;
          }
          else if (refundAmount <= transaction.amount.centAmount && (!(Constants.STRING_CUSTOM in transaction))) {
            updateTransactions.amount.centAmount = refundAmount;
            refundAmountUsed = refundAmount;
            amount.centAmount = refundAmountUsed;
            pendingTransactionAmount = transaction.amount.centAmount - refundAmountUsed;
          }
          else if (refundAmount >= transaction.amount.centAmount && (!(Constants.STRING_CUSTOM in transaction))) {
            updateTransactions.amount.centAmount = transaction.amount.centAmount;
            refundAmountUsed = transaction.amount.centAmount;
            amount.centAmount = refundAmountUsed;
            pendingTransactionAmount = transaction.amount.centAmount - refundAmountUsed;
          }
        }
        if (null != captureId && Constants.VAL_ZERO != amount.centAmount) {
          orderResponse = await paymentRefund.refundResponse(updatePaymentObj, captureId, updateTransactions, orderNo);
          if (null != orderResponse && null != orderResponse.httpCode) {
            refundAmount = refundAmount - refundAmountUsed;
            if (Constants.API_STATUS_PENDING == orderResponse.status) {
              setCustomTypeData = paymentService.setCustomTypeData(transactionId, pendingTransactionAmount);
              actions.push(setCustomTypeData);
              refundAction = paymentService.addRefundAction(amount, orderResponse, Constants.CT_TRANSACTION_STATE_SUCCESS);
              actions.push(refundAction);
            }
            else {
              refundAction = paymentService.addRefundAction(amount, orderResponse, Constants.CT_TRANSACTION_STATE_FAILURE);
              actions.push(refundAction);
            }
          }
        }
      }
      if (null != actions) {
        refundResponse = {
          actions: actions,
          errors: []
        }
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_ADD_REFUND_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + paymentId, Constants.ERROR_MSG_SERVICE_PROCESS);
    }
  }
  catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_SERVICE_PROCESS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_SERVICE_PROCESS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_SERVICE_PROCESS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_ADD_REFUND_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + paymentId, exceptionData);
  }
  return refundResponse;
}

const getCardTokens = async (customerInfo, isvSavedToken) => {
  let existingTokens: any;
  let existingTokensMap: any;
  let newToken: any;
  let tokenLength = Constants.VAL_ZERO;
  let currentIndex = Constants.VAL_ZERO;
  let cardTokens = {
    customerTokenId: null,
    paymentInstrumentId: null,
  };
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
    tokenLength = customerInfo.custom.fields.isv_tokens.length;
    existingTokensMap.forEach((token, index) => {
      newToken = JSON.parse(token);
      currentIndex++;
      if (newToken.paymentToken == isvSavedToken) {
        cardTokens.customerTokenId = newToken.value;
        cardTokens.paymentInstrumentId = newToken.paymentToken;
      }
      if (tokenLength == currentIndex && null == cardTokens.customerTokenId) {
        cardTokens.customerTokenId = newToken.value;
      }
    });
  }
  return cardTokens;
};

const setCustomerTokenData = async (cardTokens, paymentResponse, authResponse, errorFlag, paymentMethod, updatePaymentObj, cartObj) => {
  let customerTokenResponse: any;
  let customerInfo: any;
  let failedToken: any;
  let existingFailedTokens: any;
  let existingFailedTokensMap: any;
  let existingTokens: any;
  let paymentInstrumentId = null;
  let instrumentIdentifier = null;
  let customerTokenId = null;
  let customerId = null;
  let addressId = null;
  let failedTokenLength = Constants.VAL_ZERO;
  if (null != cartObj && Constants.STRING_BILLING_ADDRESS in cartObj && Constants.STRING_ID in cartObj.billingAddress) {
    addressId = cartObj.billingAddress.id;
  }
  if (
    !errorFlag &&
    Constants.STRING_CUSTOMER in updatePaymentObj &&
    Constants.STRING_ID in updatePaymentObj.customer &&
    Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode &&
    Constants.API_STATUS_AUTHORIZED == paymentResponse.status &&
    (Constants.CREDIT_CARD == paymentMethod || Constants.CC_PAYER_AUTHENTICATION == paymentMethod) &&
    (null == updatePaymentObj.custom.fields.isv_savedToken || Constants.STRING_EMPTY == updatePaymentObj.custom.fields.isv_savedToken) &&
    Constants.ISV_TOKEN_ALIAS in updatePaymentObj.custom.fields &&
    Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_tokenAlias
  ) {
    if (
      paymentResponse.data.hasOwnProperty(Constants.TOKEN_INFORMATION) &&
      Constants.VAL_ZERO < Object.keys(paymentResponse.data.tokenInformation).length &&
      paymentResponse.data.tokenInformation.hasOwnProperty(Constants.PAYMENT_INSTRUMENT) &&
      Constants.VAL_ZERO < Object.keys(paymentResponse.data.tokenInformation.paymentInstrument).length
    ) {
      authResponse.actions.push({
        action: Constants.SET_CUSTOM_FIELD,
        name: Constants.ISV_SAVED_TOKEN,
        value: paymentResponse.data.tokenInformation.paymentInstrument.id,
      });
      if (null != cardTokens && null == cardTokens.customerTokenId && paymentResponse.data.tokenInformation.hasOwnProperty(Constants.STRING_CUSTOMER) && Constants.VAL_ZERO < Object.keys(paymentResponse.data.tokenInformation.customer).length) {
        customerTokenId = paymentResponse.data.tokenInformation.customer.id;
      } else {
        customerTokenId = cardTokens.customerTokenId;
      }
      paymentInstrumentId = paymentResponse.data.tokenInformation.paymentInstrument.id;
      instrumentIdentifier = paymentResponse.data.tokenInformation.instrumentIdentifier.id;
      customerTokenResponse = await processTokens(customerTokenId, paymentInstrumentId, instrumentIdentifier, updatePaymentObj, addressId);
      if (null != customerTokenResponse) {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_CUSTOMER_TOKEN_DATA, Constants.LOG_INFO, Constants.LOG_CUSTOMER_ID + updatePaymentObj.customer.id, Constants.SUCCESS_MSG_CARD_TOKENS_UPDATE);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_CUSTOMER_TOKEN_DATA, Constants.LOG_INFO, Constants.LOG_CUSTOMER_ID + updatePaymentObj.customer.id, Constants.ERROR_MSG_TOKEN_UPDATE);
      }
    }
  } else {
    if (
      Constants.STRING_CUSTOMER in updatePaymentObj &&
      Constants.STRING_ID in updatePaymentObj.customer &&
      Constants.API_STATUS_PENDING_AUTHENTICATION != paymentResponse.status &&
      Constants.API_STATUS_CUSTOMER_AUTHENTICATION_REQUIRED != paymentResponse.status &&
      (Constants.CREDIT_CARD == paymentMethod || Constants.CC_PAYER_AUTHENTICATION == paymentMethod) &&
      (null == updatePaymentObj.custom.fields.isv_savedToken || Constants.STRING_EMPTY == updatePaymentObj.custom.fields.isv_savedToken) &&
      Constants.ISV_TOKEN_ALIAS in updatePaymentObj.custom.fields &&
      Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_tokenAlias
    ) {
      customerId = updatePaymentObj.customer.id;
      customerInfo = await commercetoolsApi.getCustomer(customerId);
      failedToken = {
        alias: updatePaymentObj.custom.fields.isv_tokenAlias,
        cardType: updatePaymentObj.custom.fields.isv_cardType,
        cardName: updatePaymentObj.custom.fields.isv_cardType,
        cardNumber: updatePaymentObj.custom.fields.isv_maskedPan,
        cardExpiryMonth: updatePaymentObj.custom.fields.isv_cardExpiryMonth,
        cardExpiryYear: updatePaymentObj.custom.fields.isv_cardExpiryYear,
        addressId: addressId,
        timeStamp: new Date(Date.now()).toISOString(),
      };
      if (null != customerInfo) {
        if (Constants.STRING_CUSTOM in customerInfo && Constants.STRING_FIELDS in customerInfo.custom) {
          if (Constants.ISV_FAILED_TOKENS in customerInfo.custom.fields && Constants.STRING_EMPTY != customerInfo.custom.fields.isv_failedTokens && Constants.VAL_ZERO < customerInfo.custom.fields.isv_failedTokens.length) {
            existingFailedTokens = customerInfo.custom.fields.isv_failedTokens;
            existingFailedTokensMap = existingFailedTokens.map((item) => item);
            failedTokenLength = customerInfo.custom.fields.isv_failedTokens.length;
            existingFailedTokensMap[failedTokenLength] = JSON.stringify(failedToken)
          } else {
            existingFailedTokensMap = [JSON.stringify(failedToken)];
          }
          existingTokens = customerInfo.custom.fields.isv_tokens;
        } else {
          existingFailedTokensMap = [JSON.stringify(failedToken)];
        }
      }
      customerTokenResponse = await commercetoolsApi.setCustomType(updatePaymentObj.customer.id, existingTokens, existingFailedTokensMap);
      if (null != customerTokenResponse) {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_CUSTOMER_TOKEN_DATA, Constants.LOG_INFO, Constants.LOG_CUSTOMER_ID + updatePaymentObj.customer.id, Constants.SUCCESS_MSG_CARD_TOKENS_UPDATE);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_CUSTOMER_TOKEN_DATA, Constants.LOG_INFO, Constants.LOG_CUSTOMER_ID + updatePaymentObj.customer.id, Constants.ERROR_MSG_TOKEN_UPDATE);
      }
    }
  }
  return authResponse;
};

const processTokens = async (customerTokenId, paymentInstrumentId, instrumentIdentifier, updatePaymentObj, addressId) => {
  let customerInfo: any;
  let existingTokens: any;
  let existingTokensMap: any;
  let newToken: any;
  let parsedTokens: any;
  let updateTokenResponse: any;
  let length = Constants.VAL_NEGATIVE_ONE;
  let existingCardFlag = false;
  let customerId = updatePaymentObj.customer.id;
  customerInfo = await commercetoolsApi.getCustomer(customerId);
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
      if (newToken.cardNumber == updatePaymentObj.custom.fields.isv_maskedPan && newToken.value == customerTokenId && newToken.instrumentIdentifier == instrumentIdentifier) {
        length = index;
      }
    });
    if (Constants.VAL_NEGATIVE_ONE < length) {
      existingCardFlag = true;
      parsedTokens = JSON.parse(existingTokensMap[length]);
      parsedTokens.alias = updatePaymentObj.custom.fields.isv_tokenAlias;
      parsedTokens.value = customerTokenId;
      parsedTokens.paymentToken = paymentInstrumentId;
      parsedTokens.cardExpiryMonth = updatePaymentObj.custom.fields.isv_cardExpiryMonth;
      parsedTokens.cardExpiryYear = updatePaymentObj.custom.fields.isv_cardExpiryYear;
      parsedTokens.addressId = addressId;
      existingTokensMap[length] = JSON.stringify(parsedTokens)
      updateTokenResponse = await commercetoolsApi.setCustomType(customerId, existingTokensMap, customerInfo.custom.fields.isv_failedTokens);
    }
  }
  if (!existingCardFlag) {
    updateTokenResponse = await commercetoolsApi.setCustomerTokens(customerTokenId, paymentInstrumentId, instrumentIdentifier, updatePaymentObj, addressId);
  }
  return updateTokenResponse;
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
            existingTokensMap[length] = JSON.stringify(parsedTokens)
            returnResponse = paymentService.getUpdateTokenActions(existingTokensMap, customerObj.custom.fields.isv_failedTokens, errorFlag);
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
          customerTokenHandlerResponse = paymentService.getUpdateTokenActions(existingTokensMap, customerObj.custom.fields.isv_failedTokens, true);
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
  try {
    if (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ENABLE_RATE_LIMITER && null != customerId && null != customerObj) {
      cardRate = Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME ? process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME : Constants.DEFAULT_PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME;
      cardRateCount = Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE ? process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE : Constants.DEFAULT_PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE;
      startTime = new Date();
      startTime.setHours(startTime.getHours() - cardRate);
      limiterResponse = await rateLimiterAddToken(customerObj, new Date(startTime).toISOString(), new Date(Date.now()).toISOString());
      if (null != limiterResponse && limiterResponse >= parseInt(cardRateCount)) {
        dontSaveTokenFlag = true;
      }
    }
    if (
      !dontSaveTokenFlag &&
      Constants.STRING_CUSTOM in customerObj &&
      Constants.STRING_FIELDS in customerObj.custom &&
      Constants.ISV_ADDRESS_ID in customerObj.custom.fields &&
      Constants.STRING_EMPTY != customerObj.custom.fields.isv_addressId &&
      Constants.ISV_TOKEN in customerObj.custom.fields &&
      Constants.STRING_EMPTY != customerObj.custom.fields.isv_token
    ) {
      cardTokens = await getCardTokens(customerObj, null);
      addressObj.forEach((address) => {
        if (customerObj.custom.fields.isv_addressId == address.id) {
          addressData = address;
        }
      });
      cardResponse = await addTokenService.addTokenResponse(customerId, customerObj, addressData, cardTokens);
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
        if (Constants.ISV_TOKENS in customerObj.custom.fields && Constants.STRING_EMPTY != customerObj.custom.fields.isv_tokens && Constants.VAL_ZERO < customerObj.custom.fields.isv_tokens.length) {
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
            existingTokensMap[length] = JSON.stringify(parsedTokens)
          } else {
            newTokenFlag = true;
            tokensExists = true;
          }
        } else {
          newTokenFlag = true;
        }
        if (newTokenFlag) {
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
          if (tokensExists) {
            length = existingTokensMap.length;
            existingTokensMap[length] = JSON.stringify(tokenData)
          } else {
            existingTokensMap = [JSON.stringify(tokenData)];
          }
          customerTokenResponse = await paymentService.getUpdateTokenActions(existingTokensMap, customerObj.custom.fields.isv_failedTokens, true);
        } else {
          customerTokenResponse = await paymentService.getUpdateTokenActions(existingTokensMap, customerObj.custom.fields.isv_failedTokens, false);
        }
      } else {
        failedTokens = {
          alias: customerObj.custom.fields.isv_tokenAlias,
          cardType: customerObj.custom.fields.isv_cardType,
          cardName: customerObj.custom.fields.isv_cardType,
          cardNumber: customerObj.custom.fields.isv_maskedPan,
          cardExpiryMonth: customerObj.custom.fields.isv_cardExpiryMonth,
          cardExpiryYear: customerObj.custom.fields.isv_cardExpiryYear,
          addressId: customerObj.custom.fields.isv_addressId,
          timeStamp: new Date(Date.now()).toISOString(),
        };
        if (Constants.ISV_FAILED_TOKENS in customerObj.custom.fields && Constants.STRING_EMPTY != customerObj.custom.fields.isv_failedTokens && Constants.VAL_ZERO < customerObj.custom.fields.isv_failedTokens.length) {
          existingFailedTokens = customerObj.custom.fields.isv_failedTokens;
          existingFailedTokensMap = existingFailedTokens.map((item) => item);
          failedTokenLength = customerObj.custom.fields.isv_failedTokens.length;
          existingFailedTokensMap[failedTokenLength] = JSON.stringify(failedTokens)
        } else {
          existingFailedTokensMap = [JSON.stringify(failedTokens)];
        }
        if (Constants.ISV_TOKENS in customerObj.custom.fields && Constants.STRING_EMPTY != customerObj.custom.fields.isv_tokens && Constants.VAL_ZERO < customerObj.custom.fields.isv_tokens.length) {
          existingTokens = customerObj.custom.fields.isv_tokens;
        }
        customerTokenResponse = await paymentService.getUpdateTokenActions(existingTokens, existingFailedTokensMap, true);
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_CARD_HANDLER, Constants.LOG_ERROR, Constants.LOG_CUSTOMER_ID + customerId, Constants.ERROR_MSG_SERVICE_PROCESS);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_CARD_HANDLER, Constants.LOG_ERROR, Constants.LOG_CUSTOMER_ID + customerId, Constants.ERROR_MSG_INVALID_INPUT);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_CONVERSION_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_CONVERSION_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_CONVERSION_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ADD_CARD_HANDLER, Constants.LOG_ERROR, Constants.LOG_CUSTOMER_ID + customerId, exceptionData);
  }
  return customerTokenResponse;
};

const rateLimiterAddToken = async (customerObj, startTime, endTime) => {
  let existingTokens: any;
  let existingTokensMap: any;
  let existingFailedTokens: any;
  let existingFailedTokensMap: any;
  let tokenToCompare: any;
  let count = Constants.VAL_ZERO;
  if (Constants.STRING_CUSTOM in customerObj && Constants.ISV_FAILED_TOKENS in customerObj.custom.fields && Constants.STRING_EMPTY != customerObj.custom.fields.isv_failedTokens && Constants.VAL_ZERO < customerObj.custom.fields.isv_failedTokens.length) {
    existingFailedTokens = customerObj.custom.fields.isv_failedTokens;
    existingFailedTokensMap = existingFailedTokens.map((item) => item);
    existingFailedTokensMap.forEach((failToken) => {
      tokenToCompare = JSON.parse(failToken);
      if (tokenToCompare.timeStamp > startTime && tokenToCompare.timeStamp < endTime) {
        count++;
      }
    });
  }
  if (Constants.STRING_CUSTOM in customerObj && Constants.ISV_TOKENS in customerObj.custom.fields && Constants.STRING_EMPTY != customerObj.custom.fields.isv_tokens && Constants.VAL_ZERO < customerObj.custom.fields.isv_tokens.length) {
    existingTokens = customerObj.custom.fields.isv_tokens;
    existingTokensMap = existingTokens.map((item) => item);
    existingTokensMap.forEach((token) => {
      tokenToCompare = JSON.parse(token);
      if (tokenToCompare.timeStamp > startTime && tokenToCompare.timeStamp < endTime) {
        count++;
      }
    });
  }
  return count;
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
  }
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
                    latestTransaction = paymentDetails.transactions[paymentDetails.transactions.length - Constants.VAL_ONE]
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
  try {
    if (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_RUN_SYNC) {
      multiMidArray = await multiMid.getAllMidDetails();
      multiMidArray.push(midCredentials);
      for (let element of multiMidArray) {
        createSearchResponse = await createSearchRequest.getTransactionSearchResponse(Constants.STRING_SYNC_QUERY, Constants.STRING_SYNC_SORT, element);
        if (null != createSearchResponse && Constants.HTTP_CODE_TWO_HUNDRED_ONE == createSearchResponse.httpCode && undefined != createSearchResponse.data && undefined != createSearchResponse.data._embedded && undefined != createSearchResponse.data._embedded.transactionSummaries) {
          transactionSummaries = createSearchResponse.data._embedded.transactionSummaries;
          for (let element of transactionSummaries) {
            rowPresent = false;
            syncUpdateObject.securityCodePresent = false;
            if (Constants.VAL_THIRTY_SIX == element.clientReferenceInformation.code.length) {
              paymentDetails = await commercetoolsApi.retrievePayment(element.clientReferenceInformation.code);
              if (null != paymentDetails && Constants.STRING_TRANSACTIONS in paymentDetails) {
                if ((Constants.CC_PAYER_AUTHENTICATION == paymentDetails.paymentMethodInfo.method || Constants.CREDIT_CARD == paymentDetails.paymentMethodInfo.method) && paymentDetails?.custom?.fields?.isv_securityCode && null != paymentDetails.custom.fields.isv_securityCode) {
                  syncUpdateObject.securityCodePresent = true;
                }
                transactions = paymentDetails.transactions;
                applications = element.applicationInformation.applications;
                if (null != applications && null != transactions) {
                  applicationResponse = await getApplicationsPresent(applications);
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
                          syncUpdateObject.amountPlanned.centAmount = paymentService.convertAmountToCent(Number(element.orderInformation.amountDetails.totalAmount));
                        } else {
                          syncUpdateObject.amountPlanned.centAmount = paymentDetails.amountPlanned.centAmount;
                        }
                        if (!applicationResponse.authReasonCodePresent) {
                          syncUpdateObject.amountPlanned.currencyCode = paymentDetails.amountPlanned.currencyCode;
                          syncUpdateObject.amountPlanned.centAmount = paymentDetails.amountPlanned.centAmount;
                        }
                      } else {
                        syncUpdateObject.amountPlanned.currencyCode = element.orderInformation.amountDetails.currency;
                        syncUpdateObject.amountPlanned.centAmount = paymentService.convertAmountToCent(Number(element.orderInformation.amountDetails.totalAmount));
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
                        updateSyncResponse = await runSyncAddTransaction(syncUpdateObject, element.applicationInformation.reasonCode, applicationResponse.authPresent, applicationResponse.authReasonCodePresent);
                        if (null != updateSyncResponse && (Constants.CLICK_TO_PAY == paymentDetails.paymentMethodInfo.method || Constants.APPLE_PAY == paymentDetails.paymentMethodInfo.method)) {
                          await updateVisaDetails(paymentDetails, updateSyncResponse.version, element.id);
                        }
                      } else if (applicationResponse.capturePresent) {
                        syncUpdateObject.type = Constants.CT_TRANSACTION_TYPE_CHARGE;
                        updateSyncResponse = await runSyncAddTransaction(syncUpdateObject, element.applicationInformation.reasonCode, applicationResponse.authPresent, applicationResponse.authReasonCodePresent);
                      } else if (applicationResponse.authReversalPresent) {
                        syncUpdateObject.type = Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION;
                        updateSyncResponse = await runSyncAddTransaction(syncUpdateObject, element.applicationInformation.reasonCode, applicationResponse.authPresent, applicationResponse.authReasonCodePresent);
                      } else if (applicationResponse.refundPresent) {
                        syncUpdateObject.type = Constants.CT_TRANSACTION_TYPE_REFUND;
                        updateSyncResponse = await runSyncAddTransaction(syncUpdateObject, element.applicationInformation.reasonCode, applicationResponse.authPresent, applicationResponse.authReasonCodePresent);
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

const getApplicationsPresent = async (applications) => {
  let applicationResponse = {
    authPresent: false,
    authReasonCodePresent: false,
    capturePresent: false,
    captureReasonCodePresent: false,
    authReversalPresent: false,
    refundPresent: false,
  };
  if (null != applications) {
    if (applications.some((item) => Constants.STRING_SYNC_AUTH_NAME == item.name) || applications.some((item) => Constants.STRING_SYNC_ECHECK_DEBIT_NAME == item.name)) {
      applicationResponse.authPresent = true;
    }
    if (applications.some((item) => Constants.STRING_SYNC_AUTH_NAME == item.name && null != item.reasonCode && Constants.VAL_HUNDRED == item.reasonCode)) {
      applicationResponse.authReasonCodePresent = true;
    }
    if (applications.some((item) => Constants.STRING_SYNC_ECHECK_DEBIT_NAME == item.name && null == item.reasonCode)) {
      if (applications.some((nextItem) => Constants.STRING_SYNC_DECISION_NAME == nextItem.name && Constants.VAL_FOUR_EIGHTY == nextItem.reasonCode)) {
        applicationResponse.authReasonCodePresent = true;
      }
    }
    if (applications.some((item) => Constants.STRING_SYNC_CAPTURE_NAME == item.name)) {
      applicationResponse.capturePresent = true;
    }
    if (applications.some((item) => Constants.STRING_SYNC_CAPTURE_NAME == item.name && null != item.reasonCode && Constants.VAL_HUNDRED == item.reasonCode)) {
      applicationResponse.captureReasonCodePresent = true;
    }
    if (applications.some((item) => Constants.STRING_SYNC_AUTH_REVERSAL_NAME == item.name)) {
      applicationResponse.authReversalPresent = true;
    }
    if (applications.some((item) => (Constants.STRING_SYNC_REFUND_NAME == item.name || Constants.STRING_SYNC_ECHECK_CREDIT_NAME == item.name))) {
      applicationResponse.refundPresent = true;
    }
  } else {
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_APPLICATIONS_PRESENT, Constants.LOG_INFO, null, Constants.ERROR_MSG_APPLICATION_DETAILS);
  }
  return applicationResponse;
};

const updateVisaDetails = async (payment, paymentVersion, transactionId) => {
  let actions: any;
  let syncVisaCardDetailsResponse: any;
  let visaCheckoutData: any;
  let visaResponse: any;
  let cartDetails: any;
  let visaObject = {
    transactionId: null,
  };
  let updateResponse = {
    cartVersion: null,
    paymentVersion: null,
  };
  let visaUpdateObject = {
    id: null,
    version: null,
    actions: null,
  };
  if (null != payment && null != paymentVersion && null != transactionId) {
    visaObject.transactionId = transactionId;
    visaCheckoutData = await clickToPay.getVisaCheckoutData(visaObject, payment);
    if (null != visaCheckoutData) {
      cartDetails = await getCartDetailsByPaymentId(payment.id);
      if (null != cartDetails && Constants.STRING_CART_STATE == cartDetails.cartState) {
        visaResponse = await commercetoolsApi.updateCartByPaymentId(cartDetails.id, payment.id, cartDetails.version, visaCheckoutData);
        if (null != visaResponse) {
          updateResponse.cartVersion = visaResponse.version;
          actions = await paymentService.visaCardDetailsAction(visaCheckoutData);
          if (actions != null && Constants.VAL_ZERO < actions.length) {
            visaUpdateObject.actions = actions;
            visaUpdateObject.id = payment.id;
            visaUpdateObject.version = paymentVersion;
            syncVisaCardDetailsResponse = await commercetoolsApi.syncVisaCardDetails(visaUpdateObject);
            if (null != syncVisaCardDetailsResponse) {
              updateResponse.paymentVersion = syncVisaCardDetailsResponse.version;
            }
          }
        }
      }
    }
  } else {
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_VISA_DETAILS, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + payment.id, Constants.ERROR_MSG_PAYMENT_DETAILS);
  }
  return updateResponse;
};

const getCartDetailsByPaymentId = async (paymentId) => {
  let cartResponse: any;
  let cartDetails: any;
  if (null != paymentId) {
    cartResponse = await commercetoolsApi.retrieveCartByPaymentId(paymentId);
    if (null != cartResponse && Constants.VAL_ZERO < cartResponse.count) {
      cartDetails = cartResponse.results[Constants.VAL_ZERO];
    }
  } else {
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CART_DETAILS_BY_PAYMENT_ID, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + paymentId, Constants.ERROR_MSG_PAYMENT_DETAILS);
  }
  return cartDetails;
};

const runSyncAddTransaction = async (syncUpdateObject, reasonCode, authPresent, authReasonCodePresent) => {
  let updateSyncResponse: any;
  let transactionDetail: any;
  let transactionSummaries: any;
  let applications: any;
  let paymentDetails: any;
  let transactions: any;
  let query = Constants.STRING_EMPTY;
  let authReversalTriggered = false;
  let refundAmount = Constants.VAL_FLOAT_ZERO;
  let authReversalObject = {
    paymentId: null,
    version: null,
    amount: null,
    type: Constants.STRING_EMPTY,
    state: Constants.STRING_EMPTY,
  };
  let authMid: any;
  if (null != syncUpdateObject && null != reasonCode) {
    if (Constants.VAL_HUNDRED == reasonCode && Constants.CT_TRANSACTION_TYPE_REFUND != syncUpdateObject.type) {
      syncUpdateObject.state = Constants.CT_TRANSACTION_STATE_SUCCESS;
      updateSyncResponse = await commercetoolsApi.syncAddTransaction(syncUpdateObject);
    } else if (Constants.VAL_HUNDRED == reasonCode && Constants.CT_TRANSACTION_TYPE_REFUND == syncUpdateObject.type) {
      syncUpdateObject.state = Constants.CT_TRANSACTION_STATE_SUCCESS;
      updateSyncResponse = await commercetoolsApi.syncAddTransaction(syncUpdateObject);
      refundAmount = syncUpdateObject.amountPlanned.centAmount;
      updateSyncResponse = await runSyncUpdateCaptureAmount(updateSyncResponse, refundAmount);
    } else if (Constants.VAL_FOUR_EIGHTY == reasonCode && authPresent && authReasonCodePresent) {
      syncUpdateObject.state = Constants.CT_TRANSACTION_STATE_PENDING;
      updateSyncResponse = await commercetoolsApi.syncAddTransaction(syncUpdateObject);
    } else if (Constants.VAL_FOUR_EIGHTY_ONE == reasonCode && authPresent && authReasonCodePresent) {
      syncUpdateObject.state = Constants.CT_TRANSACTION_STATE_SUCCESS;
      updateSyncResponse = await commercetoolsApi.syncAddTransaction(syncUpdateObject);
      query = Constants.PAYMENT_GATEWAY_CLIENT_REFERENCE_CODE + syncUpdateObject.id + Constants.STRING_AND + Constants.STRING_SYNC_QUERY;
      paymentDetails = await commercetoolsApi.retrievePayment(syncUpdateObject.id);
      if (paymentDetails) {
        authMid = await multiMid.getMidCredentials(paymentDetails);
        transactionDetail = await createSearchRequest.getTransactionSearchResponse(query, Constants.STRING_SYNC_SORT, authMid);
        if (null != transactionDetail && Constants.HTTP_CODE_TWO_HUNDRED_ONE == transactionDetail.httpCode && transactionDetail?.data?._embedded?.transactionSummaries) {
          transactionSummaries = transactionDetail.data._embedded.transactionSummaries;
          for (let element of transactionSummaries) {
            applications = element.applicationInformation.applications;
            for (let application of applications) {
              if (Constants.STRING_SYNC_AUTH_REVERSAL_NAME == application.name) {
                if (Constants.VAL_THIRTY_SIX == element.clientReferenceInformation.code.length) {
                  paymentDetails = await commercetoolsApi.retrievePayment(element.clientReferenceInformation.code);
                  if (null != paymentDetails && Constants.STRING_TRANSACTIONS in paymentDetails) {
                    transactions = paymentDetails.transactions;
                    if (null != applications && null != transactions) {
                      if (transactions.some((item) => item.interactionId == element.id)) {
                        if (Constants.APPLICATION_RCODE == application.rCode && Constants.APPLICATION_RFLAG == application.rFlag) {
                          authReversalTriggered = true;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (!authReversalTriggered) {
        authReversalObject.paymentId = syncUpdateObject.id;
        authReversalObject.state = Constants.CT_TRANSACTION_STATE_INITIAL;
        authReversalObject.type = Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION;
        authReversalObject.amount = syncUpdateObject.amountPlanned;
        authReversalObject.version = updateSyncResponse.version;
        updateSyncResponse = await commercetoolsApi.addTransaction(authReversalObject);
      }
    } else if ((Constants.VAL_FOUR_EIGHTY == reasonCode || Constants.VAL_FOUR_EIGHTY_ONE == reasonCode) && authPresent && !authReasonCodePresent) {
      syncUpdateObject.state = Constants.CT_TRANSACTION_STATE_FAILURE;
      updateSyncResponse = await commercetoolsApi.syncAddTransaction(syncUpdateObject);
    } else if (Constants.VAL_HUNDRED != reasonCode && Constants.VAL_FOUR_SEVENTY_FIVE != reasonCode) {
      syncUpdateObject.state = Constants.CT_TRANSACTION_STATE_FAILURE;
      updateSyncResponse = await commercetoolsApi.syncAddTransaction(syncUpdateObject);
    }
  } else {
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RUN_SYNC_ADD_TRANSACTION, Constants.LOG_INFO, null, Constants.ERROR_MSG_FETCH_TRANSACTIONS);
  }
  return updateSyncResponse;
};

const runSyncUpdateCaptureAmount = async (updatePaymentObj, amount) => {
  let refundAmount: any;
  let pendingTransactionAmount: any;
  let transactionId: any;
  let updateTransactions: any;
  let refundTriggered = false;
  let updateResponse: any;
  let paymentId: any;
  let paymentVersion: any;
  let refundAmountUsed: any;
  if (null != updatePaymentObj && null != amount && amount > 0) {
    refundAmount = amount;
    updateTransactions = updatePaymentObj.transactions;
    paymentId = updatePaymentObj.id;
    paymentVersion = updatePaymentObj.version;
    for (let transaction of updateTransactions) {
      if (Constants.CT_TRANSACTION_TYPE_CHARGE == transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS == transaction.state) {
        if (refundAmount <= transaction.amount.centAmount && (!(Constants.STRING_CUSTOM in transaction))) {
          transactionId = transaction.id;
          pendingTransactionAmount = transaction.amount.centAmount - refundAmount;
          refundTriggered = true;
          updateResponse = await commercetoolsApi.updateAvailableAmount(paymentId, paymentVersion, transactionId, pendingTransactionAmount);
          break;
        }
        else if (refundAmount <= transaction.amount.centAmount && transaction?.custom?.fields?.isv_availableCaptureAmount && Constants.VAL_ZERO != transaction.custom.fields.isv_availableCaptureAmount && transaction.custom.fields.isv_availableCaptureAmount >= refundAmount) {
          transactionId = transaction.id;
          pendingTransactionAmount = transaction.custom.fields.isv_availableCaptureAmount - refundAmount;
          refundTriggered = true;
          updateResponse = await commercetoolsApi.updateAvailableAmount(paymentId, paymentVersion, transactionId, pendingTransactionAmount);
          break;
        }
      }
    }
    if (!refundTriggered) {
      for (let transaction of updateTransactions) {
        transactionId = null;
        if (Constants.CT_TRANSACTION_TYPE_CHARGE == transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS == transaction.state && refundAmount > 0) {
          if (transaction?.custom?.fields?.isv_availableCaptureAmount && Constants.VAL_ZERO != transaction.custom.fields.isv_availableCaptureAmount &&
            refundAmount <= transaction.custom.fields.isv_availableCaptureAmount) {
            transactionId = transaction.id;
            refundAmountUsed = refundAmount;
            pendingTransactionAmount = transaction.custom.fields.isv_availableCaptureAmount - refundAmountUsed;
            refundAmount = refundAmount - refundAmountUsed;
          }
          else if (transaction?.custom?.fields?.isv_availableCaptureAmount && Constants.VAL_ZERO != transaction.custom.fields.isv_availableCaptureAmount &&
            refundAmount >= transaction.custom.fields.isv_availableCaptureAmount) {
            transactionId = transaction.id;
            refundAmountUsed = Number(transaction.custom.fields.isv_availableCaptureAmount);
            pendingTransactionAmount = transaction.custom.fields.isv_availableCaptureAmount - refundAmountUsed;
            refundAmount = refundAmount - refundAmountUsed;
          }
          else if (refundAmount <= transaction.amount.centAmount && (!(Constants.STRING_CUSTOM in transaction))) {
            transactionId = transaction.id;
            refundAmountUsed = refundAmount;
            pendingTransactionAmount = transaction.amount.centAmount - refundAmountUsed;
            refundAmount = refundAmount - refundAmountUsed;
          }
          else if (refundAmount >= transaction.amount.centAmount && (!(Constants.STRING_CUSTOM in transaction))) {
            transactionId = transaction.id;
            refundAmountUsed = transaction.amount.centAmount;
            pendingTransactionAmount = transaction.amount.centAmount - refundAmountUsed;
            refundAmount = refundAmount - refundAmountUsed;
          }
        }
        if (null != transactionId) {
          updateResponse = await commercetoolsApi.updateAvailableAmount(paymentId, paymentVersion, transactionId, pendingTransactionAmount);
          paymentVersion = updateResponse.version;
        }
      }
    }
  }
  else {
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RUN_SYNC_UPDATE_CAPTURE_AMOUNT, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + paymentId, Constants.ERROR_MSG_PAYMENT_DETAILS);
  }
  return updateResponse;
}

const getOrderId = async (cartObj, paymentId) => {
  let orderObj: any;
  let orderNo = null;
  if (null != cartObj && Constants.VAL_ZERO < cartObj.count) {
    orderObj = await commercetoolsApi.retrieveOrderByCartId(cartObj.results[Constants.VAL_ZERO].id);
    if (null != orderObj && Constants.VAL_ZERO < orderObj.count && Constants.STRING_ORDER_NUMBER in orderObj.results[Constants.VAL_ZERO]) {
      orderNo = orderObj.results[Constants.VAL_ZERO].orderNumber;
    }
  }
  if (null == orderNo) {
    orderObj = await commercetoolsApi.retrieveOrderByPaymentId(paymentId);
    if (null != orderObj && Constants.VAL_ZERO < orderObj.count && Constants.STRING_ORDER_NUMBER in orderObj.results[Constants.VAL_ZERO]) {
      orderNo = orderObj.results[Constants.VAL_ZERO].orderNumber;
    }
  }
  return orderNo;
};

const updateCustomField = async (customFields, getCustomObj, typeId, version) => {
  let result: any;
  let exceptionData: any;
  let fieldExist = false;
  try {
    if (null != customFields && null != getCustomObj && null != typeId && null != version) {
      for (let field of customFields) {
        fieldExist = false;
        getCustomObj.forEach((custom) => {
          if (field.name == custom.name) {
            fieldExist = true;
          }
        });
        if (!fieldExist) {
          result = await commercetoolsApi.addCustomField(typeId, version, field);
          version = result.version;
        }
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_CUSTOM_FIELDS, Constants.LOG_INFO, null, Constants.ERROR_MSG_UPDATE_CUSTOM_TYPE);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_SYNC_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_CUSTOM_FIELDS, Constants.LOG_ERROR, null, exceptionData);
  }
};

export default {
  authorizationHandler,
  getPayerAuthSetUpResponse,
  getPayerAuthEnrollResponse,
  getPayerAuthValidateResponse,
  getPayerAuthReversalHandler,
  applePaySessionHandler,
  orderManagementHandler,
  updateCardHandler,
  deleteCardHandler,
  reportHandler,
  syncHandler,
  addCardHandler,
  updateCustomField,
};