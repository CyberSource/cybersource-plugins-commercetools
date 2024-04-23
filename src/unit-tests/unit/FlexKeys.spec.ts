import test from 'ava';
import dotenv from 'dotenv';

import key from '../../service/payment/FlexKeys';
import { paymentObj } from '../const/FlexKeysConst';
dotenv.config();

test('Check for capture context', async (t: any) => {
  let result: any = await key.keys(paymentObj);

  let i = 0;
  if ('isv_tokenCaptureContextSignature' in result) {
    i++;
  }
  t.is(i, 1);
});

test('Check for verification context', async (t: any) => {
  let result: any = await key.keys(paymentObj);
  let i = 0;
  if ('isv_tokenVerificationContext' in result) {
    i++;
  }
  t.is(i, 1);
});

test('Check for any other context', async (t: any) => {
  let result: any = await key.keys(paymentObj);
  let i = 0;
  if ('isv_tokenVerificationContext' in result && 'isv_tokenCaptureContextSignature' in result) {
    i = 0;
  } else {
    i++;
  }
  t.is(i, 0);
});
