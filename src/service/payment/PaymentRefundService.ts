import { Payment } from '@commercetools/platform-sdk';
import restApi, { Ptsv2paymentsidrefundsOrderInformation, Ptsv2paymentsidrefundsProcessingInformation, PtsV2PaymentsRefundPost201Response, RefundPaymentRequest } from 'cybersource-rest-client';

import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from '../../constants/paymentConstants';
import prepareFields from '../../requestBuilder/PrepareFields';
import { PaymentTransactionType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';

/**
 * Performs refund and returns the response.
 * @param {Payment} payment - The payment object.
 * @param {string} captureId - The capture ID.
 * @param {PaymentTransactionType} updateTransactions - The updated transactions object.
 * @param {string} orderNo - The order number.
 * @returns { Promise<PtsV2PaymentsRefundPost201Response>} - The refund response.
 */
const getRefundData = async (payment: Payment, captureId: string, updateTransactions: Partial<PaymentTransactionType>, orderNo: string): Promise<any> => {
  const paymentResponse = {
    httpCode: 0,
    transactionId: '',
    status: '',
  };
  let errorData;
  try {
    if (captureId && payment && updateTransactions) {
      const apiClient = new restApi.ApiClient();
      const configObject = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_REFUND_DATA, null, payment, null);
      let clientReferenceInformation = prepareFields.getClientReferenceInformation(FunctionConstant.FUNC_GET_REFUND_DATA, payment.id);
      let processingInformation = prepareFields.getProcessingInformation(FunctionConstant.FUNC_GET_REFUND_DATA, payment, orderNo, '', null, null) as Ptsv2paymentsidrefundsProcessingInformation;
      let orderInformation = prepareFields.getOrderInformation(FunctionConstant.FUNC_GET_REFUND_DATA, payment, updateTransactions, null, null, null, '', '') as Ptsv2paymentsidrefundsOrderInformation;
      let merchantDefinedFields = prepareFields.getMetaData(payment);
      const requestObj: RefundPaymentRequest = {
        clientReferenceInformation: clientReferenceInformation,
        processingInformation: processingInformation,
        orderInformation: orderInformation,

      }
      if (0 < merchantDefinedFields?.length) {
        requestObj.merchantDefinedInformation = merchantDefinedFields;
      }
      if (Constants.ECHECK === payment?.paymentMethodInfo?.method) {
        const paymentInformation = prepareFields.getPaymentInformation(FunctionConstant.FUNC_GET_REFUND_DATA, payment, null, null);
        requestObj.paymentInformation = paymentInformation;
      }
      if (paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_ENABLE_DEBUG)) {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_REFUND_DATA, Constants.LOG_DEBUG, 'PaymentId : ' + payment.id, 'Refund Request = ' + paymentUtils.maskData(JSON.stringify(requestObj)));
      }
      const refundApiInstance = configObject && new restApi.RefundApi(configObject, apiClient);
      const startTime = new Date().getTime();
      return await new Promise<PtsV2PaymentsRefundPost201Response>(function (resolve, reject) {
        if (refundApiInstance) {
          refundApiInstance.refundPayment(requestObj, captureId, function (error: any, data: any, response: any) {
            const endTime = new Date().getTime();
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_REFUND_DATA, Constants.LOG_DEBUG, 'PaymentId : ' + payment.id, 'Refund Response = ' + paymentUtils.maskData(JSON.stringify(response)), `${endTime - startTime}`);
            if (data) {
              paymentResponse.httpCode = response[Constants.STATUS_CODE] || response[Constants.STRING_RESPONSE_STATUS];
              paymentResponse.transactionId = data.id;
              paymentResponse.status = data.status;
              resolve(paymentResponse);
            } else if (error) {
              if (error?.response && error?.response?.text && 0 < error?.response?.text?.length) {
                errorData = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, ''));
                paymentResponse.transactionId = errorData.id;
                paymentResponse.status = errorData.status;
              }
              paymentResponse.httpCode = error.status;
              reject(paymentResponse);
            } else {
              reject(paymentResponse);
            }
          });
        }
      }).catch((error) => {
        return error;
      });
    } else {
      return paymentResponse;
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_REFUND_DATA, '', exception, payment.id, 'PaymentId : ', '');
    return paymentResponse;
  }
};

export default { getRefundData };
