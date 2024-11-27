import restApi, { CreateSearchRequest } from 'cybersource-rest-client';
import { TssV2TransactionsPost201Response } from 'cybersource-rest-client';

import { Constants } from '../../constants/constants';
import { CustomMessages } from '../../constants/customMessages';
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
const getTransactionSearchResponse = async (query: string, sort: string, midCredentials: MidCredentialsType): Promise<any> => {
  const searchResponse = {
    httpCode: 0,
    data: '',
  };
  try {
    if (query && sort && midCredentials) {
      const configObject = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_TRANSACTION_SEARCH_RESPONSE, midCredentials, null, null);
      const apiClient = new restApi.ApiClient();
      const requestObj: CreateSearchRequest = {
        save: false,
        query: query,
        limit: 50,
        offset: 0,
        sort: sort
      }
      if (paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_ENABLE_DEBUG)) {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_TRANSACTION_SEARCH_RESPONSE, Constants.LOG_INFO, '', 'Create Transaction Search Request = ' + JSON.stringify(requestObj));
      }
      const searchTransactionsApiInstance = configObject && new restApi.SearchTransactionsApi(configObject, apiClient);
      return await new Promise<TssV2TransactionsPost201Response>((resolve, reject) => {
        if(searchTransactionsApiInstance) {
          searchTransactionsApiInstance.createSearch(requestObj, function (error: any, data: any, response: any) {
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_TRANSACTION_SEARCH_RESPONSE, Constants.LOG_INFO, '', 'Create Transaction Search Response = ' + JSON.stringify(response));
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
        } else {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_TRANSACTION_SEARCH_RESPONSE, Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_SERVICE_PROCESS);
        }
      }).catch((error) => {
        return error;
      });
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_TRANSACTION_SEARCH_RESPONSE, Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_INVALID_INPUT);
      return searchResponse;
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_TRANSACTION_SEARCH_RESPONSE, '', exception, '', '', '');
    return searchResponse;
  }
};

export default { getTransactionSearchResponse };
