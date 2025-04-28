import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../constants/paymentConstants';
import getCardByInstrumentId from '../../../service/payment/GetCardByInstrumentId';
import PaymentServiceConst from '../../const/HelpersConst';

dotenv.config();

test.serial('Test get instrument id response', async (t) => {
  try {
    let response = await getCardByInstrumentId.getCardByInstrumentResponse(PaymentServiceConst.processTokensInstrumentIdentifier, process.env.PAYMENT_GATEWAY_MERCHANT_ID as any);
    if (Constants.HTTP_OK_STATUS_CODE === response.httpCode) {
      t.is(response.httpCode, 200);
    } else {
      t.fail(`Unexpected error: instrument id ${response.httpCode}`);
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

test.serial('Test get instrument id response with invalid instrument identifier', async (t) => {
  try {
    let response = await getCardByInstrumentId.getCardByInstrumentResponse('123', process.env.PAYMENT_GATEWAY_MERCHANT_ID as any);
    if (Constants.HTTP_NOT_FOUND_STATUS_CODE === response.httpCode) {
      t.not(response.httpCode, Constants.HTTP_OK_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: instrument id with invalid instrument identifier ${response.httpCode}`);
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

test.serial('Test get instrument id response with empty instrument identifier', async (t) => {
  try {
    let response = await getCardByInstrumentId.getCardByInstrumentResponse('', process.env.PAYMENT_GATEWAY_MERCHANT_ID as any);
    if (Constants.HTTP_OK_STATUS_CODE !== response.httpCode) {
      t.not(response.httpCode, Constants.HTTP_OK_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: instrument id with empty instrument identifier ${response.httpCode}`);
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
