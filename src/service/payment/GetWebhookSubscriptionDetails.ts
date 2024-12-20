import restApi, { InlineResponse2013 } from 'cybersource-rest-client';

import { Constants } from '../../constants/constants';
import { FunctionConstant } from '../../constants/functionConstant';
import prepareFields from '../../requestBuilder/PrepareFields';
import { MidCredentialsType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';
import isvApi from '../../utils/api/isvApi';

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
  const requestObject = {
    organizationId: '',
    productId: '',
    eventType: '',
    offset: 0,
    limit: 0,
    status: '',
  };
  if (midCredentials?.merchantId && midCredentials?.merchantKeyId && midCredentials?.merchantSecretKey) {
    const apiClient = new restApi.ApiClient();
    const configObject = prepareFields.getConfigObject(FunctionConstant.FUNC_GET_WEBHOOK_SUBSCRIPTION_RESPONSE, midCredentials, null, null);
    if (configObject?.merchantID) requestObject.organizationId = configObject.merchantID;
    requestObject.productId = 'ctNetworkTokenSubscription';
    requestObject.eventType = Constants.NETWORK_TOKEN_EVENT;
    requestObject.status = Constants.STRING_ACTIVE;
    const startTime = new Date().getTime();
    return await new Promise<InlineResponse2013>((resolve, reject) => {
      isvApi.getSubscriptionDetails(apiClient, configObject, requestObject, (error: any, data: any, response: any) => {
        const endTime = new Date().getTime();
        paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_TRANSIENT_TOKEN_DATA_RESPONSE, Constants.LOG_DEBUG, '', 'Get webhooks subscription details response is = ' + paymentUtils.maskData(JSON.stringify(response)), `${endTime - startTime}`);
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
};

export default { getWebhookSubscriptionResponse };
