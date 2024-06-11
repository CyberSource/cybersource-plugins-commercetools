import path from 'path';

import restApi from 'cybersource-rest-client';
import { PtsV2PaymentsReversalsPost201Response } from 'cybersource-rest-client';

import { Constants } from '../../constants';
import { PaymentType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';
import prepareFields from '../../utils/PrepareFields';

/**
 * Performs authorization reversal and returns the response.
 * @param {PaymentType} payment - The payment object.
 * @param {any} cart - The cart object.
 * @param {string} authReversalId - The ID of the authorization reversal.
 * @returns {Promise<PtsV2PaymentsReversalsPost201Response>} - The authorization reversal response.
 */
type PtsV2PaymentsReversalsPost201Response = typeof PtsV2PaymentsReversalsPost201Response;
const authReversalResponse = async (payment: PaymentType, cart: any, authReversalId: string) => {
  let errorData;
  const paymentResponse = {
    httpCode: 0,
    transactionId: '',
    status: '',
  };
  try {
    if (authReversalId && payment) {
      const apiClient = new restApi.ApiClient();
      const configObject = await prepareFields.getConfigObject('FuncAuthReversalResponse', null, payment, null);
      const requestObj = new restApi.AuthReversalRequest();

      requestObj.clientReferenceInformation = await prepareFields.getClientReferenceInformation('FuncAuthReversalResponse', payment.id);
      requestObj.processingInformation = await prepareFields.getProcessingInformation('FuncAuthReversalResponse', payment, '', '', null, null);
      requestObj.orderInformation = await prepareFields.getOrderInformation('FuncAuthReversalResponse', payment, payment.transactions[0], cart, null, null, null, '');

      if (Constants.STRING_TRUE === process.env.PAYMENT_GATEWAY_ENABLE_DEBUG) {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAuthReversalResponse', Constants.LOG_INFO, 'PaymentId : ' + payment.id, 'Authorization Reversal Request = ' + JSON.stringify(requestObj));
      }
      const reversalApiInstance = new restApi.ReversalApi(configObject, apiClient);
      return await new Promise<PtsV2PaymentsReversalsPost201Response>((resolve, reject) => {
        reversalApiInstance.authReversal(authReversalId, requestObj, function (error: any, data: any, response: any) {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAuthReversalResponse', Constants.LOG_INFO, 'PaymentId : ' + payment.id, 'Authorization Reversal Response = ' + JSON.stringify(response));
          if (data) {
            paymentResponse.httpCode = response[Constants.STATUS_CODE] || response['status'];
            paymentResponse.transactionId = data.id;
            paymentResponse.status = data.status;
            resolve(paymentResponse);
          } else if (error) {
            if (error?.response && error?.response?.text && 0 < error?.response?.text?.length) {
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAuthReversalResponse', Constants.LOG_ERROR, 'PaymentId : ' + payment.id, error.response.text);
              errorData = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, ''));
              paymentResponse.transactionId = errorData.id;
              paymentResponse.status = errorData.status;
            } else {
              typeof error === 'object' ? (errorData = JSON.stringify(error)) : (errorData = error);
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAuthReversalResponse', Constants.LOG_ERROR, 'PaymentId : ' + payment.id, errorData);
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
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncAuthReversalResponse', Constants.LOG_INFO, 'PaymentId : ' + payment.id, Constants.ERROR_MSG_INVALID_INPUT);
      return paymentResponse;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncAuthReversalResponse', '', exception, payment.id, 'PaymentId : ', '');
    return paymentResponse;
  }
};

export default { authReversalResponse };
