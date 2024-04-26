import path from 'path';

import restApi from 'cybersource-rest-client';

import { Constants } from '../../constants';
import { paymentType, responseType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';
import prepareFields from '../../utils/PrepareFields';

const getTransactionData = async (paymentResponse: any, payment: paymentType) => {
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
        return await new Promise<responseType>((resolve, reject) => {
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
