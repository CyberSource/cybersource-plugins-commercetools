import restApi, { CapturePaymentRequest, Ptsv2paymentsidcapturesOrderInformation, Ptsv2paymentsidreversalsProcessingInformation } from 'cybersource-rest-client';
import { PtsV2PaymentsCapturesPost201Response } from 'cybersource-rest-client';

import { Constants } from '../../constants/constants';
import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import prepareFields from '../../requestBuilder/PrepareFields';
import { PaymentTransactionType, PaymentType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';

/**
 * Performs capture and returns the response.
 * @param {PaymentType} payment - The payment object.
 * @param {PaymentTransactionType} updateTransactions - The updated transactions object.
 * @param {string} authId - The authorization ID.
 * @param {string} orderNo - The order number.
 * @returns {Promise<PtsV2PaymentsCapturesPost201Response>} - The capture response.
 */
const getCaptureResponse = async (payment: PaymentType, updateTransactions: Partial<PaymentTransactionType>, authId: string, orderNo: string): Promise<any> => {
  const paymentResponse = {
    httpCode: 0,
    transactionId: '',
    status: '',
  };
  try {
    if (authId && payment) {
      const apiClient = new restApi.ApiClient();
      const configObject = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_CAPTURE_RESPONSE, null, payment, null);
      let clientReferenceInformation = await prepareFields.getClientReferenceInformation(FunctionConstant.FUNC_GET_CAPTURE_RESPONSE, payment.id);
      let processingInformation = await prepareFields.getProcessingInformation(FunctionConstant.FUNC_GET_CAPTURE_RESPONSE, payment, orderNo, '', null, null) as Ptsv2paymentsidreversalsProcessingInformation;
      let orderInformation = await prepareFields.getOrderInformation(FunctionConstant.FUNC_GET_CAPTURE_RESPONSE, payment, updateTransactions, null, null, null, null, '') as Ptsv2paymentsidcapturesOrderInformation;
      const requestObj: CapturePaymentRequest = {
        clientReferenceInformation: clientReferenceInformation,
        processingInformation: processingInformation,
        orderInformation: orderInformation
      }
      if (paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_ENABLE_DEBUG)) paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CAPTURE_RESPONSE, Constants.LOG_INFO, 'PaymentId : ' + payment.id, 'Capture Request = ' + JSON.stringify(requestObj));
      const captureApiInstance = configObject && new restApi.CaptureApi(configObject, apiClient);
      return await new Promise<PtsV2PaymentsCapturesPost201Response>(function (resolve, reject) {
        if (captureApiInstance) {
          captureApiInstance.capturePayment(requestObj, authId, function (error: any, data: any, response: any) {
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CAPTURE_RESPONSE, Constants.LOG_INFO, 'PaymentId : ' + payment.id, 'Capture Response = ' + JSON.stringify(response));
            if (data) {
              paymentResponse.httpCode = response[Constants.STATUS_CODE] || response[Constants.STRING_RESPONSE_STATUS];
              paymentResponse.transactionId = data.id;
              paymentResponse.status = data.status;
              resolve(paymentResponse);
            } else if (error) {
              if (error?.response && error?.response?.text && 0 < error?.response?.text?.length) {
                const errorDataObj = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, ''));
                paymentResponse.transactionId = errorDataObj.id;
                paymentResponse.status = errorDataObj.status;
              }
              paymentResponse.httpCode = error.status;
              reject(paymentResponse);
            } else {
              reject(paymentResponse);
            }
          });
        } else {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CAPTURE_RESPONSE, Constants.LOG_INFO, 'PaymentId : ' + payment.id, CustomMessages.ERROR_MSG_SERVICE_PROCESS);
        }
      }).catch((error) => {
        return error;
      });
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CAPTURE_RESPONSE, Constants.LOG_INFO, 'PaymentId : ' + payment.id, CustomMessages.ERROR_MSG_INVALID_INPUT);
      return paymentResponse;
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_CAPTURE_RESPONSE, '', exception, payment.id, 'PaymentId : ', '');
    return paymentResponse;
  }
};

export default { getCaptureResponse };
