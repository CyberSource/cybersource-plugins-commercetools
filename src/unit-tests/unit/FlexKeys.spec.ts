/* eslint-disable no-var */
/* eslint-disable import/order */
import test from 'ava';

import key from '../../service/payment/FlexKeys';
import dotenv from  'dotenv';
dotenv.config();



test('Check for capture context',async (t)=>{
    const result: any = await key.keys();
    var i =0;
    if('isv_tokenCaptureContextSignature' in result)
    {
       i++;
    }
    t.is(i, 1);
 })

 test('Check for verification context',async (t)=>{
    const result: any = await key.keys();
    var i =0;
    if('isv_tokenVerificationContext' in result)
    {
       i++;
    }
    t.is(i, 1);
 })

 test('Check for any other context',async (t)=>{
    const result: any = await key.keys();
    var i =0;
    if('isv_tokenVerificationContext' in result && 'isv_tokenCaptureContextSignature' in result)
    {
       i=0;
    }
    else
    {
       i++;
    }
    t.is(i, 0);
 })