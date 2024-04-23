import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import keyGeneration from '../../service/payment/KeyGeneration';
import multiMid from '../../utils/config/MultiMid';
import { merchantId } from '../const/CaptureContextServiceConst';
import { emptyMidCredentials } from '../const/DeleteWebhookSubscriptionConst';

test.serial('Test network token handler function', async (t) => {
  let midCredentials = await multiMid.getMidCredentials(merchantId);
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
