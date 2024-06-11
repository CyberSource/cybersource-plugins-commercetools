import path from 'path';

import restApi from 'cybersource-rest-client';

import { Constants } from '../../constants';
import { MidCredentialsType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';
import prepareFields from '../../utils/PrepareFields';

/**
 * Deletes a webhook subscription.
 * @param {MidCredentialsType} midCredentials - The MID credentials.
 * @param {string | undefined} subscriptionId - The subscription ID.
 * @returns {Promise<any>} A promise that resolves with the delete webhook subscription response.
 */
const deleteWebhookSubscriptionResponse = async (midCredentials: MidCredentialsType, subscriptionId: string | undefined): Promise<any> => {
  const deleteResponse = {
    httpCode: 0,
  };
  let errorData: string;
  try {
    if (midCredentials?.merchantId && midCredentials?.merchantKeyId && midCredentials?.merchantSecretKey) {
      const configObject = await prepareFields.getConfigObject('FuncDeleteWebhookSubscriptionResponse', midCredentials, null, null);
      if (subscriptionId) {
        const apiClient = new restApi.ApiClient();
        const ManageWebhooksApiInstance = new restApi.ManageWebhooksApi(configObject, apiClient);
        return await new Promise<any>(function (resolve, reject) {
          ManageWebhooksApiInstance.deleteWebhookSubscription(subscriptionId, (error: any, data: any, response: any) => {
            paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncDeleteWebhookSubscriptionResponse', Constants.LOG_INFO, 'SubscriptionId : ' + subscriptionId, 'deleteWebhookSubscriptionResponse = ' + JSON.stringify(response));
            paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncDeleteWebhookSubscriptionResponse', Constants.LOG_INFO, '', 'Delete subscription data = ' + JSON.stringify(data));
            if (Constants.HTTP_OK_STATUS_CODE === response?.status) {
              deleteResponse.httpCode = response[Constants.STRING_RESPONSE_STATUS];
              resolve(deleteResponse);
            } else if (error) {
              if (error?.response && error?.response?.text && 0 < error?.response?.text?.length) {
                paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncDeleteWebhookSubscriptionResponse', Constants.LOG_ERROR, '', error.response.text);
              } else {
                typeof error === 'object' ? (errorData = JSON.stringify(error)) : (errorData = error);
                paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncDeleteWebhookSubscriptionResponse', Constants.LOG_ERROR, '', errorData);
              }
              deleteResponse.httpCode = error.status;
              reject(deleteResponse);
            } else {
              reject(deleteResponse);
            }
          });
        }).catch((error: any) => {
          return error;
        });
      } else {
        return deleteResponse;
      }
    } else {
      return deleteResponse;
    }
  } catch (exception) {
    let webhookId = '';
    if (subscriptionId) {
      webhookId = subscriptionId;
    }
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncDeleteWebhookSubscriptionResponse', '', exception, webhookId, 'WebhookId : ', '');
    return deleteResponse;
  }
};

export default { deleteWebhookSubscriptionResponse };
