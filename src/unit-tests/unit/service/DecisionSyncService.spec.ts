import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../../constants/constants';
import sync from '../../../service/payment/DecisionSyncService';
import DeleteWebhookSubscriptionConst from '../../const/DeleteWebhookSubscriptionConst';

test('Check http code for decision sync', async (t: any) => {
  let midCredentials = {
    merchantId: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
    merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
    merchantSecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
  };
  let result: any = await sync.getConversionDetails(midCredentials);
  let i = 0;
  if (Constants.HTTP_OK_STATUS_CODE == result.httpCode || Constants.HTTP_NOT_FOUND_STATUS_CODE == result.httpCode) {
    i++;
  }
  t.is(i, 1);
});

test('Check http code for decision sync with invalid mid credentials', async (t: any) => {
  let result: any = await sync.getConversionDetails(DeleteWebhookSubscriptionConst.invalidMidCredentials);
  t.is(result.httpCode, 401);
});
