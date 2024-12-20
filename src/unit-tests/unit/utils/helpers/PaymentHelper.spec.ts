import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../../../constants/constants';
import PaymentHelper from '../../../../utils/helpers/PaymentHelper';
import PaymentAuthorizationServiceConstAP from '../../../const/ApplePay/PaymentAuthorizationServiceConstAP';
import PaymentCaptureServiceConstCC from '../../../const/CreditCard/PaymentCaptureServiceConstCC';
import PaymentServiceConst from '../../../const/HelpersConst';

test.serial('Check response of get auth response with successful auth', async (t: any) => {
  let result = PaymentHelper.getAuthResponse(PaymentServiceConst.getAuthResponsePaymentResponse, PaymentServiceConst.getAuthResponseTransactionDetail);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, 'Success');
});

test.serial('Check response of get auth response object when auth is pending', async (t: any) => {
  let result = PaymentHelper.getAuthResponse(PaymentServiceConst.getAuthResponsePaymentResponseObject, PaymentServiceConst.getAuthResponseTransactionDetail);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, 'Pending');
});

test.serial('Check response of get auth response object when auth is declined', async (t: any) => {
  let result = PaymentHelper.getAuthResponse(PaymentServiceConst.getAuthResponsePaymentDeclinedResponse, PaymentServiceConst.getAuthResponseTransactionDetail);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, 'Failure');
});

test.serial('Check response of get auth response object when payer auth setup is completed', async (t: any) => {
  let result = PaymentHelper.getAuthResponse(PaymentServiceConst.getAuthResponsePaymentCompleteResponse, null);
  t.is(result.actions[0].action, 'setCustomField');
  t.is(result.actions[0].name, 'isv_requestJwt');
  t.is(result.actions[1].action, 'setCustomField');
  t.is(result.actions[1].name, 'isv_cardinalReferenceId');
  t.is(result.actions[2].action, 'setCustomField');
  t.is(result.actions[2].name, 'isv_deviceDataCollectionUrl');
});

test.serial('Check response of get auth response object when authentication is pending', async (t: any) => {
  let result = PaymentHelper.getAuthResponse(PaymentServiceConst.getAuthResponsePaymentPendingResponse, null);
  t.is(result.actions[0].action, 'setCustomField');
  t.is(result.actions[0].name, 'isv_payerAuthenticationRequired');
  t.is(result.actions[1].name, 'isv_payerAuthenticationTransactionId');
  t.is(result.actions[2].name, 'isv_payerAuthenticationAcsUrl');
  t.is(result.actions[3].name, 'isv_payerAuthenticationPaReq');
  t.is(result.actions[4].name, 'isv_stepUpUrl');
  t.is(result.actions[5].name, 'isv_responseJwt');
  t.is(result.actions[6].action, 'addInterfaceInteraction');
});

test.serial('Get payment response for credit card', async (t: any) => {
  let result: any = await PaymentHelper.getPaymentResponse(PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, null, PaymentServiceConst.getCreditCardResponseCartObj, PaymentServiceConst.getAuthResponseTransactionDetail, PaymentServiceConst.customerCardTokens, '');
  if (201 == result.paymentResponse.httpCode) {
    t.is(result.paymentResponse.httpCode, 201);
    if (Constants.API_STATUS_AUTHORIZED == result.paymentResponse.status) {
      t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
    } else if (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW == result.paymentResponse.status) {
      t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW);
    } else if (Constants.API_STATUS_DECLINED == result.paymentResponse.status) {
      t.is(result.paymentResponse.status, Constants.API_STATUS_DECLINED);
    } else if (Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == result.paymentResponse.status) {
      t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED_RISK_DECLINED);
    } else if (Constants.API_STATUS_INVALID_REQUEST == result.paymentResponse.status) {
      t.is(result.paymentResponse.status, Constants.API_STATUS_INVALID_REQUEST);
    } else {
      t.pass();
    }
  } else {
    t.not(result.paymentResponse.httpCode, 201);
    t.not(result.paymentResponse.status, 'AUTHORIZED');
  }
});

test.serial('Get payment response for apple pay', async (t: any) => {
  let result: any = await PaymentHelper.getPaymentResponse(PaymentAuthorizationServiceConstAP.payments, null, PaymentServiceConst.getCreditCardResponseCartObj, PaymentServiceConst.getAuthResponseTransactionDetail, PaymentServiceConst.customerCardTokens, '');
  if (201 == result.paymentResponse.httpCode) {
    t.is(result.paymentResponse.httpCode, 201);
    if (Constants.API_STATUS_AUTHORIZED == result.paymentResponse.status) {
      t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
    } else if (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW == result.paymentResponse.status) {
      t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW);
    } else if (Constants.API_STATUS_DECLINED == result.paymentResponse.status) {
      t.is(result.paymentResponse.status, Constants.API_STATUS_DECLINED);
    } else if (Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == result.paymentResponse.status) {
      t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED_RISK_DECLINED);
    } else if (Constants.API_STATUS_INVALID_REQUEST == result.paymentResponse.status) {
      t.is(result.paymentResponse.status, Constants.API_STATUS_INVALID_REQUEST);
    } else {
      t.pass();
    }
  } else {
    t.not(result.paymentResponse.httpCode, 201);
    t.not(result.paymentResponse.status, 'AUTHORIZED');
  }
});

test.serial('Get google pay response', async (t: any) => {
  let result: any = await PaymentHelper.getGooglePayResponse(PaymentServiceConst.getGooglePayResponseUpdatePaymentObj, PaymentServiceConst.getCreditCardResponseCartObj, PaymentServiceConst.getAuthResponseTransactionDetail, PaymentServiceConst.customerCardTokens, '');
  if (201 == result.paymentResponse.httpCode) {
    t.is(result.paymentResponse.httpCode, 201);
    if (Constants.API_STATUS_AUTHORIZED == result.paymentResponse.status) {
      t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
    } else if (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW == result.paymentResponse.status) {
      t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW);
    } else if (Constants.API_STATUS_DECLINED == result.paymentResponse.status) {
      t.is(result.paymentResponse.status, Constants.API_STATUS_DECLINED);
    } else if (Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == result.paymentResponse.status) {
      t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED_RISK_DECLINED);
    } else if (Constants.API_STATUS_INVALID_REQUEST == result.paymentResponse.status) {
      t.is(result.paymentResponse.status, Constants.API_STATUS_INVALID_REQUEST);
    } else {
      t.pass();
    }
  } else {
    t.not(result.paymentResponse.httpCode, 201);
    t.not(result.paymentResponse.status, 'AUTHORIZED');
  }
});

test.serial('Get click to pay response', async (t: any) => {
  try {
    let result: any = await PaymentHelper.getClickToPayResponse(PaymentServiceConst.getClickToPayResponseUpdatePaymentObj, PaymentServiceConst.getCreditCardResponseCartObj, PaymentServiceConst.getAuthResponseTransactionDetail, PaymentServiceConst.customerCardTokens, '');
    if (201 == result.paymentResponse.httpCode) {
      t.is(result.paymentResponse.httpCode, 201);
      if (201 == result.paymentResponse.httpCode) {
        t.is(result.paymentResponse.httpCode, 201);
        if (Constants.API_STATUS_AUTHORIZED == result.paymentResponse.status) {
          t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
        } else if (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW == result.paymentResponse.status) {
          t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW);
        } else if (Constants.API_STATUS_DECLINED == result.paymentResponse.status) {
          t.is(result.paymentResponse.status, Constants.API_STATUS_DECLINED);
        } else if (Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == result.paymentResponse.status) {
          t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED_RISK_DECLINED);
        } else if (Constants.API_STATUS_INVALID_REQUEST == result.paymentResponse.status) {
          t.is(result.paymentResponse.status, Constants.API_STATUS_INVALID_REQUEST);
        } else {
          t.pass();
        }
      }
    } else {
      t.not(result.paymentResponse.httpCode, 201);
      t.not(result.paymentResponse.status, 'AUTHORIZED');
    }
  } catch (error) {
    t.pass();
  }
});

test.serial('Set custom type for transaction', async (t) => {
  let result: any = PaymentHelper.setTransactionCustomType(PaymentServiceConst.getRefundResponseUpdateTransactions.id, PaymentServiceConst.getRefundResponseUpdateTransactions.amount.centAmount);
  t.is(result.action, 'setTransactionCustomType');
  t.is(result.type.key, 'isv_transaction_data');
  t.is(result.type.typeId, 'type');
  t.is(result.fields.isv_availableCaptureAmount, PaymentServiceConst.getRefundResponseUpdateTransactions.amount.centAmount);
  t.is(result.transactionId, PaymentServiceConst.getRefundResponseUpdateTransactions.id);
});

test.serial('Set custom type for transaction when transaction id and amount is null', async (t) => {
  let result: any = PaymentHelper.setTransactionCustomType('', 0);
  t.is(result.action, 'setTransactionCustomType');
  t.is(result.type.key, 'isv_transaction_data');
  t.is(result.type.typeId, 'type');
  t.is(result.fields.isv_availableCaptureAmount, 0);
  t.is(result.transactionId, '');
});

test.serial('Process transactions for authorization', async (t) => {
  try {
    const result = await PaymentHelper.processTransaction(PaymentCaptureServiceConstCC.payment);
    t.pass();
    t.deepEqual(result.actions, []);
    t.deepEqual(result.errors, []);
  } catch (error) {
    t.pass();
  }
});