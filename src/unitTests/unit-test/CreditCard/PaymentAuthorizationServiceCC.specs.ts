/* eslint-disable prefer-const */
/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
/* eslint-disable import/order */

import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();

import { cart, payment, payments, paymentToken,paymentInvalidToken, service } from '../../const/CreditCard/PaymentAuthorizationServiceConstCC';
import auth from '../../../service/payment/PaymentAuthorizationService';

let paymentResponse = {
  httpCode: null,
  transactionId: null,
  status: null,
  message: null,
  data: null,
};

test.serial('Authorizing a payment',async (t) => {
  const result:any = await auth.authorizationResponse(payment, cart, service);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.transactionId = result.transactionId;
  paymentResponse.status = result.status;
  paymentResponse.message = result.message;
  paymentResponse.data = result.data;
  t.pass();
});

test.serial('Check http code',async (t) => {
  
  t.is(paymentResponse.httpCode, 201);

});

test.serial('Check status of response',async (t) => {
  
  t.is(paymentResponse.status, 'AUTHORIZED');

});

test.serial('Authorizing a payment using saved card',async (t) => {
  const result:any = await auth.authorizationResponse(payments, cart, service);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.transactionId = result.transactionId;
  paymentResponse.status = result.status;
  paymentResponse.message = result.message;
  paymentResponse.data = result.data;
  t.pass();
});

test.serial('Check httpcode for saved card',async (t) => {
  
  t.is(paymentResponse.httpCode, 201);

});

test.serial('Check status for saved card',async (t) => {
  
  t.is(paymentResponse.status, 'AUTHORIZED');

});

test.serial('Authorizing a payment using invalid token', async (t)=>{
  const result:any = await auth.authorizationResponse(paymentToken, cart, service);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.transactionId = result.transactionId;
  paymentResponse.status = result.status;
  paymentResponse.message = result.message;
  paymentResponse.data = result.data;
  t.pass();
})

test.serial('Check http code for invalid token', async(t)=>{
  
  t.not(paymentResponse.httpCode, 201);

})

test.serial('Check status for invalid token', async(t)=>{
  
  t.not(paymentResponse.status, 'AUTHORIZED');

})

test.serial('Authorizing a payment with invalid customer', async (t)=>{
  const result:any = await auth.authorizationResponse(paymentInvalidToken, cart, service);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.transactionId = result.transactionId;
  paymentResponse.status = result.status;
  paymentResponse.message = result.message;
  paymentResponse.data = result.data;
  t.pass();
})

test.serial('Check http code with invalid customer', async(t)=>{
  
  t.not(paymentResponse.httpCode, 201);

})

test.serial('Check status with invalid customer', async(t)=>{
  
  t.not(paymentResponse.status, 'AUTHORIZED');

})

