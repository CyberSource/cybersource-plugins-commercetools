import crypto from 'crypto';

import { CustomObjectPagedQueryResponse } from '@commercetools/platform-sdk';

import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from '../../constants/paymentConstants';
import { errorHandler, PaymentProcessingError } from '../ErrorHandler';
import paymentUtils from "../PaymentUtils";
import commercetoolsApi from '../api/CommercetoolsApi';

const rateLimitData: { [key: string]: { count: number; firstRequestTime: number } } = {};
/**
 * Encrypts the provided data using AES-GCM encryption.
 * 
 * @param {string} data - The data to be encrypted.
 * @returns {string} - The encrypted data encoded in Base64.
 */
const encryption = (data: string): string => {
    let baseEncodedData = '';
    let encryptionInfo;
    try {
        if (data && process.env.CT_CLIENT_SECRET) {
            const key = process.env.CT_CLIENT_SECRET;
            const iv = crypto.randomBytes(12);
            const cipher = crypto.createCipheriv(Constants.HEADER_ENCRYPTION_ALGORITHM, key, iv);
            encryptionInfo = cipher.update(data, Constants.UNICODE_ENCODING_SYSTEM, Constants.ENCODING_BASE_SIXTY_FOUR);
            encryptionInfo += cipher.final(Constants.ENCODING_BASE_SIXTY_FOUR);
            const authTag = cipher.getAuthTag();
            const encryptStringData = iv.toString(Constants.HEX) + Constants.STRING_FULL_COLON + encryptionInfo.toString() + Constants.STRING_FULL_COLON + authTag.toString(Constants.HEX);
            baseEncodedData = Buffer.from(encryptStringData).toString(Constants.ENCODING_BASE_SIXTY_FOUR);
        }
    } catch (exception: any) {
        if (typeof exception === Constants.STR_OBJECT && exception.message) {
            errorHandler.logError(new PaymentProcessingError(exception.message, exception, FunctionConstant.FUNC_ENCRYPTION), __filename, '');
        } else {
            errorHandler.logError(new PaymentProcessingError('', exception, FunctionConstant.FUNC_ENCRYPTION), __filename, '');
        }
    }
    return baseEncodedData;
};

/**
 * Decrypts the provided encoded credentials using AES-GCM decryption.
 * 
 * @param {string} encodedCredentials - The encoded credentials to be decrypted.
 * @returns {string} - The decrypted data.
 */
const decryption = (encodedCredentials: string): string => {
    let decryptedData = '';
    let dataArray = [];
    try {
        if (encodedCredentials && process.env.CT_CLIENT_SECRET) {
            const data = Buffer.from(encodedCredentials, Constants.ENCODING_BASE_SIXTY_FOUR).toString('ascii');
            dataArray = data.split(Constants.STRING_FULL_COLON);
            const ivBuff = Buffer.from(dataArray[0], Constants.HEX);
            const encryptedData = dataArray[1];
            const authTagBuff = Buffer.from(dataArray[2], Constants.HEX);
            const decipher = crypto.createDecipheriv(Constants.HEADER_ENCRYPTION_ALGORITHM, process.env.CT_CLIENT_SECRET, ivBuff);
            decipher.setAuthTag(authTagBuff);
            decryptedData = decipher.update(encryptedData, Constants.ENCODING_BASE_SIXTY_FOUR, Constants.UNICODE_ENCODING_SYSTEM);
            decryptedData += decipher.final(Constants.UNICODE_ENCODING_SYSTEM);
        }
    } catch (exception: any) {
        if (typeof exception === Constants.STR_OBJECT && exception.message) {
            errorHandler.logError(new PaymentProcessingError(exception.message, exception, FunctionConstant.FUNC_DECRYPTION), __filename, '');
        } else {
            errorHandler.logError(new PaymentProcessingError('', exception, FunctionConstant.FUNC_DECRYPTION), __filename, '');
        }
    }
    return decryptedData;
};

/**
 * Validates the headers in network tokenization webhook notification.
 * 
 * @param {any} signature - The signature string.
 * @param {any} notification - The notification object.
 * @returns {Promise<boolean>} - A promise that resolves with a boolean indicating whether the notification is valid.
 */
const authenticateNetToken = async (signature: any, notification: any): Promise<boolean> => {
    let isValidNotification = false;
    try {
        if (notification && Constants.STR_OBJECT === typeof notification && signature && Constants.STR_STRING === typeof signature) {
            const payloadBody = notification?.payload;
            const signatureInfo = signature.split(';');
            if (Array.isArray(signatureInfo) && 3 === signatureInfo.length) {
                const timeStamp = signatureInfo[0].split('=')[1].trim();
                const keyId = signatureInfo[1].split('=')[1].trim();
                const sign = signatureInfo[2].split('sig=')[1].trim();
                const getCustomObjectSubscriptions: CustomObjectPagedQueryResponse = await commercetoolsApi.retrieveCustomObjectByContainer(Constants.CUSTOM_OBJECT_CONTAINER);
                if (0 < getCustomObjectSubscriptions?.results?.length) {
                    const subscriptionData = await getCustomObjectSubscriptions?.results[0]?.value?.find((customObject: any) => notification?.webhookId === customObject?.webhookId && keyId === customObject?.keyId);
                    if (timeStamp && keyId && sign && payloadBody && subscriptionData?.key) {
                        const payload = `${timeStamp}.${JSON.stringify(payloadBody)}`;
                        const decodedKey = Buffer.from(subscriptionData.key, Constants.ENCODING_BASE_SIXTY_FOUR);
                        const hmac = crypto.createHmac(Constants.ENCODING_SHA_TWO_FIFTY_SIX, decodedKey);
                        const generatedSignature = hmac.update(payload).digest(Constants.ENCODING_BASE_SIXTY_FOUR);
                        if (generatedSignature === sign) {
                            isValidNotification = true;
                        }
                    }
                }
            }
        }
    } catch (exception: any) {
        if (typeof exception === Constants.STR_OBJECT && exception.message) {
            errorHandler.logError(new PaymentProcessingError(exception.message, exception, FunctionConstant.FUNC_AUTHENTICATE_NET_TOKEN), __filename, '');
        } else {
            errorHandler.logError(new PaymentProcessingError('', exception, FunctionConstant.FUNC_AUTHENTICATE_NET_TOKEN), __filename, '');
        }
    }
    return isValidNotification;
};

const rateLimitEndpointAccess = (): boolean => {
    let isEndPointLimitViolated = false;
    const currentTime = Date.now();
    if (!rateLimitData.requests) {
        rateLimitData.requests = {
            count: 1,
            firstRequestTime: currentTime
        };
    } else {
        const requestData = rateLimitData.requests;
        if ((currentTime - requestData.firstRequestTime) > Constants.RATE_LIMIT_TIME_WINDOW) {
            requestData.count = 1;
            requestData.firstRequestTime = currentTime;
        } else {
            requestData.count++;
        }
        if (requestData.count > Constants.MAX_REQUESTS) {
            paymentUtils.logRateLimitException(requestData.count);
            isEndPointLimitViolated = true;
        }
    }
    return isEndPointLimitViolated;
};

export default {
    encryption,
    decryption,
    authenticateNetToken,
    rateLimitEndpointAccess
}