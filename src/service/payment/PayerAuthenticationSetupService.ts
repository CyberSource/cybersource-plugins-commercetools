import restApi from 'cybersource-rest-client';
import path from 'path';
import jwtDecode from 'jwt-decode';
import { Constants } from '../../constants';
import paymentService from '../../utils/PaymentService';

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
  try {
    if (null != payment) {
      const apiClient = new restApi.ApiClient();
      var requestObj = new restApi.PayerAuthSetupRequest();
      if (process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase() == Constants.TEST_ENVIRONMENT) {
        runEnvironment = Constants.PAYMENT_GATEWAY_TEST_ENVIRONMENT;
      } else if (process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase() == Constants.LIVE_ENVIRONMENT) {
        runEnvironment = Constants.PAYMENT_GATEWAY_PRODUCTION_ENVIRONMENT;
      }
      const configObject = {
        authenticationType: Constants.PAYMENT_GATEWAY_AUTHENTICATION_TYPE,
        runEnvironment: runEnvironment,
        merchantID: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
        merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
        merchantsecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
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

      if (Constants.ISV_SAVED_TOKEN in payment.custom.fields && Constants.STRING_EMPTY != payment.custom.fields.isv_savedToken) {
        var paymentInformation = new restApi.Riskv1authenticationsetupsPaymentInformation();
        var paymentInformationCustomer = new restApi.Riskv1authenticationsetupsPaymentInformationCustomer();
        paymentInformationCustomer.id = cardTokens.customerTokenId;
        paymentInformation.customer = paymentInformationCustomer;
        requestObj.paymentInformation = paymentInformation;
      } else {
        jtiToken = jwtDecode(payment.custom.fields.isv_token);
        var tokenInformation = new restApi.Riskv1authenticationsetupsTokenInformation();
        tokenInformation.transientToken = jtiToken.jti;
        requestObj.tokenInformation = tokenInformation;
      }
      const instance = new restApi.PayerAuthenticationApi(configObject, apiClient);
      return await new Promise(function (resolve, reject) {
        instance.payerAuthSetup(requestObj, function (error, data, response) {
          if (data) {
            paymentResponse.httpCode = response[Constants.STATUS_CODE];
            paymentResponse.transactionId = data.id;
            paymentResponse.status = data.status;
            paymentResponse.accessToken = data.consumerAuthenticationInformation.accessToken;
            paymentResponse.referenceId = data.consumerAuthenticationInformation.referenceId;
            paymentResponse.deviceDataCollectionUrl = data.consumerAuthenticationInformation.deviceDataCollectionUrl;
            resolve(paymentResponse);
          } else if (error) {
            if (error.hasOwnProperty(Constants.STRING_RESPONSE) && null != error.response && Constants.VAL_ZERO < Object.keys(error.response).length && error.response.hasOwnProperty(Constants.STRING_TEXT) && null != error.response.text && Constants.VAL_ZERO < Object.keys(error.response.text).length) {
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_PAYER_AUTH_SETUP_RESPONSE, Constants.LOG_INFO, error.response.text);
              errorData = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, Constants.STRING_EMPTY));
              paymentResponse.transactionId = errorData.id;
              paymentResponse.status = errorData.status;
            } else {
              if (typeof error === 'object') {
                errorData = JSON.stringify(error);
              } else {
                errorData = error;
              }
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_PAYER_AUTH_SETUP_RESPONSE, Constants.LOG_INFO, errorData);
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
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_PAYER_AUTH_SETUP_RESPONSE, Constants.LOG_INFO, Constants.ERROR_MSG_INVALID_INPUT);
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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_PAYER_AUTH_SETUP_RESPONSE, Constants.LOG_ERROR, exceptionData);
    return paymentResponse;
  }
};

export default { payerAuthSetupResponse };
