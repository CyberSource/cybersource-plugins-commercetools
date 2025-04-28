import test from 'ava';
import dotenv from 'dotenv';

import keys from '../../../service/payment/FlexKeys';
import getPublicKey from '../../../service/payment/GetPublicKeys';
import PaymentAuthorizationServiceConstCC from '../../const/CreditCard/PaymentAuthorizationServiceConstCC';
import getPublicKeysConst from '../../const/getPublicKeysConst';

dotenv.config();

test.serial('get public key', async (t: any) => {
  try {
    let microFormKeys: any = await keys.getFlexKeys(getPublicKeysConst.paymentObj as any);
    let result = await getPublicKey.getPublicKeys(microFormKeys.isv_tokenCaptureContextSignature as any, getPublicKeysConst.paymentObj as any);
    if (result) {
      t.is(result, true);
    } else {
      t.fail(`Unexpected error: get public key' ${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('get public key with expired captureContext', async (t: any) => {
  try {
    let result = await getPublicKey.getPublicKeys(PaymentAuthorizationServiceConstCC.payment.custom.fields.isv_tokenCaptureContextSignature as any, getPublicKeysConst.paymentObj as any);
    if (typeof result === 'boolean') {
      t.is(result, false);
    } else {
      t.fail(`Unexpected error: get public key with expired captureContext' ${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('get public key with empty captureContext', async (t: any) => {
  try {
    let result = await getPublicKey.getPublicKeys('', getPublicKeysConst.paymentObj as any);
    if (typeof result === 'boolean') {
      t.is(result, false);
    } else {
      t.fail(`Unexpected error: get public key with expired captureContext' ${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});
