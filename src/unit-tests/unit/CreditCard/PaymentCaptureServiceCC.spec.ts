import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../constants/paymentConstants';
import capture from '../../../service/payment/PaymentCaptureService';
import captureConstCC from '../../const/CreditCard/PaymentCaptureServiceConstCC';

dotenv.config();
let paymentResponse: any = {
  httpCode: null,
  status: null,
};

let paymentResponseObject: any = {
  httpCode: null,
  status: null,
};

test.serial('Capturing a payment and check http code', async (t: any) => {
  try {
    let result: any = await capture.getCaptureResponse(
      captureConstCC.payment as any,
      captureConstCC.updateTransactions as any,
      captureConstCC.authId as any,
      captureConstCC.orderNo as any
    );
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode) {
      t.is(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponse.httpCode}, Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Check status for payment capture', async (t: any) => {
  try {
    if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode) {
      t.is(paymentResponse.status, Constants.API_STATUS_PENDING);
    } else {
      t.fail(`Unexpected Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Capturing an invalid payment and check http code', async (t: any) => {
  try {
    let result: any = await capture.getCaptureResponse(
      captureConstCC.payment as any,
      captureConstCC.updateTransactions as any,
      captureConstCC.authID as any,
      captureConstCC.orderNo as any
    );
    paymentResponseObject.httpCode = result.httpCode;
    paymentResponseObject.status = result.status;
    if (Constants.HTTP_BAD_REQUEST_STATUS_CODE === paymentResponseObject.httpCode) {
      t.is(paymentResponseObject.httpCode, Constants.HTTP_BAD_REQUEST_STATUS_CODE);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponseObject.httpCode}, Status: ${paymentResponseObject.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Check status for invalid capture', async (t: any) => {
  try {
    if (Constants.API_STATUS_PENDING !== paymentResponseObject.status) {
      t.not(paymentResponseObject.status, Constants.API_STATUS_PENDING);
    } else {
      t.fail(`Unexpected Status: ${paymentResponseObject.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Capturing a payment with reconciliation Id and check http code', async (t: any) => {
  try {
    let result: any = await capture.getCaptureResponse(
      captureConstCC.payment as any,
      captureConstCC.updateTransactions as any,
      captureConstCC.authId as any,
      captureConstCC.orderNumber as any
    );
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode) {
      t.is(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponse.httpCode}, Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Check status for payment capture with reconciliation Id', async (t: any) => {
  try {
    if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode) {
      t.is(paymentResponse.status, Constants.API_STATUS_PENDING);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponse.httpCode}, Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Capturing a payment with empty auth id and check http code', async (t: any) => {
  try {
    let result: any = await capture.getCaptureResponse(
      captureConstCC.payment as any,
      captureConstCC.updateTransactions as any,
      '',
      captureConstCC.orderNo as any
    );
    paymentResponseObject.httpCode = result.httpCode;
    paymentResponseObject.status = result.status;
    if (Constants.HTTP_CODE_ZERO === paymentResponseObject.httpCode) {
      t.is(paymentResponseObject.httpCode, Constants.HTTP_CODE_ZERO);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponseObject.httpCode}, Status: ${paymentResponseObject.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Check status for a capture with empty auth id', async (t: any) => {
  try {
    if (Constants.API_STATUS_PENDING !== paymentResponseObject.status) {
      t.not(paymentResponseObject.status, Constants.API_STATUS_PENDING);
    } else {
      t.fail(`Unexpected Status: ${paymentResponseObject.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});