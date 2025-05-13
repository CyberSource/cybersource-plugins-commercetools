import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import OrderManagementHelper from '../../../../utils/helpers/OrderManagementHelper';
import PaymentAuthorizationServiceConstCC from '../../../const/CreditCard/PaymentAuthorizationServiceConstCC';
import PaymentCaptureServiceConstCC from '../../../const/CreditCard/PaymentCaptureServiceConstCC';
import PaymentServiceConst from '../../../const/HelpersConst';

test.serial('Get OM Service Response', async (t: any) => {
  try {
    let result: any = OrderManagementHelper.getOMServiceResponse(PaymentServiceConst.getOMServiceResponsePaymentResponse, PaymentServiceConst.getOMServiceResponseTransactionDetail, '123', 0);
    if (3 <= result.actions.length) {
      t.is(result.actions[0].action, 'changeTransactionInteractionId');
      t.is(result.actions[1].action, 'changeTransactionState');
      t.is(result.actions[1].state, 'Success');
    } else {
      t.fail(`Unexpected result, length: ${result.actions.length}`);
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

test.serial('Get OM Service Response when capture id is empty', async (t: any) => {
  try {
    let result: any = OrderManagementHelper.getOMServiceResponse(PaymentServiceConst.getOMServiceResponsePaymentResponse, PaymentServiceConst.getOMServiceResponseTransactionDetail, '123', 0);
    if (3 <= result.actions.length) {
      t.is(result.actions[0].action, 'changeTransactionInteractionId');
      t.is(result.actions[1].action, 'changeTransactionState');
      t.is(result.actions[1].state, 'Success');
    } else {
      t.fail(`Unexpected result, length: ${result.actions.length}`);
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

test.serial('Get OM Service Response for failure', async (t: any) => {
  try {
    let result: any = OrderManagementHelper.getOMServiceResponse(PaymentServiceConst.getOMServiceResponsePaymentResponseObject, PaymentServiceConst.getOMServiceResponseTransactionDetail, '', 0);
    if (3 <= result.actions.length) {
      t.is(result.actions[0].action, 'changeTransactionInteractionId');
      t.is(result.actions[1].action, 'changeTransactionState');
      t.is(result.actions[1].state, 'Failure');
      t.is(result.actions[2].action, 'addInterfaceInteraction');
      t.is(result.actions[2].type.key, 'isv_payment_failure');
    } else {
      t.fail(`Unexpected result, length: ${result.actions.length}`);
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

test.serial('Get captured amount', async (t: any) => {
  try {
    let result = OrderManagementHelper.getCapturedAmount(PaymentServiceConst.getCapturedAmountRefundPaymentObj as any);
    if (69.7 === result) {
      t.is(result, 69.7);
    } else {
      t.fail(`Unexpected result, amount: ${result}`);
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

test.serial('Get authorize amount', async (t: any) => {
  try {
    let result = OrderManagementHelper.getAuthorizedAmount(PaymentServiceConst.getAuthorizedAmountCapturePaymentObj as any);
    if (44.9 === result) {
      t.is(result, 44.9);
    } else {
      t.fail(`Unexpected result, amount: ${result}`);
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

test.serial('Get refund response', async (t: any) => {
  try {
    let result: any = await OrderManagementHelper.getRefundResponse(PaymentServiceConst.getRefundResponseUpdatePaymentObj as any, PaymentServiceConst.getRefundResponseUpdateTransactions, '');
    if (3 === result?.actions.length) {
      t.is(result.actions[0].action, 'changeTransactionInteractionId');
      t.is(result.actions[1].action, 'changeTransactionState');
      t.is(result.actions[2].action, 'addInterfaceInteraction');
    } else {
      t.fail(`Unexpected result : ${result}`);
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

test.serial('Handle auth reversal response', async (t) => {
  try {
    let result = await OrderManagementHelper.handleAuthReversalResponse(PaymentAuthorizationServiceConstCC.payment as any, PaymentCaptureServiceConstCC.cart as any, PaymentServiceConst.checkAuthReversalTriggeredPaymentResponse, PaymentServiceConst.handleAuthReversalResponseUpdateActions);
    if (5 <= result.actions.length) {
      t.is(result.actions[0].action, 'changeTransactionInteractionId');
      t.is(result.actions[1].action, 'changeTransactionState');
      t.is(result.actions[2].name, 'isv_tokenCaptureContextSignature');
      t.is(result.actions[3].action, 'addTransaction');
      t.is(result.actions[4].action, 'addTransaction');
    } else {
      t.fail(`Unexpected result : ${JSON.stringify(result)}`);
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

test.serial('Get authorize amount when cent amount is zero', async (t: any) => {
  try {
    let result = OrderManagementHelper.getAuthorizedAmount(PaymentServiceConst.getAuthorizedZeroAmountCapturePaymentObj as any);
    if (0.4 === result) {
      t.is(result, 0.4);
    } else {
      t.fail(`Unexpected result : amount ${result}`);
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

test.serial('Get captured amount when amount is zero', async (t: any) => {
  try {
    let result = OrderManagementHelper.getCapturedAmount(PaymentServiceConst.getCapturedZeroAmountRefundPaymentObj as any);
    if (0 === result) {
      t.is(result, 0);
    } else {
      t.fail(`Unexpected result : amount ${result}`);
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