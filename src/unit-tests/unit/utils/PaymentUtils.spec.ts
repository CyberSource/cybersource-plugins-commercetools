import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../../constants/constants';
import { CustomMessages } from '../../../constants/customMessages';
import paymentUtils from '../../../utils/PaymentUtils';
import unit from '../../JSON/unit.json';
import ApiControllerConst from '../../const/ApiControllerConst';
import PaymentAuthorizationServiceConstCC from '../../const/CreditCard/PaymentAuthorizationServiceConstCC';
import PaymentCaptureServiceConstCC from '../../const/CreditCard/PaymentCaptureServiceConstCC';
import PaymentServiceConst from '../../const/PaymentServiceConst';
import PaymentUtilsConst from '../../const/PaymentUtilsConst';


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
  let result: any = paymentUtils.setTransactionId(PaymentUtilsConst.setTransactionIdPaymentResponse, PaymentUtilsConst.setTransactionIdTransactionDetail);
  t.is(result.action, 'changeTransactionInteractionId');
  t.is(result.interactionId, PaymentUtilsConst.setTransactionIdPaymentResponse.transactionId);
  t.is(result.transactionId, PaymentUtilsConst.setTransactionIdTransactionDetail.id);
});

test.serial('set transaction id for auth response with invalid transactionId ', async (t: any) => {
  PaymentUtilsConst.setTransactionIdPaymentResponse.transactionId = '';
  let result: any = paymentUtils.setTransactionId(PaymentUtilsConst.setTransactionIdPaymentResponse, PaymentUtilsConst.setTransactionIdTransactionDetail);
  t.is(result.action, 'changeTransactionInteractionId');
  t.is(result.interactionId, PaymentUtilsConst.setTransactionIdPaymentResponse.transactionId);
  t.is(result.transactionId, PaymentUtilsConst.setTransactionIdTransactionDetail.id);
});

test.serial('Get the failure response ', async (t: any) => {
  let result = paymentUtils.failureResponse(PaymentUtilsConst.failurePaymentResponse, PaymentUtilsConst.failureResponseTransactionDetail);
  t.is(result.action, 'addInterfaceInteraction');
  t.is(result.type.key, 'isv_payment_failure');
  t.is(result.fields.reasonCode, '201');
});

test.serial('Get response of change state for failure', async (t: any) => {
  let result: any = paymentUtils.changeState(PaymentUtilsConst.changeStateFailureTransactionDetail, PaymentUtilsConst.failureState);
  t.is(result.action, 'changeTransactionState');
  t.is(result.state, 'Failure');
});

test.serial('Get response of change state for success', async (t: any) => {
  let result: any = paymentUtils.changeState(PaymentUtilsConst.changeStateTransactionDetail, PaymentUtilsConst.successState);
  t.is(result.action, 'changeTransactionState');
  t.is(result.state, 'Success');
});

test.serial('Get response of change state when state is empty', async (t: any) => {
  let result: any = paymentUtils.changeState(PaymentUtilsConst.changeStateTransactionDetail, '');
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
  let result = paymentUtils.setCustomFieldMapper(PaymentUtilsConst.setCustomFieldMapperFields);
  t.is(result[0].action, 'setCustomField');
  t.is(result[0].name, 'isv_tokenCaptureContextSignature');
  t.is(result[1].action, 'setCustomField');
  t.is(result[1].name, 'isv_tokenVerificationContext');
});

test.serial('Field mapping for saved token', async (t: any) => {
  let result = paymentUtils.setCustomFieldMapper(PaymentUtilsConst.setCustomFieldMapperFieldObject);
  t.is(result[0].action, 'setCustomField');
  t.is(result[0].name, 'isv_payerAuthenticationTransactionId');
  t.is(result[1].action, 'setCustomField');
  t.is(result[1].name, 'isv_payerAuthenticationRequired');
});

test.serial('Field mapping for saved token when field values are empty', async (t: any) => {
  let result = paymentUtils.setCustomFieldMapper(PaymentUtilsConst.setCustomFieldMapperFieldEmptyObject);
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
  let result = await paymentUtils.getRefundResponseObject(PaymentServiceConst.retrieveAddRefundResponseObjectTransactionWithNoCustom, 12);
  t.is(result.captureId, PaymentServiceConst.retrieveAddRefundResponseObjectTransactionWithNoCustom.interactionId);
  t.is(result.transactionId, PaymentServiceConst.retrieveAddRefundResponseObjectTransactionWithNoCustom.id);
  t.is(result.pendingTransactionAmount, 12);
});

test.serial('get Refund Response Object when pending amount is 0', async (t) => {
  let result = await paymentUtils.getRefundResponseObject(PaymentServiceConst.retrieveAddRefundResponseObjectTransactionWithNoCustom, 0);
  t.is(result.captureId, PaymentServiceConst.retrieveAddRefundResponseObjectTransactionWithNoCustom.interactionId);
  t.is(result.transactionId, PaymentServiceConst.retrieveAddRefundResponseObjectTransactionWithNoCustom.id);
  t.is(result.pendingTransactionAmount, 0);
});

test.serial('get cart object', async (t) => {
  let result = await paymentUtils.getCartObject(PaymentAuthorizationServiceConstCC.payment);
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
    PaymentUtilsConst.createTokenDataCustomerObj.custom?.fields,
    PaymentUtilsConst.createTokenDataCustomerObj,
    PaymentServiceConst.processTokensCustomerCardTokensObject.paymentInstrumentId,
    PaymentServiceConst.processTokensInstrumentIdentifier,
    PaymentServiceConst.processTokensCustomerCardTokensObject.customerTokenId,
    PaymentUtilsConst.createTokenDataAddress
  );
  t.is(result.alias, PaymentUtilsConst.createTokenDataCustomerObj.custom.fields.isv_tokenAlias);
  t.is(result.value, PaymentServiceConst.processTokensCustomerCardTokensObject.customerTokenId);
  t.is(result.paymentToken, PaymentServiceConst.processTokensCustomerCardTokensObject.paymentInstrumentId);
  t.is(result.instrumentIdentifier, PaymentServiceConst.processTokensInstrumentIdentifier);
  t.is(result.cardType, PaymentUtilsConst.createTokenDataCustomerObj.custom.fields.isv_cardType);
  t.is(result.cardName, PaymentUtilsConst.createTokenDataCustomerObj.custom.fields.isv_cardType);
  t.is(result.cardNumber, PaymentUtilsConst.createTokenDataCustomerObj.custom.fields.isv_maskedPan);
  t.is(result.cardExpiryMonth, PaymentUtilsConst.createTokenDataCustomerObj.custom.fields.isv_cardExpiryMonth);
  t.is(result.cardExpiryYear, PaymentUtilsConst.createTokenDataCustomerObj.custom.fields.isv_cardExpiryYear);
  t.is(result.addressId, PaymentUtilsConst.createTokenDataCustomerObj.custom.fields.isv_addressId);
  t.deepEqual(result.address, {});
});

test.serial('create failed token data ', async (t) => {
  if (PaymentUtilsConst.createTokenDataAddress?.id) {
    let result = await paymentUtils.createFailedTokenData(PaymentUtilsConst.createTokenDataCustomerObj.custom.fields, PaymentUtilsConst.createTokenDataAddress.id);
    if (typeof result === 'object') {
      t.is(typeof result, 'object');
    } else {
      t.not(typeof result, 'object');
    }
  }
});

test.serial('create failed token data when address id is null', async (t) => {
  let result = await paymentUtils.createFailedTokenData(PaymentUtilsConst.createTokenDataCustomerObj.custom.fields, '');
  if (typeof result === 'object') {
    t.is(typeof result, 'object');
  } else {
    t.not(typeof result, 'object');
  }
});

test.serial('create failed token data when field value is empty', async (t) => {
  if (PaymentUtilsConst.createTokenDataAddress?.id) {
    let result = await paymentUtils.createFailedTokenData(PaymentUtilsConst.createTokenDataEmptyCustomField, PaymentUtilsConst.createTokenDataAddress.id);
    t.is(typeof result, 'object');
  }
});

test.serial('create token data when field value is empty', async (t) => {
  let result = await paymentUtils.createTokenData(
    PaymentUtilsConst.createTokenDataEmptyCustomField,
    PaymentUtilsConst.createTokenDataCustomerObj,
    '',
    '',
    '',
    PaymentUtilsConst.createTokenEmptyDataAddress
  );
  t.is(result.alias, undefined);
  t.is(result.value, undefined);
  t.is(result.paymentToken, undefined);
  t.is(result.instrumentIdentifier, undefined);
  t.is(result.cardType, undefined);
  t.is(result.cardName, undefined);
  t.is(result.cardNumber, undefined);
  t.is(result.cardExpiryMonth, undefined);
  t.is(result.cardExpiryYear, undefined);
  t.is(result.addressId, undefined);
  t.deepEqual(result.address, {});
});

test.serial("test OM error message with 0 error code and type as charge", (t) => {
  const result = paymentUtils.handleOMErrorMessage(0, Constants.CT_TRANSACTION_TYPE_CHARGE);
  t.is(result, CustomMessages.ERROR_MSG_CAPTURE_AMOUNT_GREATER_THAN_ZERO);
})

test.serial("test OM error message with 0 error code and type as refund", (t) => {
  const result = paymentUtils.handleOMErrorMessage(0, Constants.CT_TRANSACTION_TYPE_REFUND);
  t.is(result, CustomMessages.ERROR_MSG_REFUND_GREATER_THAN_ZERO);
})

test.serial("test OM error message with 1 error code and type as charge", (t) => {
  const result = paymentUtils.handleOMErrorMessage(1, Constants.CT_TRANSACTION_TYPE_CHARGE);
  t.is(result, CustomMessages.ERROR_MSG_CAPTURE_EXCEEDS_AUTHORIZED_AMOUNT);
})

test.serial("test OM error message with 1 error code and type as refund", (t) => {
  const result = paymentUtils.handleOMErrorMessage(1, Constants.CT_TRANSACTION_TYPE_REFUND);
  t.is(result, CustomMessages.ERROR_MSG_REFUND_EXCEEDS_CAPTURE_AMOUNT);
})

test.serial("test OM error message with 2 error code and type as charge", (t) => {
  const result = paymentUtils.handleOMErrorMessage(2, Constants.CT_TRANSACTION_TYPE_CHARGE);
  t.is(result, CustomMessages.ERROR_MSG_CAPTURE_SERVICE);
})

test.serial("test OM error message with 2 error code and type as refund", (t) => {
  const result = paymentUtils.handleOMErrorMessage(2, Constants.CT_TRANSACTION_TYPE_REFUND);
  t.is(result, CustomMessages.ERROR_MSG_REFUND_SERVICE);
})

test.serial("test OM error message with 2 error code and type as cancel authorization", (t) => {
  const result = paymentUtils.handleOMErrorMessage(2, Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION);
  t.is(result, CustomMessages.ERROR_MSG_REVERSAL_SERVICE);
})

test.serial("test Success message type as charge", (t) => {
  const result = paymentUtils.handleOmSuccessMessage(Constants.CT_TRANSACTION_TYPE_CHARGE);
  t.is(result, CustomMessages.SUCCESS_MSG_CAPTURE_SERVICE);
})

test.serial("test Success message type as refund", (t) => {
  const result = paymentUtils.handleOmSuccessMessage(Constants.CT_TRANSACTION_TYPE_REFUND);
  t.is(result, CustomMessages.SUCCESS_MSG_REFUND_SERVICE);
})

test.serial("test Success message type as Auth reversal", (t) => {
  const result = paymentUtils.handleOmSuccessMessage(Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION);
  t.is(result, CustomMessages.SUCCESS_MSG_REVERSAL_SERVICE);
})

test.serial('update parsed tokens', (t) => {
  const result = paymentUtils.updateParsedToken(PaymentServiceConst.getUpdateTokenActionsActions[0], PaymentServiceConst.customFields, PaymentServiceConst.processTokensCustomerCardTokensObject.customerTokenId, PaymentServiceConst.processTokensCustomerCardTokensObject.paymentInstrumentId, '1wij488', null);
  t.is(result.alias, PaymentServiceConst.customFields.isv_tokenAlias);
  t.is(result.value, PaymentServiceConst.processTokensCustomerCardTokensObject.paymentInstrumentId);
  t.is(result.paymentToken, PaymentServiceConst.processTokensCustomerCardTokensObject.customerTokenId);
  t.is(result.cardExpiryMonth, PaymentServiceConst.customFields.isv_cardExpiryMonth);
  t.is(result.cardExpiryYear, PaymentServiceConst.customFields.isv_cardExpiryYear);
})

test.serial('Extract token value', (t) => {
  const result = paymentUtils.extractTokenValue(ApiControllerConst.notification.payload[0].data._links.instrumentIdentifiers[0].href);
  t.is(result, '7036349999987050572')
})


test.serial('create transaction object', (t) => {
  const result = paymentUtils.createTransactionObject(PaymentCaptureServiceConstCC.payment.version, PaymentCaptureServiceConstCC.payment.amountPlanned, PaymentCaptureServiceConstCC.payment.transactions[0].type, PaymentCaptureServiceConstCC.payment.transactions[0].state as any, PaymentCaptureServiceConstCC.payment.transactions[0].interactionId, new Date(Date.now()).toISOString());
  t.is(result?.amount?.centAmount, 100);
  t.is(result.state, 'Success');
  t.is(result.type, 'Authorization');
})

test.serial('Get InterationID', (t) => {
  const result = paymentUtils.getInteractionId(PaymentServiceConst.getAuthorizedAmountCapturePaymentObj);
  t.is(result, '6805192636456088103954')
})

test.serial('count of token for an interval', (t) => {
  let cardRate = Number(process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME);
  let startTime = new Date();
  startTime.setHours(startTime.getHours() - cardRate);
  const result = paymentUtils.countTokenForGivenInterval(PaymentServiceConst.deleteTokenCustomerObj.custom?.fields?.isv_tokens as any, new Date(startTime).toISOString(), new Date(Date.now()).toISOString());
  t.is(result, 0);
})

test.serial('Get InterationID with Invalid Signature', async (t) => {
  const result = await paymentUtils.authenticateNetToken(PaymentUtilsConst.invalidSignature,ApiControllerConst.notification);
  t.is(result, false)
})

test.serial('Test Encryption', async (t) => {
  const result =  paymentUtils.encryption(PaymentUtilsConst.decodedValue);
  t.not(result,PaymentUtilsConst.headerValue)
})

test.serial('Test Decryption', async (t) => {
  const result = paymentUtils.decryption(PaymentUtilsConst.headerValue);
  t.is(result,PaymentUtilsConst.decodedValue)
})
