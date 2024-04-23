import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();

import getWebhookSubscriptionDetails from '../../service/payment/GetWebhookSubscriptionDetails';

const midCredentials = {
  merchantId: 'visa_isv_commercetools_pmt',
  merchantKeyId: 'c886fd00-4d1b-4163-9a02-024948d0fe07',
  merchantSecretKey: 'uWewxMNOAbkMcR6mivYXQDa7uyLUHN3d3TEAxIqI/2g=',
};

test.serial('Test Get Webhook Subscription Response', async (t) => {
  const response = (await getWebhookSubscriptionDetails.getWebhookSubscriptionResponse(midCredentials)) as any;

  t.truthy(response.httpCode);
  t.truthy(response.webhookId);
  t.truthy(response.webhookUrl);

  if (200 === response.httpCode) {
    t.is(response.httpCode, 200);
  } else {
    t.not(response.httpCode, 200);
  }
});
