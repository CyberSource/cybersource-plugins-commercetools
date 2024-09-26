import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import getCaptureContext from '../../../service/payment/CaptureContextService';
import CaptureContextServiceConst from '../../const/CaptureContextServiceConst';
import PaymentAuthorizationServiceConstCC from '../../const/CreditCard/PaymentAuthorizationServiceConstCC';

test.serial('Check type of retrieved capture context for checkout page', async (t: any) => {
  let result = await getCaptureContext.generateCaptureContext(PaymentAuthorizationServiceConstCC.cart, CaptureContextServiceConst.country, CaptureContextServiceConst.locale, CaptureContextServiceConst.currencyCode, CaptureContextServiceConst.merchantId, CaptureContextServiceConst.service);
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
  let result = await getCaptureContext.generateCaptureContext(null, CaptureContextServiceConst.country, CaptureContextServiceConst.locale, CaptureContextServiceConst.currencyCode, CaptureContextServiceConst.merchantId, CaptureContextServiceConst.service);
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
  let result = await getCaptureContext.generateCaptureContext(PaymentAuthorizationServiceConstCC.cart, CaptureContextServiceConst.country, CaptureContextServiceConst.locale, CaptureContextServiceConst.currencyCode, CaptureContextServiceConst.merchantId, CaptureContextServiceConst.myAccount);
  t.is(typeof result, 'string');
  let i = 0;
  if (result) {
    i++;
    t.is(i, 1);
  } else {
    t.is(i, 0);
  }
});
