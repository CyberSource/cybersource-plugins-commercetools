import restApi from 'cybersource-rest-client';
import path from 'path';
import moment from 'moment';
import { Constants } from '../../constants';
import paymentService from '../../utils/PaymentService';

const conversionDetails = async (midCredentials) => {
  let runEnvironment: any;
  let startTime: any;
  let endTime: any;
  let organizationId: any;
  let errorData: any;
  let exceptionData: any;
  let opts = new Array();
  let conversionDetailResponse = {
    httpCode: null,
    status: null,
    data: null,
  };
  try {
    if (null != midCredentials) {
      const apiClient = new restApi.ApiClient();
      if (Constants.TEST_ENVIRONMENT == process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase()) {
        runEnvironment = Constants.PAYMENT_GATEWAY_TEST_ENVIRONMENT;
      } else if (Constants.LIVE_ENVIRONMENT == process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase()) {
        runEnvironment = Constants.PAYMENT_GATEWAY_PRODUCTION_ENVIRONMENT;
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
      startTime = moment(Date.now()).subtract(Constants.VAL_TWENTY_THREE, Constants.STRING_HOURS).subtract(Constants.VAL_FIFTY_NINE).format(Constants.DATE_FORMAT);
      endTime = moment(Date.now()).format(Constants.DATE_FORMAT);
      organizationId = process.env.PAYMENT_GATEWAY_MERCHANT_ID;
      if (null != organizationId) {
        opts.push(organizationId);
      }
      var instance = new restApi.ConversionDetailsApi(configObject, apiClient);
      return await new Promise(function (resolve, reject) {
        instance.getConversionDetail(startTime, endTime, opts, function (error, data, response) {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CONVERSION_DETAILS, Constants.LOG_INFO, null, Constants.DECISION_SYNC_RESPONSE + JSON.stringify(response));
          if (data) {
            conversionDetailResponse.httpCode = response[Constants.STATUS_CODE];
            conversionDetailResponse.data = data.conversionDetails;
            conversionDetailResponse.status = response[Constants.STRING_RESPONSE_STATUS];
            resolve(conversionDetailResponse);
          } else if (error) {
            if (error.hasOwnProperty(Constants.STRING_RESPONSE) && null != error.response && Constants.VAL_ZERO < Object.keys(error.response).length && error.response.hasOwnProperty(Constants.STRING_TEXT) && null != error.response.text && Constants.VAL_ZERO < Object.keys(error.response.text).length) {
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CONVERSION_DETAILS, Constants.LOG_ERROR, null, error.response.text);
              errorData = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, Constants.STRING_EMPTY));
              conversionDetailResponse.status = errorData.status;
            } else {
              if (typeof error === 'object') {
                errorData = JSON.stringify(error);
              } else {
                errorData = error;
              }
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CONVERSION_DETAILS, Constants.LOG_ERROR, null, errorData);
            }
            conversionDetailResponse.httpCode = error.status;
            reject(conversionDetailResponse);
          } else {
            reject(conversionDetailResponse);
          }
        });
      }).catch((error) => {
        return conversionDetailResponse;
      });
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CONVERSION_DETAILS, Constants.LOG_INFO, null, Constants.ERROR_MSG_INVALID_INPUT);
      return conversionDetailResponse;
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    if (Constants.EXCEPTION_MERCHANT_SECRET_KEY_REQUIRED == exceptionData || Constants.EXCEPTION_MERCHANT_KEY_ID_REQUIRED == exceptionData) {
      exceptionData = Constants.EXCEPTION_MSG_ENV_VARIABLE_NOT_SET + midCredentials.merchantId;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CONVERSION_DETAILS, Constants.LOG_ERROR, null, exceptionData);
    return conversionDetailResponse;
  }
};

export default { conversionDetails };
