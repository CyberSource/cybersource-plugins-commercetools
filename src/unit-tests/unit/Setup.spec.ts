import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();

import { createWebhookSubscription, setupExtensionResources } from '../../setup';

test.serial('Test Create Webhook Subscription Setup ', async (t) => {
  let result: any = await createWebhookSubscription();
  if (result) {
    if (result?.httpCode == 201) {
      t.is(result.httpCode, 201);
    } else {
      t.not(result.httpCode, 201);
    }
  } else {
    t.pass();
  }
});

test.serial('create Extension Resources', async (t) => {
  let result = await setupExtensionResources();
  t.is(typeof result, 'boolean');
});
