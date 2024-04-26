import path from 'path';

import restApi from 'cybersource-rest-client';

import { Constants } from '../../constants';
import { paymentCustomFieldsType, responseType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';
import prepareFields from '../../utils/PrepareFields';
import multiMid from '../../utils/config/MultiMid';
const transientTokenDataResponse = async (resourceObj: any, service: string) => {
  let errorData: string;
  let transientToken: string;
  const paymentResponse = {
    httpCode: 0,
    data: '',
    status: '',
  };
  let logInput = '';
  let midCredentials = {
    merchantId: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
    merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
    merchantSecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
  };
  let tokenObject: paymentCustomFieldsType;
  try {
    if (resourceObj) {
      tokenObject = resourceObj?.custom?.fields;
      if ('Payments' === service) {
        transientToken = resourceObj?.custom?.fields?.isv_transientToken;
        logInput = 'PaymentId : ' + resourceObj?.id;
      } else {
        if (tokenObject?.isv_token) {
          transientToken = tokenObject.isv_token;
          logInput = 'CustomerId : ' + resourceObj?.id;
        }
      }
      const apiClient = new restApi.ApiClient();
      if (resourceObj?.amountPlanned && tokenObject?.isv_merchantId) {
        midCredentials = await multiMid.getMidCredentials(tokenObject.isv_merchantId);
      }
      const configObject = await prepareFields.getConfigObject('FuncTransientTokenDataResponse', midCredentials, null, null);
      const getTransientTokenDataApiInstance = new restApi.TransientTokenDataApi(configObject, apiClient);
      return await new Promise<responseType>(function (resolve, reject) {
        getTransientTokenDataApiInstance.getTransactionForTransientToken(transientToken, function (error: any, data: any, response: any) {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncTransientTokenDataResponse', Constants.LOG_INFO, 'PaymentId : ' + resourceObj.id, 'Transient Token Response Data is = ' + JSON.stringify(response));
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncTransientTokenDataResponse', Constants.LOG_INFO, 'PaymentId : ' + resourceObj.id, 'Transient Token Data Response data object = ' + JSON.stringify(data));
          if (Constants.HTTP_OK_STATUS_CODE === response.status) {
            paymentResponse.httpCode = response.status;
            paymentResponse.data = JSON.parse(response.text);
            paymentResponse.status = response.status;
            resolve(paymentResponse);
          } else if (error) {
            if (error?.response && error?.response?.text && 0 < error?.response?.text.length) {
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncTransientTokenDataResponse', Constants.LOG_ERROR, logInput, error.response.text);
              errorData = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, ''));
            } else {
              typeof error === 'object' ? (errorData = JSON.stringify(error)) : (errorData = error);
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncTransientTokenDataResponse', Constants.LOG_ERROR, logInput, errorData);
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
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncTransientTokenDataResponse', Constants.LOG_INFO, logInput, Constants.ERROR_MSG_INVALID_REQUEST);
      return paymentResponse;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncAddTokenResponse', '', exception, '', '', '');
    return paymentResponse;
  }
};

export default { transientTokenDataResponse };
