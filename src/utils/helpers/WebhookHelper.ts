import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from "../../constants/paymentConstants";
import createWebhookSubscription from '../../service/payment/CreateWebhookSubscription';
import deleteWebhookSubscriptionService from '../../service/payment/DeleteWebhookSubscriptionService';
import getWebhookSubscriptionDetails from '../../service/payment/GetWebhookSubscriptionDetails';
import keyGeneration from '../../service/payment/KeyGeneration';
import { KeyResponse, MidCredentialsType, WebhookVerificationObject } from '../../types/Types';
import paymentUtils from "../PaymentUtils";
import commercetoolsApi from '../api/CommercetoolsApi';

/**
 * Initializes a subscription response object with default values.
 * 
 * @returns {Object} An object representing the initial subscription response.
 */
const initializeSubscriptionResponseObject = () => ({
    httpCode: 0,
    merchantId: '',
    key: '',
    keyId: '',
    keyExpiration: '',
    webhookId: '',
    subscriptionPresent: false

});

/**
 * Handles the response for webhook key generation and updates the subscription response object.
 * 
 * @param {KeyResponse} responseForKeyGeneration - The response object from key generation.
 * @param {Object} createSubscriptionResponseObject - The object to be updated with key generation data.
 */
const handleWebhookKeyGenerationResponse = (responseForKeyGeneration: KeyResponse, createSubscriptionResponseObject: any) => {
    if (Constants.HTTP_SUCCESS_STATUS_CODE === responseForKeyGeneration?.httpCode) {
        Object.assign(createSubscriptionResponseObject, {
            httpCode: responseForKeyGeneration?.httpCode,
            merchantId: responseForKeyGeneration.organizationId,
            key: responseForKeyGeneration.key,
            keyId: responseForKeyGeneration.keyId,
            keyExpiration: responseForKeyGeneration.keyExpiration
        })
    } else {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_WEBHOOK_KEY_GENERATION_RESPONSE, Constants.LOG_DEBUG, '', JSON.stringify(responseForKeyGeneration));
    }
};

/**
 * Handles an existing subscription by updating the response object with relevant details.
 * 
 * @param {WebhookVerificationObject} subscriptionObject - The existing subscription details.
 * @param {Object} createSubscriptionResponseObject - The object to be updated with subscription data.
 * @returns {Object} The updated subscription response object.
 */
const handleExistingSubscription = (subscriptionObject: WebhookVerificationObject, createSubscriptionResponseObject: any) => {
    Object.assign(createSubscriptionResponseObject, {
        subscriptionPresent: true,
        key: subscriptionObject.key,
        keyId: subscriptionObject.keyId,
        keyExpiration: subscriptionObject.keyExpiration,
        merchantId: subscriptionObject.merchantId,
        webhookId: subscriptionObject.webhookId
    });
    paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_EXISTING_SUBSCRIPTION, Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_SUBSCRIPTION_ALREADY_EXIST);
    return createSubscriptionResponseObject;
};

/**
 * Handles updating the subscription by deleting the existing webhook and creating a new one.
 * 
 * @param {MidCredentialsType} midCredentials - The merchant's credentials for the subscription.
 * @param {string} webhookId - The ID of the existing webhook subscription.
 * @param {Object} createSubscriptionResponseObject - The object to be updated after subscription update.
 */
const handleSubscriptionUpdate = async (midCredentials: MidCredentialsType, webhookId: string, createSubscriptionResponseObject: any) => {
    const deleteWebhookResponse = await deleteWebhookSubscriptionService.deleteWebhookSubscriptionResponse(midCredentials, webhookId);
    if (Constants.HTTP_OK_STATUS_CODE === deleteWebhookResponse?.httpCode) {
        await createNewSubscription(midCredentials, createSubscriptionResponseObject);
    } else {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_SUBSCRIPTION_UPDATE, Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_SUBSCRIPTION_ALREADY_EXIST);
    }
};

/**
 * Creates a new subscription and updates the subscription response object with the webhook ID.
 * 
 * @param {MidCredentialsType} midCredentials - The merchant's credentials for creating the subscription.
 * @param {Object} createSubscriptionResponseObject - The object to be updated with the new subscription data.
 */
const createNewSubscription = async (midCredentials: MidCredentialsType, createSubscriptionResponseObject: any) => {
    const responseForSubscription = await createWebhookSubscription.getCreateWebhookSubscriptionResponse(midCredentials);
    if (responseForSubscription && Constants.HTTP_SUCCESS_STATUS_CODE === responseForSubscription?.httpCode && responseForSubscription?.webhookId) {
        createSubscriptionResponseObject.webhookId = responseForSubscription.webhookId;
    } else {
        createSubscriptionResponseObject.httpCode = responseForSubscription?.httpCode;
        paymentUtils.logData(__filename, FunctionConstant.FUNC_CREATE_NEW_SUBSCRIPTION, Constants.LOG_DEBUG, '', JSON.stringify(responseForSubscription));
    }
};

/**
 * Verifies the presence of webhook subscription.
 * 
 * @param {any} searchSubscriptionResponse - Response from the subscription search.
 * @param {string | undefined} merchantId - Merchant ID.
 * @returns {Promise<any>} - Verification object with subscription details.
 */
const verifySubscription = async (searchSubscriptionResponse: any, merchantId: string | undefined): Promise<WebhookVerificationObject> => {
    let getCustomObjectSubscriptions: any;
    const verificationObject = {
        isSubscribed: false,
        presentInCustomObject: false,
        urlVerified: false,
        webhookId: '',
        key: '',
        keyId: '',
        keyExpiration: '',
        merchantId: '',
    };
    getCustomObjectSubscriptions = await commercetoolsApi.retrieveCustomObjectByContainer(Constants.CUSTOM_OBJECT_CONTAINER);
    if (getCustomObjectSubscriptions?.results) {
        const customObjectWebhookResponse = getCustomObjectSubscriptions?.results[0]?.value?.find((customObject: any) => customObject?.merchantId === merchantId && customObject?.webhookId === searchSubscriptionResponse.webhookId);
        if (searchSubscriptionResponse?.webhookId === customObjectWebhookResponse?.webhookId) {
            verificationObject.presentInCustomObject = true;
            verificationObject.key = customObjectWebhookResponse.key;
            verificationObject.keyId = customObjectWebhookResponse.keyId;
            verificationObject.keyExpiration = customObjectWebhookResponse.keyExpiration;
            verificationObject.webhookId = customObjectWebhookResponse.webhookId;
            verificationObject.merchantId = customObjectWebhookResponse.merchantId;
        }
    }
    if (searchSubscriptionResponse && Constants.HTTP_OK_STATUS_CODE === searchSubscriptionResponse.httpCode && searchSubscriptionResponse?.webhookId && searchSubscriptionResponse?.webhookUrl) {
        const subscribedUrl = process.env.PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL + ':' + Constants.PAYMENT_GATEWAY_WEBHOOK_PORT + Constants.PAYMENT_GATEWAY_WEBHOOK_ENDPOINT;
        verificationObject.isSubscribed = true;
        if (subscribedUrl === searchSubscriptionResponse?.webhookUrl) {
            verificationObject.urlVerified = true;
        }
        verificationObject.webhookId = searchSubscriptionResponse?.webhookId;
    }
    return verificationObject;
};

/**
 * Main function to handle the webhook subscription process for a merchant.
 * 
 * @param {MidCredentialsType} midCredentials - The merchant's credentials required for webhook subscription.
 * @returns {Promise<Object>} - The subscription response object with updated details.
 */
const handleWebhookSubscription = async (midCredentials: MidCredentialsType) => {
    let createSubscriptionResponseObject = initializeSubscriptionResponseObject();
    if (midCredentials?.merchantId && midCredentials?.merchantKeyId && midCredentials?.merchantSecretKey && process.env.PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL) {
        const [responseForKeyGeneration,responseForGetSubscription] = await Promise.all([
            keyGeneration.getKeyGenerationResponse(midCredentials),
            getWebhookSubscriptionDetails.getWebhookSubscriptionResponse(midCredentials)
        ]);
        handleWebhookKeyGenerationResponse(responseForKeyGeneration, createSubscriptionResponseObject);
        if (responseForGetSubscription) {
            const subscriptionObject = await verifySubscription(responseForGetSubscription, midCredentials.merchantId);
            if (subscriptionObject.isSubscribed && subscriptionObject.presentInCustomObject && subscriptionObject.urlVerified) {
                createSubscriptionResponseObject = handleExistingSubscription(subscriptionObject, createSubscriptionResponseObject);
            }
            if (subscriptionObject.isSubscribed && subscriptionObject.webhookId && !subscriptionObject.presentInCustomObject) {
                await handleSubscriptionUpdate(midCredentials, subscriptionObject.webhookId, createSubscriptionResponseObject);
            } else {
                await createNewSubscription(midCredentials, createSubscriptionResponseObject);
            }
        }
    }
    return createSubscriptionResponseObject;
};

export default {
    handleWebhookSubscription,
    verifySubscription
}