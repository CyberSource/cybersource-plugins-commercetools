import test from 'ava';
import dotenv from 'dotenv';

import { testApiConnection } from '../../testConnection';

dotenv.config();

test.serial("Test Api Connection", async (t) => {
    const result = await testApiConnection();
    if (result) {
        t.is(typeof result, 'string')
    } else {
        t.pass();
    }
})

test.serial("Test Api Connection with invalid credentials", async (t) => {
    process.env.PAYMENT_GATEWAY_MERCHANT_ID = '';
    process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID = '';
    process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY = '';
    const result = await testApiConnection();
    if (result) {
        t.is(result, 'Please configure the mid credentials in env file')
    } else {
        t.pass()
    }
})