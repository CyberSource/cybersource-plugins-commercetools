import path from 'path';
import paymentAuthorization from './../service/payment/PaymentAuthorizationService';
import paymentService from './../utils/PaymentService';
import commercetoolsApi from './../utils/api/CommercetoolsApi';
import paymentCapture from './../service/payment/PaymentCaptureService';
import paymentRefund from './../service/payment/PaymentRefundService';
import paymentAuthReversal from './../service/payment/PaymentAuthorizationReversal';
import clickToPay from '../service/payment/ClickToPayDetails';
import payerAuthEnroll from '../service/payment/PayerAuthenticationEnrollService';
import paymentAuthSetUp from '../service/payment/PayerAuthenticationSetupService';
import conversion from '../service/payment/DecisionSyncService';
import { Constants } from '../constants';

const authorizationHandler = async (updatePaymentObj, updateTransactions) => {
  let authResponse: any;
  let paymentResponse: any;
  let paymentMethod: string;
  let cartObj: any;
  let serviceResponse: any;
  let exceptionData: any;
  let errorFlag = false;
  try {
    if (null != updatePaymentObj && null != updateTransactions) {
      if (Constants.STRING_CUSTOMER in updatePaymentObj) {
        cartObj = await commercetoolsApi.retrieveCartByCustomerId(updatePaymentObj.customer.id);
      } else {
        cartObj = await commercetoolsApi.retrieveCartByAnonymousId(updatePaymentObj.anonymousId);
      }
      if (null != cartObj) {
        paymentMethod = updatePaymentObj.paymentMethodInfo.method;
        switch (paymentMethod) {
          case Constants.CREDIT_CARD: {
            serviceResponse = await getCardWithout3dsRespone(updatePaymentObj, cartObj.results[Constants.VAL_ZERO], updateTransactions);
            paymentResponse = serviceResponse.paymentResponse;
            authResponse = serviceResponse.authResponse;
            errorFlag = serviceResponse.errorFlag;
            break;
          }
          case Constants.CC_PAYER_AUTHENTICATION: {
            serviceResponse = await getCardWith3dsRespone(updatePaymentObj, cartObj.results[Constants.VAL_ZERO], updateTransactions);
            paymentResponse = serviceResponse.paymentResponse;
            authResponse = serviceResponse.authResponse;
            errorFlag = serviceResponse.errorFlag;
            break;
          }
          case Constants.VISA_CHECKOUT: {
            serviceResponse = await clickToPayRespone(updatePaymentObj, cartObj.results[Constants.VAL_ZERO], updateTransactions);
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
        authResponse = await setCustomerTokenData(paymentResponse, authResponse, errorFlag, paymentMethod, updatePaymentObj);
        if (Constants.ISV_SAVED_TOKEN in updatePaymentObj.custom.fields) {
          authResponse.actions.push({
            action: Constants.SET_CUSTOM_FIELD,
            name: Constants.ISV_TOKEN_VERIFICATION_CONTEXT,
            value: null,
          });
          authResponse.actions.push({
            action: Constants.SET_CUSTOM_FIELD,
            name: Constants.ISV_CAPTURE_CONTEXT_SIGNATURE,
            value: null,
          });
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
  let errorFlag = false;
  try {
    if (Constants.ISV_TOKEN in updatePaymentObj.custom.fields || Constants.ISV_SAVED_TOKEN in updatePaymentObj.custom.fields) {
      setUpServiceResponse = await paymentAuthSetUp.payerAuthSetupResponse(updatePaymentObj);
      if (null != setUpServiceResponse) {
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
  let cardinalReferenceId: null;
  let errorFlag = false;
  try {
    if (
      (Constants.ISV_MDD_1 in updatePaymentObj.custom.fields && Constants.ISV_TOKEN in updatePaymentObj.custom.fields && Constants.ISV_MDD_1 in updatePaymentObj.custom.fields) ||
      Constants.ISV_SAVED_TOKEN in updatePaymentObj.custom.fields
    ) {
      cardinalReferenceId = updatePaymentObj.custom.fields.isv_merchantDefinedData_mddField_1;
      if (Constants.STRING_CUSTOMER in updatePaymentObj) {
        cartObj = await commercetoolsApi.retrieveCartByCustomerId(updatePaymentObj.customer.id);
      } else {
        cartObj = await commercetoolsApi.retrieveCartByAnonymousId(updatePaymentObj.anonymousId);
      }
      if (null != cartObj) {
        enrollServiceResponse = await payerAuthEnroll.payerAuthEnrollmentCheck(updatePaymentObj, cartObj.results[Constants.VAL_ZERO], cardinalReferenceId);
        if (null != enrollServiceResponse) {
          enrollResponse = paymentService.getAuthResponse(enrollServiceResponse, null);
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

const getCardWithout3dsRespone = async (updatePaymentObj, cartObj, updateTransactions) => {
  let authResponse: any;
  let paymentResponse: any;
  let returnResponse = {
    paymentResponse: null,
    authResponse: null,
    errorFlag: false,
  };
  paymentResponse = await paymentAuthorization.authorizationResponse(updatePaymentObj, cartObj, Constants.STRING_CARD);
  if (null != paymentResponse) {
    authResponse = paymentService.getAuthResponse(paymentResponse, updateTransactions);
    if (null != authResponse) {
      if (null == updatePaymentObj.custom.fields.isv_savedToken) {
        authResponse.actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_CAPTURE_CONTEXT_SIGNATURE,
          value: null,
        });
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_HANDLER, Constants.LOG_INFO, Constants.ERROR_MSG_SERVICE_PROCESS);
      returnResponse.errorFlag = true;
    }
  } else {
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_HANDLER, Constants.LOG_INFO, Constants.ERROR_MSG_SERVICE_PROCESS);
    returnResponse.errorFlag = true;
  }
  returnResponse.paymentResponse = paymentResponse;
  returnResponse.authResponse = authResponse;
  return returnResponse;
};

const getCardWith3dsRespone = async (updatePaymentObj, cartObj, updateTransactions) => {
  let authResponse: any;
  let paymentResponse: any;
  let returnResponse = {
    paymentResponse: null,
    authResponse: null,
    errorFlag: false,
  };
  let service: string;
  if (updatePaymentObj.custom.fields.isv_payerAuthenticationRequired) {
    service = Constants.VALIDATION;
  } else {
    service = Constants.STRING_CARD;
  }
  paymentResponse = await paymentAuthorization.authorizationResponse(updatePaymentObj, cartObj, service);
  if (null != paymentResponse) {
    authResponse = paymentService.getAuthResponse(paymentResponse, updateTransactions);
    if (null != authResponse) {
      if (null == updatePaymentObj.custom.fields.isv_savedToken) {
        authResponse.actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_CAPTURE_CONTEXT_SIGNATURE,
          value: null,
        });
      }
      authResponse.actions.push(
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_MDD_1,
          value: null,
        },
        {
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_MDD_2,
          value: null,
        }
      );
      if (Constants.VALIDATION == service) {
        authResponse.actions.push({
          action: Constants.SET_CUSTOM_FIELD,
          name: Constants.ISV_MDD_3,
          value: null,
        });
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_HANDLER, Constants.LOG_INFO, Constants.ERROR_MSG_SERVICE_PROCESS);
      returnResponse.errorFlag = true;
    }
  } else {
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_HANDLER, Constants.LOG_INFO, Constants.ERROR_MSG_SERVICE_PROCESS);
    returnResponse.errorFlag = true;
  }
  returnResponse.paymentResponse = paymentResponse;
  returnResponse.authResponse = authResponse;
  return returnResponse;
};

const clickToPayRespone = async (updatePaymentObj, cartObj, updateTransactions) => {
  let authResponse: any;
  let paymentResponse: any;
  let cartUpdate: any;
  let visaCheckoutData: any;
  let actions: any;
  let returnResponse = {
    paymentResponse: null,
    authResponse: null,
    errorFlag: false,
  };
  paymentResponse = await paymentAuthorization.authorizationResponse(updatePaymentObj, cartObj, Constants.STRING_VISA);
  if (null != paymentResponse) {
    authResponse = paymentService.getAuthResponse(paymentResponse, updateTransactions);
    if (null != authResponse) {
      visaCheckoutData = await clickToPay.getVisaCheckoutData(paymentResponse);
      if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode && Constants.HTTP_CODE_TWO_HUNDRED == visaCheckoutData.httpCode && null != visaCheckoutData.cardFieldGroup) {
        actions = paymentService.visaCardDetailsAction(visaCheckoutData);
        actions.forEach((i) => {
          authResponse.actions.push(i);
        });
        cartUpdate = await commercetoolsApi.updateCartbyPaymentId(cartObj.results[Constants.VAL_ZERO].id, cartObj.results[Constants.VAL_ZERO].version, visaCheckoutData);
        if (null != cartUpdate) {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_HANDLER, Constants.LOG_INFO, Constants.SUCCESS_MSG_UPDATE_CLICK_TO_PAY_CARD_DETAILS);
        }
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_HANDLER, Constants.LOG_INFO, Constants.ERROR_MSG_UPDATE_CLICK_TO_PAY_DATA);
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_HANDLER, Constants.LOG_INFO, Constants.ERROR_MSG_SERVICE_PROCESS);
      returnResponse.errorFlag = true;
    }
  } else {
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_HANDLER, Constants.LOG_INFO, Constants.ERROR_MSG_SERVICE_PROCESS);
    returnResponse.errorFlag = true;
  }
  returnResponse.paymentResponse = paymentResponse;
  returnResponse.authResponse = authResponse;
  return returnResponse;
};

const setCustomerTokenData = async (paymentResponse, authResponse, errorFlag, paymentMethod, updatePaymentObj) => {
  let customerTokenResponse: any;
  if (
    !errorFlag &&
    Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode &&
    Constants.API_STATUS_AUTHORIZED == paymentResponse.status &&
    (Constants.CREDIT_CARD == paymentMethod || Constants.CC_PAYER_AUTHENTICATION == paymentMethod) &&
    null == updatePaymentObj.custom.fields.isv_savedToken &&
    Constants.ISV_TOKEN_ALIAS in updatePaymentObj.custom.fields
  ) {
    if (Constants.TOKEN_INFORMATION in paymentResponse.data && Constants.PAYMENT_INSTRUMENT in paymentResponse.data.tokenInformation) {
      authResponse.actions.push({
        action: Constants.SET_CUSTOM_FIELD,
        name: Constants.ISV_SAVED_TOKEN,
        value: paymentResponse.data.tokenInformation.customer.id,
      });
      customerTokenResponse = await commercetoolsApi.setCustomerTokens(paymentResponse.data.tokenInformation.customer.id, updatePaymentObj);
      if (null != customerTokenResponse) {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_HANDLER, Constants.LOG_INFO, Constants.SUCCESS_MSG_CARD_TOKENS_UPDATE);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_HANDLER, Constants.LOG_INFO, Constants.ERROR_MSG_TOKEN_UPDATE);
      }
    }
  }
  return authResponse;
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
    cartObj = await commercetoolsApi.retrieveCartByPaymentId(paymentId);
    if (null != cartObj) {
      if (Constants.CT_TRANSACTION_TYPE_CHARGE == updateTransactions.type) {
        updatePaymentObj.transactions.forEach((transaction) => {
          if (Constants.CT_TRANSACTION_TYPE_AUTHORIZATION == transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS == transaction.state) {
            authId = transaction.interactionId;
          }
        });
        if (null != authId) {
          orderResponse = await paymentCapture.captureResponse(updatePaymentObj, cartObj.results[Constants.VAL_ZERO], authId);
        } else {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ORDER_MANAGEMENT_HANDLER, Constants.LOG_INFO, Constants.ERROR_MSG_CAPTURE_FAILURE);
          errorFlag = true;
        }
      } else if (Constants.CT_TRANSACTION_TYPE_REFUND == updateTransactions.type) {
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
      } else if (Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION == updateTransactions.type) {
        authReversalId = updatePaymentObj.transactions[Constants.VAL_ZERO].interactionId;
        if (null != authReversalId) {
          orderResponse = await paymentAuthReversal.authReversalResponse(updatePaymentObj, cartObj.results[Constants.VAL_ZERO], authReversalId);
        } else {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ORDER_MANAGEMENT_HANDLER, Constants.LOG_INFO, Constants.ERROR_MSG_REVERSAL_FAILURE);
          errorFlag = true;
        }
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ORDER_MANAGEMENT_HANDLER, Constants.LOG_INFO, Constants.ERROR_MSG_NO_TRANSACTION);
        errorFlag = true;
      }
      if (null != orderResponse) {
        serviceResponse = paymentService.getOMServiceResponse(orderResponse, updateTransactions);
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ORDER_MANAGEMENT_HANDLER, Constants.LOG_INFO, Constants.ERROR_MSG_SERVICE_PROCESS);
        errorFlag = true;
      }
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_ORDER_MANAGEMENT_HANDLER, Constants.LOG_INFO, Constants.ERROR_MSG_EMPTY_CART);
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

const reportHandler = async () => {
  let conversionDetails: any;
  let latestTransaction: any;
  let paymentDetails: any;
  let conversionDetailsData: any;
  let exceptionData: any;
  var decisionUpdateObject = {
    id: null,
    version: null,
    transactionId: null,
    state: Constants.STRING_EMPTY,
  };
  let decisionsyncResponse = {
    message: Constants.STRING_EMPTY,
    error: Constants.STRING_EMPTY,
  };
  try {
    if (Constants.STRING_TRUE == process.env.ISV_PAYMENT_DECISION_SYNC) {
      conversionDetails = await conversion.conversionDetails();
      if (null != conversionDetails && Constants.HTTP_CODE_TWO_HUNDRED == conversionDetails.status) {
        decisionsyncResponse.message = Constants.SUCCESS_MSG_DECISION_SYNC_SERVICE;
        conversionDetailsData = conversionDetails.data;
        for (let element of conversionDetailsData) {
          paymentDetails = await commercetoolsApi.retrievePayment(element.merchantReferenceNumber);
          if (null != paymentDetails) {
            latestTransaction = paymentDetails.transactions.pop();
            if (Constants.CT_TRANSACTION_TYPE_AUTHORIZATION == latestTransaction.type && Constants.CT_TRANSACTION_STATE_PENDING == latestTransaction.state) {
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
      } else {
        decisionsyncResponse.error = Constants.ERROR_MSG_NO_CONVERSION_DETAILS;
      }
    } else {
      decisionsyncResponse.error = Constants.ERROR_MSG_ENABLE_DECISION_SYNC;
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = Constants.EXCEPTION_MSG_CONVERSION_DETAILS + Constants.STRING_HYPHEN + exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = Constants.EXCEPTION_MSG_CONVERSION_DETAILS + Constants.STRING_HYPHEN + exception.message;
    } else {
      exceptionData = Constants.EXCEPTION_MSG_CONVERSION_DETAILS + Constants.STRING_HYPHEN + exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_REPORT_HANDLER, Constants.LOG_ERROR, exceptionData);
  }
  return decisionsyncResponse;
};

export default {
  authorizationHandler,
  getPayerAuthEnrollResponse,
  orderManagementHandler,
  getPayerAuthSetUpResponse,
  reportHandler,
};
