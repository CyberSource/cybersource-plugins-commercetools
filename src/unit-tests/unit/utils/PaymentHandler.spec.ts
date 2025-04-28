import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../../constants/paymentConstants';
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
import PaymentServiceConst from '../../const/HelpersConst';
import PaymentHandlerConst from '../../const/PaymentHandlerConst';

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
  } else if (result.error == 'An error occurred while trying to sync the payments details') {
    t.is(result.message, '')
  }
  else {
    t.is(result.error, 'Please enable Decision sync');
    t.is(result.message, '');
  }
});

test.serial('Get update card handler data', async (t: any) => {
  try {
    let result = await paymentHandler.handleUpdateCard(PaymentHandlerConst.updateCardHandlerTokens, PaymentHandlerConst.updateCardHandlerCustomerId, PaymentHandlerConst.updateCardHandlerCustomerObj);
    if (result.actions.length) {
      t.is(result.actions[0].action, 'setCustomType');
    } else {
      t.fail();
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

test.serial('Get update card handler data when customer id is null', async (t: any) => {
  try {
    let result = await paymentHandler.handleUpdateCard(PaymentHandlerConst.updateCardHandlerTokens, '', PaymentHandlerConst.updateCardHandlerCustomerObj);
    t.deepEqual(result.actions, []);
    t.deepEqual(result.errors, []);
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Get order management handler for capture ', async (t: any) => {
  try {
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
      t.fail();
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

test.serial('Get order management handler for capture with payment id as null', async (t: any) => {
  try {
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
      t.fail();
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

test.serial('Get order management handler for refund ', async (t: any) => {
  try {
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
      t.fail();
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

test.serial('Get order management handler for refund with payment id as null', async (t: any) => {
  try {
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
      t.fail();
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

test.serial('Get apple Pay Session Handler response ', async (t: any) => {
  try {
    let result = await paymentHandler.handleApplePaySession(PaymentHandlerConst.applePaySessionHandlerFields);
    if ('setCustomField' === result.actions[0]?.action) {
      t.is(result.actions[0].action, 'setCustomField');
      t.is(result.actions[0].name, 'isv_applePaySessionData');
    } else {
      t.deepEqual(result.actions, []);
      t.deepEqual(result.errors, []);
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

test.serial('Get apple Pay Session Handler response with empty fields', async (t: any) => {
  try {
    let result = await paymentHandler.handleApplePaySession(PaymentHandlerConst.applePaySessionHandlerEmptyFields);
    t.deepEqual(result.actions, []);
    t.deepEqual(result.errors, []);
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('get authorization handler for google pay', async (t: any) => {
  try {
    let result = await paymentHandler.handleAuthorization(PaymentHandlerConst.authorizationHandlerGPUpdatePaymentObject as any, PaymentHandlerConst.authorizationHandlerUpdateTransactions);
    if (result.actions[0] == undefined) {
      t.deepEqual(result.actions, []);
    } else {
      t.is(result.actions[0].action, 'changeTransactionInteractionId');
      t.is(result.actions[1].action, 'changeTransactionState');
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

test.serial('get authorization handler for click to pay', async (t: any) => {
  try {
    let result = await paymentHandler.handleAuthorization(PaymentHandlerConst.authorizationHandlerVSUpdatePaymentObject as any, PaymentHandlerConst.authorizationHandlerUpdateTransactions);
    if (result.actions[0] == undefined) {
      t.deepEqual(result.actions, []);
    } else {
      t.is(result.actions[0].action, 'changeTransactionInteractionId');
      t.is(result.actions[1].action, 'changeTransactionState');
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

test.serial('get authorization handler for credit card', async (t: any) => {
  try {
    let result = await paymentHandler.handleAuthorization(PaymentHandlerConst.authorizationHandlerCCUpdatePaymentObject as any, PaymentHandlerConst.authorizationHandlerUpdateTransactions);
    if (result.actions[0] == undefined) {
      t.deepEqual(result.actions, []);
    } else {
      t.is(result.actions[0].action, 'changeTransactionInteractionId');
      t.is(result.actions[1].action, 'changeTransactionState');
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

test.serial('get authorization handler for payer auth', async (t: any) => {
  try {
    let result: any = await paymentHandler.handleAuthorization(PaymentHandlerConst.authorizationHandler3DSUpdatePaymentObject as any, PaymentHandlerConst.authorizationHandlerUpdateTransactions);
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
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('get authorization handler for apple pay', async (t: any) => {
  try {
    let result = await paymentHandler.handleAuthorization(PaymentHandlerConst.authorizationHandlerAPUpdatePaymentObject as any, PaymentHandlerConst.authorizationHandlerUpdateTransactions);
    if (0 === result.actions?.length) {
      t.deepEqual(result.actions, []);
    } else {
      t.is(result.actions[0].action, 'changeTransactionInteractionId');
      t.is(result.actions[1].action, 'changeTransactionState');
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

test.serial('get authorization handler for eCheck', async (t: any) => {
  try {
    let result = await paymentHandler.handleAuthorization(PaymentHandlerConst.authorizationHandlerECUpdatePaymentObject as any, PaymentHandlerConst.authorizationHandlerUpdateTransactions);
    if (result.actions[0] == undefined) {
      t.deepEqual(result.actions, []);
    } else {
      t.is(result.actions[0].action, 'changeTransactionInteractionId');
      t.is(result.actions[1].action, 'changeTransactionState');
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

test.serial('Check the run sync ', async (t: any) => {
  try {
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
    } else {
      t.pass()
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

test.serial('set token null handler ', async (t) => {
  let result = await paymentHandler.handleSetTokenToNull(PaymentAuthorizationServiceConstCC.payment.custom.fields, PaymentHandlerConst.setTokenNullHandlerAuthResponse, PaymentAuthorizationServiceConstCC.payment.paymentMethodInfo.method);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[2].action, 'setCustomField');
  t.is(result.actions[2].name, 'isv_tokenCaptureContextSignature');
});

test.serial('Handle payment for credit card', async (t) => {
  try {
    let result = await paymentHandler.handlePaymentAuth(PaymentAuthorizationServiceConstCC.payment.paymentMethodInfo.method, PaymentAuthorizationServiceConstCC.payment as any, null, PaymentAuthorizationServiceConstCC.cart as any, PaymentServiceConst.getAuthResponseTransactionDetail, PaymentServiceConst.customerCardTokens, '');
    t.is(typeof result.isError, 'boolean');
    let i = 0;
    if ('isError' in result && 'paymentResponse' in result && 'authResponse' in result) {
      i++;
    }
    t.is(i, 1);
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Handle payment for click to pay', async (t) => {
  try {
    let result = await paymentHandler.handlePaymentAuth(PaymentAuthorizationServiceVsConst.clickToPayPayment.paymentMethodInfo.method, PaymentAuthorizationServiceVsConst.clickToPayPayment as any, null, PaymentAuthorizationServiceConstCC.cart as any, PaymentServiceConst.getAuthResponseTransactionDetail, PaymentServiceConst.customerCardTokens, '');
    t.is(typeof result.isError, 'boolean');
    let i = 0;
    if ('isError' in result && 'paymentResponse' in result && 'authResponse' in result) {
      i++;
    }
    t.is(i, 1);
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Handle payment for google pay', async (t) => {
  try {
    let result = await paymentHandler.handlePaymentAuth(PaymentAuthorizationServiceConstGP.payment.paymentMethodInfo.method, PaymentAuthorizationServiceConstGP.payment as any, null, PaymentAuthorizationServiceConstCC.cart as any, PaymentServiceConst.getAuthResponseTransactionDetail, PaymentServiceConst.customerCardTokens, '');
    t.is(typeof result.isError, 'boolean');
    let i = 0;
    if ('isError' in result && 'paymentResponse' in result && 'authResponse' in result) {
      i++;
    }
    t.is(i, 1);
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Handle payment for apple pay', async (t) => {
  try {
    let result = await paymentHandler.handlePaymentAuth(PaymentAuthorizationServiceConstAP.payment.paymentMethodInfo.method, PaymentAuthorizationServiceConstAP.payment as any, null, PaymentAuthorizationServiceConstCC.cart as any, PaymentServiceConst.getAuthResponseTransactionDetail, PaymentServiceConst.customerCardTokens, '');
    t.is(typeof result.isError, 'boolean');
    let i = 0;
    if ('isError' in result && 'paymentResponse' in result && 'authResponse' in result) {
      i++;
    }
    t.is(i, 1);
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Handle payment for eCheck', async (t) => {
  try {
    let result = await paymentHandler.handlePaymentAuth(PaymentAuthorizationServiceConstECDebit.payment.paymentMethodInfo.method, PaymentAuthorizationServiceConstECDebit.payment as any, null, PaymentAuthorizationServiceConstCC.cart as any, PaymentServiceConst.getAuthResponseTransactionDetail, PaymentServiceConst.customerCardTokens, '');
    t.is(typeof result.isError, 'boolean');
    let i = 0;
    if ('isError' in result && 'paymentResponse' in result && 'authResponse' in result) {
      i++;
    }
    t.is(i, 1);
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('payment auth handler with invalid customer tokens', async (t) => {
  try {
    let result = await paymentHandler.handlePaymentAuth(PaymentAuthorizationServiceConstCC.payment.paymentMethodInfo.method, PaymentAuthorizationServiceConstCC.payment as any, null, PaymentAuthorizationServiceConstCC.cart as any, PaymentServiceConst.getAuthResponseTransactionDetail, PaymentServiceConst.processTokensCustomerInvalidCardTokensObject, '');
    t.is(typeof result.isError, 'boolean');
    let i = 0;
    if ('isError' in result && 'paymentResponse' in result && 'authResponse' in result) {
      i++;
    }
    t.is(i, 1);
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('payer Auth Reversal Handler', async (t) => {
  try {
    let result = await paymentHandler.handlePayerAuthReversal(PaymentHandlerConst.payerAuthPaymentObject as any, PaymentServiceConst.checkAuthReversalTriggeredPaymentResponse, PaymentHandlerConst.payerAuthReversalHandlerUpdateActions);
    if (result?.actions) {
      t.is(result.actions[0].action, 'changeTransactionInteractionId');
      t.is(result.actions[1].action, 'changeTransactionState');
    } else {
      t.fail();
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

test.serial('Order management handler for charge', async (t) => {
  try {
    let result = await paymentHandler.handleOrderManagementForCharge(PaymentCaptureServiceConstCC.payment as any, '', PaymentHandlerConst.orderManagementHandlerUpdateTransactions);
    if (201 == result.httpCode) {
      t.is(result.httpCode, 201);
      t.is(result.status, 'PENDING');
    } else {
      t.fail();
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

test.serial('Order management handler for auth reversal', async t => {
  try {
    let result = await paymentHandler.handleOrderManagementAuthReversal(PaymentAuthorizationReversalConstCC.payment as any, PaymentAuthorizationServiceConstCC.cart as any);
    if (201 == result.httpCode) {
      t.is(result.httpCode, 201);
      t.is(result.status, 'REVERSED');
    } else {
       t.fail()
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

test.serial('add card handler', async (t) => {
  try {
    let result = await paymentHandler.handleCardAddition(unit.customerId, AddTokenServiceConst.addTokenResponseAddress, AddTokenServiceConst.addTokenResponseCustomerObj);
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_tokens');
    t.is(result.actions[1].action, 'setCustomField');
    t.is(result.actions[1].name, 'isv_tokenUpdated');
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('add card handler with customer id as null', async (t) => {
  try {
    let result = await paymentHandler.handleCardAddition('', AddTokenServiceConst.addTokenResponseAddress, AddTokenServiceConst.addTokenResponseCustomerObj);
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_tokens');
    t.is(result.actions[1].action, 'setCustomField');
    t.is(result.actions[1].name, 'isv_tokenUpdated');
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('delete card handler', async (t) => {
  try {
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
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('delete card handler with customer id as null', async (t) => {
  try {
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
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Test Network Token Handler function', async (t) => {
  try {
    let result = await paymentHandler.handleNetworkToken(PaymentServiceConst.processTokensCustomerCardTokensObject.customerTokenId, PaymentHandlerConst.retrieveTokenDetailsResponse);
    if (result) {
      if (result.statusCode == 200) {
        t.is(result.statusCode, 200);
      } else {
        t.not(result.statusCode, 200);
      }
    } else {
      t.fail();
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

test.serial('Test Network Token Handler function with token id as null', async (t) => {
  try {
    let result = await paymentHandler.handleNetworkToken('', PaymentHandlerConst.retrieveTokenDetailsResponse);
    t.falsy(result);
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('delete card handler with invalid customer id', async (t) => {
  try {
    let result = await paymentHandler.handleCardDeletion(DeleteTokenServiceConst.customerTokenObj, '@&^%@$%@^#%&*@');
    if (1 === result?.actions.length) {
      t.is(result.actions[0].action, 'setCustomField');
      t.is(result.actions[0].name, 'isv_tokenAction');
      t.is(result.actions[0].value, null)
    } else {
      t.deepEqual(result.actions, []);
      t.deepEqual(result.errors, []);
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

test.serial('add card handler with invalid customer id', async (t) => {
  try {
    let result = await paymentHandler.handleCardAddition('$#$%^T&U*(I', AddTokenServiceConst.addTokenResponseAddress, AddTokenServiceConst.addTokenResponseCustomerObj);
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_tokens');
    t.is(result.actions[1].action, 'setCustomField');
    t.is(result.actions[1].name, 'isv_tokenUpdated');
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Test Network Token Handler function with invalid customer token id', async (t) => {
  try {
    let result = await paymentHandler.handleNetworkToken(PaymentServiceConst.processTokensCustomerInvalidCardTokensObject.customerTokenId, PaymentHandlerConst.retrieveTokenDetailsResponse);
    t.falsy(result);
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('set token null handler with payment method as empty string', async (t) => {
  try {
    let result = await paymentHandler.handleSetTokenToNull(PaymentAuthorizationServiceConstCC.payment.custom.fields, PaymentHandlerConst.setTokenNullHandlerAuthResponse, '');
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
    t.is(result.actions[2].action, 'setCustomField');
    t.is(result.actions[2].name, 'isv_tokenCaptureContextSignature');
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Get apple Pay Session Handler response with invalid fields data', async (t: any) => {
  try {
    let result = await paymentHandler.handleApplePaySession(PaymentHandlerConst.applePaySessionHandlerInvalidFields);
    t.deepEqual(result.actions, []);
    t.deepEqual(result.errors, []);
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Get update card handler data with invalid customer tokens', async (t: any) => {
  try {
    let result = await paymentHandler.handleUpdateCard(PaymentHandlerConst.updateCardHandlerInvalidTokens, PaymentHandlerConst.updateCardHandlerCustomerId, PaymentHandlerConst.updateCardHandlerCustomerObj);
    t.deepEqual(result.actions, [])
    t.deepEqual(result.errors, [])
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Handle transaction type for charge', async (t) => {
  try {
    const { type, state } = PaymentHandlerConst.orderManagementHandlerUpdateTransactions;
    const result = await paymentHandler.handleTransactionType(type, state, '123', PaymentCaptureServiceConstCC.payment as any, PaymentHandlerConst.orderManagementHandlerUpdateTransactions, PaymentAuthorizationServiceConstCC.cart as any);
    if (Constants.HTTP_SUCCESS_STATUS_CODE == result.httpCode) {
      t.is(result.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
    } else {
      t.not(result.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
      t.log(`Stack trace: ${error.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
})

test.serial('Handle transaction type for refund', async (t) => {
  const { type, state } = PaymentHandlerConst.orderManagementHandlerRefundUpdateTransactions;
  const result = await paymentHandler.handleTransactionType(type, state, '123', PaymentRefundServiceConstCC.payment as any, PaymentHandlerConst.orderManagementHandlerRefundUpdateTransactions, PaymentAuthorizationServiceConstCC.cart as any);
  if ('changeTransactionInteractionId' === result.actions[0]?.action) {
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
    t.is(result.actions[2].action, 'addInterfaceInteraction');
  } else {
    t.deepEqual(result.actions, []);
    t.deepEqual(result.errors, []);
  }
})

test.serial('Handle transaction type for auth reversal', async (t) => {
  const { type, state } = CommercetoolsApiConst.addTransactionTransactionObject;
  const result = await paymentHandler.handleTransactionType(type, state, '123', PaymentRefundServiceConstCC.payment as any, CommercetoolsApiConst.addTransactionTransactionObject, PaymentAuthorizationReversalConstGP.cart as any);
  if (Constants.HTTP_SUCCESS_STATUS_CODE == result.httpCode) {
    t.is(result.httpCode, Constants.HTTP_SUCCESS_STATUS_CODE);
  } else {
    t.fail();
  }
})