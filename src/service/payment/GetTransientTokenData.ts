import restApi from 'cybersource-rest-client';
import path from 'path';
import paymentService from '../../utils/PaymentService';
import { Constants } from '../../constants';
import multiMid from '../../utils/config/MultiMid';

const transientTokenDataResponse = async (resourceObj, service) => {
  let runEnvironment: any;
  let errorData: any;
  let exceptionData: any;
  let transientToken: any;
  let paymentResponse = {
    httpCode: null,
    data: null,
    status: null,
  };
  let logInput = Constants.STRING_EMPTY;
  let midCredentials = {
    merchantId: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
    merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
    merchantSecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
  };
  try {
    if (null != resourceObj) {
      if (Constants.SERVICE_PAYMENT == service) {
        transientToken = resourceObj.custom.fields.isv_transientToken;
        logInput = Constants.LOG_PAYMENT_ID + resourceObj?.id;
      } else {
        transientToken = resourceObj.custom.fields.isv_token;
        logInput = Constants.LOG_CUSTOMER_ID + resourceObj?.id;
      }
      const apiClient = new restApi.ApiClient();
      runEnvironment = (Constants.LIVE_ENVIRONMENT == process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase()) ? Constants.PAYMENT_GATEWAY_PRODUCTION_ENVIRONMENT : runEnvironment = Constants.PAYMENT_GATEWAY_TEST_ENVIRONMENT;
      if (resourceObj?.amountPlanned && resourceObj?.custom?.fields?.isv_merchantId) {
        midCredentials = await multiMid.getMidCredentials(resourceObj);
      }
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
      const getTransientTokenDataApiInstance = new restApi.TransientTokenDataApi(configObject, apiClient);
      return await new Promise(function (resolve, reject) {
        getTransientTokenDataApiInstance.getTransactionForTransientToken(transientToken, function (error, data, response) {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_TRANSIENT_TOKEN_DATA_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + resourceObj.id, Constants.TRANSIENT_TOKEN_DATA_RESPONSE + JSON.stringify(response));
          if (Constants.HTTP_CODE_TWO_HUNDRED == response.status) {
            paymentResponse.httpCode = response.status;
            paymentResponse.data = response.text;
            paymentResponse.status = response.status;
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
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_TRANSIENT_TOKEN_DATA_RESPONSE, Constants.LOG_ERROR, logInput, error.response.text);
              errorData = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, Constants.STRING_EMPTY));
              paymentResponse.status = errorData.status;
            } else {
              if (typeof error === 'object') {
                errorData = JSON.stringify(error);
              } else {
                errorData = error;
              }
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_TRANSIENT_TOKEN_DATA_RESPONSE, Constants.LOG_ERROR, logInput, errorData);
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
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_TRANSIENT_TOKEN_DATA_RESPONSE, Constants.LOG_INFO, logInput, Constants.ERROR_MSG_INVALID_REQUEST);
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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_TRANSIENT_TOKEN_DATA_RESPONSE, Constants.LOG_ERROR, logInput, exceptionData);
    return paymentResponse;
  }
};

export default { transientTokenDataResponse };
