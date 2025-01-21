import restApi from 'cybersource-rest-client';

import { Constants } from '../../constants/constants';
import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import prepareFields from '../../requestBuilder/PrepareFields';
import { MidCredentialsType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';

/**
 * Deletes a webhook subscription.
 * @param {MidCredentialsType} midCredentials - The MID credentials.
 * @param {string | undefined} webhookId - The subscription ID.
 * @returns {Promise<any>} A promise that resolves with the delete webhook subscription response.
 */
const deleteWebhookSubscriptionResponse = async (midCredentials: MidCredentialsType, webhookId: string | undefined): Promise<any> => {
  const deleteResponse = {
    httpCode: 0,
  };
  let id = webhookId || '';
  if (midCredentials?.merchantId && midCredentials?.merchantKeyId && midCredentials?.merchantSecretKey && webhookId) {
    const configObject = prepareFields.getConfigObject(FunctionConstant.FUNC_DELETE_WEBHOOK_SUBSCRIPTION_RESPONSE, midCredentials, null, null);
    const apiClient = new restApi.ApiClient();
    const manageWebhooksApiInstance = configObject && new restApi.ManageWebhooksApi(configObject, apiClient);
    const startTime = new Date().getTime();
    return await new Promise<any>(function (resolve, reject) {
      if (manageWebhooksApiInstance) {
        manageWebhooksApiInstance.deleteWebhookSubscription(id, (error: any, data: any, response: any) => {
          const endTime = new Date().getTime();
          paymentUtils.logData(__filename, FunctionConstant.FUNC_DELETE_WEBHOOK_SUBSCRIPTION_RESPONSE, Constants.LOG_DEBUG, 'webhookId : ' + webhookId, 'deleteWebhookSubscriptionResponse = ' + response, `${endTime - startTime}`);
          paymentUtils.logData(__filename, FunctionConstant.FUNC_DELETE_WEBHOOK_SUBSCRIPTION_RESPONSE, Constants.LOG_DEBUG, '', 'Delete subscription data = ' + data);
          if (Constants.HTTP_OK_STATUS_CODE === response?.status) {
            deleteResponse.httpCode = response[Constants.STRING_RESPONSE_STATUS];
            resolve(deleteResponse);
          } else if (error) {
            deleteResponse.httpCode = error.status;
            reject(deleteResponse);
          } else {
            reject(deleteResponse);
          }
        });
      } else {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_DELETE_WEBHOOK_SUBSCRIPTION_RESPONSE, Constants.LOG_ERROR, 'webhookId : ' + webhookId, CustomMessages.ERROR_MSG_SERVICE_PROCESS);
      }
    }).catch((error: any) => {
      return error;
    });
  } else {
    return deleteResponse;
  }
};

export default { deleteWebhookSubscriptionResponse };
