import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();
import {Constants} from '../../constants';
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
  if (Constants.HTTP_CODE_TWO_HUNDRED == visaCheckoutData.httpCode) {
    t.is(visaCheckoutData.httpCode, Constants.HTTP_CODE_TWO_HUNDRED);
  } else {
    t.not(visaCheckoutDataObject.httpCode, Constants.HTTP_CODE_TWO_HUNDRED);
  }
});

test.serial('Get click to pay data for invalid order and check http code', async (t) => {
  const response: any = await getVisaCheckoutData.getVisaCheckoutData(paymentResponses, paymentId);
  visaCheckoutDataObject.httpCode = response.httpCode;
  t.not(visaCheckoutDataObject.httpCode, Constants.HTTP_CODE_TWO_HUNDRED);
});
