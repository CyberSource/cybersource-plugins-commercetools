import restApi from 'cybersource-rest-client';
import path from 'path';
import { Constants } from '../../constants';
import paymentService from '../../utils/PaymentService';

const getTransactionSearchResponse = async (query, sort) => {
  let runEnvironment: any;
  let errorData: any;
  let exceptionData: any;
  let searchResponse = {
    httpCode: null,
    message: null,
    data: null,
  };
  try {
    if (null != query && null != sort) {
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
      };
      const apiClient = new restApi.ApiClient();
      var requestObj = new restApi.CreateSearchRequest();
      requestObj.save = false;
      requestObj.query = query;
      requestObj.limit = Constants.VAL_FIFTY;
      requestObj.offset = Constants.VAL_ZERO;
      requestObj.sort = sort;
      const instance = new restApi.SearchTransactionsApi(configObject, apiClient);
      return await new Promise((resolve, reject) => {
        instance.createSearch(requestObj, function (error, data, response) {
          if (data) {
            searchResponse.httpCode = response[Constants.STRING_RESPONSE_STATUS];
            searchResponse.data = data;
            resolve(searchResponse);
          } else if (error) {
            if (Constants.STRING_RESPONSE in error && null != error.response && Constants.STRING_TEXT in error.response) {
              errorData = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, Constants.STRING_EMPTY));
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_TRANSACTION_SEARCH_RESPONSE, Constants.LOG_INFO, errorData);
              searchResponse.message = errorData.message;
            } else {
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_TRANSACTION_SEARCH_RESPONSE, Constants.LOG_INFO, error);
            }
            searchResponse.httpCode = error.status;
            reject(searchResponse);
          } else {
            reject(searchResponse);
          }
        });
      }).catch((error) => {
        return searchResponse;
      });
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_TRANSACTION_SEARCH_RESPONSE, Constants.LOG_INFO, Constants.ERROR_MSG_INVALID_INPUT);
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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GET_TRANSACTION_SEARCH_RESPONSE, Constants.LOG_ERROR, exceptionData);
    return searchResponse;
  }
};

export default { getTransactionSearchResponse };
