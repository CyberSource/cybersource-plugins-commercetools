import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();
import addTokenService from '../../service/payment/AddTokenService';
import { addTokenResponseCustomerId, addTokenResponseCustomerObj, addTokenResponseAddress, addTokenResponseCardTokens } from '../const/AddTokenServiceConst';
import {Constants} from '../../constants';

var paymentResponse: any = {
  httpCode: null,
  status: null,
};

test.serial('Get response of add token and check http code', async (t) => {
  const result: any = await addTokenService.addTokenResponse(addTokenResponseCustomerId, addTokenResponseCustomerObj, addTokenResponseAddress, addTokenResponseCardTokens);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if (Constants.HTTP_CODE_TWO_HUNDRED_ONE == paymentResponse.httpCode) {
    t.is(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  } else {
    t.not(paymentResponse.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_ONE);
  }
});

test.serial('Get response of add token and check status', async (t) => {
  if (Constants.API_STATUS_AUTHORIZED == paymentResponse.status) {
    t.is(paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
  } else {
    t.not(paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
  }
});
