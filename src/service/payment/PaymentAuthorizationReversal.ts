import { Cart, Payment } from '@commercetools/platform-sdk';
import restApi, { AuthReversalRequest, Ptsv2paymentsidreversalsOrderInformation, PtsV2PaymentsReversalsPost201Response } from 'cybersource-rest-client';

import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from '../../constants/paymentConstants';
import prepareFields from '../../requestBuilder/PrepareFields';
import { PaymentTransactionType } from '../../types/Types';
import { errorHandler, PaymentProcessingError } from '../../utils/ErrorHandler';
import paymentUtils from '../../utils/PaymentUtils';

/**
 * Performs authorization reversal and returns the response.
 * @param {Payment} payment - The payment object.
 * @param {any} cart - The cart object.
 * @param {string} authReversalId - The ID of the authorization reversal.
 * @returns {Promise<PtsV2PaymentsReversalsPost201Response>} - The authorization reversal response.
 */
const getAuthReversalResponse = async (payment: Payment, cart: Cart, authReversalId: string) => {
  const paymentResponse = {
    httpCode: 0,
    transactionId: '',
    status: '',
  };
  let errorData;
  try {
    if (authReversalId && payment) {
      const apiClient = new restApi.ApiClient();
      const configObject = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE, null, payment, null);
      let clientReferenceInformation = prepareFields.getClientReferenceInformation(FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE, payment.id);
      let processingInformation = prepareFields.getProcessingInformation(FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE, payment, '', '', null, null) as PtsV2PaymentsReversalsPost201Response;
      let orderInformation = prepareFields.getOrderInformation(FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE, payment, payment.transactions[0] as Partial<PaymentTransactionType>, cart, null, null, '', '') as Ptsv2paymentsidreversalsOrderInformation;
      const requestObj: AuthReversalRequest = {
        clientReferenceInformation: clientReferenceInformation,
        processingInformation: processingInformation,
        orderInformation: orderInformation
      }
      if (paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_ENABLE_DEBUG)) {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE, Constants.LOG_DEBUG, 'PaymentId : ' + payment.id, 'Authorization Reversal Request = ' + paymentUtils.maskData(JSON.stringify(requestObj)));
      }
      const reversalApiInstance = configObject && new restApi.ReversalApi(configObject, apiClient);
      const startTime = new Date().getTime();
      return await new Promise<PtsV2PaymentsReversalsPost201Response>((resolve, reject) => {
        if (reversalApiInstance) {
          reversalApiInstance.authReversal(authReversalId, requestObj, function (error: any, data: any, response: any) {
            const endTime = new Date().getTime();
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE, Constants.LOG_DEBUG, 'PaymentId : ' + payment.id, 'Authorization Reversal Response = ' + paymentUtils.maskData(JSON.stringify(response)), `${endTime - startTime}`);
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
    errorHandler.logError(new PaymentProcessingError(CustomMessages.EXCEPTION_MSG_PROCESSING_REQUEST, exception,FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE),__filename,'');
    return paymentResponse;
  }
};

export default { getAuthReversalResponse };
