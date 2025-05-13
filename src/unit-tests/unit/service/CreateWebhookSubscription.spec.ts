import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../constants/paymentConstants';
import createWebhookSubscription from '../../../service/payment/CreateWebhookSubscription';
import multiMid from '../../../utils/config/MultiMid';
import CaptureContextServiceConst from '../../const/CaptureContextServiceConst';
import DeleteWebhookSubscriptionConst from '../../const/DeleteWebhookSubscriptionConst';

dotenv.config();

test.serial('Test create webhook subscription response', async (t) => {
  try {
    let mid = CaptureContextServiceConst.merchantId;

    if (process.env.PAYMENT_GATEWAY_MERCHANT_ID === mid) {
      mid = '';
    }

    let midCredentials = multiMid.getMidCredentials(mid);
    let response = await createWebhookSubscription.getCreateWebhookSubscriptionResponse(midCredentials);
    if (Constants.HTTP_SUCCESS_STATUS_CODE === response.httpCode) {
      t.is(response.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: create webhook subscription ${response.httpCode}`);
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

test.serial('Test create webhook subscription response with invalid mid credentials', async (t) => {
  try {
    let response = await createWebhookSubscription.getCreateWebhookSubscriptionResponse(DeleteWebhookSubscriptionConst.invalidMidCredentials as any);
    if (Constants.HTTP_SUCCESS_STATUS_CODE !== response.httpCode) {
      t.not(response.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: create webhook subscription with invalid mid credentials ${response.httpCode}`);
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
