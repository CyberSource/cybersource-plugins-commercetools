
import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();

import { cart, payment, payments, service } from '../../const/PaymentAuthorizationServiceConst';
import auth from '../../service/payment/PaymentAuthorizationService';


test('check assertion',async (t) => {
  const result = await auth.authorizationResponse(payment, cart, service);
  console.log("result ", JSON.stringify(result));
  t.pass();
});

test('check httpcode',async (t) => {
  const result:any = await auth.authorizationResponse(payment, cart, service);
  console.log("result ", JSON.stringify(result));
  t.is(result.httpCode, 201);
});

test('check status of response',async (t) => {
  const result:any = await auth.authorizationResponse(payment, cart, service);
  console.log("result ", JSON.stringify(result));
  t.is(result.status, 'AUTHORIZED');
});


test('check httpcode for saved card',async (t) => {
  const result:any = await auth.authorizationResponse(payments, cart, service);
  console.log("result ", JSON.stringify(result));
  t.is(result.httpCode, 201);
});

test('check status for saved card',async (t) => {
  const result:any = await auth.authorizationResponse(payments, cart, service);
  console.log("result ", JSON.stringify(result));
  t.is(result.status, 'AUTHORIZED');
});

