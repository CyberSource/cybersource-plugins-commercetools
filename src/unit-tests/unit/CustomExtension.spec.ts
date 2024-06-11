import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import customerUpdateJson from '../../resources/customer_update_extension.json';
import paymentCreateJson from '../../resources/payment_create_extension.json';
import paymentUpdateJson from '../../resources/payment_update_extension.json';
import customExtensions from '../../utils/config/CustomExtensions';

test.serial('sync extensions for payment update', async (t) => {
  let result = await customExtensions.syncExtensions(paymentUpdateJson);
  t.is(typeof result, 'boolean');
});

test.serial('sync extensions for payment create', async (t) => {
  let result = await customExtensions.syncExtensions(paymentCreateJson);
  t.is(typeof result, 'boolean');
});

test.serial('sync extensions for customer update', async (t) => {
  let result = await customExtensions.syncExtensions(customerUpdateJson);
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
