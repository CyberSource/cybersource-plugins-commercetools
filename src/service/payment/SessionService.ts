import { Cart, Payment } from '@commercetools/platform-sdk';
import restApi, { Ptsv2paymentsOrderInformation, Ptsv2paymentsProcessingInformation } from 'cybersource-rest-client';
import { PtsV2PaymentsPost201Response } from 'cybersource-rest-client';
import { CreatePaymentRequest } from 'cybersource-rest-client';

import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from '../../constants/paymentConstants';
import prepareFields from '../../requestBuilder/PrepareFields';
import paymentUtils from '../../utils/PaymentUtils';


const getSessionResponse = async (paymentObj: Payment, cartObj: Cart): Promise<any> => {
  let errorData = {
    id: null,
    status: null,
  };
  const paymentResponse = {
    isv_payPalUrl: '',
    isv_payPalRequestId: '',
    deviceDataCollectionUrl: '',
    httpCode: 0,
    transactionId: '',
    status: '',
  };
  const apiClient = new restApi.ApiClient();
  const configObject = prepareFields.getConfigObject(FunctionConstant.FUNC_GET_SESSION_RESPONSE, null, paymentObj, null);
  let clientReferenceInformation = prepareFields.getClientReferenceInformation(FunctionConstant.FUNC_GET_SESSION_RESPONSE, paymentObj.id, paymentObj);
  const requestObj: CreatePaymentRequest = {
    clientReferenceInformation: clientReferenceInformation
  };
  requestObj.processingInformation = prepareFields.getProcessingInformation(FunctionConstant.FUNC_GET_SESSION_RESPONSE, null, '', Constants.STRING_SESSIONS, null, null) as Ptsv2paymentsProcessingInformation;
  requestObj.orderInformation = prepareFields.getOrderInformation(FunctionConstant.FUNC_GET_SESSION_RESPONSE, paymentObj, null, cartObj, null, null, '', '') as Ptsv2paymentsOrderInformation;
  requestObj.paymentInformation = prepareFields.getPaymentInformation(FunctionConstant.FUNC_GET_SESSION_RESPONSE, paymentObj, null, null);
  requestObj.merchantInformation = prepareFields.getMerchantInformation(FunctionConstant.FUNC_GET_SESSION_RESPONSE);
  paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_SESSION_RESPONSE, Constants.LOG_DEBUG, '', 'Create Session Request = ' + JSON.stringify(requestObj));
  const paymentsApiInstance = configObject && new restApi.PaymentsApi(await configObject, apiClient);
  const startTime = new Date().getTime();
  return await new Promise<PtsV2PaymentsPost201Response>(function (resolve, reject) {
    if (paymentsApiInstance) {
      paymentsApiInstance.createSessionRequest(requestObj, async function (error: any, data: any, response: any) {
        const endTime = new Date().getTime();
        paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_SESSION_RESPONSE, Constants.LOG_DEBUG, paymentUtils.maskData(JSON.stringify(response)), `${endTime - startTime}`);
        if (data) {
          paymentResponse.httpCode = response[Constants.STATUS_CODE] || response[Constants.STRING_RESPONSE_STATUS];
          paymentResponse.transactionId = data.id;
          paymentResponse.status = data.status;
          paymentResponse.isv_payPalUrl = data.processorInformation.paymentUrl;
          paymentResponse.isv_payPalRequestId = data.id;
          resolve(paymentResponse);
        } else if (error) {
          if (error?.response && error?.response?.text && 0 < error?.response?.text?.length) {
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_SESSION_RESPONSE, Constants.LOG_ERROR, '', error.response.text);
            errorData = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, ''));
            if (errorData?.id && errorData?.status) {
              paymentResponse.transactionId = errorData.id;
              paymentResponse.status = errorData.status;
            }
          } else {
            let errorDataObj;
            typeof error === Constants.STR_OBJECT ? (errorDataObj = JSON.stringify(error)) : (errorDataObj = error);
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_SESSION_RESPONSE, Constants.LOG_ERROR, 'PaymentId', errorDataObj);
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
};

export default { getSessionResponse };
