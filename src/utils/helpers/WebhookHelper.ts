import http from 'http';
import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from "../../constants/paymentConstants";
import restApi from 'cybersource-rest-client';
import createWebhookSubscription from '../../service/payment/CreateWebhookSubscription';
import deleteWebhookSubscriptionService from '../../service/payment/DeleteWebhookSubscriptionService';
import getWebhookSubscriptionDetails from '../../service/payment/GetWebhookSubscriptionDetails';
import keyGeneration from '../../service/payment/KeyGeneration';
import prepareFields from '../../requestBuilder/PrepareFields';
import { KeyResponse, MidCredentialsType, NotificationBodyType, WebhookVerificationObject } from '../../types/Types';
import { AuthenticationError, errorHandler } from '../ErrorHandler';
import paymentUtils from "../PaymentUtils";
import commercetoolsApi from '../api/CommercetoolsApi';
import isvApi from '../api/IsvApi';
import authenticationHelper from './AuthenticationHelper';

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
    subscriptionPresent: false,
    decisionManagerWebhook: null as any,
    unifiedCheckoutWebhook: null as any,
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
    }
};

/**
 * Creates a new subscription and updates the subscription response object with the webhook ID.
 *
 * @param {MidCredentialsType} midCredentials - The merchant's credentials for creating the subscription.
 * @param {Object} createSubscriptionResponseObject - The object to be updated with the new subscription data.
 */
const createDecisionManagerSubscription = async (midCredentials: MidCredentialsType, createSubscriptionResponseObject?: any) => {
    const responseForSubscription = await createWebhookSubscription.getCreateDecisionManagerWebhookSubscriptionResponse(midCredentials);
    if (responseForSubscription && Constants.HTTP_SUCCESS_STATUS_CODE === responseForSubscription?.httpCode && responseForSubscription?.webhookId) {
        if (createSubscriptionResponseObject) {
            createSubscriptionResponseObject.decisionManagerWebhook = responseForSubscription;
        }
    } else {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_CREATE_NEW_SUBSCRIPTION, Constants.LOG_WARN, '', 'Create decision manager webhook subscription failed. Response: ' + JSON.stringify(responseForSubscription));
    }
    return responseForSubscription;
};

const createUCWebhookSubscription = async (midCredentials: MidCredentialsType, createSubscriptionResponseObject?: any) => {
    const responseForUCSubscription = await createWebhookSubscription.getCreateUCWebhookSubscriptionResponse(midCredentials);
    if (responseForUCSubscription && Constants.HTTP_SUCCESS_STATUS_CODE === responseForUCSubscription?.httpCode && responseForUCSubscription?.webhookId) {
        if (createSubscriptionResponseObject) {
            createSubscriptionResponseObject.unifiedCheckoutWebhook = responseForUCSubscription;
        }
    } else {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_CREATE_NEW_SUBSCRIPTION, Constants.LOG_WARN, '', 'Create UC webhook subscription failed. Response: ' + JSON.stringify(responseForUCSubscription));
    }
    return responseForUCSubscription;
};


/**
 * Verifies the presence of webhook subscription.
 * 
 * @param {any} searchSubscriptionResponse - Response from the subscription search.
 * @param {string | undefined} merchantId - Merchant ID.
 * @param {string} webhookType - Type of webhook (networkToken, decisionManager, unifiedCheckout).
 * @returns {Promise<any>} - Verification object with subscription details.
 */

const verifySubscription = async (searchSubscriptionResponse: any, merchantId: string | undefined, webhookType: string = 'networkToken'): Promise<WebhookVerificationObject> => {
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
        const merchantEntry = getCustomObjectSubscriptions?.results[0]?.value?.find(
            (item: any) => item?.merchantId === merchantId
        );
        const storedWebhook = merchantEntry?.[webhookType];
        if (storedWebhook && storedWebhook.webhookId === searchSubscriptionResponse?.webhookId && storedWebhook.merchantId === merchantId) {
            verificationObject.presentInCustomObject = true;
            verificationObject.key = storedWebhook.key;
            verificationObject.keyId = storedWebhook.keyId;
            verificationObject.keyExpiration = storedWebhook.keyExpiration;
            verificationObject.webhookId = storedWebhook.webhookId;
            verificationObject.merchantId = storedWebhook.merchantId;
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
const verifyFraudWebhookSubscription = async (searchSubscriptionResponse: any, merchantId: string | undefined, webhookType: string = 'decisionManager'): Promise<WebhookVerificationObject> => {
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
        const merchantEntry = getCustomObjectSubscriptions?.results[0]?.value?.find(
            (item: any) => item?.merchantId === merchantId
        );
        const storedWebhook = merchantEntry?.[webhookType];
        if (storedWebhook && storedWebhook.webhookId === searchSubscriptionResponse?.webhookId && storedWebhook.merchantId === merchantId) {
            verificationObject.presentInCustomObject = true;
            verificationObject.key = storedWebhook.key;
            verificationObject.keyId = storedWebhook.keyId;
            verificationObject.keyExpiration = storedWebhook.keyExpiration;
            verificationObject.webhookId = storedWebhook.webhookId;
            verificationObject.merchantId = storedWebhook.merchantId;
        }
    }

    if (searchSubscriptionResponse && Constants.HTTP_OK_STATUS_CODE === searchSubscriptionResponse.httpCode && searchSubscriptionResponse?.webhookId && searchSubscriptionResponse?.webhookUrl) {

        const subscribedUrl = process.env.PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL + ':' + Constants.PAYMENT_GATEWAY_WEBHOOK_PORT + Constants.PAYMENT_GATEWAY_FRAUD_WEBHOOK_ENDPOINT;

        verificationObject.isSubscribed = true;
        if (subscribedUrl === searchSubscriptionResponse?.webhookUrl) {
            verificationObject.urlVerified = true;
        }
        verificationObject.webhookId = searchSubscriptionResponse?.webhookId;
        verificationObject.merchantId = merchantId || '';
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
    try {
        const hasValidCredentials = !!(midCredentials?.merchantId && midCredentials?.merchantKeyId && midCredentials?.merchantSecretKey);
        const hasDestinationUrl = !!process.env.PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL;
        if (hasValidCredentials && hasDestinationUrl) {
            const responseForKeyGeneration = await keyGeneration.getKeyGenerationResponse(midCredentials);
            handleWebhookKeyGenerationResponse(responseForKeyGeneration, createSubscriptionResponseObject);
            const responseForDecisionManagerSubscription = await getWebhookSubscriptionDetails.getWebhookSubscriptionResponse(midCredentials, 'decisionManager');
            const decisionManagerSubscriptionObject = await verifyFraudWebhookSubscription(responseForDecisionManagerSubscription, midCredentials.merchantId, 'decisionManager');
            if (decisionManagerSubscriptionObject.isSubscribed && decisionManagerSubscriptionObject.presentInCustomObject && decisionManagerSubscriptionObject.urlVerified) {
                const decisionManagerResponseData = {
                    httpCode: Constants.HTTP_OK_STATUS_CODE,
                    webhookId: decisionManagerSubscriptionObject.webhookId,
                    key: decisionManagerSubscriptionObject.key,
                    keyId: decisionManagerSubscriptionObject.keyId,
                    keyExpiration: decisionManagerSubscriptionObject.keyExpiration,
                    merchantId: decisionManagerSubscriptionObject.merchantId
                };
                createSubscriptionResponseObject.decisionManagerWebhook = decisionManagerResponseData;
            } else if (decisionManagerSubscriptionObject.isSubscribed && decisionManagerSubscriptionObject.webhookId) {
                const deleteWebhookResponse = await deleteWebhookSubscriptionService.deleteWebhookSubscriptionResponse(midCredentials, decisionManagerSubscriptionObject.webhookId);
                if (Constants.HTTP_OK_STATUS_CODE === deleteWebhookResponse?.httpCode) {
                    await createDecisionManagerSubscription(midCredentials, createSubscriptionResponseObject);
                }
            } else {
                await createDecisionManagerSubscription(midCredentials, createSubscriptionResponseObject);
            }
    } else {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_WEBHOOK_SUBSCRIPTION, Constants.LOG_WARN, '', 'Skipping webhook subscription flow due to missing prerequisites. hasValidCredentials=' + hasValidCredentials + ', hasDestinationUrl=' + hasDestinationUrl);
    }
} catch (error) {
    errorHandler.logError(new AuthenticationError(CustomMessages.ERROR_MSG_PROCESSING_SUBSCRIPTION, error, FunctionConstant.FUNC_HANDLE_WEBHOOK_SUBSCRIPTION), __filename, '');
}
const hasValidCredentialsForUC = !!(midCredentials?.merchantId && midCredentials?.merchantKeyId && midCredentials?.merchantSecretKey);
if (hasValidCredentialsForUC) {
    try {
        const responseForUcSubscription = await getWebhookSubscriptionDetails.getWebhookSubscriptionResponse(midCredentials, 'unifiedCheckout');
        const ucSubscriptionObject = await verifySubscription(responseForUcSubscription, midCredentials.merchantId, 'unifiedCheckout');
        if (ucSubscriptionObject.isSubscribed && ucSubscriptionObject.presentInCustomObject && ucSubscriptionObject.urlVerified) {
            createSubscriptionResponseObject.unifiedCheckoutWebhook = {
                httpCode: Constants.HTTP_OK_STATUS_CODE,
                webhookId: ucSubscriptionObject.webhookId,
                key: ucSubscriptionObject.key,
                keyId: ucSubscriptionObject.keyId,
                keyExpiration: ucSubscriptionObject.keyExpiration,
                merchantId: ucSubscriptionObject.merchantId
            };
        } else if (ucSubscriptionObject.isSubscribed && ucSubscriptionObject.webhookId) {
            const deleteWebhookResponse = await deleteWebhookSubscriptionService.deleteWebhookSubscriptionResponse(midCredentials, ucSubscriptionObject.webhookId);
            if (Constants.HTTP_OK_STATUS_CODE === deleteWebhookResponse?.httpCode) {
                await createUCWebhookSubscription(midCredentials, createSubscriptionResponseObject);
            }
        } else {
            await createUCWebhookSubscription(midCredentials, createSubscriptionResponseObject);
        }
    } catch (ucError) {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_WEBHOOK_SUBSCRIPTION, Constants.LOG_ERROR, '', '[WebhookHelper] Error creating UC webhook subscription: ' + (ucError instanceof Error ? ucError.message : String(ucError)));
    }
} else {
    paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_WEBHOOK_SUBSCRIPTION, Constants.LOG_WARN, '', 'Skipping UC webhook subscription due to missing credentials');
}

return createSubscriptionResponseObject;
};

/**
 * Activates the Unified Checkout webhook for a given merchant.
 * 
 * Retrieves the UC webhook ID from Commercetools custom object and
 * uses the CyberSource SDK to update its status to ACTIVE.
 * Errors during activation do not fail the capture context generation.
 * 
 * @param {string} merchantId - The merchant ID to activate webhook for
 * @returns {Promise<boolean>} - True if activation successful, false otherwise
 */
const activateUnifiedCheckoutWebhookStatus = async (merchantId: string): Promise<boolean> => {
    try {
        if (!merchantId) {
            paymentUtils.logData(__filename, 'activateUnifiedCheckoutWebhookStatus', Constants.LOG_WARN, '', 'Cannot activate UC webhook: merchantId is empty');
            return false;
        }
        const customObjectResponse = await commercetoolsApi.retrieveCustomObjectByContainer(Constants.CUSTOM_OBJECT_CONTAINER);

        if (!customObjectResponse?.results || 0 === customObjectResponse.results.length) {
            paymentUtils.logData(__filename, 'activateUnifiedCheckoutWebhookStatus', Constants.LOG_WARN, '', 'UC webhook custom object not found for merchantId=' + merchantId);
            return false;
        }
        const merchantEntry = customObjectResponse.results[0]?.value?.find(
            (item: any) => item?.merchantId === merchantId
        );
        if (!merchantEntry) {
            paymentUtils.logData(__filename, 'activateUnifiedCheckoutWebhookStatus', Constants.LOG_WARN, '', 'Merchant entry not found in webhook custom object for merchantId=' + merchantId + '. Available merchants: ' + (customObjectResponse.results[0]?.value?.map((item: any) => item?.merchantId).join(', ') || 'NONE'));
            return false;
        }
        const ucWebhook = merchantEntry?.unifiedCheckout;
        const webhookId = ucWebhook?.webhookId;

        if (!webhookId) {
            paymentUtils.logData(__filename, 'activateUnifiedCheckoutWebhookStatus', Constants.LOG_WARN, '', 'UC webhook ID not found in custom object for merchantId=' + merchantId);
            return false;
        }
        const configObject = await prepareFields.getConfigObject('activateUnifiedCheckoutWebhook', null, null, merchantId);

        if (!configObject) {
            paymentUtils.logData(__filename, 'activateUnifiedCheckoutWebhookStatus', Constants.LOG_WARN, '', 'Failed to get config object for webhook activation. merchantId=' + merchantId);
            return false;
        }
        const apiClient = new restApi.ApiClient();
        const statusBody = { status: 'ACTIVE' };

        const activationPromise = new Promise<boolean>((resolve, reject) => {
            isvApi.updateWebhookStatus(apiClient, configObject, webhookId, statusBody, (error: any, data: any, response: any) => {
                if (data || (response && (200 === response.status || 204 === response.status))) {
                    resolve(true);
                } else if (error) {
                    paymentUtils.logData(__filename, 'activateUnifiedCheckoutWebhookStatus', Constants.LOG_WARN, '', 'Webhook activation failed. Error status=' + error.status + ', body=' + paymentUtils.maskData(JSON.stringify(response?.body || error)));
                    reject(false);
                } else {
                    paymentUtils.logData(__filename, 'activateUnifiedCheckoutWebhookStatus', Constants.LOG_WARN, '', 'Webhook activation returned no data and no error. Response=' + paymentUtils.maskData(JSON.stringify(response)));
                    reject(false);
                }
            });
        }).catch((error) => {
            return error;
        });

        const timeoutPromise = new Promise<boolean>((resolve) => {
            setTimeout(() => {
                resolve(false);
            }, 15000);
        });

        const result = await Promise.race([activationPromise, timeoutPromise]);
        return result;

    } catch (exception) {
        paymentUtils.logData(__filename, 'activateUnifiedCheckoutWebhookStatus', Constants.LOG_WARN, '', 'UC webhook activation failed (non-blocking): ' + (exception instanceof Error ? exception.message : String(exception)));
        return false;
    }
};

/**
 * Sanitizes and validates notification data
 * @param {unknown} input - Raw notification data
 * @returns {NotificationBodyType} Sanitized notification body
 */
const sanitizeNotificationData = (input: unknown): NotificationBodyType => {
    return paymentUtils.sanitizeUserInput(input) as NotificationBodyType;
};

/**
 * Decrypts JWE-encrypted notification payload
 * Handles both GCP and non-GCP deployments
 * @param {any} payload - The encrypted or raw payload
 * @param {boolean} isGcp - Whether running on GCP
 * @returns {Promise<{ notificationBody: NotificationBodyType; wasDecrypted: boolean } | null>}
 */
const decryptNotificationPayload = async (
    payload: any,
    isGcp: boolean
): Promise<{ notificationBody: NotificationBodyType; wasDecrypted: boolean } | null> => {
    let notificationBody: NotificationBodyType;
    let wasDecryptedJwe = false;

    try {
        const encData = isGcp
            ? Constants.STR_STRING === typeof payload
                ? payload
                : (payload as any)?.encData
            : payload?.encData;

        const isJwe = Constants.STR_STRING === typeof encData && prepareFields.isJWECompact(encData);

        if (isJwe) {
            const responseMleP12File = process.env.PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_FILE || '';
            const responseMlePassword = process.env.PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_PASSWORD || '';

            if (!responseMleP12File || !responseMlePassword) {
                const deploymentType = isGcp ? 'GCP' : 'non-GCP';
                throw new Error(
                    `[UC Webhook] ${deploymentType}: Response MLE configuration missing (PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_FILE or PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_PASSWORD)`
                );
            }
            const wrappedEncData = JSON.stringify({
                encryptedResponse: encData,
            });

            const decryptedPayload = await paymentUtils.decryptResponseMlePayload(wrappedEncData, responseMleP12File, responseMlePassword, 'UC_WEBHOOK');

            if (!decryptedPayload) {
                const deploymentType = isGcp ? 'GCP' : 'non-GCP';
                throw new Error(`[UC Webhook] ${deploymentType}: Response MLE decryption returned empty response`);
            }
            notificationBody = sanitizeNotificationData(JSON.parse(decryptedPayload));
            wasDecryptedJwe = true;
        } else {
            notificationBody = sanitizeNotificationData(isGcp ? payload : payload);
        }

        return { notificationBody, wasDecrypted: wasDecryptedJwe };
    } catch (decryptErr) {
        const deploymentType = isGcp ? 'GCP' : 'non-GCP';
        paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_POST_NET_TOKEN_NOTIFICATION, Constants.LOG_ERROR, '', `[UC Webhook] ${deploymentType} JWE parsing/decryption failed: ${decryptErr instanceof Error ? decryptErr.message : String(decryptErr)}`);
        return null;
    }
};

/**
 * Validates and processes net token notifications
 * Handles both UC order events and signature-based validation
 * @param {NotificationBodyType} notificationBody - The notification data
 * @param {http.IncomingMessage} req - The incoming request
 * @param {http.ServerResponse} res - The server response
 * @param {boolean} wasDecrypted - Whether the payload was JWE-decrypted
 * @returns {Promise<boolean>} True if validation and processing succeeded
 */
const validateAndProcessNetTokenNotification = async (
    notificationBody: NotificationBodyType,
    req: http.IncomingMessage,
    res: http.ServerResponse,
    wasDecrypted: boolean
): Promise<boolean> => {
    let isValidNotification = false;

    const vcSignature = req?.headers['v-c-signature'];
    const isUcOrderEvent = Constants.UC_ORDER_TRANSACTION_RESULT_EVENT === notificationBody?.eventType;

    if (isUcOrderEvent && wasDecrypted && notificationBody) {
        isValidNotification = true;
    } else if (vcSignature && notificationBody) {
        isValidNotification = await authenticationHelper.authenticateNetToken(vcSignature, notificationBody);
    }

    if (!isValidNotification) {
        errorHandler.logError(new AuthenticationError(CustomMessages.ERROR_MSG_SIGNATURE_DOES_NOT_MATCH, '', FunctionConstant.FUNC_AUTHENTICATION), __filename, '');
        res.statusCode = Constants.HTTP_BAD_REQUEST_STATUS_CODE;
        res.end();
    }

    return isValidNotification;
};

/**
 * Handles parsing the request body for non-GCP deployments
 * @param {http.IncomingMessage} req - The incoming request
 * @returns {Promise<any>} Parsed request body
 */
const parseRequestBody = async (req: http.IncomingMessage): Promise<any> => {
    return new Promise((resolve, reject) => {
        let body = '';

        req.on('data', (chunk: { toString: () => string }) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const trimmedBody = body.trim();

                if (prepareFields.isJWECompact(trimmedBody)) {
                    resolve({ encData: trimmedBody });
                } else {
                    resolve(sanitizeNotificationData(JSON.parse(trimmedBody)));
                }
            } catch (err) {
                reject(err);
            }
        });
    });
};

export default {
    handleWebhookSubscription,
    verifySubscription,
    activateUnifiedCheckoutWebhookStatus,
    sanitizeNotificationData,
    decryptNotificationPayload,
    validateAndProcessNetTokenNotification,
    parseRequestBody
}
