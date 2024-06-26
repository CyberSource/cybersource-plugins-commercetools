import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();

import deleteWebhookSubscriptionService from '../../service/payment/DeleteWebhookSubscriptionService';
import multiMid from '../../utils/config/MultiMid';
import { merchantId } from '../const/CaptureContextServiceConst';
import { emptyMidCredentials, subscriptionId } from '../const/DeleteWebhookSubscriptionConst';

test.serial('Test Delete Webhook Subscription Response', async (t) => {
  let midCredentials = await multiMid.getMidCredentials(merchantId);
  let response = await deleteWebhookSubscriptionService.deleteWebhookSubscriptionResponse(midCredentials, subscriptionId);
  if (200 === response.httpCode) {
    t.is(response.httpCode, 200);
  } else {
    t.not(response.httpCode, 200);
  }
});

test.serial('Test Delete Webhook Subscription Response without mid credentials', async (t) => {
  let response = await deleteWebhookSubscriptionService.deleteWebhookSubscriptionResponse(emptyMidCredentials, subscriptionId);
  t.is(response.httpCode, 0);
});

test.serial('Test Delete Webhook Subscription Response without subscription id', async (t) => {
  let response = await deleteWebhookSubscriptionService.deleteWebhookSubscriptionResponse(emptyMidCredentials, '');
  t.is(response.httpCode, 0);
});
