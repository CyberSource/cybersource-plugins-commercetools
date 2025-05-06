import restApi, { InlineResponse2013 } from 'cybersource-rest-client';

import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from '../../constants/paymentConstants';
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
  try {
    const createWebhookSubscriptionInstance = configObject && new restApi.CreateNewWebhooksApi(configObject, apiClient);
    const startTime = new Date().getTime();
    return await new Promise<InlineResponse2013>((resolve, reject) => {
      if (createWebhookSubscriptionInstance) {
        createWebhookSubscriptionInstance.createWebhookSubscription(opts, (error: any, data: any, response: any) => {
          const endTime = new Date().getTime();
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CREATE_WEBHOOK_SUBSCRIPTION_RESPONSE, Constants.LOG_DEBUG, '', paymentUtils.maskData(JSON.stringify(response)), `${endTime - startTime}`);
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
