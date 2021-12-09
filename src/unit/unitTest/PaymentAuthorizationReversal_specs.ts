/* eslint-disable import/order */
import test from 'ava'
import dotenv from 'dotenv';
dotenv.config();
import {authid, authId, carts, payment} from '../../const/PaymentAuthorizationReversalConst';
import reverse from '../../service/payment/PaymentAuthorizationReversal';

test('for execution of reverse ',async (t)=>{
    const result = await reverse.authReversalResponse(payment, carts, authId);
    console.log("reesult ",result);
    t.pass();
})

test('for execution of reverse httpCode ',async (t)=>{
    const result: any = await reverse.authReversalResponse(payment, carts, authId);
    console.log("result ",result);
    t.is(result.httpCode, 201);
})

test('for execution of reverse status',async (t)=>{
    const result: any = await reverse.authReversalResponse(payment, carts, authId);
    console.log("result ",result);
    t.is(result.status, 'REVERSED');
})

test('for execution of reverse http failure',async (t)=>{
    const result: any = await reverse.authReversalResponse(payment, carts, authid);
    console.log("reesult ",result);
    t.is(result.httpCode, 400);
})

test('for execution of reverse status failure',async (t)=>{
    const result :any= await reverse.authReversalResponse(payment, carts, authid);
    console.log("reesult ",result);
    t.is(result.status, 'INVALID_REQUEST');
})