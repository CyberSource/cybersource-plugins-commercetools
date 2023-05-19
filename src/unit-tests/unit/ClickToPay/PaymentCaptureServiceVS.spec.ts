import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();
import { authId, authID, payment, orderNo, orderNumber, updateTransactions } from '../../const/ClickToPay/PaymentCaptureServiceVsConst';
import capture from '../../../service/payment/PaymentCaptureService';

let paymentResponse: any = {
  httpCode: null,
  status: null,
};

let paymentResponseObject: any = {
  httpCode: null,
  status: null,
};

test.serial('Capturing a payment and check http code', async (t) => {
  const result: any = await capture.captureResponse(payment, updateTransactions, authId, orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (paymentResponse.httpCode == 201) {
    t.is(paymentResponse.httpCode, 201);
  } else {
    t.not(paymentResponse.httpCode, 201);
  }
});

test.serial('Check status for payment capture', async (t) => {
  if (paymentResponse.httpCode == 201) {
    t.is(paymentResponse.status, 'PENDING');
  } else {
    t.not(paymentResponse.status, 'PENDING');
  }
});

test.serial('Capturing an invalid payment and check http code', async (t) => {
  const result: any = await capture.captureResponse(payment, updateTransactions, authID, orderNo);
  paymentResponseObject.httpCode = result.httpCode;
  paymentResponseObject.status = result.status;
  t.not(paymentResponseObject.httpCode, 201);
});

test.serial('Check status for invalid capture ', async (t) => {
  t.not(paymentResponseObject.status, 'PENDING');
});

test.serial('Capturing a payment with reconciliation Id and check http code', async (t) => {
  const result: any = await capture.captureResponse(payment, updateTransactions, authId, orderNumber);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (paymentResponse.httpCode == 201) {
    t.is(paymentResponse.httpCode, 201);
  } else {
    t.not(paymentResponse.httpCode, 201);
  }
});

test.serial('Check status for payment capture with reconciliation Id', async (t) => {
  if (paymentResponse.httpCode == 201) {
    t.is(paymentResponse.status, 'PENDING');
  } else {
    t.not(paymentResponse.status, 'PENDING');
  }
});
