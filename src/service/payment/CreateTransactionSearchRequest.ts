import restApi from 'cybersource-rest-client';
import path from 'path';
import { Constants } from '../../constants';
import paymentService from '../../utils/PaymentService';

const getTransactionSearchResponse = async (query, sort, midCredentials) => {
  let runEnvironment: any;
  let errorData: any;
  let exceptionData: any;
  let searchResponse = {
    httpCode: null,
    data: null,
  };
  try {
    if (null != query && null != sort && null != midCredentials) {
      runEnvironment = (Constants.LIVE_ENVIRONMENT == process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase()) ? Constants.PAYMENT_GATEWAY_PRODUCTION_ENVIRONMENT : runEnvironment = Constants.PAYMENT_GATEWAY_TEST_ENVIRONMENT;
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
      const apiClient = new restApi.ApiClient();
      var requestObj = new restApi.CreateSearchRequest();
      requestObj.save = false;
      requestObj.query = query;
      requestObj.limit = Constants.VAL_FIFTY;
      requestObj.offset = Constants.VAL_ZERO;
      requestObj.sort = sort;
      if (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ENABLE_DEBUG) {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_TRANSACTION_SEARCH_RESPONSE, Constants.LOG_INFO, null, Constants.CREATE_TRANSACTION_SEARCH_REQUEST + JSON.stringify(requestObj));
      }
      const searchTransactionsApiInstance = new restApi.SearchTransactionsApi(configObject, apiClient);
      return await new Promise((resolve, reject) => {
        searchTransactionsApiInstance.createSearch(requestObj, function (error, data, response) {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_TRANSACTION_SEARCH_RESPONSE, Constants.LOG_INFO, null, Constants.CREATE_TRANSACTION_SEARCH_RESPONSE + JSON.stringify(response));
          if (data) {
            searchResponse.httpCode = response[Constants.STRING_RESPONSE_STATUS];
            searchResponse.data = data;
            resolve(searchResponse);
          } else if (error) {
            if (error.hasOwnProperty(Constants.STRING_RESPONSE) && null != error.response && Constants.VAL_ZERO < Object.keys(error.response).length && error.response.hasOwnProperty(Constants.STRING_TEXT) && null != error.response.text && Constants.VAL_ZERO < Object.keys(error.response.text).length) {
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_TRANSACTION_SEARCH_RESPONSE, Constants.LOG_ERROR, null, error.response.text);
            } else {
              if (typeof error === 'object') {
                errorData = JSON.stringify(error);
              } else {
                errorData = error;
              }
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_TRANSACTION_SEARCH_RESPONSE, Constants.LOG_ERROR, null, errorData);
            }
            searchResponse.httpCode = error.status;
            reject(searchResponse);
          } else {
            reject(searchResponse);
          }
        });
      }).catch((error) => {
        return error;
      });
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_TRANSACTION_SEARCH_RESPONSE, Constants.LOG_INFO, null, Constants.ERROR_MSG_INVALID_INPUT);
      return searchResponse;
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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_TRANSACTION_SEARCH_RESPONSE, Constants.LOG_ERROR, null, exceptionData);
    return searchResponse;
  }
};

export default { getTransactionSearchResponse };
