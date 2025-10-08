import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../constants/paymentConstants';
import authReversalResponse from '../../../service/payment/PaymentAuthorizationReversal';
import authReversalConstPP from '../../const/PayPal/PaymentAuthorizationReversalConstPP';

dotenv.config();
let paymentResponse: any = {
  httpCode: null,
  status: null,
};

let paymentResponseObject: any = {
  httpCode: null,
  status: null,
};

let paymentResponseObjects: any = {
  httpCode: null,
  status: null,
};

test.serial('Reversing an order with invalid auth reversal amount and check http code', async (t: any) => {
  try {
    let result: any = await authReversalResponse.getAuthReversalResponse(authReversalConstPP.payments as any, authReversalConstPP.cart as any, authReversalConstPP.authReversalId as any);
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

test.serial('Check status after auth reversal with invalid amount', async (t: any) => {
  try {
    if (Constants.API_STATUS_REVERSED !== paymentResponseObject.status) {
      t.not(paymentResponseObject.status, Constants.API_STATUS_REVERSED);
    } else {
      t.fail(`Unexpected Status: ${paymentResponseObject.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Reversing a payment and check http code', async (t: any) => {
  try {
    let result: any = await authReversalResponse.getAuthReversalResponse(authReversalConstPP.payment as any, authReversalConstPP.cart as any, authReversalConstPP.authReversalId as any);
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

test.serial('Check status for auth reversal', async (t: any) => {
  try {
    if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode) {
      t.is(paymentResponse.status, Constants.API_STATUS_REVERSED);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponse.httpCode}, Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Reversing an invalid order and check http code', async (t: any) => {
  try {
    let result: any = await authReversalResponse.getAuthReversalResponse(authReversalConstPP.payment as any, authReversalConstPP.cart as any, authReversalConstPP.authReversalID as any);
    paymentResponseObjects.httpCode = result.httpCode;
    paymentResponseObjects.status = result.status;
    if (Constants.HTTP_BAD_REQUEST_STATUS_CODE === paymentResponseObjects.httpCode) {
      t.is(paymentResponseObjects.httpCode, Constants.HTTP_BAD_REQUEST_STATUS_CODE);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponseObjects.httpCode}, Status: ${paymentResponseObjects.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Check status for reversing an invalid order', async (t: any) => {
  try {
    if (Constants.API_STATUS_REVERSED !== paymentResponseObjects.status) {
      t.not(paymentResponseObjects.status, Constants.API_STATUS_REVERSED);
    } else {
      t.fail(`Unexpected Status: ${paymentResponseObjects.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Reversing a payment with multiple shipping and check http code', async (t: any) => {
  try {
    let result: any = await authReversalResponse.getAuthReversalResponse(authReversalConstPP.multipleShippingPayment as any, authReversalConstPP.shippingCart as any, authReversalConstPP.multipleShippingReversalId as any);
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

test.serial('Check status of auth reversal with multiple shipping', async (t: any) => {
  try {
    if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode) {
      t.is(paymentResponse.status, Constants.API_STATUS_REVERSED);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponse.httpCode}, Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Reversing a payment with empty auth reversal id and check http code', async (t: any) => {
  try {
    let result: any = await authReversalResponse.getAuthReversalResponse(authReversalConstPP.payment as any, authReversalConstPP.cart as any, '');
    paymentResponseObjects.httpCode = result.httpCode;
    paymentResponseObjects.status = result.status;
    if (0 === paymentResponseObjects.httpCode) {
      t.is(paymentResponseObjects.httpCode, 0);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponseObjects.httpCode}, Status: ${paymentResponseObjects.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Check status for auth reversal with empty auth reversal id', async (t: any) => {
  try {
    if (Constants.API_STATUS_REVERSED !== paymentResponseObjects.status) {
      t.not(paymentResponseObjects.status, Constants.API_STATUS_REVERSED);
    } else {
      t.fail(`Unexpected Status: ${paymentResponseObjects.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});