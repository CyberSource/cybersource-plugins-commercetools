import restApi, { Ptsv2paymentsidrefundsOrderInformation, Ptsv2paymentsidrefundsProcessingInformation, RefundPaymentRequest } from 'cybersource-rest-client';
import { PtsV2PaymentsRefundPost201Response } from 'cybersource-rest-client';

import { Constants } from '../../constants/constants';
import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import prepareFields from '../../requestBuilder/PrepareFields';
import { CustomTokenType, PaymentTransactionType, PaymentType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';

/**
 * Performs refund and returns the response.
 * @param {PaymentType} payment - The payment object.
 * @param {string} captureId - The capture ID.
 * @param {PaymentTransactionType} updateTransactions - The updated transactions object.
 * @param {string} orderNo - The order number.
 * @returns { Promise<PtsV2PaymentsRefundPost201Response>} - The refund response.
 */
const getRefundData = async (payment: PaymentType, captureId: string, updateTransactions: Partial<PaymentTransactionType>, orderNo: string): Promise<any> => {
  const cardTokens: CustomTokenType = {
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
      const configObject = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_REFUND_DATA, null, payment, null);
      let clientReferenceInformation = await prepareFields.getClientReferenceInformation(FunctionConstant.FUNC_GET_REFUND_DATA, payment.id);
      let processingInformation = await prepareFields.getProcessingInformation(FunctionConstant.FUNC_GET_REFUND_DATA, payment, orderNo, '', null, null) as Ptsv2paymentsidrefundsProcessingInformation;
      let orderInformation = await prepareFields.getOrderInformation(FunctionConstant.FUNC_GET_REFUND_DATA, payment, updateTransactions, null, null, null, null, '') as Ptsv2paymentsidrefundsOrderInformation;
      const requestObj: RefundPaymentRequest = {
        clientReferenceInformation: clientReferenceInformation,
        processingInformation: processingInformation,
        orderInformation: orderInformation,
      }
      if (Constants.ECHECK === payment.paymentMethodInfo.method) {
        const paymentInformation = await prepareFields.getPaymentInformation(FunctionConstant.FUNC_GET_REFUND_DATA, payment, cardTokens, null);
        requestObj.paymentInformation = paymentInformation;
      }
      if (paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_ENABLE_DEBUG)) paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_REFUND_DATA, Constants.LOG_INFO, 'PaymentId : ' + payment.id, 'Refund Request = ' + JSON.stringify(requestObj));
      const refundApiInstance = configObject && new restApi.RefundApi(configObject, apiClient);
      return await new Promise<PtsV2PaymentsRefundPost201Response>(function (resolve, reject) {
        if (refundApiInstance) {
          refundApiInstance.refundPayment(requestObj, captureId, function (error: any, data: any, response: any) {
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_REFUND_DATA, Constants.LOG_INFO, 'PaymentId : ' + payment.id, 'Refund Response = ' + JSON.stringify(response));
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
        } else {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_REFUND_DATA, Constants.LOG_INFO, 'PaymentId : ' + payment.id, CustomMessages.ERROR_MSG_SERVICE_PROCESS);
        }
      }).catch((error) => {
        return error;
      });
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_REFUND_DATA, Constants.LOG_INFO, 'PaymentId : ' + payment.id, CustomMessages.ERROR_MSG_INVALID_INPUT);
      return paymentResponse;
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_REFUND_DATA, '', exception, payment.id, 'PaymentId : ', '');
    return paymentResponse;
  }
};
export default { getRefundData };
