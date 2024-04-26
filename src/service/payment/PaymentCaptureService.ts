import path from 'path';

import restApi from 'cybersource-rest-client';

import { Constants } from '../../constants';
import { paymentTransactionType, paymentType, responseType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';
import prepareFields from '../../utils/PrepareFields';

const captureResponse = async (payment: paymentType, updateTransactions: paymentTransactionType, authId: string, orderNo: string) => {
  let errorData: string;
  const paymentResponse = {
    httpCode: 0,
    transactionId: '',
    status: '',
  };
  try {
    if (authId && payment) {
      const apiClient = new restApi.ApiClient();
      const configObject = await prepareFields.getConfigObject('FuncCaptureResponse', null, payment, null);
      const requestObj = new restApi.CapturePaymentRequest();

      requestObj.clientReferenceInformation = await prepareFields.getClientReferenceInformation('FuncCaptureResponse', payment.id);
      requestObj.processingInformation = await prepareFields.getProcessingInformation('FuncCaptureResponse', payment, orderNo, '', null, null);
      requestObj.orderInformation = await prepareFields.getOrderInformation('FuncCaptureResponse', payment, updateTransactions, null, null, null, null, '');

      if (Constants.STRING_TRUE === process.env.PAYMENT_GATEWAY_ENABLE_DEBUG) {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncCaptureResponse', Constants.LOG_INFO, 'PaymentId : ' + payment.id, 'Capture Request = ' + JSON.stringify(requestObj));
      }
      const captureApiInstance = new restApi.CaptureApi(configObject, apiClient);
      return await new Promise<responseType>(function (resolve, reject) {
        captureApiInstance.capturePayment(requestObj, authId, function (error: any, data: any, response: any) {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncCaptureResponse', Constants.LOG_INFO, 'PaymentId : ' + payment.id, 'Capture Response = ' + JSON.stringify(response));
          if (data) {
            paymentResponse.httpCode = response[Constants.STATUS_CODE] || response['status'];
            paymentResponse.transactionId = data.id;
            paymentResponse.status = data.status;
            resolve(paymentResponse);
          } else if (error) {
            if (error?.response && error?.response?.text && 0 < error?.response?.text?.length) {
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncCaptureResponse', Constants.LOG_ERROR, 'PaymentId : ' + payment.id, error.response.text);
              const errorDataObj = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, ''));
              paymentResponse.transactionId = errorDataObj.id;
              paymentResponse.status = errorDataObj.status;
            } else {
              typeof error === 'object' ? (errorData = JSON.stringify(error)) : (errorData = error);
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncCaptureResponse', Constants.LOG_ERROR, 'PaymentId : ' + payment.id, errorData);
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
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncCaptureResponse', Constants.LOG_INFO, 'PaymentId : ' + payment.id, Constants.ERROR_MSG_INVALID_INPUT);
      return paymentResponse;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncCaptureResponse', '', exception, payment.id, 'PaymentId : ', '');
    return paymentResponse;
  }
};

export default { captureResponse };
