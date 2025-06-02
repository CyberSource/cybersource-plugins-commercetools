import { Payment } from '@commercetools/platform-sdk';
import restApi, { TssV2TransactionsGet200Response } from 'cybersource-rest-client';

import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from '../../constants/paymentConstants';
import prepareFields from '../../requestBuilder/PrepareFields';
import { MidCredentialsType } from '../../types/Types';
import { errorHandler, PaymentProcessingError } from '../../utils/ErrorHandler';
import paymentUtils from '../../utils/PaymentUtils';

/**
 * Retrieves transaction data based on the payment response.
 * @param {any} PaymentResponse - The payment response object.
 * @param {Payment} payment - The payment object.
 * @returns {Promise<TssV2TransactionsGet200Response>} - A promise resolving to Visa Checkout data.
 */
const getTransactionData = async (transactionId: string, payment: Payment | null, midCredentials: MidCredentialsType | null): Promise<any> => {
  const visaCheckoutData = {
    httpCode: 0,
    billToFieldGroup: '',
    shipToFieldGroup: '',
    cardFieldGroup: '',
  };
  let paymentId = payment?.id || '';
  try {
    if (transactionId) {
      const configObject = (midCredentials) ? await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_TRANSACTION_DATA, midCredentials, null, null) : await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_TRANSACTION_DATA, null, payment, null);
      const apiClient = new restApi.ApiClient();
      const transactionDetailsApiInstance = configObject && new restApi.TransactionDetailsApi(configObject, apiClient);
      return await new Promise<TssV2TransactionsGet200Response>((resolve, reject) => {
        if (transactionDetailsApiInstance) {
          transactionDetailsApiInstance.getTransaction(transactionId, function (error: any, data: any, response: any) {
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_TRANSACTION_DATA, Constants.LOG_INFO, 'PaymentId : ' + paymentId, 'Transaction Details Response = ' + paymentUtils.maskData(JSON.stringify(response)));
            if (data) {
              visaCheckoutData.httpCode = response[Constants.STRING_RESPONSE_STATUS];
              visaCheckoutData.billToFieldGroup = data.orderInformation.billTo;
              visaCheckoutData.shipToFieldGroup = data.orderInformation.shipTo;
              visaCheckoutData.cardFieldGroup = data.paymentInformation.card;
              resolve(visaCheckoutData);
            } else if (error) {
              visaCheckoutData.httpCode = error.status;
              reject(visaCheckoutData);
            } else {
              reject(visaCheckoutData);
            }
          });
        } else {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_TRANSACTION_DATA, Constants.LOG_INFO, 'PaymentId : ' + paymentId, CustomMessages.ERROR_MSG_SERVICE_PROCESS);
        }
      }).catch((error) => {
        return error;
      });
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_TRANSACTION_DATA, Constants.LOG_INFO, 'PaymentId : ' + paymentId, CustomMessages.ERROR_MSG_INVALID_INPUT);
      return visaCheckoutData;
    }
  } catch (exception) {
    errorHandler.logError(new PaymentProcessingError(CustomMessages.EXCEPTION_MSG_TRANSACTION_SEARCH, exception,FunctionConstant.FUNC_GET_TRANSACTION_DATA),__filename,'PaymentId : ' + paymentId);
    return visaCheckoutData;
  }
};

export default { getTransactionData };