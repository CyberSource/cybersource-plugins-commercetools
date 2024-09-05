import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../../constants/constants';
import refund from '../../../service/payment/PaymentRefundService';
import refundConstECheck from '../../const/ECheck/PaymentRefundServiceConstECCredit';

let paymentResponse: any = {
  httpCode: null,
  status: null,
};

test.serial('Refunding a payment and check http code', async (t: any) => {
  let result: any = await refund.getRefundData(refundConstECheck.payment, refundConstECheck.captureId, refundConstECheck.updateTransaction, refundConstECheck.orderNo);
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
  let result: any = await refund.getRefundData(refundConstECheck.paymentObject, refundConstECheck.captureID, refundConstECheck.updateTransaction, refundConstECheck.orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  t.not(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
});

test.serial('Check status for refunding an invalid payment', async (t: any) => {
  t.not(paymentResponse.status, Constants.API_STATUS_PENDING);
});

test.serial('Refunding a payment- with empty capture id and check http code', async (t: any) => {
  let result: any = await refund.getRefundData(refundConstECheck.paymentObject, '', refundConstECheck.updateTransaction, refundConstECheck.orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  t.not(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
});

test.serial('Check status for refund when capture id is  empty', async (t: any) => {
  t.not(paymentResponse.status, Constants.API_STATUS_PENDING);
});
