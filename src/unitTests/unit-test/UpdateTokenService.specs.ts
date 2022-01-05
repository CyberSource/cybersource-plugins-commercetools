/* eslint-disable functional/immutable-data */
/* eslint-disable no-var */

import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();

import updateToken from '../../service/payment/UpdateTokenService';
import {tokenObject, tokens} from '../const/UpdateTokenServiceConst';

var result = {
    httpCode:null,
    default: null,
    card:null,
    message:null
}

test.serial('calling update function ', async (t)=>{
    const response:any = await updateToken.updateTokenResponse(tokens);
    result.httpCode=response.httpCode;
    result.default=response.default;
    result.card=response.card;
    result.message=response.message;
    t.pass()
})

test.serial('update function for http code', async(t)=>{
    
    t.is(result.httpCode, 200);
    
})

test.serial('update function for default value', async(t)=>{

    t.is(result.default, true);

})

test.serial('updating an invalied token', async (t)=>{
    const response:any = await updateToken.updateTokenResponse(tokenObject);
    result.httpCode=response.httpCode;
    result.default=response.default;
    result.card=response.card;
    result.message=response.message;
    t.pass()
})

test.serial('http code for updating invalid token', async(t)=>{
    
    t.not(result.httpCode, 200);
   
})

test.serial('default value for invalid token', async(t)=>{
   
    t.not(result.default, true);
    
})

