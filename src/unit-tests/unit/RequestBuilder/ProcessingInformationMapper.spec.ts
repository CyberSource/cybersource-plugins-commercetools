import test from 'ava';
import dotenv from 'dotenv';

import { FunctionConstant } from '../../../constants/functionConstant';
import { ProcessingInformation } from '../../../requestBuilder/ProcessingInformationMapper';
import PaymentAuthorizationServiceConstAP from '../../const/ApplePay/PaymentAuthorizationServiceConstAP';
import PaymentAuthorizationServiceVsConst from '../../const/ClickToPay/PaymentAuthorizationServiceVsConst';
import PaymentAuthorizationReversalConstCC from '../../const/CreditCard/PaymentAuthorizationReversalConstCC';
import PaymentAuthorizationServiceConstGP from '../../const/GooglePay/PaymentAuthorizationServiceConstGP';

dotenv.config();

const processingInformation = new ProcessingInformation(FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, PaymentAuthorizationServiceConstGP.payment, PaymentAuthorizationServiceConstGP.orderNo, PaymentAuthorizationServiceConstGP.service, PaymentAuthorizationServiceConstGP.cardTokens, false);
const processingInformationForClickToPay = new ProcessingInformation(FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, PaymentAuthorizationServiceVsConst.payment, PaymentAuthorizationServiceConstGP.orderNo, PaymentAuthorizationServiceConstGP.service, PaymentAuthorizationServiceConstGP.cardTokens, false);
const processingInformationForUCClickToPay = new ProcessingInformation(FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, PaymentAuthorizationServiceVsConst.payment, PaymentAuthorizationServiceConstGP.orderNo, PaymentAuthorizationServiceConstGP.service, PaymentAuthorizationServiceConstGP.cardTokens, false);
const processingInformationForGooglePay = new ProcessingInformation(FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, PaymentAuthorizationServiceConstGP.payment, PaymentAuthorizationServiceConstGP.orderNo, PaymentAuthorizationServiceConstGP.service, PaymentAuthorizationServiceConstGP.cardTokens, false);
const processingInformationForApplePay = new ProcessingInformation(FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, PaymentAuthorizationServiceConstAP.payment, PaymentAuthorizationServiceConstGP.orderNo, PaymentAuthorizationServiceConstGP.service, PaymentAuthorizationServiceConstGP.cardTokens, false);
const processingInformationForAuthReversal = new ProcessingInformation(FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE, PaymentAuthorizationReversalConstCC.payment, PaymentAuthorizationServiceConstGP.orderNo, PaymentAuthorizationServiceConstGP.service, PaymentAuthorizationServiceConstGP.cardTokens, false);
const processingInformationForRefund = new ProcessingInformation(FunctionConstant.FUNC_GET_REFUND_DATA, PaymentAuthorizationReversalConstCC.payment, PaymentAuthorizationServiceConstGP.orderNo, PaymentAuthorizationServiceConstGP.service, PaymentAuthorizationServiceConstGP.cardTokens, false);

test.serial('Get processing information for credit card', async (t) => {
    const result = processingInformation.getProcessingInformation();
    t.deepEqual(result.actionList, [])
})

test.serial('Get processing information for click to pay', async (t) => {
    const result = processingInformationForClickToPay.getProcessingInformation();
    t.deepEqual(result.actionList, [])
    t.is(result.paymentSolution, 'visaCheckout');
    t.is(result.visaCheckoutId, PaymentAuthorizationServiceVsConst.payment.custom.fields.isv_token);
})

test.serial('Get processing information for unified checkout click to pay', async (t) => {
    const result = processingInformationForUCClickToPay.getProcessingInformation();
    t.deepEqual(result.actionList, [])
    t.is(result.paymentSolution, 'visaCheckout');
})

test.serial('Get processing information for google pay', async (t) => {
    const result = processingInformationForGooglePay.getProcessingInformation();
    t.deepEqual(result.actionList, []);
    t.is(result.paymentSolution, '012');
})

test.serial('Get processing information for apple pay', async (t) => {
    const result = processingInformationForApplePay.getProcessingInformation();
    t.deepEqual(result.actionList, []);
    t.is(result.paymentSolution, '001');
})

test.serial('Get processing information for auth reversal', async (t) => {
    const result = processingInformationForAuthReversal.getProcessingInformation();
    t.pass();
    t.deepEqual(result, {});
})

test.serial('Get processing information for refund', async (t) => {
    const result = processingInformationForRefund.getProcessingInformation();
    t.pass();
    t.deepEqual(result, {});
})