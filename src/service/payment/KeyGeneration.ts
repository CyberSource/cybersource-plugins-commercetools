import restApi from 'cybersource-rest-client';

import { Constants } from '../../constants/constants';
import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import prepareFields from '../../requestBuilder/PrepareFields';
import { KeyResponse, MidCredentialsType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';
/**
 * Generates a key and returns the key generation response.
 * @param {MidCredentialsType} midCredentials - The MID credentials.
 * @returns {Promise<unknown>}} - The key generation response.
*/
const getKeyGenerationResponse = async (midCredentials: MidCredentialsType): Promise<KeyResponse> => {
  const keyResponse: KeyResponse = {
    httpCode: 0,
    organizationId: null,
    key: null,
    keyId: null,
    keyExpiration: null,
  };
  const vCPermissions = '100';
  let opts: any;
  let merchantId = '';
  try {
    const apiClient = new restApi.ApiClient();
    const configObject = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_KEY_GENERATION_RESPONSE, midCredentials, null, null);
    if (configObject) {
      merchantId = configObject.merchantID;
      opts = {
        vCCorrelationId: null,
        saveSymEgressKey: {
          clientRequestAction: 'CREATE',
          keyInformation: {
            provider: 'nrtd',
            tenant: configObject.merchantID,
            keyType: 'sharedSecret',
            organizationId: configObject.merchantID,
          },
        },
      };
    }
    const createNewWebhooksApiInstance = configObject && new restApi.CreateNewWebhooksApi(configObject, apiClient);
    return await new Promise<KeyResponse>((resolve, reject) => {
      if (createNewWebhooksApiInstance) {
        createNewWebhooksApiInstance.saveSymEgressKey(merchantId, vCPermissions, opts, function (error: any, data: any, response: any) {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_KEY_GENERATION_RESPONSE, Constants.LOG_INFO, '', JSON.stringify(response));
          if (data) {
            keyResponse.httpCode = response.status;
            keyResponse.organizationId = data.keyInformation.organizationId;
            keyResponse.key = data.keyInformation.key;
            keyResponse.keyId = data.keyInformation.keyId;
            keyResponse.keyExpiration = data.keyInformation.expirationDate;
            resolve(keyResponse);
          } else if (error) {
            keyResponse.httpCode = error.status;
            reject(keyResponse);
          } else {
            reject(keyResponse);
          }
        });
      } else {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_KEY_GENERATION_RESPONSE, Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_SERVICE_PROCESS);
      }
    }).catch((error) => {
      return error;
    });
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_KEY_GENERATION_RESPONSE, '', exception, '', '', '');
    return keyResponse;
  }
};

export default { getKeyGenerationResponse };
