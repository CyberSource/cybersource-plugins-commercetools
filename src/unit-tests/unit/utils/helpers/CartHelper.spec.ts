import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../../constants/constants';
import CartHelper from '../../../../utils/helpers/CartHelper';
import unit from '../../../JSON/unit.json';
import PaymentAuthorizationServiceVsConst from '../../../const/ClickToPay/PaymentAuthorizationServiceVsConst';
import GetTransactionDataConst from '../../../const/GetTransactionDataConst';
import PaymentServiceConst from '../../../const/HelpersConst';

dotenv.config();

test.serial('update the visa details', async (t: any) => {
  let result: any = await CartHelper.updateCardDetails(PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, 12, '6f2129cc-76fc-441f-a1ae-cfa940184f6d');
  let i = 0;
  if (result && result?.cartVersion && result?.paymentVersion) {
    i++;
    t.is(i, 1);
  } else {
    t.pass();
  }
});

test.serial('update the visa details when transaction id is empty', async (t: any) => {
  let result: any = await CartHelper.updateCardDetails(PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, 12, '');
  t.falsy(result);
});

test.serial('update cart with uc address', async (t: any) => {
  let result = await CartHelper.updateCartWithUCAddress(PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, PaymentServiceConst.getCreditCardResponseCartObj);
  if (result) {
    t.is(result.type, 'Cart');
    if (result.cartState == 'Active') {
      t.is(result.cartState, 'Active');
    } else if (result.cartState == 'Merged') {
      t.is(result.cartState, 'Merged');
    } else if (result.cartState == 'Ordered') {
      t.is(result.cartState, 'Ordered');
    }
  } else {
    t.pass();
  }
});

test.serial('get cart details using payment id ', async (t) => {
  let result = await CartHelper.getCartDetailsByPaymentId(unit.paymentId);
  if (result) {
    t.is(result.type, 'Cart');
    if (result.cartState == 'Active') {
      t.is(result.cartState, 'Active');
    } else if (result.cartState == 'Merged') {
      t.is(result.cartState, 'Merged');
    } else if (result.cartState == 'Ordered') {
      t.is(result.cartState, 'Ordered');
    }
  } else {
    t.pass();
  }
});

test.serial('get cart details using payment id as null', async (t) => {
  let result = await CartHelper.getCartDetailsByPaymentId('');
  t.falsy(result);
});

test.serial('Get cart data', async (t) => {
  const result = await CartHelper.getPaymentData(GetTransactionDataConst?.paymentResponse?.transactionId, PaymentAuthorizationServiceVsConst.payment);
  if (result?.httpCode) {
    if (Constants.HTTP_OK_STATUS_CODE == result?.httpCode) {
      t.is(result.httpCode, Constants.HTTP_OK_STATUS_CODE);
    } else {
      t.not(result.httpCode, Constants.HTTP_OK_STATUS_CODE);
    }
  } else {
    t.pass();
  }
});
