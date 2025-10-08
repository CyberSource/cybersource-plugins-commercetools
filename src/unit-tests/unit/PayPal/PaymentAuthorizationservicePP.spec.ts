import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../constants/paymentConstants';
import authorizationResponse from '../../../service/payment/PaymentAuthorizationService';
import authServiceConstPP from '../../const/PayPal/PaymentAuthorizationServiceConstPP';

dotenv.config();
let paymentResponse: any = {
  httpCode: null,
  transactionId: null,
  status: null,
  message: null,
  data: null,
};

test.serial('Authorizing a payment and check http code', async (t: any) => {
  try {
    let result: any = await authorizationResponse.getAuthorizationResponse(
      authServiceConstPP.payment as any,
      authServiceConstPP.cart as any,
      authServiceConstPP.service as any,
      authServiceConstPP.cardTokens.intentsId as any,
      authServiceConstPP.notSaveToken as any,
      authServiceConstPP.payerAuthMandateFlag as any,
      authServiceConstPP.orderNo as any,
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

test.serial('Check status of payment authorization', async (t: any) => {
  try {
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
    } else if ("FAILED" === paymentResponse.status) {
      t.is(paymentResponse.status, "FAILED");
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponse.httpCode}, Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Authorizing a payment using invalid requestId and check http code', async (t: any) => {
  try {
    let result: any = await authorizationResponse.getAuthorizationResponse(
      authServiceConstPP.payments as any,
      authServiceConstPP.cart as any,
      authServiceConstPP.service as any,
      authServiceConstPP.cardTokens as any,
      authServiceConstPP.notSaveToken as any,
      authServiceConstPP.payerAuthMandateFlag as any,
      authServiceConstPP.orderNo as any,
    );
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;

    t.assert(
      paymentResponse.httpCode === Constants.HTTP_BAD_REQUEST_STATUS_CODE ||
      paymentResponse.httpCode === Constants.HTTP_SERVER_ERROR_STATUS_CODE,
      `Test failed! Received HTTP code: ${paymentResponse.httpCode}, expected 400 or 500`
    );
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Check status of payment authorization using invalid token', async (t: any) => {
  let i = 0;
  try {
    if (
      Constants.API_STATUS_AUTHORIZED == paymentResponse.status ||
      Constants.API_STATUS_DECLINED == paymentResponse.status ||
      Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW == paymentResponse.status ||
      Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == paymentResponse.status
    ) {
      i++;
    }
    t.is(i, 0);
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Authorizing a payment for guest user and check http code', async (t: any) => {
  try {
    let result: any = await authorizationResponse.getAuthorizationResponse(
      authServiceConstPP.guestPayment as any,
      authServiceConstPP.cart as any,
      authServiceConstPP.service as any,
      authServiceConstPP.cardTokens.intentsId as any,
      authServiceConstPP.notSaveToken as any,
      authServiceConstPP.payerAuthMandateFlag as any,
      authServiceConstPP.orderNo as any,
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
      t.fail(`Unexpected Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Authorizing a payment with reconciliation Id and check http code', async (t: any) => {
  try {
    let result: any = await authorizationResponse.getAuthorizationResponse(
      authServiceConstPP.payment as any,
      authServiceConstPP.cart as any,
      authServiceConstPP.service as any,
      authServiceConstPP.cardTokens.intentsId as any,
      authServiceConstPP.notSaveToken as any,
      authServiceConstPP.payerAuthMandateFlag as any,
      authServiceConstPP.orderNumber as any,
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

test.serial('Check status of payment authorization with reconciliation Id', async (t: any) => {
  try {
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
      t.fail(`Unexpected Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Authorizing a payment with multiple shipping mode and check http code', async (t: any) => {
  try {
    let result: any = await authorizationResponse.getAuthorizationResponse(
      authServiceConstPP.payment as any,
      authServiceConstPP.shippingCart as any,
      authServiceConstPP.service as any,
      authServiceConstPP.cardTokens.intentsId as any,
      authServiceConstPP.notSaveToken as any,
      authServiceConstPP.payerAuthMandateFlag as any,
      authServiceConstPP.orderNumber as any,
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
      t.fail(`Unexpected Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});
