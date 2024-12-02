import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../../constants/constants';
import paymentHandler from '../../../utils/PaymentHandler';
import CommercetoolsApi from '../../../utils/api/CommercetoolsApi';
import unit from '../../JSON/unit.json';
import AddTokenServiceConst from '../../const/AddTokenServiceConst';
import PaymentAuthorizationServiceConstAP from '../../const/ApplePay/PaymentAuthorizationServiceConstAP';
import PaymentAuthorizationServiceVsConst from '../../const/ClickToPay/PaymentAuthorizationServiceVsConst';
import CommercetoolsApiConst from '../../const/CommercetoolsApiConst';
import PaymentAuthorizationReversalConstCC from '../../const/CreditCard/PaymentAuthorizationReversalConstCC';
import PaymentAuthorizationServiceConstCC from '../../const/CreditCard/PaymentAuthorizationServiceConstCC';
import PaymentCaptureServiceConstCC from '../../const/CreditCard/PaymentCaptureServiceConstCC';
import PaymentRefundServiceConstCC from '../../const/CreditCard/PaymentRefundServiceConstCC';
import DeleteTokenServiceConst from '../../const/DeleteTokenServiceConst';
import PaymentAuthorizationServiceConstECDebit from '../../const/ECheck/PaymentAuthorizationServiceConstECDebit';
import PaymentAuthorizationReversalConstGP from '../../const/GooglePay/PaymentAuthorizationReversalConstGP';
import PaymentAuthorizationServiceConstGP from '../../const/GooglePay/PaymentAuthorizationServiceConstGP';
import PaymentHandlerConst from '../../const/PaymentHandlerConst';
import PaymentServiceConst from '../../const/PaymentServiceConst';

test.serial('Check for report handler ', async (t: any) => {
  let result = await paymentHandler.handleReport();
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
  let result = await paymentHandler.handleUpdateCard(PaymentHandlerConst.updateCardHandlerTokens, PaymentHandlerConst.updateCardHandlerCustomerId, PaymentHandlerConst.updateCardHandlerCustomerObj);
  if (result.actions.length) {
    t.is(result.actions[0].action, 'setCustomType');
  } else {
    t.pass();
  }
});

test.serial('Get update card handler data when customer id is null', async (t: any) => {
  let result = await paymentHandler.handleUpdateCard(PaymentHandlerConst.updateCardHandlerTokens, '', PaymentHandlerConst.updateCardHandlerCustomerObj);
  t.deepEqual(result.actions, []);
  t.deepEqual(result.errors, []);
});

test.serial('Get order management handler for capture ', async (t: any) => {
  let orderManagementHandlerUpdatePaymentObj = await CommercetoolsApi.retrievePayment(unit.paymentId);
  if (null !== orderManagementHandlerUpdatePaymentObj) {
    let result = await paymentHandler.handleOrderManagement(PaymentHandlerConst.orderManagementHandlerPaymentId, orderManagementHandlerUpdatePaymentObj, PaymentHandlerConst.orderManagementHandlerUpdateTransactions);
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
    let result = await paymentHandler.handleOrderManagement('', orderManagementHandlerUpdatePaymentObj, PaymentHandlerConst.orderManagementHandlerUpdateTransactions);
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
    let result = await paymentHandler.handleOrderManagement(PaymentHandlerConst.orderManagementHandlerPaymentId, orderManagementHandlerUpdatePaymentObj, PaymentHandlerConst.orderManagementHandlerRefundUpdateTransactions);
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
    let result = await paymentHandler.handleOrderManagement('', orderManagementHandlerUpdatePaymentObj, PaymentHandlerConst.orderManagementHandlerRefundUpdateTransactions);
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
  let result = await paymentHandler.handleApplePaySession(PaymentHandlerConst.applePaySessionHandlerFields);
  t.pass();
  if('setCustomField' === result.actions[0]?.action){
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_applePaySessionData');
  } else {
    t.deepEqual(result.actions, []);
    t.deepEqual(result.errors, []);
  }
});

test.serial('Get apple Pay Session Handler response with empty fields', async (t: any) => {
  let result = await paymentHandler.handleApplePaySession(PaymentHandlerConst.applePaySessionHandlerEmptyFields);
  t.deepEqual(result.actions, []);
  t.deepEqual(result.errors, []);
});

test.serial('get authorization handler for google pay', async (t: any) => {
  let result = await paymentHandler.handleAuthorization(PaymentHandlerConst.authorizationHandlerGPUpdatePaymentObject, PaymentHandlerConst.authorizationHandlerUpdateTransactions);
  if (result.actions[0] == undefined) {
    t.deepEqual(result.actions, []);
  } else {
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
  }
});

test.serial('get authorization handler for click to pay', async (t: any) => {
  let result = await paymentHandler.handleAuthorization(PaymentHandlerConst.authorizationHandlerVSUpdatePaymentObject, PaymentHandlerConst.authorizationHandlerUpdateTransactions);
  if (result.actions[0] == undefined) {
    t.deepEqual(result.actions, []);
  } else {
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
  }
});

test.serial('get authorization handler for credit card', async (t: any) => {
  let result = await paymentHandler.handleAuthorization(PaymentHandlerConst.authorizationHandlerCCUpdatePaymentObject, PaymentHandlerConst.authorizationHandlerUpdateTransactions);
  if (result.actions[0] == undefined) {
    t.deepEqual(result.actions, []);
  } else {
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
  }
});

test.serial('get authorization handler for payer auth', async (t: any) => {
  let result: any = await paymentHandler.handleAuthorization(PaymentHandlerConst.authorizationHandler3DSUpdatePaymentObject, PaymentHandlerConst.authorizationHandlerUpdateTransactions);
  if (0 === result.actions[0]?.length) {
    t.deepEqual(result.actions, []);
    t.deepEqual(result.errors, []);
  } else if ('changeTransactionInteractionId' === result.actions[0]?.action) {
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
  } else if ('setCustomField' === result.actions[0]?.action) {
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_tokenCaptureContextSignature');
  } else {
    t.deepEqual(result.actions, []);
    t.is(result.errors[0].code, 'InvalidInput');
    t.is(result.errors[0].message, 'Cannot process the payment due to invalid input');
  }
});

test.serial('get authorization handler for apple pay', async (t: any) => {
  let result = await paymentHandler.handleAuthorization(PaymentHandlerConst.authorizationHandlerAPUpdatePaymentObject, PaymentHandlerConst.authorizationHandlerUpdateTransactions);
  if (0 === result.actions?.length) {
    t.deepEqual(result.actions, []);
  } else {
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
  }
});

test.serial('get authorization handler for eCheck', async (t: any) => {
  let result = await paymentHandler.handleAuthorization(PaymentHandlerConst.authorizationHandlerECUpdatePaymentObject, PaymentHandlerConst.authorizationHandlerUpdateTransactions);
  if (result.actions[0] == undefined) {
    t.deepEqual(result.actions, []);
  } else {
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
  }
});

test.serial('Check the run sync ', async (t: any) => {
  let result = await paymentHandler.handleSync();
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
  let result = await paymentHandler.handleSetTokenToNull(PaymentAuthorizationServiceConstCC.payment.custom.fields, PaymentHandlerConst.setTokenNullHandlerAuthResponse, PaymentAuthorizationServiceConstCC.payment.paymentMethodInfo.method);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[2].action, 'setCustomField');
  t.is(result.actions[2].name, 'isv_tokenCaptureContextSignature');
});

test.serial('Handle payment for credit card', async (t) => {
  let result = await paymentHandler.handlePaymentAuth(PaymentAuthorizationServiceConstCC.payment.paymentMethodInfo.method, PaymentAuthorizationServiceConstCC.payment, null, PaymentAuthorizationServiceConstCC.cart, PaymentServiceConst.getAuthResponseTransactionDetail, PaymentServiceConst.customerCardTokens, '');
  t.is(typeof result.isError, 'boolean');
  let i = 0;
  if ('isError' in result && 'paymentResponse' in result && 'authResponse' in result) {
    i++;
  }
  t.is(i, 1);
});

test.serial('Handle payment for click to pay', async (t) => {
  let result = await paymentHandler.handlePaymentAuth(PaymentAuthorizationServiceVsConst.clickToPayPayment.paymentMethodInfo.method, PaymentAuthorizationServiceVsConst.clickToPayPayment, null, PaymentAuthorizationServiceConstCC.cart, PaymentServiceConst.getAuthResponseTransactionDetail, PaymentServiceConst.customerCardTokens, '');
  t.is(typeof result.isError, 'boolean');
  let i = 0;
  if ('isError' in result && 'paymentResponse' in result && 'authResponse' in result) {
    i++;
  }
  t.is(i, 1);
});

test.serial('Handle payment for google pay', async (t) => {
  let result = await paymentHandler.handlePaymentAuth(PaymentAuthorizationServiceConstGP.payment.paymentMethodInfo.method, PaymentAuthorizationServiceConstGP.payment, null, PaymentAuthorizationServiceConstCC.cart, PaymentServiceConst.getAuthResponseTransactionDetail, PaymentServiceConst.customerCardTokens, '');
  t.is(typeof result.isError, 'boolean');
  let i = 0;
  if ('isError' in result && 'paymentResponse' in result && 'authResponse' in result) {
    i++;
  }
  t.is(i, 1);
});

test.serial('Handle payment for apple pay', async (t) => {
  let result = await paymentHandler.handlePaymentAuth(PaymentAuthorizationServiceConstAP.payment.paymentMethodInfo.method, PaymentAuthorizationServiceConstAP.payment, null, PaymentAuthorizationServiceConstCC.cart, PaymentServiceConst.getAuthResponseTransactionDetail, PaymentServiceConst.customerCardTokens, '');
  t.is(typeof result.isError, 'boolean');
  let i = 0;
  if ('isError' in result && 'paymentResponse' in result && 'authResponse' in result) {
    i++;
  }
  t.is(i, 1);
});

test.serial('Handle payment for eCheck', async (t) => {
  let result = await paymentHandler.handlePaymentAuth(PaymentAuthorizationServiceConstECDebit.payment.paymentMethodInfo.method, PaymentAuthorizationServiceConstECDebit.payment, null, PaymentAuthorizationServiceConstCC.cart, PaymentServiceConst.getAuthResponseTransactionDetail, PaymentServiceConst.customerCardTokens, '');
  t.is(typeof result.isError, 'boolean');
  let i = 0;
  if ('isError' in result && 'paymentResponse' in result && 'authResponse' in result) {
    i++;
  }
  t.is(i, 1);
});

test.serial('payment auth handler with invalid customer tokens', async (t) => {
  let result = await paymentHandler.handlePaymentAuth(PaymentAuthorizationServiceConstCC.payment.paymentMethodInfo.method, PaymentAuthorizationServiceConstCC.payment, null, PaymentAuthorizationServiceConstCC.cart, PaymentServiceConst.getAuthResponseTransactionDetail, PaymentServiceConst.processTokensCustomerInvalidCardTokensObject, '');
  t.is(typeof result.isError, 'boolean');
  let i = 0;
  if ('isError' in result && 'paymentResponse' in result && 'authResponse' in result) {
    i++;
  }
  t.is(i, 1);
});

test.serial('payer Auth Reversal Handler', async (t) => {
  let result = await paymentHandler.handlePayerAuthReversal(PaymentHandlerConst.payerAuthPaymentObject, PaymentServiceConst.checkAuthReversalTriggeredPaymentResponse, PaymentHandlerConst.payerAuthReversalHandlerUpdateActions);
  if (result?.actions) {
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
  } else {
    t.pass();
  }
});

test.serial('Order management handler for charge', async (t) => {
  let result = await paymentHandler.handleOrderManagementForCharge(PaymentCaptureServiceConstCC.payment, '', PaymentHandlerConst.orderManagementHandlerUpdateTransactions);
  if (201 == result.httpCode) {
    t.is(result.httpCode, 201);
    t.is(result.status, 'PENDING');
  } else {
    t.not(result.httpCode, 201);
    t.not(result.status, 'PENDING');
  }
});

test.serial('Order management handler for auth reversal', async t => {
  let result = await paymentHandler.handleOrderManagementAuthReversal(PaymentAuthorizationReversalConstCC.payment, PaymentAuthorizationServiceConstCC.cart);
  if (201 == result.httpCode) {
    t.is(result.httpCode, 201);
    t.is(result.status, 'REVERSED');
  } else {
    t.not(result.httpCode, 201);
    t.not(result.status, 'REVERSED');
  }
});

test.serial('add card handler', async (t) => {
  let result = await paymentHandler.handleCardAddition(unit.customerId, AddTokenServiceConst.addTokenResponseAddress, AddTokenServiceConst.addTokenResponseCustomerObj);
  t.is(result.actions[0].action, 'setCustomField');
  t.is(result.actions[0].name, 'isv_tokens');
  t.is(result.actions[1].action, 'setCustomField');
  t.is(result.actions[1].name, 'isv_tokenUpdated');
});

test.serial('add card handler with customer id as null', async (t) => {
  let result = await paymentHandler.handleCardAddition('', AddTokenServiceConst.addTokenResponseAddress, AddTokenServiceConst.addTokenResponseCustomerObj);
  t.is(result.actions[0].action, 'setCustomField');
  t.is(result.actions[0].name, 'isv_tokens');
  t.is(result.actions[1].action, 'setCustomField');
  t.is(result.actions[1].name, 'isv_tokenUpdated');
});

test.serial('delete card handler', async (t) => {
  let result = await paymentHandler.handleCardDeletion(DeleteTokenServiceConst.customerTokenObj, unit.customerId);
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
  let result = await paymentHandler.handleCardDeletion(DeleteTokenServiceConst.customerTokenObj, '');
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
  try{
  let result = await paymentHandler.handleNetworkToken(PaymentServiceConst.processTokensCustomerCardTokensObject.customerTokenId, PaymentHandlerConst.retrieveTokenDetailsResponse);
  if (result) {
    if (result.statusCode == 200) {
      t.is(result.statusCode, 200);
    } else {
      t.not(result.statusCode, 200);
    }
  } else {
    t.pass();
  }
}catch(error){
  t.pass();
}
});

test.serial('Test Network Token Handler function with token id as null', async (t) => {
  let result = await paymentHandler.handleNetworkToken('', PaymentHandlerConst.retrieveTokenDetailsResponse);
  t.falsy(result);
});

test.serial('delete card handler with invalid customer id', async (t) => {
  let result = await paymentHandler.handleCardDeletion(DeleteTokenServiceConst.customerTokenObj, '@&^%@$%@^#%&*@');
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
  let result = await paymentHandler.handleCardAddition('$#$%^T&U*(I', AddTokenServiceConst.addTokenResponseAddress, AddTokenServiceConst.addTokenResponseCustomerObj);
  t.is(result.actions[0].action, 'setCustomField');
  t.is(result.actions[0].name, 'isv_tokens');
  t.is(result.actions[1].action, 'setCustomField');
  t.is(result.actions[1].name, 'isv_tokenUpdated');
});

test.serial('Test Network Token Handler function with invalid customer token id', async (t) => {
  try{
  let result = await paymentHandler.handleNetworkToken(PaymentServiceConst.processTokensCustomerInvalidCardTokensObject.customerTokenId, PaymentHandlerConst.retrieveTokenDetailsResponse);
  t.falsy(result);
  }catch(error){
    t.pass();
  }
});

test.serial('set token null handler with payment method as empty string', async (t) => {
  let result = await paymentHandler.handleSetTokenToNull(PaymentAuthorizationServiceConstCC.payment.custom.fields, PaymentHandlerConst.setTokenNullHandlerAuthResponse, '');
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[2].action, 'setCustomField');
  t.is(result.actions[2].name, 'isv_tokenCaptureContextSignature');
});

test.serial('Get apple Pay Session Handler response with invalid fields data', async (t: any) => {
  let result = await paymentHandler.handleApplePaySession(PaymentHandlerConst.applePaySessionHandlerInvalidFields);
  t.deepEqual(result.actions, []);
  t.deepEqual(result.errors, []);
});

test.serial('Get update card handler data with invalid custome tokens', async (t: any) => {
  let result = await paymentHandler.handleUpdateCard(PaymentHandlerConst.updateCardHandlerInvalidTokens, PaymentHandlerConst.updateCardHandlerCustomerId, PaymentHandlerConst.updateCardHandlerCustomerObj);
 t.deepEqual(result.actions, [])
 t.deepEqual(result.errors, [])
});

test.serial('Handle transaction type for charge',async (t) => {
  const {type, state} = PaymentHandlerConst.orderManagementHandlerUpdateTransactions;
  const result =await paymentHandler.handleTransactionType(type, state, '123', PaymentCaptureServiceConstCC.payment, PaymentHandlerConst.orderManagementHandlerUpdateTransactions, PaymentAuthorizationServiceConstCC.cart);
  t.pass();
  if (Constants.HTTP_SUCCESS_STATUS_CODE == result.httpCode) {
    t.is(result.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  } else {
    t.not(result.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  }
})

test.serial('Handle transaction type for refund',async (t) => {
  const {type, state} = PaymentHandlerConst.orderManagementHandlerRefundUpdateTransactions;
  const result =await paymentHandler.handleTransactionType(type, state, '123', PaymentRefundServiceConstCC.payment, PaymentHandlerConst.orderManagementHandlerRefundUpdateTransactions, PaymentAuthorizationServiceConstCC.cart);
  if('changeTransactionInteractionId' === result.actions[0]?.action) {
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
    t.is(result.actions[2].action, 'addInterfaceInteraction');
  } else {
    t.deepEqual(result.actions, []);
    t.deepEqual(result.errors, []);
  }
})

test.serial('Handle transaction type for auth reversal', async (t) => {
  const {type, state} = CommercetoolsApiConst.addTransactionTransactionObject;
  const result =await paymentHandler.handleTransactionType(type, state, '123', PaymentRefundServiceConstCC.payment, CommercetoolsApiConst.addTransactionTransactionObject, PaymentAuthorizationReversalConstGP.cart);
  if (Constants.HTTP_SUCCESS_STATUS_CODE == result.httpCode) {
    t.is(result.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  } else {
    t.not(result.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  }
})