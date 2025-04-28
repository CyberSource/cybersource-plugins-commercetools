import { _BaseAddress, Customer, Payment } from "@commercetools/platform-sdk";

import { Constants } from "../constants/paymentConstants";
import { Address } from '../models/AddressModel';
import { ActionResponseType, ActionType, AddTransactionType, AmountPlannedType, ApplicationsType, CardAddressGroupType, ConsumerAuthenticationInformationType } from "../types/Types";

import paymentUtils from "./PaymentUtils";
import paymentValidator from "./PaymentValidator";

/**
 * Creates a refund action object to add a refund transaction.
 * 
 * @param {AmountPlannedType} amount - Amount to refund.
 * @param {any} orderResponse - Order response object.
 * @param {string} state - State of the refund transaction.
 * @returns {AddTransactionType | null} - Refund action object.
 */
const addRefundAction = (amount: AmountPlannedType, orderResponse: any, state: string): AddTransactionType | null => {
    const refundAction = {
        action: Constants.ADD_TRANSACTION,
        transaction: {
            type: Constants.CT_TRANSACTION_TYPE_REFUND,
            timestamp: paymentUtils.getDate(Date.now(), true) as string,
            amount: {} as AmountPlannedType,
            state: state,
            interactionId: '',
        },
    };
    paymentValidator.setObjectValue(refundAction.transaction, 'amount', amount, '', Constants.STR_OBJECT, false);
    paymentValidator.setObjectValue(refundAction.transaction, Constants.INTERACTION_ID, orderResponse, Constants.TRANSACTION_ID, Constants.STR_STRING, false);
    return refundAction;
};

/**
 * Creates a response object based on the provided actions and optional parameters.
 * 
 * @param {ActionType} setTransaction - Action to set transaction details.
 * @param {ActionType} setCustomField - Action to set custom field.
 * @param {ActionType | null} paymentFailure - Action for payment failure (optional).
 * @param {ActionType | null} setCustomType - Action to set custom type (optional).
 * @returns {ActionResponseType} - Object containing actions and errors.
 */
const createResponse = (setTransaction: Partial<ActionType>, setCustomField: Partial<ActionType>, paymentFailure: Partial<ActionType> | null, setCustomType: Partial<ActionType> | null): ActionResponseType => {
    const actions: Partial<ActionType>[] = [];
    let returnResponse: ActionResponseType;
    paymentValidator.setObjectValue(actions, '', setTransaction, '', Constants.STR_OBJECT, false);
    paymentValidator.setObjectValue(actions, '', setCustomField, '', Constants.STR_OBJECT, false);
    paymentValidator.setObjectValue(actions, '', paymentFailure, '', Constants.STR_OBJECT, false);
    paymentValidator.setObjectValue(actions, '', setCustomType, '', Constants.STR_OBJECT, false);
    returnResponse = {
        actions: actions,
        errors: [],
    };
    return returnResponse;
};

/**
 * Generates actions based on card details.
 * 
 * @param {CardAddressGroupType} cardDetails - The card details.
 * @returns {Partial<ActionType[]>} - Array of actions.
 */
const cardDetailsActions = (cardDetails: Partial<CardAddressGroupType>): Partial<ActionType>[] => {
    let actions: Partial<ActionType>[] = [];
    const { cardFieldGroup } = cardDetails || {};
    if (cardFieldGroup) {
        const { prefix, suffix, expirationMonth, expirationYear, type } = cardFieldGroup;
        actions = [
            ...(prefix && suffix ? paymentUtils.setCustomFieldMapper({ isv_maskedPan: prefix.concat(Constants.CLICK_TO_PAY_CARD_MASK, suffix) }) : []),
            ...(expirationMonth ? paymentUtils.setCustomFieldMapper({ isv_cardExpiryMonth: expirationMonth }) : []),
            ...(expirationYear ? paymentUtils.setCustomFieldMapper({ isv_cardExpiryYear: expirationYear }) : []),
            ...(type ? paymentUtils.setCustomFieldMapper({ isv_cardType: type }) : [])
        ].flat();
    }
    return actions;
};

/**
 * Generates update token actions based on the provided parameters.
 *
 * @param {string[]} isvTokens - An array of ISV tokens.
 * @param {string[] | undefined} existingFailedTokensMap - An array of existing failed tokens.
 * @param {boolean} isError - Indicates if there was an error.
 * @param {Customer} customerObj - The customer object.
 * @param {Partial<AddressType> | null} address - The address object or null.
 * @param {string} [customerTokenId] - Optional customer token ID.
 * @returns {ActionResponseType} The response containing the actions to be performed.
 */
const getUpdateTokenActions = (isvTokens: string[], existingFailedTokensMap: string[] | undefined, isError: boolean, customerObj: Customer, address: _BaseAddress | null, customerTokenId?: string): ActionResponseType => {
    const customTypePresent = !!customerObj?.custom?.type?.id;
    let returnResponse: ActionResponseType = paymentUtils.getEmptyResponse();
    let fields = {} as any;
    let customFields = {} as any;
    if (customTypePresent) {
        customFields.isv_tokens = isvTokens;
        customFields.isv_tokenUpdated = !isError;
        paymentValidator.setObjectValue(customFields, 'isv_customerId', customerTokenId, '', Constants.STR_STRING, false);
        paymentValidator.setObjectValue(customFields, 'isv_failedTokens', existingFailedTokensMap, '', Constants.STR_ARRAY, false);
        if (customerObj?.custom?.fields?.isv_tokenAction) {
            customFields.isv_tokenAction = '';
            if (customerObj.custom?.fields?.isv_cardNewExpiryYear) {
                customFields.isv_cardExpiryYear = '';
            }
            if (customerObj.custom?.fields?.isv_cardNewExpiryMonth) {
                customFields.isv_cardExpiryMonth = '';
            }
        }
        if (customerObj?.custom?.fields?.isv_tokenAlias) {
            Object.assign(customFields, {
                isv_tokenAlias: '',
                isv_cardType: '',
                isv_cardExpiryYear: '',
                isv_cardExpiryMonth: '',
                [Constants.ISV_ADDRESS_ID]: '',
                isv_currencyCode: '',
                isv_deviceFingerprintId: '',
                [Constants.ISV_TOKEN]: '',
                isv_maskedPan: ''
            })
        }
        if (address) {
            customFields[Constants.ISV_ADDRESS_ID] = '';
        }
        returnResponse.actions = Object.keys(customFields).map(key => ({
            action: Constants.SET_CUSTOM_FIELD,
            name: key,
            value: customFields[key] as string
        }));
    } else {
        fields.isv_tokens = isvTokens;
        fields.isv_tokenUpdated = !isError;
        paymentValidator.setObjectValue(fields, 'isv_customerId', customerTokenId, '', Constants.STR_STRING, false);
        paymentValidator.setObjectValue(fields, 'isv_failedTokens', existingFailedTokensMap, '', Constants.STR_ARRAY, false);
        returnResponse.actions = [{
            action: 'setCustomType',
            type: {
                key: 'isv_payments_customer_tokens',
                typeId: Constants.TYPE_ID_TYPE
            },
            fields: fields
        }];
    }
    if (address) {
        const addressObject = new Address(address);
        returnResponse.actions.push({
            action: 'addAddress',
            address: addressObject
        })
    }
    return returnResponse;
};

/**
 * Handles authorization application for the given payment update.
 * 
 * @param {Payment} updatePaymentObj - Updated payment object.
 * @param {ApplicationsType} application - Application details.
 * @param {ActionResponseType} updateActions - Updated actions.
 * @param {any} element - Element.
 * @returns {Promise<ActionResponseType>} - Updated actions response.
 */
const handleAuthApplication = async (updatePaymentObj: Payment, application: Partial<ApplicationsType>, updateActions: ActionResponseType, element: any): Promise<ActionResponseType> => {
    const authAction = {
        action: 'addTransaction',
        transaction: {},
    };
    let transactionState = Constants.CT_TRANSACTION_STATE_FAILURE;
    if (Constants.PAYMENT_GATEWAY_SUCCESS_REASON_CODE === application?.reasonCode) {
        transactionState = Constants.CT_TRANSACTION_STATE_SUCCESS;
    }
    authAction.transaction = paymentUtils.createTransactionObject(undefined, updatePaymentObj.amountPlanned, Constants.CT_TRANSACTION_TYPE_AUTHORIZATION, transactionState, element.id, paymentUtils.getDate(Date.now(), true) as string);
    updateActions.actions.push(authAction);
    return updateActions;
};

/**
 * Generates actions based on payer enrollment response.
 * 
 * @param {any} response - The payer enrollment response.
 * @param {Payment} updatePaymentObj - The payment object to be updated.
 * @returns {ActionResponseType} - Object containing actions and errors.
 */
const createEnrollResponseActions = (response: any, updatePaymentObj: Payment): ActionResponseType => {
    let isv_dmpaFlag = false;
    let isv_payerAuthenticationRequired = false;
    let isv_payerAuthenticationTransactionId = '';
    const isv_cardinalReferenceId = '';
    const isv_deviceDataCollectionUrl = '';
    const isv_requestJwt = '';
    const isv_responseJwt = '';
    const isv_stepUpUrl = '';
    const isv_tokenCaptureContextSignature = '';
    const isv_clientLibrary = '';
    const isv_clientLibraryIntegrity = '';
    const isv_tokenVerificationContext = '';
    const isv_payerAuthenticationPaReq = '';
    const customFields = updatePaymentObj?.custom?.fields;
    const action: ActionResponseType = { actions: [], errors: [] };
    let consumerErrorData: Partial<ActionType>[] = [];
    if (response) {
        let { transactionId: isv_payerEnrollTransactionId, httpCode: isv_payerEnrollHttpCode, status: isv_payerEnrollStatus, data } = response || {};
        action.actions = paymentUtils.setCustomFieldMapper({ isv_payerEnrollTransactionId, isv_payerEnrollHttpCode, isv_payerEnrollStatus });
        if (Constants.HTTP_SUCCESS_STATUS_CODE === isv_payerEnrollHttpCode && Constants.API_STATUS_AUTHORIZED === isv_payerEnrollStatus && data) {
            isv_payerAuthenticationTransactionId = response.data.consumerAuthenticationInformation?.authenticationTransactionId || isv_payerEnrollTransactionId;
            action.actions.push(...paymentUtils.setCustomFieldMapper({ isv_payerAuthenticationTransactionId }));
        }
        if (response.data?.id && 'PAYERAUTH_INVOKE' === response.action || 'PAYERAUTH_EXTERNAL' === response.action || ('04' === response?.requestData?.consumerAuthenticationInformation?.challengeCode && paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_DECISION_MANAGER))) {
            isv_dmpaFlag = true;
        }
        action.actions.push(...paymentUtils.setCustomFieldMapper({ isv_dmpaFlag }));
        if (customFields?.isv_tokenCaptureContextSignature) {
            action.actions.push(...paymentUtils.setCustomFieldToNull({ isv_tokenCaptureContextSignature }));
        }
        if (customFields?.isv_clientLibrary) {
            action.actions.push(...paymentUtils.setCustomFieldToNull({ isv_clientLibrary }))
        }
        if (customFields?.isv_clientLibraryIntegrity) {
            action.actions.push(...paymentUtils.setCustomFieldToNull({ isv_clientLibraryIntegrity }))
        }
        if (customFields?.isv_savedToken && customFields?.isv_tokenVerificationContext) {
            action.actions.push(...paymentUtils.setCustomFieldToNull({ isv_tokenVerificationContext }));
        }
        isv_payerAuthenticationRequired = Constants.API_STATUS_PENDING_AUTHENTICATION === response.status ? true : updatePaymentObj?.custom?.fields.isv_payerAuthenticationRequired ? true : false;
        action.actions.push(...paymentUtils.setCustomFieldMapper({ isv_payerAuthenticationRequired }));
        if (Constants.HTTP_SUCCESS_STATUS_CODE === response?.httpCode && response?.data && response.data?.errorInformation && 0 < Object.keys(response.data.errorInformation)?.length && Constants.API_STATUS_CUSTOMER_AUTHENTICATION_REQUIRED === response.data.errorInformation?.reason) {
            isv_payerEnrollStatus = response.data.errorInformation.reason;
            action.actions.push(...paymentUtils.setCustomFieldMapper({ isv_payerEnrollStatus }));
            if (customFields?.isv_payerAuthenticationRequired) {
                consumerErrorData = paymentUtils.setCustomFieldToNull({
                    isv_payerAuthenticationTransactionId,
                    isv_cardinalReferenceId,
                    isv_deviceDataCollectionUrl,
                    isv_requestJwt,
                    isv_responseJwt,
                    isv_stepUpUrl,
                    isv_payerAuthenticationPaReq,
                });
            } else {
                consumerErrorData = paymentUtils.setCustomFieldToNull({
                    isv_cardinalReferenceId,
                    isv_deviceDataCollectionUrl,
                    isv_requestJwt,
                });
            }
            consumerErrorData.forEach((i) => {
                action.actions.push(i);
            });
        }
    }
    return action;
};

/**
* Generates actions based on payer authentication response.
* 
* @param {Partial<ConsumerAuthenticationInformationType>} response - The payer authentication response.
* @returns {ActionType[]} - Array of actions.
*/

const payerAuthActions = (response: Partial<ConsumerAuthenticationInformationType>): Partial<ActionType>[] => {
    let action: Partial<ActionType>[] = [];
    if (response) {
        const { isv_payerAuthenticationRequired, isv_payerAuthenticationTransactionId, acsUrl: isv_payerAuthenticationAcsUrl, isv_payerAuthenticationPaReq,
            stepUpUrl: isv_stepUpUrl,
            isv_responseJwt,
            acsUrl,
            xid,
            paReq,
            authenticationTransactionId,
            veresEnrolled,
            cardinalId: cardinalReferenceId,
            proofXml,
            specificationVersion,
            directoryServerTransactionId
        } = response || {}
        action = paymentUtils.setCustomFieldMapper({
            isv_payerAuthenticationRequired, isv_payerAuthenticationTransactionId, isv_payerAuthenticationAcsUrl, isv_payerAuthenticationPaReq, isv_stepUpUrl, isv_responseJwt,
        });
        action.push({
            action: Constants.ADD_INTERFACE_INTERACTION,
            type: { key: 'isv_payments_payer_authentication_enrolment_check' },
            fields: {
                authorizationAllowed: true,
                authenticationRequired: true,
                xid,
                paReq: paReq,
                acsUrl: acsUrl,
                authenticationTransactionId,
                veresEnrolled,
                cardinalReferenceId,
                proofXml,
                specificationVersion,
                directoryServerTransactionId
            },
        });
    }
    return action;
};

/**
 * Validates payer authentication actions based on the authentication and payment responses.
 *
 * @async
 * @param {ActionResponseType} authResponse - The action response object to update.
 * @param {any} paymentResponse - The payment response object containing authentication data.
 * @returns {Promise<ActionResponseType>} The updated action response object.
 */
const payerAuthValidateActions = async (authResponse: ActionResponseType, paymentResponse: any): Promise<ActionResponseType> => {
    const { consumerAuthenticationInformation, processorInformation, submitTimeUtc } = paymentResponse?.data || {};
    const { cavv, eciRaw, paresStatus, indicator, authenticationResult, xid, cavvAlgorithm, eci, specificationVersion } = consumerAuthenticationInformation || {};
    authResponse.actions.push({
        action: Constants.ADD_INTERFACE_INTERACTION,
        type: {
            key: 'isv_payments_payer_authentication_validate_result',
        },
        fields: {
            cavv: cavv,
            eciRaw: eciRaw,
            paresStatus: paresStatus,
            commerceIndicator: indicator,
            authenticationResult: authenticationResult,
            xid: xid,
            cavvAlgorithm: cavvAlgorithm,
            authenticationStatusMessage: consumerAuthenticationInformation?.authenticationStatusMessage,
            eci: eci,
            specificationVersion: specificationVersion,
        },
    });
    paymentValidator.setObjectValue(authResponse.actions, 'isv_AVSResponse', processorInformation, 'avs.code', Constants.STR_STRING, true);
    paymentValidator.setObjectValue(authResponse.actions, 'isv_CVVResponse', processorInformation, 'cardVerification.resultCode', Constants.STR_STRING, true);
    paymentValidator.setObjectValue(authResponse.actions, 'isv_responseCode', processorInformation, 'responseCode', Constants.STR_STRING, true);
    if (submitTimeUtc || paymentResponse?.text.submitTimeUtc) {
        const isv_responseDateAndTime = paymentResponse.data.submitTimeUtc || paymentResponse.text.submitTimeUtc;
        authResponse.actions.push(...paymentUtils.setCustomFieldMapper({ isv_responseDateAndTime }));
    }
    paymentValidator.setObjectValue(authResponse.actions, 'isv_ECI', processorInformation, 'data.consumerAuthenticationInformation.indicator', Constants.STR_STRING, true);
    return authResponse;
};

export default {
    addRefundAction,
    createResponse,
    cardDetailsActions,
    getUpdateTokenActions,
    handleAuthApplication,
    createEnrollResponseActions,
    payerAuthActions,
    payerAuthValidateActions
}