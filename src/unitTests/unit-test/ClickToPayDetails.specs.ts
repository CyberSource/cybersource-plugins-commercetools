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
    billToFieldGroup: null,
    shipToFieldGroup: null,
    cardFieldGroup: null,
    message: null,
  };

test.serial('Get click to pay data',async (t)=>{
    const response = await getVisaCheckoutData.getVisaCheckoutData(paymentResponse);
    visaCheckoutData.httpCode = response.httpCode;
    visaCheckoutData.billToFieldGroup = response.billToFieldGroup;
    visaCheckoutData.shipToFieldGroup = response.shipToFieldGroup;
    visaCheckoutData.cardFieldGroup = response.cardFieldGroup;
    visaCheckoutData.message = response.message;
    t.pass();
})

test.serial('Check status for click to pay', (t)=>{
    
    t.is(visaCheckoutData.httpCode, 200);
    
})

test.serial('Get click to pay data for invalid order',async (t)=>{
    const response = await getVisaCheckoutData.getVisaCheckoutData(paymentResponses);
    visaCheckoutData.httpCode = response.httpCode;
    visaCheckoutData.billToFieldGroup = response.billToFieldGroup;
    visaCheckoutData.shipToFieldGroup = response.shipToFieldGroup;
    visaCheckoutData.cardFieldGroup = response.cardFieldGroup;
    visaCheckoutData.message = response.message;
    t.pass();
})

test.serial('Check status for invalid order', (t)=>{
    
    t.not(visaCheckoutData.httpCode, 200);
    
})


