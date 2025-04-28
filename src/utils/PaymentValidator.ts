import { Payment, Transaction } from "@commercetools/platform-sdk";

import { Constants } from "../constants/paymentConstants";
import { PaymentTransactionType, ResponseType } from "../types/Types";

import paymentUtils from "./PaymentUtils";

/**
 * Sets a value in the target object based on the source object and validates its type.
 *
 * @param {any} targetObject - The object to set the value in.
 * @param {string} fieldName - The field name to set the value for.
 * @param {any} sourceObj - The source object from which to get the value.
 * @param {string} sourcePath - The path in the source object to retrieve the value.
 * @param {string} expectedType - The expected type of the value.
 * @param {boolean} isActionValidation - Indicates if action validation is needed.
 * @returns {void}
 */
const setObjectValue = (targetObject: any, fieldName: string, sourceObj: any, sourcePath: string, expectedType: string, isActionValidation: boolean) => {
    let isValidType = false;
    const value = sourcePath ? sourcePath.split('.').reduce((acc: any, part: string | number) => acc && acc[part], sourceObj) : sourceObj;
    if (value) {
        switch (expectedType) {
            case Constants.STR_STRING:
                isValidType = typeof value === Constants.STR_STRING;
                break;
            case Constants.STR_NUMBER:
                isValidType = typeof value === 'number';
                break;
            case 'boolean':
                isValidType = typeof value === 'boolean';
                break;
            case Constants.STR_OBJECT:
                isValidType = typeof value === Constants.STR_OBJECT;
                break;
            case Constants.STR_ARRAY:
                isValidType = Array.isArray(value);
                break;
            default:
                isValidType = false;
                break;
        }
        if (isValidType) {
            if (Array.isArray(targetObject)) {
                if (isActionValidation) {
                    targetObject.push(...paymentUtils.setCustomFieldMapper({ [fieldName]: value }));
                } else if (Array.isArray(sourceObj)) {
                    targetObject.push(...sourceObj);
                } else {
                    targetObject.push(sourceObj);
                }
            } else {
                targetObject[fieldName] = value;
            }
        }
    }
};

/**
 * Validates actions from the source array and pushes them to the target array.
 *
 * @param {any[]} sourceArray - The array of actions to validate.
 * @param {any[]} targetArray - The array to push valid actions into.
 * @returns {void}
 */
const validateActionsAndPush = (sourceArray: any[], targetArray: any[]) => {
    if (sourceArray && Array.isArray(sourceArray) && sourceArray.length && targetArray && Array.isArray(targetArray)) {
        sourceArray.forEach((action: any) => {
            targetArray.push(action);
        })
    }
};

/**
 * Checks if the update service response is valid.
 *
 * @param {any} updateServiceResponse - The response object to validate.
 * @returns {boolean} True if valid, otherwise false.
 */
const isValidUpdateServiceResponse = (updateServiceResponse: any): boolean => {
    let validUpdateServiceResponseObject = false;
    if (updateServiceResponse && Constants.HTTP_OK_STATUS_CODE === updateServiceResponse?.httpCode && updateServiceResponse?.card && 0 < Object.keys(updateServiceResponse.card).length &&
        updateServiceResponse?.card?.expirationMonth &&
        updateServiceResponse?.card?.expirationYear) {
        validUpdateServiceResponseObject = true;
    }
    return validUpdateServiceResponseObject;
};

/**
 * Checks if the add token response is valid.
 *
 * @param {Partial<ResponseType>} addTokenResponse - The response object to validate.
 * @returns {boolean} True if valid, otherwise false.
 */
const isValidAddTokenResponse = (addTokenResponse: Partial<ResponseType>): boolean => {
    let validAddTokenResponseObject = false;
    if (Constants.HTTP_SUCCESS_STATUS_CODE === addTokenResponse.httpCode &&
        Constants.API_STATUS_AUTHORIZED === addTokenResponse.status &&
        addTokenResponse?.data?.tokenInformation &&
        addTokenResponse?.data?.tokenInformation?.paymentInstrument &&
        addTokenResponse?.data?.tokenInformation?.instrumentIdentifier &&
        addTokenResponse?.data?.tokenInformation?.paymentInstrument?.id.length) {
        validAddTokenResponseObject = true;
    }
    return validAddTokenResponseObject;
};

/**
 * Validates rate limiter input from environment variables.
 *
 * @returns {boolean} True if valid, otherwise false.
 */
const isValidRateLimiterInput = (): boolean => {
    if (Number.isInteger(Number(process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME)) &&
        0 < Number(process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME) &&
        Number.isInteger(Number(process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE)) &&
        0 < Number(process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE))
        return true;
    return false;
};

/**
 * Determines if tokens should be processed based on the given conditions.
 *
 * @param {boolean} isError - Indicates if an error occurred.
 * @param {any} paymentResponse - The payment response object.
 * @param {Payment} updatePaymentObj - The payment update object.
 * @returns {boolean} True if tokens should be processed, otherwise false.
 */
const shouldProcessTokens = (isError: boolean, paymentResponse: any, updatePaymentObj: Payment): boolean => {
    const paymentMethod = updatePaymentObj?.paymentMethodInfo.method;
    if (!isError &&
        updatePaymentObj?.customer?.id &&
        Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode &&
        Constants.API_STATUS_AUTHORIZED === paymentResponse.status &&
        (Constants.CREDIT_CARD === paymentMethod || Constants.CC_PAYER_AUTHENTICATION === paymentMethod) &&
        (undefined === updatePaymentObj?.custom?.fields?.isv_savedToken || null === updatePaymentObj.custom?.fields?.isv_savedToken || '' === updatePaymentObj?.custom?.fields?.isv_savedToken) &&
        updatePaymentObj?.custom?.fields?.isv_tokenAlias) {
        return true;
    }
    return false;
};

/**
 * Determines if failed tokens should be processed based on the given conditions.
 *
 * @param {any} paymentResponse - The payment response object.
 * @param {Payment} updatePaymentObj - The payment update object.
 * @returns {boolean} True if failed tokens should be processed, otherwise false.
 */
const shouldProcessFailedTokens = (paymentResponse: any, updatePaymentObj: Payment): boolean => {
    const paymentMethod = updatePaymentObj?.paymentMethodInfo.method;
    const customFields = updatePaymentObj?.custom?.fields;
    if (
        updatePaymentObj?.customer?.id &&
        customFields &&
        Constants.API_STATUS_PENDING_AUTHENTICATION !== paymentResponse.status &&
        Constants.API_STATUS_CUSTOMER_AUTHENTICATION_REQUIRED !== paymentResponse.status &&
        (Constants.CREDIT_CARD === paymentMethod || Constants.CC_PAYER_AUTHENTICATION === paymentMethod) &&
        (undefined === customFields?.isv_savedToken || null === customFields?.isv_savedToken || '' === customFields?.isv_savedToken) &&
        customFields?.isv_tokenAlias
    ) return true;
    return false
};

/**
 * Checks if the transaction is valid.
 *
 * @param {Payment} updatePaymentObj - The payment update object.
 * @param {Partial<PaymentTransactionType>} updateTransactions - The transaction update object.
 * @returns {boolean} True if valid, otherwise false.
 */
const isValidTransaction = (updatePaymentObj: Payment, updateTransactions: Partial<PaymentTransactionType>): boolean => {
    if (updatePaymentObj
        && updateTransactions
        && updateTransactions?.amount
        && 'number' === typeof updateTransactions.amount.centAmount
        && 'number' === typeof updateTransactions.amount.fractionDigits
        && undefined !== updateTransactions?.amount?.fractionDigits
        && 0 <= updateTransactions.amount.fractionDigits && updateTransactions.amount?.type) {
        return true;
    }
    return false;
};

/**
 * Checks if the charge transaction is successful.
 *
 * @param {Partial<PaymentTransactionType>} transaction - The transaction object to check.
 * @returns {boolean} True if successful, otherwise false.
 */
const isSuccessFulChargeTransaction = (transaction: Transaction): boolean => {
    if (Constants.CT_TRANSACTION_TYPE_CHARGE === transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS === transaction.state && transaction?.amount && transaction?.interactionId && transaction?.id) return true;
    return false
};

/**
 * Validates transaction summaries against specific conditions.
 *
 * @param {any} transactionDetail - The transaction detail object.
 * @param {Payment} updatePaymentObj - The payment update object.
 * @param {number} retryCount - The number of retry attempts.
 * @returns {boolean} True if valid, otherwise false.
 */
const isValidTransactionSummaries = (transactionDetail: any, updatePaymentObj: Payment, retryCount: number): boolean => {
    if (transactionDetail &&
        Constants.HTTP_SUCCESS_STATUS_CODE === transactionDetail.httpCode &&
        transactionDetail?.data?._embedded?.transactionSummaries &&
        ((Constants.CC_PAYER_AUTHENTICATION === updatePaymentObj.paymentMethodInfo.method && 2 <= transactionDetail?.data?.totalCount
            && Constants.PAYMENT_GATEWAY_TRANSACTION_SUMMARIES_MAX_RETRY === retryCount) ||
            (1 === transactionDetail?.data?.totalCount && updatePaymentObj?.custom?.fields?.isv_saleEnabled) ||
            (1 < transactionDetail?.data?.totalCount && Constants.CC_PAYER_AUTHENTICATION !== updatePaymentObj.paymentMethodInfo.method))) {
        return true;
    }
    return false;
};

/**
 * Checks if consumer authentication is required based on the payment response.
 *
 * @param {any} paymentResponse - The payment response object.
 * @returns {boolean} True if authentication is required, otherwise false.
 */
const isConsumerAuthenticationRequired = (paymentResponse: any) => {
    return (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse?.httpCode &&
        paymentResponse?.data?.errorInformation &&
        0 < paymentResponse?.data?.errorInformation.length &&
        Constants.API_STATUS_CUSTOMER_AUTHENTICATION_REQUIRED === paymentResponse.data.errorInformation?.reason)
}

/**
 * Validates the card response.
 *
 * @param {any} cardResponse - The card response object.
 * @returns {boolean} True if valid, otherwise false.
 */
const isValidCardResponse = (cardResponse: any): boolean => {
    return (cardResponse.httpCode === Constants.HTTP_SUCCESS_STATUS_CODE &&
        cardResponse.status === Constants.API_STATUS_AUTHORIZED &&
        0 < cardResponse?.data?.tokenInformation?.paymentInstrument?.id.length);
};

/**
 * Validates pending authentication response based on provided parameters.
 *
 * @param {number} httpCode - The HTTP status code.
 * @param {string} status - The status string.
 * @param {any} data - The response data.
 * @param {any} consumerAuthenticationInformation - Authentication information.
 * @returns {boolean} True if valid, otherwise false.
 */
const isValidPendingAuthenticationResponse = (httpCode: number, status: string, data: any, consumerAuthenticationInformation: any) => {
    return (Constants.HTTP_SUCCESS_STATUS_CODE === httpCode &&
        Constants.API_STATUS_PENDING_AUTHENTICATION === status &&
        data &&
        0 < Object.keys(data).length &&
        consumerAuthenticationInformation &&
        0 < Object.keys(consumerAuthenticationInformation).length)
};

/**
 * Validates if the given URL is whitelisted.
 *
 * @param {string} url - The URL to validate.
 * @returns {boolean} True if whitelisted, otherwise false.
 */
const validateWhiteListEndPoints = (url: string): boolean => {
    let urlValidated = false;
    if (Constants.WHITE_LIST_ENDPOINTS.includes(url)) {
        urlValidated = true;
    }
    return urlValidated;
};

export default {
    setObjectValue,
    validateActionsAndPush,
    isValidUpdateServiceResponse,
    isValidAddTokenResponse,
    isValidRateLimiterInput,
    shouldProcessTokens,
    shouldProcessFailedTokens,
    isValidTransaction,
    isSuccessFulChargeTransaction,
    isValidTransactionSummaries,
    isConsumerAuthenticationRequired,
    isValidCardResponse,
    isValidPendingAuthenticationResponse,
    validateWhiteListEndPoints
};