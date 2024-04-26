import path from 'path';

import restApi from 'cybersource-rest-client';

import { Constants } from '../../constants';
import { midCredentialsType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';
import prepareFields from '../../utils/PrepareFields';

const webhookSubscriptionResponse = async (midCredentials: midCredentialsType) => {
  const webHookResponse = {
    httpCode: null,
    webhookId: null,
  };
  let errorData: string;
  let opts: any;
  try {
    const apiClient = new restApi.ApiClient();
    const configObject = await prepareFields.getConfigObject('FuncWebhookSubscriptionResponse', midCredentials, null, null);
    if (undefined !== configObject) {
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
    const createWebhookSubscriptionInstance = new restApi.CreateNewWebhooksApi(configObject, apiClient);
    return await new Promise((resolve, reject) => {
      createWebhookSubscriptionInstance.createWebhookSubscription(opts, (error: any, data: any, response: any) => {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncWebhookSubscriptionResponse', Constants.LOG_INFO, '', JSON.stringify(response));
        if (data) {
          webHookResponse.httpCode = response.status;
          webHookResponse.webhookId = data.webhookId;
          resolve(webHookResponse);
        } else if (error) {
          if (error?.response && error?.response?.text && 0 < error?.response?.text?.length) {
            paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncWebhookSubscriptionResponse', Constants.LOG_ERROR, '', error.response.text);
          } else {
            typeof error === 'object' ? (errorData = JSON.stringify(error)) : (errorData = error);
            paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncWebhookSubscriptionResponse', Constants.LOG_ERROR, '', errorData);
          }
          webHookResponse.httpCode = error.status;
          reject(webHookResponse);
        } else {
          reject(webHookResponse);
        }
      });
    }).catch((error) => {
      return error;
    });
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncWebhookSubscriptionResponse', '', exception, '', '', '');
    return webHookResponse;
  }
};

export default { webhookSubscriptionResponse };
