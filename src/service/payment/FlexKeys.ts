import { Payment } from '@commercetools/platform-sdk';
import restApi, { GenerateCaptureContextRequest } from 'cybersource-rest-client';
import jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';

import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from '../../constants/paymentConstants';
import prepareFields from '../../requestBuilder/PrepareFields';
import { ResponseType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';

/**
 * Generates Flex keys for the flex microform.
 * @param {Payment} paymentObj - The payment object.
 * @returns {Promise<any>} A promise that resolves with Flex keys response.
 */
const getFlexKeys = async (paymentObj: Payment): Promise<any> => {
  let contextWithoutSignature: string;
  let parsedContext: string;
  let paymentId = paymentObj?.id;
  let clientVersion = Constants.FLEX_MICROFORM_CLIENT_VERSION;
  const flexKeysResponse = {
    isv_tokenCaptureContextSignature: '',
    isv_tokenVerificationContext: '',
    isv_clientLibrary: '',
    isv_clientLibraryIntegrity: ''
  };

  let targetOrigins = [];
  let targetOriginArray;
  if (paymentObj) {
    const apiClient = new restApi.ApiClient();
    const configObject = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_FLEX_KEYS, null, paymentObj, null);
    targetOriginArray = prepareFields.getTargetOrigins();
    for (const element of targetOriginArray) {
      targetOrigins.push(element);
    }
    let allowedCardNetworks = prepareFields.getAllowedCardNetworks(FunctionConstant.FUNC_GET_FLEX_KEYS);
    const requestObj: GenerateCaptureContextRequest = {
      targetOrigins: targetOrigins,
      clientVersion: clientVersion,
      allowedCardNetworks: allowedCardNetworks
    }
    if (paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_ENABLE_DEBUG)) {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_FLEX_KEYS, Constants.LOG_DEBUG, 'PaymentId : ' + paymentId, 'Flex Keys Request = ' + JSON.stringify(requestObj));
    }
    const microFormIntegrationApiInstance = configObject && new restApi.MicroformIntegrationApi(configObject, apiClient);
    const startTime = new Date().getTime();
    try {
      return await new Promise<Partial<ResponseType>>(function (resolve, reject) {
        if (microFormIntegrationApiInstance) {
          microFormIntegrationApiInstance.generateCaptureContext(requestObj, (error: any, data: string, response: any) => {
            const endTime = new Date().getTime();
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_FLEX_KEYS, Constants.LOG_DEBUG, 'PaymentId : ' + paymentId, 'Flex Keys Response = ' + paymentUtils.maskData(JSON.stringify(response)), `${endTime - startTime}`);
            if (data && process.env.PAYMENT_GATEWAY_VERIFICATION_KEY) {
              let decodedCaptureContext = jwt.decode(data);
              flexKeysResponse.isv_tokenCaptureContextSignature = data;
              flexKeysResponse.isv_clientLibrary = decodedCaptureContext.ctx?.[0]?.data?.clientLibrary;
              flexKeysResponse.isv_clientLibraryIntegrity = decodedCaptureContext.ctx?.[0]?.data?.clientLibraryIntegrity;
              contextWithoutSignature = flexKeysResponse.isv_tokenCaptureContextSignature.substring(0, flexKeysResponse.isv_tokenCaptureContextSignature.lastIndexOf(Constants.REGEX_DOT) + 1);
              parsedContext = jwtDecode(contextWithoutSignature);
              flexKeysResponse.isv_tokenVerificationContext = jwt.sign(parsedContext, process.env.PAYMENT_GATEWAY_VERIFICATION_KEY);
              resolve(flexKeysResponse);
            } else if (error) {
              paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_FLEX_KEYS, Constants.LOG_DEBUG, 'PaymentId : ' + paymentId, error, `${endTime - startTime}`);
              reject(flexKeysResponse);
            } else {
              reject(flexKeysResponse);
            }
          });
        }
      }).catch((error) => {
        paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_FLEX_KEYS, '', error, '', '', '');
        return error;
      });
    } catch (exception) {
      paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_FLEX_KEYS, '', exception, '', '', '');
      return flexKeysResponse;
    }
  } else {
    return flexKeysResponse;
  }
};

export default { getFlexKeys };
