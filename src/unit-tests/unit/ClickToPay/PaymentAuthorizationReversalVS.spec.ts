import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();

import { authReversalId, authReversalID, cart, payment, payments } from '../../const/ClickToPay/PaymentAuthorizationReversalVsConst';
import reverse from '../../../service/payment/PaymentAuthorizationReversal'; 


var paymentResponse = {
  httpCode: null,
  status: null,
};

var paymentResponseObject = {
  httpCode: null,
  status: null,
};

var paymentResponseObjects = {
  httpCode: null,
  status: null,
};

test.serial('Reversing an order with invalid auth reversal amount and check http code', async(t)=>{
    const result:any = await reverse.authReversalResponse(payments, cart, authReversalId);
    paymentResponseObject.httpCode = result.httpCode;
    paymentResponseObject.status = result.status;
    t.not(paymentResponseObject.httpCode, 201);

})

test.serial('Çheck status after auth reversal with invalid amount', async (t) => {
  t.not(paymentResponseObject.status, 'REVERSED');
});

test.serial('Reversing a payment and check http code', async (t)=>{
  const result:any = await reverse.authReversalResponse(payment, cart, authReversalId);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  t.is(paymentResponse.httpCode, 201);
}) 

test.serial('Check status after auth reversal', async (t) => {
  t.is(paymentResponse.status, 'REVERSED');
});

test.serial('Reversing an invalid order and check http code', async (t) => {
  const result: any = await reverse.authReversalResponse(payment, cart, authReversalID);
  paymentResponseObjects.httpCode = result.httpCode;
  paymentResponseObjects.status = result.status;
  t.not(paymentResponseObjects.httpCode, 201);
}); 

test.serial('Çheck status for Cancelling an invalid order', async (t) => {
  t.not(paymentResponseObjects.status, 'REVERSED');
});
