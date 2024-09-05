import { Ptsv2paymentsidrefundsPaymentInformation, Ptsv2paymentsPaymentInformation, Ptsv2paymentsPaymentInformationBank, Ptsv2paymentsPaymentInformationBankAccount, Ptsv2paymentsPaymentInformationCard, Ptsv2paymentsPaymentInformationCustomer, Ptsv2paymentsPaymentInformationFluidData, Riskv1authenticationsetupsPaymentInformation } from 'cybersource-rest-client';

import { Constants } from '../constants/constants';
import { CustomMessages } from '../constants/customMessages';
import { FunctionConstant } from '../constants/functionConstant';
import { CustomTokenType, PaymentCustomFieldsType, PaymentType } from '../types/Types';
import paymentUtils from '../utils/PaymentUtils';
import paymentValidator from '../utils/PaymentValidator';

export class PaymentInformationModel {

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
                        };
                    } else {
                        if (cardTokens?.customerTokenId) {
                            paymentInformation.customer = this.setPaymentInformationCustomerDetails(cardTokens.customerTokenId);
                        }
                        paymentInformation.card = this.setPaymentInformationCardDetails();
                    }
                    break;
                default:
                    paymentUtils.logData(__filename, FunctionConstant.FUNC_MAP_PAYMENT_INFORMATION, Constants.LOG_INFO, '', CustomMessages.ERROR_MSG_EMPTY_PAYMENT_DATA);
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

    private setPaymentInformationCustomerDetails(id: string | null | undefined) {
        const customer = {} as Ptsv2paymentsPaymentInformationCustomer;
        paymentValidator.setObjectValue(customer, 'id', id, '', Constants.STR_STRING, false);
        return customer;
    }

    private setPaymentInformationCardDetails(securityCode?: number) {
        const card = {} as Ptsv2paymentsPaymentInformationCard
        paymentValidator.setObjectValue(card, 'securityCode', securityCode, '', Constants.STR_NUMBER, false);
        card.typeSelectionIndicator = 1;
        return card;
    }

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

    private setFluidData(token: string, descriptor?: string, encoding?: string) {
        const fluidData = {} as Ptsv2paymentsPaymentInformationFluidData;
        paymentValidator.setObjectValue(fluidData, 'value', token, '', Constants.STR_STRING, false);
        paymentValidator.setObjectValue(fluidData, 'descriptor', descriptor, '', Constants.STR_STRING, false);
        paymentValidator.setObjectValue(fluidData, 'encoding', encoding, '', Constants.STR_STRING, false);
        return fluidData;
    }
}