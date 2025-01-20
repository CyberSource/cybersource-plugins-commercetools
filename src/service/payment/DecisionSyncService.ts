import restApi, { ReportingV3ConversionDetailsGet200Response } from 'cybersource-rest-client';
import moment from 'moment';

import { Constants } from '../../constants/constants';
import { FunctionConstant } from '../../constants/functionConstant';
import prepareFields from '../../requestBuilder/PrepareFields';
import { MidCredentialsType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';

/**
 * Retrieves conversion details.
 * @param {MidCredentialsType} midCredentials - The MID credentials.
 * @returns {Promise<ReportingV3ConversionDetailsGet200Response>} A promise that resolves with the conversion details response.
 */
const getConversionDetails = async (midCredentials: MidCredentialsType): Promise<any> => {
  let startTime: string;
  let endTime: string;
  let errorData: string;
  let opts = '';
  const conversionDetailResponse = {
    httpCode: 0,
    data: '',
    status: '',
  };
  if (midCredentials) {
    const apiClient = new restApi.ApiClient();
    const configObject = prepareFields.getConfigObject(FunctionConstant.FUNC_GET_CONVERSION_DETAILS, midCredentials, null, null);
    startTime = moment(Date.now()).subtract(23, 'hours').subtract(59).format(Constants.DATE_FORMAT);
    endTime = moment(Date.now()).format(Constants.DATE_FORMAT);
    if (configObject?.merchantID) {
      opts = configObject.merchantID;
    }
    const conversionDetailsApiInstance = configObject && new restApi.ConversionDetailsApi(configObject, apiClient);
    const requestStartTime = new Date().getTime();
    return await new Promise<ReportingV3ConversionDetailsGet200Response | any>(function (resolve, reject) {
      if (conversionDetailsApiInstance) {
        conversionDetailsApiInstance.getConversionDetail(startTime, endTime, opts, function (error: any, data: any, response: any) {
          const requestEndTime = new Date().getTime()
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CONVERSION_DETAILS, Constants.LOG_DEBUG, '', 'Decision Sync Response = ' + paymentUtils.maskData(JSON.stringify(response)), `${requestEndTime - requestStartTime}`);
          if (data) {
            conversionDetailResponse.httpCode = response[Constants.STATUS_CODE] || response[Constants.STRING_RESPONSE_STATUS];
            conversionDetailResponse.data = data.conversionDetails;
            conversionDetailResponse.status = response[Constants.STRING_RESPONSE_STATUS];
            resolve(conversionDetailResponse);
          } else if (error) {
            if (error?.response && error?.response?.text && 0 < error?.response?.text?.length) {
              paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CONVERSION_DETAILS, Constants.LOG_ERROR, '', error.response.text);
              const errorResponse = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, ''));
              conversionDetailResponse.status = errorResponse.status;
            } else {
              typeof error === Constants.STR_OBJECT ? (errorData = JSON.stringify(error)) : (errorData = error);
              paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CONVERSION_DETAILS, Constants.LOG_ERROR, '', errorData);
            }
            conversionDetailResponse.httpCode = error.status;
            reject(conversionDetailResponse);
          } else {
            reject(conversionDetailResponse);
          }
        });
      }
    }).catch((error) => {
      return error;
    });
  } else {
    return conversionDetailResponse;
  }
};

export default { getConversionDetails };
