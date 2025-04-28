import test from 'ava';
import dotenv from 'dotenv';

import key from '../../../service/payment/FlexKeys';
import FlexKeysConst from '../../const/FlexKeysConst';

dotenv.config();

test('Check for capture context fields', async (t: any) => {
  let i = 0;
  try {
    let result: any = await key.getFlexKeys(FlexKeysConst.paymentObj as any);
    if (result.isv_tokenCaptureContextSignature && result.isv_tokenVerificationContext && result.isv_clientLibrary && result.isv_clientLibraryIntegrity) {
      i++;
      t.is(i, 1);
    } else {
      t.fail(`Unexpected error: capture context fields' ${result}`);
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

test('Check for any other context', async (t: any) => {
  let i = 0;
  try {
    let result: any = await key.getFlexKeys(FlexKeysConst.paymentObj as any);
    if ('isv_tokenVerificationContext' in result && 'isv_tokenCaptureContextSignature' in result && 'isv_clientLibrary' in result && 'isv_clientLibraryIntegrity' in result) {
      i = 0;
      t.is(i, 0);
    } else {
      t.fail(`Unexpected error: any other context' ${result}`);
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