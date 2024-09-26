import { Constants } from "../constants/constants";
import { PaymentTransactionType, PaymentType, ResponseType } from "../types/Types";

import paymentUtils from "./PaymentUtils";

const setObjectValue = (targetObject: any, fieldName: string, sourceObj: any, sourcePath: string, expectedType: string, isActionValidation: boolean) => {
    let isValidType = false;
    try {
        const value = sourcePath ? sourcePath.split('.').reduce((acc: any, part: string | number) => acc && acc[part], sourceObj) : sourceObj;
        if (value) {
            switch (expectedType) {
                case Constants.STR_STRING:
                    isValidType = typeof value === Constants.STR_STRING;
                    break;
                case 'number':
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
    } catch (exception) {
        paymentUtils.logExceptionData(__filename, 'FuncSetObjectValue', '', exception, '', '', '');
    }
}

const validateActionsAndPush = (sourceArray: any[], targetArray: any[]) => {
    if (sourceArray && Array.isArray(sourceArray) && sourceArray.length && targetArray && Array.isArray(targetArray)) {
        sourceArray.forEach((action: any) => {
            targetArray.push(action);
        })
    }
}

const isValidUpdateServiceResponse = (updateServiceResponse: any): boolean => {
    let validUpdateServiceResponseObject = false;
    if (updateServiceResponse && Constants.HTTP_OK_STATUS_CODE === updateServiceResponse?.httpCode && updateServiceResponse?.card && 0 < Object.keys(updateServiceResponse.card).length &&
        updateServiceResponse?.card?.expirationMonth &&
        updateServiceResponse?.card?.expirationYear) {
        validUpdateServiceResponseObject = true;
    }
    return validUpdateServiceResponseObject;
}

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
}

const isValidRateLimiterInput = (): boolean => {
    if (Number.isInteger(Number(process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME)) &&
        0 < Number(process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME) &&
        Number.isInteger(Number(process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE)) &&
        0 < Number(process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE))
        return true;
    return false;
}

const shouldProcessTokens = (isError: boolean, paymentResponse: any, updatePaymentObj: PaymentType): boolean => {
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
}

const shouldProcessFailedTokens = (paymentResponse: any, updatePaymentObj: PaymentType): boolean => {
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
}

const isValidTransaction = (updatePaymentObj: PaymentType, updateTransactions: Partial<PaymentTransactionType>): boolean => {
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
}

const isSuccessFulChargeTransaction = (transaction: Partial<PaymentTransactionType>): boolean => {
    if (Constants.CT_TRANSACTION_TYPE_CHARGE === transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS === transaction.state && transaction?.amount && transaction?.interactionId && transaction?.id) return true;
    return false
}

const isValidTransactionSummaries = (transactionDetail: any, updatePaymentObj: PaymentType, retryCount: number): boolean => {
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
}

const isConsumerAuthenticationRequired = (paymentResponse: any) => {
    return (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse?.httpCode &&
        paymentResponse?.data?.errorInformation &&
        0 < paymentResponse?.data?.errorInformation.length &&
        Constants.API_STATUS_CUSTOMER_AUTHENTICATION_REQUIRED === paymentResponse.data.errorInformation?.reason)
}

const isValidCardResponse = (cardResponse: any): boolean => {
    return (cardResponse.httpCode === Constants.HTTP_SUCCESS_STATUS_CODE &&
        cardResponse.status === Constants.API_STATUS_AUTHORIZED &&
        0 < cardResponse?.data?.tokenInformation?.paymentInstrument?.id.length);
}

const isValidPendinAuthenticationResponse = (httpCode: number, status: string, data: any, consumerAuthenticationInformation: any) => {
    return (Constants.HTTP_SUCCESS_STATUS_CODE === httpCode &&
        Constants.API_STATUS_PENDING_AUTHENTICATION === status &&
        data &&
        0 < Object.keys(data).length &&
        consumerAuthenticationInformation &&
        0 < Object.keys(consumerAuthenticationInformation).length)
}

const validateWhiteListEndPoints = (url: string): boolean => {
    let urlValidated = false;
    if (Constants.WHITE_LIST_ENDPOINTS.includes(url)) {
        urlValidated = true;
    }
    return urlValidated;
}

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
    isValidPendinAuthenticationResponse,
    validateWhiteListEndPoints
}