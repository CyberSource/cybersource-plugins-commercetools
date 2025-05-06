import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../../constants/paymentConstants';
import refund from '../../../service/payment/PaymentRefundService';
import refundConstECheck from '../../const/ECheck/PaymentRefundServiceConstECCredit';

let paymentResponse: any = {
  httpCode: null,
  status: null,
};

test.serial('Refunding a payment and check http code', async (t: any) => {
  try {
    let result: any = await refund.getRefundData(refundConstECheck.payment as any, refundConstECheck.captureId, refundConstECheck.updateTransaction, refundConstECheck.orderNo);
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

test.serial('Check status for payment refund', async (t: any) => {
  try {
    if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
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
    let result: any = await refund.getRefundData(refundConstECheck.paymentObject as any, refundConstECheck.captureID, refundConstECheck.updateTransaction, refundConstECheck.orderNo);
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    if (Constants.HTTP_BAD_REQUEST_STATUS_CODE == paymentResponse.httpCode) {
      t.is(paymentResponse.httpCode, Constants.HTTP_BAD_REQUEST_STATUS_CODE);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponse.httpCode}, Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Check status for refunding an invalid payment', async (t: any) => {
  try {
    if (Constants.API_STATUS_PENDING != paymentResponse.status) {
      t.not(paymentResponse.status, Constants.API_STATUS_PENDING);
    } else {
      t.fail(`Unexpected Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Refunding a payment with empty capture id and check http code', async (t: any) => {
  try {
    let result: any = await refund.getRefundData(refundConstECheck.paymentObject as any, '', refundConstECheck.updateTransaction, refundConstECheck.orderNo);
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    if (Constants.HTTP_CODE_ZERO === paymentResponse.httpCode) {
      t.is(paymentResponse.httpCode, Constants.HTTP_CODE_ZERO);
    } else {
      t.fail(`Unexpected response: HTTP ${paymentResponse.httpCode}, Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Check status for refund when capture id is empty', async (t: any) => {
  try {
    if (Constants.API_STATUS_PENDING != paymentResponse.status) {
      t.not(paymentResponse.status, Constants.API_STATUS_PENDING);
    } else {
      t.fail(`Unexpected Status: ${paymentResponse.status}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});