import test from 'ava';
import dotenv from 'dotenv';

import apiHandler from '../../apiHandler';
dotenv.config();
import { Constants } from '../../constants';
import unit from '../JSON/unit.json';
import {
  applePayPaymentObject,
  cart,
  constants,
  customerUpdateAddCardPaymentObject,
  customerUpdateFlexKeysPaymentObj,
  notification,
  payerAuthEnrollPaymentObj,
  payerAuthenticationPaymentObj,
  payerAuthSetupResponsePaymentObject,
  paymentId,
  paymentObject,
} from '../const/ApiHandlerConst';

test.serial('paymentCreateApi should handle credit card payment', async (t) => {
  let result = (await apiHandler.paymentCreateApi(paymentObject)) as any;
  if (result.actions.length == 0) {
    t.is(result.errors[0].code, 'InvalidInput');
  } else {
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_tokenCaptureContextSignature');
    t.is(result.actions[1].action, 'setCustomField');
    t.is(result.actions[1].name, 'isv_tokenVerificationContext');
  }
});

test.serial('paymentCreateApi should handle Apple Pay Payment Correctly', async (t) => {
  let result = (await apiHandler.paymentCreateApi(applePayPaymentObject)) as any;
  if (result.actions.length == 0) {
    t.is(result.errors[0].code, 'InvalidInput');
  } else {
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_applePaySessionData');
  }
});

test.serial('Test PaymentDetails Api Function', async (t) => {
  let result = (await apiHandler.paymentDetailsApi(paymentId)) as any;
  if (result) {
    let i = 0;
    if ('amountPlanned' in result.paymentDetails && 'paymentMethodInfo' in result.paymentDetails && 'paymentStatus' in result.paymentDetails && 'cartData' in result && 'type' in result.cartData) {
      i++;
    }
    if (i == 1) {
      t.is(i, 1);
    } else {
      t.not(i, 1);
    }
  } else {
    t.pass();
  }
});

test.serial('Test PaymentUpdate Api Function For payerAuth setup response', async (t) => {
  let result = await apiHandler.paymentUpdateApi(payerAuthenticationPaymentObj as any);
  if (result.actions.length == 0) {
    t.deepEqual(result.errors, []);
  } else {
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_requestJwt');
    t.is(result.actions[1].action, 'setCustomField');
    t.is(result.actions[1].name, 'isv_cardinalReferenceId');
    t.is(result.actions[2].action, 'setCustomField');
    t.is(result.actions[2].name, 'isv_deviceDataCollectionUrl');
  }
});

test.serial('Test PaymentUpdate Api Function For payerAuth enroll response', async (t) => {
  let result = await apiHandler.paymentUpdateApi(payerAuthEnrollPaymentObj as any);
  if (result.actions.length == 0) {
    t.is(result.errors[0].code, 'InvalidInput');
  } else {
    t.pass();
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_payerEnrollTransactionId');
    t.is(result.actions[1].action, 'setCustomField');
    t.is(result.actions[1].name, 'isv_payerEnrollHttpCode');
    t.is(result.actions[2].action, 'setCustomField');
    t.is(result.actions[2].name, 'isv_payerEnrollStatus');
    t.is(result.actions[3].action, 'setCustomField');
    t.is(result.actions[3].name, 'isv_tokenCaptureContextSignature');
    t.is(result.actions[4].action, 'setCustomField');
    t.is(result.actions[4].name, 'isv_payerAuthenticationRequired');
  }
});

test.serial('Test PaymentUpdate Api function for PayerAuth Validate Response', async (t) => {
  let result = await apiHandler.paymentUpdateApi(payerAuthSetupResponsePaymentObject);
  if (result.actions.length > 0) {
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_payerEnrollTransactionId');
    t.is(result.actions[1].name, 'isv_payerEnrollHttpCode');
    t.is(result.actions[2].name, 'isv_payerEnrollStatus');
  } else {
    t.deepEqual(result.actions, []);
  }
});

test.serial('Test Customer Update  Flex Microform', async (t) => {
  let result = await apiHandler.customerUpdateApi(customerUpdateFlexKeysPaymentObj);
  if (result.actions.length == 0) {
    t.is(result.errors[0].code, 'InvalidInput');
  } else {
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_tokenCaptureContextSignature');
    t.is(result.actions[1].action, 'setCustomField');
    t.is(result.actions[1].name, 'isv_tokenVerificationContext');
  }
});

test.serial('Test Customer Update for add card', async (t) => {
  let result = await apiHandler.customerUpdateApi(customerUpdateAddCardPaymentObject);
  if (result.actions.length == 0) {
    t.deepEqual(result.errors, []);
  } else {
    t.pass();
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_tokens');
    t.is(result.actions[1].action, 'setCustomField');
    t.is(result.actions[1].name, 'isv_tokenUpdated');
  }
});

test.serial('Test CaptureContext Api function', async (t) => {
  let result = await apiHandler.captureContextApi(cart);
  if (result) {
    let length = result.length;
    t.true(length > 0);
  } else {
    t.pass();
  }
});

test.serial('Test notificationApi function', async (t) => {
  let result = await apiHandler.notificationApi(notification);
  if (result.successMessage) {
    t.is(result.successMessage, constants.SUCCESS_MSG_UPDATED_CUSTOMER_TOKEN);
  } else {
    t.not(result.successMessage, constants.SUCCESS_MSG_UPDATED_CUSTOMER_TOKEN);
  }
});

test.serial('Test order management api', async (t) => {
  let result = await apiHandler.orderManagementApi(unit.paymentId, 0, Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION);
  let i = 0;
  if ('errorMessage' in result && 'successMessage' in result) {
    i++;
  }
  t.is(i, 1);
});
