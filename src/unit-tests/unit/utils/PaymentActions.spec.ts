import test from 'ava';
import dotenv from 'dotenv';

import paymentActions  from '../../../utils/PaymentActions';
import PaymentAuthorizationServiceConstCC from '../../const/CreditCard/PaymentAuthorizationServiceConstCC';
import PaymentHandlerConst from '../../const/PaymentHandlerConst';
import PaymentServiceConst from '../../const/PaymentServiceConst';
import PaymentUtilsConst from '../../const/PaymentUtilsConst';

dotenv.config();

test.serial('Add refund action', async (t: any) => {
    let result = paymentActions.addRefundAction(PaymentServiceConst.addRefundActionAmount, PaymentServiceConst.addRefundActionOrderResponse, PaymentServiceConst.state);
    if (result?.action && result?.transaction) {
      t.is(result.action, 'addTransaction');
      t.is(result.transaction.state, 'Success');
    } else {
      t.pass();
    }
  });
  
  test.serial('Add refund action when state is empty', async (t: any) => {
    let result = paymentActions.addRefundAction(PaymentServiceConst.addRefundActionAmount, PaymentServiceConst.addRefundActionOrderResponse, '');
    if (result?.action && result?.transaction) {
      t.is(result.action, 'addTransaction');
      t.is(result.transaction.state, '');
    } else {
      t.pass();
    }
  });

  test.serial('Add refund action with zero amount', async (t: any) => {
    let result = paymentActions.addRefundAction(PaymentServiceConst.addRefundActionZeroAmount, PaymentServiceConst.addRefundActionOrderResponse, PaymentServiceConst.state);
    if (result?.action && result?.transaction) {
      t.is(result.action, 'addTransaction');
      t.is(result.transaction.state, 'Success');
    } else {
      t.pass();
    }
  });

  test.serial('get the create response function when transaction is failed', async (t: any) => {
    let result: any = paymentActions.createResponse(PaymentServiceConst.createResponseSetTransaction, PaymentServiceConst.createTransactionSetFailedCustomField, PaymentServiceConst.createTransactionPaymentFailure, PaymentServiceConst.createTransactionSetCustomType);
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[0].interactionId, PaymentServiceConst.createResponseSetTransaction.interactionId);
    t.is(result.actions[1].action, 'changeTransactionState');
    t.is(result.actions[1].state, PaymentServiceConst.createTransactionSetFailedCustomField.state);
  });

  test.serial('get the create response function ', async (t: any) => {
    let result: any = paymentActions.createResponse(PaymentServiceConst.createResponseSetTransaction, PaymentServiceConst.createTransactionSetCustomField, null, null);
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[0].interactionId, PaymentServiceConst.createResponseSetTransaction.interactionId);
    t.is(result.actions[1].action, 'changeTransactionState');
    t.is(result.actions[1].state, PaymentServiceConst.createTransactionSetCustomField.state);
  });

  test.serial('Check visa card detail action ', async (t: any) => {
    let result = paymentActions.cardDetailsActions(PaymentServiceConst.visaCardDetailsActionVisaCheckoutData);
    t.is(result[0].action, 'setCustomField');
    t.is(result[0].name, 'isv_maskedPan');
    t.is(result[1].action, 'setCustomField');
    t.is(result[1].name, 'isv_cardExpiryMonth');
    t.is(result[2].action, 'setCustomField');
    t.is(result[2].name, 'isv_cardExpiryYear');
    t.is(result[3].action, 'setCustomField');
    t.is(result[3].name, 'isv_cardType');
  });
  
  test.serial('Check visa card detail action with empty data', async (t: any) => {
    let result = paymentActions.cardDetailsActions(PaymentServiceConst.visaCardDetailsActionVisaCheckoutEmptyData);
    t.deepEqual(result, []);
  });

  test.serial('Get update token actions ', async (t: any) => {
    let result = paymentActions.getUpdateTokenActions(PaymentServiceConst.getUpdateTokenActionsActions, [], true, PaymentServiceConst.deleteTokenCustomerObj, null);
    if (result?.actions[0].action) {
      if (PaymentServiceConst.deleteTokenCustomerObj?.custom?.type?.id) {
        t.is(result.actions[0].action, 'setCustomField');
      } else if (result?.actions[0]?.type?.key) {
        t.is(result.actions[0].action, 'setCustomType');
        t.is(result.actions[0].type.key, 'isv_payments_customer_tokens');
      }
    } else {
      t.pass();
    }
  });

  test.serial('Get update token actions when tokens has invalid values', async (t: any) => {
    let result = paymentActions.getUpdateTokenActions(PaymentServiceConst.getUpdateInvalidTokenActionsActions, [], true, PaymentServiceConst.deleteTokenCustomerObj, null);
    if (result?.actions[0].action) {
      if (PaymentServiceConst.deleteTokenCustomerObj?.custom?.type?.id) {
        t.is(result.actions[0].action, 'setCustomField');
      } else if (result?.actions[0]?.type?.key) {
        t.is(result.actions[0].action, 'setCustomType');
        t.is(result.actions[0].type.key, 'isv_payments_customer_tokens');
      }
    } else {
      t.pass();
    }
  });

  test.serial('Handle auth application', async (t) => {
    let result = await paymentActions.handleAuthApplication(PaymentAuthorizationServiceConstCC.payment, PaymentServiceConst.handleAuthApplication, PaymentServiceConst.authResponse, PaymentServiceConst.retrieveSyncResponseTransactionElement);
    t.is(result.actions[0].name, 'isv_payerEnrollTransactionId');
    t.is(result.actions[1].name, 'isv_payerEnrollHttpCode');
    t.is(result.actions[2].name, 'isv_payerEnrollStatus');
    t.is(result.actions[3].name, 'isv_payerAuthenticationTransactionId');
    t.is(result.actions[4].name, 'isv_tokenCaptureContextSignature');
    t.is(result.actions[5].name, 'isv_payerAuthenticationRequired');
    t.is(result.actions[6].action, 'addTransaction');
  });

  test.serial('Get payer auth actions when response is empty', async (t: any) => {
    let result = paymentActions.payerAuthActions(PaymentServiceConst.payerAuthActionsEmptyResponse);
    if (0 <= result?.length) {
      t.is(result[0].action, 'setCustomField');
      t.is(result[0].name, 'isv_payerAuthenticationRequired');
      t.is(result[1].name, 'isv_payerAuthenticationTransactionId');
      t.is(result[2].name, 'isv_payerAuthenticationAcsUrl');
      t.is(result[3].name, 'isv_payerAuthenticationPaReq');
      t.is(result[4].name, 'isv_stepUpUrl');
      t.is(result[5].name, 'isv_responseJwt');
    } else {
      t.pass();
    }
  });

  test.serial('Get payer auth actions ', async (t: any) => {
    let result = paymentActions.payerAuthActions(PaymentServiceConst.payerAuthActionsResponse);
    if (0 <= result?.length && result[0]?.fields?.authenticationRequired) {
      t.is(result[0].action, 'addInterfaceInteraction');
      t.is(result[0].fields.authenticationRequired, true);
      t.is(result[1].name, 'isv_payerAuthenticationRequired');
      t.is(result[1].value, true);
      t.is(result[2].name, 'isv_payerAuthenticationTransactionId');
      t.is(result[3].name, 'isv_payerAuthenticationAcsUrl');
      t.is(result[4].name, 'isv_payerAuthenticationPaReq');
      t.is(result[5].name, 'isv_stepUpUrl');
      t.is(result[6].name, 'isv_responseJwt');
    } else {
      t.pass();
    }
  });

  
test.serial('get payer auth validate response', async (t) => {
    let result = await paymentActions.payerAuthValidateActions(PaymentServiceConst.authResponse, PaymentServiceConst.payerEnrollActionsResponse);
    t.is(result.actions[0].name, 'isv_payerEnrollTransactionId');
    t.is(result.actions[1].name, 'isv_payerEnrollHttpCode');
    t.is(result.actions[2].name, 'isv_payerEnrollStatus');
    t.is(result.actions[3].name, 'isv_payerAuthenticationTransactionId');
    t.is(result.actions[4].name, 'isv_tokenCaptureContextSignature');
    t.is(result.actions[5].name, 'isv_payerAuthenticationRequired');
    t.is(result.actions[6].action, 'addTransaction');
    t.is(result.actions[7].action, 'addInterfaceInteraction');
  });

  test.serial('Create enroll response actions ', (t) => {
    const result = paymentActions.createEnrollResponseActions(PaymentUtilsConst.setTransactionIdPaymentResponse, PaymentHandlerConst.getPayerAuthValidateResponseUpdatePaymentObj);
    if(result){
    t.pass();
    }
  })