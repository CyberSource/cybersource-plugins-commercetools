import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../constants/paymentConstants';
import authReversalResponse from '../../../service/payment/PaymentAuthorizationReversal';
import paymentAuthReversalConstAP from '../../const/ApplePay/PaymentAuthorizationReversalConstAP';

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

test.serial('Reversing a payment with invalid amount and check http code', async (t: any) => {
  try {
    const result: any = await authReversalResponse.getAuthReversalResponse(paymentAuthReversalConstAP.payments as any, paymentAuthReversalConstAP.cart as any, paymentAuthReversalConstAP.authId);
    if (Constants.HTTP_BAD_REQUEST_STATUS_CODE === result.httpCode) {
      t.is(result.httpCode, Constants.HTTP_BAD_REQUEST_STATUS_CODE);
    } else {
      t.fail(`Unexpected response: HTTP ${result.httpCode}, Status: ${result.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Check status for auth reversal with invalid amount', async (t: any) => {
  try {
    const paymentResponseObject: any = await authReversalResponse.getAuthReversalResponse(paymentAuthReversalConstAP.payments as any, paymentAuthReversalConstAP.cart as any, paymentAuthReversalConstAP.authId);
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
    const result: any = await authReversalResponse.getAuthReversalResponse(paymentAuthReversalConstAP.payment as any, paymentAuthReversalConstAP.cart as any, paymentAuthReversalConstAP.authId);
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode) {
      t.is(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
    } else {
      t.fail(`Unexpected response: HTTP ${result.httpCode}, Status: ${result.status}`);
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

test.serial('Reversing an invalid payment and check http code', async (t: any) => {
  try {
    const result: any = await authReversalResponse.getAuthReversalResponse(paymentAuthReversalConstAP.payment as any, paymentAuthReversalConstAP.cart as any, paymentAuthReversalConstAP.authId);
    paymentResponseObjects.httpCode = result.httpCode;
    paymentResponseObjects.status = result.status;
    if (paymentResponseObjects.httpCode === Constants.HTTP_BAD_REQUEST_STATUS_CODE) {
      t.is(paymentResponseObjects.httpCode, Constants.HTTP_BAD_REQUEST_STATUS_CODE);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponseObjects.httpCode}, Status: ${paymentResponseObjects.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Check status for auth reversal for invalid payment', async (t: any) => {
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

test.serial('Reversing a payment with multiple shipping and check http code', async (t: any) => {
  try {
    const result: any = await authReversalResponse.getAuthReversalResponse(paymentAuthReversalConstAP.multipleShippingPayment as any, paymentAuthReversalConstAP.shippingCart as any, paymentAuthReversalConstAP.multipleShippingReversalId);
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
    const result: any = await authReversalResponse.getAuthReversalResponse(paymentAuthReversalConstAP.payment as any, paymentAuthReversalConstAP.cart as any, '');
    paymentResponseObjects.httpCode = result.httpCode;
    paymentResponseObjects.status = result.status;
    if (Constants.HTTP_CODE_ZERO === paymentResponseObjects.httpCode) {
      t.is(paymentResponseObjects.httpCode, Constants.HTTP_CODE_ZERO);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponseObjects.httpCode}, Status: ${paymentResponseObjects.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Check status for auth reversal with empty auth reversal id', async (t: any) => {
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
