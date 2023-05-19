import restApi from 'cybersource-rest-client';
import path from 'path';
import paymentService from '../../utils/PaymentService';
import { Constants } from '../../constants';

const deleteCustomerToken = async (customerTokenObj) => {
  let runEnvironment: any;
  let errorData: any;
  let exceptionData: any;
  let opts = new Array();
  let customerTokenDeleteResponse = {
    httpCode: null,
    deletedToken: Constants.STRING_EMPTY,
  };
  try {
    if (null != customerTokenObj) {
      var customerTokenId = customerTokenObj.value;
      var paymentInstrumentTokenId = customerTokenObj.paymentToken;
      if (Constants.TEST_ENVIRONMENT == process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase()) {
        runEnvironment = Constants.PAYMENT_GATEWAY_TEST_ENVIRONMENT;
      } else if (Constants.LIVE_ENVIRONMENT == process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase()) {
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
      const apiClient = new restApi.ApiClient();
      var customerPaymentInstrumentApiInstance = new restApi.CustomerPaymentInstrumentApi(configObject, apiClient);
      return await new Promise(function (resolve, reject) {
        customerPaymentInstrumentApiInstance.deleteCustomerPaymentInstrument(customerTokenId, paymentInstrumentTokenId, opts, function (error, data, response) {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_DELETE_CUSTOMER_TOKEN, Constants.LOG_INFO, null, Constants.DELETE_TOKEN_RESPONSE + JSON.stringify(response));
          if (Constants.HTTP_CODE_TWO_HUNDRED_FOUR == response.status) {
            customerTokenDeleteResponse.httpCode = response.status;
            customerTokenDeleteResponse.deletedToken = paymentInstrumentTokenId;
            resolve(customerTokenDeleteResponse);
          } else if (error) {
            if (error.hasOwnProperty(Constants.STRING_RESPONSE) && null != error.response && Constants.VAL_ZERO < Object.keys(error.response).length && error.response.hasOwnProperty(Constants.STRING_TEXT) && null != error.response.text && Constants.VAL_ZERO < Object.keys(error.response.text).length) {
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_DELETE_CUSTOMER_TOKEN, Constants.LOG_ERROR, null, error.response.text);
            } else {
              if (typeof error === 'object') {
                errorData = JSON.stringify(error);
              } else {
                errorData = error;
              }
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_DELETE_CUSTOMER_TOKEN, Constants.LOG_ERROR, null, errorData);
            }
            customerTokenDeleteResponse.httpCode = response.status;
            reject(customerTokenDeleteResponse);
          } else {
            reject(customerTokenDeleteResponse);
          }
        });
      }).catch((error) => {
        return customerTokenDeleteResponse;
      });
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_DELETE_CUSTOMER_TOKEN, Constants.LOG_INFO, null, Constants.ERROR_MSG_INVALID_CUSTOMER_INPUT);
      return customerTokenDeleteResponse;
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_DELETE_CUSTOMER_TOKEN, null, Constants.LOG_ERROR, exceptionData);
    return customerTokenDeleteResponse;
  }
};

export default { deleteCustomerToken };
