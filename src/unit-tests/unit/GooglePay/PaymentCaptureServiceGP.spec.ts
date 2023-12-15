import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();
import { authID, authId, payment, orderNo, orderNumber, updateTransactions } from '../../const/GooglePay/PaymentCaptureServiceConstGP';
import captureResponse from '../../../service/payment/PaymentCaptureService';
import {Constants} from '../../../constants';

let paymentResponse: any = {
  httpCode: null,
  status: null,
};

let paymentResponseObject: any = {
  httpCode: null,
  status: null,
};

test.serial('Capturing a payment and check http code', async (t) => {
  const result: any = await captureResponse.captureResponse(payment, updateTransactions, authID, orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  }
});

test.serial('Check status for payment capture', async (t) => {
  if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode) {
    t.is(paymentResponse.status, Constants.API_STATUS_PENDING);
  } else {
    t.not(paymentResponse.status, Constants.API_STATUS_PENDING);
  }
});

test.serial('Capturing an invalid payment', async (t) => {
  const result: any = await captureResponse.captureResponse(payment, updateTransactions, authId, orderNo);
  paymentResponseObject.httpCode = result.httpCode;
  paymentResponseObject.status = result.status;
  t.not(paymentResponseObject.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
});

test.serial('Check status for invalid capture ', async (t) => {
  t.not(paymentResponseObject.status, Constants.API_STATUS_PENDING);
});

test.serial('Capturing a payment with reconciliation Id and check http code', async (t) => {
  const result: any = await captureResponse.captureResponse(payment, updateTransactions, authID, orderNumber);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  }
});

test.serial('Check status for payment capture with reconciliation Id', async (t) => {
  if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode) {
    t.is(paymentResponse.status, Constants.API_STATUS_PENDING);
  } else {
    t.not(paymentResponse.status, Constants.API_STATUS_PENDING);
  }
});
