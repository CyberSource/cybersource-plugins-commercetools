/* eslint-disable sort-imports */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
/* eslint-disable prefer-const */
/* eslint-disable import/order */
import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();

import { authId, authID, cart, payment, orderNo } from '../../const/ClickToPay/PaymentCaptureServiceVsConst';
import capture from '../../../service/payment/PaymentCaptureService'; 

let paymentResponse = {
  httpCode: null,
  status: null,
};

let paymentResponseObject = {
  httpCode: null,
  status: null,
};

test.serial('Capturing a payment and check http code', async (t) => {
  const result: any = await capture.captureResponse(payment, cart, authId, orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  t.is(paymentResponse.httpCode, 201);
}); 

test.serial('Check status for payment capture', async (t) => {
  t.is(paymentResponse.status, 'PENDING');
});

test.serial('Capturing an invalid payment and check http code', async (t) => {
  const result: any = await capture.captureResponse(payment, cart, authID, orderNo);
  paymentResponseObject.httpCode = result.httpCode;
  paymentResponseObject.status = result.status;
  t.not(paymentResponseObject.httpCode, 201);
}); 

test.serial('Check status for invalid capture ', async (t) => {
  t.not(paymentResponseObject.status, 'PENDING');
});
