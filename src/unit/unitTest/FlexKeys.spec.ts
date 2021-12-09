/* eslint-disable no-var */
/* eslint-disable import/order */
import test from 'ava';

import key from '../../service/payment/FlexKeys';
import dotenv from  'dotenv';
dotenv.config();

test('for execution of function ',async (t)=>{
const result = await key.keys();
console.log("result ", result);
t.pass();
})

test('for checking capture function ',async (t)=>{
    const result: any = await key.keys();
    console.log("result ", result);
    var i =0;
    if('isv_tokenCaptureContextSignature' in result)
    {
       i++;
    }
    t.is(i, 1);
 })

 test('for checking verification context ',async (t)=>{
    const result: any = await key.keys();
    console.log("result ", result);
    var i =0;
    if('isv_tokenVerificationContext' in result)
    {
       i++;
    }
    t.is(i, 1);
 })

 test('for checking any other context ',async (t)=>{
    const result: any = await key.keys();
    console.log("result ", result);
    var i =0;
    if('anyOtherContextSignature' in result)
    {
       i++;
    }
    t.is(i, 0);
 })