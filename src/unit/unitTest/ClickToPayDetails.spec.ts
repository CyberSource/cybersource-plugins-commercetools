/* eslint-disable import/order */
import test from 'ava'
import dotenv from 'dotenv';
dotenv.config();
import getVisaCheckoutData from '../../service/payment/ClickToPayDetails';
import { paymentResponse } from '../../const/ClickToPayDetailsConst';


test('for checking execution of function',async (t)=>{
    const response = await getVisaCheckoutData.getVisaCheckoutData(paymentResponse);
    console.log("response ", response);
    t.pass();
})

test('for checking status',async (t)=>{
    const response : any= await getVisaCheckoutData.getVisaCheckoutData(paymentResponse);
    console.log("response ", response);
    t.is(response.httpCode, 200);
    console.log("billToField", response.billToFieldGroup);
    console.log("billToField", response.billToFieldGroup.exports);
    console.log("billToField", response.billToFieldGroup[exports]);
})


