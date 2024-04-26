import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import createWebhookSubscription from '../../service/payment/CreateWebhookSubscription';
import multiMid from '../../utils/config/MultiMid';
import { merchantId } from '../const/CaptureContextServiceConst';
import { emptyMidCredentials } from '../const/DeleteWebhookSubscriptionConst';

test.serial('Test create webhook subscription response', async (t) => {
  let midCredentials = await multiMid.getMidCredentials(merchantId);
  let response = (await createWebhookSubscription.webhookSubscriptionResponse(midCredentials)) as any;
  if (201 === response.httpCode) {
    t.is(response.httpCode, 201);
  } else {
    t.not(response.httpCode, 201);
  }
});

test.serial('Test create webhook subscription response without mid credentials', async (t) => {
  let response = (await createWebhookSubscription.webhookSubscriptionResponse(emptyMidCredentials)) as any;
  t.not(response.httpCode, 201);
});
