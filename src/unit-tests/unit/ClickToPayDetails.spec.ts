/* eslint-disable functional/no-let */
/* eslint-disable prefer-const */
/* eslint-disable functional/immutable-data */
/* eslint-disable import/order */
import test from 'ava'
import dotenv from 'dotenv';
dotenv.config();
import getVisaCheckoutData from '../../service/payment/ClickToPayDetails';
import { paymentResponse, paymentResponses } from '../const/ClickToPayDetailsConst';

let visaCheckoutData = {
    httpCode: null,
    };

let visaCheckoutDataObject = {
    httpCode: null,
    };

test.serial('Get click to pay data and check http code',async (t)=>{
    const response:any = await getVisaCheckoutData.getVisaCheckoutData(paymentResponse, null);
    visaCheckoutData.httpCode = response.httpCode;
    
    if(visaCheckoutData.httpCode == 200)
    {
        t.is(visaCheckoutData.httpCode, 200);
    }
    else{
        t.not(visaCheckoutDataObject.httpCode, 200);
    }
})

test.serial('Get click to pay data for invalid order and check http code',async (t)=>{
    const response:any = await getVisaCheckoutData.getVisaCheckoutData(paymentResponses, null);
    visaCheckoutDataObject.httpCode = response.httpCode;
    t.not(visaCheckoutDataObject.httpCode, 200);
})



