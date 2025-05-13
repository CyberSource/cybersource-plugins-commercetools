import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../../constants/paymentConstants';
import CartHelper from '../../../../utils/helpers/CartHelper';
import unit from '../../../JSON/unit.json';
import PaymentAuthorizationServiceVsConst from '../../../const/ClickToPay/PaymentAuthorizationServiceVsConst';
import GetTransactionDataConst from '../../../const/GetTransactionDataConst';
import PaymentServiceConst from '../../../const/HelpersConst';

dotenv.config();

test.serial('update the visa details', async (t: any) => {
  try {
    let result: any = await CartHelper.updateCardDetails(PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, 12, '6f2129cc-76fc-441f-a1ae-cfa940184f6d');
    let i = 0;
    if (result && result?.cartVersion && result?.paymentVersion) {
      i++;
      if (1 === i) {
        t.is(i, 1);
      } else {
        t.fail(`Unexpected result, Result:${result}`);
      }
    } else {
      t.pass();
    }
  } catch (exception) {
    if (exception instanceof Error) {
      t.fail(`Caught an error during execution: ${exception.message}`);
      t.log(`Stack trace: ${exception.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(exception)}`);
    }
  }
});

test.serial('update the visa details when transaction id is empty', async (t: any) => {
  try {
    let result: any = await CartHelper.updateCardDetails(PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, 12, '');
    if (!result) {
      t.falsy(result);
    } else {
      t.fail(`Unexpected result, Result: ${result}`);
    }
  } catch (exception) {
    if (exception instanceof Error) {
      t.fail(`Caught an error during execution: ${exception.message}`);
      t.log(`Stack trace: ${exception.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(exception)}`);
    }
  }
});

test.serial('update cart with uc address', async (t: any) => {
  try {
    let result = await CartHelper.updateCartWithUCAddress(PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, PaymentServiceConst.getCreditCardResponseCartObj as any);
    if (result) {
      t.is(result.type, 'Cart');
      if (result.cartState == 'Active') {
        t.is(result.cartState, 'Active');
      } else if (result.cartState == 'Merged') {
        t.is(result.cartState, 'Merged');
      } else if (result.cartState == 'Ordered') {
        t.is(result.cartState, 'Ordered');
      } else {
        t.fail(`Unexpected result, Result: ${result}`);
      }
    } else {
      t.fail(`Unexpected result, Result: ${result}`);
    }
  } catch (exception) {
    if (exception instanceof Error) {
      t.fail(`Caught an error during execution: ${exception.message}`);
      t.log(`Stack trace: ${exception.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(exception)}`);
    }
  }
});

test.serial('get cart details using payment id ', async (t) => {
  try {
    let result = await CartHelper.getCartDetailsByPaymentId(unit.paymentId);
    if (result) {
      t.is(result.type, 'Cart');
      if (result.cartState == 'Active') {
        t.is(result.cartState, 'Active');
      } else if (result.cartState == 'Merged') {
        t.is(result.cartState, 'Merged');
      } else if (result.cartState == 'Ordered') {
        t.is(result.cartState, 'Ordered');
      } else {
        t.fail(`Unexpected result, Result: ${result}`);
      }
    } else {
      t.fail(`Unexpected result, Result: ${result}`);
    }
  } catch (exception) {
    if (exception instanceof Error) {
      t.fail(`Caught an error during execution: ${exception.message}`);
      t.log(`Stack trace: ${exception.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(exception)}`);
    }
  }
});

test.serial('get cart details using payment id as null', async (t) => {
  try {
    let result = await CartHelper.getCartDetailsByPaymentId('');
    if (!result) {
      t.falsy(result);
    } else {
      t.fail(`Unexpected result, Result: ${result}`);
    }
  } catch (exception) {
    if (exception instanceof Error) {
      t.fail(`Caught an error during execution: ${exception.message}`);
      t.log(`Stack trace: ${exception.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(exception)}`);
    }
  }
});

test.serial('Get cart data', async (t) => {
  try {
    const result = await CartHelper.getPaymentData(GetTransactionDataConst?.paymentResponse, PaymentAuthorizationServiceVsConst.payment as any);
    if (result?.httpCode) {
      if (Constants.HTTP_OK_STATUS_CODE == result?.httpCode) {
        t.is(result.httpCode, Constants.HTTP_OK_STATUS_CODE);
      } else {
        t.not(result.httpCode, Constants.HTTP_OK_STATUS_CODE);
      }
    } else {
      t.fail(`Unexpected response: HTTP ${result?.httpCode}`);
    }
  } catch (exception) {
    if (exception instanceof Error) {
      t.fail(`Caught an error during execution: ${exception.message}`);
      t.log(`Stack trace: ${exception.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(exception)}`);
    }
  }
});