import path from 'path';

import restApi from 'cybersource-rest-client';

import { Constants } from '../../constants';
import { customTokenType, paymentTransactionType, paymentType, responseType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';
import prepareFields from '../../utils/PrepareFields';

const refundResponse = async (payment: paymentType, captureId: string, updateTransactions: paymentTransactionType, orderNo: string) => {
  const cardTokens: customTokenType = {
    customerTokenId: '',
    paymentInstrumentId: '',
  };
  let errorData;
  const paymentResponse = {
    httpCode: 0,
    transactionId: '',
    status: '',
  };
  try {
    if (captureId && payment && updateTransactions) {
      const apiClient = new restApi.ApiClient();
      const configObject = await prepareFields.getConfigObject('FuncRefundResponse', null, payment, null);
      const requestObj = new restApi.RefundPaymentRequest();

      requestObj.clientReferenceInformation = await prepareFields.getClientReferenceInformation('FuncRefundResponse', payment.id);
      requestObj.processingInformation = await prepareFields.getProcessingInformation('FuncRefundResponse', payment, orderNo, '', null, null);
      if (Constants.ECHECK === payment.paymentMethodInfo.method) {
        requestObj.paymentInformation = await prepareFields.getPaymentInformation('FuncRefundResponse', payment, cardTokens, null);
      }
      requestObj.orderInformation = await prepareFields.getOrderInformation('FuncRefundResponse', payment, updateTransactions, null, null, null, null, '');

      if (Constants.STRING_TRUE === process.env.PAYMENT_GATEWAY_ENABLE_DEBUG) {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncRefundResponse', Constants.LOG_INFO, 'PaymentId : ' + payment.id, 'Refund Request = ' + JSON.stringify(requestObj));
      }
      const refundApiInstance = new restApi.RefundApi(configObject, apiClient);
      return await new Promise<responseType>(function (resolve, reject) {
        refundApiInstance.refundPayment(requestObj, captureId, function (error: any, data: any, response: any) {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncRefundResponse', Constants.LOG_INFO, 'PaymentId : ' + payment.id, 'Refund Response = ' + JSON.stringify(response));
          if (data) {
            paymentResponse.httpCode = response[Constants.STATUS_CODE] || response['status'];
            paymentResponse.transactionId = data.id;
            paymentResponse.status = data.status;
            resolve(paymentResponse);
          } else if (error) {
            if (error?.response && error?.response?.text && 0 < error?.response?.text?.length) {
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncRefundResponse', Constants.LOG_ERROR, 'PaymentId : ' + payment.id, error.response.text);
              errorData = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, ''));
              paymentResponse.transactionId = errorData.id;
              paymentResponse.status = errorData.status;
            } else {
              typeof error === 'object' ? (errorData = JSON.stringify(error)) : (errorData = error);
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncRefundResponse', Constants.LOG_ERROR, 'PaymentId : ' + payment.id, errorData);
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
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncRefundResponse', Constants.LOG_INFO, 'PaymentId : ' + payment.id, Constants.ERROR_MSG_INVALID_INPUT);
      return paymentResponse;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncRefundResponse', '', exception, payment.id, 'PaymentId : ', '');
    return paymentResponse;
  }
};

export default { refundResponse };
