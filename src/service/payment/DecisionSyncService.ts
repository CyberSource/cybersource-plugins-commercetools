import restApi from 'cybersource-rest-client';
import path from 'path';
import moment from 'moment';
import { Constants } from '../../constants';
import paymentService from '../../utils/PaymentService';

const conversionDetails = async () => {
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
    const apiClient = new restApi.ApiClient();
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
    startTime = moment(Date.now()).subtract(Constants.VAL_TWENTY_THREE, Constants.STRING_HOURS).subtract(Constants.VAL_FIFTY_NINE).format(Constants.DATE_FORMAT);
    endTime = moment(Date.now()).format(Constants.DATE_FORMAT);

    organizationId = process.env.PAYMENT_GATEWAY_MERCHANT_ID;

    if (null != organizationId) {
      opts.push(organizationId);
    }

    var instance = new restApi.ConversionDetailsApi(configObject, apiClient);
    return await new Promise(function (resolve, reject) {
      instance.getConversionDetail(startTime, endTime, opts, function (error, data, response) {
        if (data) {
          conversionDetailResponse.httpCode = response[Constants.STATUS_CODE];
          conversionDetailResponse.data = data.conversionDetails;
          conversionDetailResponse.status = response[Constants.STRING_RESPONSE_STATUS];
          resolve(conversionDetailResponse);
        } else if (error) {
          if (error.hasOwnProperty(Constants.STRING_RESPONSE) && null != error.response && Constants.VAL_ZERO < Object.keys(error.response).length && error.response.hasOwnProperty(Constants.STRING_TEXT) && null != error.response.text && Constants.VAL_ZERO < Object.keys(error.response.text).length) {
            paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CONVERSION_DETAILS, Constants.LOG_INFO, error.response.text);
            errorData = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, Constants.STRING_EMPTY));
            conversionDetailResponse.status = errorData.status;
          } else {
            if (typeof error === 'object') {
              errorData = JSON.stringify(error);
            } else {
              errorData = error;
            }
            paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CONVERSION_DETAILS, Constants.LOG_INFO, errorData);
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
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CONVERSION_DETAILS, Constants.LOG_ERROR, exceptionData);
    return conversionDetailResponse;
  }
};

export default { conversionDetails };
