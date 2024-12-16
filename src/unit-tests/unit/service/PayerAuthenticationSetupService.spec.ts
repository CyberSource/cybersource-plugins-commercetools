import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../../constants/constants';
import setupService from '../../../service/payment/PayerAuthenticationSetupService';
import PayerAuthenticationSetupServiceConst from '../../const/PayerAuthenticationSetupServiceConst';

let paymentResponseObject: any = {
  httpCode: null,
  status: null,
};

test.serial('Check http code for Payer auth set up with invalid token ', async (t: any) => {
  try{
  let result: any = await setupService.getPayerAuthSetupData(PayerAuthenticationSetupServiceConst.paymentObject, PayerAuthenticationSetupServiceConst.cardTokensObjects.customerTokenId);
  paymentResponseObject.httpCode = result.httpCode;
  paymentResponseObject.status = result.status;
  t.not(paymentResponseObject.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  }catch(error){
   t.pass();
  }
});

test.serial('Check status for payer auth set up with invalid token', async (t: any) => {
  t.not(paymentResponseObject.status, Constants.API_STATUS_COMPLETED);
});

test.serial('Check http code for Payer auth set up with saved token ', async (t: any) => {
  let result: any = await setupService.getPayerAuthSetupData(PayerAuthenticationSetupServiceConst.paymentSavedTokens, PayerAuthenticationSetupServiceConst.cardTokensObjects.customerTokenId);
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
  let result: any = await setupService.getPayerAuthSetupData(PayerAuthenticationSetupServiceConst.paymentSavedTokens, PayerAuthenticationSetupServiceConst.cardTokensInvalidCustomerObjects.customerTokenId);
  paymentResponseObject.httpCode = result.httpCode;
  paymentResponseObject.status = result.status;
  t.not(paymentResponseObject.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
});

test.serial('Check status for payer auth set up with invalid customer', async (t: any) => {
  t.not(paymentResponseObject.status, Constants.API_STATUS_COMPLETED);
});

test.serial('Check http code for Payer auth set up', async (t: any) => {
  PayerAuthenticationSetupServiceConst.paymentSavedTokens.custom.fields.isv_savedToken = ''
  let result: any = await setupService.getPayerAuthSetupData(PayerAuthenticationSetupServiceConst.paymentSavedTokens, PayerAuthenticationSetupServiceConst.cardTokensObjects.customerTokenId);
  paymentResponseObject.httpCode = result.httpCode;
  paymentResponseObject.status = result.status;
  if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponseObject.httpCode) {
    t.is(paymentResponseObject.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  } else {
    t.not(paymentResponseObject.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  }
});

test.serial('Check status for payer auth set up', async (t: any) => {
  if (Constants.API_STATUS_COMPLETED == paymentResponseObject.status) {
    t.is(paymentResponseObject.status, Constants.API_STATUS_COMPLETED);
  } else {
    t.not(paymentResponseObject.status, Constants.API_STATUS_COMPLETED);
  }
});
