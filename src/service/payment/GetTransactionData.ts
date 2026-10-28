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
    tokenInformation: null as any,
    applications: [] as any[],
    processingInformation: null as any,
    processorInformation: null as any,
    rawTransaction: null as any,
  };
  let paymentId = payment?.id || '';
  try {
    if (transactionId) {
      const configObject = midCredentials ? await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_TRANSACTION_DATA, midCredentials, null, null) : await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_TRANSACTION_DATA, null, payment, null);
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
              visaCheckoutData.tokenInformation = data.tokenInformation || null;
              visaCheckoutData.processingInformation = data.processingInformation || null;
              visaCheckoutData.processorInformation = data.processorInformation || null;
              visaCheckoutData.applications = data?.applications || data?.applicationInformation?.applications || [];

              try {
                const parsedRawTransaction = typeof response?.text === 'string' && response.text ? JSON.parse(response.text) : null;

                if (parsedRawTransaction) {
                  visaCheckoutData.rawTransaction = parsedRawTransaction;
                  visaCheckoutData.tokenInformation = parsedRawTransaction?.tokenInformation || visaCheckoutData.tokenInformation;
                  visaCheckoutData.processingInformation = parsedRawTransaction?.processingInformation || visaCheckoutData.processingInformation;
                  visaCheckoutData.processorInformation = parsedRawTransaction?.processorInformation || visaCheckoutData.processorInformation;
                }
              } catch (_parseErr) {
                visaCheckoutData.rawTransaction = null;
              }
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
    errorHandler.logError(new PaymentProcessingError(CustomMessages.EXCEPTION_MSG_TRANSACTION_SEARCH, exception, FunctionConstant.FUNC_GET_TRANSACTION_DATA), __filename, 'PaymentId : ' + paymentId);
    return visaCheckoutData;
  }
};
// Added new function to get related transaction ID for follow-on transactions (capture/reversal/refund)
/**
 * Retrieves the related (parent) transaction ID for a follow-on transaction (capture/reversal/refund).
 * Uses the CyberSource Get Transaction API and extracts the first related transaction from _links.
 *
 * @param {string} transactionId - The CyberSource transaction ID of the follow-on transaction.
 * @param {MidCredentialsType | null} midCredentials - MID credentials.
 * @returns {Promise<string | null>} - The related (original auth) CyberSource transaction ID, or null.
 */
const getRelatedTransactionId = async (transactionId: string, midCredentials: MidCredentialsType | null): Promise<string | null> => {
  try {
    if (transactionId) {
      const configObject = midCredentials ? await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_TRANSACTION_DATA, midCredentials, null, null) : await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_TRANSACTION_DATA, null, null, null);
      const apiClient = new restApi.ApiClient();
      const transactionDetailsApiInstance = configObject && new restApi.TransactionDetailsApi(configObject, apiClient);
      return await new Promise<string | null>((resolve) => {
        if (transactionDetailsApiInstance) {
          transactionDetailsApiInstance.getTransaction(transactionId, function (_error: any, _data: any, response: any) {
            let relatedId: string | null = null;
            if (response?.text) {
              try {
                const responseBody = JSON.parse(response.text);
                const relatedTransactions = responseBody?._links?.relatedTransactions;
                if (relatedTransactions && relatedTransactions.length > 0) {
                  const href = relatedTransactions[0].href;
                  const parts = href.split('/');
                  relatedId = parts[parts.length - 1] || null;
                }
              } catch (e) {
                // JSON parse failed
              }
            }
            resolve(relatedId);
          });
        } else {
          resolve(null);
        }
      }).catch(() => null);
    }
  } catch (exception) {
    paymentUtils.logData(__filename, 'getRelatedTransactionId', Constants.LOG_INFO, '', 'Error: ' + exception);
  }
  return null;
};

export default { getTransactionData, getRelatedTransactionId };
