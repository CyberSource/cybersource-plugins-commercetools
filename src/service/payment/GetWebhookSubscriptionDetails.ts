import restApi, { InlineResponse2013 } from 'cybersource-rest-client';

import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from '../../constants/paymentConstants';
import prepareFields from '../../requestBuilder/PrepareFields';
import { MidCredentialsType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';

/**
* Retrieves webhook subscription details for a mid.
* @param {MidCredentialsType} midCredentials - The MID credentials.
* @returns {Promise<unknown>} - A promise resolving to webhook subscription response.
*/
const getWebhookSubscriptionResponse = async (midCredentials: MidCredentialsType): Promise<InlineResponse2013> => {
  const subscriptionDetailResponse = {
    httpCode: 0,
    webhookId: '',
    webhookUrl: '',
  };
  try {
    if (midCredentials?.merchantId && midCredentials?.merchantKeyId && midCredentials?.merchantSecretKey) {
      const apiClient = new restApi.ApiClient();
      const configObject = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_WEBHOOK_SUBSCRIPTION_RESPONSE, midCredentials, null, null);
      const productId = 'ctNetworkTokenSubscription';
      const eventType = Constants.NETWORK_TOKEN_EVENT;
      const startTime = new Date().getTime();
      const getWebhookSubscriptionInstance = configObject && new restApi.ManageWebhooksApi(configObject, apiClient);
      return await new Promise<InlineResponse2013>((resolve, reject) => {
        getWebhookSubscriptionInstance?.getWebhookSubscriptionsByOrg(configObject?.merchantID || '', productId, eventType, (error: any, data: any, response: any) => {
          const endTime = new Date().getTime();
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_WEBHOOK_SUBSCRIPTION_RESPONSE, Constants.LOG_DEBUG, '', 'Get webhooks subscription details response is = ' + paymentUtils.maskData(JSON.stringify(response)), `${endTime - startTime}`);
          if (data) {
            subscriptionDetailResponse.httpCode = response.status;
            subscriptionDetailResponse.webhookId = data.webhookId || data[0]?.webhookId;
            subscriptionDetailResponse.webhookUrl = data.webhookUrl || data[0]?.webhookUrl;
            resolve(subscriptionDetailResponse);
          } else if (error) {
            subscriptionDetailResponse.httpCode = error.status;
            reject(subscriptionDetailResponse);
          } else {
            reject(subscriptionDetailResponse);
          }
        });
      }).catch((error) => {
        return error;
      });
    } else {
      return subscriptionDetailResponse;
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_WEBHOOK_SUBSCRIPTION_RESPONSE, '', exception, '', '', '');
    return subscriptionDetailResponse;
  }
};

export default { getWebhookSubscriptionResponse };