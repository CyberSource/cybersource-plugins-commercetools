import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../constants/paymentConstants';
import getTransactionData from '../../../service/payment/GetTransactionData';
import PaymentAuthorizationServiceVsConst from '../../const/ClickToPay/PaymentAuthorizationServiceVsConst';
import GetTransactionDataConst from '../../const/GetTransactionDataConst';

dotenv.config();
let visaCheckoutData: any = {
  httpCode: null,
};

test.serial('Get click to pay data and check http code', async (t: any) => {
  try {
    let response: any = await getTransactionData.getTransactionData(GetTransactionDataConst?.paymentResponse?.transactionId, PaymentAuthorizationServiceVsConst.payment as any, null);
    visaCheckoutData.httpCode = response.httpCode;
    if (Constants.HTTP_OK_STATUS_CODE == visaCheckoutData.httpCode) {
      t.is(visaCheckoutData.httpCode, Constants.HTTP_OK_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: click to pay data' ${visaCheckoutData.httpCode}`);
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

test.serial('Get click to pay data for invalid order and check http code', async (t: any) => {
  try {
    let response: any = await getTransactionData.getTransactionData(GetTransactionDataConst?.paymentResponses?.transactionId, PaymentAuthorizationServiceVsConst.payment as any, null);
    visaCheckoutData.httpCode = response.httpCode;
    if (Constants.HTTP_OK_STATUS_CODE !== visaCheckoutData.httpCode) {
      t.not(visaCheckoutData.httpCode, Constants.HTTP_OK_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: click to pay data for invalid order' ${visaCheckoutData.httpCode}`);
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

test.serial('Get click to pay data with empty payment response and check http code', async (t: any) => {
  try {
    let response: any = await getTransactionData.getTransactionData('', PaymentAuthorizationServiceVsConst.payment as any, null);
    visaCheckoutData.httpCode = response.httpCode;
    if (0 === visaCheckoutData.httpCode) {
      t.is(visaCheckoutData.httpCode, 0);
    } else {
      t.fail(`Unexpected error: click to pay data with empty payment response' ${visaCheckoutData.httpCode}`);
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
