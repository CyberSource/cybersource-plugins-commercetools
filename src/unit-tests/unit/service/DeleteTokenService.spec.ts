import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../constants/paymentConstants';
import deleteToken from '../../../service/payment/DeleteTokenService';
import DeleteTokenServiceConst from '../../const/DeleteTokenServiceConst';

dotenv.config();
let result: any = {
  httpCode: null,
  deletedToken: null,
  message: null,
};

test.serial('Deleting a token and check http code', async (t: any) => {
  try {
    let response: any = await deleteToken.deleteCustomerToken(DeleteTokenServiceConst.customerTokenObj as any);
    result.httpCode = response.httpCode;
    if (Constants.HTTP_SUCCESS_NO_CONTENT_STATUS_CODE == result.httpCode) {
      t.is(result.httpCode, Constants.HTTP_SUCCESS_NO_CONTENT_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: Deleting a token ${result.httpCode}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Deleting a token with invalid token value and check http code', async (t: any) => {
  try {
    let response: any = await deleteToken.deleteCustomerToken(DeleteTokenServiceConst.customerInvalidTokenObj as any);
    result.httpCode = response.httpCode;
    if (Constants.HTTP_SUCCESS_NO_CONTENT_STATUS_CODE !== result.httpCode) {
      t.not(result.httpCode, Constants.HTTP_SUCCESS_NO_CONTENT_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: Deleting a token with invalid token ${result.httpCode}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Deleting a token with invalid payment token value and check http code', async (t: any) => {
  try {
    let response: any = await deleteToken.deleteCustomerToken(DeleteTokenServiceConst.customerInvalidPaymentTokenObj as any);
    result.httpCode = response.httpCode;
    if (Constants.HTTP_SUCCESS_NO_CONTENT_STATUS_CODE !== result.httpCode) {
      t.not(result.httpCode, Constants.HTTP_SUCCESS_NO_CONTENT_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: Deleting a token with invalid payment token ${result.httpCode}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Deleting a token when token value and payment token is empty', async (t: any) => {
  try {
    DeleteTokenServiceConst.customerInvalidTokenObj.paymentToken = '';
    DeleteTokenServiceConst.customerInvalidPaymentTokenObj.value = '';
    let response: any = await deleteToken.deleteCustomerToken(DeleteTokenServiceConst.customerInvalidTokenObj);
    result.httpCode = response.httpCode;
    if (Constants.HTTP_SUCCESS_NO_CONTENT_STATUS_CODE !== result.httpCode) {
      t.not(result.httpCode, Constants.HTTP_SUCCESS_NO_CONTENT_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: Deleting a token with invalid payment token ${result.httpCode}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});