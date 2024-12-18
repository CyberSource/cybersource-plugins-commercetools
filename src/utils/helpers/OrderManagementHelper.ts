import { PtsV2PaymentsCapturesPost201Response, PtsV2PaymentsReversalsPost201Response } from "cybersource-rest-client";

import { Constants } from "../../constants/constants";
import paymentAuthorizationReversal from "../../service/payment/PaymentAuthorizationReversal";
import paymentRefund from "../../service/payment/PaymentRefundService";
import { ActionResponseType, ActionType, AmountPlannedType, PaymentTransactionType, PaymentType } from "../../types/Types";
import paymentActions from "../PaymentActions";
import paymentUtils from "../PaymentUtils";
import paymentValidator from "../PaymentValidator";

import paymentHelper from "./PaymentHelper";

/**
 * Process the response for Order Management service based on payment response and transaction details.
 * 
 * @param {any} paymentResponse - Payment response object.
 * @param {PaymentTransactionType} transactionDetail - Transaction details.
 * @param {string} captureId - Capture ID.
 * @param {number} pendingAmount - Pending amount.
 * @returns {ActionResponseType} - Object containing actions and errors.
 */
const getOMServiceResponse = (paymentResponse: PtsV2PaymentsCapturesPost201Response, transactionDetail: Partial<PaymentTransactionType>, captureId: string, pendingAmount: number): ActionResponseType => {
    let setCustomField: Partial<ActionType>;
    let paymentFailure: Partial<ActionType> | null = null;
    let setCustomType: Partial<ActionType> | null = null;
    let response: ActionResponseType = paymentUtils.getEmptyResponse();
    if (paymentResponse && transactionDetail) {
        if (Constants.API_STATUS_PENDING === paymentResponse.status || Constants.API_STATUS_REVERSED === paymentResponse.status) {
            setCustomField = paymentUtils.changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_SUCCESS);
            if (captureId && 0 <= pendingAmount) {
                setCustomType = paymentHelper.setTransactionCustomType(captureId, pendingAmount);
            }
            paymentFailure = null;
        } else {
            setCustomField = paymentUtils.changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_FAILURE);
            paymentFailure = paymentUtils.failureResponse(paymentResponse, transactionDetail);
        }
        const setTransaction = paymentUtils.setTransactionId(paymentResponse, transactionDetail);
        response = paymentActions.createResponse(setTransaction, setCustomField, paymentFailure, setCustomType);
    }
    return response;
};

/**
 * Calculates the pending capture amount based on the refund payment object.
 * 
 * @param {PaymentType} refundPaymentObj - Refund payment object.
 * @returns {number} - Pending capture amount.
 */
const getCapturedAmount = (refundPaymentObj: PaymentType): number => {
    let capturedAmount = 0;
    let refundedAmount = 0.0;
    let pendingCaptureAmount = 0;
    let refundTransaction: readonly Partial<PaymentTransactionType>[];
    if (refundPaymentObj) {
        const fractionDigits = refundPaymentObj.amountPlanned.fractionDigits;
        refundTransaction = refundPaymentObj.transactions;
        const indexValue = refundTransaction.findIndex((transaction, index) => {
            if (Constants.CT_TRANSACTION_TYPE_CHARGE === transaction.type) {
                return true;
            }
            return index;
        });
        if (0 <= indexValue) {
            for (let transaction of refundTransaction) {
                if (Constants.CT_TRANSACTION_TYPE_CHARGE === transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS === transaction.state && transaction?.amount?.centAmount) {
                    capturedAmount = capturedAmount + Number(transaction.amount.centAmount);
                }
                if (Constants.CT_TRANSACTION_TYPE_REFUND === transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS === transaction.state && transaction?.amount?.centAmount) {
                    refundedAmount = refundedAmount + Number(transaction.amount.centAmount);
                }
            }
            pendingCaptureAmount = capturedAmount - refundedAmount;
            pendingCaptureAmount = paymentUtils.convertCentToAmount(pendingCaptureAmount, fractionDigits);
        }
    }
    return pendingCaptureAmount;
};

/**
 * Calculates the pending authorized amount based on the capture payment object.
 * 
 * @param {PaymentType} capturePaymentObj - Capture payment object.
 * @returns {number} - Pending authorized amount.
 */
const getAuthorizedAmount = (capturePaymentObj: PaymentType): number => {
    let capturedAmount = 0.0;
    let pendingAuthorizedAmount = 0;
    if (capturePaymentObj) {
        const captureTransaction = capturePaymentObj.transactions;
        const fractionDigits = capturePaymentObj.amountPlanned.fractionDigits;
        const indexValue = captureTransaction.findIndex((transaction, index) => {
            if (Constants.CT_TRANSACTION_TYPE_AUTHORIZATION === transaction.type) {
                return true;
            }
            return index;
        });
        if (0 <= indexValue) {
            const authorizedAmount = Number(captureTransaction[indexValue]?.amount?.centAmount);
            captureTransaction.forEach((transaction) => {
                if (Constants.CT_TRANSACTION_TYPE_CHARGE === transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS === transaction.state) {
                    capturedAmount = capturedAmount + Number(transaction?.amount?.centAmount);
                }
            });
            pendingAuthorizedAmount = authorizedAmount - capturedAmount;
            pendingAuthorizedAmount = paymentUtils.convertCentToAmount(pendingAuthorizedAmount, fractionDigits);
        }
    }
    return pendingAuthorizedAmount;
};

/**
 * Handles authorization reversal response for the given payment update.
 * 
 * @param {PaymentType} updatePaymentObj - Updated payment object.
 * @param {any} cartObj - Cart object.
 * @param {any} paymentResponse - Payment response.
 * @param {ActionResponseType} updateActions - Updated actions.
 * @returns {Promise<ActionResponseType>} - Updated actions response.
 */
const handleAuthReversalResponse = async (updatePaymentObj: PaymentType, cartObj: any, paymentResponse: PtsV2PaymentsReversalsPost201Response | any, updateActions: ActionResponseType): Promise<ActionResponseType> => {
    const reversalAction = {
        action: 'addTransaction',
        transaction: {
            type: Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION,
            timestamp: paymentUtils.getDate(Date.now(), true),
            amount: {
                type: '',
                currencyCode: '',
                centAmount: 0,
                fractionDigits: 0,
            },
            state: '',
            interactionId: null,
        },
    };
    const authReversalResponse = await paymentAuthorizationReversal.getAuthReversalResponse(updatePaymentObj, cartObj, paymentResponse.transactionId);
    if (authReversalResponse && Constants.HTTP_SUCCESS_STATUS_CODE === authReversalResponse.httpCode && Constants.API_STATUS_REVERSED === authReversalResponse.status) {
        reversalAction.transaction.state = Constants.CT_TRANSACTION_STATE_SUCCESS;
    } else {
        reversalAction.transaction.state = Constants.CT_TRANSACTION_STATE_FAILURE;
    }
    reversalAction.transaction.amount = updatePaymentObj.amountPlanned;
    reversalAction.transaction.interactionId = authReversalResponse?.transactionId;
    updateActions.actions.push(reversalAction);
    return updateActions;
};

/**
 * Retrieves the refund response for the given payment update.
 * 
 * @param {PaymentType} updatePaymentObj - Updated payment object.
 * @param {PaymentTransactionType} updateTransactions - Updated transactions.
 * @param {string} orderNo - Order number.
 * @returns {Promise<ActionResponseType>} - Refund actions response.
 */
const getRefundResponse = async (updatePaymentObj: PaymentType, updateTransactions: Partial<PaymentTransactionType>, orderNo: string): Promise<ActionResponseType> => {
    let transactionState = Constants.CT_TRANSACTION_STATE_FAILURE;
    let iterateRefundAmount = 0;
    let pendingTransactionAmount = 0;
    let amountToBeRefunded = 0;
    let iterateRefund = 0;
    let availableCaptureAmount = 0;
    let chargeAmount = 0;
    let pendingAmount = 0;
    let refundAmount: number;
    let refundAction;
    let refundActions: ActionResponseType = paymentUtils.getEmptyResponse();
    let refundResponseObject = {
        captureId: '',
        transactionId: '',
        pendingTransactionAmount: 0
    };
    let setAction: Partial<ActionType> | null;
    const validTransaction = paymentValidator.isValidTransaction(updatePaymentObj, updateTransactions);
    if (updateTransactions.amount?.centAmount && validTransaction) {
        refundAmount = updateTransactions?.amount?.centAmount as number;
        iterateRefundAmount = refundAmount;
        if (refundAmount) {
            for (let transaction of updatePaymentObj.transactions) {
                if (Constants.CT_TRANSACTION_TYPE_CHARGE === transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS === transaction.state && transaction?.amount && transaction?.interactionId && transaction?.id) {
                    if (refundAmount === transaction.amount.centAmount && !(Constants.STRING_CUSTOM in transaction)) {
                        pendingAmount = transaction.amount.centAmount - refundAmount;
                        break;
                    } else if (transaction?.custom?.fields?.isv_availableCaptureAmount && refundAmount === transaction.custom.fields.isv_availableCaptureAmount) {
                        pendingAmount = transaction.custom.fields.isv_availableCaptureAmount - refundAmount;
                        break;
                    }
                    refundResponseObject = paymentUtils.getRefundResponseObject(transaction, pendingAmount);
                }
            }
            if (!refundResponseObject.captureId) {
                for (let transaction of updatePaymentObj.transactions) {
                    refundResponseObject.captureId = '';
                    const successfulChargeTransaction = paymentValidator.isSuccessFulChargeTransaction(transaction);
                    if (successfulChargeTransaction) {
                        availableCaptureAmount = transaction?.custom?.fields?.isv_availableCaptureAmount || 0;
                        chargeAmount = availableCaptureAmount || transaction?.amount?.centAmount || 0;
                        amountToBeRefunded = Math.min(iterateRefundAmount, chargeAmount);
                        updateTransactions.amount.centAmount = amountToBeRefunded;
                        refundResponseObject = paymentUtils.getRefundResponseObject(transaction, amountToBeRefunded);
                        pendingTransactionAmount = chargeAmount - amountToBeRefunded;
                        iterateRefundAmount -= amountToBeRefunded;
                        iterateRefund++;
                        const orderResponse = await paymentRefund.getRefundData(updatePaymentObj, refundResponseObject.captureId, updateTransactions, orderNo);
                        if (orderResponse && orderResponse.httpCode) {
                            if (1 === iterateRefund && 0 === iterateRefundAmount) {
                                refundActions = getOMServiceResponse(orderResponse, updateTransactions, refundResponseObject.transactionId, pendingTransactionAmount);
                            } else {
                                if (Constants.API_STATUS_PENDING === orderResponse.status) {
                                    transactionState = Constants.CT_TRANSACTION_STATE_SUCCESS;
                                    setAction = paymentHelper.setTransactionCustomType(refundResponseObject.transactionId, pendingTransactionAmount);
                                } else {
                                    setAction = paymentUtils.failureResponse(orderResponse, updateTransactions);
                                }
                                if (setAction) {
                                    refundActions.actions.push(setAction);
                                }
                                const amount = {
                                    type: updateTransactions.amount?.type,
                                    currencyCode: updateTransactions.amount?.currencyCode,
                                    fractionDigits: updateTransactions.amount?.fractionDigits,
                                    centAmount: amountToBeRefunded,
                                } as AmountPlannedType
                                refundAction = paymentActions.addRefundAction(amount, orderResponse, transactionState);
                                if (refundAction) {
                                    refundActions.actions.push(refundAction);
                                }
                            }
                        }
                    }
                }
            } else if (refundResponseObject?.captureId) {
                const orderResponse = await paymentRefund.getRefundData(updatePaymentObj, refundResponseObject.captureId, updateTransactions, orderNo);
                if (orderResponse && orderResponse.httpCode) {
                    refundActions = getOMServiceResponse(orderResponse, updateTransactions, refundResponseObject.transactionId, pendingTransactionAmount);
                }
            }
        }
    }
    return refundActions;
};
export default {
    getAuthorizedAmount,
    handleAuthReversalResponse,
    getCapturedAmount,
    getRefundResponse,
    getOMServiceResponse
}
