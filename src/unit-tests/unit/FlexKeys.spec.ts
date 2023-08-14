import test from 'ava';
import dotenv from 'dotenv';
import {Constants} from '../../constants';
import key from '../../service/payment/FlexKeys';
import { paymentObj } from '../const/FlexKeysConst';
dotenv.config();

test('Check for capture context', async (t) => {
  const result: any = await key.keys(paymentObj);

  var i = 0;
  if (Constants.ISV_CAPTURE_CONTEXT_SIGNATURE in result) {
    i++;
  }
  t.is(i, 1);
});

test('Check for verification context', async (t) => {
  const result: any = await key.keys(paymentObj);
  var i = 0;
  if (Constants.ISV_TOKEN_VERIFICATION_CONTEXT in result) {
    i++;
  }
  t.is(i, 1);
});

test('Check for any other context', async (t) => {
  const result: any = await key.keys(paymentObj);
  var i = 0;
  if (Constants.ISV_TOKEN_VERIFICATION_CONTEXT in result && Constants.ISV_CAPTURE_CONTEXT_SIGNATURE in result) {
    i = 0;
  } else {
    i++;
  }
  t.is(i, 0);
});
