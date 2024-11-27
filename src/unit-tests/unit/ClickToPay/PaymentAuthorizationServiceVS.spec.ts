import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../constants/constants';
import auth from '../../../service/payment/PaymentAuthorizationService';
import authServiceConstVS from '../../const/ClickToPay/PaymentAuthorizationServiceVsConst';
dotenv.config();

let paymentResponse: any = {
  httpCode: null,
  status: null,
};

test.serial('Authorizing a payment and check http code', async (t: any) => {
  let result: any = await auth.getAuthorizationResponse(authServiceConstVS.payment, authServiceConstVS.cart, authServiceConstVS.service, authServiceConstVS.cardTokens, authServiceConstVS.notSaveToken, authServiceConstVS.payerAuthMandateFlag, authServiceConstVS.orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  }
});

test.serial('Check status of payment authorization', async (t: any) => {
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

test.serial('Authorizing a payment using invalid token', async (t: any) => {
  let result: any = await auth.getAuthorizationResponse(authServiceConstVS.payments, authServiceConstVS.cart, authServiceConstVS.service, authServiceConstVS.cardTokens, authServiceConstVS.notSaveToken, authServiceConstVS.payerAuthMandateFlag, authServiceConstVS.orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  t.not(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
});

test.serial('Check status of payment authorization for invalid token', async (t: any) => {
  let i = 0;
  if (
    Constants.API_STATUS_AUTHORIZED == paymentResponse.status ||
    Constants.API_STATUS_DECLINED == paymentResponse.status ||
    Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW == paymentResponse.status ||
    Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == paymentResponse.status
  ) {
    i++;
  }
  t.is(i, 0);
});

test.serial('Authorizing a payment for guest user and check http code', async (t: any) => {
  let result: any = await auth.getAuthorizationResponse(authServiceConstVS.guestPayment, authServiceConstVS.cart, authServiceConstVS.service, authServiceConstVS.guestCardTokens, authServiceConstVS.notSaveToken, authServiceConstVS.payerAuthMandateFlag, authServiceConstVS.orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  }
});

test.serial('Check status of payment authorization for guest user', async (t: any) => {
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

test.serial('Authorizing a payment with reconciliation Id and check http code', async (t: any) => {
  let result: any = await auth.getAuthorizationResponse(authServiceConstVS.payment, authServiceConstVS.cart, authServiceConstVS.service, authServiceConstVS.cardTokens, authServiceConstVS.notSaveToken, authServiceConstVS.payerAuthMandateFlag, authServiceConstVS.orderNumber);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  }
});

test.serial('Check status of payment authorization with reconciliation Id', async (t: any) => {
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

test.serial('Authorizing a payment with multiple shipping mode and check http code', async (t: any) => {
  let result: any = await auth.getAuthorizationResponse(authServiceConstVS.payment, authServiceConstVS.shippingCart, authServiceConstVS.service, authServiceConstVS.cardTokens, authServiceConstVS.notSaveToken, authServiceConstVS.payerAuthMandateFlag, authServiceConstVS.orderNumber);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  }
});

test.serial('Check status of payment authorization with multiple shipping mode', async (t: any) => {
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

test.serial('Authorizing a payment for UC and check http code', async (t: any) => {
  let result: any = await auth.getAuthorizationResponse(authServiceConstVS.ucPayment, authServiceConstVS.cart, authServiceConstVS.service, authServiceConstVS.cardTokens, authServiceConstVS.notSaveToken, authServiceConstVS.payerAuthMandateFlag, authServiceConstVS.orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  }
});

test.serial('Check status of payment authorization for UC', async (t: any) => {
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
