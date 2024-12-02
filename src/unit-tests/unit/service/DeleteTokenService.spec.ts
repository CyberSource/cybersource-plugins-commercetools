import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../../constants/constants';
import deleteToken from '../../../service/payment/DeleteTokenService';
import DeleteTokenServiceConst from '../../const/DeleteTokenServiceConst';

let result: any = {
  httpCode: null,
  deletedToken: null,
  message: null,
};

test.serial('Deleting a token and check http code', async (t: any) => {
  let response: any = await deleteToken.deleteCustomerToken(DeleteTokenServiceConst.customerTokenObj);
  result.httpCode = response.httpCode;
  if (Constants.HTTP_SUCCESS_NO_CONTENT_STATUS_CODE == result.httpCode) {
    t.is(result.httpCode, Constants.HTTP_SUCCESS_NO_CONTENT_STATUS_CODE);
  } else {
    t.not(result.httpCode, Constants.HTTP_SUCCESS_NO_CONTENT_STATUS_CODE);
  }
});

test.serial('Deleting a token with invalid token value and check http code', async (t: any) => {
  let response: any = await deleteToken.deleteCustomerToken(DeleteTokenServiceConst.customerInvalidTokenObj);
  result.httpCode = response.httpCode;
  t.not(result.httpCode, Constants.HTTP_SUCCESS_NO_CONTENT_STATUS_CODE);
});

test.serial('Deleting a token with invalid payment token value and check http code', async (t: any) => {
  let response: any = await deleteToken.deleteCustomerToken(DeleteTokenServiceConst.customerInvalidPaymentTokenObj);
  result.httpCode = response.httpCode;
  t.not(result.httpCode, Constants.HTTP_SUCCESS_NO_CONTENT_STATUS_CODE);
});

test.serial('Deleting a token when token value and payment token is empty', async (t: any) => {
  DeleteTokenServiceConst.customerInvalidTokenObj.paymentToken = '';
  DeleteTokenServiceConst.customerInvalidPaymentTokenObj.value = '';
  let response: any = await deleteToken.deleteCustomerToken(DeleteTokenServiceConst.customerInvalidTokenObj);
  result.httpCode = response.httpCode;
  t.not(result.httpCode, Constants.HTTP_SUCCESS_NO_CONTENT_STATUS_CODE);
});
