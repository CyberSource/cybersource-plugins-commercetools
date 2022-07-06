/* eslint-disable import/order */
/* eslint-disable functional/immutable-data */
import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();
import { authID, authId, cart, payment , orderNo, orderNumber} from '../../const/GooglePay/PaymentCaptureServiceConstGP';
import captureResponse from '../../../service/payment/PaymentCaptureService'; 

let paymentResponse = {
  httpCode: null,
  status: null,
};

let paymentResponseObject = {
  httpCode: null,
  status: null,
};

test.serial('Capturing a payment and check http code', async (t) => {
  const result: any = await captureResponse.captureResponse(payment, cart, authID, orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  t.is(paymentResponse.httpCode, 201);
}); 

test.serial('Check status for payment capture', async (t) => {
  t.is(paymentResponse.status, 'PENDING');
});

test.serial('Capturing an invalid payment', async (t) => {
  const result: any = await captureResponse.captureResponse(payment, cart, authId, orderNo);
  paymentResponseObject.httpCode = result.httpCode;
  paymentResponseObject.status = result.status;
  t.not(paymentResponseObject.httpCode, 201);
}); 

test.serial('Check status for invalid capture ', async (t) => {
  t.not(paymentResponseObject.status, 'PENDING');
});

test.serial('Capturing a payment with reconciliation Id and check http code', async (t) => {
  const result: any = await captureResponse.captureResponse(payment, cart, authID, orderNumber);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  t.is(paymentResponse.httpCode, 201);
}); 

test.serial('Check status for payment capture with reconciliation Id', async (t) => {
  t.is(paymentResponse.status, 'PENDING');
});
