import { Payment } from "@commercetools/platform-sdk";
import { PtsV2PaymentsPost201Response } from "cybersource-rest-client";

import { CustomMessages } from "../../constants/customMessages";
import { FunctionConstant } from "../../constants/functionConstant";
import { Constants } from "../../constants/paymentConstants";
import { PayerAuthData } from "../../models/PayerAuthDataModel";
import { ActionResponseType, ActionType, PaymentTransactionType } from "../../types/Types";
import { errorHandler, PaymentProcessingError } from "../ErrorHandler";
import paymentActions from "../PaymentActions";
import paymentHandler from "../PaymentHandler";
import paymentUtils from "../PaymentUtils";
import paymentValidator from "../PaymentValidator";
import commercetoolsApi from "../api/CommercetoolsApi";

/**
 * Processes the authentication response from a payment service.
 * 
 * This function evaluates the payment response and updates the transaction 
 * details accordingly. It handles various states such as successful 
 * authorization, pending reviews, and failures. Additionally, it maps custom 
 * fields for actions based on the response and logs errors where necessary.
 * 
 * @param {PtsV2PaymentsPost201Response | any} paymentResponse - The response object 
 *        from the payment service, containing status, HTTP code, and other 
 *        relevant data.
 * @param {Partial<PaymentTransactionType> | null} transactionDetail - The transaction 
 *        details associated with the payment, which may include transaction state 
 *        and ID.
 * @returns {ActionResponseType} - An object representing the action response, 
 *         including updated transaction details and actions to be performed.
 */

const getAuthResponse = (paymentResponse: PtsV2PaymentsPost201Response | any, transactionDetail: Partial<PaymentTransactionType> | null): ActionResponseType => {
    let response: ActionResponseType = paymentUtils.getEmptyResponse();
    let setCustomField: Partial<ActionType>;
    if (paymentResponse) {
        const { httpCode, data, status } = paymentResponse || {};
        const { consumerAuthenticationInformation } = data || {};
        const validPendingAuthenticationResponse = paymentValidator.isValidPendingAuthenticationResponse(httpCode, status, data, consumerAuthenticationInformation)
        if (Constants.HTTP_SUCCESS_STATUS_CODE === httpCode && transactionDetail && (Constants.API_STATUS_AUTHORIZED === status || Constants.API_STATUS_AUTHORIZED_RISK_DECLINED === status || Constants.API_STATUS_PENDING === status)) {
            const setTransaction = paymentUtils.setTransactionId(paymentResponse, transactionDetail);
            setCustomField =
                Constants.CT_TRANSACTION_TYPE_CHARGE === transactionDetail.type && Constants.API_STATUS_AUTHORIZED_RISK_DECLINED === status
                    ? paymentUtils.changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_FAILURE)
                    : paymentUtils.changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_SUCCESS);
            response = paymentActions.createResponse(setTransaction, setCustomField, null, null);
        } else if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse?.httpCode && (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW === paymentResponse?.status || Constants.API_STATUS_PENDING_REVIEW === paymentResponse?.status) && transactionDetail) {
            const setTransaction = paymentUtils.setTransactionId(paymentResponse, transactionDetail);
            setCustomField = paymentUtils.changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_PENDING);
            response = paymentActions.createResponse(setTransaction, setCustomField, null, null);
        } else if (Constants.HTTP_SUCCESS_STATUS_CODE === httpCode && Constants.API_STATUS_COMPLETED === status) {
            const isv_requestJwt = paymentResponse.accessToken;
            const isv_cardinalReferenceId = paymentResponse.referenceId;
            const isv_deviceDataCollectionUrl = paymentResponse.deviceDataCollectionUrl;
            const actions = paymentUtils.setCustomFieldMapper({ isv_requestJwt, isv_cardinalReferenceId, isv_deviceDataCollectionUrl });
            response.actions = actions;
        } else if (validPendingAuthenticationResponse) {
            const payerAuthenticationData = new PayerAuthData(consumerAuthenticationInformation, paymentResponse);
            const actions = paymentActions.payerAuthActions(payerAuthenticationData);
            response.actions = actions;
        } else {
            if (!transactionDetail) {
                response = paymentUtils.getEmptyResponse();
            } else {
                const setTransaction = paymentUtils.setTransactionId(paymentResponse, transactionDetail);
                setCustomField = paymentUtils.changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_FAILURE);
                const paymentFailure = paymentUtils.failureResponse(paymentResponse, transactionDetail);
                response = paymentActions.createResponse(setTransaction, setCustomField, paymentFailure, null);
            }
        }
        if (!('deviceDataCollectionUrl' in paymentResponse)) {
            paymentValidator.setObjectValue(response.actions, 'isv_AVSResponse', paymentResponse, 'text.processorInformation.avs.code', Constants.STR_STRING, true);
            paymentValidator.setObjectValue(response.actions, 'isv_CVVResponse', paymentResponse, 'text.processorInformation.cardVerification.resultCode', Constants.STR_STRING, true);
            paymentValidator.setObjectValue(response.actions, 'isv_responseCode', paymentResponse, 'text.processorInformation.responseCode', Constants.STR_STRING, true);
            paymentValidator.setObjectValue(response.actions, 'isv_responseDateAndTime', paymentResponse, 'text.submitTimeUtc', Constants.STR_STRING, true);
            paymentValidator.setObjectValue(response.actions, 'isv_ECI', paymentResponse, 'text.consumerAuthenticationInformation.ecommerceIndicator', Constants.STR_STRING, true);
            paymentValidator.setObjectValue(response.actions, 'isv_authorizationStatus', paymentResponse, 'status', Constants.STR_STRING, true);
            paymentValidator.setObjectValue(response.actions, 'isv_authorizationReasonCode', paymentResponse, 'httpCode', Constants.STR_STRING, true);
        }
    }
    return response;
};

/**
 * Processes a transaction for a given payment object.
 * 
 * This function evaluates the transaction details and performs the appropriate 
 * action based on the transaction state and type. It handles authorization, 
 * payer authentication, and order management. Depending on the payment method 
 * and custom fields, it may initiate a payer authentication process or update 
 * the transaction state accordingly. The function returns a response indicating 
 * the result of the transaction processing.
 * 
 * @param {Payment} paymentObj - The payment object containing transaction 
 * details and associated metadata.
 * @returns {Promise<any>} - A promise that resolves to the update response 
 * from the transaction processing, which may include actions or state updates.
 */
const processTransaction = async (paymentObj: Payment) => {
    const transactionLength = paymentObj.transactions?.length;
    const updatePaymentId = paymentObj.id;
    const paymentMethod = paymentObj.paymentMethodInfo?.method;
    const paymentCustomFields = paymentObj.custom?.fields;
    const updateTransactions = paymentObj?.transactions[transactionLength - 1];
    let updateResponse = paymentUtils.getEmptyResponse();
    const paymentResponse = {
        httpCode: 0,
        status: '',
        transactionId: '',
    };
    if (
        1 === transactionLength &&
        updateTransactions &&
        (Constants.CT_TRANSACTION_TYPE_AUTHORIZATION === updateTransactions.type || (Constants.CT_TRANSACTION_TYPE_CHARGE === updateTransactions.type && (paymentCustomFields?.isv_saleEnabled || Constants.ECHECK === paymentMethod)))
    ) {
        if ([Constants.CT_TRANSACTION_STATE_SUCCESS, Constants.CT_TRANSACTION_STATE_FAILURE, Constants.CT_TRANSACTION_STATE_PENDING].includes(updateTransactions.state as string)) {
            updateResponse = paymentUtils.getEmptyResponse();
        } else if (paymentCustomFields && Constants.CC_PAYER_AUTHENTICATION === paymentMethod && 'isv_payerAuthenticationRequired' in paymentCustomFields && paymentCustomFields?.isv_payerEnrollStatus && paymentCustomFields?.isv_payerEnrollTransactionId) {
            paymentResponse.httpCode = Number(paymentCustomFields.isv_payerEnrollHttpCode);
            paymentResponse.status = paymentCustomFields.isv_payerEnrollStatus;
            paymentResponse.transactionId = paymentCustomFields.isv_payerEnrollTransactionId;
            updateResponse = getAuthResponse(paymentResponse, updateTransactions as Partial<PaymentTransactionType>);
            if (paymentResponse && Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode && Constants.API_STATUS_AUTHORIZED_RISK_DECLINED === paymentResponse.status) {
                updateResponse = await paymentHandler.handlePayerAuthReversal(paymentObj, paymentResponse, updateResponse);
            }
        } else {
            updateResponse = await paymentHandler.handleAuthorization(paymentObj, updateTransactions as Partial<PaymentTransactionType>);
        }
    } else {
        updateResponse = await paymentHandler.handleOrderManagement(updatePaymentId, paymentObj, updateTransactions as Partial<PaymentTransactionType>);
    }
    return updateResponse;
};

/**
 * Creates a custom type action for a transaction.
 * 
 * This function constructs a response object that specifies a custom type action 
 * for a given transaction ID and pending amount. It sets the action type, 
 * available capture amount, and transaction ID. If either the transaction ID 
 * or available capture amount is missing, it logs an error.
 * 
 * @param {string} transactionId - The ID of the transaction to associate with 
 * the custom type.
 * @param {number} pendingAmount - The amount available for capture associated 
 * with the transaction.
 * @returns {Partial<ActionType> | null} - A partial action object representing 
 * the custom type action, or null if there are missing details.
 */
const setTransactionCustomType = (transactionId: string, pendingAmount: number): Partial<ActionType> | null => {
    const returnResponse = {
        action: Constants.SET_TRANSACTION_CUSTOM_TYPE,
        type: {
            key: Constants.ISV_TRANSACTION_DATA,
            typeId: Constants.TYPE_ID_TYPE,
        },
        fields: {
            isv_availableCaptureAmount: 0,
        },
        transactionId: '',
    };
    paymentValidator.setObjectValue(returnResponse, Constants.TRANSACTION_ID, transactionId, '', Constants.STR_STRING, false);
    paymentValidator.setObjectValue(returnResponse.fields, 'isv_availableCaptureAmount', pendingAmount, '', 'number', false);
    if (!returnResponse.fields.isv_availableCaptureAmount || !returnResponse.transactionId) {
        errorHandler.logError(new PaymentProcessingError(CustomMessages.ERROR_MSG_EMPTY_TRANSACTION_DETAILS, '', FunctionConstant.FUNC_SET_TRANSACTION_CUSTOM_TYPE), __filename, '');
    }
    return returnResponse;
};

/**
 * Updates custom fields for a given custom object type.
 * 
 * @param {any[]} customFields - Array of custom fields.
 * @param {any[]} getCustomObj - Array of existing custom fields.
 * @param {string} typeId - Custom object type ID.
 * @param {number} version - Version of the custom object.
 * @returns {Promise<void>}
 */
const updateCustomField = async (customFields: any, getCustomObj: any, typeId: string, version: number): Promise<void> => {
    let isExistingField = false;
    let addCustomFieldResponse;
    try {
        if (customFields && getCustomObj && typeId && version) {
            for (let field of customFields) {
                isExistingField = false;
                getCustomObj.forEach((custom: any) => {
                    if (field.name === custom.name) {
                        isExistingField = true;
                    }
                });
                if (!isExistingField) {
                    addCustomFieldResponse = await commercetoolsApi.addCustomField(typeId, version, field);
                    version = addCustomFieldResponse.version;
                }
            }
        }
    } catch (exception) {
        errorHandler.logError(new PaymentProcessingError(CustomMessages.EXCEPTION_MSG_SYNC_DETAILS, exception, FunctionConstant.FUNC_UPDATE_CUSTOM_FIELDS), __filename, '');
    }
};

export default {
    getAuthResponse,
    processTransaction,
    setTransactionCustomType,
    updateCustomField
}
