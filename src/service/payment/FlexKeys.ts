import restApi from 'cybersource-rest-client';
import { GenerateCaptureContextRequest } from 'cybersource-rest-client';
import jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';

import { Constants } from '../../constants/constants';
import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import prepareFields from '../../requestBuilder/PrepareFields';
import { PaymentType, ResponseType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';

/**
 * Generates Flex keys for the flex microform.
 * @param {PaymentType} paymentObj - The payment object.
 * @returns {Promise<any>} A promise that resolves with Flex keys response.
 */
const getFlexKeys = async (paymentObj: PaymentType): Promise<any> => {
  let contextWithoutSignature: string;
  let parsedContext: string;
  let targetOriginArray;
  const flexKeysResponse = {
    isv_tokenCaptureContextSignature: '',
    isv_tokenVerificationContext: '',
  };
  let paymentId = paymentObj?.id;
  let targetOrigins = [];
  let encryptionType = Constants.PAYMENT_GATEWAY_ENCRYPTION_TYPE;
  let clientVersion = Constants.FLEX_MICROFORM_CLIENT_VERSION;
  try {
    if (paymentObj) {
      const apiClient = new restApi.ApiClient();
      const configObject = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_FLEX_KEYS, null, paymentObj, null);
      targetOriginArray = await prepareFields.getTargetOrigins();
      for (const element of targetOriginArray) {
        targetOrigins.push(element);
      }
      let allowedCardNetworks = await prepareFields.getAllowedCardNetworks('FUNC_KEYS');
      const requestObj: GenerateCaptureContextRequest = {
        encryptionType: encryptionType,
        targetOrigins: targetOrigins,
        clientVersion: clientVersion,
        allowedCardNetworks: allowedCardNetworks
      }
      if (paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_ENABLE_DEBUG))
        paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_FLEX_KEYS, Constants.LOG_INFO, 'PaymentId : ' + paymentId, 'Flex Keys Request = ' + JSON.stringify(requestObj));
      const microFormIntegrationApiInstance = configObject && new restApi.MicroformIntegrationApi(configObject, apiClient);
      return await new Promise<Partial<ResponseType>>(function (resolve, reject) {
        if (microFormIntegrationApiInstance) {
          microFormIntegrationApiInstance.generateCaptureContext(requestObj, (error: any, data: string, response: any) => {
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_FLEX_KEYS, Constants.LOG_INFO, 'PaymentId : ' + paymentId, 'Flex Keys Response = ' + JSON.stringify(response));
            if (data && process.env.PAYMENT_GATEWAY_VERIFICATION_KEY) {
              flexKeysResponse.isv_tokenCaptureContextSignature = data;
              contextWithoutSignature = flexKeysResponse.isv_tokenCaptureContextSignature.substring(0, flexKeysResponse.isv_tokenCaptureContextSignature.lastIndexOf(Constants.REGEX_DOT) + 1);
              parsedContext = jwtDecode(contextWithoutSignature);
              flexKeysResponse.isv_tokenVerificationContext = jwt.sign(parsedContext, process.env.PAYMENT_GATEWAY_VERIFICATION_KEY);
              resolve(flexKeysResponse);
            } else if (error) {
              reject(flexKeysResponse);
            } else {
              reject(flexKeysResponse);
            }
          });
        } else {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_FLEX_KEYS, Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_SERVICE_PROCESS);
        }
      }).catch((error) => {
        return error;
      });
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_FLEX_KEYS, Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_INVALID_INPUT);
      return flexKeysResponse;
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_FLEX_KEYS, '', exception, '', '', '');
    return flexKeysResponse;
  }
};

export default { getFlexKeys };
