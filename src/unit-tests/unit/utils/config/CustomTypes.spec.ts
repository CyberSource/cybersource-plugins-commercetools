import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import paymentCustomJson from '../../../../resources/isv_payment_data_type.json';
import customTypes from '../../../../utils/config/CustomTypes';

test.serial('sync custom type', async (t) => {
  let result = await customTypes.syncCustomType(paymentCustomJson);
  t.is(typeof result, 'boolean');
});

test.serial('sync custom type when object is null', async (t) => {
  let result = await customTypes.syncCustomType(null);
  t.is(typeof result, 'boolean');
});

test.serial('sync custom type when object is empty', async (t) => {
  let result = await customTypes.syncCustomType('');
  t.is(typeof result, 'boolean');
});

test.serial('sync custom type when object is incorrect', async (t) => {
  let result = await customTypes.syncCustomType(123);
  t.is(typeof result, 'boolean');
});
