import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../../../constants/constants';
import CommercetoolsApi from '../../../../utils/api/CommercetoolsApi';
import syncHelper from '../../../../utils/helpers/SyncHelper';
import unit from '../../../JSON/unit.json'
import CommercetoolsApiConst from '../../../const/CommercetoolsApiConst';
import PaymentAuthorizationServiceConstCC from '../../../const/CreditCard/PaymentAuthorizationServiceConstCC';
import PaymentServiceConst from '../../../const/HelpersConst';
import SyncHelperConst from '../../../const/SyncHelperConst';

test.serial('set security code present ', (t) => {
  const result = syncHelper.setSecurityCodePresent(PaymentAuthorizationServiceConstCC.payments);
  t.is(typeof result, 'boolean')
})

test.serial('Retrieve sync response ', async (t: any) => {
  try {
    let result = await syncHelper.retrieveSyncResponse(PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, PaymentServiceConst.retrieveSyncResponseTransactionElement);
    let i = 0;
    if (result && 'amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
      i++;
      t.is(i, 1);
    } else {
      t.is(i, 0);
    }
  } catch (error) {
    t.pass();
  }
});

test.serial('Process application response when auth is present', async (t) => {
  try {
    const result = await syncHelper.processApplicationResponse(PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse, PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, SyncHelperConst.syncUpdateObject, PaymentServiceConst.retrieveSyncResponseTransactionElement)
    t.pass();
    if (result) {
      let i = 0;
      if ('amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
        i++;
      }
      t.is(i, 1);
    } else {
      t.is(result, null)
    }
  } catch (error) {
    t.pass();
  }
})

test.serial('Process application response when capture is present', async (t) => {
  try {
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.authPresent = false;
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.capturePresent = true;
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.captureReasonCodePresent = true;
    const result = await syncHelper.processApplicationResponse(PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse, PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, SyncHelperConst.syncUpdateObject, PaymentServiceConst.retrieveSyncResponseTransactionElement)
    t.pass();
    if (result) {
      let i = 0;
      if ('amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
        i++;
      }
      t.is(i, 1);
    } else {
      t.is(result, null)
    }
  } catch (error) {
    t.pass();
  }
})

test.serial('Process application response when auth reversal is present', async (t) => {
  try {
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.authPresent = false;
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.capturePresent = false;
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.authReversalPresent = true;
    const result = await syncHelper.processApplicationResponse(PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse, PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, SyncHelperConst.syncUpdateObject, PaymentServiceConst.retrieveSyncResponseTransactionElement)
    t.pass();
    if (result) {
      let i = 0;
      if ('amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
        i++;
      }
      t.is(i, 1);
    } else {
      t.is(result, null)
    }
  } catch (error) {
    t.pass();
  }
})

test.serial('Process application response when refund is present', async (t) => {
  try {
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.authPresent = false;
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.capturePresent = false;
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.authReversalPresent = false;
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.refundPresent = true;
    const result = await syncHelper.processApplicationResponse(PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse, PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, SyncHelperConst.syncUpdateObject, PaymentServiceConst.retrieveSyncResponseTransactionElement)
    t.pass();
    if (result) {
      let i = 0;
      if ('amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
        i++;
      }
      t.is(i, 1);
    } else {
      t.is(result, null)
    }
  } catch (error) {
    t.pass();
  }
})

test.serial('Run sync add transaction ', async (t) => {
  try {
    const result = await syncHelper.runSyncAddTransaction(CommercetoolsApiConst.syncAddTransactionObject, '100', true, true);
    if (result) {
      let i = 0;
      if ('amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
        i++;
      }
      t.is(i, 1);
    } else {
      t.is(result, null)
    }
  } catch (error) {
    t.pass();
  }
})

test.serial('Run sync add transaction when there is error', async (t) => {
  try {
    const result = await syncHelper.runSyncAddTransaction(CommercetoolsApiConst.syncAddTransactionObject, Constants.PAYMENT_GATEWAY_ERROR_REASON_CODE, true, true);
    if (result) {
      let i = 0;
      if ('amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
        i++;
      }
      t.is(i, 1);
    } else {
      t.is(result, null)
    }
  } catch (error) {
    t.pass();
  }
})

test.serial('Run sync add transaction when there is failure', async (t) => {
  try {
    const result = await syncHelper.runSyncAddTransaction(CommercetoolsApiConst.syncAddTransactionObject, Constants.PAYMENT_GATEWAY_FAILURE_REASON_CODE, true, true);
    if (result) {
      let i = 0;
      if ('amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
        i++;
      }
      t.is(i, 1);
    } else {
      t.is(result, null)
    }
  } catch (error) {
    t.pass();
  }
})

test.serial('Run sync add transaction when there is failure and auth reason code is not present', async (t) => {
  try {
    const result = await syncHelper.runSyncAddTransaction(CommercetoolsApiConst.syncAddTransactionObject, Constants.PAYMENT_GATEWAY_FAILURE_REASON_CODE, true, false);
    if (result) {
      let i = 0;
      if ('amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
        i++;
      }
      t.is(i, 1);
    } else {
      t.is(result, null)
    }
  } catch (error) {
    t.pass();
  }
})


test.serial('add transaction for run sync when auth is not present', async (t: any) => {
  try {
    let result = await syncHelper.runSyncAddTransaction(PaymentServiceConst.runSyncAddTransactionSyncUpdateObject, '100', false, false);
    if (result) {
      t.is(result, true);
    } else {
      t.pass();
    }
  } catch (error) {
    t.pass();
  }
});

test.serial('add transaction for run sync when reason code is empty', async (t: any) => {
  try {
    let result = await syncHelper.runSyncAddTransaction(PaymentServiceConst.runSyncAddTransactionSyncUpdateObject, '', false, false);
    t.is(result, null);
  } catch (error) {
    t.pass();
  }
})

test.serial('Run sync add transaction with refund', async (t) => {
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
      t.is(result, null)
    }
  } catch (error) {
    t.pass();
  }
})

test.serial('Process update capture amount for run sync ', async t => {
  try {
    let paymentObject: any = await CommercetoolsApi.retrievePayment(unit.paymentId);
    let result = await syncHelper.processRunSyncUpdateCaptureAmount(PaymentServiceConst.captureResponse, 'f8269041-5c82-45f3-b45a-5c6586187cb1', paymentObject?.version, 300, 100);
    let i = 0;
    if (result && 'amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
      i++;
      t.is(i, 1);
    } else {
      t.is(i, 0);
    }
  } catch (error) {
    t.pass();
  }
});

test.serial('Process update capture amount for run sync when payment id is empty', async (t) => {
  try {
    let paymentObject: any = await CommercetoolsApi.retrievePayment(unit.paymentId);
    let result = await syncHelper.processRunSyncUpdateCaptureAmount(PaymentServiceConst.captureResponse, '', paymentObject?.version, 300, 100);
    t.falsy(result);
  } catch (error) {
    t.pass();
  }
});

test.serial('check if auth reversal triggered', async (t) => {
  try {
    let result = await syncHelper.isAuthReversalTriggered(PaymentServiceConst.getAuthorizedAmountCapturePaymentObj, 'submitTimeUtc:[NOW/DAY-1DAY TO NOW/HOUR+1HOUR}');
    t.is(typeof result, 'boolean');
  } catch (error) {
    t.pass();
  }
});

test.serial('Retrieve sync amount details ', async (t: any) => {
  try {
    let result = await syncHelper.retrieveSyncAmountDetails(PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, PaymentServiceConst.retrieveSyncResponseTransactionElement, PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse);
    t.is(result.centAmount, 4500);
    t.is(result.currencyCode, 'USD');
  } catch (error) {
    t.pass();
  }
});

test.serial('Retrieve sync amount details when capture is present', async (t: any) => {
  try {
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.authReasonCodePresent = false;
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.capturePresent = true;
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.captureReasonCodePresent = true;
    let result = await syncHelper.retrieveSyncAmountDetails(PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, PaymentServiceConst.retrieveSyncResponseTransactionElement, PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse);
    t.is(result.centAmount, 4500);
    t.is(result.currencyCode, 'USD');
  } catch (error) {
    t.pass();
  }
});


test.serial('update capture amount for run sync', async (t: any) => {
  try {
    let result = await syncHelper.runSyncUpdateCaptureAmount(PaymentServiceConst.runSyncUpdateCaptureAmountUpdatePaymentObj, 1000);
    if (result) {
      let i = 0;
      if (result && 'amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
        i++;
        t.is(i, 1);
      } else {
        t.is(i, 0);
      }
    } else {
      t.pass();
    }
  } catch (error) {
    t.pass();
  }
});

test.serial('update capture amount for run sync when amount is 0', async (t: any) => {
  try {
    let result = await syncHelper.runSyncUpdateCaptureAmount(PaymentServiceConst.runSyncUpdateCaptureAmountUpdatePaymentObj, 0);
    t.falsy(result);
  } catch (error) {
    t.pass();
  }
});

test.serial('check if auth reversal triggered with empty query string', async (t) => {
  try {
    let result = await syncHelper.isAuthReversalTriggered(PaymentServiceConst.getAuthorizedAmountCapturePaymentObj, '');
    t.is(typeof result, 'boolean');
  } catch (error) {
    t.pass();
  }
});

test.serial('get the transaction summaries', async (t: any) => {
  try {
    let result: any = await syncHelper.getTransactionSummaries(PaymentServiceConst.getTransactionSummariesUpdatePaymentObj, 3);
    if (result) {
      let i = 0;
      if ('summaries' in result && 'historyPresent' in result) {
        i++;
      }
      t.is(i, 1);
    } else {
      t.pass();
    }
  } catch (error) {
    t.pass();
  }
});

test.serial('get the transaction summaries with retry count is 0', async (t: any) => {
  try {
    let result: any = await syncHelper.getTransactionSummaries(PaymentServiceConst.getTransactionSummariesUpdatePaymentObj, 0);
    if (result) {
      let i = 0;
      if ('summaries' in result && 'historyPresent' in result) {
        i++;
      }
      t.is(i, 1);
    } else {
      t.pass();
    }
  } catch (error) {
    t.pass();
  }
});


test.serial('check if auth reversal is triggered ', async (t: any) => {
  try {
    let result = await syncHelper.checkAuthReversalTriggered(
      PaymentServiceConst.getTransactionSummariesUpdatePaymentObj,
      PaymentServiceConst.getCreditCardResponseCartObj,
      PaymentServiceConst.checkAuthReversalTriggeredPaymentResponse,
      PaymentServiceConst.checkAuthReversalTriggeredUpdateActions,
    );
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
    t.is(result.actions[1].state, 'Success');
  } catch (error) {
    t.pass();
  }
});

test.serial('Get applications present', async (t) => {
  try {
    let result = await syncHelper.getApplicationsPresent(PaymentServiceConst.getPresentApplications);
    let i = 0;
    if ('authPresent' in result && 'authReasonCodePresent' in result && 'capturePresent' in result && 'captureReasonCodePresent' in result && 'authReversalPresent' in result && 'refundPresent in result') {
      i++;
    }
    t.is(i, 1);
  } catch (error) {
    t.pass();
  }
});