import restApi, { InlineResponse2013 } from 'cybersource-rest-client';

import { Constants } from '../../constants/constants';
import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import prepareFields from '../../requestBuilder/PrepareFields';
import { MidCredentialsType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';

/**
 * Handles creating of  webhook subscription.
 * @param {MidCredentialsType} midCredentials - The MID credentials.
 * @returns {Promise<unknown>} A promise that resolves with the webhook subscription response.
 */
const getCreateWebhookSubscriptionResponse = async (midCredentials: MidCredentialsType): Promise<InlineResponse2013> => {
  const webHookResponse = {
    httpCode: 0,
    webhookId: '',
  };
  let opts: any;
  try {
    const apiClient = new restApi.ApiClient();
    const configObject = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_CREATE_WEBHOOK_SUBSCRIPTION_RESPONSE, midCredentials, null, null);
    if (configObject) {
      opts = {
        createWebhookRequest: {
          name: 'token update notification',
          description: 'token update notification',
          organizationId: configObject.merchantID,
          productId: Constants.PAYMENT_GATEWAY_PRODUCT_ID,
          eventTypes: [Constants.PAYMENT_GATEWAY_NETWORK_TOKEN_EVENT_TYPE],
          webhookUrl: process.env.PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL + Constants.PAYMENT_GATEWAY_WEBHOOK_ENDPOINT,
          healthCheckUrl: process.env.PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL + Constants.PAYMENT_GATEWAY_WEBHOOK_ENDPOINT,
          securityPolicy: {
            securityType: 'KEY',
            proxyType: 'external',
          },
        },
      };
    }
    const createWebhookSubscriptionInstance = configObject && new restApi.CreateNewWebhooksApi(configObject, apiClient);
    return await new Promise<InlineResponse2013>((resolve, reject) => {
      if (createWebhookSubscriptionInstance) {
        createWebhookSubscriptionInstance.createWebhookSubscription(opts, (error: any, data: any, response: any) => {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CREATE_WEBHOOK_SUBSCRIPTION_RESPONSE, Constants.LOG_INFO, '', JSON.stringify(response));
          if (data) {
            webHookResponse.httpCode = response.status;
            webHookResponse.webhookId = data.webhookId;
            resolve(webHookResponse);
          } else if (error) {
            webHookResponse.httpCode = error.status;
            reject(webHookResponse);
          } else {
            reject(webHookResponse);
          }
        });
      } else {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CREATE_WEBHOOK_SUBSCRIPTION_RESPONSE, Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_SERVICE_PROCESS);
      }
    }).catch((error) => {
      return error;
    });
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_CREATE_WEBHOOK_SUBSCRIPTION_RESPONSE, '', exception, '', '', '');
    return webHookResponse;
  }
};

export default { getCreateWebhookSubscriptionResponse };
