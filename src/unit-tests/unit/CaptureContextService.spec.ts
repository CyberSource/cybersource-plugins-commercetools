import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();
import getCaptureContext from '../../service/payment/CaptureContextService';
import { country, currencyCode, locale, merchantId, myAccount, service } from '../const/CaptureContextServiceConst';
import { cart } from '../const/CreditCard/PaymentAuthorizationServiceConstCC';

test.serial('Check type of retrieved capture context for checkout page', async (t) => {
    const result = await getCaptureContext.generateCaptureContext(cart, country, locale, currencyCode, merchantId, service);
    var i = 0;
    if ('string' == typeof result) {
        i++;
    }
    t.is(i, 1);
});

test.serial('Check type of retrieved capture context for my account setion', async (t) => {
    const result = await getCaptureContext.generateCaptureContext(cart, country, locale, currencyCode, merchantId, myAccount);
    var i = 0;
    if ('string' == typeof result) {
        i++;
    }
    t.is(i, 1);
});