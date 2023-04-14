import restApi from 'cybersource-rest-client';
import path from 'path';
import paymentService from '../../utils/PaymentService';
import { Constants } from '../../constants';
import multiMid from '../../utils/config/MultiMid';

const captureResponse = async (payment, updateTransactions, authId, orderNo) => {
  let runEnvironment: any;
  let errorData: any;
  let exceptionData: any;
  let paymentResponse = {
    httpCode: null,
    transactionId: null,
    status: null,
  };
  let midCredentials: any;
  try {
    if (null != authId && null != payment) {
      const apiClient = new restApi.ApiClient();
      var requestObj = new restApi.CapturePaymentRequest();
      if (Constants.TEST_ENVIRONMENT == process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase()) {
        runEnvironment = Constants.PAYMENT_GATEWAY_TEST_ENVIRONMENT;
      } else if (Constants.LIVE_ENVIRONMENT == process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase()) {
        runEnvironment = Constants.PAYMENT_GATEWAY_PRODUCTION_ENVIRONMENT;
      }
      midCredentials = await multiMid.getMidCredentials(payment);
      const configObject = {
        authenticationType: Constants.PAYMENT_GATEWAY_AUTHENTICATION_TYPE,
        runEnvironment: runEnvironment,
        merchantID: midCredentials.merchantId,
        merchantKeyId: midCredentials.merchantKeyId,
        merchantsecretKey: midCredentials.merchantSecretKey,
        logConfiguration: {
          enableLog: false,
        },
      };
      var clientReferenceInformation = new restApi.Ptsv2paymentsClientReferenceInformation();
      clientReferenceInformation.code = payment.id;
      requestObj.clientReferenceInformation = clientReferenceInformation;
      var clientReferenceInformationpartner = new restApi.Ptsv2paymentsidClientReferenceInformationPartner();
      clientReferenceInformationpartner.solutionId = Constants.PAYMENT_GATEWAY_PARTNER_SOLUTION_ID;
      clientReferenceInformation.partner = clientReferenceInformationpartner;
      requestObj.clientReferenceInformation = clientReferenceInformation;
      var processingInformation = new restApi.Ptsv2paymentsidcapturesProcessingInformation();
      if (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ORDER_RECONCILIATION && null != orderNo) {
        processingInformation.reconciliationId = orderNo;
      }
      if (Constants.CLICK_TO_PAY == payment.paymentMethodInfo.method) {
        processingInformation.paymentSolution = Constants.PAYMENT_GATEWAY_CLICK_TO_PAY_PAYMENT_SOLUTION;
        processingInformation.visaCheckoutId = payment.custom.fields.isv_token;
      } else if (Constants.GOOGLE_PAY == payment.paymentMethodInfo.method) {
        processingInformation.paymentSolution = Constants.PAYMENT_GATEWAY_GOOGLE_PAY_PAYMENT_SOLUTION;
      } else if (Constants.APPLE_PAY == payment.paymentMethodInfo.method) {
        processingInformation.paymentSolution = Constants.PAYMENT_GATEWAY_APPLE_PAY_PAYMENT_SOLUTION;
      }
      requestObj.processingInformation = processingInformation;
      const captureAmount = paymentService.convertCentToAmount(updateTransactions.amount.centAmount);
      var orderInformation = new restApi.Ptsv2paymentsidcapturesOrderInformation();
      var orderInformationAmountDetails = new restApi.Ptsv2paymentsidcapturesOrderInformationAmountDetails();
      orderInformationAmountDetails.totalAmount = captureAmount;
      orderInformationAmountDetails.currency = payment.amountPlanned.currencyCode;
      orderInformation.amountDetails = orderInformationAmountDetails;
      requestObj.orderInformation = orderInformation;
      if (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ENABLE_DEBUG) {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CAPTURE_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + payment.id, Constants.CAPTURE_REQUEST + JSON.stringify(requestObj));
      }
      const instance = new restApi.CaptureApi(configObject, apiClient);
      return await new Promise(function (resolve, reject) {
        instance.capturePayment(requestObj, authId, function (error, data, response) {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CAPTURE_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + payment.id, Constants.CAPTURE_RESPONSE + JSON.stringify(response));
          if (data) {
            paymentResponse.httpCode = response[Constants.STATUS_CODE];
            paymentResponse.transactionId = data.id;
            paymentResponse.status = data.status;
            resolve(paymentResponse);
          } else if (error) {
            if (error.hasOwnProperty(Constants.STRING_RESPONSE) && null != error.response && Constants.VAL_ZERO < Object.keys(error.response).length && error.response.hasOwnProperty(Constants.STRING_TEXT) && null != error.response.text && Constants.VAL_ZERO < Object.keys(error.response.text).length) {
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CAPTURE_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + payment.id, error.response.text);
              errorData = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, Constants.STRING_EMPTY));
              paymentResponse.transactionId = errorData.id;
              paymentResponse.status = errorData.status;
            } else {
              if (typeof error === 'object') {
                errorData = JSON.stringify(error);
              } else {
                errorData = error;
              }
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CAPTURE_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + payment.id, errorData);
            }
            paymentResponse.httpCode = error.status;
            reject(paymentResponse);
          } else {
            reject(paymentResponse);
          }
        });
      }).catch((error) => {
        return paymentResponse;
      });
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CAPTURE_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + payment.id, Constants.ERROR_MSG_INVALID_INPUT);
      return paymentResponse;
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    if (Constants.EXCEPTION_MERCHANT_SECRET_KEY_REQUIRED == exceptionData || Constants.EXCEPTION_MERCHANT_KEY_ID_REQUIRED == exceptionData) {
      exceptionData = Constants.EXCEPTION_MSG_ENV_VARIABLE_NOT_SET + midCredentials.merchantId;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CAPTURE_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + payment.id, exceptionData);
    return paymentResponse;
  }
};

export default { captureResponse };
