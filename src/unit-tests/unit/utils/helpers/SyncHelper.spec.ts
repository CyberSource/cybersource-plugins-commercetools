import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../../../constants/paymentConstants';
import CommercetoolsApi from '../../../../utils/api/CommercetoolsApi';
import syncHelper from '../../../../utils/helpers/SyncHelper';
import unit from '../../../JSON/unit.json';
import CommercetoolsApiConst from '../../../const/CommercetoolsApiConst';
import PaymentServiceConst from '../../../const/HelpersConst';
import SyncHelperConst from '../../../const/SyncHelperConst';

test('Select matching sync transaction by requestId with original precedence', (t) => {
  const transactions = [
    { id: 'auth-1', type: Constants.CT_TRANSACTION_TYPE_AUTHORIZATION, state: Constants.CT_TRANSACTION_STATE_PENDING, interactionId: 'auth-req-1' },
    { id: 'charge-1', type: Constants.CT_TRANSACTION_TYPE_CHARGE, state: Constants.CT_TRANSACTION_STATE_PENDING, interactionId: 'capture-req-1' },
  ];

  const result = syncHelper.selectMatchingSyncTransaction(transactions, 'auth-req-1', 'capture-req-1', false, Constants.HTTP_STATUS_DECISION_ACCEPT, 'CAPTURED');

  t.is(result.selectedTransaction?.id, 'charge-1');
  t.is(result.additionalTransaction, null);
  t.is(result.selectionLogData.pendingChargeFound, true);
});

test('Select matching sync transaction falls back to settlement-matched charge when none matched by requestId', (t) => {
  const transactions = [
    { id: 'auth-1', type: Constants.CT_TRANSACTION_TYPE_AUTHORIZATION, state: Constants.CT_TRANSACTION_STATE_INITIAL, interactionId: 'auth-req-1' },
    { id: 'charge-1', type: Constants.CT_TRANSACTION_TYPE_CHARGE, state: Constants.CT_TRANSACTION_STATE_PENDING, interactionId: 'unrelated-req' },
  ];

  const result = syncHelper.selectMatchingSyncTransaction(transactions, 'auth-req-1', 'capture-req-missing', true, Constants.HTTP_STATUS_DECISION_ACCEPT, 'CAPTURED');

  // pendingCharge found via the settlement fallback (not from the requestId-matched set) takes
  // selection precedence over the matched pending authorization - this mirrors the original's
  // unconditional `if (pendingCharge) { selectedTransaction = pendingCharge; }` check order.
  t.is(result.selectedTransaction?.id, 'charge-1');
  t.is(result.additionalTransaction, null);
  t.is(result.selectionLogData.pendingChargeFound, true);
});

test('Select matching sync transaction with no matches falls back to the last transaction', (t) => {
  const transactions = [
    { id: 'auth-1', type: Constants.CT_TRANSACTION_TYPE_AUTHORIZATION, state: Constants.CT_TRANSACTION_STATE_SUCCESS, interactionId: 'other-1' },
    { id: 'auth-2', type: Constants.CT_TRANSACTION_TYPE_AUTHORIZATION, state: Constants.CT_TRANSACTION_STATE_SUCCESS, interactionId: 'other-2' },
  ];

  const result = syncHelper.selectMatchingSyncTransaction(transactions, '', '', false, Constants.HTTP_STATUS_DECISION_ACCEPT, '');

  t.is(result.selectedTransaction?.id, 'auth-2');
  t.is(result.selectionLogData.matchedTransactionCount, 0);
});

test.serial('Retrieve sync response', async (t: any) => {
  try {
    let result = await syncHelper.retrieveSyncResponse(PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, PaymentServiceConst.retrieveSyncResponseTransactionElement);
    let i = 0;
    if (result && 'amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
      i++;
      t.is(i, 1);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Process application response when auth is present', async (t: any) => {
  try {
    const result = await syncHelper.processApplicationResponse(PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse, PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, SyncHelperConst.syncUpdateObject, PaymentServiceConst.retrieveSyncResponseTransactionElement);
    if (result) {
      let i = 0;
      if ('amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
        i++;
      }
      t.is(i, 1);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Process application response when capture is present', async (t: any) => {
  try {
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.authPresent = false;
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.capturePresent = true;
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.captureReasonCodePresent = true;
    const result = await syncHelper.processApplicationResponse(PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse, PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, SyncHelperConst.syncUpdateObject, PaymentServiceConst.retrieveSyncResponseTransactionElement);
    if (result) {
      let i = 0;
      if ('amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
        i++;
      }
      t.is(i, 1);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Process application response when auth reversal is present', async (t: any) => {
  try {
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.authPresent = false;
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.capturePresent = false;
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.authReversalPresent = true;
    const result = await syncHelper.processApplicationResponse(PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse, PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, SyncHelperConst.syncUpdateObject, PaymentServiceConst.retrieveSyncResponseTransactionElement);
    if (result) {
      let i = 0;
      if ('amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
        i++;
      }
      t.is(i, 1);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Process application response when refund is present', async (t: any) => {
  try {
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.authPresent = false;
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.capturePresent = false;
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.authReversalPresent = false;
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.refundPresent = true;
    const result = await syncHelper.processApplicationResponse(PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse, PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, SyncHelperConst.syncUpdateObject, PaymentServiceConst.retrieveSyncResponseTransactionElement);
    if (result) {
      let i = 0;
      if ('amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
        i++;
      }
      t.is(i, 1);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Run sync add transaction ', async (t: any) => {
  try {
    const result = await syncHelper.runSyncAddTransaction(CommercetoolsApiConst.syncAddTransactionObject, '100', true, true);
    if (result) {
      let i = 0;
      if ('amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
        i++;
      }
      t.is(i, 1);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Run sync add transaction when there is error', async (t: any) => {
  try {
    const result = await syncHelper.runSyncAddTransaction(CommercetoolsApiConst.syncAddTransactionObject, Constants.PAYMENT_GATEWAY_ERROR_REASON_CODE, true, true);
    if (result) {
      let i = 0;
      if ('amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
        i++;
      }
      t.is(i, 1);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Run sync add transaction when there is failure', async (t: any) => {
  try {
    const result = await syncHelper.runSyncAddTransaction(CommercetoolsApiConst.syncAddTransactionObject, Constants.PAYMENT_GATEWAY_FAILURE_REASON_CODE, true, true);
    if (result) {
      let i = 0;
      if ('amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
        i++;
      }
      t.is(i, 1);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Run sync add transaction when there is failure and auth reason code is not present', async (t: any) => {
  try {
    const result = await syncHelper.runSyncAddTransaction(CommercetoolsApiConst.syncAddTransactionObject, Constants.PAYMENT_GATEWAY_FAILURE_REASON_CODE, true, false);
    if (result) {
      let i = 0;
      if ('amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
        i++;
      }
      t.is(i, 1);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('add transaction for run sync when auth is not present', async (t: any) => {
  try {
    let result = await syncHelper.runSyncAddTransaction(PaymentServiceConst.runSyncAddTransactionSyncUpdateObject, '100', false, false);
    if (result) {
      t.is(result, true);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('add transaction for run sync when reason code is empty', async (t: any) => {
  try {
    let result = await syncHelper.runSyncAddTransaction(PaymentServiceConst.runSyncAddTransactionSyncUpdateObject, '', false, false);
    if (null === result) {
      t.is(result, null);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Run sync add transaction with refund', async (t: any) => {
  try {
    CommercetoolsApiConst.syncAddTransactionObject.type = Constants.CT_TRANSACTION_TYPE_REFUND;
    const result = await syncHelper.runSyncAddTransaction(CommercetoolsApiConst.syncAddTransactionObject, '100', true, true);
    if (result) {
      let i = 0;
      if ('amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
        i++;
      }
      t.is(i, 1);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Process update capture amount for run sync ', async (t: any) => {
  try {
    let paymentObject: any = await CommercetoolsApi.retrievePayment(unit.paymentId);
    let result = await syncHelper.processRunSyncUpdateCaptureAmount(PaymentServiceConst.captureResponse as any, 'f8269041-5c82-45f3-b45a-5c6586187cb1', paymentObject?.version, 300, 100);
    let i = 0;
    if (result && 'amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
      i++;
      t.is(i, 1);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Process update capture amount for run sync when payment id is empty', async (t: any) => {
  try {
    let paymentObject: any = await CommercetoolsApi.retrievePayment(unit.paymentId);
    let result = await syncHelper.processRunSyncUpdateCaptureAmount(PaymentServiceConst.captureResponse as any, '', paymentObject?.version, 300, 100);
    t.falsy(result);
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('check if auth reversal triggered', async (t: any) => {
  try {
    let result = await syncHelper.isAuthReversalTriggered(PaymentServiceConst.getAuthorizedAmountCapturePaymentObj as any, 'submitTimeUtc:[NOW/DAY-1DAY TO NOW/HOUR+1HOUR}');
    if ('boolean' === typeof result) {
      t.is(typeof result, 'boolean');
    } else {
      t.fail(`Unexpected Result:${result} with type: ${typeof result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Retrieve sync amount details when capture is present', async (t: any) => {
  try {
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.authReasonCodePresent = false;
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.capturePresent = true;
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.captureReasonCodePresent = true;
    let result = await syncHelper.retrieveSyncAmountDetails(PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, PaymentServiceConst.retrieveSyncResponseTransactionElement, PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse);
    if (result.centAmount && result.currencyCode) {
      t.is(result.centAmount, 4500);
      t.is(result.currencyCode, 'USD');
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('update capture amount for run sync', async (t: any) => {
  try {
    let result = await syncHelper.runSyncUpdateCaptureAmount(PaymentServiceConst.runSyncUpdateCaptureAmountUpdatePaymentObj as any, 1000);
    if (result) {
      let i = 0;
      if (result && 'amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
        i++;
        t.is(i, 1);
      } else {
        t.is(i, 0);
      }
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('update capture amount for run sync when amount is 0', async (t: any) => {
  try {
    let result = await syncHelper.runSyncUpdateCaptureAmount(PaymentServiceConst.runSyncUpdateCaptureAmountUpdatePaymentObj as any, 0);
    if (!result) {
      t.falsy(result);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('check if auth reversal triggered with empty query string', async (t: any) => {
  try {
    let result = await syncHelper.isAuthReversalTriggered(PaymentServiceConst.getAuthorizedAmountCapturePaymentObj as any, '');
    if ('boolean' === typeof result) {
      t.is(typeof result, 'boolean');
    } else {
      t.fail(`Unexpected Result:${result} with type: ${typeof result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('get the transaction summaries', async (t: any) => {
  try {
    let result: any = await syncHelper.getTransactionSummaries(PaymentServiceConst.getTransactionSummariesUpdatePaymentObj as any, 3);
    if (result) {
      let i = 0;
      if ('summaries' in result && 'historyPresent' in result) {
        i++;
      }
      t.is(i, 1);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('get the transaction summaries with retry count is 0', async (t: any) => {
  try {
    let result: any = await syncHelper.getTransactionSummaries(PaymentServiceConst.getTransactionSummariesUpdatePaymentObj as any, 0);
    if (result) {
      let i = 0;
      if ('summaries' in result && 'historyPresent' in result) {
        i++;
      }
      t.is(i, 1);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('check if auth reversal is triggered ', async (t: any) => {
  try {
    let result = await syncHelper.checkAuthReversalTriggered(
      PaymentServiceConst.getTransactionSummariesUpdatePaymentObj as any,
      PaymentServiceConst.getCreditCardResponseCartObj as any,
      PaymentServiceConst.checkAuthReversalTriggeredPaymentResponse,
      PaymentServiceConst.checkAuthReversalTriggeredUpdateActions,
    );
    if ('changeTransactionInteractionId' === result.actions[0].action && 'Success' === result.actions[1].state) {
      t.is(result.actions[0].action, 'changeTransactionInteractionId');
      t.is(result.actions[1].action, 'changeTransactionState');
      t.is(result.actions[1].state, 'Success');
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});


test.serial('updateDecisionSyncService forwards Decision Manager request id', async (t: any) => {
  const originalRetrievePayment = CommercetoolsApi.retrievePayment;
  const originalRetrievePaymentByInteractionId = CommercetoolsApi.retrievePaymentByInteractionId;
  const originalUpdateDecisionSync = CommercetoolsApi.updateDecisionSync;
  let capturedUpdateDecisionSync: any = null;

  (CommercetoolsApi as any).retrievePayment = async (paymentId: string) => {
    if (paymentId !== 'merchant-reference-1') {
      return null;
    }

    return {
      id: 'payment-1',
      version: 7,
      transactions: [
        {
          id: 'transaction-1',
          type: Constants.CT_TRANSACTION_TYPE_AUTHORIZATION,
          state: Constants.CT_TRANSACTION_STATE_PENDING,
          interactionId: 'legacy-request-id',
        },
      ],
    };
  };

  (CommercetoolsApi as any).retrievePaymentByInteractionId = async () => {
    throw new Error('retrievePaymentByInteractionId should not be called for this test');
  };

  (CommercetoolsApi as any).updateDecisionSync = async (decisionUpdateObject: any, transactionId: string) => {
    capturedUpdateDecisionSync = { decisionUpdateObject, transactionId };
    return { consolidatedTime: '1' };
  };

  try {
    const result = await syncHelper.updateDecisionSyncService([
      {
        merchantReferenceNumber: 'merchant-reference-1',
        requestId: 'decision-request-1',
        newDecision: Constants.HTTP_STATUS_DECISION_ACCEPT,
        source: 'Decision Manager',
      },
    ]);

    t.true(result);
    t.deepEqual(capturedUpdateDecisionSync, {
      decisionUpdateObject: {
        id: 'payment-1',
        version: 7,
        state: Constants.CT_TRANSACTION_STATE_SUCCESS,
        interactionId: 'decision-request-1',
      },
      transactionId: 'transaction-1',
    });
  } finally {
    (CommercetoolsApi as any).retrievePayment = originalRetrievePayment;
    (CommercetoolsApi as any).retrievePaymentByInteractionId = originalRetrievePaymentByInteractionId;
    (CommercetoolsApi as any).updateDecisionSync = originalUpdateDecisionSync;
  }
});


test.serial('Get applications present', async (t: any) => {
  try {
    let result = await syncHelper.getApplicationsPresent(PaymentServiceConst.getPresentApplications);
    let i = 0;
    if ('authPresent' in result && 'authReasonCodePresent' in result && 'capturePresent' in result && 'captureReasonCodePresent' in result && 'authReversalPresent' in result && 'refundPresent' in result) {
      i++;
    }
    if (i === 1) {
      t.is(i, 1);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

// ========== NEW TEST CASES: Sale Transaction + Fraud Decision Webhook ==========

test.serial('[FRAUD DECISION] Scenario 1: Auth-only pending review - ACCEPT', async (t: any) => {
  const originalRetrievePayment = CommercetoolsApi.retrievePayment;
  const originalRetrievePaymentByInteractionId = CommercetoolsApi.retrievePaymentByInteractionId;
  const originalUpdateDecisionSync = CommercetoolsApi.updateDecisionSync;
  let capturedUpdateDecisionSync: any = null;

  (CommercetoolsApi as any).retrievePayment = async (paymentId: string) => {
    if (paymentId !== 'auth-only-merchant-ref') {
      return null;
    }

    return {
      id: 'payment-auth-only',
      version: 5,
      transactions: [
        {
          id: 'auth-transaction',
          type: Constants.CT_TRANSACTION_TYPE_AUTHORIZATION,
          state: Constants.CT_TRANSACTION_STATE_PENDING,
          interactionId: 'request-id-auth-only',
          amount: { centAmount: 10000, currencyCode: 'USD' },
        },
      ],
    };
  };

  (CommercetoolsApi as any).retrievePaymentByInteractionId = async () => {
    throw new Error('retrievePaymentByInteractionId should not be called for this test');
  };

  (CommercetoolsApi as any).updateDecisionSync = async (decisionUpdateObject: any, transactionId: string) => {
    capturedUpdateDecisionSync = { decisionUpdateObject, transactionId };
    return { consolidatedTime: '1' };
  };

  try {
    const result = await syncHelper.updateDecisionSyncService([
      {
        merchantReferenceNumber: 'auth-only-merchant-ref',
        requestId: 'request-id-auth-only',
        newDecision: Constants.HTTP_STATUS_DECISION_ACCEPT,
        source: 'Decision Manager',
      },
    ]);

    t.true(result, 'Decision sync should succeed for auth-only pending');
    t.is(capturedUpdateDecisionSync.transactionId, 'auth-transaction', 'Should select the Pending Authorization transaction');
    t.is(capturedUpdateDecisionSync.decisionUpdateObject.state, Constants.CT_TRANSACTION_STATE_SUCCESS, 'Should update Authorization to Success');
  } finally {
    (CommercetoolsApi as any).retrievePayment = originalRetrievePayment;
    (CommercetoolsApi as any).retrievePaymentByInteractionId = originalRetrievePaymentByInteractionId;
    (CommercetoolsApi as any).updateDecisionSync = originalUpdateDecisionSync;
  }
});

test.serial('[FRAUD DECISION] Scenario 2: Sale flow pending review (Auth=Initial, Charge=Pending) - ACCEPT', async (t: any) => {
  const originalRetrievePayment = CommercetoolsApi.retrievePayment;
  const originalRetrievePaymentByInteractionId = CommercetoolsApi.retrievePaymentByInteractionId;
  const originalUpdateDecisionSync = CommercetoolsApi.updateDecisionSync;
  let capturedUpdateDecisionSync: any = null;

  (CommercetoolsApi as any).retrievePayment = async (paymentId: string) => {
    if (paymentId !== 'sale-merchant-ref') {
      return null;
    }

    return {
      id: 'payment-sale',
      version: 8,
      transactions: [
        {
          id: 'auth-transaction',
          type: Constants.CT_TRANSACTION_TYPE_AUTHORIZATION,
          state: Constants.CT_TRANSACTION_STATE_INITIAL,
          interactionId: 'request-id-sale',
          amount: { centAmount: 15000, currencyCode: 'USD' },
        },
        {
          id: 'charge-transaction',
          type: Constants.CT_TRANSACTION_TYPE_CHARGE,
          state: Constants.CT_TRANSACTION_STATE_PENDING,
          interactionId: 'request-id-sale',
          amount: { centAmount: 15000, currencyCode: 'USD' },
        },
      ],
    };
  };

  (CommercetoolsApi as any).retrievePaymentByInteractionId = async () => {
    throw new Error('retrievePaymentByInteractionId should not be called for this test');
  };

  (CommercetoolsApi as any).updateDecisionSync = async (decisionUpdateObject: any, transactionId: string) => {
    capturedUpdateDecisionSync = { decisionUpdateObject, transactionId };
    return { consolidatedTime: '1' };
  };

  try {
    const result = await syncHelper.updateDecisionSyncService([
      {
        merchantReferenceNumber: 'sale-merchant-ref',
        requestId: 'request-id-sale',
        newDecision: Constants.HTTP_STATUS_DECISION_ACCEPT,
        source: 'Decision Manager',
      },
    ]);

    t.true(result, 'Decision sync should succeed for sale flow pending review');
    t.is(capturedUpdateDecisionSync.transactionId, 'charge-transaction', 'Should select the Pending Charge transaction, not Initial Authorization');
    t.is(capturedUpdateDecisionSync.decisionUpdateObject.state, Constants.CT_TRANSACTION_STATE_SUCCESS, 'Should update Charge to Success');
  } finally {
    (CommercetoolsApi as any).retrievePayment = originalRetrievePayment;
    (CommercetoolsApi as any).retrievePaymentByInteractionId = originalRetrievePaymentByInteractionId;
    (CommercetoolsApi as any).updateDecisionSync = originalUpdateDecisionSync;
  }
});

test.serial('[FRAUD DECISION] Scenario 3: Sale flow reject (Auth=Initial, Charge=Pending) - REJECT', async (t: any) => {
  const originalRetrievePayment = CommercetoolsApi.retrievePayment;
  const originalRetrievePaymentByInteractionId = CommercetoolsApi.retrievePaymentByInteractionId;
  const originalUpdateDecisionSync = CommercetoolsApi.updateDecisionSync;
  let capturedUpdateDecisionSync: any = null;

  (CommercetoolsApi as any).retrievePayment = async (paymentId: string) => {
    if (paymentId !== 'sale-reject-merchant-ref') {
      return null;
    }

    return {
      id: 'payment-sale-reject',
      version: 7,
      transactions: [
        {
          id: 'auth-transaction-reject',
          type: Constants.CT_TRANSACTION_TYPE_AUTHORIZATION,
          state: Constants.CT_TRANSACTION_STATE_INITIAL,
          interactionId: 'request-id-sale-reject',
          amount: { centAmount: 20000, currencyCode: 'USD' },
        },
        {
          id: 'charge-transaction-reject',
          type: Constants.CT_TRANSACTION_TYPE_CHARGE,
          state: Constants.CT_TRANSACTION_STATE_PENDING,
          interactionId: 'request-id-sale-reject',
          amount: { centAmount: 20000, currencyCode: 'USD' },
        },
      ],
    };
  };

  (CommercetoolsApi as any).retrievePaymentByInteractionId = async () => {
    throw new Error('retrievePaymentByInteractionId should not be called for this test');
  };

  (CommercetoolsApi as any).updateDecisionSync = async (decisionUpdateObject: any, transactionId: string) => {
    capturedUpdateDecisionSync = { decisionUpdateObject, transactionId };
    return { consolidatedTime: '1' };
  };

  try {
    const result = await syncHelper.updateDecisionSyncService([
      {
        merchantReferenceNumber: 'sale-reject-merchant-ref',
        requestId: 'request-id-sale-reject',
        newDecision: Constants.HTTP_STATUS_DECISION_REJECT,
        source: 'Decision Manager',
      },
    ]);

    t.true(result, 'Decision sync should succeed for sale flow reject');
    t.is(capturedUpdateDecisionSync.transactionId, 'charge-transaction-reject', 'Should select Charge transaction for rejection');
    t.is(capturedUpdateDecisionSync.decisionUpdateObject.state, Constants.CT_TRANSACTION_STATE_FAILURE, 'Should update Charge to Failure');
  } finally {
    (CommercetoolsApi as any).retrievePayment = originalRetrievePayment;
    (CommercetoolsApi as any).retrievePaymentByInteractionId = originalRetrievePaymentByInteractionId;
    (CommercetoolsApi as any).updateDecisionSync = originalUpdateDecisionSync;
  }
});

test.serial('[FRAUD DECISION] Scenario 4: Initial Authorization without Charge does not block update', async (t: any) => {
  const originalRetrievePayment = CommercetoolsApi.retrievePayment;
  const originalRetrievePaymentByInteractionId = CommercetoolsApi.retrievePaymentByInteractionId;
  const originalUpdateDecisionSync = CommercetoolsApi.updateDecisionSync;

  (CommercetoolsApi as any).retrievePayment = async (paymentId: string) => {
    if (paymentId !== 'auth-initial-only-merchant-ref') {
      return null;
    }

    // No matching transaction by requestId, should fallback to latest
    return {
      id: 'payment-auth-initial-only',
      version: 3,
      transactions: [
        {
          id: 'auth-initial-transaction',
          type: Constants.CT_TRANSACTION_TYPE_AUTHORIZATION,
          state: Constants.CT_TRANSACTION_STATE_INITIAL,
          interactionId: 'old-interaction-id',
          amount: { centAmount: 5000, currencyCode: 'USD' },
        },
      ],
    };
  };

  (CommercetoolsApi as any).retrievePaymentByInteractionId = async () => {
    throw new Error('retrievePaymentByInteractionId should not be called for this test');
  };

  (CommercetoolsApi as any).updateDecisionSync = async () => {
    // Should not be called for this scenario
    throw new Error('updateDecisionSync should not be called when no pending transaction found');
  };

  try {
    const result = await syncHelper.updateDecisionSyncService([
      {
        merchantReferenceNumber: 'auth-initial-only-merchant-ref',
        requestId: 'request-id-auth-initial-only',
        newDecision: Constants.HTTP_STATUS_DECISION_ACCEPT,
        source: 'Decision Manager',
      },
    ]);

    // Should fail because no matching transaction has the requestId and the latest transaction is Initial (not Pending)
    t.false(result, 'Should not update when no pending transaction exists with matching requestId');
  } finally {
    (CommercetoolsApi as any).retrievePayment = originalRetrievePayment;
    (CommercetoolsApi as any).retrievePaymentByInteractionId = originalRetrievePaymentByInteractionId;
    (CommercetoolsApi as any).updateDecisionSync = originalUpdateDecisionSync;
  }
});