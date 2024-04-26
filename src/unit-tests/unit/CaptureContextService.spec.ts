import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import getCaptureContext from '../../service/payment/CaptureContextService';
import { country, currencyCode, locale, merchantId, myAccount, service } from '../const/CaptureContextServiceConst';
import { cart } from '../const/CreditCard/PaymentAuthorizationServiceConstCC';

test.serial('Check type of retrieved capture context for checkout page', async (t: any) => {
  let result = await getCaptureContext.generateCaptureContext(cart, country, locale, currencyCode, merchantId, service);
  t.is(typeof result, 'string');
  let i = 0;
  if (result) {
    i++;
    t.is(i, 1);
  } else {
    t.is(i, 0);
  }
});

test.serial('Check type of retrieved capture context for checkout page with empty cart', async (t: any) => {
  let result = await getCaptureContext.generateCaptureContext(null, country, locale, currencyCode, merchantId, service);
  t.is(typeof result, 'string');
  let i = 0;
  if (result) {
    i++;
    t.is(i, 1);
  } else {
    t.is(i, 0);
  }
});

test.serial('Check type of retrieved capture context for my account setion', async (t: any) => {
  let result = await getCaptureContext.generateCaptureContext(cart, country, locale, currencyCode, merchantId, myAccount);
  t.is(typeof result, 'string');
  let i = 0;
  if (result) {
    i++;
    t.is(i, 1);
  } else {
    t.is(i, 0);
  }
});
