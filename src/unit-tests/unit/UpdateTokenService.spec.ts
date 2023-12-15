import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();
import {Constants} from '../../constants';
import updateToken from '../../service/payment/UpdateTokenService';
import { tokenObject, tokens, newExpiryMonth, newExpiryYear, addressData, invalidAddressData } from '../const/UpdateTokenServiceConst';

var result: any = {
  httpCode: null,
  default: null,
};

test.serial('Check http code for token updation', async (t) => {
  const response: any = await updateToken.updateTokenResponse(tokens, newExpiryMonth, newExpiryYear, addressData);
  result.httpCode = response.httpCode;
  result.default = response.default;
  if (Constants.HTTP_CODE_TWO_HUNDRED == result.httpCode) {
    t.is(result.httpCode, Constants.HTTP_CODE_TWO_HUNDRED);
  } else {
    t.not(result.httpCode, Constants.HTTP_CODE_TWO_HUNDRED);
  }
});

test.serial('Check value of default after token updation', async (t) => {
  if (Constants.HTTP_CODE_TWO_HUNDRED == result.httpCode) {
    t.is(result.default, true);
  } else {
    t.not(result.default, true);
  }
});

test.serial('Check http code for token updation with invalid address', async (t) => {
  const response: any = await updateToken.updateTokenResponse(tokens, newExpiryMonth, newExpiryYear, invalidAddressData);
  result.httpCode = response.httpCode;
  result.default = response.default;
  t.not(result.httpCode, Constants.HTTP_CODE_TWO_HUNDRED);
});

test.serial('Check http code for updating invalid token', async (t) => {
  const response: any = await updateToken.updateTokenResponse(tokenObject, newExpiryMonth, newExpiryYear, addressData);
  result.httpCode = response.httpCode;
  result.default = response.default;
  t.not(result.httpCode, Constants.HTTP_CODE_TWO_HUNDRED);
});

test.serial('Check value of default for updating  invalid token', async (t) => {
  t.not(result.default, true);
});
