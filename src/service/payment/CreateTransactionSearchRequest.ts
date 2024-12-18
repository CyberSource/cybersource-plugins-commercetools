import restApi, { CreateSearchRequest } from 'cybersource-rest-client';
import { TssV2TransactionsPost201Response } from 'cybersource-rest-client';

import { Constants } from '../../constants/constants';
import { FunctionConstant } from '../../constants/functionConstant';
import prepareFields from '../../requestBuilder/PrepareFields';
import { MidCredentialsType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';

/**
 * Retrieves transaction search response.
 * @param {string} query - The query string.
 * @param {string} sort - The sort order.
 * @param {MidCredentialsType} midCredentials - The MID credentials.
 * @returns {Promise<TssV2TransactionsPost201Response>} A promise that resolves with the transaction search response.
 */
const getTransactionSearchResponse = async (query: string, limit: number, sort: string, midCredentials: MidCredentialsType, disableDebug?: boolean): Promise<any> => {
  const searchResponse = {
    httpCode: 0,
    data: '',
  };
  if (query && limit && sort && midCredentials) {
    const configObject = prepareFields.getConfigObject(FunctionConstant.FUNC_GET_TRANSACTION_SEARCH_RESPONSE, midCredentials, null, null);
    const apiClient = new restApi.ApiClient();
    const requestObj: CreateSearchRequest = {
      save: false,
      query: query,
      limit: limit,
      offset: 0,
      sort: sort
    }
    if (paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_ENABLE_DEBUG) && !disableDebug) {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_TRANSACTION_SEARCH_RESPONSE, Constants.LOG_DEBUG, '', 'Create Transaction Search Request = ' + paymentUtils.maskData(JSON.stringify(requestObj)));
    }
    const searchTransactionsApiInstance = configObject && new restApi.SearchTransactionsApi(configObject, apiClient);
    const startTime = new Date().getTime();
    return await new Promise<TssV2TransactionsPost201Response>((resolve, reject) => {
      if (searchTransactionsApiInstance) {
        searchTransactionsApiInstance.createSearch(requestObj, function (error: any, data: any, response: any) {
          const endTime = new Date().getTime();
          if (!disableDebug) {
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_TRANSACTION_SEARCH_RESPONSE, Constants.LOG_DEBUG, '', 'Create Transaction Search Response = ' + paymentUtils.maskData(JSON.stringify(response)), `${endTime - startTime}`);
          } else {
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_TRANSACTION_SEARCH_RESPONSE, Constants.LOG_DEBUG, '', '', `${endTime - startTime}`);
          }
          if (data) {
            searchResponse.httpCode = response[Constants.STRING_RESPONSE_STATUS];
            searchResponse.data = data;
            resolve(searchResponse);
          } else if (error) {
            searchResponse.httpCode = error.status;
            reject(searchResponse);
          } else {
            reject(searchResponse);
          }
        });
      }
    }).catch((error) => {
      return error;
    });
  } else {
    return searchResponse;
  }
};

export default { getTransactionSearchResponse };
