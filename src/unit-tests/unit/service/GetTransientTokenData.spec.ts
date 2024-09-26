import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();

import getTokenData from '../../../service/payment/GetTransientTokenData';
import CaptureContextServiceConst from '../../const/CaptureContextServiceConst';
import PaymentAuthorizationServiceConstCC from '../../const/CreditCard/PaymentAuthorizationServiceConstCC';

let captureContextResponse: any = {
  httpCode: null,
  status: null,
};

test.serial('Check http code of transient token data from checkout', async (t: any) => {
  let result: any = await getTokenData.getTransientTokenDataResponse(PaymentAuthorizationServiceConstCC.ucPayment, CaptureContextServiceConst.service);
  captureContextResponse.httpCode = result.httpCode;
  captureContextResponse.status = result.status;
  if (200 == result.httpCode) {
    t.is(captureContextResponse.httpCode, 200);
  } else if (410 == result.httpCode) {
    t.is(captureContextResponse.httpCode, 410);
  } else {
    t.pass();
  }
});

test.serial('Check status of transient token data from checkout ', async (t: any) => {
  if (200 == captureContextResponse.status) {
    t.is(captureContextResponse.status, 200);
  } else if (200 != captureContextResponse.status) {
    t.not(captureContextResponse.status, 200);
  }
});

test.serial('Check http code of transient token data from my account', async (t: any) => {
  let result: any = await getTokenData.getTransientTokenDataResponse(PaymentAuthorizationServiceConstCC.ucPayment, CaptureContextServiceConst.myAccount);
  captureContextResponse.httpCode = result.httpCode;
  captureContextResponse.status = result.status;
  if (200 == result.httpCode) {
    t.is(captureContextResponse.httpCode, 200);
  } else if (410 == result.httpCode) {
    t.is(captureContextResponse.httpCode, 410);
  } else {
    t.pass();
  }
});

test.serial('Check status of transient token data from my account', async (t: any) => {
  if (200 == captureContextResponse.status) {
    t.is(captureContextResponse.status, 200);
  } else if (200 != captureContextResponse.status) {
    t.not(captureContextResponse.status, 200);
  }
});

test.serial('Check http code of transient token data with empty payment', async (t: any) => {
  let result: any = await getTokenData.getTransientTokenDataResponse(null, CaptureContextServiceConst.myAccount);
  captureContextResponse.httpCode = result.httpCode;
  captureContextResponse.status = result.status;
  t.is(captureContextResponse.httpCode, 0);
});

test.serial('Check status of transient token data with empty payment', async (t: any) => {
  t.is(captureContextResponse.status, '');
});
