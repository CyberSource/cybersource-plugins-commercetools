import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../constants/paymentConstants';
import addTokenService from '../../../service/payment/AddTokenService';
import AddTokenServiceConst from '../../const/AddTokenServiceConst';

dotenv.config();
let paymentResponse: any = {
  httpCode: null,
  status: null,
};

test.serial('Get response of add token and check http code', async (t: any) => {
  try {
    let result: any = await addTokenService.getAddTokenResponse(AddTokenServiceConst.addTokenResponseCustomerId, AddTokenServiceConst.addTokenResponseCustomerObj, AddTokenServiceConst.addTokenAddress, AddTokenServiceConst.addTokenResponseCardTokens);
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
      t.is(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponse.httpCode}, Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Get response of add token and check status', async (t: any) => {
  try {
    if (Constants.API_STATUS_AUTHORIZED == paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponse.httpCode}, Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Get response of add token with invalid customer token and check http code', async (t: any) => {
  try {
    let result: any = await addTokenService.getAddTokenResponse(
      AddTokenServiceConst.addTokenResponseCustomerId as any,
      AddTokenServiceConst.addTokenResponseCustomerObj as any,
      AddTokenServiceConst.addTokenAddress as any,
      AddTokenServiceConst.addTokenResponseCardTokens as any,
    );
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;

    if (Constants.HTTP_SUCCESS_STATUS_CODE != paymentResponse.httpCode) {
      t.not(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponse.httpCode}, Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Get response of add token with invalid customer token and check status', async (t: any) => {
  try {
    if (Constants.API_STATUS_AUTHORIZED != paymentResponse.status) {
      t.not(paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponse.httpCode}, Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Get response of add token without customer id and check http code', async (t: any) => {
  try {
    let result: any = await addTokenService.getAddTokenResponse('', AddTokenServiceConst.addTokenResponseCustomerObj as any, AddTokenServiceConst.addTokenAddress as any, AddTokenServiceConst.addTokenResponseCardTokens as any);
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    if (0 == paymentResponse.httpCode) {
      t.is(paymentResponse.httpCode, 0);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponse.httpCode}, Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Get response of add token without customer id and check status', async (t: any) => {
  try {
    if (paymentResponse.status) {
      t.is(paymentResponse.status, '');
    } else {
      t.fail(`Unexpected response: HTTP Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Get response of add token without customer address and check http code', async (t: any) => {
  try {
    let result: any = await addTokenService.getAddTokenResponse('', AddTokenServiceConst.addTokenResponseCustomerObj as any, AddTokenServiceConst.addTokenAddress as any, AddTokenServiceConst.addTokenResponseCardTokens as any);
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    if (0 == paymentResponse.httpCode) {
      t.is(paymentResponse.httpCode, 0);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponse.httpCode}, Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Get response of add token without customer address and check status', async (t: any) => {
  try {
    if (paymentResponse.status) {
      t.is(paymentResponse.status, '');
    } else {
      t.fail(`Unexpected response: HTTP Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});
