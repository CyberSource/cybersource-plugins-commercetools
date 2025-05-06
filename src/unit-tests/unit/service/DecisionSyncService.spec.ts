import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../constants/paymentConstants';
import sync from '../../../service/payment/DecisionSyncService';
import DeleteWebhookSubscriptionConst from '../../const/DeleteWebhookSubscriptionConst';

dotenv.config();

test('Check http code for decision sync', async (t: any) => {
  try {
    let midCredentials = {
      merchantId: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
      merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
      merchantSecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
    };
    let result: any = await sync.getConversionDetails(midCredentials);

    if (Constants.HTTP_OK_STATUS_CODE == result.httpCode) {
      t.is(result.httpCode, Constants.HTTP_OK_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: decision sync ${result.httpCode}`);
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

test('Check http code for decision sync with invalid mid credentials', async (t: any) => {
  try {
    let result: any = await sync.getConversionDetails(DeleteWebhookSubscriptionConst.invalidMidCredentials);
    if (Constants.HTTP_UNAUTHORIZED_STATUS_CODE == result.httpCode) {
      t.is(result.httpCode, Constants.HTTP_UNAUTHORIZED_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: decision sync with invalid mid credentials ${result.httpCode}`);
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
