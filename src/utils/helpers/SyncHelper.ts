import { Cart, Payment, Transaction } from '@commercetools/platform-sdk';
import { PtsV2PaymentsPost201Response } from 'cybersource-rest-client';
import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from '../../constants/paymentConstants';
import createSearchRequest from '../../service/payment/CreateTransactionSearchRequest';
import getTransaction from '../../service/payment/GetTransactionData';
import { ActionResponseType, ActionType, AmountPlannedType, ApplicationsType, PaymentTransactionType, ReportSyncType } from '../../types/Types';
import { ApiError, errorHandler, PaymentProcessingError } from '../ErrorHandler';
import paymentActions from '../PaymentActions';
import paymentUtils from '../PaymentUtils';
import paymentValidator from '../PaymentValidator';
import commercetoolsApi from '../api/CommercetoolsApi';
import multiMid from '../config/MultiMid';
import cartHelper from './CartHelper';
import orderManagementHelper from './OrderManagementHelper';


/**
 * Initializes a sync update object with default values.
 * 
 * @returns {ReportSyncType} - An object representing the sync update with default values.
 */
const initializeSyncUpdateObject = (): ReportSyncType => ({
    id: '',
    transactionId: '',
    version: 0,
    interactionId: '',
    amountPlanned: {
        currencyCode: '',
        centAmount: 0,
    },
    type: '',
    state: ''
});

/**
 * Updates the authorization status on a reversal if both the authorization and cancel authorization transactions are successful.
 * 
 * @param {any} updateSyncResponse - The response object containing transaction details to be updated.
 */
const updateAuthStatusOnReversal = async (updateSyncResponse: any) => {
    const authorizationTransaction = await updateSyncResponse.transactions.find((transaction: Partial<PaymentTransactionType>) => transaction.type === Constants.CT_TRANSACTION_TYPE_AUTHORIZATION && transaction.state === Constants.CT_TRANSACTION_STATE_FAILURE);
    const cancelAuthTransaction = await updateSyncResponse.transactions.find((transaction: Partial<PaymentTransactionType>) => transaction.type === Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION && transaction.state === Constants.CT_TRANSACTION_STATE_SUCCESS);
    if (authorizationTransaction && cancelAuthTransaction && authorizationTransaction?.id && Constants.CT_TRANSACTION_STATE_SUCCESS === cancelAuthTransaction?.state && Constants.CT_TRANSACTION_STATE_FAILURE === authorizationTransaction?.state) {
        const updateTransactionObject = {
            id: updateSyncResponse.id,
            version: updateSyncResponse.version,
            state: Constants.CT_TRANSACTION_STATE_SUCCESS,
        };
        commercetoolsApi.updateDecisionSync(updateTransactionObject, authorizationTransaction.id);
    }
}

/**
 * Retrieves the sync response based on payment details and the transaction element.
 * 
 * @param {Payment} paymentDetails - The payment details object.
 * @param {any} transactionElement - The transaction element containing application information.
 * @returns {Promise<any>} - A promise that resolves to the update sync response.
 */
const retrieveSyncResponse = async (paymentDetails: Payment, transactionElement: any): Promise<any> => {
    let isRowPresent = false;
    const syncUpdateObject: ReportSyncType = initializeSyncUpdateObject();
    let updateSyncResponse;
    const processPaymentDetails = validatePaymentDetails(paymentDetails, transactionElement);
    if (processPaymentDetails) {
        const { transactions } = paymentDetails;
        const { applications } = transactionElement.applicationInformation;

        if (applications && transactions) {
            const applicationResponse = await getApplicationsPresent(applications);
            if (applicationResponse) {
                isRowPresent = checkTransaction(transactions, transactionElement.id);
                if (!isRowPresent) {
                    updateSyncObjectDetails(syncUpdateObject, paymentDetails, transactionElement.id);
                    const amountDetails = await retrieveSyncAmountDetails(paymentDetails, transactionElement, applicationResponse);
                    updateSyncObjectAmountDetails(syncUpdateObject, amountDetails);
                    updateSyncResponse = await processApplicationResponse(applicationResponse, paymentDetails, syncUpdateObject, transactionElement);
                    const updateCardDetails = validateUpdateCardDetails(paymentDetails)
                    if (updateSyncResponse && updateCardDetails) {
                        await cartHelper.updateCardDetails(paymentDetails, updateSyncResponse.version, transactionElement.id);
                    }
                }
            }
        }
    }
    return updateSyncResponse;
};

/**
 * Validates the payment details and transaction element.
 * 
 * @param {Payment} paymentDetails - The payment details object.
 * @param {any} transactionElement - The transaction element to validate against.
 * @returns {boolean} - True if both paymentDetails and transactionElement are valid, otherwise false.
 */
const validatePaymentDetails = (paymentDetails: Payment, transactionElement: any): boolean => {
    return paymentDetails && transactionElement && Constants.STRING_TRANSACTIONS in paymentDetails;
};

/**
 * Checks if a transaction with the given ID is already present in the transactions array.
 * 
 * @param {any[]} transactions - The array of transaction objects.
 * @param {string} transactionId - The transaction ID to check.
 * @returns {boolean} - True if the transaction is present, otherwise false.
 */
const checkTransaction = (transactions: any[], transactionId: string): boolean => {
    return transactions.some((item: any) => item.interactionId === transactionId);
};

/**
 * Updates the sync update object with payment details and transaction ID.
 * 
 * @param {ReportSyncType} syncUpdateObject - The sync update object to update.
 * @param {Payment} paymentDetails - The payment details object.
 * @param {string} transactionId - The transaction ID to set.
 */
const updateSyncObjectDetails = (syncUpdateObject: ReportSyncType, paymentDetails: Payment, transactionId: string): void => {
    syncUpdateObject.id = paymentDetails.id;
    syncUpdateObject.version = paymentDetails.version;
    syncUpdateObject.interactionId = transactionId;
};

/**
 * Updates the amount details in the sync update object.
 * 
 * @param {ReportSyncType} syncUpdateObject - The sync update object to update.
 * @param {any} amountDetails - The amount details to set in the object.
 */
const updateSyncObjectAmountDetails = (syncUpdateObject: ReportSyncType, amountDetails: any): void => {
    syncUpdateObject.amountPlanned.currencyCode = amountDetails?.currencyCode;
    syncUpdateObject.amountPlanned.centAmount = amountDetails?.centAmount;
};

/**
 * Validates if the card details need to be updated based on the payment method.
 * 
 * @param {Payment} paymentDetails - The payment details object.
 * @returns {boolean} - True if the card details need to be updated, otherwise false.
 */
const validateUpdateCardDetails = (paymentDetails: Payment): boolean => {
    if (paymentDetails?.paymentMethodInfo?.method) {
        return [Constants.CLICK_TO_PAY, Constants.APPLE_PAY].includes(paymentDetails?.paymentMethodInfo?.method);
    }
    return false;
};

/**
 * Processes the application response based on the application information present.
 * 
 * @param {any} applicationResponse - The application response object containing status flags.
 * @param {Payment} paymentDetails - The payment details object.
 * @param {ReportSyncType} syncUpdateObject - The sync update object to update.
 * @param {any} transactionElement - The transaction element containing application information.
 * @returns {Promise<any>} - A promise that resolves to the update sync response.
 */
const processApplicationResponse = async (applicationResponse: any, paymentDetails: Payment, syncUpdateObject: ReportSyncType, transactionElement: any): Promise<any> => {
    let updateSyncResponse;

    if (applicationResponse.authPresent) {
        syncUpdateObject.type = determineTransactionType(paymentDetails, applicationResponse);
        updateSyncResponse = await runSyncAddTransaction(syncUpdateObject, transactionElement.applicationInformation.reasonCode, applicationResponse.authPresent, applicationResponse.authReasonCodePresent);
    } else if (applicationResponse.capturePresent) {
        updateSyncResponse = await updateResponseIfCapturePresent(paymentDetails, syncUpdateObject, transactionElement, applicationResponse);
    } else if (applicationResponse.authReversalPresent) {
        syncUpdateObject.type = Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION;
        updateSyncResponse = await runSyncAddTransaction(syncUpdateObject, transactionElement.applicationInformation.reasonCode, applicationResponse.authPresent, applicationResponse.authReasonCodePresent);
        if (updateSyncResponse?.transactions) {
            await updateAuthStatusOnReversal(updateSyncResponse);
        }
    } else if (applicationResponse.refundPresent) {
        syncUpdateObject.type = Constants.CT_TRANSACTION_TYPE_REFUND;
        updateSyncResponse = await runSyncAddTransaction(syncUpdateObject, transactionElement.applicationInformation.reasonCode, applicationResponse.authPresent, applicationResponse.authReasonCodePresent);
    }
    return updateSyncResponse;
};

/**
 * Determines the transaction type based on payment details and application response.
 * 
 * @param {Payment} paymentDetails - The payment details object.
 * @param {any} applicationResponse - The application response object.
 * @returns {string} - The determined transaction type.
 */
const determineTransactionType = (paymentDetails: Payment, applicationResponse: any): string => {
    if (Constants.ECHECK === paymentDetails.paymentMethodInfo.method) {
        return Constants.CT_TRANSACTION_TYPE_CHARGE;
    } else {
        return applicationResponse.capturePresent && applicationResponse.captureReasonCodePresent
            ? Constants.CT_TRANSACTION_TYPE_CHARGE
            : Constants.CT_TRANSACTION_TYPE_AUTHORIZATION;
    }
};

/**
 * Updates the response if a capture is present, determining if the card details should be updated.
 * 
 * @param {Payment} paymentDetails - The payment details object.
 * @param {ReportSyncType} syncUpdateObject - The sync update object to update.
 * @param {any} transactionElement - The transaction element containing application information.
 * @param {any} applicationResponse - The application response object.
 * @returns {Promise<any>} - A promise that resolves to the update sync response.
 */
const updateResponseIfCapturePresent = async (paymentDetails: Payment, syncUpdateObject: ReportSyncType, transactionElement: any, applicationResponse: any): Promise<any> => {
    let updateSyncResponse;
    if (paymentDetails?.custom?.fields?.isv_saleEnabled && Constants.CT_TRANSACTION_TYPE_CHARGE === paymentDetails.transactions[0].type) {
        const transactionObj = {
            paymentId: paymentDetails.id,
            version: paymentDetails.version,
            transactionId: paymentDetails.transactions[0].id,
            interactionId: transactionElement.id,
        };
        updateSyncResponse = await commercetoolsApi.changeTransactionInteractionId(transactionObj);
    } else {
        syncUpdateObject.type = Constants.CT_TRANSACTION_TYPE_CHARGE;
        updateSyncResponse = await runSyncAddTransaction(syncUpdateObject, transactionElement.applicationInformation.reasonCode, applicationResponse.authPresent, applicationResponse.authReasonCodePresent);
    }

    return updateSyncResponse;
};

/**
 * Runs sync add transaction based on the provided sync update object and reason code.
 * 
 * @param {ReportSyncType} syncUpdateObject - The sync update object.
 * @param {string} reasonCode - The reason code.
 * @param {boolean} authPresent - Whether authorization is present.
 * @param {boolean} authReasonCodePresent - Whether authorization reason code is present.
 * @returns {Promise<Payment | null>} - The updated sync response.
 */
const runSyncAddTransaction = async (syncUpdateObject: ReportSyncType, reasonCode: string, authPresent: boolean, authReasonCodePresent: boolean): Promise<Payment | null> => {
    let isAuthReversalTriggeredFlag = false;
    let refundAmount = 0.0;
    let updateSyncResponse: Payment | null = null;
    let paymentDetails: Payment | null;
    if (syncUpdateObject && reasonCode && syncUpdateObject?.id) {
        if (Constants.PAYMENT_GATEWAY_SUCCESS_REASON_CODE === reasonCode && Constants.CT_TRANSACTION_TYPE_REFUND !== syncUpdateObject.type) {
            syncUpdateObject.state = Constants.CT_TRANSACTION_STATE_SUCCESS;
            updateSyncResponse = await commercetoolsApi.syncAddTransaction(syncUpdateObject);
        } else if (Constants.PAYMENT_GATEWAY_SUCCESS_REASON_CODE === reasonCode && Constants.CT_TRANSACTION_TYPE_REFUND === syncUpdateObject.type) {
            syncUpdateObject.state = Constants.CT_TRANSACTION_STATE_SUCCESS;
            updateSyncResponse = await commercetoolsApi.syncAddTransaction(syncUpdateObject);
            refundAmount = syncUpdateObject.amountPlanned.centAmount;
            updateSyncResponse = await runSyncUpdateCaptureAmount(updateSyncResponse, refundAmount);
        } else if (Constants.PAYMENT_GATEWAY_ERROR_REASON_CODE === reasonCode && authPresent && authReasonCodePresent) {
            syncUpdateObject.state = Constants.CT_TRANSACTION_STATE_PENDING;
            updateSyncResponse = await commercetoolsApi.syncAddTransaction(syncUpdateObject);
        } else if (Constants.PAYMENT_GATEWAY_FAILURE_REASON_CODE === reasonCode && authPresent && authReasonCodePresent) {
            syncUpdateObject.state = Constants.CT_TRANSACTION_STATE_SUCCESS;
            updateSyncResponse = await commercetoolsApi.syncAddTransaction(syncUpdateObject);
            const query = Constants.PAYMENT_GATEWAY_CLIENT_REFERENCE_CODE + syncUpdateObject.id + Constants.STRING_AND + Constants.STRING_SYNC_QUERY;
            paymentDetails = await commercetoolsApi.retrievePayment(syncUpdateObject?.id);
            if (paymentDetails) {
                isAuthReversalTriggeredFlag = await isAuthReversalTriggered(paymentDetails, query);
            }
            if (!isAuthReversalTriggeredFlag) {
                const authReversalObject = paymentUtils.createTransactionObject(updateSyncResponse?.version, syncUpdateObject.amountPlanned as AmountPlannedType, Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION, Constants.CT_TRANSACTION_STATE_INITIAL, undefined, undefined);
                updateSyncResponse = await commercetoolsApi.addTransaction(authReversalObject, syncUpdateObject?.id);
            }
        } else if (((Constants.PAYMENT_GATEWAY_ERROR_REASON_CODE === reasonCode || Constants.PAYMENT_GATEWAY_FAILURE_REASON_CODE === reasonCode) && authPresent && !authReasonCodePresent) || (Constants.PAYMENT_GATEWAY_SUCCESS_REASON_CODE !== reasonCode && '475' !== reasonCode)) {
            syncUpdateObject.state = Constants.CT_TRANSACTION_STATE_FAILURE;
            updateSyncResponse = await commercetoolsApi.syncAddTransaction(syncUpdateObject);
        }
    }
    return updateSyncResponse;
};

/**
 * Checks if an authorization reversal is triggered for a payment.
 * 
 * @param {Payment} paymentDetails - Payment details.
 * @param {string} query - Query string for search.
 * @returns {Promise<boolean>} - Whether an authorization reversal is triggered.
 */
const isAuthReversalTriggered = async (paymentDetails: Payment, query: string): Promise<boolean> => {
    let isAuthReverseTriggered = false;
    let applications: Partial<ApplicationsType>[];
    let transactions: Transaction[];
    let paymentObj: Payment | null = null;
    const mid = paymentDetails?.custom?.fields?.isv_merchantId ? paymentDetails.custom.fields.isv_merchantId : '';
    const authMid = multiMid.getMidCredentials(mid);
    const transactionDetail = await createSearchRequest.getTransactionSearchResponse(query, 50, Constants.STRING_SYNC_SORT, authMid);
    if (transactionDetail && Constants.HTTP_SUCCESS_STATUS_CODE === transactionDetail.httpCode && transactionDetail?.data?._embedded?.transactionSummaries) {
        const transactionSummaries = transactionDetail.data._embedded.transactionSummaries;
        for (let element of transactionSummaries) {
            applications = element.applicationInformation.applications;
            for (let application of applications) {
                paymentObj = null;
                if (Constants.STRING_SYNC_AUTH_REVERSAL_NAME === application.name) {
                    paymentObj = await commercetoolsApi.retrievePayment(element.clientReferenceInformation.code);
                    if (paymentObj?.transactions?.length && applications) {
                        transactions = paymentObj.transactions;
                        if (transactions.some((transaction: Transaction) => transaction.interactionId === element.id)) {
                            if (Constants.APPLICATION_RCODE === application.rCode && Constants.APPLICATION_RFLAG === application.rFlag) {
                                isAuthReverseTriggered = true;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    return isAuthReverseTriggered;
};


/**
 * Looks up whether the gateway already holds a successful authorization reversal for this payment.
 *
 * Unlike isAuthReversalTriggered this does not require a matching commercetools transaction, so it also
 * detects reversals raised manually from EBC, which the connector never recorded.
 *
 * @param {Payment} paymentDetails - Payment details.
 * @returns {Promise<'PRESENT' | 'ABSENT' | 'UNKNOWN'>} - Reversal state at the gateway, UNKNOWN when the search fails.
 */
const getGatewayAuthReversalState = async (paymentDetails: Payment): Promise<'PRESENT' | 'ABSENT' | 'UNKNOWN'> => {
    // Follow-on requests are sent with isv_clientReferenceCode when present, so search on the same value.
    const clientReferenceCode = paymentDetails?.custom?.fields?.isv_clientReferenceCode || paymentDetails.id;
    if (!clientReferenceCode) {
        return 'UNKNOWN';
    }
    const query = Constants.PAYMENT_GATEWAY_CLIENT_REFERENCE_CODE + clientReferenceCode + Constants.STRING_AND + Constants.STRING_AUTH_REVERSAL_LOOKUP_QUERY;
    const mid = paymentDetails?.custom?.fields?.isv_merchantId ? paymentDetails.custom.fields.isv_merchantId : '';
    const authMid = multiMid.getMidCredentials(mid);
    const transactionDetail = await createSearchRequest.getTransactionSearchResponse(query, 50, Constants.STRING_SYNC_SORT, authMid);
    if (!transactionDetail || Constants.HTTP_SUCCESS_STATUS_CODE !== transactionDetail.httpCode) {
        return 'UNKNOWN';
    }
    const transactionSummaries = transactionDetail?.data?._embedded?.transactionSummaries || [];
    const reversalPresent = transactionSummaries.some((summary: any) =>
        summary?.applicationInformation?.applications?.some((application: Partial<ApplicationsType>) =>
            Constants.STRING_SYNC_AUTH_REVERSAL_NAME === application.name
            && Constants.APPLICATION_RCODE === application.rCode
            && Constants.APPLICATION_RFLAG === application.rFlag
        )
    );
    return reversalPresent ? 'PRESENT' : 'ABSENT';
};

/**
 * Polls the gateway for an authorization reversal, allowing time for a reversal raised alongside the
 * reject to reach the Transaction Search index.
 *
 * @param {Payment} paymentDetails - Payment details.
 * @returns {Promise<'PRESENT' | 'ABSENT' | 'UNKNOWN'>} - Reversal state at the gateway.
 */
const awaitGatewayAuthReversalState = async (paymentDetails: Payment): Promise<'PRESENT' | 'ABSENT' | 'UNKNOWN'> => {
    let gatewayReversalState: 'PRESENT' | 'ABSENT' | 'UNKNOWN' = 'UNKNOWN';
    for (let attempt = 1; attempt <= Constants.PAYMENT_GATEWAY_AUTH_REVERSAL_LOOKUP_MAX_RETRY; attempt++) {
        if (1 < attempt) {
            await new Promise((resolve) => setTimeout(resolve, Constants.PAYMENT_GATEWAY_AUTH_REVERSAL_LOOKUP_DELAY));
        }
        gatewayReversalState = await getGatewayAuthReversalState(paymentDetails);
        paymentUtils.logData(__filename, FunctionConstant.FUNC_UPDATE_DECISION_SYNC, Constants.LOG_INFO, 'PaymentId : ' + paymentDetails.id, `Authorization reversal lookup attempt ${attempt} returned ${gatewayReversalState}.`);
        if ('PRESENT' === gatewayReversalState) {
            break;
        }
    }
    return gatewayReversalState;
};


/**
* Retrieves sync amount details based on the payment details and application response.
* 
* @param {Payment} paymentDetails - The payment details.
* @param {any} element - The transaction element.
* @param {any} applicationResponse - The application response.
* @returns {Promise<{ centAmount: number, currencyCode: string }>} - The sync amount object.
*/
const retrieveSyncAmountDetails = async (paymentDetails: Payment, element: any, applicationResponse: any): Promise<{ centAmount: number, currencyCode: string }> => {
    const fractionDigits = paymentDetails.amountPlanned.fractionDigits;
    const syncAmountObject = {
        centAmount: 0,
        currencyCode: '',
    };
    const {
        orderInformation, orderInformation: {
            amountDetails: { currency, totalAmount },
        },
    } = element;
    if (applicationResponse.authPresent || applicationResponse.capturePresent || applicationResponse.authReversalPresent) {
        syncAmountObject.currencyCode = (orderInformation && orderInformation.amountDetails && currency) ? currency : paymentDetails.amountPlanned.currencyCode;
        syncAmountObject.centAmount = (orderInformation && orderInformation.amountDetails && totalAmount) ? paymentUtils.convertAmountToCent(Number(totalAmount), fractionDigits) : paymentDetails.amountPlanned.centAmount;
        if (!applicationResponse.authReasonCodePresent) {
            if (applicationResponse.capturePresent && applicationResponse.captureReasonCodePresent) {
                syncAmountObject.centAmount = paymentUtils.convertAmountToCent(Number(totalAmount), fractionDigits);
                syncAmountObject.currencyCode = currency;
            }
        }
    } else {
        syncAmountObject.currencyCode = currency;
        syncAmountObject.centAmount = paymentUtils.convertAmountToCent(Number(totalAmount), fractionDigits);
    }
    return syncAmountObject;
};

/**
 * Updates the capture amount for a payment transaction.
 * 
 * @param {Payment | null} updatePaymentObj - The payment object containing updated payment details.
 * @param {number} amount - The amount to be updated.
 * @returns {Promise<any>} - The updated response.
 */
const runSyncUpdateCaptureAmount = async (updatePaymentObj: Payment | null, amount: number): Promise<any> => {

    if (!updatePaymentObj || 0 >= amount) {
        return null;
    }

    const { id: paymentId, version: initialPaymentVersion, transactions: updateTransactions } = updatePaymentObj || {};
    let paymentVersion = initialPaymentVersion;
    let updateResponse: any;
    for (const transaction of updateTransactions) {
        if (transaction.id && transaction.type === Constants.CT_TRANSACTION_TYPE_CHARGE && transaction.state === Constants.CT_TRANSACTION_STATE_SUCCESS && transaction.amount) {
            const updateAmount = getUpdateAmount(transaction, amount);
            if (updateAmount) {
                updateResponse = await commercetoolsApi.updateAvailableAmount(paymentId, paymentVersion, transaction.id, updateAmount);
                if (updateResponse) paymentVersion = updateResponse.version;
                break;
            }
        }
    }
    if (!updateResponse) {
        for (const transaction of updateTransactions) {
            updateResponse = await processRunSyncUpdateCaptureAmount(transaction, paymentId, paymentVersion, amount, 0);
            if (updateResponse) paymentVersion = updateResponse.version;
        }
    }
    return updateResponse;
};


/**
 * Handles decision synchronization for payment transactions based on conversion details.
 * 
 * @param {any} conversionDetails - Conversion details containing merchant reference numbers and new decisions.
 * @returns {Promise<boolean>} - Indicates whether conversion is present.
 */
/**
 * Matches the webhook's requestId/captureRequestId against a payment's transactions and selects
 * the pending transaction the decision sync should update, with a fallback summary for logging.
 */
const selectMatchingSyncTransaction = (
    transactions: Partial<PaymentTransactionType>[],
    requestId: string,
    captureRequestId: string,
    settlementSucceeded: boolean,
    requestedDecision: string,
    captureStatus: string,
): {
    selectedTransaction: Partial<PaymentTransactionType> | null;
    additionalTransaction: Partial<PaymentTransactionType> | null;
    selectionLogData: Record<string, unknown>;
} => {
    const matchingTransactions = (requestId || captureRequestId)
        ? transactions.filter((transaction: Partial<PaymentTransactionType>) =>
            transaction.interactionId === requestId ||
            transaction.interactionId === captureRequestId ||
            transaction.id === requestId ||
            transaction.id === captureRequestId
        )
        : [];

    let pendingCharge = matchingTransactions.find((tx: Partial<PaymentTransactionType>) =>
        tx.type === Constants.CT_TRANSACTION_TYPE_CHARGE && tx.state === Constants.CT_TRANSACTION_STATE_PENDING
    );
    if (!pendingCharge && settlementSucceeded && captureRequestId) {
        pendingCharge = transactions.find((tx: Partial<PaymentTransactionType>) =>
            tx.type === Constants.CT_TRANSACTION_TYPE_CHARGE && tx.state === Constants.CT_TRANSACTION_STATE_PENDING
        );
    }

    const pendingAuthorization = matchingTransactions.find((tx: Partial<PaymentTransactionType>) =>
        tx.type === Constants.CT_TRANSACTION_TYPE_AUTHORIZATION && tx.state === Constants.CT_TRANSACTION_STATE_PENDING
    );
    const initialAuthorization = matchingTransactions.find((tx: Partial<PaymentTransactionType>) =>
        tx.type === Constants.CT_TRANSACTION_TYPE_AUTHORIZATION && tx.state === Constants.CT_TRANSACTION_STATE_INITIAL
    );
    let selectedTransaction: Partial<PaymentTransactionType> | null = null;
    let additionalTransaction: Partial<PaymentTransactionType> | null = null;

    if (pendingCharge) {
        selectedTransaction = pendingCharge;
    } else if (pendingAuthorization) {
        selectedTransaction = pendingAuthorization;
    } else if (!matchingTransactions.length) {
        selectedTransaction = transactions[transactions.length - 1];
    }
    let chargeFoundViaFallback = false;
    if (requestedDecision === Constants.HTTP_STATUS_DECISION_ACCEPT && settlementSucceeded && selectedTransaction?.type === Constants.CT_TRANSACTION_TYPE_AUTHORIZATION && pendingCharge) {
        additionalTransaction = pendingCharge;
        chargeFoundViaFallback = !matchingTransactions.find((tx: Partial<PaymentTransactionType>) => tx.id === pendingCharge.id);
    }
    const transactionSummary = matchingTransactions.map((tx: Partial<PaymentTransactionType>) => ({
        id: tx.id,
        type: tx.type,
        state: tx.state,
        interactionId: tx.interactionId,
        amount: tx.amount?.centAmount,
    }));

    const selectionLogData = {
        requestId: requestId || 'N/A',
        captureRequestId: captureRequestId || 'N/A',
        settlementSucceeded,
        matchedTransactionCount: matchingTransactions.length,
        matchedTransactions: transactionSummary,
        pendingChargeFound: !!pendingCharge,
        chargeFoundViaFallback,
        pendingAuthorizationFound: !!pendingAuthorization,
        initialAuthorizationFound: !!initialAuthorization,
        selectedTransactionId: selectedTransaction?.id || 'NONE',
        selectedTransactionType: selectedTransaction?.type || 'NONE',
        selectedTransactionState: selectedTransaction?.state || 'NONE',
        additionalTransactionId: additionalTransaction?.id || 'NONE',
        additionalTransactionType: additionalTransaction?.type || 'NONE',
        captureStatus,
    };

    return { selectedTransaction, additionalTransaction, selectionLogData };
};

const updateDecisionSyncService = async (conversionDetails: any): Promise<boolean> => {
    let isConversionPresent = false;
    if (conversionDetails) {
        for (const element of conversionDetails) {
            const merchantReferenceNumber = element?.merchantReferenceNumber || '';
            const requestedDecision = element?.newDecision || '';
            const decisionSource = element?.source || 'Decision sync';
            const requestId = element?.requestId || '';
            const captureRequestId = element?.captureRequestId || '';
            const captureStatus = element?.captureStatus || '';
            const settlementSucceeded = element?.settlementSucceeded || false;
            let paymentDetails = merchantReferenceNumber ? await commercetoolsApi.retrievePayment(merchantReferenceNumber) : null;
            if (!paymentDetails && merchantReferenceNumber) {
                paymentDetails = await commercetoolsApi.retrievePaymentByClientReferenceCode(merchantReferenceNumber);
            }
            if (paymentDetails && paymentDetails?.transactions && paymentDetails.transactions.length) {
                const { selectedTransaction, additionalTransaction, selectionLogData } = selectMatchingSyncTransaction(
                    paymentDetails.transactions,
                    requestId,
                    captureRequestId,
                    settlementSucceeded,
                    requestedDecision,
                    captureStatus,
                );

                if (selectedTransaction && (Constants.CT_TRANSACTION_TYPE_AUTHORIZATION === selectedTransaction.type || Constants.CT_TRANSACTION_TYPE_CHARGE === selectedTransaction.type) && (Constants.CT_TRANSACTION_STATE_PENDING === selectedTransaction.state || (Constants.CT_TRANSACTION_STATE_INITIAL === selectedTransaction.state && requestedDecision === Constants.HTTP_STATUS_DECISION_ACCEPT)) && selectedTransaction?.id) {

                    // A rejected authorization is still live at the gateway, so mark it Success and void it instead of
                    // leaving it as Failure. getInteractionId only resolves the authReversalId from a Success/Initial authorization.
                    const existingCancelAuthorization = paymentDetails.transactions.some((tx: Partial<PaymentTransactionType>) =>
                        tx.type === Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION && tx.state !== Constants.CT_TRANSACTION_STATE_FAILURE
                    );
                    let reverseAuthorizationOnReject = Constants.HTTP_STATUS_DECISION_REJECT === requestedDecision
                        && Constants.CT_TRANSACTION_TYPE_AUTHORIZATION === selectedTransaction.type
                        && !!selectedTransaction.amount
                        && !existingCancelAuthorization;
                    if (reverseAuthorizationOnReject) {
                        // A reversal raised from EBC has no commercetools transaction, so the gateway is the only source of truth.
                        const gatewayReversalState = await awaitGatewayAuthReversalState(paymentDetails);
                        if ('ABSENT' !== gatewayReversalState) {
                            reverseAuthorizationOnReject = false;
                            paymentUtils.logData(__filename, FunctionConstant.FUNC_UPDATE_DECISION_SYNC, Constants.LOG_WARN, 'PaymentId : ' + paymentDetails.id, `${decisionSource} skipping authorization reversal for transactionId=${selectedTransaction.id} because gateway reversal state is ${gatewayReversalState}.`);
                        }
                    }

                    let decision = '';
                    switch (requestedDecision) {
                        case Constants.HTTP_STATUS_DECISION_ACCEPT:
                            decision = Constants.CT_TRANSACTION_STATE_SUCCESS;
                            break;
                        case Constants.HTTP_STATUS_DECISION_REJECT:

                            decision = reverseAuthorizationOnReject ? Constants.CT_TRANSACTION_STATE_SUCCESS : Constants.CT_TRANSACTION_STATE_FAILURE;

                            break;
                        default:
                            paymentUtils.logData(__filename, FunctionConstant.FUNC_UPDATE_DECISION_SYNC, Constants.LOG_WARN, '', `${decisionSource} webhook ignored for merchantReferenceNumber=${merchantReferenceNumber} because decision=${requestedDecision} is not supported.`);
                            continue;
                    }
                    const transactionInteractionId = requestId && requestId !== selectedTransaction.interactionId ? requestId : '';
                    const decisionUpdateObject = {
                        id: paymentDetails.id,
                        version: paymentDetails.version,
                        state: decision,
                        interactionId: transactionInteractionId,
                    };
                    const updateResponse: any = await commercetoolsApi.updateDecisionSync(decisionUpdateObject, selectedTransaction.id);
                    if (updateResponse) {
                        isConversionPresent = true;
                        paymentUtils.logData(__filename, FunctionConstant.FUNC_UPDATE_DECISION_SYNC, Constants.LOG_INFO, 'PaymentId : ' + paymentDetails.id, `${decisionSource} successfully updated transactionId=${selectedTransaction.id} to state=${decision}.`);
                        if (reverseAuthorizationOnReject) {
                            // The API extension picks up this Initial CancelAuthorization and calls the gateway reversal.
                            const authReversalObject = paymentUtils.createTransactionObject(updateResponse.version, selectedTransaction.amount as AmountPlannedType, Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION, Constants.CT_TRANSACTION_STATE_INITIAL, undefined, undefined);
                            const authReversalResponse = await commercetoolsApi.addTransaction(authReversalObject, paymentDetails.id);
                            paymentUtils.logData(__filename, FunctionConstant.FUNC_UPDATE_DECISION_SYNC, Constants.LOG_INFO, 'PaymentId : ' + paymentDetails.id, `${decisionSource} added CancelAuthorization transaction for rejected authorizationId=${selectedTransaction.id}. Added=${!!authReversalResponse}.`);
                        }
                        if (additionalTransaction && additionalTransaction.id) {
                            const chargeDecision = requestedDecision === Constants.HTTP_STATUS_DECISION_ACCEPT ? Constants.CT_TRANSACTION_STATE_SUCCESS : Constants.CT_TRANSACTION_STATE_FAILURE;
                            const chargeUpdateObject = {
                                id: paymentDetails.id,
                                version: updateResponse.version,
                                state: chargeDecision,
                                interactionId: captureRequestId || '',
                            };
                            await commercetoolsApi.updateDecisionSync(chargeUpdateObject, additionalTransaction.id);
                        }
                    } else {
                        paymentUtils.logData(__filename, FunctionConstant.FUNC_UPDATE_DECISION_SYNC, Constants.LOG_WARN, 'PaymentId : ' + paymentDetails.id, `${decisionSource} webhook did not update transactionId=${selectedTransaction.id}.`);
                    }
                } else {
                    paymentUtils.logData(__filename, FunctionConstant.FUNC_UPDATE_DECISION_SYNC, Constants.LOG_WARN, 'PaymentId : ' + paymentDetails.id, `${decisionSource} webhook could not find suitable pending transaction. Details: ${JSON.stringify(selectionLogData)}`);
                }
            } else {
                paymentUtils.logData(__filename, FunctionConstant.FUNC_UPDATE_DECISION_SYNC, Constants.LOG_WARN, '', `${decisionSource} webhook did not find a payment for merchantReferenceNumber=${merchantReferenceNumber}, requestId=${requestId}.`);
            }
        }
    }
    return isConversionPresent;
};


/**
* Processes sync update capture amount based on the provided transaction details.
* 
* @param {PaymentTransactionType} transaction - The transaction details.
* @param {string} paymentId - The payment ID.
* @param {number} paymentVersion - The payment version.
* @param {number} refundAmount - The refund amount.
* @param {number} pendingTransactionAmount - The pending transaction amount.
* @returns {Promise<any>} - The update response.
*/
const processRunSyncUpdateCaptureAmount = async (transaction: Transaction, paymentId: string, paymentVersion: number, refundAmount: number, pendingTransactionAmount: number): Promise<any> => {
    let transactionId = '';
    let refundAmountUsed = 0;
    let updateResponse;
    const {
        custom,
        custom: {
            fields: { isv_availableCaptureAmount },
        },
        amount: { centAmount },
    }: any = transaction;
    if (transaction && transaction?.id && Constants.CT_TRANSACTION_TYPE_CHARGE === transaction.type && Constants.CT_TRANSACTION_STATE_SUCCESS === transaction.state && 0 < refundAmount) {
        transactionId = transaction.id;
        if (isv_availableCaptureAmount && refundAmount <= isv_availableCaptureAmount && transactionId) {
            refundAmountUsed = refundAmount;
            pendingTransactionAmount = isv_availableCaptureAmount - refundAmountUsed;
        } else if (isv_availableCaptureAmount && refundAmount >= isv_availableCaptureAmount && transactionId) {
            refundAmountUsed = Number(isv_availableCaptureAmount);
            pendingTransactionAmount = isv_availableCaptureAmount - refundAmountUsed;
        } else if (centAmount && refundAmount <= centAmount && !custom && transactionId) {
            refundAmountUsed = refundAmount;
            pendingTransactionAmount = centAmount - refundAmountUsed;
        } else if (centAmount && refundAmount >= centAmount && !custom && transactionId) {
            refundAmountUsed = centAmount;
            pendingTransactionAmount = centAmount - refundAmountUsed;
        }
    }
    if (transactionId) {
        updateResponse = await commercetoolsApi.updateAvailableAmount(paymentId, paymentVersion, transactionId, pendingTransactionAmount);
    }
    return updateResponse;
};

/**
 * Calculates the updated amount after a refund for a given transaction.
 * 
 * 
 * @param {Transaction} transaction - The transaction object containing 
 *        the amount and custom fields to evaluate.
 * @param {number} refundAmount - The amount to be refunded.
 * @returns {number | null} - The updated amount after applying the refund, or null if 
 *        the conditions are not met.
 */
const getUpdateAmount = (transaction: Transaction, refundAmount: number): number | null => {
    let returnAmount: number | null = null;
    if (transaction.amount?.centAmount === refundAmount && !transaction?.custom) {
        returnAmount = (transaction.amount.centAmount - refundAmount);
    }
    if (transaction.custom?.fields) {
        const availableCaptureAmount = transaction.custom.fields.isv_availableCaptureAmount;
        if (availableCaptureAmount !== undefined && refundAmount <= availableCaptureAmount) {
            returnAmount = (availableCaptureAmount - refundAmount);
        }
    }
    return returnAmount;
};

/**
 * Retrieves transaction summaries.
 * 
 * @param {Payment} updatePaymentObj - Updated payment object.
 * @param {number} retryCount - Retry count.
 * @returns {Promise<any>} - Object containing transaction summaries and a flag indicating if history is present.
 */
const getTransactionSummaries = async (updatePaymentObj: Payment, retryCount: number): Promise<any> => {
    let transactionSummaryObject: any;
    let errorData = '';
    let paymentId = updatePaymentObj.id || '';
    const query = Constants.PAYMENT_GATEWAY_CLIENT_REFERENCE_CODE + paymentId + Constants.STRING_AND + Constants.STRING_SYNC_QUERY;
    const midId = updatePaymentObj?.custom?.fields?.isv_merchantId ? updatePaymentObj.custom.fields.isv_merchantId : '';
    const authMid = multiMid.getMidCredentials(midId);
    return await new Promise(function (resolve, reject) {
        setTimeout(async () => {
            const transactionDetail = await createSearchRequest.getTransactionSearchResponse(query, 50, Constants.STRING_SYNC_SORT, authMid);
            const validTransactionSummary = paymentValidator.isValidTransactionSummaries(transactionDetail, updatePaymentObj, retryCount);
            if (validTransactionSummary) {
                transactionSummaryObject = {
                    summaries: transactionDetail?.data?._embedded?.transactionSummaries,
                    historyPresent: true,
                };
                resolve(transactionSummaryObject);
            } else {
                errorHandler.logError(new PaymentProcessingError(CustomMessages.ERROR_MSG_RETRY_TRANSACTION_SEARCH, '', FunctionConstant.FUNC_GET_TRANSACTION_SUMMARIES), __filename, 'PaymentId : ' + updatePaymentObj.id);
                reject(transactionSummaryObject);
            }
        }, 1500);
    }).catch((error) => {
        if (error) {
            errorData = typeof error === Constants.STR_OBJECT ? (errorData = JSON.stringify(error)) : error;
        }
        errorHandler.logError(new PaymentProcessingError(CustomMessages.ERROR_MSG_RETRY_TRANSACTION_SEARCH + errorData, error, FunctionConstant.FUNC_GET_TRANSACTION_SUMMARIES), __filename, 'PaymentId : ' + paymentId);
        return transactionSummaryObject;
    });
};

/**
 * Checks if an authorization reversal is triggered for the given payment update.
 * 
 * @param {Payment} updatePaymentObj - Updated payment object.
 * @param {Cart} cartObj - Cart object.
 * @param {PtsV2PaymentsPost201Response} paymentResponse - Payment response.
 * @param {ActionResponseType} updateActions - Updated actions.
 * @returns {Promise<ActionResponseType>} - Updated actions response.
 */
const checkAuthReversalTriggered = async (updatePaymentObj: Payment, cartObj: Cart, paymentResponse: PtsV2PaymentsPost201Response, updateActions: ActionResponseType): Promise<ActionResponseType> => {
    let transactionSummaries;
    let transactionDetail;
    let isAuthReversalTriggered = false;
    let applications: Partial<ApplicationsType>[];
    let returnAction = {
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
    for (let i = 0; i < Constants.PAYMENT_GATEWAY_TRANSACTION_SUMMARIES_MAX_RETRY; i++) {
        transactionDetail = await getTransactionSummaries(updatePaymentObj, i + 1);
        if (transactionDetail) {
            transactionSummaries = transactionDetail.summaries;
            if (true === transactionDetail.historyPresent) {
                break;
            }
        }
    }
    if (transactionSummaries) {
        for (let element of transactionSummaries) {
            applications = element.applicationInformation.applications;
            for (let application of applications) {
                if (Constants.ECHECK !== updatePaymentObj.paymentMethodInfo.method && updatePaymentObj?.custom?.fields?.isv_saleEnabled && Constants.STRING_SYNC_AUTH_NAME === application?.name && application.reasonCode) {
                    updateActions = await paymentActions.handleAuthApplication(updatePaymentObj, application, updateActions, element);
                }
                if (Constants.STRING_SYNC_AUTH_REVERSAL_NAME === application.name) {
                    if (Constants.APPLICATION_RCODE === application.rCode && Constants.APPLICATION_RFLAG === application.rFlag) {
                        isAuthReversalTriggered = true;
                        returnAction.transaction.state = Constants.CT_TRANSACTION_STATE_SUCCESS;
                    } else {
                        returnAction.transaction.state = Constants.CT_TRANSACTION_STATE_FAILURE;
                    }
                    returnAction.transaction.amount = updatePaymentObj.amountPlanned;
                    returnAction.transaction.interactionId = element.id;
                    updateActions.actions.push(returnAction);
                }
            }
        }
    }
    if (!isAuthReversalTriggered) {
        updateActions = await orderManagementHelper.handleAuthReversalResponse(updatePaymentObj, cartObj, paymentResponse, updateActions);
    }
    return updateActions;
};

/**
 * Checks the presence of different types of applications in a given array of applications.
 * 
 * @param {ApplicationsType[]} applications - Array of applications.
 * @returns {Object} - Object indicating the presence of different types of applications.
 */
const getApplicationsPresent = async (applications: Partial<ApplicationsType>) => {
    let applicationDetails = {
        authPresent: '',
        authReasonCodePresent: '',
        capturePresent: '',
        captureReasonCodePresent: '',
        authReversalPresent: '',
        refundPresent: '',
    }
    if (applications) {
        const checkAuthPresent = applications.some((item: Partial<ApplicationsType>) => Constants.STRING_SYNC_AUTH_NAME === item.name) || applications.some((item: ApplicationsType) => Constants.STRING_SYNC_ECHECK_DEBIT_NAME === item.name);
        const checkAuthReasonCodePresent = applications.some((item: Partial<ApplicationsType>) => Constants.STRING_SYNC_AUTH_NAME === item.name && item.reasonCode && Constants.PAYMENT_GATEWAY_SUCCESS_REASON_CODE === item.reasonCode
            || Constants.STRING_SYNC_ECHECK_DEBIT_NAME === item.name && null === item.reasonCode && applications.some((nextItem: Partial<ApplicationsType>) => Constants.STRING_SYNC_DECISION_NAME === nextItem.name && Constants.PAYMENT_GATEWAY_ERROR_REASON_CODE === nextItem.reasonCode));
        const checkCapturePresent = applications.some((item: Partial<ApplicationsType>) => Constants.STRING_SYNC_CAPTURE_NAME === item.name);
        const captureReasonCodePresent = applications.some((item: Partial<ApplicationsType>) => Constants.STRING_SYNC_CAPTURE_NAME === item.name && item.reasonCode && Constants.PAYMENT_GATEWAY_SUCCESS_REASON_CODE === item.reasonCode);
        const checkAuthReversalPresent = applications.some((item: Partial<ApplicationsType>) => Constants.STRING_SYNC_AUTH_REVERSAL_NAME === item.name)
        const checkRefundPresent = applications.some((item: Partial<ApplicationsType>) => Constants.STRING_SYNC_REFUND_NAME === item.name || 'ics_ap_refund' === item.name || Constants.STRING_SYNC_ECHECK_CREDIT_NAME === item.name);
        applicationDetails = {
            authPresent: checkAuthPresent,
            authReasonCodePresent: checkAuthReasonCodePresent,
            capturePresent: checkCapturePresent,
            captureReasonCodePresent: captureReasonCodePresent,
            authReversalPresent: checkAuthReversalPresent,
            refundPresent: checkRefundPresent,
        }
    }
    return applicationDetails;
};

/**
 * Checks for missing card details in commercetools payments with specific digital wallet methods
 * (Click to Pay, Google Pay, Apple Pay). If details are missing, attempts to fetch them using 
 * multiple merchant credentials and updates the payment record.
 * 
 * @async
 * @function getMissingPaymentDetails
 * @returns {Promise<void>} Resolves when the process is complete.
 * */
const getMissingPaymentDetails = async () => {
    const midCredentials = {
        merchantId: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
        merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
        merchantSecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
    };
    let multiMidArray;
    multiMidArray = multiMid.getAllMidDetails();
    multiMidArray.push(midCredentials);
    const paymentData = await commercetoolsApi.getAllPayments();
    if (0 < paymentData?.results.length) {
        for (let paymentDataIndex = 0; paymentDataIndex < paymentData.results?.length; paymentDataIndex++) {
            const currentPaymentObject = paymentData.results[paymentDataIndex];
            const paymentMethod = currentPaymentObject?.paymentMethodInfo?.method;
            if (Constants.CLICK_TO_PAY === paymentMethod || Constants.GOOGLE_PAY === paymentMethod || Constants.APPLE_PAY === paymentMethod) {
                const transactionId = currentPaymentObject?.transactions[0]?.interactionId;
                if (transactionId) {
                    for (let midIndex = 0; midIndex < multiMidArray.length; midIndex++) {
                        try {
                            let getTransactionDataResponse = await getTransaction.getTransactionData(transactionId, null, multiMidArray[midIndex]);
                            if (getTransactionDataResponse
                                && Constants.HTTP_OK_STATUS_CODE === getTransactionDataResponse.httpCode
                                && getTransactionDataResponse?.cardFieldGroup) {
                                let dataActions = paymentActions.cardDetailsActions(getTransactionDataResponse);
                                await syncPaymentDetails(dataActions, currentPaymentObject);
                                break;
                            }
                        } catch (exception) {
                            errorHandler.logError(new ApiError('', exception, FunctionConstant.FUNC_GET_MISSING_PAYMENT_DETAILS), __filename, '');
                        }
                    }
                }
            }
        }
    }
}

/**
 * Syncs payment and cart details with updated transaction data.
 * 
 * - If a cart is linked to the payment and is active, updates the cart with transaction details.
 * - Applies payment updates using provided actions if available.
 * 
 * @async
 * @function syncPaymentAndAddressDetails
 * @param {Partial<ActionType>[]} dataActions - List of actions to update the payment details.
 * @param {Payment} currentPaymentObject - The current payment object to be updated.
 * @param {any} getTransactionDataResponse - Response data containing transaction details.
 * @returns {Promise<void>} Resolves when synchronization is complete.
 */
const syncPaymentDetails = async (dataActions: Partial<ActionType>[], currentPaymentObject: Payment): Promise<void> => {
    const paymentId = currentPaymentObject?.id;
    if (paymentId) {
        if (dataActions && currentPaymentObject?.version) {
            const updateObject = {
                actions: dataActions,
                id: currentPaymentObject.id,
                version: currentPaymentObject.version,
            };
            commercetoolsApi.syncVisaCardDetails(updateObject);
        }
    }
}


export default {
    retrieveSyncResponse,
    runSyncAddTransaction,
    isAuthReversalTriggered,
    getGatewayAuthReversalState,
    awaitGatewayAuthReversalState,
    retrieveSyncAmountDetails,
    runSyncUpdateCaptureAmount,
    updateDecisionSyncService,
    processApplicationResponse,
    processRunSyncUpdateCaptureAmount,
    getApplicationsPresent,
    getTransactionSummaries,
    checkAuthReversalTriggered,
    getMissingPaymentDetails,
    syncPaymentDetails,
    selectMatchingSyncTransaction
}



