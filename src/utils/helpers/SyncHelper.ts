import { Constants } from '../../constants/constants';
import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import createSearchRequest from '../../service/payment/CreateTransactionSearchRequest';
import getTransaction from '../../service/payment/GetTransactionData';
import { ActionType, AmountPlannedType, ApplicationsType, PaymentTransactionType, PaymentType, ReportSyncType } from '../../types/Types';
import multiMid from '../../utils/config/MultiMid';
import paymentActions from '../PaymentActions';
import paymentService from '../PaymentService';
import paymentUtils from '../PaymentUtils';
import commercetoolsApi from '../api/CommercetoolsApi';

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
    state: '',
    securityCodePresent: false,
});

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

const setSecurityCodePresent = (paymentDetails: PaymentType) => {
    if ((Constants.CC_PAYER_AUTHENTICATION == paymentDetails.paymentMethodInfo.method || Constants.CREDIT_CARD == paymentDetails.paymentMethodInfo.method) && paymentDetails?.custom?.fields?.isv_securityCode && paymentDetails.custom.fields.isv_securityCode) {
        return true;
    }
    return false;
}

const retrieveSyncResponse = async (paymentDetails: PaymentType, transactionElement: any): Promise<any> => {
    const syncUpdateObject: ReportSyncType = initializeSyncUpdateObject();
    let isRowPresent = false;
    let updateSyncResponse;
    const processPaymentDetails = validatePaymentDetails(paymentDetails, transactionElement);
    if (processPaymentDetails) {
        syncUpdateObject.securityCodePresent = setSecurityCodePresent(paymentDetails);
        const { transactions } = paymentDetails;
        const { applications } = transactionElement.applicationInformation;

        if (applications && transactions) {
            const applicationResponse = await paymentService.getApplicationsPresent(applications);
            if (applicationResponse) {
                isRowPresent = checkTransaction(transactions, transactionElement.id);
                if (!isRowPresent) {
                    updateSyncObjectDetails(syncUpdateObject, paymentDetails, transactionElement.id);
                    const amountDetails = await retrieveSyncAmountDetails(paymentDetails, transactionElement, applicationResponse);
                    updateSyncObjectAmountDetails(syncUpdateObject, amountDetails);
                    updateSyncResponse = await processApplicationResponse(applicationResponse, paymentDetails, syncUpdateObject, transactionElement);
                    const updateCardDetails = validateUpdateCardDetails(paymentDetails)
                    if (updateSyncResponse && updateCardDetails) {
                        await paymentService.updateCardDetails(paymentDetails, updateSyncResponse.version, transactionElement.id);
                    }
                }
            }
        }
    }
    return updateSyncResponse;
};

const validatePaymentDetails = (paymentDetails: PaymentType, transactionElement: any): boolean => {
    return paymentDetails && transactionElement && Constants.STRING_TRANSACTIONS in paymentDetails;
};

const checkTransaction = (transactions: any[], transactionId: string): boolean => {
    return transactions.some((item: any) => item.interactionId === transactionId);
};

const updateSyncObjectDetails = (syncUpdateObject: ReportSyncType, paymentDetails: PaymentType, transactionId: string): void => {
    syncUpdateObject.id = paymentDetails.id;
    syncUpdateObject.version = paymentDetails.version;
    syncUpdateObject.interactionId = transactionId;
};

const updateSyncObjectAmountDetails = (syncUpdateObject: ReportSyncType, amountDetails: any): void => {
    syncUpdateObject.amountPlanned.currencyCode = amountDetails?.currencyCode;
    syncUpdateObject.amountPlanned.centAmount = amountDetails?.centAmount;
};

const validateUpdateCardDetails = (paymentDetails: PaymentType): boolean => {
    return [Constants.CLICK_TO_PAY, Constants.APPLE_PAY].includes(paymentDetails.paymentMethodInfo.method);
};

const processApplicationResponse = async (applicationResponse: any, paymentDetails: PaymentType, syncUpdateObject: ReportSyncType, transactionElement: any): Promise<any> => {
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

const determineTransactionType = (paymentDetails: PaymentType, applicationResponse: any): string => {
    if (Constants.ECHECK === paymentDetails.paymentMethodInfo.method) {
        return Constants.CT_TRANSACTION_TYPE_CHARGE;
    } else {
        return applicationResponse.capturePresent && applicationResponse.captureReasonCodePresent
            ? Constants.CT_TRANSACTION_TYPE_CHARGE
            : Constants.CT_TRANSACTION_TYPE_AUTHORIZATION;
    }
};

const updateResponseIfCapturePresent = async (paymentDetails: PaymentType, syncUpdateObject: ReportSyncType, transactionElement: any, applicationResponse: any): Promise<any> => {
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
 * @returns {Promise<PaymentType | null>} - The updated sync response.
 */
const runSyncAddTransaction = async (syncUpdateObject: ReportSyncType, reasonCode: string, authPresent: boolean, authReasonCodePresent: boolean): Promise<PaymentType | null> => {
    let updateSyncResponse: PaymentType | null = null;
    let paymentDetails: PaymentType | null;
    let isAuthReversalTriggeredFlag = false;
    let refundAmount = 0.0;
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
    } else {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_RUN_SYNC_ADD_TRANSACTION, Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_FETCH_TRANSACTIONS);
    }
    return updateSyncResponse;
};
/**
 * Checks if an authorization reversal is triggered for a payment.
 * 
 * @param {PaymentType} paymentDetails - Payment details.
 * @param {string} query - Query string for search.
 * @returns {Promise<boolean>} - Whether an authorization reversal is triggered.
 */
const isAuthReversalTriggered = async (paymentDetails: PaymentType, query: string): Promise<boolean> => {
    let isAuthReverseTriggered = false;
    let applications: Partial<ApplicationsType>[];
    let transactions: Partial<PaymentTransactionType>[];
    let paymentObj: PaymentType | null = null;
    const mid = paymentDetails?.custom?.fields?.isv_merchantId ? paymentDetails.custom.fields.isv_merchantId : '';
    const authMid = await multiMid.getMidCredentials(mid);
    const transactionDetail = await createSearchRequest.getTransactionSearchResponse(query, Constants.STRING_SYNC_SORT, authMid);
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
                        if (transactions.some((transaction: Partial<PaymentTransactionType>) => transaction.interactionId === element.id)) {
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
* Retrieves sync amount details based on the payment details and application response.
* 
* @param {PaymentType} paymentDetails - The payment details.
* @param {any} element - The transaction element.
* @param {any} applicationResponse - The application response.
* @returns {Promise<{ centAmount: number, currencyCode: string }>} - The sync amount object.
*/
const retrieveSyncAmountDetails = async (paymentDetails: PaymentType, element: any, applicationResponse: any): Promise<{ centAmount: number, currencyCode: string }> => {
    const syncAmountObject = {
        centAmount: 0,
        currencyCode: '',
    };
    const {
        orderInformation, orderInformation: {
            amountDetails: { currency, totalAmount },
        },
    } = element;
    const fractionDigits = paymentDetails.amountPlanned.fractionDigits;
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
 * @param {PaymentType | null} updatePaymentObj - The payment object containing updated payment details.
 * @param {number} amount - The amount to be updated.
 * @returns {Promise<any>} - The updated response.
 */
const runSyncUpdateCaptureAmount = async (updatePaymentObj: PaymentType | null, amount: number): Promise<any> => {
    if (!updatePaymentObj || 0 <= amount) {
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
const updateDecisionSyncService = async (conversionDetails: any): Promise<boolean> => {
    let latestTransaction: Partial<PaymentTransactionType>;
    let paymentDetails = null;
    let isConversionPresent = false;
    let decision = '';
    let decisionUpdateObject = {
        id: '',
        version: 0,
        state: '',
    };
    if (conversionDetails) {
        for (let element of conversionDetails) {
            paymentDetails = null;
            paymentDetails = await commercetoolsApi.retrievePayment(element.merchantReferenceNumber);
            if (paymentDetails && paymentDetails?.transactions && paymentDetails.transactions.length) {
                latestTransaction = paymentDetails.transactions[paymentDetails.transactions.length - 1];
                if ((Constants.CT_TRANSACTION_TYPE_AUTHORIZATION === latestTransaction.type || Constants.CT_TRANSACTION_TYPE_CHARGE === latestTransaction.type) && Constants.CT_TRANSACTION_STATE_PENDING === latestTransaction.state && latestTransaction?.id) {
                    isConversionPresent = true;
                    switch (element.newDecision) {
                        case Constants.HTTP_STATUS_DECISION_ACCEPT:
                            decision = Constants.CT_TRANSACTION_STATE_SUCCESS;
                            break;
                        case Constants.HTTP_STATUS_DECISION_REJECT:
                            decision = Constants.CT_TRANSACTION_STATE_FAILURE;
                    }
                    decisionUpdateObject.id = paymentDetails.id;
                    decisionUpdateObject.version = paymentDetails.version;
                    decisionUpdateObject.state = decision;
                    await commercetoolsApi.updateDecisionSync(decisionUpdateObject, latestTransaction.id);
                }
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
const processRunSyncUpdateCaptureAmount = async (transaction: Partial<PaymentTransactionType>, paymentId: string, paymentVersion: number, refundAmount: number, pendingTransactionAmount: number): Promise<any> => {
    let updateResponse;
    let transactionId = '';
    let refundAmountUsed = 0;
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

const getUpdateAmount = (transaction: Partial<PaymentTransactionType>, refundAmount: number): number | null => {
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

const getMissingPaymentDetails = async () => {
    const midCredentials = {
        merchantId: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
        merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
        merchantSecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
    };
    let multiMidArray;
    multiMidArray = await multiMid.getAllMidDetails();
    multiMidArray.push(midCredentials);
    const paymentData = await commercetoolsApi.getAllPayments();
    if (0 < paymentData?.results.length) {
        for (let paymentDataIndex = 0; paymentDataIndex < paymentData.results?.length; paymentDataIndex++) {
            const currentPaymentObject = paymentData.results[paymentDataIndex];
            const paymentMethod = currentPaymentObject?.paymentMethodInfo?.method;
            if (Constants.CLICK_TO_PAY === paymentMethod || Constants.GOOGLE_PAY === paymentMethod || Constants.APPLE_PAY === paymentMethod) {
                const customFields = currentPaymentObject.custom?.fields;
                if (!customFields.isv_cardExpiryMonth || !customFields.isv_cardExpiryYear || !customFields.isv_maskedPan || !customFields.isv_cardType) {
                    const transactionId = currentPaymentObject?.transactions[0]?.interactionId;
                    if (transactionId) {
                        for (let midIndex = 0; midIndex < multiMidArray.length; midIndex++) {
                            try {
                                let getTransactionDataResponse = await getTransaction.getTransactionData(transactionId, null, multiMidArray[midIndex]);
                                if (getTransactionDataResponse
                                    && Constants.HTTP_OK_STATUS_CODE === getTransactionDataResponse.httpCode
                                    && getTransactionDataResponse?.cardFieldGroup) {
                                    let dataActions = paymentActions.cardDetailsActions(getTransactionDataResponse);
                                    await syncPaymentAndAddressDetails(dataActions, currentPaymentObject, getTransactionDataResponse);
                                    break;
                                }
                            } catch (exception) {
                                paymentUtils.logExceptionData(__filename, 'FuncGetMissingPaymentDetails', '', exception, '', '', '');
                            }
                        }
                    }
                }
            }
        }
    }
}

const syncPaymentAndAddressDetails = async (dataActions: Partial<ActionType>[], currentPaymentObject: PaymentType, getTransactionDataResponse: any): Promise<void> => {
    if (currentPaymentObject?.id) {
        const cartDetails = await paymentService.getCartDetailsByPaymentId(currentPaymentObject?.id);
        if (cartDetails && 'Active' === cartDetails.cartState && cartDetails?.id && cartDetails?.version) {
            await commercetoolsApi.updateCartByPaymentId(cartDetails.id, currentPaymentObject?.id, cartDetails.version, getTransactionDataResponse);
        }
        if (dataActions && currentPaymentObject?.version) {
            const updateObject = {
                actions: dataActions,
                id: currentPaymentObject.id,
                version: currentPaymentObject.version,
            };
            await commercetoolsApi.syncVisaCardDetails(updateObject);
        }
    }
}

export default {
    setSecurityCodePresent,
    retrieveSyncResponse,
    runSyncAddTransaction,
    isAuthReversalTriggered,
    retrieveSyncAmountDetails,
    runSyncUpdateCaptureAmount,
    updateDecisionSyncService,
    processApplicationResponse,
    processRunSyncUpdateCaptureAmount,
    getMissingPaymentDetails,
    syncPaymentAndAddressDetails
}