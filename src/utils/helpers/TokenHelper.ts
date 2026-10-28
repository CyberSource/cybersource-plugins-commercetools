import { _BaseAddress, Cart, Customer, FieldContainer, Payment } from '@commercetools/platform-sdk';
import { PtsV2PaymentsPost201Response } from 'cybersource-rest-client';

import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from '../../constants/paymentConstants';
import { Token } from '../../models/TokenModel';
import getTransientTokenData from '../../service/payment/GetTransientTokenData';
import { ActionResponseType, AddressType, CustomerTokensType, CustomTokenType, PaymentCustomFieldsType } from '../../types/Types';
import { errorHandler, PaymentProcessingError } from '../ErrorHandler';
import paymentActions from '../PaymentActions';
import paymentUtils from '../PaymentUtils';
import paymentValidator from '../PaymentValidator';
import commercetoolsApi from '../api/CommercetoolsApi';

import networkTokenHelper from './NetworkTokenHelper';

/**
 * Processes a valid card response, updating or creating token data based on the card response.
 *
 * @param {FieldContainer} customFields - The custom fields related to the card and customer.
 * @param {any} cardTokens - The current card tokens available.
 * @param {any} cardResponse - The response object from the card processing service.
 * @param {Customer} customerObj - The customer object containing relevant customer information.
 * @param {_BaseAddress | null} billToFields - The billing address fields, if available.
 * @returns {Promise<ActionResponseType>} - A promise that resolves to an action response containing updated token actions.
 */
const processValidCardResponse = async (customFields: FieldContainer, cardTokens: any, cardResponse: any, customerObj: Customer, billToFields: Partial<AddressType> | null): Promise<ActionResponseType> => {
    const { customerTokenId, paymentInstrumentId, instrumentIdentifier } = getTokenIds(cardResponse, cardTokens);
    let finalTokenIndex = -1;
    let existingTokens = customFields?.isv_tokens || [];
    let existingFailedTokens: string[] = customFields?.isv_failedTokens || [];
    const tokenIndex = existingTokens.findIndex((token: any) => {
        const parsedToken = JSON.parse(token);
        return parsedToken.value === customerTokenId && parsedToken.instrumentIdentifier === instrumentIdentifier;
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
 * @param {FieldContainer} customFields - The custom fields related to the card and customer.
 * @param {Customer} customerObj - The customer object containing relevant customer information.
 * @param {string} customerId - The ID of the customer for logging purposes.
 * @returns {Promise<ActionResponseType>} - A promise that resolves to an action response containing updated token actions.
 */
const processInvalidCardResponse = async (customFields: FieldContainer, customerObj: Customer, customerId: string): Promise<ActionResponseType> => {
    const addressIdField = customFields?.isv_addressId === Constants.UC_ADDRESS ? '' : customFields.isv_addressId || '';
    let existingTokens = customerObj?.custom?.fields?.isv_tokens || [];
    let existingFailedTokens: string[] = [];
    if (customFields.isv_cardType && customFields.isv_maskedPan && customFields.isv_cardExpiryMonth && customFields.isv_cardExpiryYear) {
        existingFailedTokens = await paymentUtils.createFailedTokenData(customFields, addressIdField);
    }
    const response = paymentActions.getUpdateTokenActions(existingTokens, existingFailedTokens, true, customerObj, null);
    errorHandler.logError(new PaymentProcessingError(CustomMessages.ERROR_MSG_SERVICE_PROCESS, '', FunctionConstant.FUNC_PROCESS_INVALID_CARD_RESPONSE), __filename, 'CustomerId : ' + customerId);
    return response;
};

/**
 * Retrieves billing address fields based on custom fields and customer information.
 *
 * @param {FieldContainer} customFields - The custom fields related to the card and customer.
 * @param {readonly _BaseAddress[]} addressObj - An array of address objects associated with the customer.
 * @param {Customer} customerObj - The customer object containing relevant customer information.
 * @returns {Promise<_BaseAddress | null>} - A promise that resolves to the billing address fields or null if not found.
 */

const getBillToFields = async (customFields: FieldContainer, addressObj: readonly _BaseAddress[], customerObj: Customer, selectedAddressId?: string): Promise<Partial<AddressType> | null> => {
    let billToFields = null;
    if (selectedAddressId && addressObj?.length) {
        const selectedAddress = addressObj.find((addr) => addr.id === selectedAddressId);

        if (selectedAddress) {
            return selectedAddress;
        } else {
            paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_CARD_ADDITION, Constants.LOG_WARN, '', `[Address Resolution] Selected address not found.`);
        }
    }

    if (Constants.UC_ADDRESS === customFields?.isv_addressId) {
        const ucAddressData = await getTransientTokenData.getTransientTokenDataResponse(customerObj, 'MyAccounts');

        if (Constants.HTTP_OK_STATUS_CODE === ucAddressData?.httpCode) {
            billToFields = ucAddressData.data.orderInformation.billTo;
        }

        if (!billToFields && addressObj?.length) {
            const defaultBillingAddressId = customerObj?.defaultBillingAddressId;
            const defaultShippingAddressId = customerObj?.defaultShippingAddressId;

            billToFields = addressObj.find((address) => address.id === defaultBillingAddressId) || addressObj.find((address) => address.id === defaultShippingAddressId) || addressObj[0] || null;

            paymentUtils.logData(__filename, FunctionConstant.FUNC_HANDLE_CARD_ADDITION, Constants.LOG_WARN, '', '[Address Resolution] UC billTo lookup from transient token returned empty. Falling back to customer address.');
        }
    } else {
        billToFields = addressObj.find((address) => customFields?.isv_addressId === address.id) || null;
    }

    return billToFields;
};
/**
 * Counts the number of tokens added within a specific time interval.
 *
 * @param {Customer | null} customerObj - Customer object.
 * @param {string} startTime - Start time of the interval.
 * @param {string} endTime - End time of the interval.
 * @returns {number} - Number of tokens added within the interval.
 */
const getRateLimiterTokenCount = async (customerObj: Partial<Customer> | null, startTime: string, endTime: string): Promise<number> => {
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
 * Checks if the provided token matches an existing token in the customer's tokens and process tokens accordingly.
 *
 * @param {string} customerTokenId - Customer token ID.
 * @param {string} instrumentIdentifier - Instrument identifier.
 * @param {Payment} updatePaymentObj - Updated payment object.
 * @param {string} addressId - Address ID.
 * @returns {Promise<Customer | null>} - Indicates if the token already exists.
 */
const processTokens = async (customerTokenId: string, paymentInstrumentId: string, instrumentIdentifier: string, updatePaymentObj: Payment, addressId: string): Promise<Partial<Customer> | null> => {
    let isExistingCardFlag = false;
    const customerId = updatePaymentObj?.customer?.id;
    const customFields = updatePaymentObj?.custom?.fields;
    let finalTokenIndex = -1;
    let existingTokens: string[];
    let parsedTokens: Partial<CustomerTokensType>;
    let updateTokenResponse: Partial<Customer> | null = null;
    if (customerId) {
        const customerInfo = await commercetoolsApi.getCustomer(customerId);
        if (customerInfo) {
            const customTypePresent = customerInfo?.custom?.type?.id ? true : false;
            if (customerInfo?.custom?.fields?.isv_tokens?.length) {
                existingTokens = customerInfo.custom.fields.isv_tokens;
                existingTokens.forEach((token, tokenIndex) => {
                    const newToken = JSON.parse(token);
                    if (newToken.value === customerTokenId && newToken.instrumentIdentifier === instrumentIdentifier) {
                        finalTokenIndex = tokenIndex;
                    }
                });
                if (-1 < finalTokenIndex && customFields?.isv_cardExpiryMonth && customFields?.isv_cardExpiryYear) {
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
 * @param {Customer | null} customerInfo - Customer information.
 * @param {string} isvSavedToken - Saved token.
 * @returns {Promise<CustomTokenType>} - Card tokens.
 */
const getCardTokens = async (customerInfo: Partial<Customer> | null, paymentToken: string): Promise<CustomTokenType> => {
    let currentIndex = 0;
    const cardTokens: CustomTokenType = {
        customerTokenId: '',
        paymentInstrumentId: '',
    };

    if (customerInfo?.custom?.fields?.isv_tokens?.length) {
        const customerId = customerInfo?.id || '';
        try {
            const originalTokensSnapshot = JSON.stringify(customerInfo.custom.fields.isv_tokens);
            const refreshedTokens = await networkTokenHelper.refreshNetworkTokenCards(customerInfo.custom.fields.isv_tokens, customerInfo);
            customerInfo.custom.fields.isv_tokens = refreshedTokens;

            const refreshedTokensSnapshot = JSON.stringify(refreshedTokens);
            if (originalTokensSnapshot !== refreshedTokensSnapshot && customerInfo?.id && customerInfo?.version) {
                try {
                    await commercetoolsApi.updateCustomerToken(refreshedTokens, customerInfo, customerInfo?.custom?.fields?.isv_failedTokens || [], customerInfo?.custom?.fields?.isv_customerId || null);
                } catch (persistError) {
                    paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CARD_TOKENS, Constants.LOG_WARN, 'CustomerId: ' + customerId, 'Failed to persist refreshed Network Token details. Error: ' + (persistError instanceof Error ? persistError.message : String(persistError)));
                }
            }
        } catch (error) {
            const customerId = customerInfo?.id || ''; paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CARD_TOKENS, Constants.LOG_WARN, 'CustomerId: ' + customerId, 'Network token refresh failed before token selection. Error: ' + (error instanceof Error ? error.message : String(error)) + '. Proceeding with original tokens.',);
        }
    }

    if (customerInfo && customerInfo?.custom?.fields?.isv_tokens && 0 < customerInfo.custom.fields.isv_tokens?.length) {
        const existingTokens = customerInfo.custom.fields.isv_tokens;
        const tokenLength = customerInfo.custom.fields.isv_tokens.length;
        const existingTokensMap = existingTokens.map((item: any) => item);
        existingTokensMap.forEach((token: any) => {
            const newToken = JSON.parse(token);
            currentIndex++;
            if (paymentToken === newToken.paymentToken && cardTokens) {
                cardTokens.customerTokenId = newToken.value;
                cardTokens.paymentInstrumentId = newToken.paymentToken;
                cardTokens.instrumentIdentifier = newToken.instrumentIdentifier;
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
 * @param {Cart} cartObj - Cart object.
 * @returns {Promise<ActionResponseType>} - Address ID.
 */
const setCustomerTokenData = async (cardTokens: CustomTokenType, paymentResponse: PtsV2PaymentsPost201Response | any, authResponse: ActionResponseType, isError: boolean, updatePaymentObj: Payment, cartObj: Cart): Promise<ActionResponseType> => {
    let customerTokenId = '';
    let addressId = '';
    let customerId = updatePaymentObj?.customer?.id || '';
    let customerInfo: Partial<Customer> | null = null;

    if (cartObj && cartObj?.billingAddress?.id) {
        addressId = cartObj.billingAddress.id;
    }
    if (!addressId && customerId) {
        if (updatePaymentObj.custom?.fields?.isv_token) {
            customerInfo = await commercetoolsApi.getCustomer(customerId);
        } else if (cartObj && updatePaymentObj.custom?.fields?.isv_transientToken) {
            customerInfo = await addTokenAddressForUC(updatePaymentObj, cartObj);
        }
        if (customerInfo && !customerInfo?.addresses?.length && cartObj?.billingAddress) {
            customerInfo = await commercetoolsApi.addCustomerAddress(customerId, cartObj.billingAddress);
        }
        if (customerInfo?.addresses?.length) {
            let customerAddress = customerInfo.addresses[customerInfo.addresses.length - 1];
            if (customerAddress.firstName === cartObj?.billingAddress?.firstName && customerAddress.lastName === cartObj?.billingAddress?.lastName) {
                addressId = customerInfo.addresses[customerInfo.addresses.length - 1].id as string;
            } else if (cartObj?.billingAddress) {
                customerInfo = await commercetoolsApi.addCustomerAddress(customerId, cartObj.billingAddress);
                if (customerInfo?.addresses?.length) {
                    addressId = customerInfo.addresses[customerInfo.addresses.length - 1].id as string;
                }
            }
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
        await processTokens(customerTokenId, paymentInstrumentId, instrumentIdentifier, updatePaymentObj, addressId);
    } else {
        const customFields = updatePaymentObj?.custom?.fields as Partial<PaymentCustomFieldsType>;
        const processFailedTokenData = paymentValidator.shouldProcessFailedTokens(paymentResponse, updatePaymentObj);
        if (processFailedTokenData) {
            await setCustomerFailedTokenData(updatePaymentObj, customFields, addressId);
        }
    }
    return authResponse;
};

/**
 * Sets customer failed token data.
 *
 * @param {Payment} updatePaymentObj - The payment object containing updated payment details.
 * @param {FieldContainer} customFields - The custom fields associated with the payment.
 * @param {string} addressId - The address ID.
 * @returns {Promise<Customer | null>} - The updated customer token response.
 */
const setCustomerFailedTokenData = async (updatePaymentObj: Payment, customFields: FieldContainer, addressId: string): Promise<Partial<Customer> | null> => {
    const customerId = updatePaymentObj?.customer?.id;
    let failedTokenLength = 0;
    let existingTokens: string[] = [];
    let existingFailedTokensMap: string[] = [];
    let customerInfo: Partial<Customer> | null = null;
    let customerTokenResponse: Partial<Customer> | null = null;
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
            customerTokenResponse = isCustomTypePresent ? await commercetoolsApi.updateCustomerToken(existingTokens, customerInfo, existingFailedTokensMap, null) : await commercetoolsApi.setCustomType(customerId, existingTokens, existingFailedTokensMap);
        }
    }
    return customerTokenResponse;
};

/**
 * Adds billing address for UC token.
 *
 * @param {Payment} updatePaymentObj - The payment object containing updated payment details.
 * @param {Cart} cartObj - The cart object.
 * @returns {Promise<Customer | null>} - The updated customer address.
 */
const addTokenAddressForUC = async (updatePaymentObj: Payment, cartObj: Cart): Promise<Partial<Customer> | null> => {
    let customerId = updatePaymentObj?.customer?.id || '';
    let transientTokenData: {
        readonly httpCode: number;
        readonly data: any;
        readonly status: string;
    };
    let customerAddress: Partial<Customer> | null = null;
    if (updatePaymentObj && 'FULL' === process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE) {
        transientTokenData = await getTransientTokenData.getTransientTokenDataResponse(updatePaymentObj, 'Payments');
        if (transientTokenData.httpCode && Constants.HTTP_OK_STATUS_CODE === transientTokenData.httpCode && customerId) {
            const transientTokenDataObj = transientTokenData.data;
            customerAddress = await commercetoolsApi.addCustomerAddress(customerId, transientTokenDataObj.orderInformation.billTo);
        } else {
            errorHandler.logError(new PaymentProcessingError(CustomMessages.ERROR_MSG_UC_ADDRESS_DETAILS, '', FunctionConstant.FUNC_ADD_TOKEN_ADDRESS_FOR_UC), __filename, '');
        }
    } else if (updatePaymentObj && ('NONE' === process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE || 'PARTIAL' === process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE)) {
        if (cartObj && cartObj?.billingAddress && customerId) {
            customerAddress = await commercetoolsApi.addCustomerAddress(customerId, cartObj.billingAddress);
        } else {
            errorHandler.logError(new PaymentProcessingError(CustomMessages.ERROR_MSG_CUSTOMER_UPDATE, '', FunctionConstant.FUNC_ADD_TOKEN_ADDRESS_FOR_UC), __filename, '');
        }
    }
    return customerAddress;
};

export default {
    processValidCardResponse,
    processInvalidCardResponse,
    getBillToFields,
    getRateLimiterTokenCount,
    processTokens,
    getCardTokens,
    setCustomerTokenData,
    setCustomerFailedTokenData,
    addTokenAddressForUC,
};
