import path from 'path';

import restApi from 'cybersource-rest-client';

import { Constants } from '../../constants';
import { midCredentialsType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';
import prepareFields from '../../utils/PrepareFields';

const keyGenerationResponse = async (midCredentials: midCredentialsType) => {
  const keyResponse = {
    httpCode: 0,
    organizationId: null,
    key: null,
    keyId: null,
    keyExpiration: null,
  };
  let errorData: string;
  const vCPermissions = '100';
  let opts: any;
  let merchantId = '';
  try {
    const apiClient = new restApi.ApiClient();
    const configObject = await prepareFields.getConfigObject('FuncKeyGenerationResponse', midCredentials, null, null);
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
    const createNewWebhooksApiInstance = new restApi.CreateNewWebhooksApi(configObject, apiClient);
    return await new Promise((resolve, reject) => {
      createNewWebhooksApiInstance.saveSymEgressKey(merchantId, vCPermissions, opts, function (error: any, data: any, response: any) {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncKeyGenerationResponse', Constants.LOG_INFO, '', JSON.stringify(response));
        if (data) {
          keyResponse.httpCode = response.status;
          keyResponse.organizationId = data.keyInformation.organizationId;
          keyResponse.key = data.keyInformation.key;
          keyResponse.keyId = data.keyInformation.keyId;
          keyResponse.keyExpiration = data.keyInformation.expirationDate;
          resolve(keyResponse);
        } else if (error) {
          if (error?.response && error?.response?.text && 0 < error?.response?.text?.length) {
            paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncKeyGenerationResponse', Constants.LOG_ERROR, '', error.response.text);
          } else {
            typeof error === 'object' ? (errorData = JSON.stringify(error)) : (errorData = error);
            paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncKeyGenerationResponse', Constants.LOG_ERROR, '', errorData);
          }
          keyResponse.httpCode = error.status;
          reject(keyResponse);
        } else {
          reject(keyResponse);
        }
      });
    }).catch((error) => {
      return error;
    });
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncKeyGenerationResponse', '', exception, '', '', '');
    return keyResponse;
  }
};

export default { keyGenerationResponse };
