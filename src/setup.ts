import dotenv from 'dotenv';

import { Constants } from './constants/constants';
import { CustomMessages } from './constants/customMessages';
import { FunctionConstant } from './constants/functionConstant';
import { MidCredentialsType, SubscriptionInformationType } from './types/Types';
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
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_SET_UP_EXTENSION_RESOURCE, '', CustomMessages.EXCEPTION_MSG_SETUP_RESOURCES, '', '', '');
  }
  return isExtensionSetupComplete;
};

/**
 * Creates webhook subscription for the payment gateway.
 * @returns {Promise<any>} A promise that resolves to the response of setting the custom object containing subscription information.
 */
const createWebhookSubscription = async (): Promise<any> => {
  let setCustomObjectResponse;
  let subscriptionResponse;
  let midCredentials: MidCredentialsType;
  let subscriptionInformation: SubscriptionInformationType;
  let networkTokenMultiMidArray: string[] = [];
  let subscriptionInformationArray: SubscriptionInformationType[] = [];
  if (process.env.PAYMENT_GATEWAY_NETWORK_TOKEN_MULTI_MID) {
    networkTokenMultiMidArray = process.env.PAYMENT_GATEWAY_NETWORK_TOKEN_MULTI_MID.split(',');
  }
  try {
    if (0 < networkTokenMultiMidArray.length) {
      for (let mid of networkTokenMultiMidArray) {
        if (process.env.PAYMENT_GATEWAY_MERCHANT_ID === mid) {
          mid = '';
        }
        midCredentials = MultiMid.getMidCredentials(mid);
        subscriptionResponse = await webhookHelper.handleWebhookSubscription(midCredentials);
        if (subscriptionResponse?.subscriptionPresent) {
          paymentUtils.logData(__filename, 'FuncCreateWebhookSubscription', Constants.LOG_INFO, '', `Subcription already present for mid ${mid}`);
          if (!networkTokenMultiMidArray.includes(subscriptionResponse?.merchantId)) {
            return;
          }
        }
        if (Constants.HTTP_SUCCESS_STATUS_CODE === subscriptionResponse?.httpCode && subscriptionResponse?.key && subscriptionResponse.keyId && subscriptionResponse?.keyExpiration && subscriptionResponse?.webhookId && subscriptionResponse.merchantId) {
          subscriptionInformation = {
            merchantId: subscriptionResponse.merchantId,
            key: subscriptionResponse.key,
            keyId: subscriptionResponse.keyId,
            keyExpiration: subscriptionResponse.keyExpiration,
            webhookId: subscriptionResponse.webhookId,
          };
          subscriptionInformationArray.push(subscriptionInformation);
        }
      }
    }
    if (0 < subscriptionInformationArray.length) {
      const setCustomObjectRequest = {
        container: Constants.CUSTOM_OBJECT_CONTAINER,
        key: Constants.CUSTOM_OBJECT_KEY,
        value: subscriptionInformationArray,
      };
      setCustomObjectResponse = await commercetoolsApi.createCTCustomObject(setCustomObjectRequest);
      if (Constants.HTTP_OK_STATUS_CODE === setCustomObjectResponse?.statusCode) {
        paymentUtils.logData(__filename, 'FuncCreateWebhookSubscription', Constants.LOG_INFO, '', JSON.stringify(setCustomObjectResponse));
      } else {
        paymentUtils.logData(__filename, 'FuncCreateWebhookSubscription', Constants.LOG_INFO, '', JSON.stringify(setCustomObjectResponse));
        return;
      }
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, 'FuncCreateWebhookSubscription', '', exception, '', '', '');
    return;
  }
  return setCustomObjectResponse;
};

export { setupExtensionResources, createWebhookSubscription };
