import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../../constants/constants';
import addTokenService from '../../../service/payment/AddTokenService';
import AddTokenServiceConst from '../../const/AddTokenServiceConst';

let paymentResponse: any = {
  httpCode: null,
  status: null,
};

test.serial('Get response of add token and check http code', async (t: any) => {
  let result: any = await addTokenService.getAddTokenResponse(AddTokenServiceConst.addTokenResponseCustomerId, AddTokenServiceConst.addTokenResponseCustomerObj, AddTokenServiceConst.addTokenAddress, AddTokenServiceConst.addTokenResponseCardTokens);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  }
});

test.serial('Get response of add token and check status', async (t: any) => {
  if (Constants.API_STATUS_AUTHORIZED == paymentResponse.status) {
    t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
  } else {
    t.not(paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
  }
});

test.serial('Get response of add token with invalid customer token and check http code', async (t: any) => {
  let result: any = await addTokenService.getAddTokenResponse(AddTokenServiceConst.addTokenResponseCustomerId, AddTokenServiceConst.addTokenResponseCustomerObj, AddTokenServiceConst.addTokenAddress, AddTokenServiceConst.addTokenResponseCardTokens);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  t.not(paymentResponse.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
});

test.serial('Get response of add token with invalid customer token and check status', async (t: any) => {
  t.not(paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
});

test.serial('Get response of add token without customer id and check http code', async (t: any) => {
  let result: any = await addTokenService.getAddTokenResponse('', AddTokenServiceConst.addTokenResponseCustomerObj, AddTokenServiceConst.addTokenAddress, AddTokenServiceConst.addTokenResponseCardTokens);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  t.is(paymentResponse.httpCode, 0);
});

test.serial('Get response of add token without customer id and check status', async (t: any) => {
  t.is(paymentResponse.status, '');
});

test.serial('Get response of add token without customer address and check http code', async (t: any) => {
  let result: any = await addTokenService.getAddTokenResponse('', AddTokenServiceConst.addTokenResponseCustomerObj, AddTokenServiceConst.addTokenAddress, AddTokenServiceConst.addTokenResponseCardTokens);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  t.is(paymentResponse.httpCode, 0);
});

test.serial('Get response of add token without customer address and check status', async (t: any) => {
  t.is(paymentResponse.status, '');
});
