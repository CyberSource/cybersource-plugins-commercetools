import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../../constants/constants';
import getTransactionData from '../../../service/payment/GetTransactionData';
import PaymentAuthorizationServiceVsConst from '../../const/ClickToPay/PaymentAuthorizationServiceVsConst';
import GetTransactionDataConst from '../../const/GetTransactionDataConst';

let visaCheckoutData: any = {
  httpCode: null,
};

test.serial('Get click to pay data and check http code', async (t: any) => {
  let response: any = await getTransactionData.getTransactionData(GetTransactionDataConst.paymentResponse.transactionId, PaymentAuthorizationServiceVsConst.payment,null);
  visaCheckoutData.httpCode = response.httpCode;
  if (Constants.HTTP_OK_STATUS_CODE == visaCheckoutData.httpCode) {
    t.is(visaCheckoutData.httpCode, Constants.HTTP_OK_STATUS_CODE);
  } else {
    t.not(visaCheckoutData.httpCode, Constants.HTTP_OK_STATUS_CODE);
  }
});

test.serial('Get click to pay data for invalid order and check http code', async (t: any) => {
  let response: any = await getTransactionData.getTransactionData(GetTransactionDataConst.paymentResponses.transactionId, PaymentAuthorizationServiceVsConst.payment,null);
  visaCheckoutData.httpCode = response.httpCode;
  t.not(visaCheckoutData.httpCode, Constants.HTTP_OK_STATUS_CODE);
});

test.serial('Get click to pay data with empty payment response and check http code', async (t: any) => {
  let response: any = await getTransactionData.getTransactionData('', PaymentAuthorizationServiceVsConst.payment,null);
  visaCheckoutData.httpCode = response.httpCode;
  t.is(visaCheckoutData.httpCode, 0);
});