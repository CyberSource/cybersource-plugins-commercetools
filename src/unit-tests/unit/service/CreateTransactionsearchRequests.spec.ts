import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../constants/paymentConstants';
import createSearchRequest from '../../../service/payment/CreateTransactionSearchRequest';
import DeleteWebhookSubscriptionConst from '../../const/DeleteWebhookSubscriptionConst';

dotenv.config();

test('Run sync', async (t: any) => {
  try {
    let midCredentials = {
      merchantId: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
      merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
      merchantSecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
    };
    let result: any = await createSearchRequest.getTransactionSearchResponse(Constants.STRING_SYNC_QUERY, 50, Constants.STRING_SYNC_SORT, midCredentials, false);
    if (Constants.HTTP_SUCCESS_STATUS_CODE === result.httpCode) {
      t.is(result.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
    } else {
      t.fail(`Unexpected error: Run sync ${result}`);
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

test('Run sync with invalid mid credentials', async (t: any) => {
  try {
    let result: any = await createSearchRequest.getTransactionSearchResponse(Constants.STRING_SYNC_QUERY, 50, Constants.STRING_SYNC_SORT, DeleteWebhookSubscriptionConst.invalidMidCredentials, false);
    if (Constants.HTTP_UNAUTHORIZED_STATUS_CODE === result.httpCode && result.data == '') {
      t.is(result.httpCode, Constants.HTTP_UNAUTHORIZED_STATUS_CODE);
      t.is(result.data, '');
    } else {
      t.fail(`Unexpected error: Run sync with invalid mid ${result}`);
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

test('Run sync with empty query', async (t: any) => {
  try {
    let result: any = await createSearchRequest.getTransactionSearchResponse('', 50, '', DeleteWebhookSubscriptionConst.emptyMidCredentials, false);
    if (0 == result.httpCode && result.data == '') {
      t.is(result.httpCode, 0);
      t.is(result.data, '');
    } else {
      t.fail(`Unexpected error: Run sync with empty query ${result}`);
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