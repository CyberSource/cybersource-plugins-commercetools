import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../../constants/constants';
import updateToken from '../../../service/payment/UpdateTokenService';
import UpdateTokenServiceConst from '../../const/UpdateTokenServiceConst';

let result: any = {
  httpCode: null,
  default: null,
};

test.serial('Check http code for token update', async (t: any) => {
  let response: any = await updateToken.getUpdateTokenResponse(UpdateTokenServiceConst.tokens, UpdateTokenServiceConst.newExpiryMonth, UpdateTokenServiceConst.newExpiryYear, UpdateTokenServiceConst.addressData);
  result.httpCode = response.httpCode;
  result.default = response.default;
  if (Constants.HTTP_OK_STATUS_CODE == result.httpCode) {
    t.is(result.httpCode, Constants.HTTP_OK_STATUS_CODE);
  } else {
    t.not(result.httpCode, Constants.HTTP_OK_STATUS_CODE);
  }
});

test.serial('Check value of default after token update', async (t: any) => {
  if (Constants.HTTP_OK_STATUS_CODE == result.httpCode) {
    t.is(result.default, true);
  } else {
    t.not(result.default, true);
  }
});

test.serial('Check http code for token updation with invalid address', async (t: any) => {
  let response: any = await updateToken.getUpdateTokenResponse(UpdateTokenServiceConst.tokens, UpdateTokenServiceConst.newExpiryMonth, UpdateTokenServiceConst.newExpiryYear, UpdateTokenServiceConst.invalidAddressData);
  result.httpCode = response.httpCode;
  result.default = response.default;
  t.not(result.httpCode, Constants.HTTP_OK_STATUS_CODE);
});

test.serial('Check value of default for updating token with invalid address', async (t: any) => {
  t.not(result.default, true);
});

test.serial('Check http code for updating invalid token', async (t: any) => {
  let response: any = await updateToken.getUpdateTokenResponse(UpdateTokenServiceConst.tokenObject, UpdateTokenServiceConst.newExpiryMonth, UpdateTokenServiceConst.newExpiryYear, UpdateTokenServiceConst.addressData);
  result.httpCode = response.httpCode;
  result.default = response.default;
  t.not(result.httpCode, Constants.HTTP_OK_STATUS_CODE);
});

test.serial('Check value of default for token update token with invalid token', async (t: any) => {
  t.not(result.default, true);
});
