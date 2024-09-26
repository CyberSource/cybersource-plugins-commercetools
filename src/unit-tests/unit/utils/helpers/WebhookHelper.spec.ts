import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import multiMid from '../../../../utils/config/MultiMid';
import webhookHelper from '../../../../utils/helpers/WebhookHelper';
import DeleteWebhookSubscriptionConst from '../../../const/DeleteWebhookSubscriptionConst';
import PaymentServiceConst from '../../../const/PaymentServiceConst';

test.serial('Handle webhook subscription ', async(t) => {
    let midCredentials = await multiMid.getMidCredentials(process.env.PAYMENT_GATEWAY_MERCHANT_ID as string);
    const result = await webhookHelper.handleWebhookSubscription(midCredentials);
    if(result){
      t.pass()
      }
});

test.serial('Handle webhook subscription with empty mid credential', async(t) => {
    const result = await webhookHelper.handleWebhookSubscription(DeleteWebhookSubscriptionConst.emptyMidCredentials);
    if(result){
      t.pass()
      }
});

test.serial('Handle webhook subscription with invalid mid credential', async(t) => {
    const result = await webhookHelper.handleWebhookSubscription(DeleteWebhookSubscriptionConst.invalidMidCredentials);
    if(result){
      t.pass()
      }
});

test.serial('Test getSubscriptionDetails api function', async (t) => {
    let result = await webhookHelper.verifySubscription(PaymentServiceConst.searchSubscriptionResponse, process.env.PAYMENT_GATEWAY_MERCHANT_ID);
    t.is(typeof result.isSubscribed, 'boolean');
    t.is(typeof result.presentInCustomObject, 'boolean');
    t.is(result.webhookId, PaymentServiceConst.searchSubscriptionResponse.webhookId);
  });
  
  test.serial('Test getSubscriptionDetails api function when merchant id is null', async (t) => {
    let result = await webhookHelper.verifySubscription(PaymentServiceConst.searchSubscriptionResponse, '');
    t.is(typeof result.isSubscribed, 'boolean');
    t.is(typeof result.presentInCustomObject, 'boolean');
    t.is(result.webhookId, PaymentServiceConst.searchSubscriptionResponse.webhookId);
  });
  
  test.serial('Test getSubscriptionDetails api function with empty webhook id', async (t) => {
    let result = await webhookHelper.verifySubscription(PaymentServiceConst.invalidSearchSubscriptionResponse, process.env.PAYMENT_GATEWAY_MERCHANT_ID);
    t.is(result.isSubscribed, false);
    t.is(result.presentInCustomObject, false);
    t.is(result.webhookId, '');
  });
  
  test.serial('Test getSubscriptionDetails api function with empty webhook id and merchant id', async (t) => {
    let result = await webhookHelper.verifySubscription(PaymentServiceConst.invalidSearchSubscriptionResponse, '');
    t.is(result.isSubscribed, false);
    t.is(result.presentInCustomObject, false);
    t.is(result.webhookId, '');
  });
  
  test.serial('Test getSubscriptionDetails api function with invalid subscription response', async (t) => {
    let result = await webhookHelper.verifySubscription(PaymentServiceConst.invalidSubscriptionResponse, process.env.PAYMENT_GATEWAY_MERCHANT_ID);
    t.is(typeof result.isSubscribed, 'boolean');
    t.is(typeof result.presentInCustomObject, 'boolean');
    t.is(result.webhookId, '');
  });
