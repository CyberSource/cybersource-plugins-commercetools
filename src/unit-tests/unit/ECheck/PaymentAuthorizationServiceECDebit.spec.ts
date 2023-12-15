import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();
import { cart, cardTokens, payment, paymentGuest, service, dontSaveTokenFlag, payerAuthMandateFlag, orderNo, shippingCart } from '../../const/ECheck/PaymentAuthorizationServiceConstECDebit';
import auth from '../../../service/payment/PaymentAuthorizationService';
import {Constants} from '../../../constants';

let paymentResponse: any = {
  httpCode: null,
  status: null,
};

test.serial('Authorizing a payment and check http code for logged in customer', async (t) => {
  const result: any = await auth.authorizationResponse(payment, cart, service, cardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  }
});

test.serial('Check status of payment authorization for logged in customer', async (t) => {
  if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode) {
    if (Constants.API_STATUS_PENDING == paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_PENDING);
    } else if (Constants.API_STATUS_DECLINED == paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_DECLINED);
    }
  } else {
    t.not(paymentResponse.status, Constants.API_STATUS_PENDING);
  }
});

test.serial('Authorizing a payment and check http code for guest user', async (t) => {
  const result: any = await auth.authorizationResponse(paymentGuest, cart, service, cardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNo)
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  }
});

test.serial('Check status of payment authorization for guest user', async (t) => {
  if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode) {
    if (Constants.API_STATUS_PENDING == paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_PENDING);
    } else if (Constants.API_STATUS_DECLINED == paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_DECLINED);
    }
  } else {
    t.not(paymentResponse.status, Constants.API_STATUS_PENDING);
  }
});

test.serial('Authorizing a payment with multiple shipping mode and check http code', async (t) => {
  const result: any = await auth.authorizationResponse(payment, shippingCart, service, cardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  }
});

test.serial('Check status of payment authorization with multiple shipping mode', async (t) => {
  if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode) {
    if (Constants.API_STATUS_PENDING == paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_PENDING);
    } else if (Constants.API_STATUS_DECLINED == paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_DECLINED);
    }
  } else {
    t.not(paymentResponse.status, Constants.API_STATUS_PENDING);
  }
});
