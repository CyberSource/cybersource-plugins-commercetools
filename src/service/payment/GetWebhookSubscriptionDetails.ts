import path from 'path';

import restApi from 'cybersource-rest-client';

import { Constants } from '../../constants';
import { midCredentialsType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';
import prepareFields from '../../utils/PrepareFields';
import cybersourceApi from '../../utils/api/CybersourceApi';

const getWebhookSubscriptionResponse = async (midCredentials: midCredentialsType) => {
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
  let errorData: string;
  try {
    if (midCredentials?.merchantId && midCredentials?.merchantKeyId && midCredentials?.merchantSecretKey) {
      const apiClient = new restApi.ApiClient();
      const configObject = await prepareFields.getConfigObject('FuncGetWebhookSubscriptionResponse', midCredentials, null, null);
      requestObject.organizationId = configObject?.merchantID as string;
      requestObject.productId = 'ctNetworkTokenSubscription';
      requestObject.eventType = 'tms.networktoken.updated';
      requestObject.status = 'active';
      return await new Promise((resolve, reject) => {
        cybersourceApi.getSubscriptionDetails(apiClient, configObject, requestObject, (error: any, data: any, response: any) => {
          if (data) {
            subscriptionDetailResponse.httpCode = response.status;
            subscriptionDetailResponse.webhookId = data.webhookId;
            subscriptionDetailResponse.webhookUrl = data.webhookUrl;
            resolve(subscriptionDetailResponse);
          } else if (error) {
            if (error?.response && error?.response?.text && 0 < error?.response?.text?.length) {
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetWebhookSubscriptionResponse', Constants.LOG_ERROR, '', error.response.text);
            } else {
              typeof error === 'object' ? (errorData = JSON.stringify(error)) : (errorData = error);
              paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetWebhookSubscriptionResponse', Constants.LOG_ERROR, '', errorData);
            }
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
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncGetWebhookSubscriptionResponse', '', exception, '', '', '');
    return subscriptionDetailResponse;
  }
};

export default { getWebhookSubscriptionResponse };
