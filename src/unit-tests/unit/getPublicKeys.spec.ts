import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();
import {invalidCaptureContext, paymentObj} from '../const/getPublicKeysConst';
import getPublicKey from '../../service/payment/getPublicKeys';
import getFlexKeys from '../../service/payment/FlexKeys';
import  {payment} from '../const/CreditCard/PaymentAuthorizationServiceConstCC'

test.serial('get public key', async (t) => {
    const microFormKeys:any = await getFlexKeys.keys(paymentObj);
    const result = await getPublicKey.getPublicKeys(microFormKeys.isv_tokenCaptureContextSignature, paymentObj);
    t.is(result, true);
})

test.serial('get public key with expired captureContext', async (t) => {
    const result = await getPublicKey.getPublicKeys(payment.custom.fields.isv_tokenCaptureContextSignature, paymentObj);
    t.is(result, false);
})

test.serial('get public key with invalid captureContext', async (t) => {
    const result = await getPublicKey.getPublicKeys(invalidCaptureContext, paymentObj);
    t.is(result, false);
})