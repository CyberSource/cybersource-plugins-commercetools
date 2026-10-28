import restApi, { InlineResponse2013 } from 'cybersource-rest-client';

import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from '../../constants/paymentConstants';
import prepareFields from '../../requestBuilder/PrepareFields';
import { MidCredentialsType } from '../../types/Types';
import { AuthenticationError, errorHandler } from '../../utils/ErrorHandler';
import paymentUtils from '../../utils/PaymentUtils';
import isvApi from '../../utils/api/IsvApi';
import fraudProductResolver from './FraudProductResolver';

/**
 * Retrieves webhook subscription details for a MID.
 * @param {MidCredentialsType} midCredentials - The MID credentials.
 * @param {string} subscriptionType - The webhook type to look up.
 * @returns {Promise<InlineResponse2013>} - A promise resolving to webhook subscription response.
 */
const getWebhookSubscriptionResponse = async (midCredentials: MidCredentialsType, subscriptionType: 'decisionManager' | 'unifiedCheckout'): Promise<InlineResponse2013> => {
  const subscriptionDetailResponse: InlineResponse2013 = {
    httpCode: 0,
    webhookId: '',
    webhookUrl: '',
  };

  try {
    if (midCredentials?.merchantId && midCredentials?.merchantKeyId && midCredentials?.merchantSecretKey) {
      const apiClient = new restApi.ApiClient();
      const configObject = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_WEBHOOK_SUBSCRIPTION_RESPONSE, midCredentials, null, null);

      let fraudProductId = Constants.PAYMENT_GATEWAY_FRAUD_PRODUCT_ID;
      let fraudEventType = Constants.FRAUD_DM_REJECT_EVENT;
      if ('decisionManager' === subscriptionType && configObject) {
        const fraudProduct = await fraudProductResolver.getFraudProductSubscription(apiClient, configObject, configObject.merchantID);
        if (fraudProduct) {
          fraudProductId = fraudProduct.productId;
          fraudEventType = fraudProduct.eventTypes.includes(Constants.FRAUD_DM_REJECT_EVENT) ? Constants.FRAUD_DM_REJECT_EVENT : fraudProduct.eventTypes[0];
        }
      }

      const startTime = new Date().getTime();
      const opts = {
        eventType: 'unifiedCheckout' === subscriptionType ? Constants.UC_ORDER_TRANSACTION_RESULT_EVENT : fraudEventType,
        productId: 'unifiedCheckout' === subscriptionType ? Constants.PAYMENT_GATEWAY_UNIFIED_CHECKOUT_PRODUCT_ID : fraudProductId,
        organizationId: configObject?.merchantID,
      };

      const subscriptionPromise = new Promise<InlineResponse2013>((resolve, reject) => {
        isvApi?.getSubscriptionDetails(apiClient, configObject, opts, (error: any, data: any, response: any) => {
          const endTime = new Date().getTime();
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_WEBHOOK_SUBSCRIPTION_RESPONSE, Constants.LOG_DEBUG, '', 'Get webhooks subscription details response is = ' + paymentUtils.maskData(JSON.stringify(response)), `${endTime - startTime}`);

          if (data) {
            subscriptionDetailResponse.httpCode = response?.status || 0;
            subscriptionDetailResponse.webhookId = data?.webhookId || data?.[0]?.webhookId || '';
            subscriptionDetailResponse.webhookUrl = data?.webhookUrl || data?.[0]?.webhookUrl || '';
            resolve(subscriptionDetailResponse);
          } else if (error) {
            subscriptionDetailResponse.httpCode = error?.status || 0;
            reject(subscriptionDetailResponse);
          } else {
            reject(subscriptionDetailResponse);
          }
        });
      }).catch((error) => {
        return error;
      });

      const timeoutPromise = new Promise<InlineResponse2013>((resolve) => {
        setTimeout(() => {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_WEBHOOK_SUBSCRIPTION_RESPONSE, Constants.LOG_WARN, '', 'Get subscription details timed out after 10s');
          resolve(subscriptionDetailResponse);
        }, 10000);
      });

      return await Promise.race([subscriptionPromise, timeoutPromise]);
    }

    return subscriptionDetailResponse;
  } catch (exception) {
    errorHandler.logError(new AuthenticationError(CustomMessages.ERROR_MSG_SERVICE_PROCESS, exception, FunctionConstant.FUNC_GET_WEBHOOK_SUBSCRIPTION_RESPONSE), __filename, '');
    return subscriptionDetailResponse;
  }
};

export default { getWebhookSubscriptionResponse };
