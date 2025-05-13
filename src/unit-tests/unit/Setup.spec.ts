import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../constants/paymentConstants';
import { createWebhookSubscription, setupExtensionResources } from '../../setup';

dotenv.config();

test.serial('Test Create Webhook Subscription Setup', async (t) => {
  try {
    let result: any = await createWebhookSubscription();
    let responseCode = result?.httpCode;
    if (Constants.HTTP_SUCCESS_STATUS_CODE == responseCode) {
      t.is(responseCode, Constants.HTTP_SUCCESS_STATUS_CODE);
    } else {
      t.fail(`Unexpected error in response: ${responseCode}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('create Extension Resources', async (t) => {
  try {
    let result = await setupExtensionResources();
    if (result) {
      t.is(typeof result, 'boolean');
    } else {
      t.fail(`Unexpected type: create Extension Resources ${typeof result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});
