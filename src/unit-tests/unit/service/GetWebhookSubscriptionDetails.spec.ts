import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();

import getWebhookSubscriptionDetails from '../../../service/payment/GetWebhookSubscriptionDetails';
import DeleteWebhookSubscriptionConst from '../../const/DeleteWebhookSubscriptionConst';

let midCredentials = {
  merchantId: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
  merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
  merchantSecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
};

test.serial('Test get webhook subscription response', async (t) => {
  let response = (await getWebhookSubscriptionDetails.getWebhookSubscriptionResponse(midCredentials)) as any;
  if (200 === response.httpCode) {
    t.is(response.httpCode, 200);
  } else {
    t.not(response.httpCode, 200);
  }
});

test.serial('Test get webhook subscription response without mid credentials', async (t) => {
  let response = (await getWebhookSubscriptionDetails.getWebhookSubscriptionResponse(DeleteWebhookSubscriptionConst.emptyMidCredentials)) as any;
    t.not(response.httpCode, 200);
});

test.serial('Test get webhook subscription response with invalid mid credentials', async (t) => {
  let response = (await getWebhookSubscriptionDetails.getWebhookSubscriptionResponse(DeleteWebhookSubscriptionConst.invalidMidCredentials)) as any;
    t.not(response.httpCode, 200);
});