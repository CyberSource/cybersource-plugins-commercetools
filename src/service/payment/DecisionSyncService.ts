import path from 'path';

import restApi from 'cybersource-rest-client';
import moment from 'moment';

import { Constants } from '../../constants';
import { midCredentialsType, responseType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';
import prepareFields from '../../utils/PrepareFields';
const conversionDetails = async (midCredentials: midCredentialsType) => {
  let startTime: string;
  let endTime: string;
  let errorData: string;
  const opts: string[] = [];
  const conversionDetailResponse = {
    httpCode: 0,
    data: '',
    status: '',
  };
  try {
    if (midCredentials) {
      const apiClient = new restApi.ApiClient();
      const configObject = await prepareFields.getConfigObject('FuncConversionDetails', midCredentials, null, null);
      startTime = moment(Date.now()).subtract(23, 'hours').subtract(59).format(Constants.DATE_FORMAT);
      endTime = moment(Date.now()).format(Constants.DATE_FORMAT);
      if (configObject?.merchantID) {
        opts.push(configObject.merchantID);
      }
      const conversionDetailsApiInstance = new restApi.ConversionDetailsApi(configObject, apiClient);
      return await new Promise<responseType>(function (resolve, reject) {
        conversionDetailsApiInstance.getConversionDetail(startTime, endTime, opts, function (error: any, data: any, response: any) {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncConversionDetails', Constants.LOG_INFO, '', 'Decision Sync Response = ' + JSON.stringify(response));
          if (data) {
            conversionDetailResponse.httpCode = response[Constants.STATUS_CODE] || response['status'];
            conversionDetailResponse.data = data.conversionDetails;
            conversionDetailResponse.status = response[Constants.STRING_RESPONSE_STATUS];
            resolve(conversionDetailResponse);
          } else if (error) {
            if (error?.response && error?.response?.text && 0 < error?.response?.text?.length) {
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncConversionDetails', Constants.LOG_ERROR, '', error.response.text);
              const errorResponse = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, ''));
              conversionDetailResponse.status = errorResponse.status;
            } else {
              typeof error === 'object' ? (errorData = JSON.stringify(error)) : (errorData = error);
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncConversionDetails', Constants.LOG_ERROR, '', errorData);
            }
            conversionDetailResponse.httpCode = error.status;
            reject(conversionDetailResponse);
          } else {
            reject(conversionDetailResponse);
          }
        });
      }).catch((error) => {
        return error;
      });
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncConversionDetails', Constants.LOG_INFO, '', Constants.ERROR_MSG_INVALID_INPUT);
      return conversionDetailResponse;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncConversionDetails', '', exception, '', '', '');
    return conversionDetailResponse;
  }
};

export default { conversionDetails };
