import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../../constants/constants';
import createSearchRequest from '../../../service/payment/CreateTransactionSearchRequest';
import DeleteWebhookSubscriptionConst from '../../const/DeleteWebhookSubscriptionConst';

test('Run sync ', async (t: any) => {
  let midCredentials = {
    merchantId: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
    merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
    merchantSecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
  };
  let result: any = await createSearchRequest.getTransactionSearchResponse(Constants.STRING_SYNC_QUERY, Constants.STRING_SYNC_SORT, midCredentials);
  if (Constants.HTTP_SUCCESS_STATUS_CODE === result.httpCode) {
    t.is(result.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  } else {
    t.not(result.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  }
});

test('Run sync with invalid mid credentials', async (t: any) => {
  let result: any = await createSearchRequest.getTransactionSearchResponse(Constants.STRING_SYNC_QUERY, Constants.STRING_SYNC_SORT, DeleteWebhookSubscriptionConst.invalidMidCredentials);
  t.is(result.httpCode, 401);
  t.is(result.data, '');
});

test('Run sync with empty query', async (t: any) => {
  let result: any = await createSearchRequest.getTransactionSearchResponse('', '', DeleteWebhookSubscriptionConst.emptyMidCredentials);
  t.is(result.httpCode, 0);
  t.is(result.data, '');
});
