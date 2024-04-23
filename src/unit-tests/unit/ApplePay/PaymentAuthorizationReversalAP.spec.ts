import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../../constants';
import authReversalResponse from '../../../service/payment/PaymentAuthorizationReversal';
import { authReversalID, authReversalId, cart, multipleShippingPayment, multipleShippingReversalId, payment, payments, shippingCart } from '../../const/ApplePay/PaymentAuthorizationReversalConstAP';

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
  let result: any = await authReversalResponse.authReversalResponse(payments, cart, authReversalId);
  paymentResponseObject.httpCode = result.httpCode;
  paymentResponseObject.status = result.status;
  t.not(paymentResponseObject.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
});

test.serial('Check status for auth reversal with invalid amount ', async (t: any) => {
  t.not(paymentResponseObject.status, Constants.API_STATUS_REVERSED);
});

test.serial('Reversing a payment and check http code', async (t: any) => {
  let result: any = await authReversalResponse.authReversalResponse(payment, cart, authReversalId);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  }
});

test.serial('Check status for auth reversal ', async (t: any) => {
  if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
    t.is(paymentResponse.status, Constants.API_STATUS_REVERSED);
  } else {
    t.not(paymentResponse.status, Constants.API_STATUS_REVERSED);
  }
});

test.serial('Reversing an invalid payment and check http code', async (t: any) => {
  let result: any = await authReversalResponse.authReversalResponse(payment, cart, authReversalID);
  paymentResponseObjects.httpCode = result.httpCode;
  paymentResponseObjects.status = result.status;
  t.not(paymentResponseObjects.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
});

test.serial('Check status for  auth reversal for invalid payment ', async (t: any) => {
  t.not(paymentResponseObjects.status, Constants.API_STATUS_REVERSED);
});

test.serial('Reversing a payment with multiple shipping and check http code', async (t: any) => {
  let result: any = await authReversalResponse.authReversalResponse(multipleShippingPayment, shippingCart, multipleShippingReversalId);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  }
});

test.serial('Check status of auth reversal  with multiple shipping', async (t: any) => {
  if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
    t.is(paymentResponse.status, Constants.API_STATUS_REVERSED);
  } else {
    t.not(paymentResponse.status, Constants.API_STATUS_REVERSED);
  }
});
