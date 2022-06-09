/* eslint-disable sort-imports */
import test from 'ava';

import dotenv from 'dotenv';
dotenv.config();

import addTokenService from '../../service/payment/AddTokenService';
import { addTokenResponseCustomerId, addTokenResponseCustomerObj,addTokenResponseAddress, addTokenResponseCardTokens } from '../const/AddTokenServiceConst';

var paymentResponse = {
    httpCode: null,
    status: null,
   };

test.serial("Get response of add token and check http code", async(t)=>{
    const result:any = await addTokenService.addTokenResponse(addTokenResponseCustomerId, addTokenResponseCustomerObj, addTokenResponseAddress, addTokenResponseCardTokens);
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    if(paymentResponse.httpCode == 201)
    {
        t.is(paymentResponse.httpCode, 201)
    }
    else
    {
        t.not(paymentResponse.httpCode, 201)
    }
})

test.serial("Get response of add token and check status", async(t)=>{
    if(paymentResponse.status == 'AUTHORIZED')
    {
        t.is(paymentResponse.status, 'AUTHORIZED')
    }
    else
    {
        t.not(paymentResponse.status, 'AUTHORIZED')
    }
   

})

