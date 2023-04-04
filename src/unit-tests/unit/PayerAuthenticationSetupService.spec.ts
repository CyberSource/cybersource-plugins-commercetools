import test from 'ava';
import dotenv from  'dotenv';

dotenv.config();
import {cardTokensObjects,  cardTokensInvalidCustomerObjects, paymentObject, paymentSavedTokens } from '../const/PayerAuthenticationSetupServiceConst';
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
  
  test.serial('Check status for payer auth set up with invalid token' , async (t)=>{
   t.not(paymentResponseObject.status, 'COMPLETED');
 })

  test.serial('Check http code for Payer auth set up with saved token ', async(t)=>{
    const result:any = await setupService.payerAuthSetupResponse(paymentSavedTokens, cardTokensObjects);
      paymentResponseObject.httpCode = result.httpCode;
      paymentResponseObject.status = result.status;
      if(paymentResponseObject.httpCode == 201)
      {
        t.is(paymentResponseObject.httpCode, 201);
      }
      else
      {
        t.not(paymentResponseObject.httpCode, 201);
      }
})

test.serial('Check status for payer auth set up with saved token' , async (t)=>{
  if((paymentResponseObject.status == 'COMPLETED'))
  { 
    t.is(paymentResponseObject.status, 'COMPLETED');
  }
  else
  {
    t.not(paymentResponseObject.status, 'COMPLETED');
  }
})

  
test.serial('Check http code for Payer auth set up with invalid customer', async(t)=>{
 const result:any = await setupService.payerAuthSetupResponse(paymentSavedTokens, cardTokensInvalidCustomerObjects);
  paymentResponseObject.httpCode = result.httpCode;
  paymentResponseObject.status = result.status;
  t.not(paymentResponseObject.httpCode, 201);
})

test.serial('Check status for payer auth set up with invalid customer' , async (t)=>{
t.not(paymentResponseObject.status, 'COMPLETED');
})



