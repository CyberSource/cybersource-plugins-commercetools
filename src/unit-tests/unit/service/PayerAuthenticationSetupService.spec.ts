import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../constants/paymentConstants';
import setupService from '../../../service/payment/PayerAuthenticationSetupService';
import PayerAuthenticationSetupServiceConst from '../../const/PayerAuthenticationSetupServiceConst';

dotenv.config();
let paymentResponseObject: any = {
  httpCode: null,
  status: null,
};

test.serial('Check http code for Payer auth set up with invalid token', async (t: any) => {
  try {
    let result: any = await setupService.getPayerAuthSetupData(PayerAuthenticationSetupServiceConst.paymentObject as any, PayerAuthenticationSetupServiceConst.cardTokensObjects.customerTokenId);
    paymentResponseObject.httpCode = result.httpCode;
    paymentResponseObject.status = result.status;
    if (Constants.HTTP_SUCCESS_STATUS_CODE != paymentResponseObject.httpCode) {
      t.not(paymentResponseObject.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: HTTP code' ${paymentResponseObject.httpCode}`);
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

test.serial('Check status for payer auth set up with invalid token', async (t: any) => {
  try {
    if (Constants.API_STATUS_COMPLETED != paymentResponseObject.status) {
      t.not(paymentResponseObject.status, Constants.API_STATUS_COMPLETED);
    } else {
      t.fail(`Unexpected error: HTTP code' ${paymentResponseObject.status}`);
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

test.serial('Check http code for Payer auth set up with saved token', async (t: any) => {
  try {
    let result: any = await setupService.getPayerAuthSetupData(PayerAuthenticationSetupServiceConst.paymentSavedTokens, PayerAuthenticationSetupServiceConst.cardTokensObjects.customerTokenId);
    paymentResponseObject.httpCode = result.httpCode;
    paymentResponseObject.status = result.status;
    if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponseObject.httpCode) {
      t.is(paymentResponseObject.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: HTTP code' ${paymentResponseObject.httpCode}`);
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

test.serial('Check status for payer auth set up with saved token', async (t: any) => {
  try {
    if (Constants.API_STATUS_COMPLETED == paymentResponseObject.status) {
      t.is(paymentResponseObject.status, Constants.API_STATUS_COMPLETED);
    } else {
      t.fail(`Unexpected error: HTTP code' ${paymentResponseObject.status}`);
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

test.serial('Check http code for Payer auth set up with invalid customer', async (t: any) => {
  try {
    let result: any = await setupService.getPayerAuthSetupData(PayerAuthenticationSetupServiceConst.paymentSavedTokens, PayerAuthenticationSetupServiceConst.cardTokensInvalidCustomerObjects.customerTokenId);
    paymentResponseObject.httpCode = result.httpCode;
    paymentResponseObject.status = result.status;
    if (Constants.HTTP_SUCCESS_STATUS_CODE !== paymentResponseObject.httpCode) {
      t.not(paymentResponseObject.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: HTTP code' ${paymentResponseObject.httpCode}`);
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

test.serial('Check status for payer auth set up with invalid customer', async (t: any) => {
  try {
    if (Constants.API_STATUS_COMPLETED != paymentResponseObject.status) {
      t.not(paymentResponseObject.status, Constants.API_STATUS_COMPLETED);
    } else {
      t.fail(`Unexpected error: HTTP code' ${paymentResponseObject.status}`);
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

test.serial('Check http code for Payer auth set up', async (t: any) => {
  try {
    let result: any = await setupService.getPayerAuthSetupData(PayerAuthenticationSetupServiceConst.paymentSavedTokens, PayerAuthenticationSetupServiceConst.cardTokensObjects.customerTokenId);
    paymentResponseObject.httpCode = result.httpCode;
    paymentResponseObject.status = result.status;
    if (Constants.HTTP_SUCCESS_STATUS_CODE == paymentResponseObject.httpCode) {
      t.is(paymentResponseObject.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: HTTP code' ${paymentResponseObject.status}`);
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

test.serial('Check status for payer auth set up', async (t: any) => {
  try {
    if (Constants.API_STATUS_COMPLETED == paymentResponseObject.status) {
      t.is(paymentResponseObject.status, Constants.API_STATUS_COMPLETED);
    } else {
      t.fail(`Unexpected error: HTTP code' ${paymentResponseObject.status}`);
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
