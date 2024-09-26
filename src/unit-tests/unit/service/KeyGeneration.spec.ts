import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import keyGeneration from '../../../service/payment/KeyGeneration';
import multiMid from '../../../utils/config/MultiMid';
import CaptureContextServiceConst from '../../const/CaptureContextServiceConst';
import DeleteWebhookSubscriptionConst from '../../const/DeleteWebhookSubscriptionConst';

test.serial('Test network token handler function', async (t) => {
  let midCredentials = await multiMid.getMidCredentials(CaptureContextServiceConst.merchantId);
  if('' === midCredentials.merchantId) {
    midCredentials.merchantId = process.env.PAYMENT_GATEWAY_MERCHANT_ID;
    midCredentials.merchantKeyId = process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID;
    midCredentials.merchantSecretKey = process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY;
  }
  let response = (await keyGeneration.getKeyGenerationResponse(midCredentials)) as any;
  if (201 === response.httpCode) {
    t.is(response.httpCode, 201);
  } else {
    t.not(response.httpCode, 201);
  }
});

test.serial('Test network token handler function with invalid mid credentials', async (t) => {
  let response: any = await keyGeneration.getKeyGenerationResponse(DeleteWebhookSubscriptionConst.invalidMidCredentials);
  t.is(response.httpCode, 401);
});
