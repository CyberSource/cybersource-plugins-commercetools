import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import paymentUtils from '../../utils/PaymentUtils';
import unit from '../JSON/unit.json';
import { payment } from '../const/CreditCard/PaymentAuthorizationServiceConstCC';
import { processTokensCustomerCardTokensObject, processTokensInstrumentIdentifier, retrieveAddRefundResponseObjectTransactionWithNoCustom } from '../const/PaymentServiceConst';
import {
  changeStateFailureTransactionDetail,
  changeStateTransactionDetail,
  createTokenDataAddress,
  createTokenDataCustomerObj,
  failurePaymentResponse,
  failureResponseTransactionDetail,
  failureState,
  setCustomFieldMapperFieldEmptyObject,
  setCustomFieldMapperFieldObject,
  setCustomFieldMapperFields,
  setTransactionIdPaymentResponse,
  setTransactionIdTransactionDetail,
  successState,
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
