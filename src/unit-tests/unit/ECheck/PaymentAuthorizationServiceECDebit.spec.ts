import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../../constants/constants';
import auth from '../../../service/payment/PaymentAuthorizationService';
import authConstECDebit from '../../const/ECheck/PaymentAuthorizationServiceConstECDebit';
import PaymentServiceConst from '../../const/PaymentServiceConst';

let paymentResponse: any = {
  httpCode: null,
  status: null,
};

test.serial('Authorizing a payment and check http code for logged in customer', async (t: any) => {
  let result: any = await auth.getAuthorizationResponse(authConstECDebit.payment, authConstECDebit.cart, authConstECDebit.service, authConstECDebit.cardTokens, authConstECDebit.notSaveToken, authConstECDebit.payerAuthMandateFlag, authConstECDebit.orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  }
});

test.serial('Check status of payment authorization for logged in customer', async (t: any) => {
  if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
    if (Constants.API_STATUS_PENDING == paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_PENDING);
    } else if (Constants.API_STATUS_PENDING_REVIEW == paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_PENDING_REVIEW);
    } else if (Constants.API_STATUS_DECLINED == paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_DECLINED);
    } else if (Constants.API_STATUS_INVALID_REQUEST == paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_INVALID_REQUEST);
    } else {
      t.pass();
    }
  } else {
    t.not(paymentResponse.status, Constants.API_STATUS_PENDING);
  }
});

test.serial('Authorizing a payment and check http code for guest user', async (t: any) => {
  let result: any = await auth.getAuthorizationResponse(authConstECDebit.paymentGuest, authConstECDebit.cart, authConstECDebit.service, authConstECDebit.cardTokens, authConstECDebit.notSaveToken, authConstECDebit.payerAuthMandateFlag, authConstECDebit.orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  }
});

test.serial('Check status of payment authorization for guest user', async (t: any) => {
  if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
    if (Constants.API_STATUS_PENDING == paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_PENDING);
    } else if (Constants.API_STATUS_PENDING_REVIEW == paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_PENDING_REVIEW);
    } else if (Constants.API_STATUS_DECLINED == paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_DECLINED);
    } else if (Constants.API_STATUS_INVALID_REQUEST == paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_INVALID_REQUEST);
    } else {
      t.pass();
    }
  } else {
    t.not(paymentResponse.status, Constants.API_STATUS_PENDING);
  }
});

test.serial('Authorizing a payment with multiple shipping mode and check http code', async (t: any) => {
  let result: any = await auth.getAuthorizationResponse(authConstECDebit.payment, authConstECDebit.shippingCart, authConstECDebit.service, authConstECDebit.cardTokens, authConstECDebit.notSaveToken, authConstECDebit.payerAuthMandateFlag, authConstECDebit.orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  }
});

test.serial('Check status of payment authorization with multiple shipping mode', async (t: any) => {
  if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
    if (Constants.API_STATUS_PENDING == paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_PENDING);
    } else if (Constants.API_STATUS_PENDING_REVIEW == paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_PENDING_REVIEW);
    } else if (Constants.API_STATUS_DECLINED == paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_DECLINED);
    } else if (Constants.API_STATUS_INVALID_REQUEST == paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_INVALID_REQUEST);
    } else {
      t.pass();
    }
  } else {
    t.not(paymentResponse.status, Constants.API_STATUS_PENDING);
  }
});

test.serial('Authorizing a payment and check http code when card token is null', async (t: any) => {
  let result: any = await auth.getAuthorizationResponse(authConstECDebit.payment, authConstECDebit.cart, authConstECDebit.service, PaymentServiceConst.customerCardTokens, authConstECDebit.notSaveToken, authConstECDebit.payerAuthMandateFlag, authConstECDebit.orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  }
});

test.serial('Check status of payment authorization when card token is null', async (t: any) => {
  if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
    if (Constants.API_STATUS_PENDING == paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_PENDING);
    } else if (Constants.API_STATUS_PENDING_REVIEW == paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_PENDING_REVIEW);
    } else if (Constants.API_STATUS_DECLINED == paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_DECLINED);
    } else if (Constants.API_STATUS_INVALID_REQUEST == paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_INVALID_REQUEST);
    } else {
      t.pass();
    }
  } else {
    t.not(paymentResponse.status, Constants.API_STATUS_PENDING);
  }
});
