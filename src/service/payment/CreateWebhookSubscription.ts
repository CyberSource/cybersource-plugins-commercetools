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

const buildWebhookRequest = (organizationId: string, name: string, description: string, products: Array<{ productId: string; eventTypes: string[] }>, webhookPath: string, securityType: string, extraFields: Record<string, unknown> = {}) => ({
  createWebhook: {
    name,
    description,
    organizationId,
    products,
    webhookUrl: process.env.PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL + webhookPath,
    healthCheckUrl: process.env.PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL + webhookPath,
    retryPolicy: {
      algorithm: 'ARITHMETIC',
      firstRetry: 1,
      interval: 1,
      numberOfRetries: 3,
      deactivateFlag: 'false',
      repeatSequenceCount: 0,
      repeatSequenceWaitTime: 0,
    },
    securityPolicy: {
      securityType,
    },
    ...extraFields,
  },
});

/**
 * Handles creating of Decision Manager webhook subscription.
 * @param {MidCredentialsType} midCredentials - The MID credentials.
 * @returns {Promise<InlineResponse2013>} A promise that resolves with the decision manager webhook subscription response.
 */
const getCreateDecisionManagerWebhookSubscriptionResponse = async (midCredentials: MidCredentialsType): Promise<InlineResponse2013> => {
  const webHookResponse = {
    httpCode: 0,
    webhookId: '',
  };
  let opts: any;
  const apiClient = new restApi.ApiClient();
  const configObject = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_CREATE_WEBHOOK_SUBSCRIPTION_RESPONSE, midCredentials, null, null);
  if (configObject) {
    const fraudProduct = await fraudProductResolver.getFraudProductSubscription(apiClient, configObject, configObject.merchantID);
    if (!fraudProduct) {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CREATE_WEBHOOK_SUBSCRIPTION_RESPONSE, Constants.LOG_WARN, '', 'Skipping Decision Manager webhook creation: merchant is not entitled to a fraud/decision-manager product.');
      return webHookResponse;
    }
    opts = buildWebhookRequest(
      configObject.merchantID,
      'decision manager notification',
      'Decision Manager notifications',
      [
        {
          productId: fraudProduct.productId,
          eventTypes: fraudProduct.eventTypes,
        },
      ],
      Constants.PAYMENT_GATEWAY_FRAUD_WEBHOOK_ENDPOINT,
      'key',
    );
  }
  try {
    const startTime = new Date().getTime();
    const subscriptionPromise = new Promise<InlineResponse2013>((resolve, reject) => {
      isvApi.createNewSubscription(apiClient, configObject, opts, (error: any, data: any, response: any) => {
        const endTime = new Date().getTime();
        paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CREATE_WEBHOOK_SUBSCRIPTION_RESPONSE, Constants.LOG_DEBUG, '', paymentUtils.maskData(JSON.stringify(response)), `${endTime - startTime}`);
        if (data) {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CREATE_WEBHOOK_SUBSCRIPTION_RESPONSE, Constants.LOG_INFO, '', 'Decision Manager webhook created successfully. webhookId=' + data.webhookId + ', status=' + response.status);
          webHookResponse.httpCode = response.status;
          webHookResponse.webhookId = data.webhookId;
          resolve(webHookResponse);
        } else if (error) {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CREATE_WEBHOOK_SUBSCRIPTION_RESPONSE, Constants.LOG_WARN, '', 'Decision Manager webhook creation failed. Error status=' + error.status + ', body=' + paymentUtils.maskData(JSON.stringify(response)));
          webHookResponse.httpCode = error.status;
          reject(webHookResponse);
        } else {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CREATE_WEBHOOK_SUBSCRIPTION_RESPONSE, Constants.LOG_WARN, '', 'Decision Manager webhook creation returned no data and no error. Response=' + paymentUtils.maskData(JSON.stringify(response)));
          reject(webHookResponse);
        }
      });
    }).catch((error) => {
      return error;
    });
    const timeoutPromise = new Promise<InlineResponse2013>((resolve) => {
      setTimeout(() => {
        resolve(webHookResponse);
      }, 15000);
    });
    return await Promise.race([subscriptionPromise, timeoutPromise]);
  } catch (exception) {
    errorHandler.logError(new AuthenticationError(CustomMessages.ERROR_MSG_PROCESSING_SUBSCRIPTION, exception, FunctionConstant.FUNC_GET_CREATE_WEBHOOK_SUBSCRIPTION_RESPONSE), __filename, '');
    return webHookResponse;
  }
};

/**
 * Handles creating of Unified Checkout webhook subscription.
 * @param {MidCredentialsType} midCredentials - The MID credentials.
 * @returns {Promise<InlineResponse2013>} A promise that resolves with the UC webhook subscription response.
 */
const getCreateUCWebhookSubscriptionResponse = async (midCredentials: MidCredentialsType): Promise<InlineResponse2013> => {
  const webHookResponse = {
    httpCode: 0,
    webhookId: '',
  };
  let opts: any;
  const apiClient = new restApi.ApiClient();
  const configObject = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_CREATE_WEBHOOK_SUBSCRIPTION_RESPONSE, midCredentials, null, null);
  if (configObject) {
    const webhookEndpoint = Constants.PAYMENT_GATEWAY_WEBHOOK_ENDPOINT;
    opts = {
      createWebhook: {
        name: 'UC Webhook Events',
        description: 'UC Events Simulation',
        organizationId: configObject.merchantID,
        products: [
          {
            productId: 'unifiedCheckout',
            eventTypes: ['uc.orders.transactionresults'],
          },
        ],
        webhookUrl: process.env.PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL + webhookEndpoint,
        healthCheckUrl: process.env.PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL + webhookEndpoint,
        notificationScope: 'SELF',
        retryPolicy: {
          algorithm: 'ARITHMETIC',
          firstRetry: 1,
          interval: 1,
          numberOfRetries: 3,
          deactivateFlag: 'false',
          repeatSequenceCount: 0,
          repeatSequenceWaitTime: 0,
        },
        securityPolicy: {
          securityType: 'key'
        },
      },
    };
  }
  try {
    const startTime = new Date().getTime();
    // Log the payload before sending the POST
    const subscriptionPromise = new Promise<InlineResponse2013>((resolve, reject) => {
      isvApi.createNewSubscription(apiClient, configObject, opts, (error: any, data: any, response: any) => {
        const endTime = new Date().getTime();
        // Log the raw response from the UC webhook POST
        paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CREATE_WEBHOOK_SUBSCRIPTION_RESPONSE, Constants.LOG_DEBUG, '', paymentUtils.maskData(JSON.stringify(response)), `${endTime - startTime}`);
        if (data) {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CREATE_WEBHOOK_SUBSCRIPTION_RESPONSE, Constants.LOG_INFO, '', 'UC Webhook subscription created successfully. webhookId=' + data.webhookId + ', status=' + response.status);
          webHookResponse.httpCode = response.status;
          webHookResponse.webhookId = data.webhookId;
          resolve(webHookResponse);
        } else if (error) {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CREATE_WEBHOOK_SUBSCRIPTION_RESPONSE, Constants.LOG_WARN, '', 'UC Webhook subscription creation failed. Error status=' + error.status + ', body=' + paymentUtils.maskData(JSON.stringify(response)));
          webHookResponse.httpCode = error.status;
          reject(webHookResponse);
        } else {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CREATE_WEBHOOK_SUBSCRIPTION_RESPONSE, Constants.LOG_WARN, '', 'UC Webhook subscription creation returned no data and no error. Response=' + paymentUtils.maskData(JSON.stringify(response)));
          reject(webHookResponse);
        }
      });
    }).catch((error) => {
      return error;
    });
    const timeoutPromise = new Promise<InlineResponse2013>((resolve) => {
      setTimeout(() => {
        resolve(webHookResponse);
      }, 15000);
    });
    return await Promise.race([subscriptionPromise, timeoutPromise]);
  } catch (exception) {
    errorHandler.logError(new AuthenticationError(CustomMessages.ERROR_MSG_PROCESSING_SUBSCRIPTION, exception, FunctionConstant.FUNC_GET_CREATE_WEBHOOK_SUBSCRIPTION_RESPONSE), __filename, '');
    return webHookResponse;
  }
};

export default { getCreateDecisionManagerWebhookSubscriptionResponse, getCreateUCWebhookSubscriptionResponse };
