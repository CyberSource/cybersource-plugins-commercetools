import restApi from 'cybersource-rest-client';
import path from 'path';
import jwtDecode from 'jwt-decode';
import { Constants } from '../../constants';
import paymentService from '../../utils/PaymentService';
import multiMid from '../../utils/config/MultiMid';

const payerAuthSetupResponse = async (payment, cardTokens) => {
  let runEnvironment: any;
  let jtiToken: any;
  let errorData: any;
  let exceptionData: any;
  let paymentResponse = {
    accessToken: null,
    referenceId: null,
    deviceDataCollectionUrl: null,
    httpCode: null,
    transactionId: null,
    status: null,
  };
  let midCredentials: any;
  try {
    if (null != payment) {
      const apiClient = new restApi.ApiClient();
      var requestObj = new restApi.PayerAuthSetupRequest();
      runEnvironment = (Constants.LIVE_ENVIRONMENT == process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase()) ? Constants.PAYMENT_GATEWAY_PRODUCTION_ENVIRONMENT : runEnvironment = Constants.PAYMENT_GATEWAY_TEST_ENVIRONMENT;
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
      var clientReferenceInformation = new restApi.Riskv1decisionsClientReferenceInformation();
      clientReferenceInformation.code = payment.id;
      requestObj.clientReferenceInformation = clientReferenceInformation;
      var clientReferenceInformationpartner = new restApi.Riskv1decisionsClientReferenceInformationPartner();
      clientReferenceInformationpartner.solutionId = Constants.PAYMENT_GATEWAY_PARTNER_SOLUTION_ID;
      clientReferenceInformation.partner = clientReferenceInformationpartner;
      requestObj.clientReferenceInformation = clientReferenceInformation;
      if (payment?.custom?.fields?.isv_savedToken) {
        var paymentInformation = new restApi.Riskv1authenticationsetupsPaymentInformation();
        var paymentInformationCustomer = new restApi.Riskv1authenticationsetupsPaymentInformationCustomer();
        paymentInformationCustomer.id = cardTokens.customerTokenId;
        paymentInformation.customer = paymentInformationCustomer;
        requestObj.paymentInformation = paymentInformation;
      } else {
        jtiToken = (payment?.custom?.fields?.isv_transientToken) ? jwtDecode(payment.custom.fields.isv_transientToken) : jtiToken = jwtDecode(payment.custom.fields.isv_token);
        var tokenInformation = new restApi.Riskv1authenticationsetupsTokenInformation();
        tokenInformation.transientToken = jtiToken.jti;
        requestObj.tokenInformation = tokenInformation;
      }
      if (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ENABLE_DEBUG) {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_PAYER_AUTH_SETUP_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + payment.id, Constants.PAYER_AUTHENTICATION_SETUP_REQUEST + JSON.stringify(requestObj));
      }
      const payerAuthenticationApiInstance = new restApi.PayerAuthenticationApi(configObject, apiClient);
      return await new Promise(function (resolve, reject) {
        payerAuthenticationApiInstance.payerAuthSetup(requestObj, function (error, data, response) {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_PAYER_AUTH_SETUP_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + payment.id, Constants.PAYER_AUTHENTICATION_SETUP_RESPONSE + JSON.stringify(response));
          if (data) {
            paymentResponse.httpCode = response[Constants.STATUS_CODE];
            paymentResponse.transactionId = data.id;
            paymentResponse.status = data.status;
            paymentResponse.accessToken = data.consumerAuthenticationInformation.accessToken;
            paymentResponse.referenceId = data.consumerAuthenticationInformation.referenceId;
            paymentResponse.deviceDataCollectionUrl = data.consumerAuthenticationInformation.deviceDataCollectionUrl;
            resolve(paymentResponse);
          } else if (error) {
            if (
              error.hasOwnProperty(Constants.STRING_RESPONSE) &&
              null != error.response &&
              Constants.VAL_ZERO < Object.keys(error.response).length &&
              error.response.hasOwnProperty(Constants.STRING_TEXT) &&
              null != error.response.text &&
              Constants.VAL_ZERO < Object.keys(error.response.text).length
            ) {
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_PAYER_AUTH_SETUP_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + payment.id, error.response.text);
              errorData = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, Constants.STRING_EMPTY));
              paymentResponse.transactionId = errorData.id;
              paymentResponse.status = errorData.status;
            } else {
              if (typeof error === 'object') {
                errorData = JSON.stringify(error);
              } else {
                errorData = error;
              }
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_PAYER_AUTH_SETUP_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + payment.id, errorData);
            }
            paymentResponse.httpCode = error.status;
            reject(paymentResponse);
          } else {
            reject(paymentResponse);
          }
        });
      }).catch((error) => {
        return error;
      });
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_PAYER_AUTH_SETUP_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + payment.id, Constants.ERROR_MSG_INVALID_INPUT);
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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_PAYER_AUTH_SETUP_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + payment.id, exceptionData);
    return paymentResponse;
  }
};

export default { payerAuthSetupResponse };
