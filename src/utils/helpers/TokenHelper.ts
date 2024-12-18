import { PtsV2PaymentsPost201Response } from 'cybersource-rest-client';

import { Constants } from '../../constants/constants';
import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import { Token } from '../../models/TokenModel';
import getTransientTokenData from '../../service/payment/GetTransientTokenData';
import { ActionResponseType, AddressType, CustomerTokensType, CustomerType, CustomTokenType, PaymentCustomFieldsType, PaymentType } from '../../types/Types';
import paymentActions from '../PaymentActions';
import paymentUtils from '../PaymentUtils';
import paymentValidator from '../PaymentValidator';
import commercetoolsApi from '../api/CommercetoolsApi';

/**
 * Processes a valid card response, updating or creating token data based on the card response.
 * 
 * @param {any} customFields - The custom fields related to the card and customer.
 * @param {any} cardTokens - The current card tokens available.
 * @param {any} cardResponse - The response object from the card processing service.
 * @param {CustomerType} customerObj - The customer object containing relevant customer information.
 * @param {AddressType | null} billToFields - The billing address fields, if available.
 * @returns {Promise<ActionResponseType>} - A promise that resolves to an action response containing updated token actions.
 */
const processValidCardResponse = async (customFields: any, cardTokens: any, cardResponse: any, customerObj: CustomerType, billToFields: AddressType | null): Promise<ActionResponseType> => {
    const { customerTokenId, paymentInstrumentId, instrumentIdentifier } = getTokenIds(cardResponse, cardTokens);
    let finalTokenIndex = -1;
    let existingTokens = customFields?.isv_tokens || [];
    let existingFailedTokens: string[] = customFields?.isv_failedTokens || [];
    const tokenIndex = existingTokens.findIndex((token: any) => {
        const parsedToken = JSON.parse(token);
        return parsedToken.cardNumber === customFields?.isv_maskedPan &&
            parsedToken.value === customerTokenId &&
            parsedToken.instrumentIdentifier === instrumentIdentifier;
    });
    if (0 <= tokenIndex) {
        finalTokenIndex = tokenIndex;
        const parsedTokens = paymentUtils.updateParsedToken(existingTokens[finalTokenIndex], customFields, paymentInstrumentId, customerTokenId, customFields?.isv_addressId, billToFields);
        existingTokens[finalTokenIndex] = JSON.stringify(parsedTokens);
    } else {
        const tokenData = await paymentUtils.createTokenData(customFields, customerObj, paymentInstrumentId, instrumentIdentifier, customerTokenId, billToFields);
        existingTokens.push(JSON.stringify(tokenData));
    }
    return paymentActions.getUpdateTokenActions(existingTokens, existingFailedTokens, false, customerObj, null, customerTokenId);
};

/**
 * Extracts token IDs from the card response and card tokens.
 * 
 * @param {any} cardResponse - The response object from the card processing service.
 * @param {any} cardTokens - The current card tokens available.
 * @returns {Object} - An object containing customerTokenId, paymentInstrumentId, and instrumentIdentifier.
 */
const getTokenIds = (cardResponse: any, cardTokens: any) => {
    const customerTokenId = cardResponse?.data?.tokenInformation?.customer?.id?.length ? cardResponse.data.tokenInformation.customer.id : cardTokens.customerTokenId;
    const paymentInstrumentId = cardResponse.data.tokenInformation.paymentInstrument.id;
    const instrumentIdentifier = cardResponse.data.tokenInformation.instrumentIdentifier.id;
    return { customerTokenId, paymentInstrumentId, instrumentIdentifier };
};

/**
 * Processes an invalid card response, logging the error and updating token actions.
 * 
 * @param {any} customFields - The custom fields related to the card and customer.
 * @param {CustomerType} customerObj - The customer object containing relevant customer information.
 * @param {string} customerId - The ID of the customer for logging purposes.
 * @returns {Promise<ActionResponseType>} - A promise that resolves to an action response containing updated token actions.
 */
const processInvalidCardResponse = async (customFields: any, customerObj: CustomerType, customerId: string): Promise<ActionResponseType> => {
    const addressIdField = customFields?.isv_addressId === Constants.UC_ADDRESS ? '' : customFields.isv_addressId || '';
    let existingTokens = customerObj?.custom?.fields?.isv_tokens || [];
    let existingFailedTokens: string[] = [];
    if (customFields?.isv_tokenAlias && customFields.isv_cardType && customFields.isv_maskedPan && customFields.isv_cardExpiryMonth && customFields.isv_cardExpiryYear) {
        existingFailedTokens = await paymentUtils.createFailedTokenData(customFields, addressIdField);
    }
    const response = paymentActions.getUpdateTokenActions(existingTokens, existingFailedTokens, true, customerObj, null);
    paymentUtils.logData(__filename, FunctionConstant.FUNC_PROCESS_INVALID_CARD_RESPONSE, Constants.LOG_ERROR, 'CustomerId : ' + customerId, CustomMessages.ERROR_MSG_SERVICE_PROCESS);
    return response;
};

/**
 * Retrieves billing address fields based on custom fields and customer information.
 * 
 * @param {any} customFields - The custom fields related to the card and customer.
 * @param {readonly AddressType[]} addressObj - An array of address objects associated with the customer.
 * @param {CustomerType} customerObj - The customer object containing relevant customer information.
 * @returns {Promise<AddressType | null>} - A promise that resolves to the billing address fields or null if not found.
 */
const getBillToFields = async (customFields: any, addressObj: readonly AddressType[], customerObj: CustomerType): Promise<AddressType | null> => {
    let billToFields = null;
    if (Constants.UC_ADDRESS === customFields?.isv_addressId) {
        const ucAddressData = await getTransientTokenData.getTransientTokenDataResponse(customerObj, 'MyAccounts');
        if (Constants.HTTP_OK_STATUS_CODE === ucAddressData?.httpCode) {
            billToFields = ucAddressData.data.orderInformation.billTo;
        }
    } else {
        billToFields = addressObj.find(address => customFields?.isv_addressId === address.id) || null;
    }
    return billToFields;
};

/**
 * Counts the number of tokens added within a specific time interval.
 * 
 * @param {CustomerType | null} customerObj - Customer object.
 * @param {string} startTime - Start time of the interval.
 * @param {string} endTime - End time of the interval.
 * @returns {number} - Number of tokens added within the interval.
 */
const getRateLimiterTokenCount = async (customerObj: Partial<CustomerType> | null, startTime: string, endTime: string): Promise<number> => {
    let count = 0;
    let existingTokens: string[];
    let existingFailedTokens: string[];
    if (customerObj?.custom?.fields?.isv_failedTokens?.length) {
        existingFailedTokens = customerObj.custom.fields.isv_failedTokens;
        count += paymentUtils.countTokenForGivenInterval(existingFailedTokens, startTime, endTime);
    }
    if (customerObj?.custom?.fields?.isv_tokens?.length) {
        existingTokens = customerObj.custom.fields.isv_tokens;
        count += paymentUtils.countTokenForGivenInterval(existingTokens, startTime, endTime);
    }
    return count;
};

/**
 * Checks whether to create a token.
 * 
 * @param {CustomerType | null} customerInfo - Customer information.
 * @param {PaymentType | null} paymentObj - Payment object.
 * @param {string} functionName - Name of the calling function.
 * @returns {Promise<{ isSaveToken: boolean, isError: boolean }>} - Object containing flag indicating whether to save the token and error flag.
 */
const evaluateTokenCreation = async (customerInfo: Partial<CustomerType> | null, paymentObj: PaymentType | null, functionName: string): Promise<{ isSaveToken: boolean, isError: boolean }> => {
    let cardRate = 0;
    let cardRateCount = 0;
    const tokenCreateObj = {
        isSaveToken: true,
        isError: false,
    }
    if (FunctionConstant.FUNC_HANDLE_CARD_ADDITION === functionName || ((FunctionConstant.FUNC_GET_PAYMENT_RESPONSE === functionName || FunctionConstant.FUNC_GET_PAYER_AUTH_ENROLL_RESPONSE === functionName || FunctionConstant.FUNC_GET_PAYER_AUTH_VALIDATE_RESPONSE === functionName) && paymentObj?.custom?.fields?.isv_tokenAlias)) {
        if (customerInfo && paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_ENABLE_RATE_LIMITER)) {
            const validInputForRateLimiter = paymentValidator.isValidRateLimiterInput();
            if (validInputForRateLimiter) {
                cardRate = Number(process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME);
                cardRateCount = Number(process.env.PAYMENT_GATEWAY_LIMIT_SAVED_CARD_RATE);
                if (!tokenCreateObj.isError) {
                    const startTime = paymentUtils.getDate(null, false) as Date;
                    startTime.setHours(startTime.getHours() - cardRate);
                    const limiterResponse = await getRateLimiterTokenCount(customerInfo, paymentUtils.getDate(startTime, true, null, null) as string, paymentUtils.getDate(Date.now(), true, null, null) as string);
                    if (limiterResponse && cardRateCount <= limiterResponse) {
                        tokenCreateObj.isSaveToken = false;
                    }
                }
            } else {
                tokenCreateObj.isError = true;
                paymentUtils.logData(__filename, FunctionConstant.FUNC_EVALUATE_TOKEN_CREATION, Constants.LOG_WARN, 'CustomerId : ' + customerInfo.id, CustomMessages.ERROR_MSG_INVALID_RATE_LIMITER_CONFIGURATIONS);
            }
        }
    }
    return tokenCreateObj;
};

/**
 * Handles the creation of a payment token for a customer, retrieving relevant billing address fields if necessary.
 * 
 * @param {Partial<CustomerType>} customerObj - The customer object containing details for token creation.
 * @param {readonly AddressType[]} addressObj - An array of address objects associated with the customer.
 * @param {string | undefined} isv_addressId - The identifier for the address to be used.
 * @returns {Promise<{ isSaveToken: boolean, cardTokens: any, billToFields: AddressType | null }>} - A promise that resolves to an object containing:
 *  - isSaveToken: A boolean indicating if the token should be saved.
 *  - cardTokens: The retrieved card tokens for the customer.
 *  - billToFields: The billing address fields, or null if not found.
 */
const handleTokenCreation = async (customerObj: Partial<CustomerType>, addressObj: readonly AddressType[], isv_addressId: string | undefined): Promise<{ isSaveToken: boolean, cardTokens: any, billToFields: AddressType | null }> => {
    const tokenCreateResponse = await evaluateTokenCreation(customerObj, null, FunctionConstant.FUNC_HANDLE_CARD_ADDITION);
    let billToFields: AddressType | null = null;
    const isSaveToken = tokenCreateResponse.isSaveToken;
    const cardTokens = getCardTokens(customerObj, '');
    if (!tokenCreateResponse.isError) {
        if (Constants.UC_ADDRESS === isv_addressId) {
            const ucAddressData = await getTransientTokenData.getTransientTokenDataResponse(customerObj, 'MyAccounts');
            if (Constants.HTTP_OK_STATUS_CODE === ucAddressData?.httpCode) {
                billToFields = ucAddressData.data.orderInformation.billTo;
            }
        } else {
            addressObj.forEach((address) => {
                if (isv_addressId === address.id) {
                    billToFields = address;
                }
            });
        }
    }
    return { isSaveToken, cardTokens, billToFields };
};

/**
 * Checks if the provided token matches an existing token in the customer's tokens and process tokens accordingly.
 * 
 * @param {string} customerTokenId - Customer token ID.
 * @param {string} instrumentIdentifier - Instrument identifier.
 * @param {PaymentType} updatePaymentObj - Updated payment object.
 * @param {string} addressId - Address ID.
 * @returns {Promise<CustomerType | null>} - Indicates if the token already exists.
 */
const processTokens = async (customerTokenId: string, paymentInstrumentId: string, instrumentIdentifier: string, updatePaymentObj: PaymentType, addressId: string): Promise<Partial<CustomerType> | null> => {
    let isExistingCardFlag = false;
    const customerId = updatePaymentObj?.customer?.id;
    const customFields = updatePaymentObj?.custom?.fields;
    let finalTokenIndex = -1;
    let existingTokens: string[];
    let parsedTokens: Partial<CustomerTokensType>;
    let updateTokenResponse: Partial<CustomerType> | null = null;
    if (customerId) {
        const customerInfo = await commercetoolsApi.getCustomer(customerId);
        if (customerInfo) {
            const customTypePresent = customerInfo?.custom?.type?.id ? true : false;
            if (customerInfo?.custom?.fields?.isv_tokens?.length) {
                existingTokens = customerInfo.custom.fields.isv_tokens;
                existingTokens.forEach((token, tokenIndex) => {
                    const newToken = JSON.parse(token);
                    if (newToken.cardNumber === updatePaymentObj?.custom?.fields.isv_maskedPan && newToken.value === customerTokenId && newToken.instrumentIdentifier === instrumentIdentifier) {
                        finalTokenIndex = tokenIndex;
                    }
                });
                if (-1 < finalTokenIndex && customFields?.isv_tokenAlias && customFields?.isv_cardExpiryMonth && customFields?.isv_cardExpiryYear) {
                    isExistingCardFlag = true;
                    parsedTokens = paymentUtils.updateParsedToken(existingTokens[finalTokenIndex], customFields, paymentInstrumentId, customerTokenId, addressId);
                    if (0 < Object.keys(parsedTokens).length) {
                        existingTokens[finalTokenIndex] = JSON.stringify(parsedTokens);
                        if (customTypePresent) {
                            updateTokenResponse = await commercetoolsApi.updateCustomerToken(existingTokens, customerInfo, customerInfo?.custom?.fields?.isv_failedTokens, customerTokenId);
                        } else {
                            updateTokenResponse = await commercetoolsApi.setCustomType(customerId, existingTokens, customerInfo?.custom?.fields?.isv_failedTokens, customerTokenId);
                        }
                    }
                }
            }
        }
    }
    if (!isExistingCardFlag) {
        updateTokenResponse = await commercetoolsApi.setCustomerTokens(customerTokenId, paymentInstrumentId, instrumentIdentifier, updatePaymentObj, addressId);
    }
    return updateTokenResponse;
};

/**
 * Retrieves card tokens from customer information.
 * 
 * @param {CustomerType | null} customerInfo - Customer information.
 * @param {string} isvSavedToken - Saved token.
 * @returns {Promise<CustomTokenType>} - Card tokens.
 */
const getCardTokens = async (customerInfo: Partial<CustomerType> | null, isvSavedToken: string): Promise<CustomTokenType> => {
    let currentIndex = 0;
    const cardTokens: CustomTokenType = {
        customerTokenId: '',
        paymentInstrumentId: '',
    };
    if (customerInfo && customerInfo?.custom?.fields?.isv_tokens && 0 < customerInfo.custom.fields.isv_tokens?.length) {
        const existingTokens = customerInfo.custom.fields.isv_tokens;
        const tokenLength = customerInfo.custom.fields.isv_tokens.length;
        const existingTokensMap = existingTokens.map((item) => item);
        existingTokensMap.forEach((token) => {
            const newToken = JSON.parse(token);
            currentIndex++;
            if (isvSavedToken === newToken.paymentToken && cardTokens) {
                cardTokens.customerTokenId = newToken.value;
                cardTokens.paymentInstrumentId = newToken.paymentToken;
            }
            if (tokenLength === currentIndex && '' === cardTokens.customerTokenId) {
                cardTokens.customerTokenId = newToken.value;
            }
        });
    }
    return cardTokens;
};

/**
 * Retrieves the customer's address ID.
 * 
 * @param {any} cartObj - Cart object.
 * @returns {Promise<ActionResponseType>} - Address ID.
 */
const setCustomerTokenData = async (cardTokens: CustomTokenType, paymentResponse: PtsV2PaymentsPost201Response | any, authResponse: ActionResponseType, isError: boolean, updatePaymentObj: PaymentType, cartObj: any): Promise<ActionResponseType> => {
    let customerTokenId = '';
    let addressId = '';
    let customerId = updatePaymentObj?.customer?.id || '';
    let customerTokenResponse: Partial<CustomerType> | null = null;
    let customerInfo: Partial<CustomerType> | null = null;
    if (cartObj && cartObj?.billingAddress?.id) {
        addressId = cartObj.billingAddress.id;
    }
    if (!addressId && customerId) {
        if (updatePaymentObj.custom?.fields?.isv_token) {
            customerInfo = await commercetoolsApi.getCustomer(customerId);
        } else if (cartObj && updatePaymentObj.custom?.fields?.isv_transientToken) {
            customerInfo = await addTokenAddressForUC(updatePaymentObj, cartObj);
        }
        if (customerInfo?.addresses?.length) {
            addressId = customerInfo.addresses[customerInfo.addresses.length - 1].id as string;
        }
    }
    const processTokenData = paymentValidator.shouldProcessTokens(isError, paymentResponse, updatePaymentObj);
    if (processTokenData && paymentResponse?.data?.tokenInformation?.paymentInstrument?.id) {
        const tokenInfo = paymentResponse.data.tokenInformation;
        const isv_savedToken = paymentResponse.data.tokenInformation.paymentInstrument.id;
        authResponse.actions.push(...paymentUtils.setCustomFieldMapper({ isv_savedToken }));
        if (cardTokens && !cardTokens?.customerTokenId && tokenInfo?.customer && tokenInfo.customer?.id) {
            customerTokenId = tokenInfo.customer.id;
        } else if (cardTokens?.customerTokenId) {
            customerTokenId = cardTokens.customerTokenId;
        }
        const paymentInstrumentId = tokenInfo.paymentInstrument.id;
        const instrumentIdentifier = tokenInfo.instrumentIdentifier.id;
        customerTokenResponse = await processTokens(customerTokenId, paymentInstrumentId, instrumentIdentifier, updatePaymentObj, addressId);
        let logMessage = customerTokenResponse ? CustomMessages.SUCCESS_MSG_CARD_TOKENS_UPDATE : CustomMessages.ERROR_MSG_TOKEN_UPDATE
        paymentUtils.logData(__filename, FunctionConstant.FUNC_SET_CUSTOMER_TOKEN_DATA, Constants.LOG_INFO, 'CustomerId : ' + customerId || '', logMessage);
    } else {
        const customFields = updatePaymentObj?.custom?.fields as Partial<PaymentCustomFieldsType>;
        const processFailedTokenData = paymentValidator.shouldProcessFailedTokens(paymentResponse, updatePaymentObj)
        if (processFailedTokenData) {
            customerTokenResponse = await setCustomerFailedTokenData(updatePaymentObj, customFields, addressId);
            const responseMessage = customerTokenResponse ? CustomMessages.SUCCESS_MSG_CARD_TOKENS_UPDATE : CustomMessages.ERROR_MSG_TOKEN_UPDATE;
            paymentUtils.logData(__filename, FunctionConstant.FUNC_SET_CUSTOMER_TOKEN_DATA, Constants.LOG_DEBUG, 'CustomerId : ' + customerId || '', responseMessage);
        }
    }
    return authResponse;
};

/**
 * Sets customer failed token data.
 * 
 * @param {PaymentType} updatePaymentObj - The payment object containing updated payment details.
 * @param {PaymentCustomFieldsType} customFields - The custom fields associated with the payment.
 * @param {string} addressId - The address ID.
 * @returns {Promise<CustomerType | null>} - The updated customer token response.
 */
const setCustomerFailedTokenData = async (updatePaymentObj: PaymentType, customFields: Partial<PaymentCustomFieldsType>, addressId: string): Promise<Partial<CustomerType> | null> => {
    const customerId = updatePaymentObj?.customer?.id;
    let failedTokenLength = 0;
    let existingTokens: string[] = [];
    let existingFailedTokensMap: string[] = [];
    let customerInfo: Partial<CustomerType> | null = null;
    let customerTokenResponse: Partial<CustomerType> | null = null;
    if (customerId) {
        customerInfo = await commercetoolsApi.getCustomer(customerId);
    }
    if (customerInfo) {
        const fields = customerInfo?.custom?.fields as any;
        const id = customerInfo?.custom?.type?.id;
        const failedToken = new Token(customFields, '', '', '', addressId, '');
        const isCustomTypePresent = id ? true : false;
        if (fields?.isv_tokens) {
            const customerTokens = fields;
            if (0 < customerTokens?.isv_failedTokens?.length) {
                const existingFailedTokens = customerTokens.isv_failedTokens;
                existingFailedTokensMap = existingFailedTokens.map((item: any) => item);
                failedTokenLength = customerTokens.isv_failedTokens.length;
                existingFailedTokensMap[failedTokenLength] = JSON.stringify(failedToken);
            } else {
                existingFailedTokensMap = [JSON.stringify(failedToken)];
            }
            existingTokens = fields.isv_tokens;
        } else {
            existingFailedTokensMap = [JSON.stringify(failedToken)];
        }
        if (0 < fields?.isv_failedTokens?.length) {
            customerTokenResponse = await commercetoolsApi.updateCustomerToken(null, customerInfo, existingFailedTokensMap, null);
        } else {
            customerTokenResponse = isCustomTypePresent ? await commercetoolsApi.updateCustomerToken(existingTokens, customerInfo, existingFailedTokensMap, null) :
                await commercetoolsApi.setCustomType(customerId, existingTokens, existingFailedTokensMap);
        }
    }
    return customerTokenResponse;
};

/**
 * Adds billing address for UC token.
 * 
 * @param {PaymentType} updatePaymentObj - The payment object containing updated payment details.
 * @param {any} cartObj - The cart object.
 * @returns {Promise<CustomerType | null>} - The updated customer address.
 */
const addTokenAddressForUC = async (updatePaymentObj: PaymentType, cartObj: any): Promise<Partial<CustomerType> | null> => {
    let customerId = updatePaymentObj?.customer?.id || '';
    let transientTokenData: {
        readonly httpCode: number;
        readonly data: any;
        readonly status: string;
    };
    let customerAddress: Partial<CustomerType> | null = null;
    if (updatePaymentObj && 'FULL' === process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE) {
        transientTokenData = await getTransientTokenData.getTransientTokenDataResponse(updatePaymentObj, 'Payments');
        if (transientTokenData.httpCode && Constants.HTTP_OK_STATUS_CODE === transientTokenData.httpCode && customerId) {
            const transientTokenDataObj = transientTokenData.data;
            customerAddress = await commercetoolsApi.addCustomerAddress(customerId, transientTokenDataObj.orderInformation.billTo);
        } else {
            paymentUtils.logData(__filename, FunctionConstant.FUNC_ADD_TOKEN_ADDRESS_FOR_UC, Constants.LOG_ERROR, '', CustomMessages.ERROR_MSG_UC_ADDRESS_DETAILS);
        }
    } else if (updatePaymentObj && ('NONE' === process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE || 'PARTIAL' === process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE)) {
        if (cartObj && cartObj?.billingAddress && customerId) {
            customerAddress = await commercetoolsApi.addCustomerAddress(customerId, cartObj.billingAddress);
        } else {
            paymentUtils.logData(__filename, FunctionConstant.FUNC_ADD_TOKEN_ADDRESS_FOR_UC, Constants.LOG_ERROR, '', CustomMessages.ERROR_MSG_CUSTOMER_UPDATE);
        }
    }
    return customerAddress;
};

export default {
    processValidCardResponse,
    processInvalidCardResponse,
    getBillToFields,
    getRateLimiterTokenCount,
    evaluateTokenCreation,
    handleTokenCreation,
    processTokens,
    getCardTokens,
    setCustomerTokenData,
    setCustomerFailedTokenData,
    addTokenAddressForUC
}