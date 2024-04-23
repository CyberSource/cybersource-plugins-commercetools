import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import paymentUpdateJson from '../../resources/payment_update_extension.json';
import customExtensions from '../../utils/config/CustomExtensions';

test.serial('sync extensions ', async (t) => {
  let result = await customExtensions.syncExtensions(paymentUpdateJson);
  t.pass();
  t.is(typeof result, 'boolean');
});

test.serial('sync extensions with object is null', async (t) => {
  let result = await customExtensions.syncExtensions(null);
  t.is(typeof result, 'boolean');
});

test.serial('sync extensions with object is empty', async (t) => {
  let result = await customExtensions.syncExtensions('');
  t.is(typeof result, 'boolean');
});

test.serial('sync extensions with incorrect object', async (t) => {
  let result = await customExtensions.syncExtensions(123);
  t.is(typeof result, 'boolean');
});
