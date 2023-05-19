import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();
import sync from '../../service/payment/DecisionSyncService';

test('Check http code for decision sync', async (t) => {
  const midCredentials = {
    merchantId: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
    merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
    merchantSecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
  };
  const result: any = await sync.conversionDetails(midCredentials);
  let i = 0;
  if (result.httpCode == 200 || result.httpCode == 404) {
    i++;
  }
  t.is(i, 1);
});
