import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../constants/paymentConstants';
import deleteWebhookSubscriptionService from '../../../service/payment/DeleteWebhookSubscriptionService';
import multiMid from '../../../utils/config/MultiMid';
import CaptureContextServiceConst from '../../const/CaptureContextServiceConst';
import DeleteWebhookSubscriptionConst from '../../const/DeleteWebhookSubscriptionConst';

dotenv.config();

test.serial('Test Delete Webhook Subscription Response', async (t) => {
  try {
    let midCredentials = await multiMid.getMidCredentials(CaptureContextServiceConst.merchantId as any);
    let response = await deleteWebhookSubscriptionService.deleteWebhookSubscriptionResponse(midCredentials, DeleteWebhookSubscriptionConst.subscriptionId);
    if ('' === midCredentials.merchantId) {
      midCredentials.merchantId = process.env.PAYMENT_GATEWAY_MERCHANT_ID;
      midCredentials.merchantKeyId = process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID;
      midCredentials.merchantSecretKey = process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY;
    }

    if (Constants.HTTP_OK_STATUS_CODE === response.httpCode) {
      t.is(response.httpCode, Constants.HTTP_OK_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: Delete Webhook Subscription ${response.httpCode}`);
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

test.serial('Test Delete Webhook Subscription Response without mid credentials', async (t) => {
  try {
    let response = await deleteWebhookSubscriptionService.deleteWebhookSubscriptionResponse(DeleteWebhookSubscriptionConst.emptyMidCredentials, DeleteWebhookSubscriptionConst.subscriptionId);
    if (0 === response.httpCode) {
      t.is(response.httpCode, 0);
    } else {
      t.fail(`Unexpected error: Delete Webhook Subscription without mid credentials ${response.httpCode}`);
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

test.serial('Test Delete Webhook Subscription Response without subscription id', async (t) => {
  try {
    let response = await deleteWebhookSubscriptionService.deleteWebhookSubscriptionResponse(DeleteWebhookSubscriptionConst.emptyMidCredentials, '');
    if (0 === response.httpCode) {
      t.is(response.httpCode, 0);
    } else {
      t.fail(`Unexpected error: Delete Webhook Subscription without subscription id ${response.httpCode}`);
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

test.serial('Test Delete Webhook Subscription Response with invalid mid credentials', async (t) => {
  try {
    let response = await deleteWebhookSubscriptionService.deleteWebhookSubscriptionResponse(DeleteWebhookSubscriptionConst.invalidMidCredentials, DeleteWebhookSubscriptionConst.subscriptionId);
    if (Constants.HTTP_UNAUTHORIZED_STATUS_CODE === response.httpCode) {
      t.is(response.httpCode, Constants.HTTP_UNAUTHORIZED_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: Delete Webhook Subscription with invalid mid credentials ${response.httpCode}`);
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
