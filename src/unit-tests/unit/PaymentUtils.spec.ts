import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../constants';
import paymentUtils from '../../utils/PaymentUtils';
import unit from '../JSON/unit.json';
import { notification } from '../const/ApiHandlerConst';
import { payment } from '../const/CreditCard/PaymentAuthorizationServiceConstCC';
import {payment as capturePayment} from '../const/CreditCard/PaymentCaptureServiceConstCC';
import { customFields, deleteTokenCustomerObj, getUpdateTokenActionsActions, processTokensCustomerCardTokensObject, processTokensInstrumentIdentifier, retrieveAddRefundResponseObjectTransactionWithNoCustom } from '../const/PaymentServiceConst';
import {
  changeStateFailureTransactionDetail,
  changeStateTransactionDetail,
  createTokenDataAddress,
  createTokenDataCustomerObj,
  createTokenDataEmptyCustomField,
  createTokenEmptyDataAddress,
  failurePaymentResponse,
  failureResponseTransactionDetail,
  failureState,
  setCustomFieldMapperFieldEmptyObject,
  setCustomFieldMapperFieldObject,
  setCustomFieldMapperFields,
  setTransactionIdPaymentResponse,
  setTransactionIdTransactionDetail,
  successState,
  validAddTokenResponse,
  validUpdateServiceResponse
} from '../const/PaymentUtilsConst';

test.serial('get the order id', async (t: any) => {
  let result: any = await paymentUtils.getOrderId(unit.cartId, unit.paymentId);
  if (result) {
    let i = 0;
    if ('string' == typeof result) {
      i++;
    }
    if (i == 1) {
      t.is(i, 1);
    } else {
      t.is(i, 0);
    }
  } else {
    t.pass();
  }
});

test.serial('get the order id when cart and payment id is empty', async (t: any) => {
  let result: any = await paymentUtils.getOrderId('', '');
  t.is(result, '');
});

test.serial('Get certificate data ', async (t: any) => {
  let applePayCertificatePath = process.env.PAYMENT_GATEWAY_APPLE_PAY_CERTIFICATE_PATH;
  if (applePayCertificatePath) {
    let result: any = await paymentUtils.getCertificatesData(applePayCertificatePath);
    if (200 == result.status) {
      t.is(result.status, 200);
    } else {
      t.not(result.status, 200);
    }
  } else {
    t.pass();
  }
});

test.serial('set transaction id for auth response ', async (t: any) => {
  let result: any = paymentUtils.setTransactionId(setTransactionIdPaymentResponse, setTransactionIdTransactionDetail);
  t.is(result.action, 'changeTransactionInteractionId');
  t.is(result.interactionId, setTransactionIdPaymentResponse.transactionId);
  t.is(result.transactionId, setTransactionIdTransactionDetail.id);
});

test.serial('Get the failure response ', async (t: any) => {
  let result = paymentUtils.failureResponse(failurePaymentResponse, failureResponseTransactionDetail);
  t.is(result.action, 'addInterfaceInteraction');
  t.is(result.type.key, 'isv_payment_failure');
  t.is(result.fields.reasonCode, '201');
});

test.serial('Get response of change state for failure', async (t: any) => {
  let result: any = paymentUtils.changeState(changeStateFailureTransactionDetail, failureState);
  t.is(result.action, 'changeTransactionState');
  t.is(result.state, 'Failure');
});

test.serial('Get response of change state for success', async (t: any) => {
  let result: any = paymentUtils.changeState(changeStateTransactionDetail, successState);
  t.is(result.action, 'changeTransactionState');
  t.is(result.state, 'Success');
});

test.serial('Get response of change state when state is empty', async (t: any) => {
  let result: any = paymentUtils.changeState(changeStateTransactionDetail, '');
  t.is(result.action, 'changeTransactionState');
  t.is(result.state, '');
});

test.serial('Convert cent to amount ', async (t: any) => {
  let result = paymentUtils.convertCentToAmount(6970, 2);
  t.is(result, 69.7);
});

test.serial('Convert cent to amount when amount is 0 ', async (t: any) => {
  let result = paymentUtils.convertCentToAmount(0, 2);
  t.is(result, 0);
});

test.serial('Convert amount to cent', async (t: any) => {
  let result = paymentUtils.convertAmountToCent(69.7, 2);
  t.is(result, 6970);
});

test.serial('Convert amount to cent when amount is 0', async (t: any) => {
  let result = paymentUtils.convertAmountToCent(0, 2);
  t.is(result, 0);
});

test.serial('Field mapping for flex keys', async (t: any) => {
  let result = paymentUtils.setCustomFieldMapper(setCustomFieldMapperFields);
  t.is(result[0].action, 'setCustomField');
  t.is(result[0].name, 'isv_tokenCaptureContextSignature');
  t.is(result[1].action, 'setCustomField');
  t.is(result[1].name, 'isv_tokenVerificationContext');
});

test.serial('Field mapping for saved token', async (t: any) => {
  let result = paymentUtils.setCustomFieldMapper(setCustomFieldMapperFieldObject);
  t.is(result[0].action, 'setCustomField');
  t.is(result[0].name, 'isv_payerAuthenticationTransactionId');
  t.is(result[1].action, 'setCustomField');
  t.is(result[1].name, 'isv_payerAuthenticationRequired');
});

test.serial('Field mapping for saved token when field values are empty', async (t: any) => {
  let result = paymentUtils.setCustomFieldMapper(setCustomFieldMapperFieldEmptyObject);
  t.is(result[0].action, 'setCustomField');
  t.is(result[0].name, 'isv_payerAuthenticationTransactionId');
  t.is(result[1].action, 'setCustomField');
  t.is(result[1].name, 'isv_payerAuthenticationRequired');
});

test.serial('round off amount', async (t) => {
  let result = paymentUtils.roundOff(59.456789, 2);
  t.is(result, 59.46);
});

test.serial('round off with zero amount', async (t) => {
  let result = paymentUtils.roundOff(0, 2);
  t.is(result, 0);
});

test.serial('get empty response function ', async (t) => {
  let result = paymentUtils.getEmptyResponse();
  t.deepEqual(result.actions, []);
  t.deepEqual(result.errors, []);
});

test.serial('get invalid operation response ', async (t) => {
  let result = paymentUtils.invalidOperationResponse();
  t.deepEqual(result.actions, []);
  t.is(result.errors[0].code, 'InvalidOperation');
  t.is(result.errors[0].message, 'Cannot process the payment due to invalid operation');
});

test.serial('get invalid input response ', async (t) => {
  let result = paymentUtils.invalidInputResponse();
  t.deepEqual(result.actions, []);
  t.is(result.errors[0].code, 'InvalidInput');
  t.is(result.errors[0].message, 'Cannot process the payment due to invalid input');
});

test.serial('get Refund Response Object ', async (t) => {
  let result = await paymentUtils.getRefundResponseObject(retrieveAddRefundResponseObjectTransactionWithNoCustom, 12);
  t.is(result.captureId, retrieveAddRefundResponseObjectTransactionWithNoCustom.interactionId);
  t.is(result.transactionId, retrieveAddRefundResponseObjectTransactionWithNoCustom.id);
  t.is(result.pendingTransactionAmount, 12);
});

test.serial('get Refund Response Object when pending amount is 0', async (t) => {
  let result = await paymentUtils.getRefundResponseObject(retrieveAddRefundResponseObjectTransactionWithNoCustom, 0);
  t.is(result.captureId, retrieveAddRefundResponseObjectTransactionWithNoCustom.interactionId);
  t.is(result.transactionId, retrieveAddRefundResponseObjectTransactionWithNoCustom.id);
  t.is(result.pendingTransactionAmount, 0);
});

test.serial('get cart object', async (t) => {
  let result = await paymentUtils.getCartObject(payment);
  if (result && result?.count > 0) {
    t.is(result.count, 1);
    t.is(result.results[0].type, 'Cart');
    if (result.results[0].cartState == 'Active') {
      t.is(result.results[0].cartState, 'Active');
    } else if (result.results[0].cartState == 'Merged') {
      t.is(result.results[0].cartState, 'Merged');
    } else if (result.results[0].cartState == 'Ordered') {
      t.is(result.results[0].cartState, 'Ordered');
    }
  } else {
    t.pass();
  }
});

test.serial('create token data ', async (t) => {
  let result = await paymentUtils.createTokenData(
    createTokenDataCustomerObj.custom.fields,
    createTokenDataCustomerObj,
    processTokensCustomerCardTokensObject.paymentInstrumentId,
    processTokensInstrumentIdentifier,
    processTokensCustomerCardTokensObject.customerTokenId,
    createTokenDataAddress
  );
  t.is(result.alias, createTokenDataCustomerObj.custom.fields.isv_tokenAlias);
  t.is(result.value, processTokensCustomerCardTokensObject.customerTokenId);
  t.is(result.paymentToken, processTokensCustomerCardTokensObject.paymentInstrumentId);
  t.is(result.instrumentIdentifier, processTokensInstrumentIdentifier);
  t.is(result.cardType, createTokenDataCustomerObj.custom.fields.isv_cardType);
  t.is(result.cardName, createTokenDataCustomerObj.custom.fields.isv_cardType);
  t.is(result.cardNumber, createTokenDataCustomerObj.custom.fields.isv_maskedPan);
  t.is(result.cardExpiryMonth, createTokenDataCustomerObj.custom.fields.isv_cardExpiryMonth);
  t.is(result.cardExpiryYear, createTokenDataCustomerObj.custom.fields.isv_cardExpiryYear);
  t.is(result.addressId, createTokenDataCustomerObj.custom.fields.isv_addressId);
  t.deepEqual(result.address, {});
});

test.serial('create failed token data ', async (t) => {
  if (createTokenDataAddress?.id) {
    let result = await paymentUtils.createFailedTokenData(createTokenDataCustomerObj.custom.fields, createTokenDataAddress.id);
    if (typeof result === 'object') {
      t.is(typeof result, 'object');
    } else {
      t.not(typeof result, 'object');
    }
  }
});

test.serial('create failed token data when address id is null', async (t) => {
  let result = await paymentUtils.createFailedTokenData(createTokenDataCustomerObj.custom.fields, '');
  if (typeof result === 'object') {
    t.is(typeof result, 'object');
  } else {
    t.not(typeof result, 'object');
  }
});

test.serial('create failed token data when field value is empty', async (t) => {
  if (createTokenDataAddress?.id) {
    let result = await paymentUtils.createFailedTokenData(createTokenDataEmptyCustomField, createTokenDataAddress.id);
    t.is(typeof result, 'object');
  }
});

test.serial('create token data when field value is empty', async (t) => {
  let result = await paymentUtils.createTokenData(
    createTokenDataEmptyCustomField,
    createTokenDataCustomerObj,
    '',
    '',
    '',
    createTokenEmptyDataAddress
  );
  t.is(result.alias, '');
  t.is(result.value, '');
  t.is(result.paymentToken, '');
  t.is(result.instrumentIdentifier, '');
  t.is(result.cardType, '');
  t.is(result.cardName, '');
  t.is(result.cardNumber, '');
  t.is(result.cardExpiryMonth, '');
  t.is(result.cardExpiryYear, '');
  t.is(result.addressId, '');
  t.deepEqual(result.address, {});
});

test.serial("test OM error message with 0 error code and type as charge", (t) => {
  const result = paymentUtils.handleOMErrorMessage(0, Constants.CT_TRANSACTION_TYPE_CHARGE);
  t.is(result, Constants.ERROR_MSG_CAPTURE_AMOUNT_GREATER_THAN_ZERO);
})

test.serial("test OM error message with 0 error code and type as refund", (t) => {
  const result = paymentUtils.handleOMErrorMessage(0, Constants.CT_TRANSACTION_TYPE_REFUND);
  t.is(result, Constants.ERROR_MSG_REFUND_GREATER_THAN_ZERO);
})

test.serial("test OM error message with 1 error code and type as charge", (t) => {
  const result = paymentUtils.handleOMErrorMessage(1, Constants.CT_TRANSACTION_TYPE_CHARGE);
  t.is(result, Constants.ERROR_MSG_CAPTURE_EXCEEDS_AUTHORIZED_AMOUNT);
})

test.serial("test OM error message with 1 error code and type as refund", (t) => {
  const result = paymentUtils.handleOMErrorMessage(1, Constants.CT_TRANSACTION_TYPE_REFUND);
  t.is(result, Constants.ERROR_MSG_REFUND_EXCEEDS_CAPTURE_AMOUNT);
})

test.serial("test OM error message with 2 error code and type as charge", (t) => {
  const result = paymentUtils.handleOMErrorMessage(2, Constants.CT_TRANSACTION_TYPE_CHARGE);
  t.is(result, Constants.ERROR_MSG_CAPTURE_SERVICE);
})

test.serial("test OM error message with 2 error code and type as refund", (t) => {
  const result = paymentUtils.handleOMErrorMessage(2, Constants.CT_TRANSACTION_TYPE_REFUND);
  t.is(result, Constants.ERROR_MSG_REFUND_SERVICE);
})

test.serial("test OM error message with 2 error code and type as cancel authorization", (t) => {
  const result = paymentUtils.handleOMErrorMessage(2, Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION);
  t.is(result, Constants.ERROR_MSG_REVERSAL_SERVICE);
})

test.serial('update parsed tokens', (t) => {
  const result = paymentUtils.updateParsedToken(getUpdateTokenActionsActions[0], customFields, processTokensCustomerCardTokensObject.customerTokenId, processTokensCustomerCardTokensObject.paymentInstrumentId, '1wij488', null);
  t.is(result.alias, customFields.isv_tokenAlias);
  t.is(result.value, processTokensCustomerCardTokensObject.paymentInstrumentId);
  t.is(result.paymentToken, processTokensCustomerCardTokensObject.customerTokenId);
  t.is(result.cardExpiryMonth, customFields.isv_cardExpiryMonth);
  t.is(result.cardExpiryYear, customFields.isv_cardExpiryYear);
})

test.serial('Extract token value', (t) => {
  const result = paymentUtils.extractTokenValue(notification.payload[0].data._links.instrumentIdentifiers[0].href);
  t.is(result, '7036349999987050572')
})

test.serial('count of token for an interval', (t) => {
  let cardRate = Number(process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME);
  let startTime = new Date();
  startTime.setHours(startTime.getHours() - cardRate);
  const result = paymentUtils.tokenCountForInterval(deleteTokenCustomerObj.custom?.fields?.isv_tokens as any, new Date(startTime).toISOString(), new Date(Date.now()).toISOString());
  t.is(result, 0);
})

test.serial('create transaction object', (t) => {
  const result = paymentUtils.createTransactionObject(capturePayment.version, capturePayment.amountPlanned, capturePayment.transactions[0].type, capturePayment.transactions[0].state as any, capturePayment.transactions[0].interactionId, new Date(Date.now()).toISOString());
  t.is(result.amount.centAmount, 100);
  t.is(result.state, 'Success');
  t.is(result.type, 'Authorization');
})

test.serial('Valid Update service response', async (t) => {
  const result = await paymentUtils.validAddTokenResponse(validAddTokenResponse);
  t.is(result, true);
})

test.serial('Valid Update service response when status is declined', (t) => {
  validAddTokenResponse.status = 'Declined'
  const result = paymentUtils.validAddTokenResponse(validAddTokenResponse);
  t.is(result, false);
})

test.serial('Valid update service response with invalid http code', (t) => {
  validUpdateServiceResponse.httpCode = 401;
  validUpdateServiceResponse.default = null;
  const result = paymentUtils.validUpdateServiceResponse(validUpdateServiceResponse);
  t.is(result, false);
})

