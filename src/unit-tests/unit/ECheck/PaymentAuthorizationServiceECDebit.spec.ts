import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../constants/paymentConstants';
import auth from '../../../service/payment/PaymentAuthorizationService';
import authConstECDebit from '../../const/ECheck/PaymentAuthorizationServiceConstECDebit';
import PaymentServiceConst from '../../const/HelpersConst';

dotenv.config();
let paymentResponse: any = {
  httpCode: null,
  status: null,
};

test.serial('Authorizing a payment and check http code for logged in customer', async (t: any) => {
  try {
    let result: any = await auth.getAuthorizationResponse(
      authConstECDebit.payment as any,
      authConstECDebit.cart as any,
      authConstECDebit.service,
      authConstECDebit.cardTokens,
      authConstECDebit.notSaveToken,
      authConstECDebit.payerAuthMandateFlag,
      authConstECDebit.orderNo
    );
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
      t.is(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponse.httpCode}, Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Check status of payment authorization for logged in customer', async (t: any) => {
  try {
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
        t.fail(`Unexpected Status: ${paymentResponse.status}`);
      }
    } else {
      t.fail(`Unexpected Code: ${paymentResponse.httpCode}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Authorizing a payment and check http code for guest user', async (t: any) => {
  try {
    let result: any = await auth.getAuthorizationResponse(
      authConstECDebit.paymentGuest as any,
      authConstECDebit.cart as any,
      authConstECDebit.service,
      authConstECDebit.cardTokens,
      authConstECDebit.notSaveToken,
      authConstECDebit.payerAuthMandateFlag,
      authConstECDebit.orderNo
    );
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
      t.is(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponse.httpCode}, Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Check status of payment authorization for guest user', async (t: any) => {
  try {
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
        t.fail(`Unexpected Status: ${paymentResponse.status}`);
      }
    } else {
      t.fail(`Unexpected Code: ${paymentResponse.httpCode}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Authorizing a payment with multiple shipping mode and check http code', async (t: any) => {
  try {
    let result: any = await auth.getAuthorizationResponse(
      authConstECDebit.payment as any,
      authConstECDebit.shippingCart as any,
      authConstECDebit.service,
      authConstECDebit.cardTokens,
      authConstECDebit.notSaveToken,
      authConstECDebit.payerAuthMandateFlag,
      authConstECDebit.orderNo
    );
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
      t.is(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponse.httpCode}, Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Check status of payment authorization with multiple shipping mode', async (t: any) => {
  try {
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
        t.fail(`Unexpected Status: ${paymentResponse.status}`);
      }
    } else {
      t.fail(`Unexpected Code: ${paymentResponse.httpCode}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Authorizing a payment and check http code when card token is null', async (t: any) => {
  try {
    let result: any = await auth.getAuthorizationResponse(
      authConstECDebit.payment as any,
      authConstECDebit.cart as any,
      authConstECDebit.service,
      PaymentServiceConst.customerCardTokens,
      authConstECDebit.notSaveToken,
      authConstECDebit.payerAuthMandateFlag,
      authConstECDebit.orderNo
    );
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
      t.is(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponse.httpCode}, Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Check status of payment authorization when card token is null', async (t: any) => {
  try {
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
        t.fail(`Unexpected Status: ${paymentResponse.status}`);
      }
    } else {
      t.fail(`Unexpected Code: ${paymentResponse.httpCode}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});