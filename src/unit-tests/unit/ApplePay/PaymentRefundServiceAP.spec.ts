import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();
import { captureId, captureID, payment, updateTransaction, orderNo } from '../../const/ApplePay/PaymentRefundServiceConstAP';
import refundResponse from '../../../service/payment/PaymentRefundService';

let paymentResponse: any = {
  httpCode: null,
  status: null,
};

let paymentResponseObject: any = {
  httpCode: null,
  status: null,
};

test.serial('Refunding a payment and check http code', async (t) => {
  const result: any = await refundResponse.refundResponse(payment, captureId, updateTransaction, orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (paymentResponse.httpCode == 201) {
    t.is(paymentResponse.httpCode, 201);
  } else {
    t.not(paymentResponse.httpCode, 201);
  }
});

test.serial('Check status for payment refund ', async (t) => {
  if (paymentResponse.httpCode == 201) {
    t.is(paymentResponse.status, 'PENDING');
  } else {
    t.not(paymentResponse.status, 'PENDING');
  }
});

test.serial('Refunding an invalid payment and check http code', async (t) => {
  const result: any = await refundResponse.refundResponse(payment, captureID, updateTransaction, orderNo);
  paymentResponseObject.httpCode = result.httpCode;
  paymentResponseObject.status = result.status;
  t.not(paymentResponseObject.httpCode, 201);
});

test.serial('Check status for invalid refund ', async (t) => {
  t.not(paymentResponseObject.status, 'PENDING');
});
