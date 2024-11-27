import test from 'ava';
import dotenv from 'dotenv';

import tokenHelper from '../../../../utils/helpers/TokenHelper';
import unit from '../../../JSON/unit.json'
import AddTokenServiceConst from '../../../const/AddTokenServiceConst';
import PaymentHandlerConst from '../../../const/PaymentHandlerConst';
import PaymentServiceConst from '../../../const/PaymentServiceConst';
import PaymentUtilsConst from '../../../const/PaymentUtilsConst';

dotenv.config();

test.serial('Get bill to fields', async (t) => {
  const result = await tokenHelper.getBillToFields(AddTokenServiceConst.addTokenResponseCustomerObj.custom.fields, AddTokenServiceConst.addTokenResponseAddress, AddTokenServiceConst.addTokenResponseCustomerObj);
  t.pass();
  if (result) {
    let i = 0;
    if ('id' in result && 'firstName' in result && 'lastName' in result && 'streetName' in result) {
      i++;
    }
    t.is(i, 1);
  } else {
    t.pass();
  }
})

test.serial('Get bill to fields when custom fields are empty', async (t) => {
  const result = await tokenHelper.getBillToFields(null, AddTokenServiceConst.addTokenResponseAddress, AddTokenServiceConst.addTokenResponseCustomerObj);
  t.is(result, null);
})

test.serial('Get bill to fields when custom fields has string value', async (t) => {
  const result = await tokenHelper.getBillToFields('12345', AddTokenServiceConst.addTokenResponseAddress, AddTokenServiceConst.addTokenResponseCustomerObj);
  t.is(result, null);
})

test.serial('Get bill to fields when custom fields has boolean value', async (t) => {
  const result = await tokenHelper.getBillToFields(true, AddTokenServiceConst.addTokenResponseAddress, AddTokenServiceConst.addTokenResponseCustomerObj);
  t.is(result, null);
})

test.serial('Get bill to fields for unified checkout', async (t) => {
  AddTokenServiceConst.addTokenResponseCustomerObj.custom.fields.isv_addressId = 'UCAddress';
  const result = await tokenHelper.getBillToFields(AddTokenServiceConst.addTokenResponseCustomerObj.custom.fields, AddTokenServiceConst.addTokenResponseAddress, AddTokenServiceConst.addTokenResponseCustomerObj);
  t.pass();
  if (result) {
    let i = 0;
    if ('id' in result && 'firstName' in result && 'lastName' in result && 'streetName' in result) {
      i++;
    }
    t.is(i, 1);
  } else {
    t.pass();
  }
})

test.serial('get saved card count for rate limiter', async (t: any) => {
  let startTime = new Date();
  startTime.setHours(startTime.getHours() - Number(process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME));
  let result = await tokenHelper.getRateLimiterTokenCount(PaymentHandlerConst.updateCardHandlerCustomerObj, new Date(startTime).toISOString(), new Date(Date.now()).toISOString());
  let i = 0;
  if ('number' == typeof result) {
    i++;
  }
  t.is(i, 1);
});

test.serial('get saved card count for rate limiter with empty start time', async (t: any) => {
  let result = await tokenHelper.getRateLimiterTokenCount(PaymentHandlerConst.updateCardHandlerCustomerObj, '', new Date(Date.now()).toISOString());

  t.is(result, 0);
});

test.serial('get saved card count for rate limiter with invalid start time', async (t: any) => {
  let result = await tokenHelper.getRateLimiterTokenCount(PaymentHandlerConst.updateCardHandlerCustomerObj, '$^&**^%', new Date(Date.now()).toISOString());
  t.is(result, 0);
});

test.serial('get saved card count for rate limiter when end time is empty', async (t: any) => {
  let startTime = new Date();
  startTime.setHours(startTime.getHours() - Number(process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME));
  let result = await tokenHelper.getRateLimiterTokenCount(PaymentHandlerConst.updateCardHandlerCustomerObj, new Date(startTime).toISOString(), '');
  t.is(result, 0);
});

test.serial('get saved card count for rate limiter when end time is invalid', async (t: any) => {
  let startTime = new Date();
  startTime.setHours(startTime.getHours() - Number(process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME));
  let result = await tokenHelper.getRateLimiterTokenCount(PaymentHandlerConst.updateCardHandlerCustomerObj, new Date(startTime).toISOString(), '#&W^%');
  t.is(result, 0);
});

test.serial('get saved card count for rate limiter when start time and end time are invalid', async (t: any) => {
  let result = await tokenHelper.getRateLimiterTokenCount(PaymentHandlerConst.updateCardHandlerCustomerObj, '#$%%^&*', '#&W^%');
  t.is(result, 0);
});

test.serial('Processing response for invalid card ', async (t) => {
  const result = await tokenHelper.processInvalidCardResponse(AddTokenServiceConst.addTokenResponseCustomerObj.custom.fields, AddTokenServiceConst.addTokenResponseCustomerObj, unit.customerId)
  t.pass();
  t.is(result.actions[0].name, 'isv_tokens');
  t.is(result.actions[1].name, 'isv_tokenUpdated');
  t.is(result.actions[2].name, 'isv_failedTokens');
  t.is(result.actions[3].name, 'isv_tokenAlias');
  t.is(result.actions[4].name, 'isv_cardType');
  t.is(result.actions[5].name, 'isv_cardExpiryYear');
  t.is(result.actions[6].name, 'isv_cardExpiryMonth');
  t.is(result.actions[7].name, 'isv_addressId');
  t.is(result.actions[8].name, 'isv_currencyCode');
  t.is(result.actions[9].name, 'isv_deviceFingerprintId');
  t.is(result.actions[10].name, 'isv_token');
  t.is(result.actions[11].name, 'isv_maskedPan');

})

test.serial('Processing response for invalid card when custom field is not present', async (t) => {
  await tokenHelper.processInvalidCardResponse('', AddTokenServiceConst.addTokenResponseCustomerObj, unit.customerId)
  t.pass();
})

test.serial('Processing response for invalid card when custom field is an string', async (t) => {
  await tokenHelper.processInvalidCardResponse('^&*I(*', AddTokenServiceConst.addTokenResponseCustomerObj, unit.customerId)
  t.pass()
})

test.serial('Processing response for invalid card when customer id is empty', async (t) => {
  const result = await tokenHelper.processInvalidCardResponse(AddTokenServiceConst.addTokenResponseCustomerObj.custom.fields, AddTokenServiceConst.addTokenResponseCustomerObj, '')
  t.pass();
  t.is(result.actions[0].name, 'isv_tokens');
  t.is(result.actions[1].name, 'isv_tokenUpdated');
  t.is(result.actions[2].name, 'isv_failedTokens');
  t.is(result.actions[3].name, 'isv_tokenAlias');
  t.is(result.actions[4].name, 'isv_cardType');
  t.is(result.actions[5].name, 'isv_cardExpiryYear');
  t.is(result.actions[6].name, 'isv_cardExpiryMonth');
  t.is(result.actions[7].name, 'isv_addressId');
  t.is(result.actions[8].name, 'isv_currencyCode');
  t.is(result.actions[9].name, 'isv_deviceFingerprintId');
  t.is(result.actions[10].name, 'isv_token');
  t.is(result.actions[11].name, 'isv_maskedPan');
})

test.serial('Processing valid card response ', async (t) => {
  const result = await tokenHelper.processValidCardResponse(AddTokenServiceConst.addTokenResponseCustomerObj.custom.fields, PaymentServiceConst.processTokensCustomerCardTokensObject, PaymentUtilsConst.validAddTokenResponse, AddTokenServiceConst.addTokenResponseCustomerObj, PaymentUtilsConst.createTokenDataAddress);
  t.pass();
  t.is(result.actions[0].name, 'isv_tokens');
  t.is(result.actions[1].name, 'isv_tokenUpdated');
  t.is(result.actions[2].name, 'isv_customerId');
  t.is(result.actions[3].name, 'isv_failedTokens');
  t.is(result.actions[4].name, 'isv_tokenAlias');
  t.is(result.actions[5].name, 'isv_cardType');
  t.is(result.actions[6].name, 'isv_cardExpiryYear');
  t.is(result.actions[7].name, 'isv_cardExpiryMonth');
  t.is(result.actions[8].name, 'isv_addressId');
  t.is(result.actions[9].name, 'isv_currencyCode');
  t.is(result.actions[10].name, 'isv_deviceFingerprintId');
  t.is(result.actions[11].name, 'isv_token');
  t.is(result.actions[12].name, 'isv_maskedPan');
})

test.serial('Processing valid card response when custom field is not present', async (t) => {
  const result = await tokenHelper.processValidCardResponse(null, PaymentServiceConst.processTokensCustomerCardTokensObject, PaymentUtilsConst.validAddTokenResponse, AddTokenServiceConst.addTokenResponseCustomerObj, PaymentUtilsConst.createTokenDataAddress);
  t.pass();
  t.is(result.actions[0].name, 'isv_tokens');
  t.is(result.actions[1].name, 'isv_tokenUpdated');
  t.is(result.actions[2].name, 'isv_customerId');
  t.is(result.actions[3].name, 'isv_failedTokens');
  t.is(result.actions[4].name, 'isv_tokenAlias');
  t.is(result.actions[5].name, 'isv_cardType');
  t.is(result.actions[6].name, 'isv_cardExpiryYear');
  t.is(result.actions[7].name, 'isv_cardExpiryMonth');
  t.is(result.actions[8].name, 'isv_addressId');
  t.is(result.actions[9].name, 'isv_currencyCode');
  t.is(result.actions[10].name, 'isv_deviceFingerprintId');
  t.is(result.actions[11].name, 'isv_token');
  t.is(result.actions[12].name, 'isv_maskedPan');
})

test.serial('Processing valid card response when custom field is a string', async (t) => {
  const result = await tokenHelper.processValidCardResponse('784^&*', PaymentServiceConst.processTokensCustomerCardTokensObject, PaymentUtilsConst.validAddTokenResponse, AddTokenServiceConst.addTokenResponseCustomerObj, PaymentUtilsConst.createTokenDataAddress);
  t.pass();
  t.is(result.actions[0].name, 'isv_tokens');
  t.is(result.actions[1].name, 'isv_tokenUpdated');
  t.is(result.actions[2].name, 'isv_customerId');
  t.is(result.actions[3].name, 'isv_failedTokens');
  t.is(result.actions[4].name, 'isv_tokenAlias');
  t.is(result.actions[5].name, 'isv_cardType');
  t.is(result.actions[6].name, 'isv_cardExpiryYear');
  t.is(result.actions[7].name, 'isv_cardExpiryMonth');
  t.is(result.actions[8].name, 'isv_addressId');
  t.is(result.actions[9].name, 'isv_currencyCode');
  t.is(result.actions[10].name, 'isv_deviceFingerprintId');
  t.is(result.actions[11].name, 'isv_token');
  t.is(result.actions[12].name, 'isv_maskedPan');
})
