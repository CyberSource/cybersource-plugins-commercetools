import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../constants/paymentConstants';
import captureResponse from '../../../service/payment/PaymentCaptureService';
import authorizationConst from '../../const/PayPal/PaymentAuthorizationServiceConstPP';
import captureConstPP from '../../const/PayPal/PaymentCaptureServiceConstPP';

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
    let result: any = await captureResponse.getCaptureResponse(
      authorizationConst.payment as any,
      captureConstPP.updateTransactions as any,
      captureConstPP.authID as any,
      captureConstPP.orderNo as any
    );
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    t.log(result);
    if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
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
    if (Constants.API_STATUS_PENDING != paymentResponseObject.status) {
      t.not(paymentResponseObject.status, Constants.API_STATUS_PENDING);
    } else {
      t.fail(`Unexpected Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Capturing an invalid payment', async (t: any) => {
  try {
    let result: any = await captureResponse.getCaptureResponse(
      {} as any,
      captureConstPP.updateTransactions as any,
      captureConstPP.authId as any,
      captureConstPP.orderNo as any
    );
    paymentResponseObject.httpCode = result.httpCode;
    paymentResponseObject.status = result.status;
    if (Constants.HTTP_BAD_REQUEST_STATUS_CODE == paymentResponseObject.httpCode) {
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
    if (Constants.API_STATUS_PENDING != paymentResponseObject.status) {
      t.not(paymentResponseObject.status, Constants.API_STATUS_PENDING);
    } else {
      t.fail(`Unexpected Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Capturing a payment with reconciliation Id and check http code', async (t: any) => {
  try {
    let result: any = await captureResponse.getCaptureResponse(
      authorizationConst.payment as any,
      captureConstPP.updateTransactions as any,
      captureConstPP.authID as any,
      captureConstPP.orderNumber as any
    );
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
      t.is(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponseObject.httpCode}, Status: ${paymentResponseObject.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Check status for payment capture with reconciliation Id', async (t: any) => {
  try {
    if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
      t.is(paymentResponse.status, Constants.API_STATUS_PENDING);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponseObject.httpCode}, Status: ${paymentResponseObject.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Capturing a payment with empty auth id and check http code', async (t: any) => {
  try {
    let result: any = await captureResponse.getCaptureResponse(
      authorizationConst.payment as any,
      captureConstPP.updateTransactions as any,
      '',
      captureConstPP.orderNo as any
    );
    paymentResponseObject.httpCode = result.httpCode;
    paymentResponseObject.status = result.status;
    if (0 == paymentResponseObject.httpCode) {
      t.is(paymentResponseObject.httpCode, 0);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponseObject.httpCode}, Status: ${paymentResponseObject.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Check status for a capture with empty auth id', async (t: any) => {
  try {
    if (Constants.API_STATUS_PENDING != paymentResponseObject.status) {
      t.not(paymentResponseObject.status, Constants.API_STATUS_PENDING);
    } else {
      t.fail(`Unexpected Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});