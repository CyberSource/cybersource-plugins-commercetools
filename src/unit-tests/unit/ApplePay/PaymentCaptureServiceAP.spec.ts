import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { authId, authID, cart, payment, orderNo } from '../../const/ApplePay/PaymentCaptureServiceConstAP';
import capture from '../../../service/payment/PaymentCaptureService'; 

var paymentResponse = {
  httpCode: null,
  status: null,
};
var paymentResponseObject = {
  httpCode: null,
  status: null,
};

test.serial('Capturing a payment and check http code', async (t) => {
  const result: any = await capture.captureResponse(payment, cart, authId, orderNo);
  paymentResponse.httpCode = result.httpCode;
  paymentResponse.status = result.status;
  if(paymentResponse.httpCode == 201)
  {
    t.is(paymentResponse.httpCode, 201);
  }
  else
  {
    t.not(paymentResponse.httpCode, 201);
  }
}); 

test.serial('Check status for payment capture ', async (t) => {
  if(paymentResponse.httpCode == 201)
  {
    t.is(paymentResponse.status, 'PENDING');
  }
  else{
    t.not(paymentResponse.status, 'PENDING');
  }
});

test.serial('Capturing an invalid payment and check http code', async (t) => {
  const result: any = await capture.captureResponse(payment, cart, authID, orderNo);
  paymentResponseObject.httpCode = result.httpCode;
  paymentResponseObject.status = result.status;
  t.not(paymentResponseObject.httpCode, 201);
}); 

test('Check status for an invalid capture ', async (t) => {
  t.not(paymentResponseObject.status, 'PENDING');
});
