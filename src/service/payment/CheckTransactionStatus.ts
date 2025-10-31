import { Payment } from '@commercetools/platform-sdk';
import restApi, { CreatePaymentRequest, Ptsv2paymentsProcessingInformation } from 'cybersource-rest-client';

import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from '../../constants/paymentConstants';
import prepareFields from '../../requestBuilder/PrepareFields';
import { ResponseType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';



const getTransactionStatusResponse = async (paymentObj: Payment, requestId: string): Promise<any> => {
  let transactionStatusResponse: any;
  if (requestId) {
    const apiClient = new restApi.ApiClient();
    const clientReferenceInformation = prepareFields.getClientReferenceInformation(FunctionConstant.FUNC_GET_TRANSACTION_STATUS, paymentObj.id, paymentObj);
    const configObject = prepareFields.getConfigObject(FunctionConstant.FUNC_GET_TRANSACTION_STATUS, null, paymentObj, null);
    const paymentInformation = prepareFields.getPaymentInformation(FunctionConstant.FUNC_GET_TRANSACTION_STATUS, paymentObj, null, null);
    const processingInformation = prepareFields.getProcessingInformation(FunctionConstant.FUNC_GET_TRANSACTION_STATUS, null, '', Constants.STRING_STATUS, null, null) as Ptsv2paymentsProcessingInformation;
    const requestObj: CreatePaymentRequest = {
      clientReferenceInformation: clientReferenceInformation,
      paymentInformation: paymentInformation,
      processingInformation: processingInformation
    };
    if (paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_ENABLE_DEBUG))
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_TRANSACTION_STATUS, Constants.LOG_DEBUG, 'RequestId : ' + requestId, 'Check Status Request = ' + JSON.stringify(requestObj));
    const paymentApiInstance = configObject && new restApi.PaymentsApi(await configObject, apiClient);
    const startTime = new Date().getTime();
    return await new Promise<Partial<ResponseType>>(function (resolve, reject) {
      if (paymentApiInstance) {
        paymentApiInstance.refreshPaymentStatus(requestId, requestObj, (_error: any, data: any, response: any) => {
          const endTime = new Date().getTime();
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_TRANSACTION_STATUS, Constants.LOG_DEBUG, 'RequestId : ' + requestId, 'Check Status Response = ' + paymentUtils.maskData(JSON.stringify(response)), `${endTime - startTime}`);
          if (data && data?.paymentInformation?.eWallet?.accountId) {
            transactionStatusResponse = data;
            resolve(transactionStatusResponse);
          } else if (JSON.parse(response?.text).paymentInformation?.eWallet?.accountId) {
            transactionStatusResponse = JSON.parse(response?.text);
            resolve(transactionStatusResponse)
          } else {
            reject(transactionStatusResponse);
          }
        });
      }
    }).catch((error) => {
      return error;
    });
  } else {
    return transactionStatusResponse;
  }
};

export default { getTransactionStatusResponse };
