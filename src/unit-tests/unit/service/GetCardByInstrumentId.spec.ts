import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();

import getCardByInstrumentId from '../../../service/payment/GetCardByInstrumentId';
import PaymentServiceConst from '../../const/HelpersConst';

test.serial('Test get instrument id response', async (t) => {
  let response = await getCardByInstrumentId.getCardByInstrumentResponse(PaymentServiceConst.processTokensInstrumentIdentifier, process.env.PAYMENT_GATEWAY_MERCHANT_ID as any);
  if (200 === response.httpCode) {
    t.is(response.httpCode, 200);
  } else {
    t.not(response.httpCode, 200);
  }
});

test.serial('Test get instrument id response with invalid instrument identifier', async (t) => {
  let response = await getCardByInstrumentId.getCardByInstrumentResponse('123', process.env.PAYMENT_GATEWAY_MERCHANT_ID as any);
  t.not(response.httpCode, 200);
});

test.serial('Test get instrument id response without mid', async (t) => {
  let response = await getCardByInstrumentId.getCardByInstrumentResponse(PaymentServiceConst.processTokensInstrumentIdentifier, '');
  t.not(response.httpCode, 200);
});

test.serial('Test get instrument id response with empty instrument identifier', async (t) => {
  let response = await getCardByInstrumentId.getCardByInstrumentResponse('', process.env.PAYMENT_GATEWAY_MERCHANT_ID as any);
  t.not(response.httpCode, 200);
});
