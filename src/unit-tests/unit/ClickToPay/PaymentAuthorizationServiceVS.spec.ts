import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../constants/paymentConstants';
import auth from '../../../service/payment/PaymentAuthorizationService';
import authServiceConstVS from '../../const/ClickToPay/PaymentAuthorizationServiceVsConst';

dotenv.config();

let paymentResponse: any = {
  httpCode: null,
  status: null,
};

test.serial('Authorizing a payment and check http code', async (t: any) => {
  try {
    let result: any = await auth.getAuthorizationResponse(
      authServiceConstVS.payment as any,
      authServiceConstVS.cart as any,
      authServiceConstVS.service,
      authServiceConstVS.cardTokens,
      authServiceConstVS.notSaveToken,
      authServiceConstVS.payerAuthMandateFlag,
      authServiceConstVS.orderNo,
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

test.serial('Authorizing a payment using invalid token', async (t: any) => {
  try {
    let result: any = await auth.getAuthorizationResponse(
      authServiceConstVS.payments as any,
      authServiceConstVS.cart as any,
      authServiceConstVS.service,
      authServiceConstVS.cardTokens,
      authServiceConstVS.notSaveToken,
      authServiceConstVS.payerAuthMandateFlag,
      authServiceConstVS.orderNo,
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

test.serial('Check status of payment authorization for invalid token', async (t: any) => {
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

test.serial('Authorizing a payment for guest user and check http code', async (t: any) => {
  try {
    let result: any = await auth.getAuthorizationResponse(
      authServiceConstVS.guestPayment as any,
      authServiceConstVS.cart as any,
      authServiceConstVS.service,
      authServiceConstVS.guestCardTokens,
      authServiceConstVS.notSaveToken,
      authServiceConstVS.payerAuthMandateFlag,
      authServiceConstVS.orderNo,
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
      authServiceConstVS.payment as any,
      authServiceConstVS.cart as any,
      authServiceConstVS.service,
      authServiceConstVS.cardTokens,
      authServiceConstVS.notSaveToken,
      authServiceConstVS.payerAuthMandateFlag,
      authServiceConstVS.orderNumber,
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
      authServiceConstVS.payment as any,
      authServiceConstVS.shippingCart as any,
      authServiceConstVS.service as any,
      authServiceConstVS.cardTokens as any,
      authServiceConstVS.notSaveToken as any,
      authServiceConstVS.payerAuthMandateFlag as any,
      authServiceConstVS.orderNumber as any,
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
      authServiceConstVS.ucPayment as any,
      authServiceConstVS.cart as any,
      authServiceConstVS.service,
      authServiceConstVS.cardTokens,
      authServiceConstVS.notSaveToken,
      authServiceConstVS.payerAuthMandateFlag,
      authServiceConstVS.orderNo,
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