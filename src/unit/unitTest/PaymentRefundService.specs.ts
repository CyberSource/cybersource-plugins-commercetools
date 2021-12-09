/* eslint-disable import/order */
import test from 'ava';
import dotenv from   'dotenv';
dotenv.config();

import refund from '../../service/payment/PaymentRefundService'
import {captureId, payment, updateTransaction} from '../../const/PaymentRefundServiceConst';


test('test payment refund ',async (t)=>{
    const refundPayment =await refund.refundResponse(payment, captureId, updateTransaction);
    console.log("payemnt response ", refundPayment);
    t.pass();
    console.log(t.title);
})

test('test payment refund for httpCode',async (t)=>{
    const refundPayment :any=await refund.refundResponse(payment, captureId, updateTransaction);
    console.log("payemnt response ", refundPayment);
    t.is(refundPayment.httpCode, 201);
    console.log(t.title);
})

test('test payment refund for status ',async (t)=>{
    const refundPayment :any=await refund.refundResponse(payment, captureId, updateTransaction);
    console.log("payemnt response again ", refundPayment);
    t.is(refundPayment.status, 'PENDING');
    console.log(t.title);
})