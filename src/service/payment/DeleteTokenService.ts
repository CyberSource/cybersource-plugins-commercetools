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
    message: Constants.STRING_EMPTY,
    deletedToken: Constants.STRING_EMPTY,
  };
  try {
    if (null != customerTokenObj) {
      var customerTokenId = customerTokenObj.value;
      var paymentInstrumentTokenId = customerTokenObj.paymentToken;
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
      };
      const apiClient = new restApi.ApiClient();
      var instance = new restApi.CustomerPaymentInstrumentApi(configObject, apiClient);
      return await new Promise(function (resolve, reject) {
        instance.deleteCustomerPaymentInstrument(customerTokenId, paymentInstrumentTokenId, opts, function (error, data, response) {
          if (Constants.HTTP_CODE_TWO_HUNDRED_FOUR == response.status) {
            customerTokenDeleteResponse.httpCode = response.status;
            customerTokenDeleteResponse.deletedToken = paymentInstrumentTokenId;
            resolve(customerTokenDeleteResponse);
          } else if (error) {
            if (Constants.STRING_RESPONSE in error && null != error.response && Constants.STRING_TEXT in error.response) {
              errorData = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, Constants.STRING_EMPTY));
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_DELETE_CUSTOMER_TOKEN, Constants.LOG_INFO, errorData);
              customerTokenDeleteResponse.message = errorData.message;
            } else {
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_DELETE_CUSTOMER_TOKEN, Constants.LOG_INFO, error);
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
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_DELETE_CUSTOMER_TOKEN, Constants.LOG_INFO, Constants.ERROR_MSG_INVALID_CUSTOMER_INPUT);
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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_DELETE_CUSTOMER_TOKEN, Constants.LOG_ERROR, exceptionData);
    return customerTokenDeleteResponse;
  }
};

export default { deleteCustomerToken };
