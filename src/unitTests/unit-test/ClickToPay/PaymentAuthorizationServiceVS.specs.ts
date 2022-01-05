/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
/* eslint-disable import/order */
import test from 'ava';
import dotenv from 'dotenv';

import {cart, payment,payments, service} from '../../const/ClickToPay/PaymentAuthorizationServiceVsConst';
import auth from '../../../service/payment/PaymentAuthorizationService';
dotenv.config();

// eslint-disable-next-line prefer-const
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

test.serial('Check http code', async(t)=>{
    
    t.is(paymentResponse.httpCode, 201);

})

test.serial('Check status', async(t)=>{

    t.is(paymentResponse.status, 'AUTHORIZED');

})

test.serial('Authorizing a payment using invalid token', async (t)=>{
  const result:any = await auth.authorizationResponse(payments, cart, service);
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