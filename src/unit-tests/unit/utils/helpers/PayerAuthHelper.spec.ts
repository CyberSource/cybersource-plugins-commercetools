import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import payerAuthHelper from '../../../../utils/helpers/PayerAuthHelper';
import PaymentAuthorizationReversalConstGP from '../../../const/GooglePay/PaymentAuthorizationReversalConstGP';
import PaymentAuthorizationServiceConstGP from '../../../const/GooglePay/PaymentAuthorizationServiceConstGP';
import PayerAuthHelperConst from '../../../const/PayerAuthHelperConst'
import PaymentHandlerConst from '../../../const/PaymentHandlerConst';
import PaymentServiceConst from '../../../const/PaymentServiceConst';

test.serial('Test tokenized card for payer authentication ', async (t) => {
    if (PaymentServiceConst.payerEnrollActionsUpdatePaymentObj?.custom) PaymentServiceConst.payerEnrollActionsUpdatePaymentObj.custom.fields['isv_tokenAlias'] = '4111 card'
    const result = await payerAuthHelper.getEnrollResponseForPayerAuthentication(PaymentServiceConst.payerEnrollActionsUpdatePaymentObj, PayerAuthHelperConst.tokenizeCardForPayerAuthenticationTokenCreateResponse, PaymentServiceConst.payerEnrollActionsUpdatePaymentObj?.custom?.fields || {}, 'de8c98ef-dd88-4c3e-bb79-209e50d27f1e', PaymentAuthorizationReversalConstGP.cart, PaymentAuthorizationServiceConstGP.cardTokens, '');
    t.is(result.actions[0].action, "setCustomField");
    t.is(result.actions[0].name, "isv_payerEnrollTransactionId");
    t.is(result.actions[1].name, "isv_payerEnrollHttpCode");
    t.is(result.actions[2].name, "isv_payerEnrollStatus");
})

test.serial('Get Payer auth validate response', async (t: any) => {
    let result = await payerAuthHelper.getPayerAuthValidateResponse(PaymentHandlerConst.getPayerAuthValidateResponseUpdatePaymentObj);
    if (result?.actions?.length > 0) {
        t.is(result.actions[0].action, 'setCustomField');
        t.is(result.actions[0].name, 'isv_payerEnrollTransactionId');
        t.is(result.actions[1].name, 'isv_payerEnrollHttpCode');
        t.is(result.actions[2].name, 'isv_payerEnrollStatus');
    } else {
        t.deepEqual(result.actions, []);
        t.deepEqual(result.errors, []);
    }
});

test.serial('Get payer auth set up response ', async (t: any) => {
    let result: any = await payerAuthHelper.getPayerAuthSetUpResponse(PaymentHandlerConst.authorizationHandler3DSUpdatePaymentObject);
    if (result) {
        if (0 === result?.actions[0]?.length) {
            t.deepEqual(result.actions, []);
            t.deepEqual(result.errors, []);
        } else if ('setCustomField' === result?.actions[0]?.action) {
            t.is(result.actions[0].action, 'setCustomField');
            t.is(result.actions[0].name, 'isv_requestJwt');
            t.is(result.actions[1].action, 'setCustomField');
            t.is(result.actions[1].name, 'isv_cardinalReferenceId');
            t.is(result.actions[2].action, 'setCustomField');
            t.is(result.actions[2].name, 'isv_deviceDataCollectionUrl');
        } else {
            t.pass();
        }
    } else {
        t.pass();
    }
});

test.serial('Get payer auth enroll response', async (t: any) => {
    let result = await payerAuthHelper.getPayerAuthEnrollResponse(PaymentHandlerConst.getPayerAuthEnrollResponseUpdatePaymentObj);
    if (result.actions.length <= 0) {
        t.deepEqual(result.actions, []);
        t.is(result.errors[0].code, 'InvalidInput');
        t.is(result.errors[0].message, 'Cannot process the payment due to invalid input');
    } else {
        t.is(result.actions[0].action, 'setCustomField');
        t.is(result.actions[0].name, 'isv_payerEnrollTransactionId');
        t.is(result.actions[1].name, 'isv_payerEnrollHttpCode');
        t.is(result.actions[2].name, 'isv_payerEnrollStatus');
    }
});

test.serial('Process payer authentication for payer auth set up', async (t) =>{
    const result = await payerAuthHelper.processPayerAuthentication(PaymentHandlerConst.authorizationHandler3DSUpdatePaymentObject);
    if (result) {
        if ('setCustomField' === result?.actions[0]?.action) {
        t.is(result.actions[0].action, 'setCustomField');
        t.is(result.actions[0].name, 'isv_payerEnrollTransactionId');
        t.is(result.actions[1].name, 'isv_payerEnrollHttpCode');
        t.is(result.actions[2].name, 'isv_payerEnrollStatus');
        } else if (result.actions.length <= 0) {
            t.deepEqual(result.actions, []);
            t.is(result.errors[0].code, 'InvalidInput');
            t.is(result.errors[0].message, 'Cannot process the payment due to invalid input');
        } else {
            t.pass();
        }
    } else {
        t.pass();
    }
})

test.serial('Process payer authentication for payer auth enroll', async (t) =>{
    const result = await payerAuthHelper.processPayerAuthentication(PaymentHandlerConst.getPayerAuthEnrollResponseUpdatePaymentObj);
    if (result.actions.length <= 0) {
        t.deepEqual(result.actions, []);
        t.is(result.errors[0].code, 'InvalidInput');
        t.is(result.errors[0].message, 'Cannot process the payment due to invalid input');
    } else {
        t.is(result.actions[0].action, 'setCustomField');
        t.is(result.actions[0].name, 'isv_payerEnrollTransactionId');
        t.is(result.actions[1].name, 'isv_payerEnrollHttpCode');
        t.is(result.actions[2].name, 'isv_payerEnrollStatus');
    }
})

test.serial('Process payer authentication for payer auth validate', async (t) =>{
    const result = await payerAuthHelper.processPayerAuthentication(PaymentHandlerConst.getPayerAuthValidateResponseUpdatePaymentObj);
    if (result.actions.length > 0) {
        t.is(result.actions[0].action, 'setCustomField');
        t.is(result.actions[0].name, 'isv_payerEnrollTransactionId');
        t.is(result.actions[1].name, 'isv_payerEnrollHttpCode');
        t.is(result.actions[2].name, 'isv_payerEnrollStatus');
    } else {
        t.deepEqual(result.actions, []);
        t.deepEqual(result.errors, []);
    }
})