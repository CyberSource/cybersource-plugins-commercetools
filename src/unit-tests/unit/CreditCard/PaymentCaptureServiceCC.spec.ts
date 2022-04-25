/* eslint-disable functional/immutable-data */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { authId, authID, cart, payment } from '../../const/CreditCard/PaymentCaptureServiceConstCC';
import capture from '../../../service/payment/PaymentCaptureService';

var paymentResponse = {
    httpCode: null,
    status: null,
   };

var paymentResponseObject = {
    httpCode: null,
    status: null,
   };

test.serial('Capturing a payment and check http code', async(t)=>{
    const result: any = await capture.captureResponse(payment, cart, authId);
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    t.is(paymentResponse.httpCode, 201);
})

test.serial('Check status for payment capture', async (t) => {
    
    t.is(paymentResponse.status, 'PENDING');

})

test.serial('Capturing an invalid payment', async(t)=>{
    const result:any = await capture.captureResponse(payment, cart, authID);
    paymentResponseObject.httpCode = result.httpCode;
    paymentResponseObject.status = result.status;
    t.not(paymentResponseObject.httpCode, 201);
})

test.serial('Check status for invalid capture ', async(t)=>{

    t.not(paymentResponseObject.status, 'PENDING');

})


