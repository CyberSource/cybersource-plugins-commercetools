import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../constants/paymentConstants';
import getTokenData from '../../../service/payment/GetTransientTokenData';
import CaptureContextServiceConst from '../../const/CaptureContextServiceConst';
import PaymentAuthorizationServiceConstCC from '../../const/CreditCard/PaymentAuthorizationServiceConstCC';

dotenv.config();

let captureContextResponse: any = {
  httpCode: null,
  status: null,
};

test.serial('Check http code of transient token data from checkout', async (t: any) => {
  try {
    let result: any = await getTokenData.getTransientTokenDataResponse(PaymentAuthorizationServiceConstCC.ucPayment as any, CaptureContextServiceConst.service as any);

    captureContextResponse.httpCode = result.httpCode;
    captureContextResponse.status = result.status;

    if (Constants.HTTP_OK_STATUS_CODE == captureContextResponse.httpCode) {
      t.is(captureContextResponse.httpCode, Constants.HTTP_OK_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: transient token data' ${result}`);
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

test.serial('Check status of transient token data from checkout ', async (t: any) => {
  try {
    if (Constants.HTTP_OK_STATUS_CODE == captureContextResponse.status) {
      t.is(captureContextResponse.status, Constants.HTTP_OK_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: transient token data from checkout' ${captureContextResponse.status}`);
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

test.serial('Check http code of transient token data from my account', async (t: any) => {
  try {
    let result: any = await getTokenData.getTransientTokenDataResponse(PaymentAuthorizationServiceConstCC.ucPayment, CaptureContextServiceConst.myAccount);
    captureContextResponse.httpCode = result.httpCode;
    captureContextResponse.status = result.status;
    if (Constants.HTTP_OK_STATUS_CODE == captureContextResponse.status) {
      t.is(captureContextResponse.httpCode, Constants.HTTP_OK_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: transient token data from my account' ${captureContextResponse.status}`);
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

test.serial('Check status of transient token data from my account', async (t: any) => {
  try {
    if (Constants.HTTP_OK_STATUS_CODE == captureContextResponse.status) {
      t.is(captureContextResponse.status, Constants.HTTP_OK_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: status transient token data from my account' ${captureContextResponse.status}`);
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

test.serial('Check http code of transient token data with empty payment', async (t: any) => {
  try {
    let result: any = await getTokenData.getTransientTokenDataResponse(null, CaptureContextServiceConst.myAccount);
    captureContextResponse.httpCode = result.httpCode;
    captureContextResponse.status = result.status;
    if (0 == captureContextResponse.httpCode) {
      t.is(captureContextResponse.httpCode, 0);
    } else {
      t.fail(`Unexpected error: transient token data with empty payment' ${captureContextResponse.status}`);
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

test.serial('Check status of transient token data with empty payment', async (t: any) => {
  try {
    if (captureContextResponse.status) {
      t.is(captureContextResponse.status, '');
    } else {
      t.fail(`Unexpected error: status transient token data with empty payment' ${captureContextResponse.status}`);
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
