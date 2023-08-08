import restApi from 'cybersource-rest-client';
import path from 'path';
import paymentService from '../../utils/PaymentService';
import { Constants } from '../../constants';
import multiMid from '../../utils/config/MultiMid';

const generateCaptureContext = async (cartObj, country, locale, currencyCode, merchantId, service) => {
  let isv_tokenCaptureContextSignature = Constants.STRING_EMPTY
  let totalAmount = Constants.VAL_FLOAT_ZERO;
  let runEnvironment: any;
  let errorData: any;
  let exceptionData: any;
  let allowedPaymentTypesArray = [];
  let allowedPaymentTypes: any;
  let allowedCardNetworksArray = [];
  let allowedCardNetworks: any;
  let shipToCountriesArray = [];
  let shipToCountries: any;
  let targetOrigins: any;
  let targetOriginsArray = [];
  let cartId: any;
  let midCredentials = {
    merchantId: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
    merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
    merchantSecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
  };
  try {
    if ((Constants.SERVICE_PAYMENT == service && null != cartObj) || (Constants.SERVICE_MY_ACCOUNTS == service && Constants.STRING_EMPTY != country && Constants.STRING_EMPTY != locale && Constants.STRING_EMPTY != currencyCode)) {
      const apiClient = new restApi.ApiClient();
      runEnvironment = (Constants.LIVE_ENVIRONMENT == process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase()) ? Constants.PAYMENT_GATEWAY_PRODUCTION_ENVIRONMENT : runEnvironment = Constants.PAYMENT_GATEWAY_TEST_ENVIRONMENT;
      if (null != merchantId && Constants.STRING_EMPTY != merchantId) {
        midCredentials = await multiMid.getMidCredentials(merchantId);
      }
      const configObject = {
        authenticationType: Constants.PAYMENT_GATEWAY_AUTHENTICATION_TYPE,
        runEnvironment: runEnvironment,
        merchantID: midCredentials.merchantId,
        merchantKeyId: midCredentials.merchantKeyId,
        merchantsecretKey: midCredentials.merchantSecretKey,
        logConfiguration: {
          enableLog: false,
        },
      };
      var requestObj = new restApi.GenerateUnifiedCheckoutCaptureContextRequest();
      var captureMandate = new restApi.Upv1capturecontextsCaptureMandate();
      var orderInformation = new restApi.Upv1capturecontextsOrderInformation();
      var orderInformationAmountDetails = new restApi.Upv1capturecontextsOrderInformationAmountDetails();
      if (Constants.SERVICE_PAYMENT == service) {
        cartId = Constants.STRING_CART_ID + cartObj.id;
        totalAmount = paymentService.convertCentToAmount(cartObj.totalPrice.centAmount, cartObj.totalPrice.fractionDigits);
        orderInformationAmountDetails.totalAmount = `${totalAmount}`;
        orderInformationAmountDetails.currency = cartObj?.totalPrice?.currencyCode;
        orderInformation.amountDetails = orderInformationAmountDetails;
        requestObj.orderInformation = orderInformation;
        captureMandate.billingType = process.env.PAYMENT_GATEWAY_BILLING_TYPE;
        if (Constants.STRING_FULL == process.env.PAYMENT_GATEWAY_BILLING_TYPE) {
          captureMandate.requestEmail = (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ENABLE_EMAIL) ? true : false;
          captureMandate.requestPhone = (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ENABLE_PHONE) ? true : false;
        } else {
          captureMandate.requestEmail = false;
          captureMandate.requestPhone = false;
        }
        captureMandate.requestShipping = (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ENABLE_SHIPPING) ? true : false;
        if (undefined != process.env.PAYMENT_GATEWAY_ALLOWED_SHIP_TO_COUNTRY_FOR_UNIFIED_CHECKOUT && Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_ALLOWED_SHIP_TO_COUNTRY_FOR_UNIFIED_CHECKOUT) {
          shipToCountries = process.env.PAYMENT_GATEWAY_ALLOWED_SHIP_TO_COUNTRY_FOR_UNIFIED_CHECKOUT;
          shipToCountriesArray = shipToCountries.split(Constants.REGEX_COMMA);
          captureMandate.shipToCountries = shipToCountriesArray;
        }
        requestObj.captureMandate = captureMandate;
        if (cartObj?.locale && cartObj.locale.includes(Constants.REGEX_HYPHEN)) {
          cartObj.locale = cartObj.locale.replace(Constants.REGEX_HYPHEN, Constants.REGEX_UNDERSCORE);
        }
        requestObj.locale = cartObj.locale;
        requestObj.country = cartObj.country;
        if (undefined != process.env.PAYMENT_GATEWAY_ALLOWED_PAYMENT_METHODS_FOR_UNIFIED_CHECKOUT && Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_ALLOWED_PAYMENT_METHODS_FOR_UNIFIED_CHECKOUT) {
          allowedPaymentTypes = process.env.PAYMENT_GATEWAY_ALLOWED_PAYMENT_METHODS_FOR_UNIFIED_CHECKOUT;
          allowedPaymentTypesArray = allowedPaymentTypes.split(Constants.REGEX_COMMA);
          requestObj.allowedPaymentTypes = allowedPaymentTypesArray;
        } else {
          requestObj.allowedPaymentTypes = [Constants.STRING_PANENTRY, Constants.STRING_SRC, Constants.STRING_GOOGLEPAY];
        }
      } else if (Constants.SERVICE_MY_ACCOUNTS == service) {
        totalAmount = Constants.VAL_ZERO_ZERO_ONE;
        orderInformationAmountDetails.totalAmount = `${totalAmount}`;
        orderInformationAmountDetails.currency = currencyCode;
        orderInformation.amountDetails = orderInformationAmountDetails;
        requestObj.orderInformation = orderInformation;
        captureMandate.billingType = process.env.PAYMENT_GATEWAY_BILLING_TYPE;
        captureMandate.requestShipping = false;
        captureMandate.requestEmail = (Constants.STRING_FULL == process.env.PAYMENT_GATEWAY_BILLING_TYPE) ? true : false;
        captureMandate.requestPhone = (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ENABLE_PHONE) ? true : false;
        requestObj.captureMandate = captureMandate;
        requestObj.locale = locale;
        requestObj.country = country;
        requestObj.allowedPaymentTypes = [Constants.STRING_PANENTRY];
      }
      requestObj.clientVersion = Constants.VAL_ZERO_ONE_FIVE;
      captureMandate.showAcceptedNetworkIcons = (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ENABLE_NETWORK_ICONS ? true : false);
      if (undefined != process.env.PAYMENT_GATEWAY_ALLOWED_CARD_NETWORK_FOR_UNIFIED_CHECKOUT && Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_ALLOWED_CARD_NETWORK_FOR_UNIFIED_CHECKOUT) {
        allowedCardNetworks = process.env.PAYMENT_GATEWAY_ALLOWED_CARD_NETWORK_FOR_UNIFIED_CHECKOUT;
        allowedCardNetworksArray = allowedCardNetworks.split(Constants.REGEX_COMMA);
        requestObj.allowedCardNetworks = allowedCardNetworksArray;
      } else {
        requestObj.allowedCardNetworks = [Constants.STRING_CAPITAL_VISA, Constants.STRING_CAPITAL_MASTERCARD, Constants.STRING_CAPITAL_AMEX];
      }
      if (undefined != process.env.PAYMENT_GATEWAY_TARGET_ORIGINS && Constants.STRING_EMPTY != process.env.PAYMENT_GATEWAY_TARGET_ORIGINS) {
        targetOrigins = process.env.PAYMENT_GATEWAY_TARGET_ORIGINS;
        targetOriginsArray = targetOrigins.split(Constants.REGEX_COMMA);
        requestObj.targetOrigins = targetOriginsArray;
      }
      if (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ENABLE_DEBUG) {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GENERATE_CAPTURE_CONTEXT, Constants.LOG_INFO, cartId, Constants.CAPTURE_CONTEXT_REQUEST + JSON.stringify(requestObj));
      }
      const unifiedCheckoutCaptureContextApiInstance = new restApi.UnifiedCheckoutCaptureContextApi(configObject, apiClient);
      return await new Promise<String>(function (resolve, reject) {
        unifiedCheckoutCaptureContextApiInstance.generateUnifiedCheckoutCaptureContext(requestObj, function (error, data, response) {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GENERATE_CAPTURE_CONTEXT, Constants.LOG_INFO, cartId, Constants.CAPTURE_CONTEXT_RESPONSE + JSON.stringify(response));
          if (data) {
            isv_tokenCaptureContextSignature = data;
            resolve(isv_tokenCaptureContextSignature);
          } else if (error) {
            if (
              error.hasOwnProperty(Constants.STRING_RESPONSE) &&
              null != error.response &&
              Constants.VAL_ZERO < Object.keys(error.response).length &&
              error.response.hasOwnProperty(Constants.STRING_TEXT) &&
              null != error.response.text &&
              Constants.VAL_ZERO < Object.keys(error.response.text).length
            ) {
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GENERATE_CAPTURE_CONTEXT, Constants.LOG_ERROR, cartId, Constants.ERROR_MSG_CAPTURE_CONTEXT + Constants.STRING_HYPHEN + error.response.text);
            } else {
              if (typeof error === 'object') {
                errorData = JSON.stringify(error);
              } else {
                errorData = error;
              }
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GENERATE_CAPTURE_CONTEXT, Constants.LOG_ERROR, cartId, Constants.ERROR_MSG_CAPTURE_CONTEXT + Constants.STRING_HYPHEN + errorData);
            }
            isv_tokenCaptureContextSignature = Constants.STRING_EMPTY;
            reject(isv_tokenCaptureContextSignature);
          } else {
            reject(isv_tokenCaptureContextSignature);
          }
        });
      }).catch((error) => {
        return error;
      });
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GENERATE_CAPTURE_CONTEXT, Constants.LOG_INFO, cartId, Constants.ERROR_MSG_INVALID_INPUT);
      return isv_tokenCaptureContextSignature;
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_GENERATE_CAPTURE_CONTEXT, Constants.LOG_ERROR, cartId, exceptionData);
    return isv_tokenCaptureContextSignature;
  }
};

export default { generateCaptureContext };
