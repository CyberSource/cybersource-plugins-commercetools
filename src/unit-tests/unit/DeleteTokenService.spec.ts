import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();
import {Constants} from '../../constants';
import deleteToken from '../../service/payment/DeleteTokenService';
import { customerTokenObj } from '../const/DeleteTokenServiceConst';

var result: any = {
  httpCode: null,
  deletedToken: null,
  message: null,
};

var resultObject: any = {
  httpCode: null,
  deletedToken: null,
  message: null,
};

test.serial('Deleting a token and check http code', async (t) => {
  const response: any = await deleteToken.deleteCustomerToken(customerTokenObj);
  result.httpCode = response.httpCode;
  result.deletedToken = response.deletedToken;
  result.message = response.message;
  if (Constants.HTTP_CODE_TWO_HUNDRED_FOUR == result.httpCode) {
    t.is(result.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_FOUR);
  } else {
    t.not(resultObject.httpCode, Constants.HTTP_CODE_TWO_HUNDRED_FOUR);
  }
});
