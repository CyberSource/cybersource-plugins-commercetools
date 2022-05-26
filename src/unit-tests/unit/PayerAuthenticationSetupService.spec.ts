/* eslint-disable sort-imports */
/* eslint-disable functional/immutable-data */
/* eslint-disable import/order */
import test from 'ava';
import dotenv from  'dotenv';

dotenv.config();
import {cardTokensObjects,  cardTokensInvalidCustomerObjects,payments, paymentObject, paymentSavedTokens } from '../const/PayerAuthenticationSetupServiceConst';
import setupService from '../../service/payment/PayerAuthenticationSetupService';

const paymentResponse = {
    httpCode: null,
    status: null,
  };

const paymentResponseObject = {
    httpCode: null,
    status: null,
  };

  test.serial('Check http code for payer auth set up', async(t)=>{
      const result:any = await setupService.payerAuthSetupResponse(payments, cardTokensObjects);
      paymentResponse.httpCode = result.httpCode;
      paymentResponse.status = result.status;
      t.is(paymentResponse.httpCode, 201);
  })

test.serial('Check status foR payer auth set up' , async (t)=>{
    
    t.is(paymentResponse.status, 'COMPLETED');
    
})

test.serial('Check http code for Payer auth set up with invalid token ', async(t)=>{
      const result:any = await setupService.payerAuthSetupResponse(paymentObject, cardTokensObjects);
      paymentResponseObject.httpCode = result.httpCode;
      paymentResponseObject.status = result.status;
      t.not(paymentResponseObject.httpCode, 201);
})
  
  test.serial('Check status for payer auth enroll with ivalid token' , async (t)=>{
    
    t.not(paymentResponseObject.status, 'COMPLETED');

  })

  test.serial('Check http code for Payer auth set up with saved token ', async(t)=>{
    
      const result:any = await setupService.payerAuthSetupResponse(paymentSavedTokens, cardTokensObjects);
      paymentResponseObject.httpCode = result.httpCode;
      paymentResponseObject.status = result.status;
      t.is(paymentResponseObject.httpCode, 201);
})

test.serial('Check status for payer auth enroll with saved token' , async (t)=>{
    
  t.is(paymentResponseObject.status, 'COMPLETED');

})

  
test.serial('Check http code for Payer auth set up with invalid customer', async(t)=>{
    
  const result:any = await setupService.payerAuthSetupResponse(paymentSavedTokens, cardTokensInvalidCustomerObjects);
  paymentResponseObject.httpCode = result.httpCode;
  paymentResponseObject.status = result.status;
  t.not(paymentResponseObject.httpCode, 201);
})

test.serial('Check status for payer auth enroll with invalid customer' , async (t)=>{

t.not(paymentResponseObject.status, 'COMPLETED');

})



