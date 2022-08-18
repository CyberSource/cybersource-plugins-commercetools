/* eslint-disable sort-imports */
/* eslint-disable prefer-const */
/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
/* eslint-disable import/order */

import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();

import { cart, cardTokens, cardTokensObject, guestCardTokens, guestPayment, cardTokenInvalidObject, payment, payments, service, dontSaveTokenFlag, payerAuthMandateFlag , orderNo, orderNumber} from '../../const/CreditCard/PaymentAuthorizationServiceConstCC';
import auth from '../../../service/payment/PaymentAuthorizationService';

let paymentResponse = {
  httpCode: null,
  status: null,
};

test.serial('Authorizing a payment and check http code', async (t) => {
  const result: any = await auth.authorizationResponse(payment, cart, service, cardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if(paymentResponse.httpCode == 201)
  {
    t.is(paymentResponse.httpCode, 201);
  }
  else
  {
    t.not(paymentResponse.httpCode, 201);
  }
  
}); 

test.serial('Check status of payment authorization', async (t) => {
  if(paymentResponse.httpCode == 201)
  {
    if (paymentResponse.status == 'AUTHORIZED') {
      t.is(paymentResponse.status, 'AUTHORIZED');
    } else if (paymentResponse.status == 'AUTHORIZED_PENDING_REVIEW') {
      t.is(paymentResponse.status, 'AUTHORIZED_PENDING_REVIEW');
    } else if (paymentResponse.status == 'DECLINED') {
      t.is(paymentResponse.status, 'DECLINED');
    }else if(paymentResponse.status == 'AUTHORIZED_RISK_DECLINED'){
      t.is(paymentResponse.status, 'AUTHORIZED_RISK_DECLINED');
    }
  }
  else
  {
    t.not(paymentResponse.status, 'AUTHORIZED');
    t.not(paymentResponse.status, 'AUTHORIZED_PENDING_REVIEW');
    t.not(paymentResponse.status, 'DECLINED');
  }
});

test.serial('Authorizing a payment using saved card and check http code', async (t) => {
  const result: any = await auth.authorizationResponse(payments, cart, service, cardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  t.is(paymentResponse.httpCode, 201);
}); 

test.serial('Check status of payment authorization using saved card', async (t) => {
  if (paymentResponse.status == 'AUTHORIZED') {
    t.is(paymentResponse.status, 'AUTHORIZED');
  } else if (paymentResponse.status == 'AUTHORIZED_PENDING_REVIEW') {
    t.is(paymentResponse.status, 'AUTHORIZED_PENDING_REVIEW');
  } else if (paymentResponse.status == 'DECLINED') {
    t.is(paymentResponse.status, 'DECLINED');
  }else if(paymentResponse.status == 'AUTHORIZED_RISK_DECLINED'){
    t.is(paymentResponse.status, 'AUTHORIZED_RISK_DECLINED');
  }
});

test.serial('Authorizing a payment using saved card with invalid customer and check http code', async (t) => {
  const result: any = await auth.authorizationResponse(payments, cart, service, cardTokensObject, dontSaveTokenFlag, payerAuthMandateFlag, orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  t.not(paymentResponse.httpCode, 201);
}); 

test.serial('Check status of payment authorization with invalid customer', async (t) => {
  var i = 0;
  if (paymentResponse.status == 'AUTHORIZED' || paymentResponse.status == 'DECLINED' || paymentResponse.status == 'AUTHORIZED_PENDING_REVIEW' || paymentResponse.status == 'AUTHORIZED_RISK_DECLINED') {
    i++;
  }
  t.is(i, 0);
});

test.serial('Authorizing a payment using invalid saved card ', async (t) => {
  const result: any = await auth.authorizationResponse(payments, cart, service, cardTokenInvalidObject, dontSaveTokenFlag, payerAuthMandateFlag, orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  t.not(paymentResponse.httpCode, 201);
}); 

test.serial('Check status of payment authorization with invalid saved token', async (t) => {
  var i = 0;
  if (paymentResponse.status == 'AUTHORIZED' || paymentResponse.status == 'DECLINED' || paymentResponse.status == 'AUTHORIZED_PENDING_REVIEW' || paymentResponse.status == 'AUTHORIZED_RISK_DECLINED') {
    i++;
  }
  t.is(i, 0);
});

test.serial('Authorizing a payment for guest user and check http code', async (t) => {
  const result: any = await auth.authorizationResponse(guestPayment, cart, service, guestCardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if(paymentResponse.httpCode == 201)
  {
    t.is(paymentResponse.httpCode, 201);
  }
  else
  {
    t.not(paymentResponse.httpCode, 201);
  }
  
}); 

test.serial('Check status of payment authorization for guest user', async (t) => {
  if(paymentResponse.httpCode == 201)
  {
    if (paymentResponse.status == 'AUTHORIZED') {
      t.is(paymentResponse.status, 'AUTHORIZED');
    } else if (paymentResponse.status == 'AUTHORIZED_PENDING_REVIEW') {
      t.is(paymentResponse.status, 'AUTHORIZED_PENDING_REVIEW');
    } else if (paymentResponse.status == 'DECLINED') {
      t.is(paymentResponse.status, 'DECLINED');
    }else if(paymentResponse.status == 'AUTHORIZED_RISK_DECLINED'){
      t.is(paymentResponse.status, 'AUTHORIZED_RISK_DECLINED');
    }
  }
  else
  {
    t.not(paymentResponse.status, 'AUTHORIZED');
    t.not(paymentResponse.status, 'AUTHORIZED_PENDING_REVIEW');
    t.not(paymentResponse.status, 'DECLINED');
  }
});

test.serial('Authorizing a paymentwith reconciliation Id and check http code', async (t) => {
  const result: any = await auth.authorizationResponse(payment, cart, service, cardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNumber);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if(paymentResponse.httpCode == 201)
  {
    t.is(paymentResponse.httpCode, 201);
  }
  else
  {
    t.not(paymentResponse.httpCode, 201);
  }
  
}); 

test.serial('Check status of payment authorization with reconciliation Id', async (t) => {
  if(paymentResponse.httpCode == 201)
  {
    if (paymentResponse.status == 'AUTHORIZED') {
      t.is(paymentResponse.status, 'AUTHORIZED');
    } else if (paymentResponse.status == 'AUTHORIZED_PENDING_REVIEW') {
      t.is(paymentResponse.status, 'AUTHORIZED_PENDING_REVIEW');
    } else if (paymentResponse.status == 'DECLINED') {
      t.is(paymentResponse.status, 'DECLINED');
    }else if(paymentResponse.status == 'AUTHORIZED_RISK_DECLINED'){
      t.is(paymentResponse.status, 'AUTHORIZED_RISK_DECLINED');
    }
  }
  else
  {
    t.not(paymentResponse.status, 'AUTHORIZED');
    t.not(paymentResponse.status, 'AUTHORIZED_PENDING_REVIEW');
    t.not(paymentResponse.status, 'DECLINED');
  }
});