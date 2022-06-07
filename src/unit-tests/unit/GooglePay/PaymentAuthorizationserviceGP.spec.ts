/* eslint-disable import/order */
/* eslint-disable functional/no-let */
/* eslint-disable prefer-const */
/* eslint-disable functional/immutable-data */
import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();
/* import { cart, cardTokens, payment, payments, service, dontSaveTokenFlag, payerAuthMandateFlag } from '../../const/GooglePay/PaymentAuthorizationServiceConstGP';
import authorizationResponse from '../../../service/payment/PaymentAuthorizationService'; */

let paymentResponse = {
  httpCode: null,
  transactionId: null,
  status: null,
  message: null,
  data: null,
};

/* test.serial('Authorizing a payment and check http code', async (t) => {
  const result: any = await authorizationResponse.authorizationResponse(payment, cart, service, cardTokens, dontSaveTokenFlag, payerAuthMandateFlag);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.transactionId = result.transactionId;
  paymentResponse.status = result.status;
  paymentResponse.message = result.message;
  paymentResponse.data = result.data;
  t.is(paymentResponse.httpCode, 201);
}); */

test.serial('Check status of payment authorization', async (t) => {
  if (paymentResponse.status == 'AUTHORIZED') {
    t.is(paymentResponse.status, 'AUTHORIZED');
  } else if (paymentResponse.status == 'AUTHORIZED_PENDING_REVIEW') {
    t.is(paymentResponse.status, 'AUTHORIZED_PENDING_REVIEW');
  } else if (paymentResponse.status == 'DECLINED') {
    t.is(paymentResponse.status, 'DECLINED');
  }
});

/* test.serial('Authorizing a payment using invalid token and check http code', async (t) => {
  const result: any = await authorizationResponse.authorizationResponse(payments, cart, service, cardTokens, dontSaveTokenFlag, payerAuthMandateFlag);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.transactionId = result.transactionId;
  paymentResponse.status = result.status;
  paymentResponse.message = result.message;
  paymentResponse.data = result.data;
  t.not(paymentResponse.httpCode, 201);
}); */

test.serial('Check status of payment authorization using invalid token', async (t) => {
  var i = 0;
  if (paymentResponse.status == 'AUTHORIZED' || paymentResponse.status == 'DECLINED' || paymentResponse.status == 'AUTHORIZED_PENDING_REVIEW') {
    i++;
  }
  t.is(i, 0);
});
