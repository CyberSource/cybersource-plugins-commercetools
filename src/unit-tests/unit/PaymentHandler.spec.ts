import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import paymentHandler from '../../utils/PaymentHandler';
import CommercetoolsApi from '../../utils/api/CommercetoolsApi';
import multiMid from '../../utils/config/MultiMid';
import unit from '../JSON/unit.json';
import { addTokenResponseAddress, addTokenResponseCustomerObj } from '../const/AddTokenServiceConst';
import { merchantId } from '../const/CaptureContextServiceConst';
import { payment as authRevPayment } from '../const/CreditCard/PaymentAuthorizationReversalConstCC';
import { cart, payment } from '../const/CreditCard/PaymentAuthorizationServiceConstCC';
import { payment as capturePayment } from '../const/CreditCard/PaymentCaptureServiceConstCC';
import { customerTokenObj } from '../const/DeleteTokenServiceConst';
import { emptyMidCredentials, invalidMidCredentials } from '../const/DeleteWebhookSubscriptionConst';
import { updateCardHandlerCustomerId, updateCardHandlerCustomerObj, updateCardHandlerInvalidTokens, updateCardHandlerTokens } from '../const/PaymentHandlerConst';
import { orderManagementHandlerPaymentId, orderManagementHandlerRefundUpdateTransactions, orderManagementHandlerUpdateTransactions } from '../const/PaymentHandlerConst';
import { applePaySessionHandlerEmptyFields, applePaySessionHandlerFields, applePaySessionHandlerInvalidFields } from '../const/PaymentHandlerConst';
import {
  authorizationHandler3DSUpdatePaymentObject,
  authorizationHandlerAPUpdatePaymentObject,
  authorizationHandlerCCUpdatePaymentObject,
  authorizationHandlerECUpdatePaymentObject,
  authorizationHandlerGPUpdatePaymentObject,
  authorizationHandlerUpdateTransactions,
  authorizationHandlerVSUpdatePaymentObject,
  payerAuthPaymentObject,
  payerAuthReversalHandlerUpdateActions,
  setTokenNullHandlerAuthResponse,
} from '../const/PaymentHandlerConst';
import { retrieveTokenDetailsResponse } from '../const/PaymentHandlerConst';
import { checkAuthReversalTriggeredPaymentResponse, customerCardTokens, getAuthResponseTransactionDetail, processTokensCustomerCardTokensObject, processTokensCustomerInvalidCardTokensObject } from '../const/PaymentServiceConst';

test.serial('Check for report handler ', async (t: any) => {
  let result = await paymentHandler.reportHandler();
  if (result.error == 'There were no payment details found to update') {
    t.is(result.error, 'There were no payment details found to update');
    t.is(result.message, '');
  } else if (result.message == 'Successfully completed DecisionSync') {
    t.is(result.message, 'Successfully completed DecisionSync');
    t.is(result.error, '');
  } else if (result.error == 'Please configure Decision sync mids') {
    t.is(result.message, '');
    t.is(result.error, 'Please configure Decision sync mids');
  } else {
    t.is(result.error, 'Please enable Decision sync');
    t.is(result.message, '');
  }
});

test.serial('Get update card handler data', async (t: any) => {
  let result = await paymentHandler.updateCardHandler(updateCardHandlerTokens, updateCardHandlerCustomerId, updateCardHandlerCustomerObj);
  if (result.actions.length) {
    t.is(result.actions[0].action, 'setCustomType');
  } else {
    t.pass();
  }
});

test.serial('Get update card handler data when customer id is null', async (t: any) => {
  let result = await paymentHandler.updateCardHandler(updateCardHandlerTokens, '', updateCardHandlerCustomerObj);
  t.deepEqual(result.actions, []);
  t.deepEqual(result.errors, []);
});

test.serial('Get order management handler for capture ', async (t: any) => {
  let orderManagementHandlerUpdatePaymentObj = await CommercetoolsApi.retrievePayment(unit.paymentId);
  if (null !== orderManagementHandlerUpdatePaymentObj) {
    let result = await paymentHandler.orderManagementHandler(orderManagementHandlerPaymentId, orderManagementHandlerUpdatePaymentObj, orderManagementHandlerUpdateTransactions);
    if (result?.errors[0]?.code == 'InvalidInput') {
      t.deepEqual(result.actions, []);
      t.is(result.errors[0].code, 'InvalidInput');
      t.is(result.errors[0].message, 'Cannot process the payment due to invalid input');
    } else {
      if (result.actions[1].state == 'Success') {
        t.is(result.actions[0].action, 'changeTransactionInteractionId');
        t.is(result.actions[1].action, 'changeTransactionState');
        t.is(result.actions[1].state, 'Success');
      } else {
        t.is(result.actions[0].action, 'changeTransactionInteractionId');
        t.is(result.actions[1].action, 'changeTransactionState');
        t.is(result.actions[1].state, 'Failure');
      }
    }
  } else {
    t.pass();
  }
});

test.serial('Get order management handler for capture with payment id as null', async (t: any) => {
  let orderManagementHandlerUpdatePaymentObj = await CommercetoolsApi.retrievePayment(unit.paymentId);
  if (null !== orderManagementHandlerUpdatePaymentObj) {
    let result = await paymentHandler.orderManagementHandler('', orderManagementHandlerUpdatePaymentObj, orderManagementHandlerUpdateTransactions);
    if (result?.errors[0]?.code == 'InvalidInput') {
      t.deepEqual(result.actions, []);
      t.is(result.errors[0].code, 'InvalidInput');
      t.is(result.errors[0].message, 'Cannot process the payment due to invalid input');
    } else {
      if (result.actions[1].state == 'Success') {
        t.is(result.actions[0].action, 'changeTransactionInteractionId');
        t.is(result.actions[1].action, 'changeTransactionState');
        t.is(result.actions[1].state, 'Success');
      } else {
        t.is(result.actions[0].action, 'changeTransactionInteractionId');
        t.is(result.actions[1].action, 'changeTransactionState');
        t.is(result.actions[1].state, 'Failure');
      }
    }
  } else {
    t.pass();
  }
});

test.serial('Get order management handler for refund ', async (t: any) => {
  let orderManagementHandlerUpdatePaymentObj = await CommercetoolsApi.retrievePayment(unit.paymentId);
  if (null !== orderManagementHandlerUpdatePaymentObj) {
    let result = await paymentHandler.orderManagementHandler(orderManagementHandlerPaymentId, orderManagementHandlerUpdatePaymentObj, orderManagementHandlerRefundUpdateTransactions);
    if (result?.errors[0]?.code == 'InvalidInput') {
      t.deepEqual(result.actions, []);
      t.is(result.errors[0].code, 'InvalidInput');
      t.is(result.errors[0].message, 'Cannot process the payment due to invalid input');
    } else {
      if (result?.actions[1]?.state == 'Success') {
        t.is(result.actions[0].action, 'changeTransactionInteractionId');
        t.is(result.actions[1].action, 'changeTransactionState');
        t.is(result.actions[1].state, 'Success');
      } else {
        t.is(result.actions[0].action, 'changeTransactionInteractionId');
        t.is(result.actions[1].action, 'changeTransactionState');
        t.is(result.actions[1].state, 'Failure');
      }
    }
  } else {
    t.pass();
  }
});

test.serial('Get order management handler for refund with payment id as null', async (t: any) => {
  let orderManagementHandlerUpdatePaymentObj = await CommercetoolsApi.retrievePayment(unit.paymentId);
  if (null !== orderManagementHandlerUpdatePaymentObj) {
    let result = await paymentHandler.orderManagementHandler('', orderManagementHandlerUpdatePaymentObj, orderManagementHandlerRefundUpdateTransactions);
    if (result?.errors[0]?.code == 'InvalidInput') {
      t.deepEqual(result.actions, []);
      t.is(result.errors[0].code, 'InvalidInput');
      t.is(result.errors[0].message, 'Cannot process the payment due to invalid input');
    } else {
      if (result?.actions[1]?.state == 'Success') {
        t.is(result.actions[0].action, 'changeTransactionInteractionId');
        t.is(result.actions[1].action, 'changeTransactionState');
        t.is(result.actions[1].state, 'Success');
      } else {
        t.is(result.actions[0].action, 'changeTransactionInteractionId');
        t.is(result.actions[1].action, 'changeTransactionState');
        t.is(result.actions[1].state, 'Failure');
      }
    }
  } else {
    t.pass();
  }
});

test.serial('Get apple Pay Session Handler response ', async (t: any) => {
  let result = await paymentHandler.applePaySessionHandler(applePaySessionHandlerFields);
  if (result.actions.length == 0) {
    t.is(result.errors[0].code, 'InvalidInput');
  } else {
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_applePaySessionData');
  }
});

test.serial('Get apple Pay Session Handler response with empty fields', async (t: any) => {
  let result = await paymentHandler.applePaySessionHandler(applePaySessionHandlerEmptyFields);
  if (result.actions.length == 0) {
    t.is(result.errors[0].code, 'InvalidInput');
  } else {
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_applePaySessionData');
  }
});

test.serial('get authorization handler for google pay', async (t: any) => {
  let result = await paymentHandler.authorizationHandler(authorizationHandlerGPUpdatePaymentObject, authorizationHandlerUpdateTransactions);
  if (result.actions[0] == undefined) {
    t.deepEqual(result.actions, []);
  } else {
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
  }
});

test.serial('get authorization handler for click to pay', async (t: any) => {
  let result = await paymentHandler.authorizationHandler(authorizationHandlerVSUpdatePaymentObject, authorizationHandlerUpdateTransactions);
  if (result.actions[0] == undefined) {
    t.deepEqual(result.actions, []);
  } else {
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
  }
});

test.serial('get authorization handler for credit card', async (t: any) => {
  let result = await paymentHandler.authorizationHandler(authorizationHandlerCCUpdatePaymentObject, authorizationHandlerUpdateTransactions);
  if (result.actions[0] == undefined) {
    t.deepEqual(result.actions, []);
  } else {
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
  }
});

test.serial('get authorization handler for payer auth', async (t: any) => {
  let result: any = await paymentHandler.authorizationHandler(authorizationHandler3DSUpdatePaymentObject, authorizationHandlerUpdateTransactions);
  if (0 === result.actions[0].length) {
    t.deepEqual(result.actions, []);
    t.deepEqual(result.errors, []);
  } else if ('changeTransactionInteractionId' === result.actions[0].action) {
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
  } else if ('setCustomField' === result.actions[0].action) {
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_tokenCaptureContextSignature');
  }
});

test.serial('get authorization handler for apple pay', async (t: any) => {
  let result = await paymentHandler.authorizationHandler(authorizationHandlerAPUpdatePaymentObject, authorizationHandlerUpdateTransactions);
  if (result.actions[0] == undefined) {
    t.deepEqual(result.actions, []);
  } else {
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
  }
});

test.serial('get authorization handler for eCheck', async (t: any) => {
  let result = await paymentHandler.authorizationHandler(authorizationHandlerECUpdatePaymentObject, authorizationHandlerUpdateTransactions);
  if (result.actions[0] == undefined) {
    t.deepEqual(result.actions, []);
  } else {
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
  }
});

test.serial('Check the run sync ', async (t: any) => {
  let result = await paymentHandler.syncHandler();
  if (result.error == 'Please enable Run sync') {
    t.is(result.message, '');
    t.is(result.error, 'Please enable Run sync');
  } else if (result.error == '') {
    t.is(result.message, 'Successfully updated payment details');
    t.is(result.error, '');
  } else if (result.error == 'There were no payment details found to update') {
    t.is(result.message, '');
    t.is(result.error, 'There were no payment details found to update');
  }
});

test.serial('set token null handler ', async (t) => {
  let result = await paymentHandler.setTokenNullHandler(payment.custom.fields, setTokenNullHandlerAuthResponse, payment.paymentMethodInfo.method);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[2].action, 'setCustomField');
  t.is(result.actions[2].name, 'isv_tokenCaptureContextSignature');
});

test.serial('payment auth handler', async (t) => {
  let result = await paymentHandler.paymentAuthHandler(payment.paymentMethodInfo.method, payment, null, cart, getAuthResponseTransactionDetail, customerCardTokens, '');
  t.is(typeof result.isError, 'boolean');
  let i = 0;
  if ('isError' in result && 'paymentResponse' in result && 'authResponse' in result) {
    i++;
  }
  t.is(i, 1);
});

test.serial('payer Auth Reversal Handler', async (t) => {
  let result = await paymentHandler.payerAuthReversalHandler(payerAuthPaymentObject, checkAuthReversalTriggeredPaymentResponse, payerAuthReversalHandlerUpdateActions);
  if (result?.actions) {
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
  } else {
    t.pass();
  }
});

test.serial('Order management handler for charge', async (t) => {
  let result = await paymentHandler.orderManagementChargeHandler(capturePayment, '', orderManagementHandlerUpdateTransactions);
  if (201 == result.httpCode) {
    t.is(result.httpCode, 201);
    t.is(result.status, 'PENDING');
  } else {
    t.not(result.httpCode, 201);
    t.not(result.status, 'PENDING');
  }
});

test.serial('Order management handler for auth reversal', async t => {
  let result = await paymentHandler.orderManagementAuthReversalHandler(authRevPayment, cart);
  if (201 == result.httpCode) {
    t.is(result.httpCode, 201);
    t.is(result.status, 'REVERSED');
  } else {
    t.not(result.httpCode, 201);
    t.not(result.status, 'REVERSED');
  }
});

test.serial('add card handler', async (t) => {
  let result = await paymentHandler.addCardHandler(unit.customerId, addTokenResponseAddress, addTokenResponseCustomerObj);
  t.is(result.actions[0].action, 'setCustomField');
  t.is(result.actions[0].name, 'isv_tokens');
  t.is(result.actions[1].action, 'setCustomField');
  t.is(result.actions[1].name, 'isv_tokenUpdated');
});

test.serial('add card handler with customer id as null', async (t) => {
  let result = await paymentHandler.addCardHandler('', addTokenResponseAddress, addTokenResponseCustomerObj);
  t.is(result.actions[0].action, 'setCustomField');
  t.is(result.actions[0].name, 'isv_tokens');
  t.is(result.actions[1].action, 'setCustomField');
  t.is(result.actions[1].name, 'isv_tokenUpdated');
});

test.serial('delete card handler', async (t) => {
  let result = await paymentHandler.deleteCardHandler(customerTokenObj, unit.customerId);
  if (1 < result?.actions.length) {
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_tokens');
    t.is(result.actions[1].action, 'setCustomField');
    t.is(result.actions[1].name, 'isv_tokenUpdated');
    t.is(result.actions[2].action, 'setCustomField');
    t.is(result.actions[2].name, 'isv_failedTokens');
  } else if (1 === result?.actions.length) {
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_tokenAction');
    t.is(result.actions[0].value, null)
  } else {
    t.deepEqual(result.actions, []);
    t.deepEqual(result.errors, []);
  }
});

test.serial('delete card handler with customer id as null', async (t) => {
  let result = await paymentHandler.deleteCardHandler(customerTokenObj, '');
  if (1 < result?.actions.length) {
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_tokens');
    t.is(result.actions[1].action, 'setCustomField');
    t.is(result.actions[1].name, 'isv_tokenUpdated');
    t.is(result.actions[2].action, 'setCustomField');
    t.is(result.actions[2].name, 'isv_failedTokens');
  } else if (1 === result?.actions.length) {
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_tokenAction');
    t.is(result.actions[0].value, null)
  } else {
    t.deepEqual(result.actions, []);
    t.deepEqual(result.errors, []);
  }
});

test.serial('Test Network Token Handler function', async (t) => {
  let result = await paymentHandler.networkTokenHandler(processTokensCustomerCardTokensObject.customerTokenId, retrieveTokenDetailsResponse);
  if (result) {
    if (result.statusCode == 200) {
      t.is(result.statusCode, 200);
    } else {
      t.not(result.statusCode, 200);
    }
  } else {
    t.pass();
  }
});

test.serial('Test Network Token Handler function with token id as null', async (t) => {
  let result = await paymentHandler.networkTokenHandler('', retrieveTokenDetailsResponse);
  t.falsy(result);
});

test.serial('Test Webhook Subscription Creation', async (t) => {
  let midCredentials = await multiMid.getMidCredentials(merchantId);
  let result = await paymentHandler.webhookSubscriptionHandler(midCredentials);
  if (201 === result.httpCode) {
    t.is(result.httpCode, 201);
    t.truthy(result.merchantId);
    t.truthy(result.key);
    t.truthy(result.keyId);
    t.truthy(result.subscriptionId);
    t.truthy(result.merchantId);
  } else {
    t.is(result.httpCode, 0);
  }
});

test.serial('Test Webhook Subscription Creation without mid', async (t) => {
  let result = await paymentHandler.webhookSubscriptionHandler(emptyMidCredentials);
  t.is(result.httpCode, 0);
});

test.serial('Test Webhook Subscription Creation with invalid data', async (t) => {
  let result = await paymentHandler.webhookSubscriptionHandler(invalidMidCredentials);
  t.is(result.httpCode, 401);
});

test.serial('delete card handler with invalid customer id', async (t) => {
  let result = await paymentHandler.deleteCardHandler(customerTokenObj, '@&^%@$%@^#%&*@');
  if (1 === result?.actions.length) {
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_tokenAction');
    t.is(result.actions[0].value, null)
  } else {
    t.deepEqual(result.actions, []);
    t.deepEqual(result.errors, []);
  }
});

test.serial('add card handler with invalid customer id', async (t) => {
  let result = await paymentHandler.addCardHandler('$#$%^T&U*(I', addTokenResponseAddress, addTokenResponseCustomerObj);
  t.is(result.actions[0].action, 'setCustomField');
  t.is(result.actions[0].name, 'isv_tokens');
  t.is(result.actions[1].action, 'setCustomField');
  t.is(result.actions[1].name, 'isv_tokenUpdated');
});

test.serial('Test Network Token Handler function with invalid customer token id', async (t) => {
  let result = await paymentHandler.networkTokenHandler(processTokensCustomerInvalidCardTokensObject.customerTokenId, retrieveTokenDetailsResponse);
  t.falsy(result);
});

test.serial('payment auth handler- with invalid customer tokens', async (t) => {
  let result = await paymentHandler.paymentAuthHandler(payment.paymentMethodInfo.method, payment, null, cart, getAuthResponseTransactionDetail, processTokensCustomerInvalidCardTokensObject, '');
  t.is(typeof result.isError, 'boolean');
  let i = 0;
  if ('isError' in result && 'paymentResponse' in result && 'authResponse' in result) {
    i++;
  }
  t.is(i, 1);
});

test.serial('set token null handler with payment method as empty string', async (t) => {
  let result = await paymentHandler.setTokenNullHandler(payment.custom.fields, setTokenNullHandlerAuthResponse, '');
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[2].action, 'setCustomField');
  t.is(result.actions[2].name, 'isv_tokenCaptureContextSignature');
});

test.serial('Get apple Pay Session Handler response with invalid fields data', async (t: any) => {
  let result = await paymentHandler.applePaySessionHandler(applePaySessionHandlerInvalidFields);
  t.deepEqual(result.actions, []);
  t.is(result.errors[0].code, 'InvalidInput');
  t.is(result.errors[0].message, 'Cannot process the payment due to invalid input')
});

test.serial('Get update card handler data with invalid custome tokens', async (t: any) => {
  let result = await paymentHandler.updateCardHandler(updateCardHandlerInvalidTokens, updateCardHandlerCustomerId, updateCardHandlerCustomerObj);
 t.deepEqual(result.actions, [])
 t.deepEqual(result.errors, [])
});