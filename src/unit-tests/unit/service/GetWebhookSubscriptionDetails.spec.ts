import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../constants/paymentConstants';
import getWebhookSubscriptionDetails from '../../../service/payment/GetWebhookSubscriptionDetails';
import DeleteWebhookSubscriptionConst from '../../const/DeleteWebhookSubscriptionConst';

dotenv.config();
let midCredentials = {
  merchantId: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
  merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
  merchantSecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
};

test.serial('Test get webhook subscription response', async (t) => {
  try {
    let response = (await getWebhookSubscriptionDetails.getWebhookSubscriptionResponse(midCredentials)) as any;
    if (Constants.HTTP_OK_STATUS_CODE === response.httpCode) {
      t.is(response.httpCode, Constants.HTTP_OK_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: http Code' ${response.httpCode}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Test get webhook subscription response without mid credentials', async (t) => {
  try {
    let response = (await getWebhookSubscriptionDetails.getWebhookSubscriptionResponse(DeleteWebhookSubscriptionConst.emptyMidCredentials)) as any;
    if (Constants.HTTP_OK_STATUS_CODE !== response.httpCode) {
      t.not(response.httpCode, Constants.HTTP_OK_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: http Code' ${response.httpCode}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Test get webhook subscription response with invalid mid credentials', async (t) => {
  try {
    let response = (await getWebhookSubscriptionDetails.getWebhookSubscriptionResponse(DeleteWebhookSubscriptionConst.invalidMidCredentials)) as any;
    if (Constants.HTTP_OK_STATUS_CODE !== response.httpCode) {
      t.not(response.httpCode, Constants.HTTP_OK_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: http Code' ${response.httpCode}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});
