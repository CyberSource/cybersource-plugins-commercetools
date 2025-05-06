import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../../../constants/paymentConstants';
import PaymentHelper from '../../../../utils/helpers/PaymentHelper';
import PaymentAuthorizationServiceConstAP from '../../../const/ApplePay/PaymentAuthorizationServiceConstAP';
import PaymentCaptureServiceConstCC from '../../../const/CreditCard/PaymentCaptureServiceConstCC';
import PaymentServiceConst from '../../../const/HelpersConst';

test.serial('Check response of get auth response with successful auth', async (t: any) => {
  try {
    let result = PaymentHelper.getAuthResponse(PaymentServiceConst.getAuthResponsePaymentResponse, PaymentServiceConst.getAuthResponseTransactionDetail);
    if (3 === result.actions.length) {
      t.is(result.actions[0].action, 'changeTransactionInteractionId');
      t.is(result.actions[1].action, 'changeTransactionState');
      t.is(result.actions[1].state, 'Success');
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

test.serial('Check response of get auth response object when auth is pending', async (t: any) => {
  try {
    let result = PaymentHelper.getAuthResponse(PaymentServiceConst.getAuthResponsePaymentResponseObject, PaymentServiceConst.getAuthResponseTransactionDetail);
    if (3 === result.actions.length) {
      t.is(result.actions[0].action, 'changeTransactionInteractionId');
      t.is(result.actions[1].action, 'changeTransactionState');
      t.is(result.actions[1].state, 'Pending');
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

test.serial('Check response of get auth response object when auth is declined', async (t: any) => {
  try {
    let result = PaymentHelper.getAuthResponse(PaymentServiceConst.getAuthResponsePaymentDeclinedResponse, PaymentServiceConst.getAuthResponseTransactionDetail);
    if (4 === result.actions.length) {
      t.is(result.actions[0].action, 'changeTransactionInteractionId');
      t.is(result.actions[1].action, 'changeTransactionState');
      t.is(result.actions[1].state, 'Failure');
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

test.serial('Check response of get auth response object when payer auth setup is completed', async (t: any) => {
  try {
    let result = PaymentHelper.getAuthResponse(PaymentServiceConst.getAuthResponsePaymentCompleteResponse, null);
    if (3 === result.actions.length) {
      t.is(result.actions[0].action, 'setCustomField');
      t.is(result.actions[0].name, 'isv_requestJwt');
      t.is(result.actions[1].action, 'setCustomField');
      t.is(result.actions[1].name, 'isv_cardinalReferenceId');
      t.is(result.actions[2].action, 'setCustomField');
      t.is(result.actions[2].name, 'isv_deviceDataCollectionUrl');
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

test.serial('Check response of get auth response object when authentication is pending', async (t: any) => {
  try {
    let result = PaymentHelper.getAuthResponse(PaymentServiceConst.getAuthResponsePaymentPendingResponse, null);
    if (8 === result.actions.length) {
      t.is(result.actions[0].action, 'setCustomField');
      t.is(result.actions[0].name, 'isv_payerAuthenticationRequired');
      t.is(result.actions[1].name, 'isv_payerAuthenticationTransactionId');
      t.is(result.actions[2].name, 'isv_payerAuthenticationAcsUrl');
      t.is(result.actions[3].name, 'isv_payerAuthenticationPaReq');
      t.is(result.actions[4].name, 'isv_stepUpUrl');
      t.is(result.actions[5].name, 'isv_responseJwt');
      t.is(result.actions[6].action, 'addInterfaceInteraction');
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

test.serial('Get payment response for credit card', async (t: any) => {
  try {
    let result: any = await PaymentHelper.getPaymentResponse(PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, null, PaymentServiceConst.getCreditCardResponseCartObj as any, PaymentServiceConst.getAuthResponseTransactionDetail, PaymentServiceConst.customerCardTokens, '');
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
        t.fail(`Unexpected Status: ${result.paymentResponse.status}`);
      }
    } else {
      t.fail(`Unexpected response: HTTP ${result.paymentResponse.httpCode}, Status: ${result.paymentResponse.status}`);
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

test.serial('Get payment response for apple pay', async (t: any) => {
  try {
    let result: any = await PaymentHelper.getPaymentResponse(PaymentAuthorizationServiceConstAP.payments as any, null, PaymentServiceConst.getCreditCardResponseCartObj as any, PaymentServiceConst.getAuthResponseTransactionDetail, PaymentServiceConst.customerCardTokens, '');
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
        t.fail(`Unexpected Status: ${result.paymentResponse.status}`);
      }
    } else {
      t.fail(`Unexpected response: HTTP ${result.paymentResponse.httpCode}, Status: ${result.paymentResponse.status}`);
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

test.serial('Get google pay response', async (t: any) => {
  try {
    let result: any = await PaymentHelper.getGooglePayResponse(PaymentServiceConst.getGooglePayResponseUpdatePaymentObj as any, PaymentServiceConst.getCreditCardResponseCartObj as any, PaymentServiceConst.getAuthResponseTransactionDetail, PaymentServiceConst.customerCardTokens, '');
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
        t.fail(`Unexpected Status: ${result.paymentResponse.status}`);
      }
    } else {
      t.fail(`Unexpected response: HTTP ${result.paymentResponse.httpCode}, Status: ${result.paymentResponse.status}`);
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

test.serial('Get click to pay response', async (t: any) => {
  try {
    let result: any = await PaymentHelper.getClickToPayResponse(PaymentServiceConst.getClickToPayResponseUpdatePaymentObj as any, PaymentServiceConst.getCreditCardResponseCartObj as any, PaymentServiceConst.getAuthResponseTransactionDetail, PaymentServiceConst.customerCardTokens, '');
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
          t.fail(`Unexpected Status: ${result.paymentResponse.status}`);
        }
      }
    } else {
      t.fail(`Unexpected response: HTTP ${result.paymentResponse.httpCode}, Status: ${result.paymentResponse.status}`);
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

test.serial('Set custom type for transaction', async (t:any) => {
  try {
    let result: any = PaymentHelper.setTransactionCustomType(PaymentServiceConst.getRefundResponseUpdateTransactions.id, PaymentServiceConst.getRefundResponseUpdateTransactions.amount.centAmount);
    if (result) {
      t.is(result.action, 'setTransactionCustomType');
      t.is(result.type.key, 'isv_transaction_data');
      t.is(result.type.typeId, 'type');
      t.is(result.fields.isv_availableCaptureAmount, PaymentServiceConst.getRefundResponseUpdateTransactions.amount.centAmount);
      t.is(result.transactionId, PaymentServiceConst.getRefundResponseUpdateTransactions.id);
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

test.serial('Set custom type for transaction when transaction id and amount is null', async (t:any) => {
  try {
    let result: any = PaymentHelper.setTransactionCustomType('', 0);
    if (result) {
      t.is(result.action, 'setTransactionCustomType');
      t.is(result.type.key, 'isv_transaction_data');
      t.is(result.type.typeId, 'type');
      t.is(result.fields.isv_availableCaptureAmount, 0);
      t.is(result.transactionId, '');
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

test.serial('Process transactions for authorization', async (t:any) => {
  try {
    const result = await PaymentHelper.processTransaction(PaymentCaptureServiceConstCC.payment as any);
    if (0 === result.actions.length) {
      t.deepEqual(result.actions, []);
      t.deepEqual(result.errors, []);
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