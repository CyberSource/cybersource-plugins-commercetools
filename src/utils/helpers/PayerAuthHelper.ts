import { Constants } from "../../constants/constants";
import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import paymentAuthSetUp from '../../service/payment/PayerAuthenticationSetupService';
import paymentAuthorization from '../../service/payment/PaymentAuthorizationService';
import { ActionResponseType, CustomerType, CustomTokenType, PaymentCustomFieldsType, PaymentType, TokenCreateFlagType } from '../../types/Types';
import paymentActions from '../PaymentActions';
import paymentService from '../PaymentService';
import paymentUtils from "../PaymentUtils";
import paymentValidator from '../PaymentValidator';
import commercetoolsApi from '../api/CommercetoolsApi';

/**
 * Processes the payer authentication enroll tokens.
 * 
 * @param {PaymentType} updatePaymentObj - Updated payment object.
 * @param {TokenCreateFlagType} tokenCreateResponse - Token create response.
 * @param {PaymentCustomFieldsType} customFields - Custom fields.
 * @param {string} cardinalReferenceId - Cardinal reference ID.
 * @param {any} cartObj - Cart object.
 * @param {CustomTokenType} cardTokens - Card tokens.
 * @param {string} orderNo - Order number.
 * @returns {Promise<ActionResponseType>} - Action response for payer authentication enrollment.
 */
const getEnrollResponseForPayerAuthentication = async (updatePaymentObj: PaymentType, tokenCreateResponse: TokenCreateFlagType, customFields: Partial<PaymentCustomFieldsType>, cardinalReferenceId: string, cartObj: any, cardTokens: CustomTokenType, orderNo: string): Promise<ActionResponseType> => {
    let enrollResponse: ActionResponseType = paymentUtils.invalidInputResponse();
    let isSaveToken = false;
    let payerAuthMandateFlag = false;
    isSaveToken = tokenCreateResponse.isSaveToken;
    if (Constants.HTTP_SUCCESS_STATUS_CODE === customFields?.isv_payerEnrollHttpCode && Constants.API_STATUS_CUSTOMER_AUTHENTICATION_REQUIRED === customFields?.isv_payerEnrollStatus) {
        payerAuthMandateFlag = true;
    }
    const enrollServiceResponse = await paymentAuthorization.getAuthorizationResponse(updatePaymentObj, cartObj.results[0], Constants.STRING_ENROLL_CHECK, cardTokens, isSaveToken, payerAuthMandateFlag, orderNo);
    if (enrollServiceResponse && enrollServiceResponse.httpCode) {
        enrollServiceResponse.cardinalReferenceId = cardinalReferenceId;
        enrollResponse = paymentActions.createEnrollResponseActions(enrollServiceResponse, updatePaymentObj);
        const enrollAuthResponse = paymentService.getAuthResponse(enrollServiceResponse, null);
        paymentValidator.validateActionsAndPush(enrollAuthResponse.actions, enrollResponse.actions);
        enrollResponse = await paymentService.setCustomerTokenData(cardTokens, enrollServiceResponse, enrollResponse, false, updatePaymentObj, cartObj.results[0]);
    }
    return enrollResponse;
};
/**
 * Retrieves the payer authentication validation response.
 * 
 * @param {PaymentType} updatePaymentObj - Updated payment object.
 * @returns {Promise<ActionResponseType>} - Action response for payer authentication validation.
 */
const getPayerAuthValidateResponse = async (updatePaymentObj: PaymentType): Promise<ActionResponseType> => {
    let authResponse: ActionResponseType = paymentUtils.getEmptyResponse();
    let cardTokens: CustomTokenType = { customerTokenId: '', paymentInstrumentId: '' };
    let customerInfo: Partial<CustomerType> | null = null;
    let isSaveToken = false;
    let paymentInstrumentToken = '';
    let paymentId = updatePaymentObj?.id || '';
    let customerId = updatePaymentObj?.customer?.id || '';
    let tokenCreateResponse = {
        isSaveToken: false,
        isError: false,
    };
    try {
        if (updatePaymentObj && updatePaymentObj?.custom && (updatePaymentObj.custom?.fields?.isv_token || updatePaymentObj.custom?.fields?.isv_savedToken || updatePaymentObj.custom?.fields?.isv_transientToken)) {
            const cartObj = await paymentUtils.getCartObject(updatePaymentObj);
            if (cartObj && cartObj?.count) {
                if (customerId) {
                    if (updatePaymentObj.custom?.fields?.isv_savedToken) {
                        paymentInstrumentToken = updatePaymentObj.custom.fields.isv_savedToken;
                    }
                    customerInfo = await commercetoolsApi.getCustomer(customerId);
                    cardTokens = await paymentService.getCardTokens(customerInfo, paymentInstrumentToken);
                }
                const cartId = cartObj?.results[0]?.id;
                const orderNo = await paymentUtils.getOrderId(cartId, paymentId);
                tokenCreateResponse = await paymentService.evaluateTokenCreation(customerInfo, updatePaymentObj, FunctionConstant.FUNC_GET_PAYER_AUTH_VALIDATE_RESPONSE);
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
                            authResponse = await paymentService.setCustomerTokenData(cardTokens, paymentResponse, authResponse, false, updatePaymentObj, cartObj.results[0]);
                        }
                    }
                } else {
                    paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_PAYER_AUTH_VALIDATE_RESPONSE, Constants.LOG_INFO, 'PaymentId : ' + paymentId, CustomMessages.ERROR_MSG_SERVICE_PROCESS);
                }
            }
        } else {
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_PAYER_AUTH_VALIDATE_RESPONSE, Constants.LOG_INFO, 'PaymentId : ' + paymentId, CustomMessages.ERROR_MSG_NO_CARD_DETAILS);
        }
    } catch (exception) {
        paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_PAYER_AUTH_VALIDATE_RESPONSE, CustomMessages.EXCEPTION_MSG_AUTHORIZING_PAYMENT, exception, paymentId, 'PaymentId : ', '');
        authResponse = paymentUtils.invalidInputResponse();
    }
    return authResponse;
};
/**
 * Retrieves the payer authentication setup response.
 * 
 * @param {PaymentType} updatePaymentObj - Updated payment object.
 * @returns {Promise<ActionResponseType>} - Action response containing payer authentication setup.
 */
const getPayerAuthSetUpResponse = async (updatePaymentObj: PaymentType): Promise<ActionResponseType> => {
    let setUpActionResponse: ActionResponseType = paymentUtils.getEmptyResponse();
    let cardTokens: CustomTokenType = {
        customerTokenId: '',
        paymentInstrumentId: '',
    };
    let paymentInstrumentToken = '';
    let paymentId = updatePaymentObj?.id || '';
    let customFields: Partial<PaymentCustomFieldsType>;
    let customerId = updatePaymentObj?.customer?.id || '';
    try {
        if (updatePaymentObj?.custom?.fields) {
            customFields = updatePaymentObj.custom.fields;
            if (customFields?.isv_token || customFields?.isv_savedToken || customFields?.isv_transientToken) {
                if (customerId) {
                    const customerInfo = await commercetoolsApi.getCustomer(customerId);
                    if (customFields?.isv_savedToken) {
                        paymentInstrumentToken = customFields.isv_savedToken;
                    }
                    cardTokens = await paymentService.getCardTokens(customerInfo, paymentInstrumentToken);
                }
                if ((Constants.STRING_FULL === process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE || paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_UC_ENABLE_SHIPPING)) && customFields?.isv_transientToken) {
                    const cartObj = await paymentUtils.getCartObject(updatePaymentObj);
                    if (cartObj && cartObj.count) {
                        await paymentService.updateCartWithUCAddress(updatePaymentObj, cartObj.results[0]);
                    }
                }
                const setUpServiceResponse = await paymentAuthSetUp.getPayerAuthSetupData(updatePaymentObj, cardTokens.customerTokenId);
                if (setUpServiceResponse && setUpServiceResponse.httpCode) {
                    setUpActionResponse = paymentService.getAuthResponse(setUpServiceResponse, null);
                } else {
                    paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_PAYER_AUTH_SETUP_RESPONSE, Constants.LOG_INFO, 'PaymentId : ' + paymentId, CustomMessages.ERROR_MSG_SERVICE_PROCESS);
                }
            }
        } else {
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_PAYER_AUTH_SETUP_RESPONSE, Constants.LOG_INFO, 'PaymentId : ' + paymentId, CustomMessages.ERROR_MSG_EMPTY_PAYMENT_DATA);
        }
    } catch (exception) {
        paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_PAYER_AUTH_SETUP_RESPONSE, CustomMessages.EXCEPTION_MSG_PAYER_AUTH, exception, paymentId, 'PaymentId : ', '');
        setUpActionResponse = paymentUtils.invalidInputResponse();
    }
    return setUpActionResponse;
};
/**
 * Retrieves the payer authentication enrollment response.
 * 
 * @param {PaymentType} updatePaymentObj - Updated payment object.
 * @returns {Promise<ActionResponseType>} - Action response for payer authentication enrollment.
 */
const getPayerAuthEnrollResponse = async (updatePaymentObj: PaymentType): Promise<ActionResponseType> => {
    let enrollResponse: ActionResponseType = paymentUtils.invalidInputResponse();
    let orderNo = null;
    let cardTokens: CustomTokenType = { customerTokenId: '', paymentInstrumentId: '' };
    let customFields: Partial<PaymentCustomFieldsType>;
    let customerInfo: Partial<CustomerType> | null = null;
    let paymentId = updatePaymentObj?.id || '';
    let customerId = updatePaymentObj?.customer?.id || '';
    try {
        if (updatePaymentObj?.custom?.fields) {
            customFields = updatePaymentObj.custom.fields;
            if (customFields?.isv_cardinalReferenceId && (customFields?.isv_token || customFields?.isv_savedToken || customFields?.isv_transientToken)) {
                const cardinalReferenceId = customFields.isv_cardinalReferenceId || '';
                const cartObj = await paymentUtils.getCartObject(updatePaymentObj);
                if (cartObj && cartObj?.count) {
                    if (updatePaymentObj.customer?.id && customFields?.isv_savedToken) {
                        customerInfo = await commercetoolsApi.getCustomer(customerId);
                        cardTokens = await paymentService.getCardTokens(customerInfo, customFields.isv_savedToken);
                    }
                    const cartId = cartObj?.results[0]?.id;
                    orderNo = await paymentUtils.getOrderId(cartId, paymentId);
                    const tokenCreateResponse = await paymentService.evaluateTokenCreation(customerInfo, updatePaymentObj, FunctionConstant.FUNC_GET_PAYER_AUTH_ENROLL_RESPONSE);
                    enrollResponse = !tokenCreateResponse.isError ? await getEnrollResponseForPayerAuthentication(updatePaymentObj, tokenCreateResponse, customFields, cardinalReferenceId, cartObj, cardTokens, orderNo) : paymentUtils.getEmptyResponse();
                }
            }
        } else {
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_PAYER_AUTH_ENROLL_RESPONSE, Constants.LOG_INFO, 'PaymentId : ' + paymentId, CustomMessages.ERROR_MSG_EMPTY_PAYMENT_DATA);
        }
    } catch (exception) {
        paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_PAYER_AUTH_ENROLL_RESPONSE, CustomMessages.EXCEPTION_MSG_AUTHORIZING_PAYMENT, exception, paymentId, 'PaymentId : ', '');
        enrollResponse = paymentUtils.invalidInputResponse();
    }
    return enrollResponse;
};

const processPayerAuthentication = async (paymentObj: PaymentType) => {
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
}

export default {
    getEnrollResponseForPayerAuthentication,
    processPayerAuthentication,
    getPayerAuthValidateResponse,
    getPayerAuthSetUpResponse,
    getPayerAuthEnrollResponse
}


