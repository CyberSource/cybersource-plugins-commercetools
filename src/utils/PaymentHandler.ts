import path from 'path';
import axios from 'axios';
import fs from 'fs';
import https from 'https';

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
import { Constants } from '../constants';

const authorizationHandler = async (updatePaymentObj, updateTransactions) => {
  let paymentMethod: string;
  let authResponse: any;
  let paymentResponse: any;
  let cartObj: any;
  let serviceResponse: any;
  let exceptionData: any;
  let cardTokens: any;
  let authReversalResponse: any;
  let stateChangeResponse: any;
  let paymentInstrumentToken = null;
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
          cardTokens = await getCardTokens(updatePaymentObj.customer.id, paymentInstrumentToken);
        }
        paymentMethod = updatePaymentObj.paymentMethodInfo.method;
        switch (paymentMethod) {
          case Constants.CREDIT_CARD: {
            serviceResponse = await getCardWithout3dsResponse(updatePaymentObj, cartObj.results[Constants.VAL_ZERO], updateTransactions, cardTokens);
            paymentResponse = serviceResponse.paymentResponse;
            authResponse = serviceResponse.authResponse;
            errorFlag = serviceResponse.errorFlag;
            break;
          }
          case Constants.CC_PAYER_AUTHENTICATION: {
            serviceResponse = await getCardWith3dsResponse(updatePaymentObj, cartObj.results[Constants.VAL_ZERO], updateTransactions, cardTokens);
            paymentResponse = serviceResponse.paymentResponse;
            authResponse = serviceResponse.authResponse;
            errorFlag = serviceResponse.errorFlag;
            break;
          }
          case Constants.VISA_CHECKOUT: {
            serviceResponse = await clickToPayResponse(updatePaymentObj, cartObj.results[Constants.VAL_ZERO], updateTransactions, cardTokens);
            paymentResponse = serviceResponse.paymentResponse;
            authResponse = serviceResponse.authResponse;
            errorFlag = serviceResponse.errorFlag;
            break;
          }
          case Constants.GOOGLE_PAY: {
            serviceResponse = await googlePayResponse(updatePaymentObj, cartObj.results[Constants.VAL_ZERO], updateTransactions, cardTokens);
            paymentResponse = serviceResponse.paymentResponse;
            authResponse = serviceResponse.authResponse;
            errorFlag = serviceResponse.errorFlag;
            break;
          }
          case Constants.APPLE_PAY: {
            serviceResponse = await getCardWithout3dsResponse(updatePaymentObj, cartObj.results[Constants.VAL_ZERO], updateTransactions, cardTokens);
            paymentResponse = serviceResponse.paymentResponse;
            authResponse = serviceResponse.authResponse;
            errorFlag = serviceResponse.errorFlag;
            break;
          }
          default: {
            paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_HANDLER, Constants.LOG_INFO, Constants.ERROR_MSG_NO_PAYMENT_METHODS);
            errorFlag = true;
            break;
          }
        }
        authResponse = await setCustomerTokenData(cardTokens, paymentResponse, authResponse, errorFlag, paymentMethod, updatePaymentObj);
        if (
          (Constants.ISV_SAVED_TOKEN in updatePaymentObj.custom.fields &&
            Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_savedToken &&
            Constants.ISV_TOKEN_VERIFICATION_CONTEXT in updatePaymentObj.custom.fields &&
            null != updatePaymentObj.custom.fields.isv_tokenVerificationContext &&
            Constants.STRING_EMPTY != updatePaymentObj.custom.fields.isv_tokenVerificationContext) ||
          (paymentMethod != Constants.CREDIT_CARD &&
            paymentMethod != Constants.CC_PAYER_AUTHENTICATION &&
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
        if (null != paymentResponse && Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode && Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == paymentResponse.status) {
          authReversalResponse = await paymentAuthReversal.authReversalResponse(updatePaymentObj, cartObj, paymentResponse.transactionId);
          if (null != authReversalResponse && Constants.HTTP_CODE_TWO_HUNDRED_ONE == authReversalResponse.httpCode && Constants.API_STATUS_REVERSED == authReversalResponse.status) {
            stateChangeResponse = await commercetoolsApi.retrievePayment(updatePaymentObj.id);
            if (null != stateChangeResponse && Constants.STRING_AMOUNT_PLANNED in stateChangeResponse) {
              authResponse.actions.push({
                action: Constants.ADD_TRANSACTION,
                transaction: {
                  type: Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION,
                  timestamp: new Date(Date.now()).toISOString(),
                  amount: stateChangeResponse.amountPlanned,
                  state: Constants.CT_TRANSACTION_STATE_SUCCESS,
                  interactionId: authReversalResponse.transactionId,
                },
              });
            }
          } else {
            stateChangeResponse = await commercetoolsApi.retrievePayment(updatePaymentObj.id);
            if (null != stateChangeResponse && Constants.STRING_AMOUNT_PLANNED in stateChangeResponse) {
              authResponse.actions.push({
                action: Constants.ADD_TRANSACTION,
                transaction: {
                  type: Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION,
                  timestamp: new Date(Date.now()).toISOString(),
                  amount: stateChangeResponse.amountPlanned,
                  state: Constants.CT_TRANSACTION_STATE_FAILURE,
                  interactionId: authReversalResponse.transactionId,
                },
              });
            }
          }
        }
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_HANDLER, Constants.LOG_INFO, Constants.ERROR_MSG_EMPTY_CART);
        errorFlag = true;
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_HANDLER, Constants.LOG_INFO, Constants.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_HANDLER, Constants.LOG_ERROR, JSON.stringify(exception));
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_HANDLER, Constants.LOG_ERROR, exceptionData);
    errorFlag = true;
  }
  if (errorFlag) {
    authResponse = paymentService.invalidInputResponse();
  }
  return authResponse;
};

const getPayerAuthSetUpResponse = async (updatePaymentObj) => {
  let setUpServiceResponse: any;
  let setUpActionResponse: any;
  let exceptionData: any;
  let cardTokens: any;
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
        cardTokens = await getCardTokens(updatePaymentObj.customer.id, paymentInstrumentToken);
      }
      setUpServiceResponse = await paymentAuthSetUp.payerAuthSetupResponse(updatePaymentObj, cardTokens);
      if (null != setUpServiceResponse && null != setUpServiceResponse.httpCode) {
        setUpActionResponse = paymentService.getAuthResponse(setUpServiceResponse, null);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_SETUP_RESPONSE, Constants.LOG_INFO, Constants.ERROR_MSG_SERVICE_PROCESS);
        errorFlag = true;
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_SETUP_RESPONSE, Constants.LOG_INFO, Constants.ERROR_MSG_NO_CARD_DETAILS);
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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_SETUP_RESPONSE, Constants.LOG_ERROR, exceptionData);
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
  let cardinalReferenceId = null;
  let paymentInstrumentToken = null;
  let errorFlag = false;
  let dontSaveTokenFlag = false;
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
          cardTokens = await getCardTokens(updatePaymentObj.customer.id, paymentInstrumentToken);
        }
        if (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ENABLE_RATE_LIMITER && Constants.STRING_CUSTOMER in updatePaymentObj && Constants.STRING_ID in updatePaymentObj.customer && null != updatePaymentObj.customer.id) {
          if (Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE && Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME) {
            cardRate = process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME;
            cardRateCount = process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE;
            startTime = new Date();
            startTime.setHours(startTime.getHours() - cardRate);
            limiterResponse = await commercetoolsApi.retrievePaymentByCustomerId(updatePaymentObj.customer.id, new Date(startTime).toISOString(), new Date(Date.now()).toISOString());
            if (null != limiterResponse && limiterResponse.count > parseInt(cardRateCount)) {
              dontSaveTokenFlag = true;
            }
          } else {
            paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_ENROLL_RESPONSE, Constants.LOG_INFO, Constants.ERROR_MSG_RATE_LIMITER);
          }
        }
        enrollServiceResponse = await paymentAuthorization.authorizationResponse(updatePaymentObj, cartObj.results[Constants.VAL_ZERO], Constants.STRING_ENROLL_CHECK, cardTokens, dontSaveTokenFlag);
        if (null != enrollServiceResponse && null != enrollServiceResponse.httpCode) {
          enrollServiceResponse.cardinalReferenceId = cardinalReferenceId;
          enrollResponse = paymentService.payerEnrollActions(enrollServiceResponse, updatePaymentObj);
          enrollAuthResponse = paymentService.getAuthResponse(enrollServiceResponse, null);
          if (null != enrollAuthResponse && Constants.VAL_ZERO < enrollAuthResponse.actions.length) {
            enrollAuthResponse.actions.forEach((i) => {
              enrollResponse.actions.push(i);
            });
          }
          enrollResponse = await setCustomerTokenData(cardTokens, enrollServiceResponse, enrollResponse, false, updatePaymentObj.paymentMethodInfo.method, updatePaymentObj);
        } else {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_ENROLL_RESPONSE, Constants.LOG_INFO, Constants.ERROR_MSG_SERVICE_PROCESS);
          errorFlag = true;
        }
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_ENROLL_RESPONSE, Constants.LOG_INFO, Constants.ERROR_MSG_EMPTY_CART);
        errorFlag = true;
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_ENROLL_RESPONSE, Constants.LOG_INFO, Constants.ERROR_MSG_NO_CARD_DETAILS);
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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_ENROLL_RESPONSE, Constants.LOG_ERROR, exceptionData);
    errorFlag = true;
  }
  if (errorFlag) {
    enrollResponse = paymentService.invalidInputResponse();
  }
  return enrollResponse;
};

const getPayerAuthEnrollAuthReversalHandler = async (updatePaymentObj, paymentResponse, updateTransactions, updateActions) => {
  let authReversalResponse: any;
  let stateChangeResponse: any;
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
    authReversalResponse = await paymentAuthReversal.authReversalResponse(updatePaymentObj, cartObj, paymentResponse.transactionId);
    if (null != authReversalResponse && Constants.HTTP_CODE_TWO_HUNDRED_ONE == authReversalResponse.httpCode && Constants.API_STATUS_REVERSED == authReversalResponse.status) {
      stateChangeResponse = await commercetoolsApi.retrievePayment(updatePaymentObj.id);
      if (null != stateChangeResponse && Constants.STRING_AMOUNT_PLANNED in stateChangeResponse) {
        updateActions.actions.push({
          action: Constants.ADD_TRANSACTION,
          transaction: {
            type: Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION,
            timestamp: new Date(Date.now()).toISOString(),
            amount: stateChangeResponse.amountPlanned,
            state: Constants.CT_TRANSACTION_STATE_SUCCESS,
            interactionId: authReversalResponse.transactionId,
          },
        });
      }
    } else {
      stateChangeResponse = await commercetoolsApi.retrievePayment(updatePaymentObj.id);
      if (null != stateChangeResponse && Constants.STRING_AMOUNT_PLANNED in stateChangeResponse) {
        updateActions.actions.push({
          action: Constants.ADD_TRANSACTION,
          transaction: {
            type: Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION,
            timestamp: new Date(Date.now()).toISOString(),
            amount: stateChangeResponse.amountPlanned,
            state: Constants.CT_TRANSACTION_STATE_FAILURE,
            interactionId: authReversalResponse.transactionId,
          },
        });
      }
    }
  } else {
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_PAYER_AUTH_ENROLL_AUTH_REVERSAL_HANDLER, Constants.LOG_INFO, Constants.ERROR_MSG_EMPTY_TRANSACTION_DETAILS);
  }
  return updateActions;
};

const getCardWithout3dsResponse = async (updatePaymentObj, cartObj, updateTransactions, cardTokens) => {
  let authResponse: any;
  let paymentResponse: any;
  let cardDetails: any;
  let actions: any;
  let startTime: any;
  let limiterResponse: any;
  let cardRate: any;
  let cardRateCount: any;
  let dontSaveTokenFlag = false;
  let returnResponse = {
    paymentResponse: null,
    authResponse: null,
    errorFlag: false,
  };
  if (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ENABLE_RATE_LIMITER && null != updatePaymentObj && Constants.STRING_CUSTOMER in updatePaymentObj && Constants.STRING_ID in updatePaymentObj.customer && null != updatePaymentObj.customer.id) {
    if (Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE && Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME) {
      cardRate = process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME;
      cardRateCount = process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE;
      startTime = new Date();
      startTime.setHours(startTime.getHours() - cardRate);
      limiterResponse = await commercetoolsApi.retrievePaymentByCustomerId(updatePaymentObj.customer.id, new Date(startTime).toISOString(), new Date(Date.now()).toISOString());
      if (null != limiterResponse && limiterResponse.count > parseInt(cardRateCount)) {
        dontSaveTokenFlag = true;
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CARD_WITHOUT_3DS_RESPONSE, Constants.LOG_INFO, Constants.ERROR_MSG_RATE_LIMITER);
    }
  }
  paymentResponse = await paymentAuthorization.authorizationResponse(updatePaymentObj, cartObj, Constants.STRING_CARD, cardTokens, dontSaveTokenFlag);
  if (null != updatePaymentObj && null != paymentResponse && null != paymentResponse.httpCode) {
    authResponse = paymentService.getAuthResponse(paymentResponse, updateTransactions);
    if (null != authResponse) {
      if (Constants.APPLE_PAY == updatePaymentObj.paymentMethodInfo.method) {
        cardDetails = await clickToPay.getVisaCheckoutData(paymentResponse);
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
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CARD_WITHOUT_3DS_RESPONSE, Constants.LOG_INFO, Constants.ERROR_MSG_SERVICE_PROCESS);
      returnResponse.errorFlag = true;
    }
  } else {
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CARD_WITHOUT_3DS_RESPONSE, Constants.LOG_INFO, Constants.ERROR_MSG_SERVICE_PROCESS);
    returnResponse.errorFlag = true;
  }
  returnResponse.paymentResponse = paymentResponse;
  returnResponse.authResponse = authResponse;
  return returnResponse;
};

const getCardWith3dsResponse = async (updatePaymentObj, cartObj, updateTransactions, cardTokens) => {
  let authResponse: any;
  let paymentResponse: any;
  let startTime: any;
  let limiterResponse: any;
  let cardRate: any;
  let cardRateCount: any;
  let service: string;
  let dontSaveTokenFlag = false;
  let returnResponse = {
    paymentResponse: null,
    authResponse: null,
    errorFlag: false,
  };
  if (null != updatePaymentObj && updatePaymentObj.custom.fields.isv_payerAuthenticationRequired) {
    service = Constants.VALIDATION;
  } else {
    service = Constants.STRING_CARD;
  }
  if (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ENABLE_RATE_LIMITER && null != updatePaymentObj && Constants.STRING_CUSTOMER in updatePaymentObj && Constants.STRING_ID in updatePaymentObj.customer && null != updatePaymentObj.customer.id) {
    if (Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE && Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME) {
      cardRate = process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME;
      cardRateCount = process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE;
      startTime = new Date();
      startTime.setHours(startTime.getHours() - cardRate);
      limiterResponse = await commercetoolsApi.retrievePaymentByCustomerId(updatePaymentObj.customer.id, new Date(startTime).toISOString(), new Date(Date.now()).toISOString());
      if (null != limiterResponse && limiterResponse.count > parseInt(cardRateCount)) {
        dontSaveTokenFlag = true;
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CARD_WITH_3DS_RESPONSE, Constants.LOG_INFO, Constants.ERROR_MSG_RATE_LIMITER);
    }
  }
  paymentResponse = await paymentAuthorization.authorizationResponse(updatePaymentObj, cartObj, service, cardTokens, dontSaveTokenFlag);
  if (null != updatePaymentObj && null != paymentResponse && null != paymentResponse.httpCode) {
    authResponse = paymentService.getAuthResponse(paymentResponse, updateTransactions);
    if (null != authResponse) {
      if (Constants.VALIDATION == service) {
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
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CARD_WITH_3DS_RESPONSE, Constants.LOG_INFO, Constants.ERROR_MSG_SERVICE_PROCESS);
      returnResponse.errorFlag = true;
    }
  } else {
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CARD_WITH_3DS_RESPONSE, Constants.LOG_INFO, Constants.ERROR_MSG_SERVICE_PROCESS);
    returnResponse.errorFlag = true;
  }
  returnResponse.paymentResponse = paymentResponse;
  returnResponse.authResponse = authResponse;
  return returnResponse;
};

const clickToPayResponse = async (updatePaymentObj, cartObj, updateTransactions, customerTokenId) => {
  let authResponse: any;
  let paymentResponse: any;
  let cartUpdate: any;
  let visaCheckoutData: any;
  let actions: any;
  let dontSaveTokenFlag = false;
  let returnResponse = {
    paymentResponse: null,
    authResponse: null,
    errorFlag: false,
  };
  paymentResponse = await paymentAuthorization.authorizationResponse(updatePaymentObj, cartObj, Constants.STRING_VISA, customerTokenId, dontSaveTokenFlag);
  if (null != paymentResponse && null != paymentResponse.httpCode) {
    authResponse = paymentService.getAuthResponse(paymentResponse, updateTransactions);
    if (null != authResponse) {
      visaCheckoutData = await clickToPay.getVisaCheckoutData(paymentResponse);
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
        cartUpdate = await commercetoolsApi.updateCartByPaymentId(cartObj.id, cartObj.version, visaCheckoutData);
        if (null != cartUpdate) {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CLICK_TO_PAY, Constants.LOG_INFO, Constants.SUCCESS_MSG_UPDATE_CLICK_TO_PAY_CARD_DETAILS);
        }
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CLICK_TO_PAY, Constants.LOG_INFO, Constants.ERROR_MSG_UPDATE_CLICK_TO_PAY_DATA);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CLICK_TO_PAY, Constants.LOG_INFO, Constants.ERROR_MSG_SERVICE_PROCESS);
      returnResponse.errorFlag = true;
    }
  } else {
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CLICK_TO_PAY, Constants.LOG_INFO, Constants.ERROR_MSG_SERVICE_PROCESS);
    returnResponse.errorFlag = true;
  }
  returnResponse.paymentResponse = paymentResponse;
  returnResponse.authResponse = authResponse;
  return returnResponse;
};

const googlePayResponse = async (updatePaymentObj, cartObj, updateTransactions, customerTokenId) => {
  let authResponse: any;
  let paymentResponse: any;
  let actions: any;
  let dontSaveTokenFlag = false;
  let cardDetails = {
    cardFieldGroup: null,
  };
  let returnResponse = {
    paymentResponse: null,
    authResponse: null,
    errorFlag: false,
  };
  paymentResponse = await paymentAuthorization.authorizationResponse(updatePaymentObj, cartObj, Constants.STRING_GOOGLE, customerTokenId, dontSaveTokenFlag);
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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GOOGLE_PAY_RESPONSE, Constants.LOG_INFO, Constants.ERROR_MSG_SERVICE_PROCESS);
    returnResponse.errorFlag = true;
  }
  returnResponse.paymentResponse = paymentResponse;
  returnResponse.authResponse = authResponse;
  return returnResponse;
};

const applePaySessionHandler = async (fields) => {
  let serviceResponse: any;
  let exceptionData: any;
  let httpsAgent: any;
  let cert: any;
  let key: any;
  let body: any;
  let domainName: any;
  let applePaySession: any;
  let errorFlag = false;
  try {
    if (null != fields && Constants.ISV_APPLE_PAY_VALIDATION_URL in fields && Constants.STRING_EMPTY != fields.isv_applePayValidationUrl && Constants.ISV_APPLE_PAY_DISPLAY_NAME in fields && Constants.STRING_EMPTY != fields.isv_applePayDisplayName) {
      if (Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_APPLE_PAY_CERTIFICATE_PATH && Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_APPLE_PAY_KEY_PATH) {
        cert = process.env.PAYMENT_GATEWAY_APPLE_PAY_CERTIFICATE_PATH;
        key = process.env.PAYMENT_GATEWAY_APPLE_PAY_KEY_PATH;
        httpsAgent = new https.Agent({
          rejectUnauthorized: false,
          cert: fs.readFileSync(cert),
          key: fs.readFileSync(key),
        });
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
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_APPLE_PAY_SESSION_HANDLER, Constants.LOG_ERROR, Constants.ERROR_MSG_APPLE_PAY_CERTIFICATES);
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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_APPLE_PAY_SESSION_HANDLER, Constants.LOG_ERROR, exceptionData);
    errorFlag = true;
  }
  if (errorFlag) {
    serviceResponse = paymentService.invalidInputResponse();
  }
  return serviceResponse;
};

const getCardTokens = async (customerId, isvSavedToken) => {
  let customerInfo: any;
  let existingTokens: any;
  let existingTokensMap: any;
  let newToken: any;
  let tokenLength = Constants.VAL_ZERO;
  let currentIndex = Constants.VAL_ZERO;
  let cardTokens = {
    customerTokenId: null,
    paymentInstrumentId: null,
  };
  if (null != customerId) {
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
  }
  return cardTokens;
};

const setCustomerTokenData = async (cardTokens, paymentResponse, authResponse, errorFlag, paymentMethod, updatePaymentObj) => {
  let customerTokenResponse: any;
  let paymentInstrumentId = null;
  let instrumentIdentifier = null;
  let customerTokenId = null;
  if (
    !errorFlag &&
    Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode &&
    Constants.API_STATUS_AUTHORIZED == paymentResponse.status &&
    (Constants.CREDIT_CARD == paymentMethod || Constants.CC_PAYER_AUTHENTICATION == paymentMethod) &&
    null == updatePaymentObj.custom.fields.isv_savedToken &&
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
      customerTokenResponse = await processTokens(customerTokenId, paymentInstrumentId, instrumentIdentifier, updatePaymentObj);
      if (null != customerTokenResponse) {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_CUSTOMER_TOKEN_DATA, Constants.LOG_INFO, Constants.SUCCESS_MSG_CARD_TOKENS_UPDATE);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_CUSTOMER_TOKEN_DATA, Constants.LOG_INFO, Constants.ERROR_MSG_TOKEN_UPDATE);
      }
    }
  }
  return authResponse;
};

const processTokens = async (customerTokenId, paymentInstrumentId, instrumentIdentifier, updatePaymentObj) => {
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
      existingTokensMap.set(length, JSON.stringify(parsedTokens));
      updateTokenResponse = await commercetoolsApi.setCustomType(customerId, existingTokensMap);
    }
  }
  if (!existingCardFlag) {
    updateTokenResponse = await commercetoolsApi.setCustomerTokens(customerTokenId, paymentInstrumentId, instrumentIdentifier, updatePaymentObj);
  }
  return updateTokenResponse;
};

const orderManagementHandler = async (paymentId, updatePaymentObj, updateTransactions) => {
  let cartObj: any;
  let orderResponse: any;
  let serviceResponse: any;
  let exceptionData: any;
  let authReversalId = null;
  let authId = null;
  let captureId = null;
  let errorFlag = false;
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
      if (Constants.CT_TRANSACTION_TYPE_CHARGE == updateTransactions.type && Constants.CT_TRANSACTION_STATE_INITIAL == updateTransactions.state) {
        updatePaymentObj.transactions.forEach((transaction) => {
          if (Constants.CT_TRANSACTION_TYPE_AUTHORIZATION == transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS == transaction.state) {
            authId = transaction.interactionId;
          }
        });
        if (null != authId) {
          orderResponse = await paymentCapture.captureResponse(updatePaymentObj, cartObj, authId);
        } else {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ORDER_MANAGEMENT_HANDLER, Constants.LOG_INFO, Constants.ERROR_MSG_CAPTURE_FAILURE);
          errorFlag = true;
        }
      } else if (Constants.CT_TRANSACTION_TYPE_REFUND == updateTransactions.type && Constants.CT_TRANSACTION_STATE_INITIAL == updateTransactions.state) {
        updatePaymentObj.transactions.forEach((transaction) => {
          if (Constants.CT_TRANSACTION_TYPE_CHARGE == transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS == transaction.state) {
            captureId = transaction.interactionId;
          }
        });
        if (null != captureId) {
          orderResponse = await paymentRefund.refundResponse(updatePaymentObj, captureId, updateTransactions);
        } else {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ORDER_MANAGEMENT_HANDLER, Constants.LOG_INFO, Constants.ERROR_MSG_REFUND_FAILURE);
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
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ORDER_MANAGEMENT_HANDLER, Constants.LOG_INFO, Constants.ERROR_MSG_REVERSAL_FAILURE);
          errorFlag = true;
        }
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ORDER_MANAGEMENT_HANDLER, Constants.LOG_INFO, Constants.ERROR_MSG_NO_TRANSACTION);
        errorFlag = true;
      }
      if (null != orderResponse && null != orderResponse.httpCode) {
        serviceResponse = paymentService.getOMServiceResponse(orderResponse, updateTransactions);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ORDER_MANAGEMENT_HANDLER, Constants.LOG_INFO, Constants.ERROR_MSG_SERVICE_PROCESS);
        errorFlag = true;
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ORDER_MANAGEMENT_HANDLER, Constants.LOG_INFO, Constants.ERROR_MSG_SERVICE_PROCESS);
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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ORDER_MANAGEMENT_HANDLER, Constants.LOG_ERROR, exceptionData);
    errorFlag = true;
  }
  if (errorFlag) {
    serviceResponse = paymentService.invalidInputResponse();
  }
  return serviceResponse;
};

const updateCardHandler = async (tokens, customerId) => {
  let updateServiceResponse: any;
  let returnResponse: any;
  let exceptionData: any;
  try {
    if (null != tokens && null != customerId) {
      updateServiceResponse = await updateToken.updateTokenResponse(tokens);
      if (
        null != updateServiceResponse &&
        updateServiceResponse.hasOwnProperty(Constants.STRING_CARD) &&
        Constants.VAL_ZERO < Object.keys(updateServiceResponse.card).length &&
        updateServiceResponse.card.hasOwnProperty(Constants.STRING_EXPIRATION_MONTH) &&
        null != updateServiceResponse.card.expirationMonth &&
        updateServiceResponse.card.hasOwnProperty(Constants.STRING_EXPIRATION_YEAR) &&
        null != updateServiceResponse.card.expirationYear
      ) {
        returnResponse = await updateTokenData(customerId, tokens, updateServiceResponse, Constants.STRING_SUCCESS);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_CARD_HANDLER, Constants.LOG_INFO, Constants.ERROR_MSG_SERVICE_PROCESS);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_CARD_HANDLER, Constants.LOG_INFO, Constants.ERROR_MSG_NO_TOKENS);
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_CUSTOMER_UPDATE + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_CUSTOMER_UPDATE + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_CUSTOMER_UPDATE + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_CARD_HANDLER, Constants.LOG_ERROR, exceptionData);
  }
  if (null == returnResponse) {
    returnResponse = await updateTokenData(customerId, tokens, updateServiceResponse, Constants.LOG_ERROR);
  }
  return returnResponse;
};

const updateTokenData = async (customerId, tokens, updateServiceResponse, type) => {
  let customerInfo: any;
  let existingTokens: any;
  let existingTokensMap: any;
  let newToken: any;
  let parsedTokens: any;
  let updateTokenResponse: any;
  let length = Constants.VAL_NEGATIVE_ONE;
  if (null != customerId) {
    customerInfo = await commercetoolsApi.getCustomer(customerId);
    if (null != customerInfo && Constants.STRING_CUSTOM in customerInfo && Constants.STRING_FIELDS in customerInfo.custom && Constants.ISV_TOKENS in customerInfo.custom.fields && Constants.STRING_EMPTY != customerInfo.custom.fields.isv_tokens) {
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
        if (Constants.STRING_SUCCESS == type && null != updateServiceResponse) {
          parsedTokens.cardExpiryMonth = updateServiceResponse.card.expirationMonth;
          parsedTokens.cardExpiryYear = updateServiceResponse.card.expirationYear;
          parsedTokens.flag = Constants.STRING_UPDATED;
        } else {
          parsedTokens.cardExpiryMonth = tokens.oldExpiryMonth;
          parsedTokens.cardExpiryYear = tokens.oldExpiryYear;
          delete parsedTokens.oldExpiryMonth;
          delete parsedTokens.oldExpiryYear;
          parsedTokens.flag = Constants.STRING_UPDATE;
        }
        existingTokensMap.set(length, JSON.stringify(parsedTokens));
      }
    } else {
      if (Constants.STRING_SUCCESS == type) {
        tokens.cardExpiryMonth = updateServiceResponse.card.expirationMonth;
        tokens.cardExpiryYear = updateServiceResponse.card.expirationYear;
        tokens.flag = Constants.STRING_UPDATED;
      } else {
        tokens.cardExpiryMonth = tokens.oldExpiryMonth;
        tokens.cardExpiryYear = tokens.oldExpiryYear;
        delete tokens.oldExpiryMonth;
        delete tokens.oldExpiryYear;
        tokens.flag = Constants.STRING_UPDATE;
      }
      existingTokensMap = [tokens];
    }
  } else {
    tokens.cardExpiryMonth = tokens.oldExpiryMonth;
    tokens.cardExpiryYear = tokens.oldExpiryYear;
    delete tokens.oldExpiryMonth;
    delete tokens.oldExpiryYear;
    tokens.flag = Constants.STRING_UPDATE;
    existingTokensMap = [tokens];
  }
  updateTokenResponse = paymentService.getUpdateTokenActions(existingTokensMap);
  return updateTokenResponse;
};

const deleteCardHandler = async (updateCustomerObj, customerId) => {
  let tokenManagementResponse: any;
  let fieldsData: any;
  let customerTokenHandlerResponse: any;
  let customerObj: any;
  if (null != customerId && null != updateCustomerObj) {
    customerObj = await commercetoolsApi.getCustomer(customerId);
    tokenManagementResponse = await deleteToken.deleteCustomerToken(updateCustomerObj);
    fieldsData = await paymentService.deleteToken(tokenManagementResponse, customerObj);
    customerTokenHandlerResponse = paymentService.getUpdateTokenActions(fieldsData);
  } else {
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_DELETE_CARD_HANDLER, Constants.LOG_INFO, Constants.ERROR_MSG_CUSTOMER_DETAILS);
  }
  return customerTokenHandlerResponse;
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
    state: Constants.STRING_EMPTY,
  };
  let decisionSyncResponse = {
    message: Constants.STRING_EMPTY,
    error: Constants.STRING_EMPTY,
  };
  try {
    if (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_DECISION_SYNC) {
      conversionDetails = await conversion.conversionDetails();
      if (null != conversionDetails && Constants.HTTP_CODE_TWO_HUNDRED == conversionDetails.status) {
        conversionDetailsData = conversionDetails.data;
        for (let element of conversionDetailsData) {
          paymentDetails = await commercetoolsApi.retrievePayment(element.merchantReferenceNumber);
          if (null != paymentDetails) {
            latestTransaction = paymentDetails.transactions.pop();
            if (Constants.CT_TRANSACTION_TYPE_AUTHORIZATION == latestTransaction.type && Constants.CT_TRANSACTION_STATE_PENDING == latestTransaction.state) {
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
        if (conversionPresent) {
          decisionSyncResponse.message = Constants.SUCCESS_MSG_DECISION_SYNC_SERVICE;
        } else {
          decisionSyncResponse.error = Constants.ERROR_MSG_NO_SYNC_DETAILS;
        }
      } else {
        decisionSyncResponse.error = Constants.ERROR_MSG_NO_SYNC_DETAILS;
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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_REPORT_HANDLER, Constants.LOG_ERROR, exceptionData);
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
  let rowPresent: any;
  let applications: any;
  let updateSyncResponse: any;
  let syncPresent = false;
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
  };
  let syncResponse = {
    message: Constants.STRING_EMPTY,
    error: Constants.STRING_EMPTY,
  };
  try {
    if (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_RUN_SYNC) {
      createSearchResponse = await createSearchRequest.getTransactionSearchResponse(Constants.STRING_SYNC_QUERY, Constants.STRING_SYNC_SORT);
      if (null != createSearchResponse && Constants.HTTP_CODE_TWO_HUNDRED_ONE == createSearchResponse.httpCode) {
        transactionSummaries = createSearchResponse.data._embedded.transactionSummaries;
        for (let element of transactionSummaries) {
          paymentDetails = await commercetoolsApi.retrievePayment(element.clientReferenceInformation.code);
          if (null != paymentDetails) {
            transactions = paymentDetails.transactions;
            applications = element.applicationInformation.applications;
            if (null != applications && null != transactions) {
              applicationResponse = await getApplicationsPresent(applications);
              if (null != applicationResponse) {
                if (transactions.some((item) => item.interactionId == element.id)) {
                  rowPresent = true;
                } else if (transactions.some((item) => item.interactionId == null)) {
                  rowPresent = false;
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
                    syncUpdateObject.type = Constants.CT_TRANSACTION_TYPE_AUTHORIZATION;
                    updateSyncResponse = await runSyncAddTransaction(syncUpdateObject, element.applicationInformation.reasonCode, applicationResponse.authPresent, applicationResponse.authReasonCodePresent);
                    if (null != updateSyncResponse && paymentDetails.paymentMethodInfo.method == Constants.VISA_CHECKOUT) {
                      await updateVisaDetails(paymentDetails.id, updateSyncResponse.version, element.id);
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
            if (null != applicationResponse && null == transactions) {
              syncUpdateObject.id = paymentDetails.id;
              syncUpdateObject.version = paymentDetails.version;
              syncUpdateObject.interactionId = element.id;
              syncUpdateObject.amountPlanned.currencyCode = element.orderInformation.amountDetails.currency;
              syncUpdateObject.amountPlanned.centAmount = paymentService.convertAmountToCent(Number(element.orderInformation.amountDetails.totalAmount));
              if (applicationResponse.authPresent) {
                if (!applicationResponse.authReasonCodePresent) {
                  syncUpdateObject.amountPlanned.currencyCode = paymentDetails.amountPlanned.currencyCode;
                  syncUpdateObject.amountPlanned.centAmount = paymentDetails.amountPlanned.centAmount;
                }
                syncUpdateObject.type = Constants.CT_TRANSACTION_TYPE_AUTHORIZATION;
                updateSyncResponse = await runSyncAddTransaction(syncUpdateObject, element.applicationInformation.reasonCode, applicationResponse.authPresent, applicationResponse.authReasonCodePresent);
                if (null != updateSyncResponse && paymentDetails.paymentMethodInfo.method == Constants.VISA_CHECKOUT) {
                  await updateVisaDetails(paymentDetails.id, updateSyncResponse.version, element.id);
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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SYNC_HANDLER, Constants.LOG_ERROR, exceptionData);
  }
  return syncResponse;
};

const getApplicationsPresent = async (applications) => {
  let applicationResponse = {
    authPresent: false,
    authReasonCodePresent: false,
    capturePresent: false,
    authReversalPresent: false,
    refundPresent: false,
  };
  if (null != applications) {
    if (applications.some((item) => item.name == Constants.STRING_SYNC_AUTH_NAME)) {
      applicationResponse.authPresent = true;
    }
    if (applications.some((item) => item.name == Constants.STRING_SYNC_AUTH_NAME && item.reasonCode != null && Constants.VAL_HUNDRED == item.reasonCode)) {
      applicationResponse.authReasonCodePresent = true;
    }
    if (applications.some((item) => item.name == Constants.STRING_SYNC_CAPTURE_NAME)) {
      applicationResponse.capturePresent = true;
    }
    if (applications.some((item) => item.name == Constants.STRING_SYNC_AUTH_REVERSAL_NAME)) {
      applicationResponse.authReversalPresent = true;
    }
    if (applications.some((item) => item.name == Constants.STRING_SYNC_REFUND_NAME)) {
      applicationResponse.refundPresent = true;
    }
  } else {
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_APPLICATIONS_PRESENT, Constants.LOG_INFO, Constants.ERROR_MSG_APPLICATION_DETAILS);
  }
  return applicationResponse;
};

const updateVisaDetails = async (paymentId, paymentVersion, transactionId) => {
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
  if (null != paymentId && null != paymentVersion && null != transactionId) {
    visaObject.transactionId = transactionId;
    visaCheckoutData = await clickToPay.getVisaCheckoutData(visaObject);
    if (null != visaCheckoutData) {
      cartDetails = await getCartDetailsByPaymentId(paymentId);
      if (null != cartDetails && Constants.STRING_CART_STATE == cartDetails.cartState) {
        visaResponse = await commercetoolsApi.updateCartByPaymentId(cartDetails.id, cartDetails.version, visaCheckoutData);
        if (null != visaResponse) {
          updateResponse.cartVersion = visaResponse.version;
          actions = await paymentService.visaCardDetailsAction(visaCheckoutData);
          if (actions != null && Constants.VAL_ZERO < actions.length) {
            visaUpdateObject.actions = actions;
            visaUpdateObject.id = paymentId;
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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_VISA_DETAILS, Constants.LOG_INFO, Constants.ERROR_MSG_PAYMENT_DETAILS);
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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_CART_DETAILS_BY_PAYMENT_ID, Constants.LOG_INFO, Constants.ERROR_MSG_PAYMENT_DETAILS);
  }
  return cartDetails;
};

const runSyncAddTransaction = async (syncUpdateObject, reasonCode, authPresent, authReasonCodePresent) => {
  let updateSyncResponse: any;
  let authReversalObject = {
    paymentId: null,
    version: null,
    amount: {
      currencyCode: null,
      centAmount: Constants.VAL_ZERO,
    },
    type: Constants.STRING_EMPTY,
    state: Constants.STRING_EMPTY,
  };
  if (null != syncUpdateObject && null != reasonCode) {
    if (Constants.VAL_HUNDRED == reasonCode) {
      syncUpdateObject.state = Constants.CT_TRANSACTION_STATE_SUCCESS;
      updateSyncResponse = await commercetoolsApi.syncAddTransaction(syncUpdateObject);
    } else if (Constants.VAL_FOUR_EIGHTY == reasonCode && authPresent && authReasonCodePresent) {
      syncUpdateObject.state = Constants.CT_TRANSACTION_STATE_PENDING;
      updateSyncResponse = await commercetoolsApi.syncAddTransaction(syncUpdateObject);
    } else if (Constants.VAL_FOUR_EIGHTY_ONE == reasonCode && authPresent && authReasonCodePresent) {
      syncUpdateObject.state = Constants.CT_TRANSACTION_STATE_SUCCESS;
      updateSyncResponse = await commercetoolsApi.syncAddTransaction(syncUpdateObject);
      authReversalObject.paymentId = syncUpdateObject.id;
      authReversalObject.state = Constants.CT_TRANSACTION_STATE_INITIAL;
      authReversalObject.type = Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION;
      authReversalObject.amount = syncUpdateObject.amountPlanned;
      authReversalObject.version = updateSyncResponse.version;
      updateSyncResponse = await commercetoolsApi.addTransaction(authReversalObject);
    } else if ((Constants.VAL_FOUR_EIGHTY == reasonCode || Constants.VAL_FOUR_EIGHTY_ONE == reasonCode) && authPresent && !authReasonCodePresent) {
      syncUpdateObject.state = Constants.CT_TRANSACTION_STATE_FAILURE;
      updateSyncResponse = await commercetoolsApi.syncAddTransaction(syncUpdateObject);
    } else if (Constants.VAL_HUNDRED != reasonCode && Constants.VAL_FOUR_SEVENTY_FIVE != reasonCode) {
      syncUpdateObject.state = Constants.CT_TRANSACTION_STATE_FAILURE;
      updateSyncResponse = await commercetoolsApi.syncAddTransaction(syncUpdateObject);
    }
  } else {
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_RUN_SYNC_ADD_TRANSACTION, Constants.LOG_INFO, Constants.ERROR_MSG_FETCH_TRANSACTIONS);
  }
  return updateSyncResponse;
};

export default {
  authorizationHandler,
  getPayerAuthSetUpResponse,
  getPayerAuthEnrollResponse,
  getPayerAuthEnrollAuthReversalHandler,
  applePaySessionHandler,
  orderManagementHandler,
  updateCardHandler,
  deleteCardHandler,
  reportHandler,
  syncHandler,
};
