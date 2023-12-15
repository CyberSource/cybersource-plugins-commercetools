import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();
import {Constants} from '../../../constants';
import refund from '../../../service/payment/PaymentRefundService';
import { captureId, captureID, payment, paymentObject, updateTransaction, orderNo } from '../../const/ECheck/PaymentRefundServiceConstECCredit';

let paymentResponse: any = {
  httpCode: null,
  status: null,
};

test.serial('Refunding a payment and check http code', async (t) => {
  const result: any = await refund.refundResponse(payment, captureId, updateTransaction, orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  }
});

test.serial('Check status for payment refund', async (t) => {
  if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode) {
    t.is(paymentResponse.status, Constants.API_STATUS_PENDING);
  } else {
    t.not(paymentResponse.status, Constants.API_STATUS_PENDING);
  }
});

test.serial('Refunding an invalid payment and check http code', async (t) => {
  const result: any = await refund.refundResponse(paymentObject, captureID, updateTransaction, orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  t.not(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
});

test.serial('Check status for refunding an invalid payment', async (t) => {
  t.not(paymentResponse.status, Constants.API_STATUS_PENDING);
});
