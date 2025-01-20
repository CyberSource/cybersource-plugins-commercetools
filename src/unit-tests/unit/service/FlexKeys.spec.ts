import test from 'ava';
import dotenv from 'dotenv';

import key from '../../../service/payment/FlexKeys';
import FlexKeysConst from '../../const/FlexKeysConst';
dotenv.config();

test('Check for capture context fields', async (t: any) => {
  let result: any = await key.getFlexKeys(FlexKeysConst.paymentObj);
  let i = 0;
  if (result.isv_tokenCaptureContextSignature && result.isv_tokenVerificationContext &&
    result.isv_clientLibrary && result.isv_clientLibraryIntegrity) {
    i++;
  }
  t.is(i, 1);
});

test('Check for any other context', async (t: any) => {
  let result: any = await key.getFlexKeys(FlexKeysConst.paymentObj);
  let i = 0;
  if ('isv_tokenVerificationContext' in result && 'isv_tokenCaptureContextSignature' in result && 'isv_clientLibrary' in result
    && 'isv_clientLibraryIntegrity' in result) {
    i = 0;
  } else {
    i++;
  }
  t.is(i, 0);
});
