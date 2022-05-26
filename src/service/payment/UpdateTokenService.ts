import restApi from 'cybersource-rest-client';
import path from 'path';
import paymentService from '../../utils/PaymentService';
import { Constants } from '../../constants';

const updateTokenResponse = async (tokens, newExpiryMonth, newExpiryYear, addressData) => {
  let runEnvironment: any;
  let errorData: any;
  let exceptionData: any;
  let customerTokenId: null;
  let paymentInstrumentTokenId: null;
  let tokenResponse = {
    httpCode: null,
    default: null,
    card: null,
  };
  try {
    if (null != tokens && Constants.STRING_VALUE in tokens && Constants.STRING_PAYMENT_TOKEN in tokens && Constants.STRING_CARD_EXPIRY_MONTH in tokens && Constants.STRING_CARD_EXPIRY_YEAR in tokens) {
      customerTokenId = tokens.value;
      paymentInstrumentTokenId = tokens.paymentToken;
      const apiClient = new restApi.ApiClient();
      var requestObj = new restApi.PatchCustomerPaymentInstrumentRequest();
      if (process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase() == Constants.TEST_ENVIRONMENT) {
        runEnvironment = Constants.PAYMENT_GATEWAY_TEST_ENVIRONMENT;
      } else if (process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase() == Constants.LIVE_ENVIRONMENT) {
        runEnvironment = Constants.PAYMENT_GATEWAY_PRODUCTION_ENVIRONMENT;
      }
      const configObject = {
        authenticationType: Constants.PAYMENT_GATEWAY_AUTHENTICATION_TYPE,
        runEnvironment: runEnvironment,
        merchantID: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
        merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
        merchantsecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
        logConfiguration: {
          enableLog: false,
        },
      };

      var card = new restApi.Tmsv2customersEmbeddedDefaultPaymentInstrumentCard();
      card.expirationMonth = newExpiryMonth;
      card.expirationYear = newExpiryYear;
      requestObj.card = card;

      var opts = [];
      if (null != addressData) {
        var billTo = new restApi.Tmsv2customersEmbeddedDefaultPaymentInstrumentBillTo();
        billTo.firstName = addressData.firstName;
        billTo.lastName = addressData.lastName;
        billTo.address1 = addressData.streetName;
        billTo.locality = addressData.city;
        billTo.administrativeArea = addressData.region;
        billTo.postalCode = addressData.postalCode;
        billTo.country = addressData.country;
        billTo.email = addressData.email;
        billTo.phoneNumber = addressData.phone;
        requestObj.billTo = billTo;
      }
      var instrumentIdentifier = new restApi.Tmsv2customersEmbeddedDefaultPaymentInstrumentInstrumentIdentifier();
      instrumentIdentifier.id = tokens.instrumentIdentifier;
      requestObj.instrumentIdentifier = instrumentIdentifier;
      const instance = new restApi.CustomerPaymentInstrumentApi(configObject, apiClient);
      return await new Promise(function (resolve, reject) {
        instance.patchCustomersPaymentInstrument(customerTokenId, paymentInstrumentTokenId, requestObj, opts, function (error, data, response) {
          if (data) {
            tokenResponse.httpCode = response[Constants.STATUS_CODE];
            tokenResponse.default = data.default;
            tokenResponse.card = data.card;
            resolve(tokenResponse);
          } else if (error) {
            if (error.hasOwnProperty(Constants.STRING_RESPONSE) && null != error.response && Constants.VAL_ZERO < Object.keys(error.response).length && error.response.hasOwnProperty(Constants.STRING_TEXT) && null != error.response.text && Constants.VAL_ZERO < Object.keys(error.response.text).length) {
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_TOKEN_RESPONSE, Constants.LOG_INFO, error.response.text);
            } else {
              if (typeof error === 'object') {
                errorData = JSON.stringify(error);
              } else {
                errorData = error;
              }
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_TOKEN_RESPONSE, Constants.LOG_INFO, errorData);
            }
            tokenResponse.httpCode = error.status;
            reject(tokenResponse);
          } else {
            reject(tokenResponse);
          }
        });
      }).catch((error) => {
        return tokenResponse;
      });
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_TOKEN_RESPONSE, Constants.LOG_INFO, Constants.ERROR_MSG_INVALID_INPUT);
      return tokenResponse;
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_UPDATE_TOKEN_RESPONSE, Constants.LOG_ERROR, exceptionData);
    return tokenResponse;
  }
};

export default { updateTokenResponse };
