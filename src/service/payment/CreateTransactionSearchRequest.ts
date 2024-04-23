import path from 'path';

import restApi from 'cybersource-rest-client';

import { Constants } from '../../constants';
import { midCredentialsType, responseType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';
import prepareFields from '../../utils/PrepareFields';
const getTransactionSearchResponse = async (query: string, sort: string, midCredentials: midCredentialsType) => {
  let errorData: string;
  const searchResponse = {
    httpCode: 0,
    data: '',
  };
  try {
    if (query && sort && midCredentials) {
      const configObject = await prepareFields.getConfigObject('FuncGetTransactionSearchResponse', midCredentials, null, null);
      const apiClient = new restApi.ApiClient();
      const requestObj = new restApi.CreateSearchRequest();

      requestObj.save = false;
      requestObj.query = query;
      requestObj.limit = 50;
      requestObj.offset = 0;
      requestObj.sort = sort;

      if (Constants.STRING_TRUE === process.env.PAYMENT_GATEWAY_ENABLE_DEBUG) {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetTransactionSearchResponse', Constants.LOG_INFO, '', 'Create Transaction Search Request = ' + JSON.stringify(requestObj));
      }
      const searchTransactionsApiInstance = new restApi.SearchTransactionsApi(configObject, apiClient);
      return await new Promise<responseType>((resolve, reject) => {
        searchTransactionsApiInstance.createSearch(requestObj, function (error: any, data: any, response: any) {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetTransactionSearchResponse', Constants.LOG_INFO, '', 'Create Transaction Search Response = ' + JSON.stringify(response));
          if (data) {
            searchResponse.httpCode = response[Constants.STRING_RESPONSE_STATUS];
            searchResponse.data = data;
            resolve(searchResponse);
          } else if (error) {
            if (error?.response && error?.response?.text && 0 < error?.response?.text?.length) {
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetTransactionSearchResponse', Constants.LOG_ERROR, '', error.response.text);
            } else {
              typeof error === 'object' ? (errorData = JSON.stringify(error)) : (errorData = error);
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetTransactionSearchResponse', Constants.LOG_ERROR, '', errorData);
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
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetTransactionSearchResponse', Constants.LOG_INFO, '', Constants.ERROR_MSG_INVALID_INPUT);
      return searchResponse;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncGetTransactionSearchResponse', '', exception, '', '', '');
    return searchResponse;
  }
};

export default { getTransactionSearchResponse };
