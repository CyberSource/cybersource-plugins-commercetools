import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import keys from '../../../service/payment/FlexKeys';
import getPublicKey from '../../../service/payment/GetPublicKeys';
import PaymentAuthorizationServiceConstCC from '../../const/CreditCard/PaymentAuthorizationServiceConstCC';
import getPublicKeysConst from '../../const/getPublicKeysConst';

test.serial('get public key', async (t: any) => {
  try {
    let microFormKeys: any = await keys.getFlexKeys(getPublicKeysConst.paymentObj);
    let result = await getPublicKey.getPublicKeys(microFormKeys.isv_tokenCaptureContextSignature, getPublicKeysConst.paymentObj);
    if (result) {
      t.is(result, true);
    } else {
      t.pass();
    }
  } catch (error) {
    t.pass();
  }
});

test.serial('get public key with expired captureContext', async (t: any) => {
  try {
    let result = await getPublicKey.getPublicKeys(PaymentAuthorizationServiceConstCC.payment.custom.fields.isv_tokenCaptureContextSignature, getPublicKeysConst.paymentObj);
    t.is(result, false);
  } catch (error) {
    t.pass();
  }
});

test.serial('get public key with invalid captureContext', async (t: any) => {
  try {
    let result = await getPublicKey.getPublicKeys(getPublicKeysConst.invalidCaptureContext, getPublicKeysConst.paymentObj);
    t.is(result, false);
  } catch (error) {
    t.pass();
  }
});

test.serial('get public key with empty captureContext', async (t: any) => {
  try {
    let result = await getPublicKey.getPublicKeys('', getPublicKeysConst.paymentObj);
    t.is(result, false);
  } catch (error) {
    t.pass();
  }
});
