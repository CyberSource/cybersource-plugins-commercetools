import path from 'path';

import restApi from 'cybersource-rest-client';
import jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';

import { Constants } from '../../constants';
import { PaymentType, ResponseType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';
import prepareFields from '../../utils/PrepareFields';

/**
 * Generates Flex keys for the flex microform.
 * @param {PaymentType} paymentObj - The payment object.
 * @returns {Promise<any>} A promise that resolves with Flex keys response.
 */
const keys = async (paymentObj: PaymentType): Promise<any> => {
  let errorData: string;
  let contextWithoutSignature: string;
  let parsedContext: string;
  let targetOriginArray;
  const flexKeysResponse = {
    isv_tokenCaptureContextSignature: '',
    isv_tokenVerificationContext: '',
  };
  try {
    if (paymentObj) {
      const apiClient = new restApi.ApiClient();
      const configObject = await prepareFields.getConfigObject('FuncKeys', null, paymentObj, null);
      const requestObj = new restApi.GenerateCaptureContextRequest();
      requestObj.encryptionType = Constants.PAYMENT_GATEWAY_ENCRYPTION_TYPE;
      requestObj.targetOrigins = [];
      targetOriginArray = await prepareFields.getTargetOrigins('FuncKeys');
      for (const element of targetOriginArray) {
        requestObj.targetOrigins.push(element);
      }
      requestObj.allowedCardNetworks = await prepareFields.getAllowedCardNetworks('FuncKeys');
      requestObj.clientVersion = Constants.FLEX_MICROFORM_CLIENT_VERSION;
      if (Constants.STRING_TRUE === process.env.PAYMENT_GATEWAY_ENABLE_DEBUG) {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncKeys', Constants.LOG_INFO, 'PaymentId : ' + paymentObj.id, 'Flex Keys Request = ' + JSON.stringify(requestObj));
      }
      const microFormIntegrationApiInstance = new restApi.MicroformIntegrationApi(configObject, apiClient);
      return await new Promise<ResponseType>(function (resolve, reject) {
        microFormIntegrationApiInstance.generateCaptureContext(requestObj, (error: any, data: string, response: any) => {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncKeys', Constants.LOG_INFO, 'PaymentId : ' + paymentObj.id, 'Flex Keys Response = ' + JSON.stringify(response));
          if (data && process.env.PAYMENT_GATEWAY_VERIFICATION_KEY) {
            flexKeysResponse.isv_tokenCaptureContextSignature = data;
            contextWithoutSignature = flexKeysResponse.isv_tokenCaptureContextSignature.substring(0, flexKeysResponse.isv_tokenCaptureContextSignature.lastIndexOf(Constants.REGEX_DOT) + 1);
            parsedContext = jwtDecode(contextWithoutSignature);
            flexKeysResponse.isv_tokenVerificationContext = jwt.sign(parsedContext, process.env.PAYMENT_GATEWAY_VERIFICATION_KEY);
            resolve(flexKeysResponse);
          } else if (error) {
            if (error?.response && error?.response?.text && 0 < error?.response?.text?.length) {
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncKeys', Constants.LOG_ERROR, 'PaymentId : ' + paymentObj.id, Constants.ERROR_MSG_FLEX_TOKEN_KEYS + Constants.STRING_HYPHEN + error.response.text);
            } else {
              typeof error === 'object' ? (errorData = JSON.stringify(error)) : (errorData = error);
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncKeys', Constants.LOG_ERROR, 'PaymentId : ' + paymentObj.id, Constants.ERROR_MSG_FLEX_TOKEN_KEYS + Constants.STRING_HYPHEN + errorData);
            }
            reject(flexKeysResponse);
          } else {
            reject(flexKeysResponse);
          }
        });
      }).catch((error) => {
        return error;
      });
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncKeys', Constants.LOG_INFO, '', Constants.ERROR_MSG_INVALID_INPUT);
      return flexKeysResponse;
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncKeys', '', exception, '', '', '');
    return flexKeysResponse;
  }
};

export default { keys };
