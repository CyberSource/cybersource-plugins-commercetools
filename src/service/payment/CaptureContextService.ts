import path from 'path';

import restApi from 'cybersource-rest-client';

import { Constants } from '../../constants';
import paymentUtils from '../../utils/PaymentUtils';
import prepareFields from '../../utils/PrepareFields';
const generateCaptureContext = async (cartObj: any, country: string, locale: string, currencyCode: string, merchantId: string, service: string): Promise<string> => {
  let isv_tokenCaptureContextSignature = '';
  let errorData: string;
  let cartId = '';
  try {
    if (('Payments' === service && cartObj) || ('MyAccounts' === service && country && locale && currencyCode)) {
      const apiClient = new restApi.ApiClient();
      const configObject = await prepareFields.getConfigObject('FuncGenerateCaptureContext', null, null, merchantId);
      const requestObj = new restApi.GenerateUnifiedCheckoutCaptureContextRequest();

      if ('Payments' === service) {
        cartId = 'CartId : ' + cartObj.id;
        requestObj.orderInformation = await prepareFields.getOrderInformation('FuncGenerateCaptureContext', null, null, cartObj, null, null, service, currencyCode);
        const captureMandate = await prepareFields.getCaptureMandate(service);
        requestObj.captureMandate = captureMandate;
        if (cartObj?.locale && cartObj.locale.includes(Constants.REGEX_HYPHEN)) {
          cartObj.locale = cartObj.locale.replace(Constants.REGEX_HYPHEN, Constants.REGEX_UNDERSCORE);
        }
        requestObj.locale = cartObj.locale;
        requestObj.country = cartObj.country;
        requestObj.allowedPaymentTypes = await prepareFields.getAllowedPaymentMethods();
      } else if ('MyAccounts' === service) {
        requestObj.orderInformation = await prepareFields.getOrderInformation('FuncGenerateCaptureContext', null, null, cartObj, null, null, service, currencyCode);
        const captureMandate = await prepareFields.getCaptureMandate(service);
        requestObj.captureMandate = captureMandate;
        requestObj.locale = locale;
        requestObj.country = country;
        requestObj.allowedPaymentTypes = ['PANENTRY'];
      }
      requestObj.clientVersion = Constants.CAPTURE_CONTEXT_CLIENT_VERSION;
      const allowedCardNetworks = await prepareFields.getAllowedCardNetworks('FuncGenerateCaptureContext');
      requestObj.allowedCardNetworks = allowedCardNetworks;
      requestObj.targetOrigins = await prepareFields.getTargetOrigins('FuncGenerateCaptureContext');

      if (Constants.STRING_TRUE === process.env.PAYMENT_GATEWAY_ENABLE_DEBUG) {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGenerateCaptureContext', Constants.LOG_INFO, cartId, 'Capture Context Request = ' + JSON.stringify(requestObj));
      }
      const unifiedCheckoutCaptureContextApiInstance = new restApi.UnifiedCheckoutCaptureContextApi(configObject, apiClient);
      return await new Promise<string>(function (resolve, reject) {
        unifiedCheckoutCaptureContextApiInstance.generateUnifiedCheckoutCaptureContext(requestObj, function (error: any, data: any, response: any) {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGenerateCaptureContext', Constants.LOG_INFO, cartId, 'Capture Context Response = ' + JSON.stringify(response));
          if (data) {
            isv_tokenCaptureContextSignature = data;
            resolve(isv_tokenCaptureContextSignature);
          } else if (error) {
            if (error?.response && error?.response?.text && 0 < error?.response?.text?.length) {
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGenerateCaptureContext', Constants.LOG_ERROR, cartId, Constants.ERROR_MSG_CAPTURE_CONTEXT + Constants.STRING_HYPHEN + error.response.text);
            } else {
              typeof error === 'object' ? (errorData = JSON.stringify(error)) : (errorData = error);
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGenerateCaptureContext', Constants.LOG_ERROR, cartId, Constants.ERROR_MSG_CAPTURE_CONTEXT + Constants.STRING_HYPHEN + errorData);
            }
            isv_tokenCaptureContextSignature = '';
            reject(isv_tokenCaptureContextSignature);
          } else {
            reject(isv_tokenCaptureContextSignature);
          }
        });
      }).catch((error) => {
        return error;
      });
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGenerateCaptureContext', Constants.LOG_INFO, cartId, Constants.ERROR_MSG_INVALID_INPUT);
      return isv_tokenCaptureContextSignature;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncGenerateCaptureContext', '', exception, '', '', '');
    return isv_tokenCaptureContextSignature;
  }
};

export default { generateCaptureContext };
