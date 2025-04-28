import test from 'ava';
import dotenv from 'dotenv';

import paymentActions from '../../../utils/PaymentActions';
import PaymentAuthorizationServiceConstCC from '../../const/CreditCard/PaymentAuthorizationServiceConstCC';
import PaymentServiceConst from '../../const/HelpersConst';
import PaymentHandlerConst from '../../const/PaymentHandlerConst';
import PaymentUtilsConst from '../../const/PaymentUtilsConst';

dotenv.config();

test.serial('Add refund action', async (t) => {
  try {
    const result = paymentActions.addRefundAction(PaymentServiceConst.addRefundActionAmount, PaymentServiceConst.addRefundActionOrderResponse, PaymentServiceConst.state);

    if (result?.action && result?.transaction) {
      t.is(result.action, 'addTransaction');
      t.is(result.transaction.state, 'Success');
    } else {
      t.fail(`Unexpected error: information for refund is invalid: ${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Add refund action when state is empty', async (t) => {
  try {
    const result = paymentActions.addRefundAction(PaymentServiceConst.addRefundActionAmount, PaymentServiceConst.addRefundActionOrderResponse, '');

    if (result?.action && result?.transaction) {
      t.is(result.action, 'addTransaction');
      t.is(result.transaction.state, '');
    } else {
      t.fail(`Unexpected error: information for refund is invalid: ${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('get the create response function when transaction is failed', async (t: any) => {
  try {
    let result: any = paymentActions.createResponse(PaymentServiceConst.createResponseSetTransaction, PaymentServiceConst.createTransactionSetFailedCustomField, PaymentServiceConst.createTransactionPaymentFailure, PaymentServiceConst.createTransactionSetCustomType);
    if (Array.isArray(result?.actions) && result.actions.length !== 0) {
      t.is(result.actions[0].action, 'changeTransactionInteractionId');
      t.is(result.actions[0].interactionId, PaymentServiceConst.createResponseSetTransaction.interactionId);
      t.is(result.actions[1].action, 'changeTransactionState');
      t.is(result.actions[1].state, PaymentServiceConst.createTransactionSetFailedCustomField.state);
    } else {
      t.fail(`Unexpected get the create response: ${result}`);
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

test.serial('get the create response function ', async (t: any) => {
  try {
    let result: any = paymentActions.createResponse(PaymentServiceConst.createResponseSetTransaction, PaymentServiceConst.createTransactionSetCustomField, null, null);
    if (Array.isArray(result?.actions) && result.actions.length !== 0) {
      t.is(result.actions[0].action, 'changeTransactionInteractionId');
      t.is(result.actions[0].interactionId, PaymentServiceConst.createResponseSetTransaction.interactionId);
      t.is(result.actions[1].action, 'changeTransactionState');
      t.is(result.actions[1].state, PaymentServiceConst.createTransactionSetCustomField.state);
    } else {
      t.fail(`Unexpected error create response ${result}`);
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

test.serial('Check visa card detail action ', async (t: any) => {
  try {
    let result = paymentActions.cardDetailsActions(PaymentServiceConst.visaCardDetailsActionVisaCheckoutData);
    if (Array.isArray(result) && result.length !== 0) {
      t.is(result[0].action, 'setCustomField');
      t.is(result[0].name, 'isv_maskedPan');
      t.is(result[1].action, 'setCustomField');
      t.is(result[1].name, 'isv_cardExpiryMonth');
      t.is(result[2].action, 'setCustomField');
      t.is(result[2].name, 'isv_cardExpiryYear');
      t.is(result[3].action, 'setCustomField');
      t.is(result[3].name, 'isv_cardType');
    } else {
      t.fail(`Unexpected error create response ${result}`);
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

test.serial('Check visa card detail action with empty data', async (t: any) => {
  try {
    let result = paymentActions.cardDetailsActions(PaymentServiceConst.visaCardDetailsActionVisaCheckoutEmptyData);
    if (Array.isArray(result) && result.length === 0) {
      t.deepEqual(result, []);
    } else {
      t.fail(`Unexpected error create response ${result}`);
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

test.serial('Get update token actions ', async (t: any) => {
  try {
    let result = paymentActions.getUpdateTokenActions(PaymentServiceConst.getUpdateTokenActionsActions, [], true, PaymentServiceConst.deleteTokenCustomerObj, null);
    if (result?.actions[0].action) {
      if (PaymentServiceConst.deleteTokenCustomerObj?.custom?.type?.id) {
        t.is(result.actions[0].action, 'setCustomField');
      } else if (result?.actions[0]?.type?.key) {
        t.is(result.actions[0].action, 'setCustomType');
        t.is(result.actions[0].type.key, 'isv_payments_customer_tokens');
      } else {
        t.fail(`Unexpected error create response ${result}`);
      }
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

test.serial('Get update token actions when tokens has invalid values', async (t: any) => {
  try {
    let result = paymentActions.getUpdateTokenActions(PaymentServiceConst.getUpdateInvalidTokenActionsActions, [], true, PaymentServiceConst.deleteTokenCustomerObj, null);
    if (result?.actions[0].action) {
      if (PaymentServiceConst.deleteTokenCustomerObj?.custom?.type?.id) {
        t.is(result.actions[0].action, 'setCustomField');
      } else if (result?.actions[0]?.type?.key) {
        t.is(result.actions[0].action, 'setCustomType');
        t.is(result.actions[0].type.key, 'isv_payments_customer_tokens');
      } else {
        t.fail(`Unexpected error create response ${result}`);
      }
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

test.serial('Handle auth application', async (t) => {
  try {
    let result = await paymentActions.handleAuthApplication(PaymentAuthorizationServiceConstCC.payment as any, PaymentServiceConst.handleAuthApplication, PaymentServiceConst.authResponse, PaymentServiceConst.retrieveSyncResponseTransactionElement);
    if (Array.isArray(result?.actions) && result.actions.length !== 0) {
      t.is(result.actions[0].name, 'isv_payerEnrollTransactionId');
      t.is(result.actions[1].name, 'isv_payerEnrollHttpCode');
      t.is(result.actions[2].name, 'isv_payerEnrollStatus');
      t.is(result.actions[3].name, 'isv_payerAuthenticationTransactionId');
      t.is(result.actions[4].name, 'isv_tokenCaptureContextSignature');
      t.is(result.actions[5].name, 'isv_payerAuthenticationRequired');
      t.is(result.actions[6].action, 'addTransaction');
    } else {
      t.fail(`Unexpected error Handle auth ${result}`);
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

test.serial('Get payer auth actions when response is empty', async (t: any) => {
  try {
    let result = paymentActions.payerAuthActions(PaymentServiceConst.payerAuthActionsEmptyResponse);
    if (Array.isArray(result) && result.length !== 0) {
      t.is(result[0].action, 'setCustomField');
      t.is(result[0].name, 'isv_payerAuthenticationRequired');
      t.is(result[1].name, 'isv_payerAuthenticationTransactionId');
      t.is(result[2].name, 'isv_payerAuthenticationAcsUrl');
      t.is(result[3].name, 'isv_payerAuthenticationPaReq');
      t.is(result[4].name, 'isv_stepUpUrl');
      t.is(result[5].name, 'isv_responseJwt');
    } else {
      t.fail(`Unexpected error payer auth action${result}`);
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

test.serial('Get payer auth actions ', async (t: any) => {
  try {
    let result = paymentActions.payerAuthActions(PaymentServiceConst.payerAuthActionsResponse);
    if (Array.isArray(result) && result.length != 0 && result[result.length - 1]?.fields?.authenticationRequired) {
      t.is(result[result.length - 1].action, 'addInterfaceInteraction');
      t.is(result[result.length - 1]?.fields?.authenticationRequired, true);
      t.is(result[0].name, 'isv_payerAuthenticationRequired');
      t.is(result[0].value, true);
      t.is(result[1].name, 'isv_payerAuthenticationTransactionId');
      t.is(result[2].name, 'isv_payerAuthenticationAcsUrl');
      t.is(result[3].name, 'isv_payerAuthenticationPaReq');
      t.is(result[4].name, 'isv_stepUpUrl');
      t.is(result[5].name, 'isv_responseJwt');
    } else {
      t.fail(`Unexpected error payer auth action${result}`);
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

test.serial('get payer auth validate response', async (t) => {
  try {
    let result = await paymentActions.payerAuthValidateActions(PaymentServiceConst.authResponse, PaymentServiceConst.payerEnrollActionsResponse);
    if (result.actions.length != 0) {
      t.is(result.actions[0].name, 'isv_payerEnrollTransactionId');
      t.is(result.actions[1].name, 'isv_payerEnrollHttpCode');
      t.is(result.actions[2].name, 'isv_payerEnrollStatus');
      t.is(result.actions[3].name, 'isv_payerAuthenticationTransactionId');
      t.is(result.actions[4].name, 'isv_tokenCaptureContextSignature');
      t.is(result.actions[5].name, 'isv_payerAuthenticationRequired');
      t.is(result.actions[6].action, 'addTransaction');
      t.is(result.actions[7].action, 'addInterfaceInteraction');
    } else {
      t.fail(`Unexpected error payer auth action${result}`);
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

test.serial('Create enroll response actions ', (t) => {
  try {
    const result = paymentActions.createEnrollResponseActions(PaymentUtilsConst.setTransactionIdPaymentResponse, PaymentHandlerConst.getPayerAuthValidateResponseUpdatePaymentObj as any);
    if (result) {
      t.pass();
    } else {
      t.fail(`Unexpected error payer auth action${result}`);
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