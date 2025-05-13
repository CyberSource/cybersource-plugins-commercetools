import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../constants/paymentConstants';
import keyGeneration from '../../../service/payment/KeyGeneration';
import multiMid from '../../../utils/config/MultiMid';
import CaptureContextServiceConst from '../../const/CaptureContextServiceConst';
import DeleteWebhookSubscriptionConst from '../../const/DeleteWebhookSubscriptionConst';

dotenv.config();

test.serial('Test network token handler function', async (t) => {
  try {
    let midCredentials = await multiMid.getMidCredentials(CaptureContextServiceConst.merchantId);
    if ('' === midCredentials.merchantId) {
      midCredentials.merchantId = process.env.PAYMENT_GATEWAY_MERCHANT_ID;
      midCredentials.merchantKeyId = process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID;
      midCredentials.merchantSecretKey = process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY;
    }
    let response = (await keyGeneration.getKeyGenerationResponse(midCredentials)) as any;
    if (Constants.HTTP_SUCCESS_STATUS_CODE === response.httpCode) {
      t.is(response.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: HTTP code' ${response.httpCode}`);
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

test.serial('Test network token handler function with invalid mid credentials', async (t) => {
  try {
    let response: any = await keyGeneration.getKeyGenerationResponse(DeleteWebhookSubscriptionConst.invalidMidCredentials);
    if (Constants.HTTP_UNAUTHORIZED_STATUS_CODE === response.httpCode) {
      t.is(response.httpCode, Constants.HTTP_UNAUTHORIZED_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: HTTP code' ${response.httpCode}`);
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
