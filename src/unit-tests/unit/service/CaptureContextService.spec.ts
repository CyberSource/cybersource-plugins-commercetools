import test from 'ava';
import dotenv from 'dotenv';

import getCaptureContext from '../../../service/payment/CaptureContextService';
import CaptureContextServiceConst from '../../const/CaptureContextServiceConst';
import PaymentAuthorizationServiceConstCC from '../../const/CreditCard/PaymentAuthorizationServiceConstCC';

dotenv.config();

test.serial('Check type of retrieved capture context for checkout page', async (t: any) => {
  try {
    let result = await getCaptureContext.generateCaptureContext(
      PaymentAuthorizationServiceConstCC.cart as any,
      CaptureContextServiceConst.country as any,
      CaptureContextServiceConst.locale as any,
      CaptureContextServiceConst.currencyCode as any,
      CaptureContextServiceConst.merchantId as any,
      CaptureContextServiceConst.service as any,
    );
    if (typeof result == 'string') {
      t.is(typeof result, 'string');
    } else {
      t.fail(`Unexpected capture context: ${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Check type of retrieved capture context for checkout page with empty cart', async (t: any) => {
  try {
    let result = await getCaptureContext.generateCaptureContext(
      null,
      CaptureContextServiceConst.country as any,
      CaptureContextServiceConst.locale as any,
      CaptureContextServiceConst.currencyCode as any,
      CaptureContextServiceConst.merchantId as any,
      CaptureContextServiceConst.service as any,
    );
    if (typeof result == 'string') {
      t.is(typeof result, 'string');
    } else {
      t.fail(`Unexpected capture context: ${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Check type of retrieved capture context for my account section', async (t: any) => {
  try {
    let result = await getCaptureContext.generateCaptureContext(
      PaymentAuthorizationServiceConstCC.cart as any,
      CaptureContextServiceConst.country as any,
      CaptureContextServiceConst.locale as any,
      CaptureContextServiceConst.currencyCode as any,
      CaptureContextServiceConst.merchantId as any,
      CaptureContextServiceConst.myAccount as any,
    );
    if (typeof result == 'string') {
      t.is(typeof result, 'string');
    } else {
      t.fail(`Unexpected capture context: ${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});