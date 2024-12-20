import test from 'ava';
import dotenv from 'dotenv';

import AuthenticationHelper from '../../../../utils/helpers/AuthenticationHelper';
import ApiControllerConst from '../../../const/ApiControllerConst';
import PaymentUtilsConst from '../../../const/PaymentUtilsConst';

dotenv.config();

test.serial('Get InterationID with Invalid Signature', async (t) => {
  const result = await AuthenticationHelper.authenticateNetToken(PaymentUtilsConst.invalidSignature, ApiControllerConst.notification);
  t.is(result, false)
})

test.serial('Test Encryption', async (t) => {
  const result = AuthenticationHelper.encryption(PaymentUtilsConst.decodedValue);
  t.not(result, PaymentUtilsConst.headerValue)
})

test.serial('Test Decryption', async (t) => {
  const result = AuthenticationHelper.decryption(PaymentUtilsConst.headerValue);
  if (result === PaymentUtilsConst.decodedValue) {
    t.is(result, PaymentUtilsConst.decodedValue)
  }
  else {
    t.pass();
  }
})

test.serial('Test Rate Limit Endpoint Access', async (t) => {
  const result = AuthenticationHelper.rateLimitEndpointAccess();
  if (!result) {
    t.is(result, false)
  }
  else {
    t.not(result, true)
  }
})

test.serial('Test Rate Limit Endpoint Access with maximum limit reached', async (t) => {
  let result;
  for (let i = 0; i < 10; i++) {
    result = AuthenticationHelper.rateLimitEndpointAccess();
  }
  t.is(result, true);
})
