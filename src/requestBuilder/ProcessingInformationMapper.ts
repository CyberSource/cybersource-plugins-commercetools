import { Ptsv2creditsProcessingInformationBankTransferOptions, Ptsv2paymentsidrefundsProcessingInformation, Ptsv2paymentsidreversalsProcessingInformation, Ptsv2paymentsProcessingInformation, Ptsv2paymentsProcessingInformationAuthorizationOptions, Ptsv2paymentsProcessingInformationAuthorizationOptionsInitiator } from 'cybersource-rest-client';

import { Constants } from '../constants/constants';
import { FunctionConstant } from '../constants/functionConstant';
import { CustomTokenType, PaymentCustomFieldsType, PaymentType } from '../types/Types';
import paymentUtils from '../utils/PaymentUtils';
import paymentValidator from '../utils/PaymentValidator';

export class ProcessingInformation {
    private isSaveToken: boolean | null;
    private functionName: string;
    private orderNo: string;
    private service: string;
    private resourceObj: PaymentType | null;
    private cardTokens: CustomTokenType | null;
    private processingInformation: any;

    /**
    * Constructs a new instance of ProcessingInformation.
    * Initializes the processing information based on the provided function name.
    * 
    * @param functionName - Name of the function being processed (e.g., authorization, refund).
    * @param resourceObj - The payment resource object, containing payment-related information.
    * @param orderNo - The order number associated with the transaction.
    * @param service - The service type associated with the processing (e.g., enrollment check, validation).
    * @param cardTokens - Card token information, if available.
    * @param isSaveToken - A flag indicating if a token should be saved.
    */
    constructor(functionName: string, resourceObj: PaymentType | null, orderNo: string, service: string, cardTokens: CustomTokenType | null, isSaveToken: boolean | null) {
        this.functionName = functionName;
        this.resourceObj = resourceObj;
        this.orderNo = orderNo;
        this.service = service;
        this.cardTokens = cardTokens;
        this.isSaveToken = isSaveToken;
        this.processingInformation = this.initializeProcessingInformation();
    }

    /**
    * Initializes the processing information based on the function name.
    * 
    * @returns An instance of processing information object (specific to the function).
    */
    private initializeProcessingInformation() {
        let processingInformationInstance = {};
        switch (this.functionName) {
            case FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE:
            case FunctionConstant.FUNC_GET_CAPTURE_RESPONSE:
                processingInformationInstance = {} as Ptsv2paymentsidreversalsProcessingInformation;
                break;
            case FunctionConstant.FUNC_GET_REFUND_DATA:
                processingInformationInstance = {} as Ptsv2paymentsidrefundsProcessingInformation;
                break;
            case FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE:
            case FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE:
                processingInformationInstance = {} as Ptsv2paymentsProcessingInformation;
                break;
        }
        return processingInformationInstance;
    }

    /**
     * Configures and returns the processing information object.
     * 
     * @returns The configured processing information object.
     */
    public getProcessingInformation() {
        const { resourceObj, orderNo } = this;
        const customFields = resourceObj?.custom?.fields;
        const actionList: string[] = [];
        if ([FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE].includes(this.functionName)) {
            this.configureAuthorizationProcessing(actionList, customFields);
        }
        this.configureReconciliationId(orderNo);
        this.configurePaymentSolution(resourceObj, customFields);
        this.configureBankTransferOptions(resourceObj, customFields);

        return this.processingInformation;
    }

    /**
   * Configures authorization processing details, including MOTO indicators and capture actions.
   * It also sets actionList and invokes additional authorization options if necessary.
   * 
   * @param actionList - List of actions to be configured for the transaction.
   * @param customFields - Custom fields related to the payment.
   */
    private configureAuthorizationProcessing(actionList: string[], customFields: any) {
        if (customFields?.isv_enabledMoto) {
            this.processingInformation.commerceIndicator = 'MOTO';
        }
        if (customFields?.isv_saleEnabled) {
            this.processingInformation.capture = true;
        }
        paymentValidator.setObjectValue(this.processingInformation, 'walletType', customFields, 'isv_walletType', Constants.STR_STRING, false);
        if (!paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_DECISION_MANAGER)) {
            actionList.push(Constants.PAYMENT_GATEWAY_DECISION_SKIP);
        }
        if (this.service === Constants.STRING_ENROLL_CHECK) {
            actionList.push(Constants.PAYMENT_GATEWAY_CONSUMER_AUTHENTICATION);
        }
        if (this.service === Constants.VALIDATION) {
            actionList.push(Constants.PAYMENT_GATEWAY_VALIDATE_CONSUMER_AUTHENTICATION);
        }
        if ((!customFields?.isv_savedToken && customFields?.isv_tokenAlias && this.isSaveToken) || FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE === this.functionName) {
            actionList.push(Constants.PAYMENT_GATEWAY_TOKEN_CREATE);
            this.processingInformation.actionList = actionList;
            this.addAuthorizationOptions();
        }
        this.processingInformation.actionList = actionList;
    }

    /**
     * Adds authorization options for token creation or customer token processing.
     * These options include settings for whether credentials are stored on file.
     */
    private addAuthorizationOptions() {
        const initiator: Ptsv2paymentsProcessingInformationAuthorizationOptionsInitiator = {
            credentialStoredOnFile: true
        };
        const authorizationOptions: Ptsv2paymentsProcessingInformationAuthorizationOptions = {
            initiator: initiator
        };
        this.processingInformation.authorizationOptions = authorizationOptions;
        this.processingInformation.actionTokenTypes = this.cardTokens && this.cardTokens.customerTokenId ?
            Constants.PAYMENT_GATEWAY_TOKEN_ACTION_TYPES_CUSTOMER_EXISTS :
            Constants.PAYMENT_GATEWAY_TOKEN_ACTION_TYPES;
    }

    /**
    * Configures the reconciliation ID if reconciliation is enabled in the environment variables.
    * 
    * @param orderNo - The order number used as the reconciliation ID.
    */
    private configureReconciliationId(orderNo: string) {
        if (paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_ORDER_RECONCILIATION) && orderNo) {
            this.processingInformation.reconciliationId = orderNo;
        }
    }

    /**
     * Configures the payment solution (e.g., Google Pay, Apple Pay) based on the payment method in the resource object.
     * 
     * @param resourceObj - The payment resource object containing payment method info.
     * @param customFields - Custom fields that may influence the payment solution configuration.
     */
    private configurePaymentSolution(resourceObj: PaymentType | null, customFields?: Partial<PaymentCustomFieldsType>) {
        switch (resourceObj?.paymentMethodInfo?.method) {
            case Constants.CLICK_TO_PAY: {
                if (customFields) {
                    if (customFields?.isv_transientToken) {
                        this.processingInformation.paymentSolution = Constants.PAYMENT_GATEWAY_CLICK_TO_PAY_UC_PAYMENT_SOLUTION;
                        this.processingInformation.visaCheckoutId = customFields.isv_transientToken;
                    } else {
                        this.processingInformation.paymentSolution = Constants.PAYMENT_GATEWAY_CLICK_TO_PAY_PAYMENT_SOLUTION;
                        this.processingInformation.visaCheckoutId = customFields.isv_token;
                    }
                }
                break;
            }
            case Constants.GOOGLE_PAY:
                this.processingInformation.paymentSolution = Constants.PAYMENT_GATEWAY_GOOGLE_PAY_PAYMENT_SOLUTION;
                break;
            case Constants.APPLE_PAY:
                this.processingInformation.paymentSolution = Constants.PAYMENT_GATEWAY_APPLE_PAY_PAYMENT_SOLUTION;
                break;
        }
    }

    /**
     * Configures bank transfer options if the payment method is an eCheck.
     * 
     * @param resourceObj - The payment resource object containing payment method info.
     * @param customFields - Custom fields that may influence the bank transfer configuration.
     */
    private configureBankTransferOptions(resourceObj: PaymentType | null, customFields?: Partial<PaymentCustomFieldsType>) {
        if (resourceObj?.paymentMethodInfo?.method === Constants.ECHECK) {
            const banktransferOptions: Ptsv2creditsProcessingInformationBankTransferOptions = {
                secCode: customFields?.isv_enabledMoto ? 'TEL' : 'WEB',
                fraudScreeningLevel: 1
            };
            this.processingInformation.bankTransferOptions = banktransferOptions;
        }
    }
}
