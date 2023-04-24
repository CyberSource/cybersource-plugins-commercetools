import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();
import { authReversalId, authReversalID, cart, payment, payments, multipleShippingPayment, multipleShippingReversalId, shippingCart } from '../../const/ApplePay/PaymentAuthorizationReversalConstAP';
import authReversalResponse from '../../../service/payment/PaymentAuthorizationReversal';

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

test.serial('Reversing a payment with invalid amount and check http code', async (t) => {
  const result: any = await authReversalResponse.authReversalResponse(payments, cart, authReversalId);
  paymentResponseObject.httpCode = result.httpCode;
  paymentResponseObject.status = result.status;
  t.not(paymentResponseObject.httpCode, 201);
});

test.serial('Check status for auth reversal with invalid amount ', async (t) => {
  t.not(paymentResponseObject.status, 'REVERSED');
});

test.serial('Reversing a payment and check http code', async (t) => {
  const result: any = await authReversalResponse.authReversalResponse(payment, cart, authReversalId);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (paymentResponse.httpCode == 201) {
    t.is(paymentResponse.httpCode, 201);
  } else {
    t.not(paymentResponse.httpCode, 201);
  }
});

test.serial('Check status for auth reversal ', async (t) => {
  if (paymentResponse.httpCode == 201) {
    t.is(paymentResponse.status, 'REVERSED');
  } else {
    t.not(paymentResponse.status, 'REVERSED');
  }
});

test.serial('Reversing an invalid payment and check http code', async (t) => {
  const result: any = await authReversalResponse.authReversalResponse(payment, cart, authReversalID);
  paymentResponseObjects.httpCode = result.httpCode;
  paymentResponseObjects.status = result.status;
  t.not(paymentResponseObjects.httpCode, 201);
});

test.serial('Check status for  auth reversal for invalid payment ', async (t) => {
  t.not(paymentResponseObjects.status, 'REVERSED');
});

test.serial('Reversing a payment with multiple shipping and check http code', async (t) => {
  const result: any = await authReversalResponse.authReversalResponse(multipleShippingPayment, shippingCart, multipleShippingReversalId);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (paymentResponse.httpCode == 201) {
    t.is(paymentResponse.httpCode, 201);
  } else {
    t.not(paymentResponse.httpCode, 201);
  }
});

test.serial('Check status of auth reversal  with multiple shipping', async (t) => {
  if (paymentResponse.httpCode == 201) {
    t.is(paymentResponse.status, 'REVERSED');
  } else {
    t.not(paymentResponse.status, 'REVERSED');
  }
});
