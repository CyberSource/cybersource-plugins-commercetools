/* eslint-disable no-var */
/* eslint-disable functional/immutable-data */
/* eslint-disable import/order */
import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();

import {cardinalReferenceId, cart , payment, payments} from '../const/PayerAuthenticationEnrollServiceConst';
import enrollAuth from '../../service/payment/PayerAuthenticationEnrollService';

var enrollmentCheckResponse = {
    httpCode: null,
    transactionId: null,
    status: null,
    message: null,
    data: null,
    cardinalReferenceId: null,
  };


test.serial('calling payer auth enrollment', async(t)=>{
    const result: any = await enrollAuth.payerAuthEnrollmentCheck(payment,
        cart,
        cardinalReferenceId);
        enrollmentCheckResponse.httpCode = result.httpCode;
        enrollmentCheckResponse.transactionId = result.transactionId;
        enrollmentCheckResponse.status = result.status;
        enrollmentCheckResponse.message = result.message;
        enrollmentCheckResponse.data = result.data;
        enrollmentCheckResponse.cardinalReferenceId = result.cardinalReferenceId;
    t.pass();
})

test.serial('testing for payer auth enroll service httpCode', async(t)=>{
    
    t.is(enrollmentCheckResponse.httpCode, 201);

})

test.serial('testing for payer auth enroll service  status', async(t)=>{
    
    t.is(enrollmentCheckResponse.status ,'AUTHENTICATION_SUCCESSFUL');
    
})

test.serial('calling payer auth enrollment with invalid token', async(t)=>{
    const result: any = await enrollAuth.payerAuthEnrollmentCheck(payments,
        cart,
        cardinalReferenceId);
        enrollmentCheckResponse.httpCode = result.httpCode;
        enrollmentCheckResponse.transactionId = result.transactionId;
        enrollmentCheckResponse.status = result.status;
        enrollmentCheckResponse.message = result.message;
        enrollmentCheckResponse.data = result.data;
        enrollmentCheckResponse.cardinalReferenceId = result.cardinalReferenceId;
    t.pass();
})

test.serial('testing for payer auth enroll service httpCode for invalid token', async(t)=>{
    
    t.not(enrollmentCheckResponse.httpCode, 201);

})

test.serial('testing for payer auth enroll service  status for invalid token', async(t)=>{
    
    t.not(enrollmentCheckResponse.status ,'AUTHENTICATION_SUCCESSFUL');
    
})

