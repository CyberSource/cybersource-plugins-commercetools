/* eslint-disable functional/immutable-data */
import test from  'ava';
import dotenv from 'dotenv';
dotenv.config();
import {authID,authId,  cart, payment} from '../../const/GooglePay/PaymentCaptureServiceConstGP';
import captureResponse from '../../../service/payment/PaymentCaptureService';

let paymentResponse = {
    httpCode: null,
    transactionId: null,
    status: null,
    message: null,
    data: null,
  };

test.serial('Capturing a payment', async(t)=>{
    const result:any = await captureResponse.captureResponse(payment, cart, authID);
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.transactionId = result.transactionId;
    paymentResponse.status = result.status;
    paymentResponse.message = result.message;
    paymentResponse.data = result.data;
    t.pass();
})

test.serial('Check http code for payment capture', async(t)=>{

    t.is(paymentResponse.httpCode, 201);

})

test.serial('Check status for payment capture', async(t)=>{

    t.is(paymentResponse.status, 'PENDING');

})

test.serial('Capturing an invalid payment', async(t)=>{
    const result:any = await captureResponse.captureResponse(payment, cart, authId);
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.transactionId = result.transactionId;
    paymentResponse.status = result.status;
    paymentResponse.message = result.message;
    paymentResponse.data = result.data;
    t.pass();
})

test.serial('Check http code for invalid capture ', async(t)=>{

    t.not(paymentResponse.httpCode, 201);

})

test.serial('Check status for invalid capture ', async(t)=>{

    t.not(paymentResponse.status, 'PENDING');

})

