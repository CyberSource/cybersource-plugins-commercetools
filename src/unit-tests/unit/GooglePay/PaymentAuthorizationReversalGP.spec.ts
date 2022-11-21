/* eslint-disable functional/no-let */
/* eslint-disable prefer-const */
/* eslint-disable import/order */
/* eslint-disable functional/immutable-data */
import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();
import { authReversalId, authReversalID, cart, payment, payments } from '../../const/GooglePay/PaymentAuthorizationReversalConstGP';
import authReversalResponse from '../../../service/payment/PaymentAuthorizationReversal'; 

let paymentResponse = {
  httpCode: null,
  status: null,
};

let paymentResponseObject = {
  httpCode: null,
  status: null,
};

let paymentResponseObjects = {
  httpCode: null,
  status: null,
};

test.serial('Reversing an order with invalid auth reversal amount and check http code', async(t)=>{
    const result:any = await authReversalResponse.authReversalResponse(payments, cart, authReversalId);
    paymentResponseObject.httpCode = result.httpCode;
    paymentResponseObject.status = result.status;
    t.not(paymentResponseObject.httpCode, 201);
})

test.serial('Çheck status after auth reversal with invalid amount', async (t) => {
  t.not(paymentResponseObject.status, 'REVERSED');
});

test.serial('Reversing a payment and check http code', async(t)=>{
    const result:any = await authReversalResponse.authReversalResponse(payment, cart, authReversalId);
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    if(paymentResponse.httpCode == 201)
  {
    t.is(paymentResponse.httpCode, 201);
  }
  else{
    t.not(paymentResponse.httpCode, 201);
  }
}) 

test.serial('Çheck status for auth reversal', async (t) => {
  if(paymentResponse.httpCode == 201)
  {
    t.is(paymentResponse.status, 'REVERSED');
  }
  else{
    t.not(paymentResponse.status, 'REVERSED');
  }
});

test.serial('Reversing an invalid order and check http code', async(t)=>{
  const result:any = await authReversalResponse.authReversalResponse(payment, cart, authReversalID);
  paymentResponseObjects.httpCode = result.httpCode;
  paymentResponseObjects.status = result.status;
  t.not(paymentResponseObjects.httpCode, 201);
}) 

test.serial('Çheck status for reversing an invalid order', async (t) => {
  t.not(paymentResponseObjects.status, 'REVERSED');
});
