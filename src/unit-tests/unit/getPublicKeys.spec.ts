import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import getFlexKeys from '../../service/payment/FlexKeys';
import getPublicKey from '../../service/payment/GetPublicKeys';
import { payment } from '../const/CreditCard/PaymentAuthorizationServiceConstCC';
import { invalidCaptureContext, paymentObj } from '../const/getPublicKeysConst';

test.serial('get public key', async (t: any) => {
  let microFormKeys: any = await getFlexKeys.keys(paymentObj);
  let result = await getPublicKey.getPublicKeys(microFormKeys.isv_tokenCaptureContextSignature, paymentObj);
  t.is(result, true);
});

test.serial('get public key with expired captureContext', async (t: any) => {
  let result = await getPublicKey.getPublicKeys(payment.custom.fields.isv_tokenCaptureContextSignature, paymentObj);
  t.is(result, false);
});

test.serial('get public key with invalid captureContext', async (t: any) => {
  let result = await getPublicKey.getPublicKeys(invalidCaptureContext, paymentObj);
  t.is(result, false);
});

test.serial('get public key with empty captureContext', async (t: any) => {
  let result = await getPublicKey.getPublicKeys('', paymentObj);
  t.is(result, false);
});
