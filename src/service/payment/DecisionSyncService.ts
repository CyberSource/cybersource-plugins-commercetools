import restApi from 'cybersource-rest-client';
import path from 'path';
import moment from 'moment';
import { Constants } from '../../constants';
import paymentService from '../../utils/PaymentService';

const conversionDetails = async () => {
  let startTime: any;
  let endTime: any;
  let organizationId: any;
  let errorData: any;
  let exceptionData: any;
  let opts = new Array();
  let conversionDetailResponse = {
    httpCode: null,
    status: null,
    message: null,
    data: null,
  };
  try {
    const apiClient = new restApi.ApiClient();
    const configObject = {
      authenticationType: Constants.ISV_PAYMENT_AUTHENTICATION_TYPE,
      runEnvironment: process.env.CONFIG_RUN_ENVIRONMENT,
      merchantID: process.env.ISV_PAYMENT_MERCHANT_ID,
      merchantKeyId: process.env.ISV_PAYMENT_MERCHANT_KEY_ID,
      merchantsecretKey: process.env.ISV_PAYMENT_MERCHANT_SECRET_KEY,
    };
    startTime = moment(Date.now()).subtract(Constants.VAL_TWENTYTHREE, Constants.STRING_HOURS).subtract(Constants.VAL_FIFTYNINE).format(Constants.DATE_FORMAT);
    endTime = moment(Date.now()).format(Constants.DATE_FORMAT);

    organizationId = process.env.ISV_PAYMENT_MERCHANT_ID;

    if (null != organizationId) {
      opts.push(organizationId);
    }

    var instance = new restApi.ConversionDetailsApi(configObject, apiClient);
    return await new Promise(function (resolve, reject) {
      instance.getConversionDetail(startTime, endTime, opts, function (error, data, response) {
        if (data) {
          conversionDetailResponse.data = response[Constants.STATUS_CODE];
          conversionDetailResponse.data = data.conversionDetails;
          conversionDetailResponse.status = response[Constants.STRING_RESPONSE_STATUS];
          resolve(conversionDetailResponse);
        } else if (error) {
          errorData = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, Constants.STRING_EMPTY));
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CONVERSION_DETAILS, Constants.LOG_INFO, errorData.message);
          conversionDetailResponse.httpCode = error.status;
          conversionDetailResponse.status = errorData.status;
          conversionDetailResponse.message = errorData.message;
          reject(conversionDetailResponse);
        }
      });
    }).catch((error) => {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_CONVERSION_DETAILS, Constants.LOG_INFO, error.message);
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
