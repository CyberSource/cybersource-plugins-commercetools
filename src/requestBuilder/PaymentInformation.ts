import { Ptsv2paymentsidrefundsPaymentInformation, Ptsv2paymentsPaymentInformation, Ptsv2paymentsPaymentInformationBank, Ptsv2paymentsPaymentInformationBankAccount, Ptsv2paymentsPaymentInformationCard, Ptsv2paymentsPaymentInformationCustomer, Ptsv2paymentsPaymentInformationFluidData, Riskv1authenticationsetupsPaymentInformation } from 'cybersource-rest-client';

import { Constants } from '../constants/constants';
import { CustomMessages } from '../constants/customMessages';
import { FunctionConstant } from '../constants/functionConstant';
import { CustomTokenType, PaymentCustomFieldsType, PaymentType } from '../types/Types';
import paymentUtils from '../utils/PaymentUtils';
import paymentValidator from '../utils/PaymentValidator';

export class PaymentInformationModel {

    /**
     * Maps payment information based on the function and payment method.
     * @param functionName - The function being processed (e.g. authorization, refund).
     * @param resourceObj - The payment object containing payment details.
     * @param cardTokens - Tokenized card information.
     * @param customerTokenId - Tokenized customer ID.
     * @returns The mapped payment information object based on the function.
     */
    public mapPaymentInformation(functionName: string, resourceObj: PaymentType | null, cardTokens: CustomTokenType | null, customerTokenId: string | null) {
        let paymentInformation: any;
        if ((FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE === functionName || FunctionConstant.FUNC_GET_REFUND_DATA === functionName) && resourceObj?.paymentMethodInfo?.method) {
            paymentInformation = functionName === FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE ? {} as Ptsv2paymentsPaymentInformation
                : {} as Ptsv2paymentsidrefundsPaymentInformation;
            const customFields = resourceObj?.custom?.fields;
            switch (resourceObj.paymentMethodInfo.method) {
                case Constants.ECHECK:
                    paymentInformation.bank = this.setPaymentInformationBankDetails(customFields);
                    paymentInformation.paymentType = { name: Constants.PAYMENT_GATEWAY_E_CHECK_PAYMENT_TYPE };
                    break;
                case Constants.GOOGLE_PAY:
                    paymentInformation.fluidData = this.setFluidData(customFields?.isv_token || '');
                    break;
                case Constants.APPLE_PAY:
                    paymentInformation.fluidData = this.setFluidData(customFields?.isv_token || '', Constants.PAYMENT_GATEWAY_APPLE_PAY_DESCRIPTOR, Constants.BASE_SIXTY_FOUR_ENCODING);
                    break;
                case Constants.CREDIT_CARD:
                case Constants.CC_PAYER_AUTHENTICATION:
                    if (customFields?.isv_savedToken) {
                        paymentInformation.customer = this.setPaymentInformationCustomerDetails(cardTokens?.customerTokenId);
                        paymentInformation.paymentInstrument = { id: cardTokens?.paymentInstrumentId };
                        if (customFields?.isv_securityCode) {
                            paymentInformation.card = this.setPaymentInformationCardDetails(customFields.isv_securityCode);
                        }
                    } else {
                        if (cardTokens?.customerTokenId) {
                            paymentInformation.customer = this.setPaymentInformationCustomerDetails(cardTokens.customerTokenId);
                        }
                        paymentInformation.card = this.setPaymentInformationCardDetails();
                    }
                    break;
                default:
                    paymentUtils.logData(__filename, FunctionConstant.FUNC_MAP_PAYMENT_INFORMATION, Constants.LOG_ERROR, '', CustomMessages.ERROR_MSG_EMPTY_PAYMENT_DATA);
            }
        } else if (FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE === functionName && cardTokens && cardTokens.customerTokenId) {
            paymentInformation = {} as Ptsv2paymentsPaymentInformation;
            paymentInformation.customer = this.setPaymentInformationCustomerDetails(cardTokens.customerTokenId);
            paymentInformation.card = this.setPaymentInformationCardDetails();
        } else if (FunctionConstant.FUNC_GET_PAYER_AUTH_SETUP_DATA === functionName) {
            paymentInformation = {} as Riskv1authenticationsetupsPaymentInformation;
            paymentInformation.customer = this.setPaymentInformationCustomerDetails(customerTokenId);
        }
        return paymentInformation;
    }

    /**
     * Sets payment information customer details.
     * @param id - The customer ID to map into the payment information.
     * @returns The mapped customer object.
     */
    private setPaymentInformationCustomerDetails(id: string | null | undefined) {
        const customer = {} as Ptsv2paymentsPaymentInformationCustomer;
        paymentValidator.setObjectValue(customer, 'id', id, '', Constants.STR_STRING, false);
        return customer;
    }

    /**
     * Sets payment information card details, including security code.
     * @param securityCode - Optional security code for the card.
     * @returns The mapped card object.
     */
    private setPaymentInformationCardDetails(securityCode?: number) {
        const card = {} as Ptsv2paymentsPaymentInformationCard
        paymentValidator.setObjectValue(card, 'securityCode', securityCode, '', Constants.STR_NUMBER, false);
        card.typeSelectionIndicator = 1;
        return card;
    }

    /**
     * Sets payment information bank details.
     * @param fields - Custom fields related to the payment bank account.
     * @returns The mapped bank object.
     */
    private setPaymentInformationBankDetails(fields: Partial<PaymentCustomFieldsType> | undefined) {
        const bankAccount: Ptsv2paymentsPaymentInformationBankAccount = {
            type: fields?.isv_accountType,
            number: fields?.isv_accountNumber
        }
        const bank: Ptsv2paymentsPaymentInformationBank = {
            account: bankAccount,
            routingNumber: fields?.isv_routingNumber
        }
        return bank;
    }

    /**
     * Sets fluid data, often used in tokenized payments like Google Pay or Apple Pay.
     * @param token - The token for the payment method.
     * @param descriptor - Optional descriptor for the payment.
     * @param encoding - Optional encoding type for the payment data.
     * @returns The mapped fluid data object.
     */
    private setFluidData(token: string, descriptor?: string, encoding?: string) {
        const fluidData = {} as Ptsv2paymentsPaymentInformationFluidData;
        paymentValidator.setObjectValue(fluidData, 'value', token, '', Constants.STR_STRING, false);
        paymentValidator.setObjectValue(fluidData, 'descriptor', descriptor, '', Constants.STR_STRING, false);
        paymentValidator.setObjectValue(fluidData, 'encoding', encoding, '', Constants.STR_STRING, false);
        return fluidData;
    }
}