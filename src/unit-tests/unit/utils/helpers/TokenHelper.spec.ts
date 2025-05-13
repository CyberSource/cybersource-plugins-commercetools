import test from 'ava';
import dotenv from 'dotenv';

import { FunctionConstant } from '../../../../constants/functionConstant';
import { Constants } from '../../../../constants/paymentConstants';
import tokenHelper from '../../../../utils/helpers/TokenHelper';
import unit from '../../../JSON/unit.json'
import AddTokenServiceConst from '../../../const/AddTokenServiceConst';
import PaymentAuthorizationServiceConstCC from '../../../const/CreditCard/PaymentAuthorizationServiceConstCC';
import PaymentCaptureServiceConstCC from '../../../const/CreditCard/PaymentCaptureServiceConstCC';
import PaymentServiceConst from '../../../const/HelpersConst';
import PaymentHandlerConst from '../../../const/PaymentHandlerConst';
import PaymentUtilsConst from '../../../const/PaymentUtilsConst';

dotenv.config();

test.serial('Get bill to fields', async (t: any) => {
  const result = await tokenHelper.getBillToFields(AddTokenServiceConst.addTokenResponseCustomerObj.custom.fields, AddTokenServiceConst.addTokenResponseAddress, AddTokenServiceConst.addTokenResponseCustomerObj);
  try {
    if (result) {
      let i = 0;
      if ('id' in result && 'firstName' in result && 'lastName' in result && 'streetName' in result) {
        i++;
      }
      t.is(i, 1);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Get bill to fields when custom fields are empty', async (t: any) => {
  let customFields: any = null;
  try {
    const result = await tokenHelper.getBillToFields(customFields, AddTokenServiceConst.addTokenResponseAddress, AddTokenServiceConst.addTokenResponseCustomerObj);
    if (null === result) {
      t.is(result, null);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Get bill to fields when custom fields has string value', async (t: any) => {
  let customFields: any = '12345';
  try {
    const result = await tokenHelper.getBillToFields(customFields, AddTokenServiceConst.addTokenResponseAddress, AddTokenServiceConst.addTokenResponseCustomerObj);
    if (null === result) {
      t.is(result, null);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Get bill to fields when custom fields has boolean value', async (t: any) => {
  let customFields: any = true;
  try {
    const result = await tokenHelper.getBillToFields(customFields, AddTokenServiceConst.addTokenResponseAddress, AddTokenServiceConst.addTokenResponseCustomerObj);
    if (null === result) {
      t.is(result, null);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Get bill to fields for unified checkout', async (t: any) => {
  try {
    AddTokenServiceConst.addTokenResponseCustomerObj.custom.fields.isv_addressId = 'UCAddress';
    const result = await tokenHelper.getBillToFields(AddTokenServiceConst.addTokenResponseCustomerObj.custom.fields, AddTokenServiceConst.addTokenResponseAddress, AddTokenServiceConst.addTokenResponseCustomerObj);
    if (result) {
      let i = 0;
      if ('id' in result && 'firstName' in result && 'lastName' in result && 'streetName' in result) {
        i++;
      }
      t.is(i, 1);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('get saved card count for rate limiter', async (t: any) => {
  try {
    let startTime = new Date();
    startTime.setHours(startTime.getHours() - Number(process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME));
    let result = await tokenHelper.getRateLimiterTokenCount(PaymentHandlerConst.updateCardHandlerCustomerObj, new Date(startTime).toISOString(), new Date(Date.now()).toISOString());
    let i = 0;
    if ('number' == typeof result) {
      i++;
    }
    if (1 === i) {
      t.is(i, 1);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('get saved card count for rate limiter with empty start time', async (t: any) => {
  try {
    let result = await tokenHelper.getRateLimiterTokenCount(PaymentHandlerConst.updateCardHandlerCustomerObj, '', new Date(Date.now()).toISOString());
    if (0 === result) {
      t.is(result, 0);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('get saved card count for rate limiter with invalid start time', async (t: any) => {
  try {
    let result = await tokenHelper.getRateLimiterTokenCount(PaymentHandlerConst.updateCardHandlerCustomerObj, '$^&**^%', new Date(Date.now()).toISOString());
    if (0 === result) {
      t.is(result, 0);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('get saved card count for rate limiter when end time is empty', async (t: any) => {
  try {
    let startTime = new Date();
    startTime.setHours(startTime.getHours() - Number(process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME));
    let result = await tokenHelper.getRateLimiterTokenCount(PaymentHandlerConst.updateCardHandlerCustomerObj, new Date(startTime).toISOString(), '');
    if (0 === result) {
      t.is(result, 0);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('get saved card count for rate limiter when end time is invalid', async (t: any) => {
  try {
    let startTime = new Date();
    startTime.setHours(startTime.getHours() - Number(process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME));
    let result = await tokenHelper.getRateLimiterTokenCount(PaymentHandlerConst.updateCardHandlerCustomerObj, new Date(startTime).toISOString(), '#&W^%');
    if (0 === result) {
      t.is(result, 0);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('get saved card count for rate limiter when start time and end time are invalid', async (t: any) => {
  try {
    let result = await tokenHelper.getRateLimiterTokenCount(PaymentHandlerConst.updateCardHandlerCustomerObj, '#$%%^&*', '#&W^%');
    if (0 === result) {
      t.is(result, 0);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Processing response for invalid card ', async (t) => {
  try {
    const result = await tokenHelper.processInvalidCardResponse(AddTokenServiceConst.addTokenResponseCustomerObj.custom.fields, AddTokenServiceConst.addTokenResponseCustomerObj, unit.customerId);
    if ('isv_tokens' === result.actions[0].name) {
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
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Processing response for invalid card when custom field is not present', async (t) => {
  let customFields: any = '';
  try {
    const response = await tokenHelper.processInvalidCardResponse(customFields, AddTokenServiceConst.addTokenResponseCustomerObj, unit.customerId);
    if (response?.errors) {
      t.pass();
    } else {
      t.fail(`Unexpected Result:${response}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Processing response for invalid card when custom field is a string', async (t) => {
  let customFields: any = '^&*I(*';
  try {
    const response = await tokenHelper.processInvalidCardResponse(customFields, AddTokenServiceConst.addTokenResponseCustomerObj, unit.customerId);
    if (response?.errors) {
      t.pass();
    } else {
      t.fail(`Unexpected Result:${response}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Processing response for invalid card when customer id is empty', async (t) => {
  try {
    const result = await tokenHelper.processInvalidCardResponse(AddTokenServiceConst.addTokenResponseCustomerObj.custom.fields, AddTokenServiceConst.addTokenResponseCustomerObj, '');
    if ('isv_tokens' === result.actions[0].name) {
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
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Processing valid card response ', async (t) => {
  try {
    const result = await tokenHelper.processValidCardResponse(AddTokenServiceConst.addTokenResponseCustomerObj.custom.fields, PaymentServiceConst.processTokensCustomerCardTokensObject, PaymentUtilsConst.validAddTokenResponse, AddTokenServiceConst.addTokenResponseCustomerObj, PaymentUtilsConst.createTokenDataAddress);
    if ('isv_tokens' === result.actions[0].name) {
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
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Processing valid card response when custom field is not present', async (t) => {
  const customFields: any = null;
  try {
    const result = await tokenHelper.processValidCardResponse(customFields, PaymentServiceConst.processTokensCustomerCardTokensObject, PaymentUtilsConst.validAddTokenResponse, AddTokenServiceConst.addTokenResponseCustomerObj, PaymentUtilsConst.createTokenDataAddress);
    if ('isv_tokens' === result.actions[0].name) {
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
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Processing valid card response when custom field is a string', async (t) => {
  const customFields: any = '784^&*';
  try {
    const result = await tokenHelper.processValidCardResponse(customFields, PaymentServiceConst.processTokensCustomerCardTokensObject, PaymentUtilsConst.validAddTokenResponse, AddTokenServiceConst.addTokenResponseCustomerObj, PaymentUtilsConst.createTokenDataAddress);
    if ('isv_tokens' === result.actions[0].name) {
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
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('get card tokens', async (t: any) => {
  try {
    let result = await tokenHelper.getCardTokens(PaymentHandlerConst.updateCardHandlerCustomerObj, 'abc');
    let i = 0;
    if ('customerTokenId' in result && 'paymentInstrumentId' in result) {
      i++;
    }
    if (1 === i) {
      t.is(i, 1);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('get card tokens when saved token is empty', async (t: any) => {
  try {
    let result = await tokenHelper.getCardTokens(PaymentHandlerConst.updateCardHandlerCustomerObj, '');
    let i = 0;
    if ('customerTokenId' in result && 'paymentInstrumentId' in result) {
      i++;
    }
    if (1 === i) {
      t.is(i, 1);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('set Customer Token Data', async (t) => {
  try {
    let result = await tokenHelper.setCustomerTokenData(
      PaymentServiceConst.customerCardTokens,
      PaymentServiceConst.getAuthResponsePaymentResponse,
      PaymentServiceConst.authResponse,
      false,
      PaymentHandlerConst.authorizationHandler3DSUpdatePaymentObject as any,
      PaymentCaptureServiceConstCC.cart as any
    );
    if ('setCustomField' === result.actions[0].action) {
      t.is(result.actions[0].action, 'setCustomField');
      t.is(result.actions[0].name, 'isv_payerEnrollTransactionId');
      t.is(result.actions[1].name, 'isv_payerEnrollHttpCode');
      t.is(result.actions[2].name, 'isv_payerEnrollStatus');
      t.is(result.actions[3].name, 'isv_payerAuthenticationTransactionId');
      t.is(result.actions[4].name, 'isv_tokenCaptureContextSignature');
      t.is(result.actions[5].name, 'isv_payerAuthenticationRequired');
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Evaluate token creation', async (t) => {
  try {
    const result = await tokenHelper.evaluateTokenCreation(AddTokenServiceConst.addTokenResponseCustomerObj, PaymentAuthorizationServiceConstCC.payments as any, FunctionConstant.FUNC_HANDLE_CARD_ADDITION);
    if ('boolean' === typeof result.isSaveToken && 'boolean' === typeof result.isError) {
      t.is(typeof result.isSaveToken, 'boolean');
      t.is(typeof result.isError, 'boolean');
    } else {
      t.fail(`Unexpected Result :${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('add customer address for uc', async (t: any) => {
  try {
    let result = await tokenHelper.addTokenAddressForUC(PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, PaymentServiceConst.getCreditCardResponseCartObj as any);
    if (result) {
      let i = 0;
      if ('email' in result && 'firstName' in result && 'lastName' in result && 'custom' in result) {
        i++;
      }
      if (1 === i) {
        t.is(i, 1);
      }
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Set failed token data to customer', async (t) => {
  try {
    let result: any = await tokenHelper.setCustomerFailedTokenData(PaymentAuthorizationServiceConstCC.payment as any, PaymentServiceConst.customFields, '');
    if (Constants.HTTP_OK_STATUS_CODE === result?.statusCode) {
      if (result?.body) result = result.body;
      let i = 0;
      if (result && 'email' in result && 'firstName' in result && 'lastName' in result) {
        i++;
        t.is(i, 1);
      }
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('process tokens', async (t) => {
  try {
    let result = await tokenHelper.processTokens(
      PaymentServiceConst.processTokensCustomerCardTokensObject.customerTokenId,
      PaymentServiceConst.processTokensCustomerCardTokensObject.paymentInstrumentId,
      PaymentServiceConst.processTokensInstrumentIdentifier,
      PaymentAuthorizationServiceConstCC.payment as any,
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
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('process tokens when token and instrument id is empty', async (t) => {
  try {
    let result = await tokenHelper.processTokens('', '', PaymentServiceConst.processTokensInstrumentIdentifier, PaymentAuthorizationServiceConstCC.payment as any, '');
    if (null === result) {
      t.is(result, null);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('process tokens with empty instrument identifier', async (t) => {
  try {
    let result = await tokenHelper.processTokens(PaymentServiceConst.processTokensCustomerCardTokensObject.customerTokenId, PaymentServiceConst.processTokensCustomerCardTokensObject.paymentInstrumentId, '', PaymentAuthorizationServiceConstCC.payment as any, '');
    if (result) {
      let i = 0;
      if ('email' in result && 'firstName' in result && 'lastName' in result && 'custom' in result) {
        i++;
      }
      t.is(i, 1);
    } else {
      t.fail(`Unexpected Result:${result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});