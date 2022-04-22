/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
/* eslint-disable prefer-const */
/* eslint-disable import/order */
import test from 'ava';
import dotenv from   'dotenv';
dotenv.config();

import refund from '../../../service/payment/PaymentRefundService'
import {captureId,captureID,  payment, updateTransaction} from '../../const/CreditCard/PaymentRefundServiceConstCC';

let paymentResponse = {
    httpCode: null,
    status: null,
    };

let paymentResponseObject = {
    httpCode: null,
    status: null,
    };

test.serial('Refunding a payment and check http code',async (t)=>{
    const result:any =await refund.refundResponse(payment, captureId, updateTransaction);
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    t.is(paymentResponse.httpCode, 201);
})

test.serial('Check status for payment refund',async (t)=>{
    
    t.is(paymentResponse.status, 'PENDING');
    
})

test.serial('Refunding an invalid payment and check http code', async(t)=>{
    const result:any = await refund.refundResponse(payment, captureID, updateTransaction);
    paymentResponseObject.httpCode = result.httpCode;
    paymentResponseObject.status = result.status;
    t.not(paymentResponseObject.httpCode, 201);
})

test.serial('Check status of an invalid refund', async(t)=>{
    
    t.not(paymentResponseObject.status, 'PENDING');

})