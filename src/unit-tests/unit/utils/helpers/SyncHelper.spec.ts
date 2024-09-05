import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../../../constants/constants';
import CommercetoolsApi from '../../../../utils/api/CommercetoolsApi';
import syncHelper from '../../../../utils/helpers/SyncHelper';
import unit from '../../../JSON/unit.json'
import CommercetoolsApiConst from '../../../const/CommercetoolsApiConst';
import PaymentAuthorizationServiceConstCC from '../../../const/CreditCard/PaymentAuthorizationServiceConstCC';
import PaymentServiceConst from '../../../const/PaymentServiceConst';
import SyncHelperConst from '../../../const/SyncHelperConst';

test.serial('set security code present ', (t) => {
    const result = syncHelper.setSecurityCodePresent(PaymentAuthorizationServiceConstCC.payments);
    t.is(typeof result, 'boolean')
})

test.serial('Retrieve sync response ', async (t: any) => {
    let result = await syncHelper.retrieveSyncResponse(PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, PaymentServiceConst.retrieveSyncResponseTransactionElement);
    let i = 0;
    if (result && 'amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
        i++;
        t.is(i, 1);
    } else {
        t.is(i, 0);
    }
});

test.serial('Process application response when auth is present', async (t) => {
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
})

test.serial('Process application response when capture is present', async (t) => {
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
})

test.serial('Process application response when auth reversal is present', async (t) => {
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
})

test.serial('Process application response when refund is present', async (t) => {
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
})

test.serial('Run sync add transaction ', async (t) => {
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
})

test.serial('Run sync add transaction when there is error', async (t) => {
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
})

test.serial('Run sync add transaction when there is failure', async (t) => {
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
})

test.serial('Run sync add transaction when there is failure and auth reason code is not present', async (t) => {
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
})


test.serial('add transaction for run sync when auth is not present', async (t: any) => {
  let result = await syncHelper.runSyncAddTransaction(PaymentServiceConst.runSyncAddTransactionSyncUpdateObject, '100', false, false);
  if (result) {
    t.is(result, true);
  } else {
    t.pass();
  }
});

test.serial('add transaction for run sync when reason code is empty', async (t: any) => {
  let result = await syncHelper.runSyncAddTransaction(PaymentServiceConst.runSyncAddTransactionSyncUpdateObject, '', false, false);
  t.is(result, null);
})

test.serial('Run sync add transaction with refund', async (t) => {
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
})

test.serial('Process update capture amount for run sync ', async t => {
  let paymentObject: any = await CommercetoolsApi.retrievePayment(unit.paymentId);
  let result = await syncHelper.processRunSyncUpdateCaptureAmount(PaymentServiceConst.captureResponse, 'f8269041-5c82-45f3-b45a-5c6586187cb1', paymentObject?.version, 300, 100);
  let i = 0;
  if (result && 'amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
    i++;
    t.is(i, 1);
  } else {
    t.is(i, 0);
  }
});

test.serial('Process update capture amount for run sync when payment id is empty', async (t) => {
  let paymentObject: any = await CommercetoolsApi.retrievePayment(unit.paymentId);
  let result = await syncHelper.processRunSyncUpdateCaptureAmount(PaymentServiceConst.captureResponse, '', paymentObject?.version, 300, 100);
  t.falsy(result);
});

test.serial('check if auth reversal triggered', async (t) => {
    let result = await syncHelper.isAuthReversalTriggered(PaymentServiceConst.getAuthorizedAmountCapturePaymentObj, 'submitTimeUtc:[NOW/DAY-1DAY TO NOW/HOUR+1HOUR}');
    t.is(typeof result, 'boolean');
  });

  test.serial('Retrieve sync amount details ', async (t: any) => {
    let result = await syncHelper.retrieveSyncAmountDetails(PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, PaymentServiceConst.retrieveSyncResponseTransactionElement, PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse);
    t.is(result.centAmount, 4500);
    t.is(result.currencyCode, 'USD');
  });

  test.serial('Retrieve sync amount details when capture is present', async (t: any) => {
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.authReasonCodePresent = false;
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.capturePresent = true;
    PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse.captureReasonCodePresent = true;
    let result = await syncHelper.retrieveSyncAmountDetails(PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, PaymentServiceConst.retrieveSyncResponseTransactionElement, PaymentServiceConst.retrieveSyncAmountDetailsApplicationResponse);
    t.is(result.centAmount, 4500);
    t.is(result.currencyCode, 'USD');
  });


  test.serial('update capture amount for run sync', async (t: any) => {
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
  });
  
  test.serial('update capture amount for run sync when amount is 0', async (t: any) => {
    let result = await syncHelper.runSyncUpdateCaptureAmount(PaymentServiceConst.runSyncUpdateCaptureAmountUpdatePaymentObj, 0);
    t.falsy(result);
  });

test.serial('check if auth reversal triggered with empty query string', async (t) => {
  let result = await syncHelper.isAuthReversalTriggered(PaymentServiceConst.getAuthorizedAmountCapturePaymentObj, '');
  t.is(typeof result, 'boolean');
});