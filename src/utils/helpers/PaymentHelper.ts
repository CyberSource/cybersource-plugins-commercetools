import { Payment } from '@commercetools/platform-sdk';
import { PtsV2PaymentsPost201Response } from 'cybersource-rest-client';
import restApi from 'cybersource-rest-client';
import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from '../../constants/paymentConstants';
import prepareFields from '../../requestBuilder/PrepareFields';
import { PayerAuthData } from '../../models/PayerAuthDataModel';
import { ActionResponseType, ActionType, MergeCustomerTokensResult, PaymentTransactionType } from '../../types/Types';
import { errorHandler, PaymentProcessingError } from '../ErrorHandler';
import paymentActions from '../PaymentActions';
import paymentHandler from '../PaymentHandler';
import paymentUtils from '../PaymentUtils';
import paymentValidator from '../PaymentValidator';
import commercetoolsApi from '../api/CommercetoolsApi';
import getCardByInstrumentId from '../../service/payment/GetCardByInstrumentId';
import getTransactionData from '../../service/payment/GetTransactionData';
import orderManagementHelper from './OrderManagementHelper';

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

        const validPendingAuthenticationResponse = paymentValidator.isValidPendingAuthenticationResponse(httpCode, status, data, consumerAuthenticationInformation);

        let isPayPalReview = false;

        if (Constants.API_STATUS_AUTHORIZED === paymentResponse.status && (Constants.API_STATUS_REVIEW === paymentResponse?.data?.errorInformation?.reason || Constants.API_STATUS_REVIEW === paymentResponse?.text?.errorInformation?.reason)) {
            isPayPalReview = true;
        }

        if (
            Constants.HTTP_SUCCESS_STATUS_CODE === httpCode &&
            transactionDetail &&
            (Constants.API_STATUS_AUTHORIZED === status || Constants.API_STATUS_AUTHORIZED_RISK_DECLINED === status || Constants.API_STATUS_PENDING === status || Constants.API_STATUS_SETTLED === status) &&
            !isPayPalReview
        ) {
            const setTransaction = paymentUtils.setTransactionId(paymentResponse, transactionDetail);

            setCustomField =
                Constants.CT_TRANSACTION_TYPE_CHARGE === transactionDetail.type && Constants.API_STATUS_AUTHORIZED_RISK_DECLINED === status
                    ? paymentUtils.changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_FAILURE)
                    : paymentUtils.changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_SUCCESS);

            response = paymentActions.createResponse(setTransaction, setCustomField, null, null);
        } else if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse?.httpCode && (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW === paymentResponse?.status || Constants.API_STATUS_PENDING_REVIEW === paymentResponse?.status || isPayPalReview) && transactionDetail) {
            const setTransaction = paymentUtils.setTransactionId(paymentResponse, transactionDetail);
            setCustomField = paymentUtils.changeState(transactionDetail, Constants.CT_TRANSACTION_STATE_PENDING);
            response = paymentActions.createResponse(setTransaction, setCustomField, null, null);
        } else if (Constants.HTTP_SUCCESS_STATUS_CODE === httpCode && Constants.API_STATUS_COMPLETED === status) {
            const isv_requestJwt = paymentResponse.accessToken;
            const isv_cardinalReferenceId = paymentResponse.referenceId;
            const isv_deviceDataCollectionUrl = paymentResponse.deviceDataCollectionUrl;

            const actions = paymentUtils.setCustomFieldMapper({
                isv_requestJwt,
                isv_cardinalReferenceId,
                isv_deviceDataCollectionUrl,
            });

            response.actions = actions;
        } else if (validPendingAuthenticationResponse) {
            const payerAuthenticationData = new PayerAuthData(consumerAuthenticationInformation, paymentResponse);

            if (!payerAuthenticationData.isv_responseJwt && paymentResponse?.text?.consumerAuthenticationInformation?.token) {
                payerAuthenticationData.isv_responseJwt = paymentResponse.text.consumerAuthenticationInformation.token;
            }

            const actions = paymentActions.payerAuthActions(payerAuthenticationData);
            response.actions = actions;
        } else if (Constants.HTTP_SUCCESS_STATUS_CODE === httpCode && Constants.STRING_CREATED === status) {
            const isv_payPalUrl = paymentResponse.isv_payPalUrl;
            const isv_payPalRequestId = paymentResponse.isv_payPalRequestId;

            const actions = paymentUtils.setCustomFieldMapper({
                isv_payPalUrl,
                isv_payPalRequestId,
            });

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

            paymentValidator.setObjectValue(response.actions, 'isv_approvalCode', paymentResponse, 'text.processorInformation.approvalCode', Constants.STR_STRING, true);

            paymentValidator.setObjectValue(response.actions, 'isv_clientReferenceCode', paymentResponse, 'text.clientReferenceInformation.code', Constants.STR_STRING, true);
        }
    }

    return response;
};

/**
 * Unified Checkout completion-token detector.
 *
 * UC completion JWT contains details.id / details.status / details.outcome.
 * Standalone Flex Microform token normally contains content.paymentInformation.card
 * and does NOT contain details.id/status.
 */

const getUcCompletionTokenDetails = (transientToken: string) => {
    let result: any = {
        isUcCompletionToken: false,
        decodedToken: null,
        completionToken: null,
        cybsTransactionId: '',
        cybsStatus: '',
        cybsSubmitTimeUtc: '',
    };
    try {
        const decodedToken = decodeJwtPayload(transientToken);
        if (!decodedToken) {
            result = { ...result };
        } else {
            const completionToken = decodedToken?.details || decodedToken?.content?.details || decodedToken?.data?.details || null;
            const cybsTransactionId = getCybersourceTransactionIdFromJwt(decodedToken, completionToken);
            const cybsStatus = completionToken?.status || completionToken?.outcome || decodedToken?.status || decodedToken?.outcome || '';
            const cybsSubmitTimeUtc = completionToken?.submitTimeUtc || completionToken?.details?.submitTimeUtc || decodedToken?.submitTimeUtc || '';
            const clientReferenceCode = completionToken?.clientReferenceInformation?.code || '';
            const approvalCode = completionToken?.processorInformation?.approvalCode || '';
            const processorTransactionId = completionToken?.processorInformation?.transactionId || '';
            result = {
                isUcCompletionToken: !!completionToken && !!cybsTransactionId,
                decodedToken,
                completionToken,
                cybsTransactionId,
                cybsStatus,
                cybsSubmitTimeUtc,
                clientReferenceCode,
                approvalCode,
                processorTransactionId,
            };
        }
    } catch {
        result = { ...result };
    }
    return result;
};

const decodeJwtPayload = (jwtToken: string): Record<string, any> | null => {
    let result: Record<string, any> | null = null;
    try {
        if (jwtToken && jwtToken.split('.').length >= 2) {
            const payloadSegment = jwtToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            const normalizedPayload = payloadSegment.padEnd(payloadSegment.length + ((4 - (payloadSegment.length % 4)) % 4), '=');
            const payloadString = Buffer.from(normalizedPayload, 'base64').toString('utf8');
            result = JSON.parse(payloadString);
        }
    } catch {
        result = null;
    }
    return result;
};

const getCybersourceTransactionIdFromJwt = (decodedToken: Record<string, any>, completionToken: any): string => {
    return completionToken?.id || decodedToken?.id || completionToken?.processorInformation?.transactionId || '';
};

const getApplications = (tssResponse: any): any[] => {
    const apps = tssResponse?.applications || tssResponse?.applicationInformation?.applications || tssResponse?.data?.applications || tssResponse?.data?.applicationInformation?.applications || [];
    return Array.isArray(apps) ? apps : [];
};

const getBillApplication = (tssResponse: any): any => {
    return getApplications(tssResponse).find((application: any) => Constants.STRING_SYNC_CAPTURE_NAME === application?.name) || null;
};

const hasChargeForInteractionId = (paymentObj: Payment, interactionId: string): boolean => {
    if (!interactionId || !paymentObj?.transactions?.length) {
        return false;
    }

    return paymentObj.transactions.some((transaction) => Constants.CT_TRANSACTION_TYPE_CHARGE === transaction.type && transaction.interactionId === interactionId);
};

const isPendingFriendlyPaymentMethod = (paymentMethod: string | undefined): boolean => {
    const normalizedMethod = (paymentMethod || '').toLowerCase();
    return (
        Constants.ECHECK.toLowerCase() === normalizedMethod || Constants.PAYMENT_GATEWAY_E_CHECK_PAYMENT_TYPE.toLowerCase() === normalizedMethod || Constants.PAYPAL.toLowerCase() === normalizedMethod || normalizedMethod.includes('apm') || normalizedMethod.includes('wallet')
    );
};

const isApmOrEcheckMethod = (paymentMethod: string | undefined): boolean => {
    const normalizedMethod = (paymentMethod || '').toLowerCase();
    return 'check' === normalizedMethod || Constants.ECHECK.toLowerCase() === normalizedMethod;
};

const getParsedTransactionPayload = (transactionResponse: any): any => {
    let result: any = transactionResponse;
    if (!transactionResponse) {
        result = {};
    } else if ('string' === typeof transactionResponse?.text) {
        try {
            result = JSON.parse(transactionResponse.text);
        } catch (_parseErr) {
            result = transactionResponse;
        }
    }
    return result;
};

const isECheckPayment = (transaction: any): boolean => {
    return 'check' === transaction?.paymentInformation?.paymentType?.type || 'Checking' === transaction?.processingInformation?.paymentSolution;
};

const buildECheckTokenObject = (tokenInfo: any, tmsBankAccount: any, addressInfo?: any): Record<string, unknown> | null => {
    let eCheckToken: Record<string, unknown> | null = null;
    if (!tokenInfo) {
    } else {
        const instrumentIdentifierId = tokenInfo?.instrumentIdentifier?.id || '';
        const paymentInstrumentId = tokenInfo?.paymentInstrument?.id || '';
        const customerTokenId = tokenInfo?.customer?.id || '';
        if (instrumentIdentifierId && paymentInstrumentId && tmsBankAccount) {
            const maskedAccount = String(tmsBankAccount?.number || '').trim();
            const routingNumber = String(tmsBankAccount?.routingNumber || '').trim();
            const maskedRouting = routingNumber && routingNumber.length >= 4 ? 'XXXXX' + routingNumber.slice(-4) : '';
            eCheckToken = {
                paymentMethod: 'ECHECK',
                value: customerTokenId,
                paymentToken: paymentInstrumentId,
                instrumentIdentifier: instrumentIdentifierId,
                accountNumber: maskedAccount,
                routingNumber: maskedRouting,
                accountType: 'CHECKING',
                timestamp: new Date().toISOString(),
            };
            if (addressInfo) {
                eCheckToken.address = {
                    firstName: addressInfo.firstName || '',
                    lastName: addressInfo.lastName || '',
                    address1: addressInfo.address1 || addressInfo.streetName || '',
                    address2: addressInfo.address2 || addressInfo.additionalStreetInfo || '',
                    locality: addressInfo.locality || addressInfo.city || '',
                    administrativeArea: addressInfo.administrativeArea || addressInfo.region || '',
                    postalCode: addressInfo.postalCode || '',
                    country: addressInfo.country || '',
                    email: addressInfo.email || '',
                    phoneNumber: addressInfo.phoneNumber || addressInfo.phone || '',
                };
            }
        }
    }
    return eCheckToken;
};

const mergeCustomerTokens = (existingCustomerTokens: unknown, finalTokenObject: any): MergeCustomerTokensResult => {
    const safeExistingTokens = Array.isArray(existingCustomerTokens) ? existingCustomerTokens : [];

    const parsedExistingTokens = safeExistingTokens
        .map((token) => {
            if ('string' !== typeof token) {
                return null;
            }

            try {
                return JSON.parse(token);
            } catch (_parseErr) {
                return null;
            }
        })
        .filter(Boolean);

    const alreadyExists = !!parsedExistingTokens.some((token) => token?.instrumentIdentifier && finalTokenObject?.instrumentIdentifier && token.instrumentIdentifier === finalTokenObject.instrumentIdentifier);

    const mergedTokens = alreadyExists ? parsedExistingTokens.map((token) => (token.instrumentIdentifier === finalTokenObject.instrumentIdentifier ? finalTokenObject : token)) : [...parsedExistingTokens, finalTokenObject];

    const uniqueTokens = Array.from(new Map(mergedTokens.map((token) => [token.instrumentIdentifier, token])).values());

    const updatedTokens = uniqueTokens;
    const stringifiedTokens = updatedTokens.map((token) => JSON.stringify(token));

    return {
        parsedExistingTokens,
        updatedTokens,
        stringifiedTokens,
        alreadyExists,
    };
};

const getCompleteMandateType = (decodedToken: Record<string, any>, completionToken: any): string => {
    return completionToken?.completeMandate?.type || decodedToken?.completeMandate?.type || decodedToken?.ctx?.[0]?.data?.completeMandate?.type || '';
};

const hasFinalCapture = (decodedToken: Record<string, any>, completionToken: any): boolean => {
    const finalCapture = completionToken?.processingInformation?.captureOptions?.finalCapture || decodedToken?.details?.processingInformation?.captureOptions?.finalCapture || '';
    return 'true' === String(finalCapture).toLowerCase();
};

const mapBillApplicationToCtState = (billApplication: any, isPendingMethod: boolean): string => {
    let result = Constants.CT_TRANSACTION_STATE_FAILURE;
    if (!billApplication) {
        result = Constants.CT_TRANSACTION_STATE_SUCCESS;
    } else {
        const status = (billApplication?.status || '').toUpperCase();
        const reasonCode = String(billApplication?.reasonCode || '');
        if (
            (Constants.PAYMENT_GATEWAY_SUCCESS_REASON_CODE === reasonCode && Constants.API_STATUS_PENDING === status) ||
            Constants.PAYMENT_GATEWAY_SUCCESS_REASON_CODE === reasonCode ||
            ['SUCCESS', 'SUCCEEDED', 'COMPLETED', 'SETTLED', 'AUTHORIZED'].includes(status) ||
            (isPendingMethod && Constants.API_STATUS_PENDING === status)
        ) {
            result = Constants.CT_TRANSACTION_STATE_SUCCESS;
        }
    }
    return result;
};

/**
 * Adds UC completion-response custom fields to the commercetools update response.
 */
const addUcCompletionCustomFields = (
    updateResponse: ActionResponseType,
    completionToken: any,
    cybsStatus: string,
    cybsSubmitTimeUtc: string,

    clientReferenceCode: string = '',
    approvalCode: string = '',
    processorTransactionId: string = '',
    captureContextClientRefCode: string = '',
): ActionResponseType => {

    const authorizationStatusValue = '201' === cybsStatus && 'CUSTOMER_AUTHENTICATION_REQUIRED' === completionToken?.errorInformation?.reason ? Constants.API_STATUS_DECLINED : cybsStatus;

    updateResponse.actions.push({
        action: Constants.SET_CUSTOM_FIELD,
        name: 'isv_authorizationStatus',
        value: authorizationStatusValue,
    } as Partial<ActionType>);
    let finalClientRefCode = '';
    if (clientReferenceCode && 'default' !== clientReferenceCode.trim().toLowerCase() && '' !== clientReferenceCode.trim()) {
        finalClientRefCode = clientReferenceCode;
    } else if (captureContextClientRefCode && 'default' !== captureContextClientRefCode.trim().toLowerCase() && '' !== captureContextClientRefCode.trim()) {
        finalClientRefCode = captureContextClientRefCode;
    }

    if (cybsSubmitTimeUtc) {
        updateResponse.actions.push({
            action: Constants.SET_CUSTOM_FIELD,
            name: 'isv_responseDateAndTime',
            value: cybsSubmitTimeUtc,
        } as Partial<ActionType>);
    }

    if (completionToken?.processorInformation?.responseCode) {
        updateResponse.actions.push({
            action: Constants.SET_CUSTOM_FIELD,
            name: 'isv_responseCode',
            value: completionToken.processorInformation.responseCode,
        } as Partial<ActionType>);
    }

    if (approvalCode) {
        updateResponse.actions.push({
            action: Constants.SET_CUSTOM_FIELD,
            name: 'isv_approvalCode',
            value: approvalCode,
        } as Partial<ActionType>);
    }

    if (finalClientRefCode) {
        updateResponse.actions.push({
            action: Constants.SET_CUSTOM_FIELD,
            name: 'isv_clientReferenceCode',
            value: finalClientRefCode,
        } as Partial<ActionType>);
    } else if (clientReferenceCode || captureContextClientRefCode) {
        paymentUtils.logData(__filename, 'addUcCompletionCustomFields', Constants.LOG_WARN, 'SKIPPED', '[CLIENT_REF_CODE] Both completion and captureContext values invalid - skipping isv_clientReferenceCode field. completionValue=' + clientReferenceCode + ', captureContextValue=' + captureContextClientRefCode);
    }

    if (processorTransactionId) {
        updateResponse.actions.push({
            action: Constants.SET_CUSTOM_FIELD,
            name: 'isv_processorTransactionId',
            value: processorTransactionId,
        } as Partial<ActionType>);
    }
    return updateResponse;
};

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * TSS typically lags a couple seconds behind CyberSource authorization, so wait before
 * the first lookup and retry when the transaction is still being indexed.
 */
const getTransactionDataWithRetry = async (transactionId: string, payment: Payment | null, midCredentials: any, retries: number = 3, delayMs: number = 1500): Promise<any> => {
    let lastResponse: any = null;
    // keep total wait inside the commercetools extension timeout
    await sleep(delayMs);
    for (let attempt = 1; attempt <= retries; attempt++) {
        lastResponse = await getTransactionData.getTransactionData(transactionId, payment, midCredentials);
        if (200 === lastResponse?.httpCode || attempt === retries) {
            break;
        }
        if (200 !== lastResponse?.httpCode) {
            await sleep(delayMs);
        }
    }
    return lastResponse;
};


/**
 * Derives the UC completion transaction state classification (success/pending/failure),
 * sale-flow detection, and risk-declined flag from the completion token + TSS status.
 */
const classifyUcCompletionState = (
    completionDetails: any,
    paymentMethod: string | undefined,
    billApplication: any,
    completeMandateType: any,
): { status: string; isSaleFlow: boolean; isRiskDeclined: boolean; state: string; isReviewStatus: boolean; successState: string } => {
    const status = String(completionDetails.cybsStatus || '').toUpperCase();
    const isSaleFlow = !!billApplication || 'CAPTURE' === completeMandateType || (isApmOrEcheckMethod(paymentMethod) && Constants.API_STATUS_PENDING === status) || (Constants.API_STATUS_COMPLETED === status && hasFinalCapture(completionDetails.decodedToken || {}, completionDetails.completionToken || {}));
    const isRiskDeclined = Constants.API_STATUS_AUTHORIZED_RISK_DECLINED === status;
    let state = Constants.CT_TRANSACTION_STATE_SUCCESS;
    if (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW === status || Constants.API_STATUS_PENDING_REVIEW === status) {
        state = Constants.CT_TRANSACTION_STATE_PENDING;
    } else if (!isRiskDeclined && (Constants.API_STATUS_DECLINED === status || Constants.API_STATUS_INVALID_REQUEST === status || 'CUSTOMER_AUTHENTICATION_REQUIRED' === completionDetails.completionToken?.errorInformation?.reason)) {
        state = Constants.CT_TRANSACTION_STATE_FAILURE;
    }
    const isReviewStatus = Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW === status || Constants.API_STATUS_PENDING_REVIEW === status;
    const successState = !isReviewStatus && isSaleFlow && Constants.CT_TRANSACTION_STATE_FAILURE !== state ? Constants.CT_TRANSACTION_STATE_SUCCESS : state;
    return { status, isSaleFlow, isRiskDeclined, state, isReviewStatus, successState };
};

const getUcCompletionError = (state: string, completionToken: any): any | null => {
    if (Constants.CT_TRANSACTION_STATE_FAILURE !== state || !completionToken?.errorInformation) {
        return null;
    }

    const errorInfo = completionToken.errorInformation;
    const errorMessage = errorInfo.message || errorInfo.reason || 'Authorization declined';
    const errorCode = errorInfo.code || 'DECLINED';
    const errorDetails = errorInfo.details ? JSON.stringify(errorInfo.details) : '';

    return {
        code: errorCode,
        message: errorMessage,
        ...(errorDetails && { details: errorDetails }),
    };
};

const createUcCompletionTransactionActions = (
    paymentObj: Payment,
    completionDetails: any,
    paymentMethod: string | undefined,
    billApplication: any,
    completionState: ReturnType<typeof classifyUcCompletionState>,
): Partial<ActionType>[] => {
    const { isSaleFlow, isRiskDeclined, state, isReviewStatus, successState } = completionState;
    const actions: Partial<ActionType>[] = [
        {
            action: Constants.ADD_TRANSACTION,
            transaction: paymentUtils.createTransactionObject(undefined, paymentObj.amountPlanned, Constants.CT_TRANSACTION_TYPE_AUTHORIZATION, successState, completionDetails.cybsTransactionId, paymentUtils.getDate(Date.now(), true) as string),
        } as Partial<ActionType>,
    ];

    if (isSaleFlow && Constants.CT_TRANSACTION_STATE_FAILURE !== state && !isReviewStatus && !isRiskDeclined) {
        actions.push({
            action: Constants.ADD_TRANSACTION,
            transaction: paymentUtils.createTransactionObject(
                undefined,
                paymentObj.amountPlanned,
                Constants.CT_TRANSACTION_TYPE_CHARGE,
                mapBillApplicationToCtState(billApplication, isPendingFriendlyPaymentMethod(paymentMethod)),
                completionDetails.cybsTransactionId,
                paymentUtils.getDate(Date.now(), true) as string,
            ),
        } as Partial<ActionType>);
    }

    return actions;
};

const hasValidUcTokenIds = (tokenInfo: any): boolean => {
    return !!tokenInfo?.paymentInstrument?.id && !!tokenInfo?.instrumentIdentifier?.id;
};

const selectInitialUcTokenInformation = (tssResponse: any, decodedToken: any, completionToken: any): any => {
    const validTssTokenInfo = hasValidUcTokenIds(tssResponse?.tokenInformation) ? tssResponse.tokenInformation : null;

    return validTssTokenInfo || decodedToken.tokenInformation || decodedToken.content?.tokenInformation || decodedToken.details?.tokenInformation || decodedToken.data?.tokenInformation || completionToken?.tokenInformation || null;
};

type UcCardDetails = {
    cardType: string;
    expMonth: string;
    expYear: string;
    maskedPan: string;
};

const extractInitialUcCardDetails = (tssResponse: any, completionToken: any, decodedToken: any): UcCardDetails => {
    const cardTypeCodeMap: Record<string, string> = {
        VISA: '001',
        MASTERCARD: '002',
        AMEX: '003',
        DISCOVER: '004',
        DINERSCLUB: '005',
        JCB: '007',
        MAESTRO: '042',
        CUP: '062',
    };
    const cardInfoCandidates = [
        tssResponse?.rawTransaction?.paymentInformation?.card,
        tssResponse?.paymentInformation?.card,
        tssResponse?.cardFieldGroup,
        completionToken?.paymentInformation?.card,
        completionToken?.paymentInformation?.tokenizedCard,
        completionToken?.paymentAccountInformation?.card,
        decodedToken?.details?.paymentInformation?.card,
        decodedToken?.details?.paymentInformation?.tokenizedCard,
        decodedToken?.details?.paymentAccountInformation?.card,
        decodedToken?.content?.paymentInformation?.card,
        decodedToken?.content?.paymentInformation?.tokenizedCard,
        decodedToken?.data?.paymentInformation?.card,
    ];
    const firstCardValue = (...selectors: Array<(cardInfo: any) => any>) => {
        for (const cardInfo of cardInfoCandidates) {
            for (const selector of selectors) {
                const value = selector(cardInfo);
                if (value) {
                    return value;
                }
            }
        }
        return '';
    };

    let cardType = firstCardValue((cardInfo) => cardInfo?.type?.value, (cardInfo) => cardInfo?.type);
    const expMonth = firstCardValue((cardInfo) => cardInfo?.expirationMonth?.value, (cardInfo) => cardInfo?.expirationMonth, (cardInfo) => cardInfo?.card?.expirationMonth);
    const expYear = firstCardValue((cardInfo) => cardInfo?.expirationYear?.value, (cardInfo) => cardInfo?.expirationYear, (cardInfo) => cardInfo?.card?.expirationYear);
    let maskedPan = '';
    const maskedValue = firstCardValue((cardInfo) => cardInfo?.number?.maskedValue, (cardInfo) => cardInfo?.card?.number?.maskedValue);
    const bin = firstCardValue((cardInfo) => cardInfo?.number?.bin, (cardInfo) => cardInfo?.prefix, (cardInfo) => cardInfo?.card?.number?.bin);
    if (maskedValue) {
        maskedPan = bin && maskedValue.startsWith('X') ? bin + maskedValue.slice(bin.length) : maskedValue;
    }
    if (cardType && cardTypeCodeMap[cardType.toUpperCase()]) {
        cardType = cardTypeCodeMap[cardType.toUpperCase()];
    }

    return { cardType, expMonth, expYear, maskedPan };
};

const applyUcCardDetails = (customFieldsRef: any, updateResponse: ActionResponseType, cardDetails: UcCardDetails): void => {
    const { expMonth, expYear, cardType } = cardDetails;
    let { maskedPan } = cardDetails;

    if (expMonth) {
        customFieldsRef.isv_cardExpiryMonth = expMonth;
        updateResponse.actions.push({ action: Constants.SET_CUSTOM_FIELD, name: 'isv_cardExpiryMonth', value: expMonth } as Partial<ActionType>);
    }
    if (expYear) {
        customFieldsRef.isv_cardExpiryYear = expYear;
        updateResponse.actions.push({ action: Constants.SET_CUSTOM_FIELD, name: 'isv_cardExpiryYear', value: expYear } as Partial<ActionType>);
    }
    if (cardType) {
        customFieldsRef.isv_cardType = cardType;
        updateResponse.actions.push({ action: Constants.SET_CUSTOM_FIELD, name: 'isv_cardType', value: cardType } as Partial<ActionType>);
    }
    if (maskedPan) {
        const last4 = maskedPan.replace(/[^0-9]/g, '').slice(-4) || maskedPan.slice(-4);
        maskedPan = 'X'.repeat(Math.max(maskedPan.length - 4, 0)) + last4;
        customFieldsRef.isv_maskedPan = maskedPan;
        updateResponse.actions.push({ action: Constants.SET_CUSTOM_FIELD, name: 'isv_maskedPan', value: maskedPan } as Partial<ActionType>);
    }
};

const buildUcTokenSaveDecisionResponse = (decodedToken: any, completionToken: any, tssResponse: any, cybsStatus: string): any => {
    const primaryAuthSource = completionToken || decodedToken?.details || {};
    const secondaryAuthSource = tssResponse?.rawTransaction || tssResponse || {};
    const primaryInitiator = primaryAuthSource?.processingInformation?.authorizationOptions?.initiator;
    const secondaryInitiator = secondaryAuthSource?.processingInformation?.authorizationOptions?.initiator;

    return {
        status: cybsStatus,
        ...secondaryAuthSource,
        ...primaryAuthSource,
        processorInformation: {
            ...(secondaryAuthSource?.processorInformation || {}),
            ...(primaryAuthSource?.processorInformation || {}),
        },
        processingInformation: {
            ...(secondaryAuthSource?.processingInformation || {}),
            ...(primaryAuthSource?.processingInformation || {}),
            authorizationOptions: {
                ...(secondaryAuthSource?.processingInformation?.authorizationOptions || {}),
                ...(primaryAuthSource?.processingInformation?.authorizationOptions || {}),
                initiator: {
                    ...secondaryInitiator,
                    ...primaryInitiator,
                },
            },
        },
    };
};

const completeUcTokenInformation = (tokenInfo: any, paymentInstrumentIdFromInstrumentLookup: string, instrumentId: string): any => {
    let completedTokenInfo = tokenInfo;
    if (!completedTokenInfo?.paymentInstrument?.id && paymentInstrumentIdFromInstrumentLookup) {
        completedTokenInfo = {
            ...completedTokenInfo,
            paymentInstrument: {
                ...(completedTokenInfo?.paymentInstrument || {}),
                id: paymentInstrumentIdFromInstrumentLookup,
            },
        };
    }
    if (!completedTokenInfo?.instrumentIdentifier?.id && instrumentId) {
        completedTokenInfo = {
            ...completedTokenInfo,
            instrumentIdentifier: {
                ...(completedTokenInfo?.instrumentIdentifier || {}),
                id: instrumentId,
            },
        };
    }
    return completedTokenInfo;
};

const buildUcTokenAddress = (billToFieldsForToken: any): any => {
    return {
        firstName: billToFieldsForToken.firstName || '',
        lastName: billToFieldsForToken.lastName || '',
        address1: billToFieldsForToken.address1 || billToFieldsForToken.streetName || '',
        address2: billToFieldsForToken.address2 || billToFieldsForToken.additionalStreetInfo || '',
        locality: billToFieldsForToken.locality || billToFieldsForToken.city || '',
        administrativeArea: billToFieldsForToken.administrativeArea || billToFieldsForToken.region || '',
        postalCode: billToFieldsForToken.postalCode || '',
        country: billToFieldsForToken.country || '',
        email: billToFieldsForToken.email || '',
        phoneNumber: billToFieldsForToken.phoneNumber || billToFieldsForToken.phone || '',
    };
};

const containsPersistedUcToken = (persistedTokenStrings: string[], instrumentIdentifier: string, finalPaymentInstrumentId: string): boolean => {
    return persistedTokenStrings.some((token: string) => {
        try {
            const parsedToken = JSON.parse(token);
            return parsedToken?.instrumentIdentifier === instrumentIdentifier && parsedToken?.paymentToken === finalPaymentInstrumentId;
        } catch (_parseErr) {
            return false;
        }
    });
};

const createCompletionTransactions = async (paymentObj: Payment): Promise<ActionResponseType> => {
    let result = paymentUtils.getEmptyResponse();
    const transientToken = paymentObj?.custom?.fields?.isv_transientToken || paymentObj?.custom?.fields?.isv_token || '';
    const completionDetails = getUcCompletionTokenDetails(transientToken);
    if (completionDetails.isUcCompletionToken && paymentObj?.amountPlanned) {
        const tssResponse = await getTransactionDataWithRetry(completionDetails.cybsTransactionId, paymentObj, null);
        const paymentMethod = paymentObj.paymentMethodInfo?.method;
        const billApplication = getBillApplication(tssResponse);
        const completeMandateType = getCompleteMandateType(completionDetails.decodedToken || {}, completionDetails.completionToken || {});
        const completionState = classifyUcCompletionState(completionDetails, paymentMethod, billApplication, completeMandateType);
        const { isRiskDeclined, state } = completionState;
        const actions = createUcCompletionTransactionActions(paymentObj, completionDetails, paymentMethod, billApplication, completionState);

        let customFieldResponse = addUcCompletionCustomFields(
            { actions, errors: [] },
            completionDetails.completionToken,
            completionDetails.cybsStatus,
            completionDetails.cybsSubmitTimeUtc,
            completionDetails.clientReferenceCode,
            completionDetails.approvalCode,
            completionDetails.processorTransactionId,
            paymentObj?.custom?.fields?.isv_captureContextClientReferenceCode || '',
        );

        const completionError = getUcCompletionError(state, completionDetails.completionToken);
        if (completionError) {
            customFieldResponse.errors.push(completionError);
        }
        if (isRiskDeclined) {
            const cartObj = await paymentUtils.getCartObject(paymentObj);
            if (cartObj?.results?.length) {
                customFieldResponse = await orderManagementHelper.handleAuthReversalResponse(paymentObj, cartObj.results[0], { transactionId: completionDetails.cybsTransactionId }, customFieldResponse);
            } else {
                paymentUtils.logData(__filename, 'createCompletionTransactions', Constants.LOG_ERROR, paymentObj.id, 'AUTHORIZED_RISK_DECLINED auth reversal skipped - no cart found for payment');
            }
        }

        result = await enrichAndSaveUcTokenData(paymentObj, paymentObj.id, paymentMethod, customFieldResponse, completionDetails.decodedToken || {}, completionDetails.completionToken, completionDetails.cybsTransactionId, completionDetails.cybsStatus, tssResponse);
    }
    return result;
};

/**
 * Enriches card details and saves token data during UC auto-processing.
 *
 * This preserves your existing logic:
 * - Extract card data from JWT
 * - Fallback to InstrumentIdentifier API
 * - Fallback to PaymentInstrument API
 * - Fallback to Transaction Details API for tokenInformation
 * - Save token via explicit isv_tokens merge + full-array replacement
 */
const enrichAndSaveUcTokenData = async (
    paymentObj: Payment,
    updatePaymentId: string,
    paymentMethod: string | undefined,
    updateResponse: ActionResponseType,
    decodedToken: Record<string, any>,
    completionToken: any,
    cybsTransactionId: string,
    cybsStatus: string,
    tssResponse?: any,
    isMyAccountsFlow: boolean = false,
): Promise<ActionResponseType> => {
    try {
        do {
            const allowedPaymentMethodsForSaving = ['creditCard', 'eCheck'];
            if (!paymentMethod || !allowedPaymentMethodsForSaving.includes(paymentMethod)) {
                break;
            }
            let jwtTokenInfo = selectInitialUcTokenInformation(tssResponse, decodedToken, completionToken);

            const initialCardDetails = extractInitialUcCardDetails(tssResponse, completionToken, decodedToken);
            let { expMonth, expYear, maskedPan } = initialCardDetails;
            const { cardType } = initialCardDetails;
            const instrumentId = jwtTokenInfo?.instrumentIdentifier?.id || '';
            let paymentInstrumentIdFromInstrumentLookup = '';
            const hasPaymentInstrumentFromTokenInfo = !!jwtTokenInfo?.paymentInstrument?.id;
            let eCheckBankAccountFromTms: any = null;

            if ((isMyAccountsFlow || !expMonth || !expYear || !maskedPan) && instrumentId) {
                try {
                    const merchantId = paymentObj?.custom?.fields?.isv_merchantId || process.env.PAYMENT_GATEWAY_MERCHANT_ID || '';
                    const instrumentResponse = await getCardByInstrumentId.getCardByInstrumentResponse(instrumentId, merchantId);
                    if (200 === instrumentResponse?.httpCode) {
                        const instrumentResponseAny = instrumentResponse as any;
                        let instrumentData: any;

                        try {
                            if (instrumentResponseAny?.text) {
                                instrumentData = JSON.parse(instrumentResponseAny.text);
                            } else if ('string' === typeof instrumentResponseAny) {
                                instrumentData = JSON.parse(instrumentResponseAny);
                            } else {
                                instrumentData = instrumentResponseAny;
                            }
                        } catch (error) {
                            paymentUtils.logData(__filename, 'processTransaction', Constants.LOG_ERROR, updatePaymentId, 'AutoProcessing: Error parsing TMS response: ' + error);
                            instrumentData = undefined;
                        }

                        const bankAccount = instrumentData?.bankAccount;

                        if (!eCheckBankAccountFromTms && bankAccount) {
                            eCheckBankAccountFromTms = bankAccount;
                        }

                        if ((isMyAccountsFlow || !expMonth) && instrumentResponse.expirationMonth) {
                            expMonth = instrumentResponse.expirationMonth;
                        }

                        if ((isMyAccountsFlow || !expYear) && instrumentResponse.expirationYear) {
                            expYear = instrumentResponse.expirationYear;
                        }

                        if (!maskedPan) {
                            const preferredNumber = instrumentResponse.cardNumber || instrumentResponse.tokenizedCardNumber || instrumentResponse.cardPrefix;
                            if (preferredNumber) {
                                maskedPan = preferredNumber;
                            } else if (instrumentResponse.cardSuffix) {
                                maskedPan = instrumentResponse.cardSuffix;
                            }
                        }

                        if (!hasPaymentInstrumentFromTokenInfo && !paymentInstrumentIdFromInstrumentLookup) {
                            paymentInstrumentIdFromInstrumentLookup = await getCardByInstrumentId.getPaymentInstrumentIdByInstrumentIdentifier(instrumentId, merchantId);
                        }
                    }
                } catch (tmsErr) {
                    paymentUtils.logData(__filename, 'processTransaction', Constants.LOG_WARN, updatePaymentId, 'AutoProcessing: TMS InstrumentIdentifier failed: ' + tmsErr);
                }
            }

            const paymentInstrumentId = jwtTokenInfo?.paymentInstrument?.id || paymentInstrumentIdFromInstrumentLookup || '';

            if ((isMyAccountsFlow || !expMonth || !expYear) && paymentInstrumentId) {
                try {
                    const merchantId = paymentObj?.custom?.fields?.isv_merchantId || process.env.PAYMENT_GATEWAY_MERCHANT_ID || '';

                    const configObject = await prepareFields.getConfigObject('FuncGetPaymentInstrument', null, null, merchantId);

                    const apiClient = new restApi.ApiClient();
                    const piApiInstance = configObject && new restApi.PaymentInstrumentApi(configObject, apiClient);

                    if (piApiInstance) {
                        const piResponse: any = await new Promise((resolve, reject) => {
                            piApiInstance.getPaymentInstrument(paymentInstrumentId, null, (error: any, data: any) => {

                                if (data) {
                                    resolve(data);
                                } else {
                                    reject(error);
                                }
                            });
                        }).catch((err: any) => {
                            paymentUtils.logData(__filename, 'processTransaction', Constants.LOG_WARN, updatePaymentId, 'AutoProcessing: PaymentInstrument API error: ' + err?.status);
                            return null;
                        });

                        const currentPaymentInstrumentCard = piResponse?.card || piResponse?.embedded?.instrumentIdentifier?.tokenizedCard?.card || piResponse?.embedded?.tokenizedCard?.card;
                        if (currentPaymentInstrumentCard) {
                            if ((isMyAccountsFlow || !expMonth) && currentPaymentInstrumentCard.expirationMonth) {
                                expMonth = currentPaymentInstrumentCard.expirationMonth;
                            }

                            if ((isMyAccountsFlow || !expYear) && currentPaymentInstrumentCard.expirationYear) {
                                expYear = currentPaymentInstrumentCard.expirationYear;
                            }

                            if (!maskedPan && currentPaymentInstrumentCard.number) {
                                maskedPan = currentPaymentInstrumentCard.number;
                            }
                        }
                    }
                } catch (piErr) {
                    paymentUtils.logData(__filename, 'processTransaction', Constants.LOG_WARN, updatePaymentId, 'AutoProcessing: PaymentInstrument API failed: ' + piErr);
                }
            }

            if (!paymentObj.custom) {
                (paymentObj as any).custom = { fields: {} };
            }

            if (!(paymentObj.custom as any).fields) {
                (paymentObj.custom as any).fields = {};
            }

            const customFieldsRef = (paymentObj as any).custom.fields;
            applyUcCardDetails(customFieldsRef, updateResponse, { cardType, expMonth, expYear, maskedPan });

            let autoProcessCustomerId = paymentObj?.customer?.id || '';
            let autoProcessCart: any = null;

            if (!autoProcessCustomerId) {
                try {
                    const cartLookup = await paymentUtils.getCartObject(paymentObj);
                    autoProcessCart = cartLookup?.results?.[0];
                    autoProcessCustomerId = autoProcessCart?.customerId || '';

                    if (!autoProcessCustomerId) {
                        const cartEmail = autoProcessCart?.customerEmail || '';

                        if (cartEmail) {
                            try {
                                const customerByEmail = await commercetoolsApi.getCustomerByEmail(cartEmail);

                                if (customerByEmail?.id) {
                                    autoProcessCustomerId = customerByEmail.id;

                                }
                            } catch (emailErr) {
                                paymentUtils.logData(__filename, 'processTransaction', Constants.LOG_WARN, updatePaymentId, 'AutoProcessing: Customer email lookup failed: ' + emailErr);
                            }
                        }
                    }
                } catch (cartErr) {
                    paymentUtils.logData(__filename, 'processTransaction', Constants.LOG_WARN, updatePaymentId, 'AutoProcessing: Failed to get cart for customer lookup: ' + cartErr);
                }
            }
            const ucTransactionResponseForSaveDecision = buildUcTokenSaveDecisionResponse(decodedToken, completionToken, tssResponse, cybsStatus);
            const parsedTransactionForTokenSave = getParsedTransactionPayload(ucTransactionResponseForSaveDecision);
            const isECheck = isECheckPayment(parsedTransactionForTokenSave);

            const effectiveStatus = String(cybsStatus || '').toUpperCase();
            const statusAllowsSave = Constants.API_STATUS_AUTHORIZED === effectiveStatus || Constants.API_STATUS_PENDING === effectiveStatus;
            const shouldSaveToken = statusAllowsSave && hasValidUcTokenIds(jwtTokenInfo);
            if (!shouldSaveToken) {
                break;
            }

            if (autoProcessCustomerId) {
                try {
                    let tokenInfo = jwtTokenInfo;

                    if ((!tokenInfo?.paymentInstrument?.id || !tokenInfo?.instrumentIdentifier?.id) && cybsTransactionId) {
                        try {
                            const tokenDataResponse = tssResponse?.httpCode ? tssResponse : await getTransactionData.getTransactionData(cybsTransactionId, paymentObj, null);

                            if (200 === tokenDataResponse?.httpCode && tokenDataResponse?.tokenInformation) {
                                const tssTokenInfo = tokenDataResponse.tokenInformation;
                                if (tssTokenInfo.paymentInstrument?.id && tssTokenInfo.instrumentIdentifier?.id) {
                                    tokenInfo = tssTokenInfo;
                                }
                            }
                        } catch (tssErr) {
                            paymentUtils.logData(__filename, 'processTransaction', Constants.LOG_WARN, updatePaymentId, 'AutoProcessing: Transaction Details API failed: ' + tssErr);
                        }
                    }

                    tokenInfo = completeUcTokenInformation(tokenInfo, paymentInstrumentIdFromInstrumentLookup, instrumentId);
    
                    if (tokenInfo?.paymentInstrument?.id && tokenInfo?.instrumentIdentifier?.id) {
                        if (!autoProcessCart && !isMyAccountsFlow) {
                            const cartObj = await paymentUtils.getCartObject(paymentObj);
                            autoProcessCart = cartObj?.results?.[0];
                        }

                        let addressId = isMyAccountsFlow ? (paymentObj as any)?.custom?.fields?.isv_selectedAddressId || '' : autoProcessCart?.billingAddress?.id || '';

                        if (Constants.UC_ADDRESS === addressId) {
                            addressId = '';
                        }

                        let customerInfo = await commercetoolsApi.getCustomer(autoProcessCustomerId);

                        if (!addressId && autoProcessCart?.billingAddress) {
                            if (customerInfo && !customerInfo?.addresses?.length) {
                                customerInfo = await commercetoolsApi.addCustomerAddress(autoProcessCustomerId, autoProcessCart.billingAddress);
                            }

                            if (customerInfo?.addresses?.length) {
                                addressId = customerInfo.addresses[customerInfo.addresses.length - 1].id || '';
                            }
                        }

                        const customerTokenId = tokenInfo.customer?.id || '';
                        const finalPaymentInstrumentId = tokenInfo.paymentInstrument.id;
                        const instrumentIdentifier = tokenInfo.instrumentIdentifier.id;

                        const billToFromUcPayload = completionToken?.orderInformation?.billTo || decodedToken?.details?.orderInformation?.billTo || tssResponse?.rawTransaction?.orderInformation?.billTo || tssResponse?.orderInformation?.billTo || null;
                        let selectedCustomerAddress: any = null;
                        if (isMyAccountsFlow && customerInfo?.addresses?.length) {
                            const selectedAddressId = (paymentObj as any)?.custom?.fields?.isv_selectedAddressId;
                            if (selectedAddressId) {
                                selectedCustomerAddress = customerInfo.addresses.find((addr: any) => addr?.id === selectedAddressId);
                            }
                            if (!selectedCustomerAddress) {
                                selectedCustomerAddress = customerInfo.addresses[0];
                            }
                            addressId = selectedCustomerAddress?.id || addressId;
                        }
                        if (!selectedCustomerAddress && addressId && customerInfo?.addresses?.length) {
                            selectedCustomerAddress = customerInfo.addresses.find((address: any) => address?.id === addressId) || null;
                        }
                        const billToFieldsForToken = billToFromUcPayload || selectedCustomerAddress || autoProcessCart?.billingAddress || null;

                        const customFieldsForToken: any = {
                            ...(paymentObj?.custom?.fields || {}),
                            isv_addressId: addressId || Constants.UC_ADDRESS,
                        };
                        let finalTokenObject: any = null;

                        if (isECheck) {
                            finalTokenObject = buildECheckTokenObject(
                                {
                                    customer: { id: customerTokenId },
                                    paymentInstrument: { id: finalPaymentInstrumentId },
                                    instrumentIdentifier: { id: instrumentIdentifier },
                                },
                                eCheckBankAccountFromTms,
                                billToFieldsForToken,
                            );
                        } else {
                            finalTokenObject = customerInfo && customFieldsForToken ? await paymentUtils.createTokenData(customFieldsForToken, customerInfo, finalPaymentInstrumentId, instrumentIdentifier, customerTokenId, billToFieldsForToken) : null;
                        }

                        if (!finalTokenObject) {
                            paymentUtils.logData(__filename, 'processTransaction', Constants.LOG_WARN, updatePaymentId, 'AutoProcessing: Final token object empty, skipping token save');
                            break;
                        }
                        if (finalTokenObject && billToFieldsForToken && !finalTokenObject.address) {
                            try {
                                finalTokenObject.address = buildUcTokenAddress(billToFieldsForToken);
                
                            } catch (addressEmbedErr) {
                                paymentUtils.logData(__filename, 'processTransaction', Constants.LOG_WARN, updatePaymentId, '[MyAccounts] Failed to embed address in token: ' + addressEmbedErr);
                            }
                        }
                        if (finalTokenObject && billToFieldsForToken) {
                            finalTokenObject.addressId = addressId || Constants.UC_ADDRESS;
                        }
                        if (autoProcessCustomerId && !paymentObj?.customer?.id) {
                            (paymentObj as any).customer = {
                                typeId: 'customer',
                                id: autoProcessCustomerId,
                            };
                        }

                        const existingCustomerTokens = customerInfo?.custom?.fields?.isv_tokens || [];

                        const { stringifiedTokens, alreadyExists } = mergeCustomerTokens(existingCustomerTokens, finalTokenObject);
                        if (isMyAccountsFlow && customerInfo) {
                            updateResponse.actions.push({
                                action: Constants.SET_CUSTOM_FIELD,
                                name: Constants.ISV_TOKENS,
                                value: stringifiedTokens,
                            } as Partial<ActionType>);
                            updateResponse.actions.push({
                                action: Constants.SET_CUSTOM_FIELD,
                                name: Constants.ISV_TOKEN,
                                value: null,
                            } as Partial<ActionType>);
                            updateResponse.actions.push({
                                action: Constants.SET_CUSTOM_FIELD,
                                name: Constants.ISV_ADDRESS_ID,
                                value: null,
                            } as Partial<ActionType>);
                        } else if (!isMyAccountsFlow && customerInfo) {
                            try {
                                await commercetoolsApi.updateCustomerTokensField(autoProcessCustomerId, stringifiedTokens, customerTokenId || null);
                            } catch (err: any) {
                                paymentUtils.logData(__filename, 'processTransaction', Constants.LOG_ERROR, updatePaymentId, 'updateCustomerTokensField FAILED: ' + (err?.message || err));
                                throw err;
                            }
                        } else {
                            paymentUtils.logData(__filename, 'processTransaction', Constants.LOG_WARN, updatePaymentId, 'Customer not found');
                        }
                        updateResponse.actions.push({
                            action: Constants.SET_CUSTOM_FIELD,
                            name: 'isv_savedToken',
                            value: finalPaymentInstrumentId,
                        } as Partial<ActionType>);
                        if (!isMyAccountsFlow) {
                            let persistedHasNewToken = false;
                            let persistedTokenStrings: string[] = [];
                            const verificationAttempts = 5;

                            for (let attempt = 1; attempt <= verificationAttempts; attempt++) {
                                const persistedCustomer = await commercetoolsApi.getCustomer(autoProcessCustomerId);
                                persistedTokenStrings = persistedCustomer?.custom?.fields?.isv_tokens || [];

                                persistedHasNewToken = containsPersistedUcToken(persistedTokenStrings, instrumentIdentifier, finalPaymentInstrumentId);
                

                                if (persistedHasNewToken) {
                                    break;
                                }
                            }
                            if (!alreadyExists && !persistedHasNewToken) {
                                throw new Error('Token persistence verification failed: new token not found after update');
                            }
                        }
                    }
                } catch (tokenErr) {
                    paymentUtils.logData(__filename, 'processTransaction', Constants.LOG_ERROR, updatePaymentId, 'Error saving token during autoProcessing: ' + tokenErr);
                }
            }

        } while (false);
    } catch (err) {
        paymentUtils.logData(__filename, 'processTransaction', Constants.LOG_WARN, updatePaymentId, 'AutoProcessing enrichment failed: ' + err);
    }
    return updateResponse;
};

type ProcessTransactionBranch = 'ORDER_MANAGEMENT' | 'TERMINAL_TRANSACTION' | 'PAYER_AUTHENTICATION' | 'AUTHORIZATION_PROCESSING';

const classifyProcessTransactionBranch = (
    transactionLength: number,
    updateTransactions: any,
    paymentMethod: string | undefined,
    paymentCustomFields: any,
): ProcessTransactionBranch => {
    const isInitialOrderManagementTransaction =
        updateTransactions &&
        [Constants.CT_TRANSACTION_TYPE_CHARGE, Constants.CT_TRANSACTION_TYPE_REFUND, Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION].includes(updateTransactions.type as string) &&
        Constants.CT_TRANSACTION_STATE_INITIAL === updateTransactions.state;

    if (isInitialOrderManagementTransaction) {
        return 'ORDER_MANAGEMENT';
    }

    if (
        1 !== transactionLength ||
        !updateTransactions ||
        (Constants.CT_TRANSACTION_TYPE_AUTHORIZATION !== updateTransactions.type && !(Constants.CT_TRANSACTION_TYPE_CHARGE === updateTransactions.type && Constants.ECHECK === paymentMethod))
    ) {
        return 'ORDER_MANAGEMENT';
    }

    if ([Constants.CT_TRANSACTION_STATE_SUCCESS, Constants.CT_TRANSACTION_STATE_FAILURE, Constants.CT_TRANSACTION_STATE_PENDING].includes(updateTransactions.state as string)) {
        return 'TERMINAL_TRANSACTION';
    }

    if (paymentCustomFields && Constants.CC_PAYER_AUTHENTICATION === paymentMethod && 'isv_payerAuthenticationRequired' in paymentCustomFields && paymentCustomFields?.isv_payerEnrollStatus && paymentCustomFields?.isv_payerEnrollTransactionId) {
        return 'PAYER_AUTHENTICATION';
    }

    return 'AUTHORIZATION_PROCESSING';
};

/**
 * Processes a transaction for a given payment object.
 *
 * This function evaluates the transaction details and performs the appropriate
 * action based on the transaction state and type.
 *
 * Critical fix:
 * If isv_transientToken is a Unified Checkout completion token that already
 * contains authorization result, we update CT transaction directly and skip
 * /pts/v2/payments.
 */
const processTransaction = async (paymentObj: Payment) => {
    const transactionLength = paymentObj.transactions?.length || 0;
    const updatePaymentId = paymentObj.id;
    const paymentMethod = paymentObj.paymentMethodInfo?.method;
    const paymentCustomFields = paymentObj.custom?.fields;
    const updateTransactions = paymentObj?.transactions?.[transactionLength - 1];
    let updateResponse = paymentUtils.getEmptyResponse();
    const paymentResponse = {
        httpCode: 0,
        status: '',
        transactionId: '',
    };

    const processingBranch = classifyProcessTransactionBranch(transactionLength, updateTransactions, paymentMethod, paymentCustomFields);

    if ('ORDER_MANAGEMENT' === processingBranch) {
        return paymentHandler.handleOrderManagement(updatePaymentId, paymentObj, updateTransactions as Partial<PaymentTransactionType>);
    }

    if ('TERMINAL_TRANSACTION' === processingBranch) {
        updateResponse = paymentUtils.getEmptyResponse();
    } else if ('PAYER_AUTHENTICATION' === processingBranch) {
        const payerAuthenticationFields = paymentCustomFields!;
            paymentResponse.httpCode = Number(payerAuthenticationFields.isv_payerEnrollHttpCode);
            paymentResponse.status = payerAuthenticationFields.isv_payerEnrollStatus;
            paymentResponse.transactionId = payerAuthenticationFields.isv_payerEnrollTransactionId;

            updateResponse = getAuthResponse(paymentResponse, updateTransactions as Partial<PaymentTransactionType>);

            if (paymentResponse && Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode && Constants.API_STATUS_AUTHORIZED_RISK_DECLINED === paymentResponse.status) {
                updateResponse = await paymentHandler.handlePayerAuthReversal(paymentObj, paymentResponse, updateResponse);
            }
    } else {
            const transientToken = paymentCustomFields?.isv_transientToken || paymentCustomFields?.isv_token || '';

            if (transientToken) {
                const {
                    isUcCompletionToken,
                    decodedToken,
                    completionToken,
                    cybsTransactionId,
                    cybsStatus,
                    cybsSubmitTimeUtc,

                    clientReferenceCode,
                    approvalCode,
                    processorTransactionId,
                } = getUcCompletionTokenDetails(transientToken);

                if (isUcCompletionToken && decodedToken && completionToken) {
                    const tssResponse = cybsTransactionId ? await getTransactionDataWithRetry(cybsTransactionId, paymentObj, null) : null;
                    const effectivePaymentMethod = paymentMethod;
                    const billApplication = getBillApplication(tssResponse);
                    const completeMandateType = getCompleteMandateType(decodedToken, completionToken);
                    const isAPMOrECheck = isApmOrEcheckMethod(effectivePaymentMethod);
                    const isPendingStatus = Constants.API_STATUS_PENDING === (cybsStatus || '').toUpperCase();
                    const isCompletedStatus = Constants.API_STATUS_COMPLETED === (cybsStatus || '').toUpperCase();
                    const isFinalCapture = hasFinalCapture(decodedToken, completionToken);
                    const isSaleFlow = !!billApplication || 'CAPTURE' === completeMandateType || (isAPMOrECheck && isPendingStatus) || (isCompletedStatus && isFinalCapture);
                    const isPendingMethod = isPendingFriendlyPaymentMethod(effectivePaymentMethod);
                    const authorizationTransaction = paymentObj.transactions?.find((transaction) => transaction.type === Constants.CT_TRANSACTION_TYPE_AUTHORIZATION) || updateTransactions;
                    const setTransaction = {
                        action: Constants.CHANGE_TRANSACTION_INTERACTION_ID,
                        interactionId: cybsTransactionId,
                        transactionId: authorizationTransaction.id,
                    } as Partial<ActionType>;
                    const isScaRetryFailure = '201' === cybsStatus && 'CUSTOMER_AUTHENTICATION_REQUIRED' === completionToken?.errorInformation?.reason;
                    const isRiskDeclined = Constants.API_STATUS_AUTHORIZED_RISK_DECLINED === cybsStatus;
                    let authStateToSet = Constants.CT_TRANSACTION_STATE_SUCCESS;
                    if (isScaRetryFailure) {
                        authStateToSet = Constants.CT_TRANSACTION_STATE_FAILURE;
                    } else if (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW === cybsStatus || Constants.API_STATUS_PENDING_REVIEW === cybsStatus) {
                        authStateToSet = Constants.CT_TRANSACTION_STATE_PENDING;
                    } else if (Constants.API_STATUS_DECLINED === cybsStatus || Constants.API_STATUS_INVALID_REQUEST === cybsStatus) {
                        authStateToSet = Constants.CT_TRANSACTION_STATE_FAILURE;
                    }
                    const setState = {
                        action: Constants.CHANGE_TRANSACTION_STATE,
                        state: authStateToSet,
                        transactionId: authorizationTransaction.id,
                    } as Partial<ActionType>;

                    updateResponse = paymentUtils.getEmptyResponse();
                    updateResponse.actions.push(setTransaction);
                    updateResponse.actions.push(setState);
                    if (isSaleFlow && !isScaRetryFailure && !isRiskDeclined && !hasChargeForInteractionId(paymentObj, cybsTransactionId)) {
                        let chargeState = mapBillApplicationToCtState(billApplication, isPendingMethod);
                        if (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW === cybsStatus) {
                            chargeState = Constants.CT_TRANSACTION_STATE_PENDING;
                        }
                        const chargeAmount = authorizationTransaction.amount || updateTransactions.amount || paymentObj.amountPlanned;

                        updateResponse.actions.push({
                            action: Constants.ADD_TRANSACTION,
                            transaction: paymentUtils.createTransactionObject(undefined, chargeAmount, Constants.CT_TRANSACTION_TYPE_CHARGE, chargeState, cybsTransactionId, paymentUtils.getDate(Date.now(), true) as string),
                        } as Partial<ActionType>);
                    } else if (isSaleFlow && !isScaRetryFailure && !isRiskDeclined) {
                        const existingCharge = paymentObj.transactions?.find((transaction) => transaction.type === Constants.CT_TRANSACTION_TYPE_CHARGE && transaction.interactionId === cybsTransactionId);

                        if (existingCharge?.id) {
                            updateResponse.actions.push({
                                action: Constants.CHANGE_TRANSACTION_STATE,
                                state: Constants.CT_TRANSACTION_STATE_SUCCESS,
                                transactionId: existingCharge.id,
                            } as Partial<ActionType>);
                        }
                    }
                    const captureContextClientRefCode = paymentObj?.custom?.fields?.isv_captureContextClientReferenceCode || '';

                    updateResponse = addUcCompletionCustomFields(
                        updateResponse,
                        completionToken,
                        cybsStatus,
                        cybsSubmitTimeUtc,

                        clientReferenceCode,
                        approvalCode,
                        processorTransactionId,
                        captureContextClientRefCode,
                    );
                    if (isRiskDeclined) {
                        const riskDeclinedResponse = {
                            httpCode: Constants.HTTP_SUCCESS_STATUS_CODE,
                            status: cybsStatus,
                            transactionId: cybsTransactionId,
                        };
                        updateResponse = await paymentHandler.handlePayerAuthReversal(paymentObj, riskDeclinedResponse, updateResponse);
                    }
                    updateResponse = await enrichAndSaveUcTokenData(paymentObj, updatePaymentId, paymentMethod, updateResponse, decodedToken, completionToken, cybsTransactionId, cybsStatus, tssResponse);
                }
            }
    }

    return updateResponse;
};

/**
 * Creates a custom type action for a transaction.
 *
 * This function constructs a response object that specifies a custom type action
 * for a given transaction ID and pending amount. It sets the action type,
 * available capture amount, and transaction ID.
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
            for (const field of customFields) {
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

/**
 * Process My Accounts UC Token Save - Unified with Checkout Flow
 * Extracts token information directly from UC completion token JWT
 * and saves to customer.isv_tokens using the same logic as checkout auto-processing.
 * NO AddTokenService call needed. NO TOKEN_CREATE payment request.
 */
const processMyAccountsUcTokenSave = async (customerObj: any, transientToken: string, selectedAddressId: string | undefined): Promise<ActionResponseType> => {
    let updateResponse: ActionResponseType = paymentUtils.getEmptyResponse();

    try {
        const customerId = customerObj?.id || '';
        const decodedToken = decodeJwtPayload(transientToken);

        if (!decodedToken) {
            paymentUtils.logData(__filename, 'processMyAccountsUcTokenSave', Constants.LOG_ERROR, 'CustomerId : ' + customerId, '[MyAccounts UC TokenSave] FAILED - Could not decode transientToken JWT');
            updateResponse.errors.push({ code: 'JWT_DECODE_ERROR', message: 'Unable to decode transient token JWT' });
        } else {
            const completionToken = decodedToken?.details || decodedToken?.content?.details || decodedToken?.data?.details || null;
            if (!completionToken) {
                paymentUtils.logData(__filename, 'processMyAccountsUcTokenSave', Constants.LOG_ERROR, 'CustomerId : ' + customerId, '[MyAccounts UC TokenSave] FAILED - UC completion token missing details. No tokenInformation available.');
                updateResponse.errors.push({ code: 'NO_UC_DETAILS', message: 'UC completion response missing required details field' });
            } else {
                const cybsTransactionId = getCybersourceTransactionIdFromJwt(decodedToken, completionToken);
                const cybsStatus = completionToken?.status || decodedToken?.status || '';
                const resolvedPaymentMethod = Constants.CREDIT_CARD;
                const fakePayment = createFakePaymentForMyAccounts(customerObj, selectedAddressId);
                let tssResponse: any = null;
                if (cybsTransactionId) {
                    try {
                        tssResponse = await getTransactionData.getTransactionData(cybsTransactionId, null, null);
                    } catch (tssErr) {
                        paymentUtils.logData(__filename, 'processMyAccountsUcTokenSave', Constants.LOG_WARN, 'CustomerId : ' + customerId, '[MyAccounts UC TokenSave] Failed to fetch CyberSource transaction: ' + (tssErr || 'unknown error'));
                    }
                }
                updateResponse = await enrichAndSaveUcTokenData(
                    fakePayment,
                    customerId,
                    resolvedPaymentMethod,
                    updateResponse,
                    decodedToken,
                    completionToken,
                    cybsTransactionId,
                    cybsStatus,
                    tssResponse,
                    true,
                );
            }
        }
    } catch (error: any) {
        paymentUtils.logData(__filename, 'processMyAccountsUcTokenSave', Constants.LOG_ERROR, 'CustomerId : ' + (customerObj?.id || ''), '[MyAccounts UC TokenSave] Exception: ' + (error?.message || String(error)));
        updateResponse.errors.push({ code: 'EXCEPTION', message: error?.message || 'Unknown error during token save' });
    }
    return updateResponse;
};

/**
 * Create minimal Payment-like object for My Accounts UC token save.
 * enrichAndSaveUcTokenData expects a Payment object.
 * For My Accounts, we create a stub with required fields including customer address.
 * Maps Commercetools address to CyberSource billTo format.
 */
const createFakePaymentForMyAccounts = (customerObj: any, selectedAddressId?: string): any => {
    const currentTime = new Date().toISOString();
    let billingAddress: any = null;
    if (selectedAddressId && customerObj?.addresses) {
        billingAddress = customerObj.addresses.find((addr: any) => addr?.id === selectedAddressId);
    }
    if (!billingAddress && customerObj?.addresses?.length > 0) {
        billingAddress = customerObj.addresses[0];
    }
    const orderInformation: any = {
        amountDetails: {
            totalAmount: '0.00',
            currency: customerObj?.custom?.fields?.isv_currencyCode || 'USD',
            taxAmount: '0.00',
        },
    };
    if (billingAddress) {
        orderInformation.billTo = {
            firstName: billingAddress.firstName || '',
            lastName: billingAddress.lastName || '',
            address1: billingAddress.streetName || '',
            address2: billingAddress.additionalStreetInfo || '',
            locality: billingAddress.city || '',
            administrativeArea: billingAddress.region || '',
            postalCode: billingAddress.postalCode || '',
            country: billingAddress.country || '',
            phoneNumber: billingAddress.phone || '',
            email: billingAddress.email || '',
        };
    }
    const fakePayment: any = {
        id: 'my-accounts-token-save-' + Date.now(),
        version: 0,
        createdAt: currentTime,
        lastModifiedAt: currentTime,
        customer: {
            typeId: 'customer',
            id: customerObj?.id || '',
        },
        custom: {
            type: { typeId: 'type', id: 'payment' },
            fields: {
                ...(customerObj?.custom?.fields || {}),
                isv_selectedAddressId: selectedAddressId || '',
                isv_addressId: Constants.UC_ADDRESS,
                isv_taxAmount: '0.00',
            },
        },
        amountPlanned: {
            type: 'centPrecision',
            currencyCode: customerObj?.custom?.fields?.isv_currencyCode || 'USD',
            centAmount: 0,
        },
        paymentMethodInfo: {
            method: Constants.CREDIT_CARD,
        },
        paymentStatus: 'PENDING' as any,
        transactions: [],
        interfaceInteractions: [],
        orderInformation: orderInformation,
    };

    return fakePayment;
};

export default {
    getAuthResponse,
    processTransaction,
    createCompletionTransactions,
    setTransactionCustomType,
    updateCustomField,
    processMyAccountsUcTokenSave,
    createFakePaymentForMyAccounts,
    enrichAndSaveUcTokenData,
    mergeCustomerTokens,
    classifyUcCompletionState,
    getUcCompletionError,
    hasValidUcTokenIds,
    selectInitialUcTokenInformation,
    classifyProcessTransactionBranch,
    extractInitialUcCardDetails,
    applyUcCardDetails,
    buildUcTokenSaveDecisionResponse,
    completeUcTokenInformation,
    buildUcTokenAddress,
    containsPersistedUcToken
};
