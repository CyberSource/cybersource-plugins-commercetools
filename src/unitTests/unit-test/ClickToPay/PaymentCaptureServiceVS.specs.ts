/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
/* eslint-disable prefer-const */
/* eslint-disable import/order */
import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();

import {authId, authID, cart, payment} from '../../const/ClickToPay/PaymentCaptureServiceVsConst';
import capture from '../../../service/payment/PaymentCaptureService';

let paymentResponse = {
    httpCode: null,
    transactionId: null,
    status: null,
    message: null,
  };

test.serial('Capturing a payment', async (t)=>{
    const result : any= await capture.captureResponse(payment, cart, authId);
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.transactionId = result.transactionId;
    paymentResponse.status = result.status;
    paymentResponse.message = result.message;
    t.pass();
})  

test.serial('Check http code for payment capture', async(t)=>{
    
    t.is(paymentResponse.httpCode, 201);

})

test.serial('Check status for payment capture', async(t)=>{
    
    t.is(paymentResponse.status, 'PENDING');
    
})

test.serial('Capturing an invalid payment', async(t)=>{
    const result:any = await capture.captureResponse(payment, cart, authID);
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.transactionId = result.transactionId;
    paymentResponse.status = result.status;
    paymentResponse.message = result.message;
    t.pass();
})

test.serial('Check http code for invalid capture ', async(t)=>{

    t.not(paymentResponse.httpCode, 201);

})

test.serial('Check status for invalid capture ', async(t)=>{

    t.not(paymentResponse.status, 'PENDING');

})


