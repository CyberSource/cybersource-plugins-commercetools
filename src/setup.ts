import path from 'path';

import dotenv from 'dotenv';

import { Constants } from '././constants';
import paymentUtils from '././utils/PaymentUtils';
import resourceHandler from '././utils/config/ResourceHandler';
import { midCredentialsType, subscriptionInformationType } from './types/Types';
import paymentHandler from './utils/PaymentHandler';
import commercetoolsApi from './utils/api/CommercetoolsApi';
import MultiMid from './utils/config/MultiMid';

dotenv.config();
const setupExtensionResources = async () => {
  let extensionResources = false;
  try {
    if (process.env.PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL && process.env.PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE && process.env.CT_PROJECT_KEY && process.env.CT_CLIENT_ID && process.env.CT_CLIENT_SECRET && process.env.CT_AUTH_HOST && process.env.CT_API_HOST) {
      await resourceHandler.ensureExtension();
      await resourceHandler.ensureCustomTypes();
      extensionResources = true;
    } else {
      paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncSetupResources', Constants.LOG_ERROR, '', Constants.ERROR_MSG_SETUP_RESOURCES);
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncSetupResources', '', Constants.EXCEPTION_MSG_SETUP_RESOURCES, '', '', '');
  }
  return extensionResources;
};

const createWebhookSubscription = async () => {
  let setCustomObjectResponse;
  let subscriptionResponse;
  let midCredentials: midCredentialsType;
  let subscriptionInformation: subscriptionInformationType;
  let networkTokenMultiMidArray: string[] = [];
  let subscriptionInformationArray: subscriptionInformationType[] = [];
  try {
    if (process.env.PAYMENT_GATEWAY_NETWORK_TOKEN_MULTI_MID) {
      networkTokenMultiMidArray = process.env.PAYMENT_GATEWAY_NETWORK_TOKEN_MULTI_MID.split(',');
    }
    if (0 < networkTokenMultiMidArray.length) {
      for (let mid of networkTokenMultiMidArray) {
        if (process.env.PAYMENT_GATEWAY_MERCHANT_ID === mid) {
          mid = '';
        }
        midCredentials = await MultiMid.getMidCredentials(mid);
        subscriptionResponse = await paymentHandler.webhookSubscriptionHandler(midCredentials);
        if (subscriptionResponse?.subscriptionPresent) {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncCreateWebhookSubscription', Constants.LOG_INFO, '', `Subcription already present for mid ${mid}`);
          if (!networkTokenMultiMidArray.includes(subscriptionResponse?.merchantId)) {
            return;
          }
        }
        if (Constants.HTTP_SUCCESS_STATUS_CODE === subscriptionResponse?.httpCode && subscriptionResponse?.key && subscriptionResponse.keyId && subscriptionResponse?.keyExpiration && subscriptionResponse?.subscriptionId && subscriptionResponse.merchantId) {
          subscriptionInformation = {
            merchantId: subscriptionResponse.merchantId,
            key: subscriptionResponse.key,
            keyId: subscriptionResponse.keyId,
            keyExpiration: subscriptionResponse.keyExpiration,
            subscriptionId: subscriptionResponse.subscriptionId,
          };
          subscriptionInformationArray.push(subscriptionInformation);
        }
      }
    }
    if (subscriptionInformationArray.length > 0) {
      const setCustomObjectRequest = {
        container: Constants.CUSTOM_OBJECT_CONTAINER,
        key: Constants.CUSTOM_OBJECT_KEY,
        value: subscriptionInformationArray,
      };
      setCustomObjectResponse = await commercetoolsApi.createCTCustomObject(setCustomObjectRequest);
      if (Constants.HTTP_OK_STATUS_CODE === setCustomObjectResponse?.statusCode) {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncCreateWebhookSubscription', Constants.LOG_INFO, '', JSON.stringify(setCustomObjectResponse));
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncCreateWebhookSubscription', Constants.LOG_INFO, '', JSON.stringify(setCustomObjectResponse));
        return;
      }
    }
  } catch (exception) {
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncCreateWebhookSubscription', '', exception, '', '', '');
    return;
  }
  return setCustomObjectResponse;
};

export { setupExtensionResources, createWebhookSubscription };
