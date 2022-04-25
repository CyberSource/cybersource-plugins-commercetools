/* eslint-disable sort-imports */
/* eslint-disable functional/immutable-data */
/* eslint-disable import/order */
import test from 'ava';
import dotenv from  'dotenv';

dotenv.config();
import {cardTokensObject, cardTokensObjects,  cardTokensInvalidCustomerObjects, paymentObject, paymentSavedTokens } from '../const/PayerAuthenticationSetupServiceConst';
import setupService from '../../service/payment/PayerAuthenticationSetupService';


const paymentResponseObject = {
    httpCode: null,
    status: null,
  };

test.serial('Check http code for Payer auth set up with invalid token ', async(t)=>{
      const result:any = await setupService.payerAuthSetupResponse(paymentObject, cardTokensObjects);
      paymentResponseObject.httpCode = result.httpCode;
      paymentResponseObject.status = result.status;
      t.not(paymentResponseObject.httpCode, 201);
})
  
  test.serial('Check status for payer auth enroll with invalid token' , async (t)=>{
    
    t.not(paymentResponseObject.status, 'COMPLETED');

  })

  test.serial('Check http code for Payer auth set up with saved token ', async(t)=>{
    
      const result:any = await setupService.payerAuthSetupResponse(paymentSavedTokens, cardTokensObject);
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



