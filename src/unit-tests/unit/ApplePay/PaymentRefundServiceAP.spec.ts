import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();
import { captureId, captureID, payment, updateTransaction, orderNo } from '../../const/ApplePay/PaymentRefundServiceConstAP';
import {Constants} from '../../../constants';
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
  if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  }
});

test.serial('Check status for payment refund ', async (t) => {
  if (paymentResponse.httpCode == 201) {
    t.is(paymentResponse.status, Constants.API_STATUS_PENDING);
  } else {
    t.not(paymentResponse.status, Constants.API_STATUS_PENDING);
  }
});

test.serial('Refunding an invalid payment and check http code', async (t) => {
  const result: any = await refundResponse.refundResponse(payment, captureID, updateTransaction, orderNo);
  paymentResponseObject.httpCode = result.httpCode;
  paymentResponseObject.status = result.status;
  t.not(paymentResponseObject.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
});

test.serial('Check status for invalid refund ', async (t) => {
  t.not(paymentResponseObject.status, Constants.API_STATUS_PENDING);
});
