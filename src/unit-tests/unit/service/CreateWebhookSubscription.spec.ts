import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import createWebhookSubscription from '../../../service/payment/CreateWebhookSubscription';
import multiMid from '../../../utils/config/MultiMid';
import CaptureContextServiceConst from '../../const/CaptureContextServiceConst';
import DeleteWebhookSubscriptionConst from '../../const/DeleteWebhookSubscriptionConst';

test.serial('Test create webhook subscription response', async (t) => {
  let mid = CaptureContextServiceConst.merchantId;
  if (process.env.PAYMENT_GATEWAY_MERCHANT_ID === mid) {
    mid = '';
  }
  let midCredentials = await multiMid.getMidCredentials(mid);
  let response = await createWebhookSubscription.getCreateWebhookSubscriptionResponse(midCredentials)
  if (201 === response.httpCode) {
    t.is(response.httpCode, 201);
  } else {
    t.not(response.httpCode, 201);
  } 
});

test.serial('Test create webhook subscription response with invalid mid credentials', async (t) => {
  let response = (await createWebhookSubscription.getCreateWebhookSubscriptionResponse(DeleteWebhookSubscriptionConst.invalidMidCredentials)) as any;
  t.not(response.httpCode, 201);
});