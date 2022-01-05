/* eslint-disable functional/immutable-data */
/* eslint-disable import/order */
import test from 'ava';
import dotenv from  'dotenv';

dotenv.config();
import {payments } from '../const/PayerAuthenticationSetupServiceConst';
import setupService from '../../service/payment/PayerAuthenticationSetupService';

const paymentResponse = {
    accessToken: null,
    referenceId: null,
    deviceDataCollectionUrl: null,
    httpCode: null,
    transactionId: null,
    status: null,
    message: null,
  };

  test.serial('calling payer auth set up function ', async(t)=>{
      const result:any = await setupService.payerAuthSetupResponse(payments);
      paymentResponse.accessToken = result.accessToken;
      paymentResponse.referenceId = result.refernceId;
      paymentResponse.deviceDataCollectionUrl = result.deviceDataCollectionUrl;
      paymentResponse.httpCode = result.httpCode;
      paymentResponse.transactionId = result.transactionId;
      paymentResponse.status = result.status;
      paymentResponse.message = result.messsage;
      t.pass();
  })

test.serial('execution of setup service for payer auth http code' , async (t)=>{
    
    t.is(paymentResponse.httpCode, 201);

})


test.serial('execution of setup service for payer auth status' , async (t)=>{
    
    t.is(paymentResponse.status, 'COMPLETED');
    
})



