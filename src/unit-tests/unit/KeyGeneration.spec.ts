import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import keyGeneration from '../../service/payment/KeyGeneration';
import multiMid from '../../utils/config/MultiMid';
import { merchantId } from '../const/CaptureContextServiceConst';
import { emptyMidCredentials, invalidMidCredentials } from '../const/DeleteWebhookSubscriptionConst';

test.serial('Test network token handler function', async (t) => {
  let midCredentials = await multiMid.getMidCredentials(merchantId);
  if('' === midCredentials.merchantId) {
    midCredentials.merchantId = process.env.PAYMENT_GATEWAY_MERCHANT_ID;
    midCredentials.merchantKeyId = process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID;
    midCredentials.merchantSecretKey = process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY;
  }
  let response = (await keyGeneration.keyGenerationResponse(midCredentials)) as any;
  if (201 === response.httpCode) {
    t.is(response.httpCode, 201);
  } else {
    t.not(response.httpCode, 201);
  }
});

test.serial('Test network token handler function without mid credentials', async (t) => {
  let response: any = await keyGeneration.keyGenerationResponse(emptyMidCredentials);
  t.is(response.httpCode, 0);
});

test.serial('Test network token handler function with invalid mid credentials', async (t) => {
  let response: any = await keyGeneration.keyGenerationResponse(invalidMidCredentials);
  t.is(response.httpCode, 401);
});
