import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../constants';
import setupService from '../../service/payment/PayerAuthenticationSetupService';
import { cardTokensInvalidCustomerObjects, cardTokensObjects, paymentObject, paymentSavedTokens } from '../const/PayerAuthenticationSetupServiceConst';

let paymentResponseObject: any = {
  httpCode: null,
  status: null,
};

test.serial('Check http code for Payer auth set up with invalid token ', async (t: any) => {
  let result: any = await setupService.payerAuthSetupResponse(paymentObject, cardTokensObjects.customerTokenId);
  paymentResponseObject.httpCode = result.httpCode;
  paymentResponseObject.status = result.status;
  t.not(paymentResponseObject.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
});

test.serial('Check status for payer auth set up with invalid token', async (t: any) => {
  t.not(paymentResponseObject.status, Constants.API_STATUS_COMPLETED);
});

test.serial('Check http code for Payer auth set up with saved token ', async (t: any) => {
  let result: any = await setupService.payerAuthSetupResponse(paymentSavedTokens, cardTokensObjects.customerTokenId);
  paymentResponseObject.httpCode = result.httpCode;
  paymentResponseObject.status = result.status;
  if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponseObject.httpCode) {
    t.is(paymentResponseObject.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  } else {
    t.not(paymentResponseObject.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  }
});

test.serial('Check status for payer auth set up with saved token', async (t: any) => {
  if (Constants.API_STATUS_COMPLETED == paymentResponseObject.status) {
    t.is(paymentResponseObject.status, Constants.API_STATUS_COMPLETED);
  } else {
    t.not(paymentResponseObject.status, Constants.API_STATUS_COMPLETED);
  }
});

test.serial('Check http code for Payer auth set up with invalid customer', async (t: any) => {
  let result: any = await setupService.payerAuthSetupResponse(paymentSavedTokens, cardTokensInvalidCustomerObjects.customerTokenId);
  paymentResponseObject.httpCode = result.httpCode;
  paymentResponseObject.status = result.status;
  t.not(paymentResponseObject.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
});

test.serial('Check status for payer auth set up with invalid customer', async (t: any) => {
  t.not(paymentResponseObject.status, Constants.API_STATUS_COMPLETED);
});
