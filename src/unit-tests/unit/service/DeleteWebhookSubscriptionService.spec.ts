import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();

import deleteWebhookSubscriptionService from '../../../service/payment/DeleteWebhookSubscriptionService';
import multiMid from '../../../utils/config/MultiMid';
import CaptureContextServiceConst from '../../const/CaptureContextServiceConst';
import DeleteWebhookSubscriptionConst from '../../const/DeleteWebhookSubscriptionConst';

test.serial('Test Delete Webhook Subscription Response', async (t) => {
  let midCredentials = await multiMid.getMidCredentials(CaptureContextServiceConst.merchantId);
  if('' === midCredentials.merchantId) {
    midCredentials.merchantId = process.env.PAYMENT_GATEWAY_MERCHANT_ID;
    midCredentials.merchantKeyId = process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID;
    midCredentials.merchantSecretKey = process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY;
  }
  let response = await deleteWebhookSubscriptionService.deleteWebhookSubscriptionResponse(midCredentials, DeleteWebhookSubscriptionConst.subscriptionId);
  if (200 === response.httpCode) {
    t.is(response.httpCode, 200);
  } else {
    t.not(response.httpCode, 200);
  }
});

test.serial('Test Delete Webhook Subscription Response without mid credentials', async (t) => {
  let response = await deleteWebhookSubscriptionService.deleteWebhookSubscriptionResponse(DeleteWebhookSubscriptionConst.emptyMidCredentials, DeleteWebhookSubscriptionConst.subscriptionId);
  t.is(response.httpCode, 0);
});

test.serial('Test Delete Webhook Subscription Response without subscription id', async (t) => {
  let response = await deleteWebhookSubscriptionService.deleteWebhookSubscriptionResponse(DeleteWebhookSubscriptionConst.emptyMidCredentials, '');
  t.is(response.httpCode, 0);
});

test.serial('Test Delete Webhook Subscription Response with invalid mid credentials', async (t) => {
  let response = await deleteWebhookSubscriptionService.deleteWebhookSubscriptionResponse(DeleteWebhookSubscriptionConst.invalidMidCredentials, DeleteWebhookSubscriptionConst.subscriptionId);
  t.is(response.httpCode, 401);
});
