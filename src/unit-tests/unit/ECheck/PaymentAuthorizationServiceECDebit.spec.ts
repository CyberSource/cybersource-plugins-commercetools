/* eslint-disable sort-imports */
/* eslint-disable prefer-const */
/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
/* eslint-disable import/order */

import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();

import { cart, cardTokens, payment, paymentGuest, service, dontSaveTokenFlag, payerAuthMandateFlag , orderNo} from '../../const/ECheck/PaymentAuthorizationServiceConstECDebit';
import auth from '../../../service/payment/PaymentAuthorizationService';

let paymentResponse = {
  httpCode: null,
  status: null,
};

test.serial('Authorizing a payment and check http code for logged in customer', async (t) => {
  const result: any = await auth.authorizationResponse(payment, cart, service, cardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
    t.is(paymentResponse.httpCode, 201);
  
  
}); 

test.serial('Check status of payment authorization for logged in customer', async (t) => {
 
      t.is(paymentResponse.status, 'PENDING');
     
});

test.serial('Authorizing a payment and check http code for guest user', async (t) => {
    const result: any = await auth.authorizationResponse(paymentGuest, cart, service, cardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNo);
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
      t.is(paymentResponse.httpCode, 201);
    
    
  }); 
  
  test.serial('Check status of payment authorization for guest user', async (t) => {
   
        t.is(paymentResponse.status, 'PENDING');
       
  });




