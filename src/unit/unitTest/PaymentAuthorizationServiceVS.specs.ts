import test from 'ava';
import dotenv from 'dotenv';

import {cart, payment, service} from '../../const/PaymentAuthorizationServiceVsConst';
import auth from '../../service/payment/PaymentAuthorizationService';
dotenv.config();


test(' execution of auth for vs httpCode', async(t)=>{
    const result: any = await auth.authorizationResponse(payment, cart, service);
    console.log("result ",result);
    t.is(result.httpCode, 201);
})

test(' execution of auth for vs status', async(t)=>{
    const result: any = await auth.authorizationResponse(payment, cart, service);
    console.log("result ",result);
    t.is(result.status, 'AUTHORIZED');
})