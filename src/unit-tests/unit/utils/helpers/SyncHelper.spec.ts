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

test.serial('Process application response when auth is present', async (t:any) => {
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

test.serial('Process application response when capture is present', async (t:any) => {
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

test.serial('Process application response when auth reversal is present', async (t:any) => {
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

test.serial('Process application response when refund is present', async (t:any) => {
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

test.serial('Run sync add transaction ', async (t:any) => {
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

test.serial('Run sync add transaction when there is error', async (t:any) => {
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

test.serial('Run sync add transaction when there is failure', async (t:any) => {
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

test.serial('Run sync add transaction when there is failure and auth reason code is not present', async (t:any) => {
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

test.serial('Run sync add transaction with refund', async (t:any) => {
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

test.serial('Process update capture amount for run sync ', async (t:any) => {
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

test.serial('Process update capture amount for run sync when payment id is empty', async (t:any) => {
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

test.serial('check if auth reversal triggered', async (t:any) => {
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

test.serial('check if auth reversal triggered with empty query string', async (t:any) => {
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

test.serial('Get applications present', async (t:any) => {
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