import restApi from 'cybersource-rest-client';

import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from '../../constants/paymentConstants';
import prepareFields from '../../requestBuilder/PrepareFields';
import { PaymentCustomFieldsType, ResponseType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';
import multiMid from '../../utils/config/MultiMid';

/**
 * Retrieves transient token data.
 * @param {any} resourceObj - The resource object.
 * @param {string} service - The service name.
 * @returns {Promise<any>} - A promise resolving to transient token data response.
 */
const getTransientTokenDataResponse = async (resourceObj: any, service: string): Promise<any> => {
  let errorData: string;
  let transientToken: string;
  let logInput = '';
  const paymentResponse = {
    httpCode: 0,
    data: '',
    status: '',
  };
  let midCredentials = {
    merchantId: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
    merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
    merchantSecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
  };
  let tokenObject: Partial<PaymentCustomFieldsType>;
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
      if (tokenObject?.isv_merchantId) {
        midCredentials = multiMid.getMidCredentials(tokenObject.isv_merchantId);
      }
      const configObject = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_TRANSIENT_TOKEN_DATA_RESPONSE, midCredentials, null, null);
      const getTransientTokenDataApiInstance = configObject && new restApi.TransientTokenDataApi(configObject, apiClient);
      const startTime = new Date().getTime();
      return await new Promise<Partial<ResponseType>>(function (resolve, reject) {
        if (getTransientTokenDataApiInstance) {
          getTransientTokenDataApiInstance.getTransactionForTransientToken(transientToken, function (error: any, data: any, response: any) {
            const endTime = new Date().getTime();
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_TRANSIENT_TOKEN_DATA_RESPONSE, Constants.LOG_DEBUG, 'PaymentId : ' + resourceObj.id, 'Transient Token Response Data is = ' + response, `${endTime - startTime}`);
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_TRANSIENT_TOKEN_DATA_RESPONSE, Constants.LOG_DEBUG, 'PaymentId : ' + resourceObj.id, 'Transient Token Data Response data object = ' + JSON.stringify(data));
            if (Constants.HTTP_OK_STATUS_CODE === response.status) {
              paymentResponse.httpCode = response.status;
              paymentResponse.data = JSON.parse(response.text);
              paymentResponse.status = response.status;
              resolve(paymentResponse);
            } else if (error) {
              if (error?.response && error?.response?.text && 0 < error?.response?.text.length) {
                paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_TRANSIENT_TOKEN_DATA_RESPONSE, Constants.LOG_ERROR, logInput, error.response.text);
                errorData = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, ''));
              } else {
                typeof error === Constants.STR_OBJECT ? (errorData = JSON.stringify(error)) : (errorData = error);
                paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_TRANSIENT_TOKEN_DATA_RESPONSE, Constants.LOG_ERROR, logInput, errorData);
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
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_TRANSIENT_TOKEN_DATA_RESPONSE, '', exception, '', '', '');
    return paymentResponse;
  }
};

export default { getTransientTokenDataResponse };
