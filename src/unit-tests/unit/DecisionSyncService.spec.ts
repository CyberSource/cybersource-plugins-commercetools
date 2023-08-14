import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();
import {Constants} from '../../constants';
import sync from '../../service/payment/DecisionSyncService';

test('Check http code for decision sync', async (t) => {
  const midCredentials = {
    merchantId: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
    merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
    merchantSecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
  };
  const result: any = await sync.conversionDetails(midCredentials);
  let i = 0;
  if (Constants.HTTP_CODE_TWO_HUNDRED == result.httpCode || Constants.VAL_FOUR_HUNDRED_AND_FOUR == result.httpCode) {
    i++;
  }
  t.is(i, 1);
});
