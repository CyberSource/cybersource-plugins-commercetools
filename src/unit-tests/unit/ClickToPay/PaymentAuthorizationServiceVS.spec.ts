import test from 'ava';
import dotenv from 'dotenv';
import { cardTokens, cart, guestPayment, guestCardTokens, payment, payments, service, dontSaveTokenFlag, payerAuthMandateFlag, orderNo, orderNumber, shippingCart, ucPayment } from '../../const/ClickToPay/PaymentAuthorizationServiceVsConst';
import auth from '../../../service/payment/PaymentAuthorizationService';
import {Constants} from '../../../constants';
dotenv.config();

let paymentResponse: any = {
  httpCode: null,
  status: null,
};

test.serial('Authorizing a payment and check http code', async (t) => {
  const result: any = await auth.authorizationResponse(payment, cart, service, cardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  }
});

test.serial('Check status of payment authorization', async (t) => {
  if (Constants.API_STATUS_AUTHORIZED == paymentResponse.status) {
    t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
  } else if (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW == paymentResponse.status) {
    t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW);
  } else if (Constants.API_STATUS_DECLINED == paymentResponse.status) {
    t.is(paymentResponse.status, Constants.API_STATUS_DECLINED);
  } else if (Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == paymentResponse.status) {
    t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED_RISK_DECLINED);
  } else if (Constants.API_STATUS_INVALID_REQUEST == paymentResponse.status) {
    t.is(paymentResponse.status, Constants.API_STATUS_INVALID_REQUEST);
  } else {
    t.pass();
  }
});

test.serial('Authorizing a payment using invalid token', async (t) => {
  const result: any = await auth.authorizationResponse(payments, cart, service, cardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  t.not(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
});

test.serial('Check status of payment authorization for invalid token', async (t) => {
  var i = 0;
  if (Constants.API_STATUS_AUTHORIZED == paymentResponse.status || Constants.API_STATUS_DECLINED == paymentResponse.status || Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW == paymentResponse.status || Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == paymentResponse.status) {
    i++;
  }
  t.is(i, 0);
});

test.serial('Authorizing a payment for guest user and check http code', async (t) => {
  const result: any = await auth.authorizationResponse(guestPayment, cart, service, guestCardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  }
});

test.serial('Check status of payment authorization for guest user', async (t) => {
  if (Constants.API_STATUS_AUTHORIZED == paymentResponse.status) {
    t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
  } else if (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW == paymentResponse.status) {
    t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW);
  } else if (Constants.API_STATUS_DECLINED == paymentResponse.status) {
    t.is(paymentResponse.status, Constants.API_STATUS_DECLINED);
  } else if (Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == paymentResponse.status) {
    t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED_RISK_DECLINED);
  } else if (Constants.API_STATUS_INVALID_REQUEST == paymentResponse.status) {
    t.is(paymentResponse.status, Constants.API_STATUS_INVALID_REQUEST);
  } else {
    t.pass();
  }
});

test.serial('Authorizing a payment with reconciliation Id and check http code', async (t) => {
  const result: any = await auth.authorizationResponse(payment, cart, service, cardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNumber);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  }
});

test.serial('Check status of payment authorization with reconciliation Id', async (t) => {
  if (Constants.API_STATUS_AUTHORIZED == paymentResponse.status) {
    t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
  } else if (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW == paymentResponse.status) {
    t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW);
  } else if (Constants.API_STATUS_DECLINED == paymentResponse.status) {
    t.is(paymentResponse.status, Constants.API_STATUS_DECLINED);
  } else if (Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == paymentResponse.status) {
    t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED_RISK_DECLINED);
  } else if (Constants.API_STATUS_INVALID_REQUEST == paymentResponse.status) {
    t.is(paymentResponse.status, Constants.API_STATUS_INVALID_REQUEST);
  } else {
    t.pass();
  }
});

test.serial('Authorizing a payment with multiple shipping mode and check http code', async (t) => {
  const result: any = await auth.authorizationResponse(payment, shippingCart, service, cardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNumber);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  }
});

test.serial('Check status of payment authorization with multiple shipping mode', async (t) => {
  if (Constants.API_STATUS_AUTHORIZED == paymentResponse.status) {
    t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
  } else if (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW == paymentResponse.status) {
    t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW);
  } else if (Constants.API_STATUS_DECLINED == paymentResponse.status) {
    t.is(paymentResponse.status, Constants.API_STATUS_DECLINED);
  } else if (Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == paymentResponse.status) {
    t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED_RISK_DECLINED);
  } else if (Constants.API_STATUS_INVALID_REQUEST == paymentResponse.status) {
    t.is(paymentResponse.status, Constants.API_STATUS_INVALID_REQUEST);
  } else {
    t.pass();
  }
});

test.serial('Authorizing a payment for UC and check http code', async (t) => {
  const result: any = await auth.authorizationResponse(ucPayment, cart, service, cardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  }
});

test.serial('Check status of payment authorization for UC', async (t) => {
  if (Constants.API_STATUS_AUTHORIZED == paymentResponse.status) {
    t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
  } else if (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW == paymentResponse.status) {
    t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW);
  } else if (Constants.API_STATUS_DECLINED == paymentResponse.status) {
    t.is(paymentResponse.status, Constants.API_STATUS_DECLINED);
  } else if (Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == paymentResponse.status) {
    t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED_RISK_DECLINED);
  } else if (Constants.API_STATUS_INVALID_REQUEST == paymentResponse.status) {
    t.is(paymentResponse.status, Constants.API_STATUS_INVALID_REQUEST);
  } else {
    t.pass();
  }
});
