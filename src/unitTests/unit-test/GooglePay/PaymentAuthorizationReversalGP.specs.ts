/* eslint-disable functional/no-let */
/* eslint-disable prefer-const */
/* eslint-disable import/order */
/* eslint-disable functional/immutable-data */
import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();
import { authReversalId, authReversalID, cart,  payment, payments} from '../../const/GooglePay/PaymentAuthorizationReversalConstGP';
import authReversalResponse from '../../../service/payment/PaymentAuthorizationReversal';

let paymentResponse = {
    httpCode: null,
    transactionId: null,
    status: null,
    message: null,
  };

  test.serial('Reversing an order with invalid auth reversal amount', async(t)=>{
    const result:any = await authReversalResponse.authReversalResponse(payments, cart, authReversalId);
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.transactionId = result.transactionId;
    paymentResponse.status = result.status;
    paymentResponse.message = result.message;
    t.pass();
})

test.serial('Çheck http code after auth reversal with invalid amount', async(t)=>{

  t.not(paymentResponse.httpCode, 201);

})

test.serial('Çheck status after auth reversal with invalid amount', async(t)=>{

  t.not(paymentResponse.status, 'REVERSED');

})

test.serial('Reversing a payment', async(t)=>{
    const result:any = await authReversalResponse.authReversalResponse(payment, cart, authReversalId);
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.transactionId = result.transactionId;
    paymentResponse.status = result.status;
    paymentResponse.message = result.message;
    t.pass();
})

test.serial('Çheck http code for auth reversal', async(t)=>{

    t.is(paymentResponse.httpCode, 201);

})

test.serial('Çheck status for auth reversal', async(t)=>{

  t.is(paymentResponse.status, 'REVERSED');

})

test.serial('Reversing an invalid order', async(t)=>{
  const result:any = await authReversalResponse.authReversalResponse(payment, cart, authReversalID);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.transactionId = result.transactionId;
  paymentResponse.status = result.status;
  paymentResponse.message = result.message;
  t.pass();
})

test.serial('Çheck http code for reversing an invalid order', async(t)=>{

  t.not(paymentResponse.httpCode, 201);

})

test.serial('Çheck status for reversing an invalid order', async(t)=>{

t.not(paymentResponse.status, 'REVERSED');

})

