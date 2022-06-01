/* eslint-disable sort-imports */
import test from 'ava';

import dotenv from 'dotenv';
dotenv.config();

import addTokenService from '../../service/payment/AddTokenService';
import { addTokenResponseCustomerId, addTokenResponseCustomerObj, addInvalidTokenResponseCustomerObj,addTokenResponseAddress, addTokenResponseCardTokens } from '../const/AddTokenServiceConst';

var paymentResponse = {
    httpCode: null,
    status: null,
   };

test.serial("Get response of add token and check http code", async(t)=>{
    const result:any = await addTokenService.addTokenResponse(addTokenResponseCustomerId, addTokenResponseCustomerObj, addTokenResponseAddress, addTokenResponseCardTokens);
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    t.is(paymentResponse.httpCode, 201)
})

test.serial("Get response of add token and check status", async(t)=>{
    
    t.is(paymentResponse.status, 'AUTHORIZED')

})

test.serial("Get response of add token with invalid token and check http code", async(t)=>{
    const result:any = await addTokenService.addTokenResponse(addTokenResponseCustomerId, addInvalidTokenResponseCustomerObj, addTokenResponseAddress, addTokenResponseCardTokens);
    paymentResponse.httpCode = result.httpCode;
    paymentResponse.status = result.status;
    t.is(paymentResponse.httpCode, 400)
})

test.serial("Get response of add token with invalid token and check status", async(t)=>{
    
    t.is(paymentResponse.status, 'INVALID_REQUEST')
    
})