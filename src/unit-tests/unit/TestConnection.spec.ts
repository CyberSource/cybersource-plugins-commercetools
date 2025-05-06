import test from 'ava';
import dotenv from 'dotenv';

import { testApiConnection } from '../../testConnection';

dotenv.config();

test.serial('Test Api Connection', async (t) => {
  try {
    const result = await testApiConnection();
    if (result) {
      t.is(typeof result, 'string');
    } else {
      t.fail(`Unexpected type: Test Api Connection ${typeof result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Test Api Connection with invalid credentials', async (t) => {
  try {
    process.env.PAYMENT_GATEWAY_MERCHANT_ID = '';
    process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID = '';
    process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY = '';
    const result = await testApiConnection();
    if (result) {
      t.is(result, 'Please configure the mid credentials in env file');
    } else {
      t.fail(`Unexpected type: Test Api Connection with invalid credentials ${typeof result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});
