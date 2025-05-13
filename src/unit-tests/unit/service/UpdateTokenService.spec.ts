import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../constants/paymentConstants';
import updateToken from '../../../service/payment/UpdateTokenService';
import UpdateTokenServiceConst from '../../const/UpdateTokenServiceConst';

dotenv.config();
let result: any = {
  httpCode: null,
  default: null,
};

test.serial('Check http code for token update', async (t: any) => {
  try {
    let response: any = await updateToken.getUpdateTokenResponse(UpdateTokenServiceConst.tokens, UpdateTokenServiceConst.newExpiryMonth, UpdateTokenServiceConst.newExpiryYear, UpdateTokenServiceConst.addressData);
    result.httpCode = response.httpCode;
    result.default = response.default;
    if (Constants.HTTP_OK_STATUS_CODE == result.httpCode) {
      t.is(result.httpCode, Constants.HTTP_OK_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: HTTP code' ${result.httpCode}`);
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

test.serial('Check value of default after token update', async (t: any) => {
  try {
    if (Constants.HTTP_OK_STATUS_CODE == result.httpCode) {
      t.is(result.default, true);
    } else {
      t.fail(`Unexpected error: HTTP code' ${result.httpCode}`);
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

test.serial('Check http code for token updation with invalid address', async (t: any) => {
  try {
    let response: any = await updateToken.getUpdateTokenResponse(UpdateTokenServiceConst.tokens, UpdateTokenServiceConst.newExpiryMonth, UpdateTokenServiceConst.newExpiryYear, UpdateTokenServiceConst.invalidAddressData);
    result.httpCode = response.httpCode;
    result.default = response.default;
    if (Constants.HTTP_OK_STATUS_CODE !== result.httpCode) {
      t.not(result.default, true);
    } else {
      t.fail(`Unexpected error: HTTP code' ${result.httpCode}`);
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

test.serial('Check value of default for updating token with invalid address', async (t: any) => {
  try {
    if (typeof result.default === 'boolean') {
      t.not(result.default, true);
    } else {
      t.fail(`Unexpected error: HTTP code' ${result.httpCode}`);
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

test.serial('Check http code for updating invalid token', async (t: any) => {
  try {
    let response: any = await updateToken.getUpdateTokenResponse(UpdateTokenServiceConst.tokenObject, UpdateTokenServiceConst.newExpiryMonth, UpdateTokenServiceConst.newExpiryYear, UpdateTokenServiceConst.addressData);
    result.httpCode = response.httpCode;
    result.default = response.default;
    if (Constants.HTTP_OK_STATUS_CODE !== result.httpCode) {
      t.not(result.httpCode, Constants.HTTP_OK_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: HTTP code' ${result.httpCode}`);
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

test.serial('Check value of default for token update token with invalid token', async (t: any) => {
  try {
    if (typeof result.default === 'boolean') {
      t.not(result.default, true);
    } else {
      t.fail(`Unexpected error: HTTP code' ${result.httpCode}`);
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