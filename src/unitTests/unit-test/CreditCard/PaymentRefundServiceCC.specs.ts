/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
/* eslint-disable prefer-const */
/* eslint-disable import/order */
import test from 'ava';
import dotenv from   'dotenv';
dotenv.config();

import refund from '../../../service/payment/PaymentRefundService'
import {captureId,captureID,  payment, updateTransaction} from '../../const/CreditCard/PaymentRefundServiceConst';

let paymentResponse = {
    httpCode: null,
    transactionId: null,
    status: null,
    message: null,
  };

test.serial('Refunding a payment',async (t)=>{
    const result:any =await refund.refundResponse(payment, captureId, updateTransaction);
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.transactionId = result.transactionId;
    paymentResponse.status = result.status;
    paymentResponse.message = result.message;
    t.pass();
})

test.serial('Check http code for payment refund',async (t)=>{
    
    t.is(paymentResponse.httpCode, 201);
    
})

test.serial('Check status for payment refund',async (t)=>{
    
    t.is(paymentResponse.status, 'PENDING');
    
})

test.serial('Refunding an invalid payment ', async(t)=>{
    const result:any = await refund.refundResponse(payment, captureID, updateTransaction);
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.transactionId = result.transactionId;
    paymentResponse.status = result.status;
    paymentResponse.message = result.message;
    t.pass();
})

test.serial('Check http code of an invalid refund', async(t)=>{
    
    t.not(paymentResponse.httpCode, 201);

})

test.serial('Check status of an invalid refund', async(t)=>{
    
    t.not(paymentResponse.status, 'PENDING');

})