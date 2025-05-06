import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../../../constants/paymentConstants';
import multiMid from '../../../../utils/config/MultiMid';
import webhookHelper from '../../../../utils/helpers/WebhookHelper';
import DeleteWebhookSubscriptionConst from '../../../const/DeleteWebhookSubscriptionConst';
import PaymentServiceConst from '../../../const/HelpersConst';

test.serial('Handle webhook subscription', async (t) => {
  try {
    let midCredentials = await multiMid.getMidCredentials(process.env.PAYMENT_GATEWAY_MERCHANT_ID as string);
    const result = await webhookHelper.handleWebhookSubscription(midCredentials);
    if (Constants.HTTP_OK_STATUS_CODE === result.httpCode || Constants.HTTP_SUCCESS_STATUS_CODE === result.httpCode) {
      t.pass();
    } else {
      t.fail(`Unexpected response: HTTP ${result.httpCode}, Status:${JSON.stringify(result)}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Handle webhook subscription with empty mid credential', async (t) => {
  try {
    const result = await webhookHelper.handleWebhookSubscription(DeleteWebhookSubscriptionConst.emptyMidCredentials);
    if (Constants.HTTP_CODE_ZERO === result.httpCode) {
      t.pass();
    } else {
      t.fail(`Unexpected response: HTTP ${result.httpCode}, Status:${JSON.stringify(result)}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Handle webhook subscription with invalid mid credential', async (t) => {
  try {
    const result = await webhookHelper.handleWebhookSubscription(DeleteWebhookSubscriptionConst.invalidMidCredentials);
    if (Constants.HTTP_UNAUTHORIZED_STATUS_CODE === result.httpCode) {
      t.pass();
    } else {
      t.fail(`Unexpected response: HTTP ${result.httpCode}, Status:${JSON.stringify(result)}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Test getSubscriptionDetails api function', async (t) => {
  try {
    let result = await webhookHelper.verifySubscription(PaymentServiceConst.searchSubscriptionResponse, process.env.PAYMENT_GATEWAY_MERCHANT_ID);
    if ('boolean' === typeof result.isSubscribed && 'boolean' === typeof result.presentInCustomObject) {
      t.is(typeof result.isSubscribed, 'boolean');
      t.is(typeof result.presentInCustomObject, 'boolean');
      t.is(result.webhookId, PaymentServiceConst.searchSubscriptionResponse.webhookId);
    } else {
      t.fail(`Unexpected Result :${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Test getSubscriptionDetails api function when merchant id is null', async (t) => {
  try {
    let result = await webhookHelper.verifySubscription(PaymentServiceConst.searchSubscriptionResponse, '');
    if ('boolean' === typeof result.isSubscribed && 'boolean' === typeof result.presentInCustomObject) {
      t.is(typeof result.isSubscribed, 'boolean');
      t.is(typeof result.presentInCustomObject, 'boolean');
      t.is(result.webhookId, PaymentServiceConst.searchSubscriptionResponse.webhookId);
    } else {
      t.fail(`Unexpected Result :${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Test getSubscriptionDetails api function with empty webhook id', async (t) => {
  try {
    let result = await webhookHelper.verifySubscription(PaymentServiceConst.invalidSearchSubscriptionResponse, process.env.PAYMENT_GATEWAY_MERCHANT_ID);
    if (false === result.isSubscribed && false === result.presentInCustomObject) {
      t.is(result.isSubscribed, false);
      t.is(result.presentInCustomObject, false);
      t.is(result.webhookId, '');
    } else {
      t.fail(`Unexpected Result :${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Test getSubscriptionDetails api function with empty webhook id and merchant id', async (t) => {
  try {
    let result = await webhookHelper.verifySubscription(PaymentServiceConst.invalidSearchSubscriptionResponse, '');
    if (false === result.isSubscribed && false === result.presentInCustomObject) {
      t.is(result.isSubscribed, false);
      t.is(result.presentInCustomObject, false);
      t.is(result.webhookId, '');
    } else {
      t.fail(`Unexpected Result :${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Test getSubscriptionDetails api function with invalid subscription response', async (t) => {
  try {
    let result = await webhookHelper.verifySubscription(PaymentServiceConst.invalidSubscriptionResponse, process.env.PAYMENT_GATEWAY_MERCHANT_ID);
    if ('boolean' === typeof result.isSubscribed && 'boolean' === typeof result.presentInCustomObject) {
      t.is(typeof result.isSubscribed, 'boolean');
      t.is(typeof result.presentInCustomObject, 'boolean');
      t.is(result.webhookId, '');
    } else {
      t.fail(`Unexpected Result :${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});