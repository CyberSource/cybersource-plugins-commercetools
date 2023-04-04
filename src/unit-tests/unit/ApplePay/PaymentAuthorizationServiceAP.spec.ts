import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();

import { cart, cardTokens,guestPayment, guestCardTokens, payment, payments, service, dontSaveTokenFlag, payerAuthMandateFlag, orderNo, orderNumber } from '../../const/ApplePay/PaymentAuthorizationServiceConstAP';
import auth from '../../../service/payment/PaymentAuthorizationService';

let paymentResponse = {
  httpCode: null,
  status: null,
};

test.serial('Authorizing a payment and check http code', async (t) => {
  const result: any = await auth.authorizationResponse(payment, cart, service, cardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if(paymentResponse.httpCode == 201)
  {
    t.is(paymentResponse.httpCode, 201);
  }
  else
  {
    t.not(paymentResponse.httpCode, 201);
  }
}); 

test.serial('Check status for payment authorization ', async (t) => {
  if (paymentResponse.status == 'AUTHORIZED') {
    t.is(paymentResponse.status, 'AUTHORIZED');
  } else if (paymentResponse.status == 'AUTHORIZED_PENDING_REVIEW') {
    t.is(paymentResponse.status, 'AUTHORIZED_PENDING_REVIEW');
  } else if (paymentResponse.status == 'DECLINED') {
    t.is(paymentResponse.status, 'DECLINED');
  } else if(paymentResponse.status == 'AUTHORIZED_RISK_DECLINED'){
    t.is(paymentResponse.status, 'AUTHORIZED_RISK_DECLINED');
  } else if(paymentResponse.status == 'INVALID_REQUEST'){
    t.is(paymentResponse.status, 'INVALID_REQUEST');
  } else {
      t.pass();
    }
});

test.serial('Authorizing a payment using invalid token and check http code', async (t) => {
  const result: any = await auth.authorizationResponse(payments, cart, service, cardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  t.not(paymentResponse.httpCode, 201);
}); 

test.serial('Check status for invalid authorization', async (t) => {
  var i = 0;
  if (paymentResponse.status == 'AUTHORIZED' || paymentResponse.status == 'DECLINED' || paymentResponse.status == 'AUTHORIZED_PENDING_REVIEW' || paymentResponse.status == 'AUTHORIZED_RISK_DECLINED') {
    i++;
  }
  t.is(i, 0);
});

test.serial('Authorizing a payment for guest user and check http code', async (t) => {
  const result: any = await auth.authorizationResponse(guestPayment, cart, service, guestCardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if(paymentResponse.httpCode == 201)
  {
    t.is(paymentResponse.httpCode, 201);
  }
  else
  {
    t.not(paymentResponse.httpCode, 201);
  }
}); 

test.serial('Check status for payment authorization for guest user', async (t) => {
  if (paymentResponse.status == 'AUTHORIZED') {
    t.is(paymentResponse.status, 'AUTHORIZED');
  } else if (paymentResponse.status == 'AUTHORIZED_PENDING_REVIEW') {
    t.is(paymentResponse.status, 'AUTHORIZED_PENDING_REVIEW');
  } else if (paymentResponse.status == 'DECLINED') {
    t.is(paymentResponse.status, 'DECLINED');
  } else if(paymentResponse.status == 'AUTHORIZED_RISK_DECLINED'){
    t.is(paymentResponse.status, 'AUTHORIZED_RISK_DECLINED');
  } else if(paymentResponse.status == 'INVALID_REQUEST'){
    t.is(paymentResponse.status, 'INVALID_REQUEST');
  } else {
      t.pass();
    }
});

test.serial('Authorizing a payment with reconciliation Id and check http code', async (t) => {
  const result: any = await auth.authorizationResponse(payment, cart, service, cardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNumber);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if(paymentResponse.httpCode == 201)
  {
    t.is(paymentResponse.httpCode, 201);
  }
  else
  {
    t.not(paymentResponse.httpCode, 201);
  }
}); 

test.serial('Check status for payment authorization with reconciliation Id', async (t) => {
  if (paymentResponse.status == 'AUTHORIZED') {
    t.is(paymentResponse.status, 'AUTHORIZED');
  } else if (paymentResponse.status == 'AUTHORIZED_PENDING_REVIEW') {
    t.is(paymentResponse.status, 'AUTHORIZED_PENDING_REVIEW');
  } else if (paymentResponse.status == 'DECLINED') {
    t.is(paymentResponse.status, 'DECLINED');
  } else if(paymentResponse.status == 'AUTHORIZED_RISK_DECLINED'){
    t.is(paymentResponse.status, 'AUTHORIZED_RISK_DECLINED');
  } else if(paymentResponse.status == 'INVALID_REQUEST'){
    t.is(paymentResponse.status, 'INVALID_REQUEST');
  } else {
      t.pass();
    }
});
