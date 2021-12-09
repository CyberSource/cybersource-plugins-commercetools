import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();

import {cardinalReferenceId, cart , payment} from '../../const/PayerAuthenticationEnrollServiceConst';
import enrollAuth from '../../service/payment/PayerAuthenticationEnrollService';




// test('testing for payer auth enroll service httpCode for failure', async(t)=>{
//     const result: any = await enrollAuth.enrolmentCheck(payment,
//         cart,
//         transientTokens,
//         cardinalReferenceId);
//     console.log("result for auth enroll ",result);
//     t.is(result.httpCode, 400);
// })

test('testing for payer auth enroll service httpCode', async(t)=>{
    const result: any = await enrollAuth.payerAuthEnrollmentCheck(payment,
        cart,
        cardinalReferenceId);
    console.log("result for auth enroll ",result);
    t.is(result.httpCode, 201);
})

test('testing for payer auth enroll service  status', async(t)=>{
    const result: any = await enrollAuth.payerAuthEnrollmentCheck(payment,
        cart,
        cardinalReferenceId);
        console.log("result ",result);
    t.is(result.status ,'AUTHENTICATION_SUCCESSFUL');
    
})

// test('testing for payer auth enroll service  status for failure status', async(t)=>{
//     const result: any = await enrollAuth.enrolmentCheck(payment,
//         cart,
//         transientTokens,
//         cardinalReferenceId);
//         console.log("result ",result);
//     t.is(result.status ,'INVALID_REQUEST');
    
// })