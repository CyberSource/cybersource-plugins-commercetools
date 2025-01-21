import restApi, { GenerateUnifiedCheckoutCaptureContextRequest, Upv1capturecontextsOrderInformation } from 'cybersource-rest-client';

import { Constants } from '../../constants/constants';
import { FunctionConstant } from '../../constants/functionConstant';
import prepareFields from '../../requestBuilder/PrepareFields';
import paymentUtils from '../../utils/PaymentUtils';

/**
 * Generates the capture context.
 * @param {any} cartObj - The cart object for payment.
 * @param {string} country - The country of the customer.
 * @param {string} locale - The locale of the customer.
 * @param {string} currencyCode - The currency code.
 * @param {string} merchantId - The merchant ID.
 * @param {string} service - The service type ('Payments' or 'MyAccounts').
 * @returns {Promise<string>} A promise that resolves with the generated capture context signature.
 */
const generateCaptureContext = async (cartObj: any, country: string, locale: string, currencyCode: string, merchantId: string, service: string): Promise<string> => {
  let isv_tokenCaptureContextSignature = '';
  let cartId = cartObj?.id || '';
  let cartIdLog = 'CartId : ' + cartId;
  if (('Payments' === service && cartObj) || ('MyAccounts' === service && country && locale && currencyCode)) {
    const apiClient = new restApi.ApiClient();
    const configObject = prepareFields.getConfigObject(FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT, null, null, merchantId);
    let clientVersion = Constants.UNIFIED_CHECKOUT_CAPTURE_CONTEXT_CLIENT_VERSION;
    const allowedCardNetworks = prepareFields.getAllowedCardNetworks(FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT);
    let targetOrigins = prepareFields.getTargetOrigins();
    const requestObj: GenerateUnifiedCheckoutCaptureContextRequest = {
      clientVersion: clientVersion,
      allowedCardNetworks: allowedCardNetworks,
      targetOrigins: targetOrigins
    }
    if ('Payments' === service) {
      requestObj.orderInformation = prepareFields.getOrderInformation(FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT, null, null, cartObj, null, null, service, currencyCode);
      const captureMandate = prepareFields.getCaptureMandate(service);
      requestObj.captureMandate = captureMandate;
      if (cartObj?.locale && cartObj.locale.includes(Constants.REGEX_HYPHEN)) {
        cartObj.locale = cartObj.locale.replace(Constants.REGEX_HYPHEN, Constants.REGEX_UNDERSCORE);
      }
      requestObj.locale = cartObj.locale;
      requestObj.country = cartObj.country;
      requestObj.allowedPaymentTypes = prepareFields.getAllowedPaymentMethods();
    } else if ('MyAccounts' === service) {
      let orderInformation = prepareFields.getOrderInformation(FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT, null, null, cartObj, null, null, service, currencyCode) as Upv1capturecontextsOrderInformation;
      requestObj.orderInformation = orderInformation;
      const captureMandate = prepareFields.getCaptureMandate(service);
      requestObj.captureMandate = captureMandate;
      requestObj.locale = locale;
      requestObj.country = country;
      requestObj.allowedPaymentTypes = ['PANENTRY'];
    }
    if (paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_ENABLE_DEBUG)) {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT, Constants.LOG_DEBUG, cartId, 'Capture Context Request = ' + paymentUtils.maskData(JSON.stringify(requestObj)));
    }
    const unifiedCheckoutCaptureContextApiInstance = configObject && new restApi.UnifiedCheckoutCaptureContextApi(configObject, apiClient);
    const startTime = new Date().getTime();
    return await new Promise<string>(function (resolve, reject) {
      if (unifiedCheckoutCaptureContextApiInstance) {
        unifiedCheckoutCaptureContextApiInstance.generateUnifiedCheckoutCaptureContext(requestObj, function (error: any, data: any, response: any) {
          const endTime = new Date().getTime();
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT, Constants.LOG_DEBUG, cartIdLog, 'Capture Context Response = ' + paymentUtils.maskData(JSON.stringify(response)), `${endTime - startTime}`);
          if (data) {
            isv_tokenCaptureContextSignature = data;
            resolve(isv_tokenCaptureContextSignature);
          } else if (error) {
            reject(isv_tokenCaptureContextSignature);
          } else {
            reject(isv_tokenCaptureContextSignature);
          }
        });
      }
    }).catch((error) => {
      return error;
    });
  } else {
    return isv_tokenCaptureContextSignature;
  }
};

export default { generateCaptureContext };
