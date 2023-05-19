import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();
import unit from '../JSON/unit.json';
import paymentHandler from '../../utils/PaymentHandler';
import { updateCardHandlerCustomerId, updateCardHandlerTokens, updateCardHandlerCustomerObj } from '../const/PaymentHandlerConst';
import { orderManagementHandlerPaymentId, orderManagementHandlerUpdateTransactions, orderManagementHandlerRefundUpdateTransactions } from '../const/PaymentHandlerConst';
import { applePaySessionHandlerFields } from '../const/PaymentHandlerConst';
import {authorizationHandlerAPUpdatePaymentObject, authorizationHandlerECUpdatePaymentObject, authorizationHandler3DSUpdatePaymentObject, authorizationHandlerCCUpdatePaymentObject, authoriationHandlerGPUpdatePaymentObject, authorizationHandlerVSUpdatePaymentObject, authorizationHandlerUpdateTransactions} from '../const/PaymentHandlerConst';
import { getPayerAuthEnrollResponseUpdatePaymentObj } from '../const/PaymentHandlerConst';
import { getPayerAuthReversalHandlerUpdatePaymentObject, getPayerAuthReversalHandlerPaymentResponse, getPayerAuthReversalHandlerUpdateTransactions, getPayerAuthReversalHandlerUpdateActions, getPayerAuthValidateResponseUpdatePaymentObj } from '../const/PaymentHandlerConst';
import CommercetoolsApi from '../../utils/api/CommercetoolsApi';

test.serial('Check for report handller ', async (t) => {
  const result = await paymentHandler.reportHandler();
  if (result.error == 'There were no payment details found to update') {
    t.is(result.error, 'There were no payment details found to update');
    t.is(result.message, '');
  } else if (result.message == 'Successfully completed DecisionSync') {
    t.is(result.message, 'Successfully completed DecisionSync');
    t.is(result.error, '');
  } else {
    t.is(result.error, 'Please enable Decision sync');
    t.is(result.message, '');
  }
});

test.serial('Get update card handller data', async (t) => {
  const result = await paymentHandler.updateCardHandler(updateCardHandlerTokens, updateCardHandlerCustomerId, updateCardHandlerCustomerObj);
  if (result) {
    t.is(result.actions[0].action, 'setCustomType');
  } else {
    t.pass();
  }
});

test.serial('Get order management handller for capture ', async (t) => {
  const orderManagementHandlerUpdatePaymentObj = await CommercetoolsApi.retrievePayment(unit.paymentId);
  const result = await paymentHandler.orderManagementHandler(orderManagementHandlerPaymentId, orderManagementHandlerUpdatePaymentObj, orderManagementHandlerUpdateTransactions);
  if (result.errors[0].code == 'InvalidInput') {
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
});

test.serial('Get order management handller for refund ', async (t) => {
  const orderManagementHandlerUpdatePaymentObj = await CommercetoolsApi.retrievePayment(unit.paymentId);
  const result = await paymentHandler.orderManagementHandler(orderManagementHandlerPaymentId, orderManagementHandlerUpdatePaymentObj, orderManagementHandlerRefundUpdateTransactions);
  if (result.errors[0].code == 'InvalidInput') {
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
});

test.serial('Get apple Pay Session Handler response ', async (t) => {
  const result = await paymentHandler.applePaySessionHandler(applePaySessionHandlerFields);
  if (result.actions.length == 0) {
    t.is(result.errors[0].code, 'InvalidInput');
  } else {
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_applePaySessionData');
  }
});

test.serial('get authorization handller for google pay', async (t) => {
  const result = await paymentHandler.authorizationHandler(authoriationHandlerGPUpdatePaymentObject, authorizationHandlerUpdateTransactions);
  if (result.actions[0] == undefined) {
    t.deepEqual(result.actions, []);
  } else {
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
  }
});

test.serial('get authorization handller for click to pay', async (t) => {
  const result = await paymentHandler.authorizationHandler(authorizationHandlerVSUpdatePaymentObject, authorizationHandlerUpdateTransactions);
  if (result.actions[0] == undefined) {
    t.deepEqual(result.actions, []);
  } else {
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
  }
});

test.serial('get authorization handller for credit card', async (t) => {
  const result = await paymentHandler.authorizationHandler(authorizationHandlerCCUpdatePaymentObject, authorizationHandlerUpdateTransactions);
  if (result.actions[0] == undefined) {
    t.deepEqual(result.actions, []);
  } else {
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
  }
});

test.serial('get authorization handller for payer auth', async (t) => {
  const result = await paymentHandler.authorizationHandler(authorizationHandler3DSUpdatePaymentObject, authorizationHandlerUpdateTransactions);
  if (result.actions[0] == undefined) {
    t.deepEqual(result.actions, []);
  } else {
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
  }
});

test.serial('get authorization handller for apple pay', async (t) => {
  const result = await paymentHandler.authorizationHandler(authorizationHandlerAPUpdatePaymentObject, authorizationHandlerUpdateTransactions);
  if (result.actions[0] == undefined) {
    t.deepEqual(result.actions, []);
  } else {
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
  }
});

test.serial('get authorization handller for eCheck', async (t) => {
  const result = await paymentHandler.authorizationHandler(authorizationHandlerECUpdatePaymentObject, authorizationHandlerUpdateTransactions);
  if (result.actions[0] == undefined) {
    t.deepEqual(result.actions, []);
  } else {
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
  }
});

test.serial('get payer auth set up response ', async (t) => {
  const result = await paymentHandler.getPayerAuthSetUpResponse(authorizationHandler3DSUpdatePaymentObject);
  if (result.actions[0] == undefined) {
    t.deepEqual(result.actions, []);
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

test.serial('Check the run sync ', async (t) => {
  const result = await paymentHandler.syncHandler();
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

test.serial('Get Payer Auth Enroll Response', async (t) => {
  const result = await paymentHandler.getPayerAuthEnrollResponse(getPayerAuthEnrollResponseUpdatePaymentObj);
  if (result.actions.length <= 0) {
    t.deepEqual(result.actions, []);
    t.is(result.errors[0].code, 'InvalidInput');
    t.is(result.errors[0].message, 'Cannot process the payment due to invalid input');
  } else {
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_payerEnrollTransactionId');
    t.is(result.actions[1].name, 'isv_payerEnrollHttpCode');
    t.is(result.actions[2].name, 'isv_payerEnrollStatus');
  }
});

test.serial('Get Payer AuthReversal Handler', async (t) => {
  const result = await paymentHandler.getPayerAuthReversalHandler(getPayerAuthReversalHandlerUpdatePaymentObject, getPayerAuthReversalHandlerPaymentResponse, getPayerAuthReversalHandlerUpdateTransactions, getPayerAuthReversalHandlerUpdateActions);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, 'Success');
});

test.serial('get Payer Auth Validate Response', async (t) => {
  const result = await paymentHandler.getPayerAuthValidateResponse(getPayerAuthValidateResponseUpdatePaymentObj);
  if (result.actions.length > 0) {
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_payerEnrollTransactionId');
    t.is(result.actions[1].name, 'isv_payerEnrollHttpCode');
    t.is(result.actions[2].name, 'isv_payerEnrollStatus');
  } else {
    t.deepEqual(result.actions, []);
    t.is(result.errors[0].code, 'InvalidInput');
  }
});
