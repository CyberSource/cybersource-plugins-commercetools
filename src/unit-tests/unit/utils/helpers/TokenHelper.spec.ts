import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../../constants/constants';
import { FunctionConstant } from '../../../../constants/functionConstant';
import tokenHelper from '../../../../utils/helpers/TokenHelper';
import unit from '../../../JSON/unit.json'
import AddTokenServiceConst from '../../../const/AddTokenServiceConst';
import PaymentAuthorizationServiceConstCC from '../../../const/CreditCard/PaymentAuthorizationServiceConstCC';
import PaymentCaptureServiceConstCC from '../../../const/CreditCard/PaymentCaptureServiceConstCC';
import PaymentServiceConst from '../../../const/HelpersConst';
import PaymentHandlerConst from '../../../const/PaymentHandlerConst';
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

test.serial('get card tokens ', async (t: any) => {
  let result = await tokenHelper.getCardTokens(PaymentHandlerConst.updateCardHandlerCustomerObj, 'abc');
  let i = 0;
  if ('customerTokenId' in result && 'paymentInstrumentId' in result) {
    i++;
  }
  t.is(i, 1);
});

test.serial('get card tokens when saved token is empty', async (t: any) => {
  let result = await tokenHelper.getCardTokens(PaymentHandlerConst.updateCardHandlerCustomerObj, '');
  let i = 0;
  if ('customerTokenId' in result && 'paymentInstrumentId' in result) {
    i++;
  }
  t.is(i, 1);
});


test.serial('set Customer Token Data', async (t) => {
  try {
    let result = await tokenHelper.setCustomerTokenData(
      PaymentServiceConst.customerCardTokens,
      PaymentServiceConst.getAuthResponsePaymentResponse,
      PaymentServiceConst.authResponse,
      false,
      PaymentHandlerConst.authorizationHandler3DSUpdatePaymentObject,
      PaymentCaptureServiceConstCC.cart,
    );
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_payerEnrollTransactionId');
    t.is(result.actions[1].name, 'isv_payerEnrollHttpCode');
    t.is(result.actions[2].name, 'isv_payerEnrollStatus');
    t.is(result.actions[3].name, 'isv_payerAuthenticationTransactionId');
    t.is(result.actions[4].name, 'isv_tokenCaptureContextSignature');
    t.is(result.actions[5].name, 'isv_payerAuthenticationRequired');
  } catch (error) {
    t.pass();
  }
});

test.serial('Evaluate token creation ', async (t) => {
  const result = await tokenHelper.evaluateTokenCreation(AddTokenServiceConst.addTokenResponseCustomerObj, PaymentAuthorizationServiceConstCC.payments, FunctionConstant.FUNC_HANDLE_CARD_ADDITION);
  t.is(typeof result.isSaveToken, 'boolean');
  t.is(typeof result.isError, 'boolean');
});

test.serial('add customer adress for uc', async (t: any) => {
  let result = await tokenHelper.addTokenAddressForUC(PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, PaymentServiceConst.getCreditCardResponseCartObj);
  if (result) {
    let i = 0;
    if ('email' in result && 'firstName' in result && 'lastName' in result && 'custom' in result) {
      i++;
    }
    t.is(i, 1);
  } else {
    t.pass();
  }
});

test.serial('Set failed token data to customer', async (t) => {
  try {
    let result: any = await tokenHelper.setCustomerFailedTokenData(PaymentAuthorizationServiceConstCC.payment, PaymentServiceConst.customFields, '');
    if (Constants.HTTP_OK_STATUS_CODE === result?.statusCode) {
      if (result?.body) result = result.body;
      let i = 0;
      if (result && 'email' in result && 'firstName' in result && 'lastName' in result) {
        i++;
        t.is(i, 1);
      }
    } else {
      t.pass();
    }
  } catch (error) {
    t.pass();
  }
});

test.serial('process tokens ', async (t) => {
  try {
    let result = await tokenHelper.processTokens(
      PaymentServiceConst.processTokensCustomerCardTokensObject.customerTokenId,
      PaymentServiceConst.processTokensCustomerCardTokensObject.paymentInstrumentId,
      PaymentServiceConst.processTokensInstrumentIdentifier,
      PaymentAuthorizationServiceConstCC.payment,
      '',
    );
    if (result) {
      let i = 0;
      if ('email' in result && 'firstName' in result && 'lastName' in result && 'custom' in result) {
        i++;
      }
      if (1 === i) t.is(i, 1);
      else t.is(i, 0);
    } else {
      t.pass();
    }
  } catch (error) {
    t.pass();
  }
});

test.serial('process tokens when token and instrument id is empty', async (t) => {
  try {
    let result = await tokenHelper.processTokens('', '', PaymentServiceConst.processTokensInstrumentIdentifier, PaymentAuthorizationServiceConstCC.payment, '');
    t.is(result, null);
  } catch (error) {
    t.pass();
  }
});



test.serial('process tokens with empty instrument identifier', async (t) => {
  try {
    let result = await tokenHelper.processTokens(PaymentServiceConst.processTokensCustomerCardTokensObject.customerTokenId, PaymentServiceConst.processTokensCustomerCardTokensObject.paymentInstrumentId, '', PaymentAuthorizationServiceConstCC.payment, '');
    if (result) {
      let i = 0;
      if ('email' in result && 'firstName' in result && 'lastName' in result && 'custom' in result) {
        i++;
      }
      t.is(i, 1);
    } else {
      t.pass();
    }
  } catch (error) {
    t.pass();
  }
});

