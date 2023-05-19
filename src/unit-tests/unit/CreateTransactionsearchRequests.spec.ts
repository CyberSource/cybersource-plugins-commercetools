import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();
import createSearchRequest from '../../service/payment/CreateTransactionSearchRequest';
import { Constants } from '../../constants';

test('Run sync ', async (t) => {
  let midCredentials = {
    merchantId: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
    merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
    merchantSecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
  };
  const result: any = await createSearchRequest.getTransactionSearchResponse(Constants.STRING_SYNC_QUERY, Constants.STRING_SYNC_SORT, midCredentials);
  t.pass();
  t.is(result.httpCode, 201);
});
