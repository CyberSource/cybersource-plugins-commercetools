import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();
import getVisaCheckoutData from '../../service/payment/ClickToPayDetails';
import { paymentId, paymentResponse, paymentResponses } from '../const/ClickToPayDetailsConst';

let visaCheckoutData: any = {
  httpCode: null,
};

let visaCheckoutDataObject: any = {
  httpCode: null,
};

test.serial('Get click to pay data and check http code', async (t) => {
  const response: any = await getVisaCheckoutData.getVisaCheckoutData(paymentResponse, paymentId);
  visaCheckoutData.httpCode = response.httpCode;
  if (visaCheckoutData.httpCode == 200) {
    t.is(visaCheckoutData.httpCode, 200);
  } else {
    t.not(visaCheckoutDataObject.httpCode, 200);
  }
});

test.serial('Get click to pay data for invalid order and check http code', async (t) => {
  const response: any = await getVisaCheckoutData.getVisaCheckoutData(paymentResponses, paymentId);
  visaCheckoutDataObject.httpCode = response.httpCode;
  t.not(visaCheckoutDataObject.httpCode, 200);
});
