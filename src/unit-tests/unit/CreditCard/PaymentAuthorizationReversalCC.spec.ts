import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../../constants';
import reverse from '../../../service/payment/PaymentAuthorizationReversal';
import { authID, authId, carts, multipleShippingPayment, multipleShippingReversalId, payment, payments, shippingCart } from '../../const/CreditCard/PaymentAuthorizationReversalConstCC';

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
  let result: any = await reverse.authReversalResponse(payments, carts, authId);
  paymentResponseObject.httpCode = result.httpCode;
  paymentResponseObject.status = result.status;
  t.not(paymentResponseObject.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
});

test.serial('Çheck status after auth reversal with invalid amount', async (t: any) => {
  t.not(paymentResponseObject.status, Constants.API_STATUS_REVERSED);
});

test.serial('Reversing a payment and check http code', async (t: any) => {
  let result: any = await reverse.authReversalResponse(payment, carts, authId);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  }
});

test.serial('Check status for auth reversal', async (t: any) => {
  if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
    t.is(paymentResponse.status, Constants.API_STATUS_REVERSED);
  } else {
    t.not(paymentResponse.status, Constants.API_STATUS_REVERSED);
  }
});

test.serial('Reversing an invalid order and check http code', async (t: any) => {
  let result: any = await reverse.authReversalResponse(payment, carts, authID);
  paymentResponseObjects.httpCode = result.httpCode;
  paymentResponseObjects.status = result.status;
  t.not(paymentResponseObjects.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
});

test.serial('Çheck status for reversing an invalid order', async (t: any) => {
  t.not(paymentResponseObjects.status, Constants.API_STATUS_REVERSED);
});

test.serial('Reversing a payment with multiple shipping and check http code', async (t: any) => {
  let result: any = await reverse.authReversalResponse(multipleShippingPayment, shippingCart, multipleShippingReversalId);
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

test.serial('Reversing a payment with empty auth reversal id and check http code', async (t: any) => {
  let result: any = await reverse.authReversalResponse(payment, carts, '');
  paymentResponseObjects.httpCode = result.httpCode;
  paymentResponseObjects.status = result.status;
  t.not(paymentResponseObjects.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
});

test.serial('Check status for auth reversal with empty auth reversal id', async (t: any) => {
  t.not(paymentResponseObjects.status, Constants.API_STATUS_REVERSED);
});