import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../constants/constants';
import { FunctionConstant } from '../../../constants/functionConstant';
import { PaymentInformationModel } from '../../../requestBuilder/PaymentInformation';
import PaymentAuthorizationServiceConstAP from '../../const/ApplePay/PaymentAuthorizationServiceConstAP';
import PaymentAuthorizationServiceConstCC from '../../const/CreditCard/PaymentAuthorizationServiceConstCC';
import PaymentAuthorizationServiceConstECDebit from '../../const/ECheck/PaymentAuthorizationServiceConstECDebit';
import PaymentAuthorizationServiceConstGP from '../../const/GooglePay/PaymentAuthorizationServiceConstGP';
import PayerAuthenticationSetupServiceConst from '../../const/PayerAuthenticationSetupServiceConst';

dotenv.config();

const paymentInformationInstance = new PaymentInformationModel();

test.serial('Map payment information for credit card authorization', async (t) => {
    const result = paymentInformationInstance.mapPaymentInformation(FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, PaymentAuthorizationServiceConstCC.payment, PaymentAuthorizationServiceConstCC.cardTokens, PaymentAuthorizationServiceConstCC.cardTokens.customerTokenId);
    t.is(result.customer.id, PaymentAuthorizationServiceConstCC.cardTokens.customerTokenId);
    t.is(result.card.typeSelectionIndicator, 1);
})

test.serial('Map payment information for google pay authorization', async (t) => {
    const result = paymentInformationInstance.mapPaymentInformation(FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, PaymentAuthorizationServiceConstGP.payment, PaymentAuthorizationServiceConstECDebit.cardTokens, PaymentAuthorizationServiceConstECDebit.cardTokens.customerTokenId);
    t.is(result.fluidData.value, PaymentAuthorizationServiceConstGP.payment.custom.fields.isv_token);
})

test.serial('Map payment information for eCheck authorization', async (t) => {
    const result = paymentInformationInstance.mapPaymentInformation(FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, PaymentAuthorizationServiceConstECDebit.payment, PaymentAuthorizationServiceConstECDebit.cardTokens, PaymentAuthorizationServiceConstECDebit.cardTokens.customerTokenId);
     t.is(result.bank.account.type, PaymentAuthorizationServiceConstECDebit.payment.custom.fields.isv_accountType);
     t.is(result.bank.account.number, PaymentAuthorizationServiceConstECDebit.payment.custom.fields.isv_accountNumber);
     t.is(result.bank.routingNumber, PaymentAuthorizationServiceConstECDebit.payment.custom.fields.isv_routingNumber);
})

test.serial('Map payment information for add token', async (t) => {
    const result = paymentInformationInstance.mapPaymentInformation(FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE, PaymentAuthorizationServiceConstCC.payment, PaymentAuthorizationServiceConstCC.cardTokens, PaymentAuthorizationServiceConstCC.cardTokens.customerTokenId);
     t.is(result.customer.id, PaymentAuthorizationServiceConstCC.cardTokens.customerTokenId);
     t.is(result.card.typeSelectionIndicator, 1);
})

test.serial('Map payment information for payer auth set up', async (t) => {
    const result = paymentInformationInstance.mapPaymentInformation(FunctionConstant.FUNC_GET_PAYER_AUTH_SETUP_RESPONSE, PayerAuthenticationSetupServiceConst.payments, PaymentAuthorizationServiceConstCC.cardTokens, PaymentAuthorizationServiceConstCC.cardTokens.customerTokenId);
    if(result?.customer){
    t.is(result.customer.id, PaymentAuthorizationServiceConstCC.cardTokens.customerTokenId);
    }
    else{
        t.pass();
    }
})

test.serial('Map payment information for credit card authorization with saved card', async (t) => {
    const result = paymentInformationInstance.mapPaymentInformation(FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, PaymentAuthorizationServiceConstCC.payments, PaymentAuthorizationServiceConstCC.cardTokens, PaymentAuthorizationServiceConstCC.cardTokens.customerTokenId);
    t.is(result.customer.id, PaymentAuthorizationServiceConstCC.cardTokens.customerTokenId);
    t.is(result.paymentInstrument.id, PaymentAuthorizationServiceConstCC.cardTokens.paymentInstrumentId);
})

test.serial('Map payment information for apple pay authorization', async (t) => {
    const result = paymentInformationInstance.mapPaymentInformation(FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, PaymentAuthorizationServiceConstAP.payment, PaymentAuthorizationServiceConstCC.cardTokens, PaymentAuthorizationServiceConstCC.cardTokens.customerTokenId);
    t.is(result.fluidData.value, PaymentAuthorizationServiceConstAP.payment.custom.fields.isv_token);
    t.is(result.fluidData.descriptor, Constants.PAYMENT_GATEWAY_APPLE_PAY_DESCRIPTOR);
    t.is(result.fluidData.encoding, Constants.BASE_SIXTY_FOUR_ENCODING);
})

test.serial('Map payment information with empty function name', async (t) => {
    const result = paymentInformationInstance.mapPaymentInformation('', PaymentAuthorizationServiceConstCC.payment, PaymentAuthorizationServiceConstCC.cardTokens, PaymentAuthorizationServiceConstCC.cardTokens.customerTokenId);
    t.falsy(result);
})