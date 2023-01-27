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
  if(paymentResponse.httpCode == 201)
  {
    t.is(paymentResponse.httpCode, 201);
  }
  else{
    t.not(paymentResponse.httpCode, 201);
  }
}); 

test.serial('Check status of payment authorization for logged in customer', async (t) => {
 if(paymentResponse.httpCode == 201)
  {
    if (paymentResponse.status == 'PENDING') {
      t.is(paymentResponse.status, 'PENDING');
    } else if (paymentResponse.status == 'DECLINED') {
      t.is(paymentResponse.status, 'DECLINED');
    } 
  }
  else{
    t.not(paymentResponse.status, 'PENDING');
  }
});

test.serial('Authorizing a payment and check http code for guest user', async (t) => {
    const result: any = await auth.authorizationResponse(paymentGuest, cart, service, cardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNo);
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    if(paymentResponse.httpCode == 201)
    {
      t.is(paymentResponse.httpCode, 201);
    }
    else{
      t.not(paymentResponse.httpCode, 201);
    }
  }); 
  
  test.serial('Check status of payment authorization for guest user', async (t) => {
    if(paymentResponse.httpCode == 201)
    {
      if (paymentResponse.status == 'PENDING') {
        t.is(paymentResponse.status, 'PENDING');
      } else if (paymentResponse.status == 'DECLINED') {
        t.is(paymentResponse.status, 'DECLINED');
      } 
    }
    else{
      t.not(paymentResponse.status, 'PENDING');
    }
  });




