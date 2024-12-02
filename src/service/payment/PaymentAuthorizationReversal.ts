import restApi, { AuthReversalRequest, Ptsv2paymentsidreversalsOrderInformation } from 'cybersource-rest-client';
import { PtsV2PaymentsReversalsPost201Response } from 'cybersource-rest-client';

import { Constants } from '../../constants/constants';
import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import prepareFields from '../../requestBuilder/PrepareFields';
import { PaymentType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';

/**
 * Performs authorization reversal and returns the response.
 * @param {PaymentType} payment - The payment object.
 * @param {any} cart - The cart object.
 * @param {string} authReversalId - The ID of the authorization reversal.
 * @returns {Promise<PtsV2PaymentsReversalsPost201Response>} - The authorization reversal response.
 */
const getAuthReversalResponse = async (payment: PaymentType, cart: any, authReversalId: string) => {
  let errorData;
  const paymentResponse = {
    httpCode: 0,
    transactionId: '',
    status: '',
  };
  try {
    if (authReversalId && payment) {
      const apiClient = new restApi.ApiClient();
      const configObject = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE, null, payment, null);
      let clientReferenceInformation = await prepareFields.getClientReferenceInformation(FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE, payment.id);
      let processingInformation = await prepareFields.getProcessingInformation(FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE, payment, '', '', null, null) as PtsV2PaymentsReversalsPost201Response;
      let orderInformation = await prepareFields.getOrderInformation(FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE, payment, payment.transactions[0], cart, null, null, null, '') as Ptsv2paymentsidreversalsOrderInformation;
      const requestObj: AuthReversalRequest = {
        clientReferenceInformation: clientReferenceInformation,
        processingInformation: processingInformation,
        orderInformation: orderInformation
      }

      if (paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_ENABLE_DEBUG)) {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE, Constants.LOG_INFO, 'PaymentId : ' + payment.id, 'Authorization Reversal Request = ' + JSON.stringify(requestObj));
      }
      const reversalApiInstance = configObject && new restApi.ReversalApi(configObject, apiClient);
      return await new Promise<PtsV2PaymentsReversalsPost201Response>((resolve, reject) => {
        if (reversalApiInstance) {
          reversalApiInstance.authReversal(authReversalId, requestObj, function (error: any, data: any, response: any) {
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE, Constants.LOG_INFO, 'PaymentId : ' + payment.id, 'Authorization Reversal Response = ' + JSON.stringify(response));
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
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE, Constants.LOG_INFO, 'PaymentId : ' + payment.id, CustomMessages.ERROR_MSG_SERVICE_PROCESS);
        }
      }).catch((error) => {
        return error;
      });
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE, Constants.LOG_INFO, 'PaymentId : ' + payment.id, CustomMessages.ERROR_MSG_INVALID_INPUT);
      return paymentResponse;
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE, '', exception, payment.id, 'PaymentId : ', '');
    return paymentResponse;
  }
};

export default { getAuthReversalResponse };
