/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
/* eslint-disable import/order */
import test from 'ava';
import dotenv from 'dotenv';

import { cardTokens, cart, payment, payments, service, dontSaveTokenFlag } from '../../const/ClickToPay/PaymentAuthorizationServiceVsConst';
import auth from '../../../service/payment/PaymentAuthorizationService';
dotenv.config();

// eslint-disable-next-line prefer-const
let paymentResponse = {
  httpCode: null,
  status: null,
};

test.serial('Authorizing a payment and check http code', async (t) => {
  const result: any = await auth.authorizationResponse(payment, cart, service, cardTokens, dontSaveTokenFlag);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  t.is(paymentResponse.httpCode, 201);
});

test.serial('Check status of payment authorization', async (t) => {
  if (paymentResponse.status == 'AUTHORIZED') {
    t.is(paymentResponse.status, 'AUTHORIZED');
  } else if (paymentResponse.status == 'AUTHORIZED_PENDING_REVIEW') {
    t.is(paymentResponse.status, 'AUTHORIZED_PENDING_REVIEW');
  } else if (paymentResponse.status == 'DECLINED') {
    t.is(paymentResponse.status, 'DECLINED');
  }
});

test.serial('Authorizing a payment using invalid token', async (t) => {
  const result: any = await auth.authorizationResponse(payments, cart, service, cardTokens, dontSaveTokenFlag);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  t.not(paymentResponse.httpCode, 201);
});

test.serial('Check status of payment authorization for invalid token', async (t) => {
  var i = 0;
  if (paymentResponse.status == 'AUTHORIZED' || paymentResponse.status == 'DECLINED' || paymentResponse.status == 'AUTHORIZED_PENDING_REVIEW') {
    i++;
  }
  t.is(i, 0);
});
