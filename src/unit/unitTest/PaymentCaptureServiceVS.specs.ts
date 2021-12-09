import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();

import {authId, cart, payment} from '../../const/PaymentCaptureServiceVsConst';
import capture from '../../service/payment/PaymentCaptureService';

test('execution of capture for visa src for http code', async(t)=>{
    const result : any= await capture.captureResponse(payment, cart, authId);
    console.log(" result ", result);
    t.is(result.httpCode, 201);
})

test('execution of capture for visa src for status', async(t)=>{
    const result : any= await capture.captureResponse(payment, cart, authId);
    console.log(" result ", result);
    t.is(result.status, 'PENDING');
})



