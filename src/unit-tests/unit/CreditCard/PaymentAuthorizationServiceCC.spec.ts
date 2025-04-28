import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../constants/paymentConstants';
import auth from '../../../service/payment/PaymentAuthorizationService';
import authServiceConstCC from '../../const/CreditCard/PaymentAuthorizationServiceConstCC';

dotenv.config();
let paymentResponse: any = {
  httpCode: null,
  status: null,
};

test.serial('Authorizing a payment and check http code', async (t: any) => {
  try {
    let result: any = await auth.getAuthorizationResponse(
      authServiceConstCC.payment as any,
      authServiceConstCC.cart as any,
      authServiceConstCC.service as any,
      authServiceConstCC.cardTokens as any,
      authServiceConstCC.notSaveToken as any,
      authServiceConstCC.payerAuthMandateFlag as any,
      authServiceConstCC.orderNo as any,
    );
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode) {
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
    if (Constants.API_STATUS_AUTHORIZED === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
    } else if (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW);
    } else if (Constants.API_STATUS_DECLINED === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_DECLINED);
    } else if (Constants.API_STATUS_AUTHORIZED_RISK_DECLINED === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED_RISK_DECLINED);
    } else if (Constants.API_STATUS_INVALID_REQUEST === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_INVALID_REQUEST);
    } else {
      t.fail(`Unexpected Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Authorizing a payment using saved card and check http code', async (t: any) => {
  try {
    let result: any = await auth.getAuthorizationResponse(
      authServiceConstCC.payments as any,
      authServiceConstCC.cart as any,
      authServiceConstCC.service as any,
      authServiceConstCC.cardTokens as any,
      authServiceConstCC.notSaveToken as any,
      authServiceConstCC.payerAuthMandateFlag as any,
      authServiceConstCC.orderNo as any,
    );
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode) {
      t.is(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponse.httpCode}, Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Check status of payment authorization using saved card', async (t: any) => {
  try {
    if (Constants.API_STATUS_AUTHORIZED === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
    } else if (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW);
    } else if (Constants.API_STATUS_DECLINED === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_DECLINED);
    } else if (Constants.API_STATUS_AUTHORIZED_RISK_DECLINED === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED_RISK_DECLINED);
    } else if (Constants.API_STATUS_INVALID_REQUEST === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_INVALID_REQUEST);
    } else {
      t.fail(`Unexpected Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Authorizing a payment using saved card with invalid customer and check http code', async (t: any) => {
  try {
    let result: any = await auth.getAuthorizationResponse(
      authServiceConstCC.payments as any,
      authServiceConstCC.cart as any,
      authServiceConstCC.service as any,
      authServiceConstCC.cardTokensObject as any,
      authServiceConstCC.notSaveToken as any,
      authServiceConstCC.payerAuthMandateFlag as any,
      authServiceConstCC.orderNo as any,
    );
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    if (Constants.HTTP_BAD_REQUEST_STATUS_CODE === paymentResponse.httpCode) {
      t.is(paymentResponse.httpCode, Constants.HTTP_BAD_REQUEST_STATUS_CODE);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponse.httpCode}, Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Check status of payment authorization with invalid customer', async (t: any) => {
  try {
    let i = 0;
    if (
      Constants.API_STATUS_AUTHORIZED === paymentResponse.status ||
      Constants.API_STATUS_DECLINED === paymentResponse.status ||
      Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW === paymentResponse.status ||
      Constants.API_STATUS_AUTHORIZED_RISK_DECLINED === paymentResponse.status
    ) {
      i++;
    }
    t.is(i, 0);
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Authorizing a payment using invalid saved card', async (t: any) => {
  try {
    let result: any = await auth.getAuthorizationResponse(
      authServiceConstCC.payments as any,
      authServiceConstCC.cart as any,
      authServiceConstCC.service as any,
      authServiceConstCC.cardTokenInvalidObject as any,
      authServiceConstCC.notSaveToken as any,
      authServiceConstCC.payerAuthMandateFlag as any,
      authServiceConstCC.orderNo as any,
    );
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    if (Constants.HTTP_BAD_REQUEST_STATUS_CODE === paymentResponse.httpCode) {
      t.is(paymentResponse.httpCode, Constants.HTTP_BAD_REQUEST_STATUS_CODE);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponse.httpCode}, Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Check status of payment authorization with invalid saved token', async (t: any) => {
  let i = 0;
  try {
    let result: any = await auth.getAuthorizationResponse(
      authServiceConstCC.payments as any,
      authServiceConstCC.cart as any,
      authServiceConstCC.service as any,
      authServiceConstCC.cardTokenInvalidObject as any,
      authServiceConstCC.notSaveToken as any,
      authServiceConstCC.payerAuthMandateFlag as any,
      authServiceConstCC.orderNo as any,
    );
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    if (
      Constants.API_STATUS_AUTHORIZED === paymentResponse.status ||
      Constants.API_STATUS_DECLINED === paymentResponse.status ||
      Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW === paymentResponse.status ||
      Constants.API_STATUS_AUTHORIZED_RISK_DECLINED === paymentResponse.status
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
    let result: any = await auth.getAuthorizationResponse(
      authServiceConstCC.guestPayment as any,
      authServiceConstCC.cart as any,
      authServiceConstCC.service as any,
      authServiceConstCC.guestCardTokens as any,
      authServiceConstCC.notSaveToken as any,
      authServiceConstCC.payerAuthMandateFlag as any,
      authServiceConstCC.orderNo as any,
    );
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode) {
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
    if (Constants.API_STATUS_AUTHORIZED === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
    } else if (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW);
    } else if (Constants.API_STATUS_DECLINED === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_DECLINED);
    } else if (Constants.API_STATUS_AUTHORIZED_RISK_DECLINED === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED_RISK_DECLINED);
    } else if (Constants.API_STATUS_INVALID_REQUEST === paymentResponse.status) {
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
    let result: any = await auth.getAuthorizationResponse(
      authServiceConstCC.payment as any,
      authServiceConstCC.cart as any,
      authServiceConstCC.service as any,
      authServiceConstCC.cardTokens as any,
      authServiceConstCC.notSaveToken as any,
      authServiceConstCC.payerAuthMandateFlag as any,
      authServiceConstCC.orderNumber as any,
    );
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode) {
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
    if (Constants.API_STATUS_AUTHORIZED === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
    } else if (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW);
    } else if (Constants.API_STATUS_DECLINED === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_DECLINED);
    } else if (Constants.API_STATUS_AUTHORIZED_RISK_DECLINED === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED_RISK_DECLINED);
    } else if (Constants.API_STATUS_INVALID_REQUEST === paymentResponse.status) {
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
    let result: any = await auth.getAuthorizationResponse(
      authServiceConstCC.payment as any,
      authServiceConstCC.shippingCart as any,
      authServiceConstCC.service as any,
      authServiceConstCC.cardTokens as any,
      authServiceConstCC.notSaveToken as any,
      authServiceConstCC.payerAuthMandateFlag as any,
      authServiceConstCC.orderNumber as any,
    );
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode) {
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
    if (Constants.API_STATUS_AUTHORIZED === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
    } else if (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW);
    } else if (Constants.API_STATUS_DECLINED === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_DECLINED);
    } else if (Constants.API_STATUS_AUTHORIZED_RISK_DECLINED === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED_RISK_DECLINED);
    } else if (Constants.API_STATUS_INVALID_REQUEST === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_INVALID_REQUEST);
    } else {
      t.fail(`Unexpected Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Authorizing a payment for UC and check http code', async (t: any) => {
  try {
    let result: any = await auth.getAuthorizationResponse(
      authServiceConstCC.ucPayment as any,
      authServiceConstCC.cart as any,
      authServiceConstCC.service as any,
      authServiceConstCC.cardTokens as any,
      authServiceConstCC.notSaveToken as any,
      authServiceConstCC.payerAuthMandateFlag as any,
      authServiceConstCC.orderNo as any,
    );
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode) {
      t.is(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponse.httpCode}, Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Check status of payment authorization for UC', async (t: any) => {
  try {
    if (Constants.API_STATUS_AUTHORIZED === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
    } else if (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW);
    } else if (Constants.API_STATUS_DECLINED === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_DECLINED);
    } else if (Constants.API_STATUS_AUTHORIZED_RISK_DECLINED === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED_RISK_DECLINED);
    } else if (Constants.API_STATUS_INVALID_REQUEST === paymentResponse.status) {
      t.is(paymentResponse.status, Constants.API_STATUS_INVALID_REQUEST);
    } else {
      t.fail(`Unexpected Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});