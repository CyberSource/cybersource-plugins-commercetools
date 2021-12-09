import test from 'ava';
import dotenv from  'dotenv';

dotenv.config();
import {payments } from '../../const/PayerAuthenticationSetupServiceConst';
import setupService from '../../service/payment/PayerAuthenticationSetupService';

test('execution of setup service for payer auth http code' , async (t)=>{
    const result: any = await setupService.payerAuthSetupResponse(payments);
    console.log("result for setup payer auth ", result);
    t.is(result.httpCode, 201);
})

// test('execution of setup service for payer auth http code for failure' , async (t)=>{
//     const result: any = await setupService.getPayerAuthSetupResponse(id, jtiTokens);
//     console.log("result for setup payer auth ", result);
//     t.is(result.httpCode, 400);
// })

test('execution of setup service for payer auth status' , async (t)=>{
    const result: any = await setupService.payerAuthSetupResponse(payments);
    console.log("result for setup payer auth ", result);
    t.is(result.status, 'COMPLETED');
})

// test('execution of setup service for payer auth status for failure' , async (t)=>{
//     const result: any = await setupService.getPayerAuthSetupResponse(id, jtiTokens);
//     console.log("result for setup payer auth ", result);
//     t.is(result.status, 'INVALID_REQUEST');
// })