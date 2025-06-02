import { Cart, Customer, Payment } from "@commercetools/platform-sdk";

import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from "../../constants/paymentConstants";
import paymentAuthSetUp from '../../service/payment/PayerAuthenticationSetupService';
import paymentAuthorization from '../../service/payment/PaymentAuthorizationService';
import { ActionResponseType, CustomTokenType, PaymentCustomFieldsType, TokenCreateFlagType } from '../../types/Types';
import { errorHandler, PaymentProcessingError } from "../ErrorHandler";
import paymentActions from '../PaymentActions';
import paymentUtils from "../PaymentUtils";
import paymentValidator from '../PaymentValidator';
import commercetoolsApi from '../api/CommercetoolsApi';

import cartHelper from "./CartHelper";
import paymentHelper from "./PaymentHelper";
import tokenHelper from "./TokenHelper";


/**
 * Processes the payer authentication enroll tokens.
 * 
 * @param {Payment} updatePaymentObj - Updated payment object.
 * @param {TokenCreateFlagType} tokenCreateResponse - Token create response.
 * @param {PaymentCustomFieldsType} customFields - Custom fields.
 * @param {string} cardinalReferenceId - Cardinal reference ID.
 * @param {Cart} cartObj - Cart object.
 * @param {CustomTokenType} cardTokens - Card tokens.
 * @param {string} orderNo - Order number.
 * @returns {Promise<ActionResponseType>} - Action response for payer authentication enrollment.
 */
const getEnrollResponseForPayerAuthentication = async (updatePaymentObj: Payment, tokenCreateResponse: TokenCreateFlagType, customFields: Partial<PaymentCustomFieldsType>, cardinalReferenceId: string, cartObj: Cart, cardTokens: CustomTokenType, orderNo: string): Promise<ActionResponseType> => {
    let isSaveToken = false;
    let payerAuthMandateFlag = false;
    isSaveToken = tokenCreateResponse.isSaveToken;
    let enrollResponse: ActionResponseType = paymentUtils.invalidInputResponse();
    if (Constants.HTTP_SUCCESS_STATUS_CODE === customFields?.isv_payerEnrollHttpCode && Constants.API_STATUS_CUSTOMER_AUTHENTICATION_REQUIRED === customFields?.isv_payerEnrollStatus) {
        payerAuthMandateFlag = true;
    }
    const enrollServiceResponse = await paymentAuthorization.getAuthorizationResponse(updatePaymentObj, cartObj, Constants.STRING_ENROLL_CHECK, cardTokens, isSaveToken, payerAuthMandateFlag, orderNo);
    if (enrollServiceResponse && enrollServiceResponse.httpCode) {
        enrollServiceResponse.cardinalReferenceId = cardinalReferenceId;
        enrollResponse = paymentActions.createEnrollResponseActions(enrollServiceResponse, updatePaymentObj);
        const enrollAuthResponse = paymentHelper.getAuthResponse(enrollServiceResponse, null);
        paymentValidator.validateActionsAndPush(enrollAuthResponse.actions, enrollResponse.actions);
        enrollResponse = await tokenHelper.setCustomerTokenData(cardTokens, enrollServiceResponse, enrollResponse, false, updatePaymentObj, cartObj);
    }
    return enrollResponse;
};

/**
 * Retrieves the payer authentication validation response.
 * 
 * @param {Payment} updatePaymentObj - Updated payment object.
 * @returns {Promise<ActionResponseType>} - Action response for payer authentication validation.
 */
const getPayerAuthValidateResponse = async (updatePaymentObj: Payment): Promise<ActionResponseType> => {
    let isSaveToken = false;
    let paymentInstrumentToken = '';
    let paymentId = updatePaymentObj?.id || '';
    let customerId = updatePaymentObj?.customer?.id || '';
    let tokenCreateResponse = {
        isSaveToken: false,
        isError: false,
    };
    let customerInfo: Customer | null = null;
    let cardTokens: CustomTokenType = { customerTokenId: '', paymentInstrumentId: '' };
    let authResponse: ActionResponseType = paymentUtils.getEmptyResponse();
    if (updatePaymentObj && updatePaymentObj?.custom && (updatePaymentObj.custom?.fields?.isv_token || updatePaymentObj.custom?.fields?.isv_savedToken || updatePaymentObj.custom?.fields?.isv_transientToken)) {
        const cartObj = await paymentUtils.getCartObject(updatePaymentObj);
        if (cartObj && cartObj?.count) {
            if (customerId) {
                if (updatePaymentObj.custom?.fields?.isv_savedToken) {
                    paymentInstrumentToken = updatePaymentObj.custom.fields.isv_savedToken;
                }
                customerInfo = await commercetoolsApi.getCustomer(customerId);
                cardTokens = await tokenHelper.getCardTokens(customerInfo, paymentInstrumentToken);
            }
            const cartId = cartObj?.results[0]?.id;
            const orderNo = await paymentUtils.getOrderId(cartId, paymentId);
            tokenCreateResponse = await tokenHelper.evaluateTokenCreation(customerInfo, updatePaymentObj, FunctionConstant.FUNC_GET_PAYER_AUTH_VALIDATE_RESPONSE);
            if (!tokenCreateResponse.isError) {
                isSaveToken = tokenCreateResponse.isSaveToken;
                const paymentResponse = await paymentAuthorization.getAuthorizationResponse(updatePaymentObj, cartObj.results[0], Constants.VALIDATION, cardTokens, isSaveToken, false, orderNo);
                if (paymentResponse && paymentResponse.httpCode) {
                    authResponse = paymentActions.createEnrollResponseActions(paymentResponse, updatePaymentObj);
                    if (authResponse) {
                        if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse?.httpCode && !paymentResponse?.data?.errorInformation && paymentResponse?.data?.consumerAuthenticationInformation) {
                            authResponse = await paymentActions.payerAuthValidateActions(authResponse, paymentResponse);
                        }
                        const consumerAuthRequired = paymentValidator.isConsumerAuthenticationRequired(paymentResponse);
                        if (consumerAuthRequired) {
                            const isv_payerEnrollStatus = paymentResponse.data.errorInformation.reason;
                            const isv_payerEnrollHttpCode = paymentResponse.httpCode;
                            authResponse.actions.push(...paymentUtils.setCustomFieldMapper({
                                isv_payerEnrollStatus, isv_payerEnrollHttpCode
                            }));
                        }
                        authResponse = await tokenHelper.setCustomerTokenData(cardTokens, paymentResponse, authResponse, false, updatePaymentObj, cartObj.results[0]);
                    }
                }
            }
        }
    } else {
        errorHandler.logError(new PaymentProcessingError(CustomMessages.ERROR_MSG_NO_CARD_DETAILS ,'',FunctionConstant.FUNC_GET_PAYER_AUTH_VALIDATE_RESPONSE),__filename,'PaymentId : ' + paymentId);
    }
    return authResponse;
};

/**
 * Retrieves the payer authentication setup response.
 * 
 * @param {Payment} updatePaymentObj - Updated payment object.
 * @returns {Promise<ActionResponseType>} - Action response containing payer authentication setup.
 */
const getPayerAuthSetUpResponse = async (updatePaymentObj: Payment): Promise<ActionResponseType> => {
    let paymentInstrumentToken = '';
    let paymentId = updatePaymentObj?.id || '';
    let customerId = updatePaymentObj?.customer?.id || '';
    let cardTokens: CustomTokenType = {
        customerTokenId: '',
        paymentInstrumentId: '',
    };
    let setUpActionResponse: ActionResponseType = paymentUtils.getEmptyResponse();
    let customFields: Partial<PaymentCustomFieldsType>;
    if (updatePaymentObj?.custom?.fields) {
        customFields = updatePaymentObj.custom.fields;
        if (customFields?.isv_token || customFields?.isv_savedToken || customFields?.isv_transientToken) {
            if (customerId) {
                const customerInfo = await commercetoolsApi.getCustomer(customerId);
                if (customFields?.isv_savedToken) {
                    paymentInstrumentToken = customFields.isv_savedToken;
                }
                cardTokens = await tokenHelper.getCardTokens(customerInfo, paymentInstrumentToken);
            }
            if ((Constants.STRING_FULL === process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE || paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_UC_ENABLE_SHIPPING)) && customFields?.isv_transientToken) {
                const cartObj = await paymentUtils.getCartObject(updatePaymentObj);
                if (cartObj && cartObj.count) {
                    await cartHelper.updateCartWithUCAddress(updatePaymentObj, cartObj.results[0]);
                }
            }
            const setUpServiceResponse = await paymentAuthSetUp.getPayerAuthSetupData(updatePaymentObj, cardTokens.customerTokenId);
            if (setUpServiceResponse && setUpServiceResponse.httpCode) {
                setUpActionResponse = paymentHelper.getAuthResponse(setUpServiceResponse, null);
            }
        }
    } else {
        errorHandler.logError(new PaymentProcessingError(CustomMessages.ERROR_MSG_EMPTY_PAYMENT_DATA ,'',FunctionConstant.FUNC_GET_PAYER_AUTH_SETUP_RESPONSE),__filename,'PaymentId : ' + paymentId);
    }
    return setUpActionResponse;
};

/**
 * Retrieves the payer authentication enrollment response.
 * 
 * @param {Payment} updatePaymentObj - Updated payment object.
 * @returns {Promise<ActionResponseType>} - Action response for payer authentication enrollment.
 */
const getPayerAuthEnrollResponse = async (updatePaymentObj: Payment): Promise<ActionResponseType> => {
    let paymentId = updatePaymentObj?.id || '';
    let customerId = updatePaymentObj?.customer?.id || '';
    let orderNo = null;
    let cardTokens: CustomTokenType = { customerTokenId: '', paymentInstrumentId: '' };
    let customFields: Partial<PaymentCustomFieldsType>;
    let customerInfo: Customer | null = null;
    let enrollResponse: ActionResponseType = paymentUtils.invalidInputResponse();
    let paymentInstrument = '';
    if (updatePaymentObj?.custom?.fields) {
        customFields = updatePaymentObj.custom.fields;
        if (customFields?.isv_cardinalReferenceId && (customFields?.isv_token || customFields?.isv_savedToken || customFields?.isv_transientToken)) {
            const cardinalReferenceId = customFields.isv_cardinalReferenceId || '';
            const cartObjResponse = await paymentUtils.getCartObject(updatePaymentObj);
            if (cartObjResponse && cartObjResponse?.count) {
                if (customFields?.isv_savedToken) {
                    paymentInstrument = customFields.isv_savedToken;
                }
                if (updatePaymentObj.customer?.id) {
                    customerInfo = await commercetoolsApi.getCustomer(customerId);
                    cardTokens = await tokenHelper.getCardTokens(customerInfo, paymentInstrument);
                }
                const cartId = cartObjResponse?.results[0]?.id;
                orderNo = await paymentUtils.getOrderId(cartId, paymentId);
                const tokenCreateResponse = await tokenHelper.evaluateTokenCreation(customerInfo, updatePaymentObj, FunctionConstant.FUNC_GET_PAYER_AUTH_ENROLL_RESPONSE);
                enrollResponse = !tokenCreateResponse.isError ? await getEnrollResponseForPayerAuthentication(updatePaymentObj, tokenCreateResponse, customFields, cardinalReferenceId, cartObjResponse?.results[0], cardTokens, orderNo) : paymentUtils.getEmptyResponse();
            }
        }
    } else {
        errorHandler.logError(new PaymentProcessingError(CustomMessages.ERROR_MSG_EMPTY_PAYMENT_DATA ,'',FunctionConstant.FUNC_GET_PAYER_AUTH_ENROLL_RESPONSE),__filename,'PaymentId : ' + paymentId);
    }
    return enrollResponse;
};

/**
 * Processes payer authentication based on the state of the payment object and its custom fields.
 * 
 * This function evaluates the necessary steps for payer authentication, such as setup, enrollment, or validation,
 * depending on the presence of specific custom fields related to payer authentication. It returns the appropriate 
 * response based on the current state of the authentication process.
 * 
 * @param {Payment} paymentObj - The payment object containing details about the payment and authentication fields.
 * @returns {Promise<ActionResponseType>} - A promise that resolves to an action response object reflecting the 
 *         outcome of the payer authentication process.
 */
const processPayerAuthentication = async (paymentObj: Payment) => {
    let payerAuthResponse = paymentUtils.getEmptyResponse();
    const { isv_cardinalReferenceId, isv_payerAuthenticationTransactionId, isv_payerAuthenticationRequired, isv_payerEnrollStatus, isv_payerEnrollTransactionId } = paymentObj.custom?.fields || {};
    if (!isv_cardinalReferenceId) {
        payerAuthResponse = await getPayerAuthSetUpResponse(paymentObj);
    } else if (!isv_payerAuthenticationTransactionId && isv_cardinalReferenceId) {
        payerAuthResponse = await getPayerAuthEnrollResponse(paymentObj);
    } else if (isv_payerAuthenticationTransactionId && isv_payerAuthenticationRequired && isv_payerEnrollStatus && isv_payerEnrollTransactionId) {
        payerAuthResponse = await getPayerAuthValidateResponse(paymentObj);
    }
    return payerAuthResponse;
};

export default {
    getEnrollResponseForPayerAuthentication,
    processPayerAuthentication,
    getPayerAuthValidateResponse,
    getPayerAuthSetUpResponse,
    getPayerAuthEnrollResponse
}


