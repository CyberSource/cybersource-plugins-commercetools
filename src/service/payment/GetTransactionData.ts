import path from 'path';

import restApi from 'cybersource-rest-client';
import { TssV2TransactionsGet200Response } from 'cybersource-rest-client';

import { Constants } from '../../constants';
import { PaymentType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';
import prepareFields from '../../utils/PrepareFields';

/**
 * Retrieves transaction data based on the payment response.
 * @param {any} PaymentResponse - The payment response object.
 * @param {PaymentType} payment - The payment object.
 * @returns {Promise<TssV2TransactionsGet200Response>} - A promise resolving to Visa Checkout data.
 */
type TssV2TransactionsGet200Response = typeof TssV2TransactionsGet200Response;

const getTransactionData = async (paymentResponse: any, payment: PaymentType): Promise<any> => {
  let errorData: string;
  const visaCheckoutData = {
    httpCode: 0,
    billToFieldGroup: '',
    shipToFieldGroup: '',
    cardFieldGroup: '',
  };
  try {
    if (paymentResponse && payment) {
      const id = paymentResponse.transactionId;
      if (id) {
        const configObject = await prepareFields.getConfigObject('FuncGetTransactionData', null, payment, null);
        const apiClient = new restApi.ApiClient();
        const transactionDetailsApiInstance = new restApi.TransactionDetailsApi(configObject, apiClient);
        return await new Promise<TssV2TransactionsGet200Response>((resolve, reject) => {
          transactionDetailsApiInstance.getTransaction(id, function (error: any, data: any, response: any) {
            paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetTransactionData', Constants.LOG_INFO, 'PaymentId : ' + payment.id, 'Transaction Details Response = ' + JSON.stringify(response));
            if (data) {
              visaCheckoutData.httpCode = response[Constants.STRING_RESPONSE_STATUS];
              visaCheckoutData.billToFieldGroup = data.orderInformation.billTo;
              visaCheckoutData.shipToFieldGroup = data.orderInformation.shipTo;
              visaCheckoutData.cardFieldGroup = data.paymentInformation.card;
              resolve(visaCheckoutData);
            } else if (error) {
              if (error?.response && error?.response?.text && 0 < error?.response?.text?.length) {
                paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetTransactionData', Constants.LOG_ERROR, 'PaymentId : ' + payment.id, error.response.text);
              } else {
                typeof error === 'object' ? (errorData = JSON.stringify(error)) : (errorData = error);
                paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetTransactionData', Constants.LOG_ERROR, 'PaymentId : ' + payment.id, errorData);
              }
              visaCheckoutData.httpCode = error.status;
              reject(visaCheckoutData);
            } else {
              reject(visaCheckoutData);
            }
          });
        }).catch((error) => {
          return error;
        });
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetTransactionData', Constants.LOG_INFO, 'PaymentId : ' + payment.id, Constants.ERROR_MSG_INVALID_INPUT);
        return visaCheckoutData;
      }
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetTransactionData', Constants.LOG_INFO, 'PaymentId : ' + payment.id, Constants.ERROR_MSG_INVALID_INPUT);
      return visaCheckoutData;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncGetTransactionData', '', exception, payment.id, 'PaymentId : ', '');
    return visaCheckoutData;
  }
};

export default { getTransactionData };
