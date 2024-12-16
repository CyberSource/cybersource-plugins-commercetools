import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import OrderManagementHelper from '../../../../utils/helpers/OrderManagementHelper';
import PaymentAuthorizationServiceConstCC from '../../../const/CreditCard/PaymentAuthorizationServiceConstCC';
import PaymentCaptureServiceConstCC from '../../../const/CreditCard/PaymentCaptureServiceConstCC';
import PaymentServiceConst from '../../../const/HelpersConst';

test.serial('Get OM Service Response', async (t: any) => {
  let result: any = OrderManagementHelper.getOMServiceResponse(PaymentServiceConst.getOMServiceResponsePaymentResponse, PaymentServiceConst.getOMServiceResponseTransactionDetail, '123', 0);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, 'Success');
});

test.serial('Get OM Service Response when capture id is empty', async (t: any) => {
  let result: any = OrderManagementHelper.getOMServiceResponse(PaymentServiceConst.getOMServiceResponsePaymentResponse, PaymentServiceConst.getOMServiceResponseTransactionDetail, '123', 0);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, 'Success');
});

test.serial('Get OM Service Response for failure', async (t: any) => {
  let result: any = OrderManagementHelper.getOMServiceResponse(PaymentServiceConst.getOMServiceResponsePaymentResponseObject, PaymentServiceConst.getOMServiceResponseTransactionDetail, '', 0);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, 'Failure');
  t.is(result.actions[2].action, 'addInterfaceInteraction');
  t.is(result.actions[2].type.key, 'isv_payment_failure');
});

test.serial('Get captured amount', async (t: any) => {
  let result = OrderManagementHelper.getCapturedAmount(PaymentServiceConst.getCapturedAmountRefundPaymentObj);
  t.is(result, 69.7);
});

test.serial('Get authorize amount', async (t: any) => {
  let result = OrderManagementHelper.getAuthorizedAmount(PaymentServiceConst.getAuthorizedAmountCapturePaymentObj);
  t.is(result, 44.9);
});

test.serial('Get refund response', async (t: any) => {
  let result: any = await OrderManagementHelper.getRefundResponse(PaymentServiceConst.getRefundResponseUpdatePaymentObj, PaymentServiceConst.getRefundResponseUpdateTransactions, '');
  if (result?.actions.length) {
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
    t.is(result.actions[2].action, 'addInterfaceInteraction');
  } else {
    t.deepEqual(result.actions, []);
    t.deepEqual(result.errors, []);
  }
});


test.serial('Handle auth reversal response', async (t) => {
  let result = await OrderManagementHelper.handleAuthReversalResponse(PaymentAuthorizationServiceConstCC.payment, PaymentCaptureServiceConstCC.cart, PaymentServiceConst.checkAuthReversalTriggeredPaymentResponse, PaymentServiceConst.handleAuthReversalResponseUpdateActions);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[2].name, 'isv_tokenCaptureContextSignature');
  t.is(result.actions[3].action, 'addTransaction');
  t.is(result.actions[4].action, 'addTransaction');
});

test.serial('Get authorize amount when cent amount is zero', async (t: any) => {
  let result = OrderManagementHelper.getAuthorizedAmount(PaymentServiceConst.getAuthorizedZeroAmountCapturePaymentObj);
  t.is(result, 0.4);
});

test.serial('Get captured amount when amount is zero', async (t: any) => {
  let result = OrderManagementHelper.getCapturedAmount(PaymentServiceConst.getCapturedZeroAmountRefundPaymentObj);
  t.is(result, 0);
});


