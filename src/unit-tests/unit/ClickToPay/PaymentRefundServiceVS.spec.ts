import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../../constants/paymentConstants';
import refund from '../../../service/payment/PaymentRefundService';
import refundConstAP from '../../const/ClickToPay/PaymentRefundServiceVsConst';

let paymentResponse: any = {
  httpCode: null,
  status: null,
};

let paymentResponseObject: any = {
  httpCode: null,
  status: null,
};

test.serial('Refunding a payment and check http code', async (t: any) => {
  try {
    let result: any = await refund.getRefundData(
      refundConstAP.payment as any,
      refundConstAP.captureId,
      refundConstAP.updateTransactions,
      refundConstAP.orderNo
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

test.serial('Check status for payment refund', async (t: any) => {
  try {
    if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode) {
      t.is(paymentResponse.status, Constants.API_STATUS_PENDING);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponse.httpCode}, Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Refunding an invalid payment and check http code', async (t: any) => {
  try {
    let result: any = await refund.getRefundData(
      refundConstAP.payment as any,
      refundConstAP.captureID,
      refundConstAP.updateTransactions,
      refundConstAP.orderNo
    );
    paymentResponseObject.httpCode = result.httpCode;
    paymentResponseObject.status = result.status;
    if (Constants.HTTP_BAD_REQUEST_STATUS_CODE === paymentResponseObject.httpCode) {
      t.is(paymentResponseObject.httpCode, Constants.HTTP_BAD_REQUEST_STATUS_CODE);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponseObject.httpCode}, Status: ${paymentResponseObject.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Check status of an invalid refund', async (t: any) => {
  try {
    if (Constants.API_STATUS_PENDING !== paymentResponseObject.status) {
      t.not(paymentResponseObject.status, Constants.API_STATUS_PENDING);
    } else {
      t.fail(`Unexpected Status: ${paymentResponseObject.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Refunding a payment with reconciliation Id and check http code', async (t: any) => {
  try {
    let result: any = await refund.getRefundData(
      refundConstAP.payment as any,
      refundConstAP.captureId,
      refundConstAP.updateTransactions,
      refundConstAP.orderNumber
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

test.serial('Check status for payment refund with reconciliation Id', async (t: any) => {
  try {
    if (Constants.HTTP_SUCCESS_STATUS_CODE === paymentResponse.httpCode) {
      t.is(paymentResponse.status, Constants.API_STATUS_PENDING);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponse.httpCode}, Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Refunding a payment with empty capture id and check http code', async (t: any) => {
  try {
    let result: any = await refund.getRefundData(
      refundConstAP.payment as any,
      '',
      refundConstAP.updateTransactions,
      refundConstAP.orderNo
    );
    paymentResponseObject.httpCode = result.httpCode;
    paymentResponseObject.status = result.status;
    if (Constants.HTTP_CODE_ZERO === paymentResponseObject.httpCode) {
      t.is(paymentResponseObject.httpCode, Constants.HTTP_CODE_ZERO);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponseObject.httpCode}, Status: ${paymentResponseObject.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Check status of a refund with empty capture id', async (t: any) => {
  try {
    if (Constants.API_STATUS_PENDING !== paymentResponseObject.status) {
      t.not(paymentResponseObject.status, Constants.API_STATUS_PENDING);
    } else {
      t.fail(`Unexpected Status: ${paymentResponseObject.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});