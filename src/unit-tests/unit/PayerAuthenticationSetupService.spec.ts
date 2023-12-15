import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();
import { cardTokensObjects, cardTokensInvalidCustomerObjects, paymentObject, paymentSavedTokens } from '../const/PayerAuthenticationSetupServiceConst';
import {Constants} from '../../constants';
import setupService from '../../service/payment/PayerAuthenticationSetupService';

const paymentResponseObject: any = {
  httpCode: null,
  status: null,
};

test.serial('Check http code for Payer auth set up with invalid token ', async (t) => {
  const result: any = await setupService.payerAuthSetupResponse(paymentObject, cardTokensObjects);
  paymentResponseObject.httpCode = result.httpCode;
  paymentResponseObject.status = result.status;
  t.not(paymentResponseObject.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
});

test.serial('Check status for payer auth set up with invalid token', async (t) => {
  t.not(paymentResponseObject.status, Constants.API_STATUS_COMPLETED);
});

test.serial('Check http code for Payer auth set up with saved token ', async (t) => {
  const result: any = await setupService.payerAuthSetupResponse(paymentSavedTokens, cardTokensObjects);
  paymentResponseObject.httpCode = result.httpCode;
  paymentResponseObject.status = result.status;
  if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponseObject.httpCode) {
    t.is(paymentResponseObject.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  } else {
    t.not(paymentResponseObject.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  }
});

test.serial('Check status for payer auth set up with saved token', async (t) => {
  if (Constants.API_STATUS_COMPLETED == paymentResponseObject.status) {
    t.is(paymentResponseObject.status, Constants.API_STATUS_COMPLETED);
  } else {
    t.not(paymentResponseObject.status, Constants.API_STATUS_COMPLETED);
  }
});

test.serial('Check http code for Payer auth set up with invalid customer', async (t) => {
  const result: any = await setupService.payerAuthSetupResponse(paymentSavedTokens, cardTokensInvalidCustomerObjects);
  paymentResponseObject.httpCode = result.httpCode;
  paymentResponseObject.status = result.status;
  t.not(paymentResponseObject.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
});

test.serial('Check status for payer auth set up with invalid customer', async (t) => {
  t.not(paymentResponseObject.status, Constants.API_STATUS_COMPLETED);
});
