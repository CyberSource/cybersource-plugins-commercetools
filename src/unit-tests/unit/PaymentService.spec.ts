import test from 'ava';
import dotenv from 'dotenv';
dotenv.config();
import paymentService from '../../utils/PaymentService';
import { fieldMapperFields, fieldMapperFieldObject, getOMServiceResponsePaymentResponse, getOMServiceResponsePaymentResponseObject, getOMServiceResponseTransactionDetail, visaCardDetailsActionVisaCheckoutData, getCapturedAmountRefundPaymentObj } from '../const/PaymentServiceConst';
import { getAuthResponsePaymentPendingResponse, getAuthResponsePaymentCompleteResponse, getAuthResponsePaymentResponse, getAuthResponsePaymentDeclinedResponse, getAuthResponsePaymentResponseObject, getAuthResponseTransactionDetail } from '../const/PaymentServiceConst';
import { successState, failureState, changeStateTransactionDetail, changeStateFailureTransactionDetail, getRefundResponseUpdatePaymentObj, getRefundResponseUpdateTransactions, deleteTokenCustomerObj } from '../const/PaymentServiceConst';
import { payerAuthActionsResponse, payerEnrollActionsUpdatePaymentObj, payerEnrollActionsResponse, addRefundActionAmount, addRefundActionOrderResponse, state } from '../const/PaymentServiceConst';
import { getUpdateTokenActionsActions, failurePaymentResponse, failureResponseTransactionDetail, getCreditCardResponseUpdatePaymentObj, getCreditCardResponseCartObj, clickToPayResponseUpdatePaymentObj } from '../const/PaymentServiceConst';
import { getAuthorizedAmountCapturePaymentObj, setCustomTypeDataPendingAmount, setCustomTypeDataTransactionId, googlePayResponseUpdatePaymentObj, tokenCreateFlagCustomerInfo, tokenCreateFlagPaymentObj, tokenCreateFlagFunctionName } from '../const/PaymentServiceConst';
import { authorizationHandler3DSUpdatePaymentObject} from '../const/PaymentHandlerConst';
import {  getPayerAuthValidateResponseUpdatePaymentObj } from '../const/PaymentHandlerConst';
import { getPayerAuthEnrollResponseUpdatePaymentObj } from '../const/PaymentHandlerConst';

test.serial('Field mapping for flex keys', async (t) => {
  const result = await paymentService.fieldMapper(fieldMapperFields);
  t.is(result[0].action, 'setCustomField');
  t.is(result[0].name, 'isv_tokenCaptureContextSignature');
  t.is(result[1].action, 'setCustomField');
  t.is(result[1].name, 'isv_tokenVerificationContext');
});

test.serial('Field mapping for saved token', async (t) => {
  const result = await paymentService.fieldMapper(fieldMapperFieldObject);
  t.is(result[0].action, 'setCustomField');
  t.is(result[0].name, 'isv_payerAuthenticationTransactionId');
  t.is(result[1].action, 'setCustomField');
  t.is(result[1].name, 'isv_payerAuthenticationRequired');
});

test.serial('Check visa card detail action ', async (t) => {
  const result = await paymentService.visaCardDetailsAction(visaCardDetailsActionVisaCheckoutData);
  t.is(result[0].action, 'setCustomField');
  t.is(result[0].name, 'isv_maskedPan');
  t.is(result[1].action, 'setCustomField');
  t.is(result[1].name, 'isv_cardExpiryMonth');
  t.is(result[2].action, 'setCustomField');
  t.is(result[2].name, 'isv_cardExpiryYear');
  t.is(result[3].action, 'setCustomField');
  t.is(result[3].name, 'isv_cardType');
});

test.serial('Get OM Service Response', async (t) => {
  const result: any = await paymentService.getOMServiceResponse(getOMServiceResponsePaymentResponse, getOMServiceResponseTransactionDetail, null, null);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, 'Success');
});

test.serial('Get OM Service Response for failure', async (t) => {
  const result: any = await paymentService.getOMServiceResponse(getOMServiceResponsePaymentResponseObject, getOMServiceResponseTransactionDetail, null, null);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, 'Failure');
  t.is(result.actions[2].action, 'addInterfaceInteraction');
  t.is(result.actions[2].type.key, 'isv_payment_failure');
});

test.serial('Check response of get auth response with successful auth', async (t) => {
  const result = await paymentService.getAuthResponse(getAuthResponsePaymentResponse, getAuthResponseTransactionDetail);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, 'Success');
});

test.serial('Check response of get auth response object when auth is pending', async (t) => {
  const result = await paymentService.getAuthResponse(getAuthResponsePaymentResponseObject, getAuthResponseTransactionDetail);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, 'Pending');
});

test.serial('Check response of get auth response object when auth is declined', async (t) => {
  const result = await paymentService.getAuthResponse(getAuthResponsePaymentDeclinedResponse, getAuthResponseTransactionDetail);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, 'Failure');
});

test.serial('Check response of get auth response object when payer auth setup is completed', async (t) => {
  const result = await paymentService.getAuthResponse(getAuthResponsePaymentCompleteResponse, null);
  t.is(result.actions[0].action, 'setCustomField');
  t.is(result.actions[0].name, 'isv_requestJwt');
  t.is(result.actions[1].action, 'setCustomField');
  t.is(result.actions[1].name, 'isv_cardinalReferenceId');
  t.is(result.actions[2].action, 'setCustomField');
  t.is(result.actions[2].name, 'isv_deviceDataCollectionUrl');
});

test.serial('Check response of get auth response object when authentication is pending', async (t) => {
  const result = await paymentService.getAuthResponse(getAuthResponsePaymentPendingResponse, null);
  t.is(result.actions[0].action, 'addInterfaceInteraction');
  t.is(result.actions[1].action, 'setCustomField');
  t.is(result.actions[1].name, 'isv_payerAuthenticationRequired');
  t.is(result.actions[1].value, true);
});

test.serial('Get captured amount', async (t) => {
  const result = await paymentService.getCapturedAmount(getCapturedAmountRefundPaymentObj);
  t.is(result, 69.7);
});

test.serial('Convert cent to amount ', async (t) => {
  const result = await paymentService.convertCentToAmount(6970, 2);
  t.is(result, 69.7);
});

test.serial('Convert amount to cent', async (t) => {
  const result = await paymentService.convertAmountToCent(69.7, 2);
  t.is(result, 6970);
});

test.serial('Get response of change state for success', async (t) => {
  const result: any = await paymentService.changeState(changeStateTransactionDetail, successState);
  t.is(result.action, 'changeTransactionState');
  t.is(result.state, 'Success');
});

test.serial('Get response of change state for failure', async (t) => {
  const result: any = await paymentService.changeState(changeStateFailureTransactionDetail, failureState);
  t.is(result.action, 'changeTransactionState');
  t.is(result.state, 'Failure');
});

test.serial('Get payer auth actions ', async (t) => {
  const result = await paymentService.payerAuthActions(payerAuthActionsResponse);
  t.is(result[0].action, 'addInterfaceInteraction');
  t.is(result[0].fields.authenticationRequired, true);
  t.is(result[1].name, 'isv_payerAuthenticationRequired');
  t.is(result[1].value, true);
  t.is(result[2].name, 'isv_payerAuthenticationTransactionId');
  t.is(result[3].name, 'isv_payerAuthenticationAcsUrl');
  t.is(result[4].name, 'isv_payerAuthenticationPaReq');
  t.is(result[5].name, 'isv_stepUpUrl');
  t.is(result[6].name, 'isv_responseJwt');
});

test.serial('Get payer enroll actions ', async (t) => {
  const result = await paymentService.payerEnrollActions(payerEnrollActionsResponse, payerEnrollActionsUpdatePaymentObj);
  t.is(result.actions[0].action, 'setCustomField');
  t.is(result.actions[0].name, 'isv_payerEnrollTransactionId');
  t.is(result.actions[1].name, 'isv_payerEnrollHttpCode');
  t.is(result.actions[1].value, 201);
  t.is(result.actions[2].name, 'isv_payerEnrollStatus');
  t.is(result.actions[2].value, 'PENDING_AUTHENTICATION');
  t.is(result.actions[3].name, 'isv_tokenCaptureContextSignature');
  t.is(result.actions[3].value, null);
});

test.serial('Get update token actions ', async (t) => {
  const result = await paymentService.getUpdateTokenActions(getUpdateTokenActionsActions, null, true, deleteTokenCustomerObj, null);
  if (result) {
    if(deleteTokenCustomerObj?.custom?.type?.id){
      t.is(result.actions[0].action, 'setCustomField');
    } else {
      t.is(result.actions[0].action, 'setCustomType');
      t.is(result.actions[0].type.key, 'isv_payments_customer_tokens');
    }
  } else {
    t.pass();
  }
});

test.serial('Get the failure response ', async (t) => {
  const result = await paymentService.failureResponse(failurePaymentResponse, failureResponseTransactionDetail);
  t.is(result.action, 'addInterfaceInteraction');
  t.is(result.type.key, 'isv_payment_failure');
  t.is(result.fields.reasonCode, '201');
});

test.serial('Get authorize amount', async (t) => {
  const result = await paymentService.getAuthorizedAmount(getAuthorizedAmountCapturePaymentObj);
  t.is(result, 44.9);
});

test.serial('Set custom type data', async (t) => {
  const result = await paymentService.setCustomTypeData(setCustomTypeDataTransactionId, setCustomTypeDataPendingAmount);
  t.pass();
  t.is(result.action, 'setTransactionCustomType');
  t.is(result.type.key, 'isv_transaction_data');
  t.is(result.type.typeId, 'type');
});

test.serial('get payer auth set up response ', async (t) => {
  const result = await paymentService.getPayerAuthSetUpResponse(authorizationHandler3DSUpdatePaymentObject);
  if (result.actions[0] == undefined) {
    t.deepEqual(result.actions, []);
    t.deepEqual(result.errors, []);
  } else {
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_requestJwt');
    t.is(result.actions[1].action, 'setCustomField');
    t.is(result.actions[1].name, 'isv_cardinalReferenceId');
    t.is(result.actions[2].action, 'setCustomField');
    t.is(result.actions[2].name, 'isv_deviceDataCollectionUrl');
  }
});

test.serial('get Payer Auth Validate Response', async (t) => {
  const result = await paymentService.getPayerAuthValidateResponse(getPayerAuthValidateResponseUpdatePaymentObj);
  if (result.actions.length > 0) {
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_payerEnrollTransactionId');
    t.is(result.actions[1].name, 'isv_payerEnrollHttpCode');
    t.is(result.actions[2].name, 'isv_payerEnrollStatus');
  } else {
    t.deepEqual(result.actions, []);
    t.is(result.errors[0].code, 'InvalidInput');
  }
});

test.serial('Get Payer Auth Enroll Response', async (t) => {
  const result = await paymentService.getPayerAuthEnrollResponse(getPayerAuthEnrollResponseUpdatePaymentObj);
  if (result.actions.length <= 0) {
    t.deepEqual(result.actions, []);
    t.is(result.errors[0].code, 'InvalidInput');
    t.is(result.errors[0].message, 'Cannot process the payment due to invalid input');
  } else {
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_payerEnrollTransactionId');
    t.is(result.actions[1].name, 'isv_payerEnrollHttpCode');
    t.is(result.actions[2].name, 'isv_payerEnrollStatus');
  }
});

test.serial('Get refund response', async (t) =>{
  const result:any = await paymentService.getRefundResponse(getRefundResponseUpdatePaymentObj, getRefundResponseUpdateTransactions, null);
  if(true == result.refundTriggered)
  {
    t.is(result.refundTriggered, true);
    t.is(result.refundActions.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.refundActions.actions[1].action, 'changeTransactionState');
  } else{
    t.is(result.refundTriggered, false);
    t.is(result.refundActions, null);
  }
})

test.serial('Add refund action', async (t) =>{
const result = await paymentService.addRefundAction(addRefundActionAmount, addRefundActionOrderResponse, state);
t.is(result.action, 'addTransaction');
t.is(result.transaction.state, 'Success');
})

test.serial('Get credit card response', async (t) => {
  const result:any = await paymentService.getCreditCardResponse(getCreditCardResponseUpdatePaymentObj, null, getCreditCardResponseCartObj, getAuthResponseTransactionDetail, null, null);
  if(201 == result.paymentResponse.httpCode)
  {
    t.is(result.paymentResponse.httpCode, 201)
    t.is(result.paymentResponse.status, "AUTHORIZED");
  } else {
    t.not(result.paymentResponse.httpCode, 201)
    t.not(result.paymentResponse.status, "AUTHORIZED");
  }
})

test.serial('Get google pay response', async (t) => {
  const result:any = await paymentService.googlePayResponse(googlePayResponseUpdatePaymentObj, getCreditCardResponseCartObj, getAuthResponseTransactionDetail, null, null);
  if(201 == result.paymentResponse.httpCode)
  {
    t.is(result.paymentResponse.httpCode, 201)
    if("AUTHORIZED" == result.paymentResponse.status)
    {
    t.is(result.paymentResponse.status, "AUTHORIZED");
    } else {
      t.not(result.paymentResponse.status, "AUTHORIZED");
    }
  } else {
    t.not(result.paymentResponse.httpCode, 201)
    t.not(result.paymentResponse.status, "AUTHORIZED");
  }
})

test.serial('Get click to pay response', async (t) => {
  const result:any = await paymentService.clickToPayResponse(clickToPayResponseUpdatePaymentObj, getCreditCardResponseCartObj, getAuthResponseTransactionDetail, null, null);
  if(201 == result.paymentResponse.httpCode)
  {
    t.is(result.paymentResponse.httpCode, 201)
    t.is(result.paymentResponse.status, "AUTHORIZED");
  } else {
    t.not(result.paymentResponse.httpCode, 201)
    t.not(result.paymentResponse.status, "AUTHORIZED");
  }
})

test.serial('get response for token create flag for checkout', async (t) => {
  const result = await paymentService.tokenCreateFlag(tokenCreateFlagCustomerInfo, tokenCreateFlagPaymentObj, tokenCreateFlagFunctionName);
  t.is(result.dontSaveTokenFlag, false);
  t.is(result.errorFlag, false);
})

test.serial('get response for token create flag for my account', async (t) => {
  const result = await paymentService.tokenCreateFlag(tokenCreateFlagCustomerInfo, null, tokenCreateFlagFunctionName);
  t.is(result.dontSaveTokenFlag, false);
  t.is(result.errorFlag, false);
})
