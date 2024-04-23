import path from 'path';

import restApi from 'cybersource-rest-client';

import { Constants } from '../../constants';
import { paymentType, responseType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';
import prepareFields from '../../utils/PrepareFields';

const payerAuthSetupResponse = async (payment: paymentType, customerTokenId: string) => {
  const paymentResponse = {
    accessToken: '',
    referenceId: '',
    deviceDataCollectionUrl: '',
    httpCode: 0,
    transactionId: '',
    status: '',
  };
  let errorData = {
    id: null,
    status: null,
  };
  try {
    if (payment) {
      const apiClient = new restApi.ApiClient();
      const configObject = await prepareFields.getConfigObject('FuncPayerAuthSetupResponse', null, payment, null);
      const requestObj = new restApi.PayerAuthSetupRequest();

      requestObj.clientReferenceInformation = await prepareFields.getClientReferenceInformation('FuncPayerAuthSetupResponse', payment.id);
      const tokenInformation = await prepareFields.getTokenInformation(payment, 'FuncPayerAuthSetupResponse');
      if (payment?.custom?.fields?.isv_savedToken) {
        const paymentInformation = await prepareFields.getPaymentInformation('FuncPayerAuthSetupResponse', payment, null, customerTokenId);
        requestObj.paymentInformation = paymentInformation;
      } else {
        requestObj.tokenInformation = tokenInformation;
      }

      if (Constants.STRING_TRUE === process.env.PAYMENT_GATEWAY_ENABLE_DEBUG) {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncPayerAuthSetupResponse', Constants.LOG_INFO, 'PaymentId : ' + payment.id, 'Payer Authentication Setup Request = ' + JSON.stringify(requestObj));
      }
      const payerAuthenticationApiInstance = new restApi.PayerAuthenticationApi(configObject, apiClient);
      return await new Promise<responseType>(function (resolve, reject) {
        payerAuthenticationApiInstance.payerAuthSetup(requestObj, function (error: any, data: any, response: any) {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncPayerAuthSetupResponse', Constants.LOG_INFO, 'PaymentId : ' + payment.id, 'Payer Authentication Setup Response = ' + JSON.stringify(response));
          if (data) {
            paymentResponse.httpCode = response[Constants.STATUS_CODE] || response['status'];
            paymentResponse.transactionId = data.id;
            paymentResponse.status = data.status;
            paymentResponse.accessToken = data.consumerAuthenticationInformation.accessToken;
            paymentResponse.referenceId = data.consumerAuthenticationInformation.referenceId;
            paymentResponse.deviceDataCollectionUrl = data.consumerAuthenticationInformation.deviceDataCollectionUrl;
            resolve(paymentResponse);
          } else if (error) {
            if (error?.response && error?.response?.text && 0 < error?.response?.text?.length) {
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncPayerAuthSetupResponse', Constants.LOG_ERROR, 'PaymentId : ' + payment.id, error.response.text);
              errorData = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, ''));
              if (errorData?.id && errorData?.status) {
                paymentResponse.transactionId = errorData.id;
                paymentResponse.status = errorData.status;
              }
            } else {
              let errorDataObj;
              typeof error === 'object' ? (errorDataObj = JSON.stringify(error)) : (errorDataObj = error);
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncPayerAuthSetupResponse', Constants.LOG_ERROR, 'PaymentId : ' + payment.id, errorDataObj);
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
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncPayerAuthSetupResponse', Constants.LOG_INFO, 'PaymentId : ', Constants.ERROR_MSG_INVALID_INPUT);
      return paymentResponse;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncPayerAuthSetupResponse', '', exception, payment.id, 'PaymentId : ', '');
    return paymentResponse;
  }
};

export default { payerAuthSetupResponse };
