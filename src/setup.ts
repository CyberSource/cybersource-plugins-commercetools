import { CustomObjectDraft } from '@commercetools/platform-sdk';
import dotenv from 'dotenv';
import { CustomMessages } from './constants/customMessages';
import { FunctionConstant } from './constants/functionConstant';
import { Constants } from './constants/paymentConstants';
import { MidCredentialsType, SubscriptionInformationType, MerchantWebhookCollectionType } from './types/Types';
import { ApiError, errorHandler } from './utils/ErrorHandler';
import paymentUtils from './utils/PaymentUtils';
import commercetoolsApi from './utils/api/CommercetoolsApi';
import MultiMid from './utils/config/MultiMid';
import { createCustomTypes, createExtension } from './utils/config/ResourceHandler';
import webhookHelper from './utils/helpers/WebhookHelper';

dotenv.config();
/**
 * Sets up extension resources asynchronously by ensuring the required environment variables are set and creating extension resources.
 * @returns {Promise<boolean>} A promise that resolves to true if the extension resources are successfully set up, otherwise false.
 */
const setupExtensionResources = async (): Promise<boolean> => {
  let isExtensionSetupComplete = false;
  try {
    if (process.env.PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL && process.env.PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE && process.env.CT_PROJECT_KEY && process.env.CT_CLIENT_ID && process.env.CT_CLIENT_SECRET && process.env.CT_AUTH_HOST && process.env.CT_API_HOST) {
      await createExtension();
      await createCustomTypes();
      isExtensionSetupComplete = true;
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_SET_UP_EXTENSION_RESOURCE, Constants.LOG_WARN, '', CustomMessages.ERROR_MSG_SETUP_RESOURCES);
    }
  } catch (exception) {
    errorHandler.logError(new ApiError(CustomMessages.EXCEPTION_MSG_SETUP_RESOURCES, exception, FunctionConstant.FUNC_SET_UP_EXTENSION_RESOURCE), __filename, '');
  }
  return isExtensionSetupComplete;
};

/**
 * Helper function to create a subscription information object
 */
const createSubscriptionInfo = (response: any, webhookType: string): SubscriptionInformationType | null => {
  const isAccepted = Constants.HTTP_SUCCESS_STATUS_CODE === response?.httpCode || Constants.HTTP_OK_STATUS_CODE === response?.httpCode;
  if (isAccepted && response?.key && response?.keyId && response?.keyExpiration && response?.webhookId && response?.merchantId) {
    return {
      merchantId: response.merchantId,
      key: response.key,
      keyId: response.keyId,
      keyExpiration: response.keyExpiration,
      webhookId: response.webhookId,
      webhookType: webhookType,
    };
  }
  return null;
};

/**
 * Creates webhook subscriptions for all webhook types and stores them in the custom object.
 * @returns {Promise<any>} A promise that resolves to the response of setting the custom object containing all subscription information.
 */
const createWebhookSubscription = async (): Promise<any> => {
  let setCustomObjectResponse;
  let subscriptionResponse: any;
  let midCredentials: MidCredentialsType;
  let allMids: string[] = [];
  let merchantWebhookCollections: MerchantWebhookCollectionType[] = [];
  if (process.env.PAYMENT_GATEWAY_MERCHANT_ID) {
    allMids.push(process.env.PAYMENT_GATEWAY_MERCHANT_ID);
  }
  if (process.env.PAYMENT_GATEWAY_UNIFIED_CHECKOUT_MULTI_MID) {
    const networkTokenMultiMidArray = process.env.PAYMENT_GATEWAY_UNIFIED_CHECKOUT_MULTI_MID.split(',');
    for (let mid of networkTokenMultiMidArray) {
      mid = mid.trim();
      if (mid && !allMids.includes(mid)) {
        allMids.push(mid);
      }
    }
  }

  try {
    const existingCustomObject = await commercetoolsApi.retrieveCustomObjectByContainer(Constants.CUSTOM_OBJECT_CONTAINER);
    const storedCollections = existingCustomObject?.results?.[0]?.value;
    if (Array.isArray(storedCollections)) {
      merchantWebhookCollections = storedCollections.filter((collection: MerchantWebhookCollectionType) => collection?.merchantId);
    }
    if (0 < allMids.length) {
      for (let mid of allMids) {
        if (!mid) continue;

        midCredentials = MultiMid.getMidCredentials(mid);
        subscriptionResponse = await webhookHelper.handleWebhookSubscription(midCredentials);
        const merchantId = subscriptionResponse?.merchantId;
        if (!merchantId) continue;

        let merchantCollection = merchantWebhookCollections.find((collection) => collection.merchantId?.toLowerCase() === String(merchantId).toLowerCase());

        if (!merchantCollection) {
          merchantCollection = { merchantId };
          merchantWebhookCollections.push(merchantCollection);
        }
        const webhookKeyInfo =
          subscriptionResponse?.key && subscriptionResponse?.keyId && subscriptionResponse?.keyExpiration
            ? { key: subscriptionResponse.key, keyId: subscriptionResponse.keyId, keyExpiration: subscriptionResponse.keyExpiration }
            : null;
        if (!webhookKeyInfo) {
          paymentUtils.logData(__filename, 'FuncCreateWebhookSubscription', Constants.LOG_WARN, mid, 'Webhook security key not available. Webhook details cannot be stored.');
        }
        if (subscriptionResponse?.decisionManagerWebhook && webhookKeyInfo) {
          subscriptionResponse.decisionManagerWebhook.key = webhookKeyInfo.key;
          subscriptionResponse.decisionManagerWebhook.keyId = webhookKeyInfo.keyId;
          subscriptionResponse.decisionManagerWebhook.keyExpiration = webhookKeyInfo.keyExpiration;
          subscriptionResponse.decisionManagerWebhook.merchantId = merchantId;
        }
        if (subscriptionResponse?.unifiedCheckoutWebhook && webhookKeyInfo) {
          subscriptionResponse.unifiedCheckoutWebhook.key = webhookKeyInfo.key;
          subscriptionResponse.unifiedCheckoutWebhook.keyId = webhookKeyInfo.keyId;
          subscriptionResponse.unifiedCheckoutWebhook.keyExpiration = webhookKeyInfo.keyExpiration;
          subscriptionResponse.unifiedCheckoutWebhook.merchantId = merchantId;
        }
        if (subscriptionResponse?.decisionManagerWebhook) {
          const decisionManagerInfo = createSubscriptionInfo(subscriptionResponse.decisionManagerWebhook, 'decisionManager');
          if (decisionManagerInfo) {
            merchantCollection.decisionManager = decisionManagerInfo;
          } else {
            paymentUtils.logData(__filename, 'FuncCreateWebhookSubscription', Constants.LOG_WARN, mid, 'Failed to create decisionManagerInfo from response');
          }
        }
        if (subscriptionResponse?.unifiedCheckoutWebhook) {
          const ucInfo = createSubscriptionInfo(subscriptionResponse.unifiedCheckoutWebhook, 'unifiedCheckout');
          if (ucInfo) {
            merchantCollection.unifiedCheckout = ucInfo;
          } else {
            paymentUtils.logData(__filename, 'FuncCreateWebhookSubscription', Constants.LOG_WARN, mid, 'Failed to create ucInfo from response');
          }
        }
      }
    }

    if (0 < merchantWebhookCollections.length) {
      const setCustomObjectRequest: CustomObjectDraft = {
        container: Constants.CUSTOM_OBJECT_CONTAINER,
        key: Constants.CUSTOM_OBJECT_KEY,
        value: merchantWebhookCollections,
      };
      setCustomObjectResponse = await commercetoolsApi.createCTCustomObject(setCustomObjectRequest);
      if (!setCustomObjectResponse?.id || !setCustomObjectResponse?.container || !setCustomObjectResponse?.key || !setCustomObjectResponse?.value) {
        paymentUtils.logData(__filename, 'FuncCreateWebhookSubscription', Constants.LOG_WARN, '', `Failed to store webhooks: ${JSON.stringify(setCustomObjectResponse)}`);
        return;
      }
    }
  } catch (exception) {
    errorHandler.logError(new ApiError(CustomMessages.ERROR_MSG_API_EXECUTION, exception, FunctionConstant.FUNC_CREATE_WEBHOOK_SUBSCRIPTION), __filename, '');
    return;
  }
  return setCustomObjectResponse;
};

export { setupExtensionResources, createWebhookSubscription };
