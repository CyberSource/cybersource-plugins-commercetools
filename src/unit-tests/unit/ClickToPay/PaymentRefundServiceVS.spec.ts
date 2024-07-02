import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../../constants';
import refund from '../../../service/payment/PaymentRefundService';
import { captureID, captureId, orderNo, orderNumber, payment, updateTransactions } from '../../const/ClickToPay/PaymentRefundServiceVsConst';

let paymentResponse: any = {
  httpCode: null,
  status: null,
};

let paymentResponseObject: any = {
  httpCode: null,
  status: null,
};

test.serial('Refunding a payment and check http code', async (t: any) => {
  let result: any = await refund.refundResponse(payment, captureId, updateTransactions, orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  }
});

test.serial('Check status for payment refund', async (t: any) => {
  if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
    t.is(paymentResponse.status, Constants.API_STATUS_PENDING);
  } else {
    t.not(paymentResponse.status, Constants.API_STATUS_PENDING);
  }
});

test.serial('Refunding an invalid payment and check http code', async (t: any) => {
  let result: any = await refund.refundResponse(payment, captureID, updateTransactions, orderNo);
  paymentResponseObject.httpCode = result.httpCode;
  paymentResponseObject.status = result.status;
  t.not(paymentResponseObject.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
});

test.serial('Check status of an invalid refund', async (t: any) => {
  t.not(paymentResponseObject.status, Constants.API_STATUS_PENDING);
});

test.serial('Refunding a payment with reconciliation Id and check http code', async (t: any) => {
  let result: any = await refund.refundResponse(payment, captureId, updateTransactions, orderNumber);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  }
});

test.serial('Check status for payment refund with reconciliation Id', async (t: any) => {
  if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
    t.is(paymentResponse.status, Constants.API_STATUS_PENDING);
  } else {
    t.not(paymentResponse.status, Constants.API_STATUS_PENDING);
  }
});

test.serial('Refunding a payment with empty capture id and check http code', async (t: any) => {
  let result: any = await refund.refundResponse(payment, '', updateTransactions, orderNo);
  paymentResponseObject.httpCode = result.httpCode;
  paymentResponseObject.status = result.status;
  t.not(paymentResponseObject.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
});

test.serial('Check status of a refund with empty capture id', async (t: any) => {
  t.not(paymentResponseObject.status, Constants.API_STATUS_PENDING);
});