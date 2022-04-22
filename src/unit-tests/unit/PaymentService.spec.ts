/* eslint-disable sort-imports */
/* eslint-disable import/order */
import test from  'ava';
import dotenv from 'dotenv';
dotenv.config();
import paymentService from '../../utils/PaymentService';
import {fieldMapperFields, fieldMapperFieldObject,getOMServiceResponsePaymentResponse,getOMServiceResponsePaymentResponseObject,getOMServiceResponseTransactionDetail,visaCardDetailsActionVisaCheckoutData, getCapturedAmountRefundPaymentObj} from '../const/PaymentServiceConst';
import {getAuthResponsePaymentPendingResponse,getAuthResponsePaymentCompleteResponse,  getAuthResponsePaymentResponse, getAuthResponsePaymentDeclinedResponse,getAuthResponsePaymentResponseObject,getAuthResponseTransactionDetail} from '../const/PaymentServiceConst';
import {successState, failureState, changeStateTransactionDetail, changeStateFailureTransactionDetail} from '../const/PaymentServiceConst';
import {payerAuthActionsResponse, payerEnrollActionsUpdatePaymentObj, payerEnrollActionsResponse} from '../const/PaymentServiceConst'
import {getUpdateTokenActionsActions, failurePaymentResponse, failureResponseTransactionDetail} from '../const/PaymentServiceConst';
import {deleteTokenResponse, deleteTokenCustomerObj} from '../const/PaymentServiceConst'

test.serial('Field mapping for flex keys', async(t)=>{
    const result = await paymentService.fieldMapper(fieldMapperFields);
    t.is(result[0].action, 'setCustomField');
    t.is(result[0].name, 'isv_tokenCaptureContextSignature');
    t.is(result[1].action, 'setCustomField');
    t.is(result[1].name, 'isv_tokenVerificationContext');
})

test.serial('Field mapping for saved token', async(t)=>{
    const result = await paymentService.fieldMapper(fieldMapperFieldObject);
    t.is(result[0].action, 'setCustomField');
    t.is(result[0].name, 'isv_payerAuthenticationTransactionId');
    t.is(result[1].action, 'setCustomField');
    t.is(result[1].name, 'isv_payerAuthenticationRequired');
})

test.serial('Check visa card detail action ', async(t)=>{
    const result = await paymentService.visaCardDetailsAction(visaCardDetailsActionVisaCheckoutData);
    t.is(result[0].action, 'setCustomField');
    t.is(result[0].name, 'isv_maskedPan');
    t.is(result[1].action, 'setCustomField');
    t.is(result[1].name, 'isv_cardExpiryMonth');
    t.is(result[2].action, 'setCustomField');
    t.is(result[2].name, 'isv_cardExpiryYear');
    t.is(result[3].action, 'setCustomField');
    t.is(result[3].name, 'isv_cardType');
})

test.serial("Get OM Service Response", async(t)=>{
    const result:any = await paymentService.getOMServiceResponse(getOMServiceResponsePaymentResponse, getOMServiceResponseTransactionDetail);
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
    t.is(result.actions[1].state, 'Success');
})

test.serial("Get OM Service Response for failure", async(t)=>{
    const result:any = await paymentService.getOMServiceResponse(getOMServiceResponsePaymentResponseObject, getOMServiceResponseTransactionDetail);
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
    t.is(result.actions[1].state, 'Failure');
    t.is(result.actions[2].action, "addInterfaceInteraction" )
    t.is(result.actions[2].type.key, "isv_payment_failure");
})

test.serial('Check response of get auth response with successful auth', async(t)=>{
    const result = await paymentService.getAuthResponse(getAuthResponsePaymentResponse, getAuthResponseTransactionDetail);
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
    t.is(result.actions[1].state, 'Success');
})

test.serial('Check response of get auth response object when auth is pending', async(t)=>{
    const result = await paymentService.getAuthResponse(getAuthResponsePaymentResponseObject, getAuthResponseTransactionDetail);
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
    t.is(result.actions[1].state, 'Pending');
})

test.serial('Check response of get auth response object when auth is declined', async(t)=>{
    const result = await paymentService.getAuthResponse(getAuthResponsePaymentDeclinedResponse, getAuthResponseTransactionDetail);
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
    t.is(result.actions[1].state, 'Failure');
 })

test.serial('Check response of get auth response object when payer auth setup is completed', async(t)=>{
    const result = await paymentService.getAuthResponse(getAuthResponsePaymentCompleteResponse, null);
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_requestJwt');
    t.is(result.actions[1].action, 'setCustomField');
    t.is(result.actions[1].name, 'isv_cardinalReferenceId');
    t.is(result.actions[2].action, 'setCustomField');
    t.is(result.actions[2].name, 'isv_deviceDataCollectionUrl');
})

test.serial('Check response of get auth response object when authentication is pending', async(t)=>{
    const result = await paymentService.getAuthResponse(getAuthResponsePaymentPendingResponse, null);
    t.is(result.actions[0].action, 'addInterfaceInteraction');
    t.is(result.actions[1].action, 'setCustomField');
    t.is(result.actions[1].name, 'isv_payerAuthenticationRequired');
    t.is(result.actions[1].value, true);
})

test.serial('Get captured amount', async(t)=>{
    const result = await paymentService.getCapturedAmount(getCapturedAmountRefundPaymentObj);
    t.is(result, 69.7);
})

test.serial('Convert cent to amount ', async(t)=>{
    const result =await paymentService.convertCentToAmount(6970);
    t.is(result, 69.70);
})

test.serial('Convert amount to cent', async(t)=>{
    const result =await paymentService.convertAmountToCent(69.70);
    t.is(result, 6970);
})

test.serial('Get response of change state for success', async(t)=>{
    const result =await paymentService.changeState(changeStateTransactionDetail, successState);
    t.is(result.action, 'changeTransactionState');
    t.is(result.state, 'Success');
})

test.serial('Get response of change state for failure', async(t)=>{
    const result =await paymentService.changeState(changeStateFailureTransactionDetail, failureState);
    t.is(result.action, 'changeTransactionState');
    t.is(result.state, 'Failure');
})

test.serial('Get payer auth actions ', async(t)=>{
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
})

test.serial('Get payer enroll actions ', async(t)=>{
    const result = await paymentService.payerEnrollActions(payerEnrollActionsResponse, payerEnrollActionsUpdatePaymentObj);
    t.is(result.actions[0].action, 'setCustomField');
    t.is(result.actions[0].name, 'isv_payerEnrollTransactionId');
    t.is(result.actions[1].name, 'isv_payerEnrollHttpCode');
    t.is(result.actions[1].value, 201);
    t.is(result.actions[2].name, 'isv_payerEnrollStatus');
    t.is(result.actions[2].value, 'PENDING_AUTHENTICATION');
    t.is(result.actions[3].name, 'isv_tokenCaptureContextSignature');
    t.is(result.actions[3].value, null);
})

test.serial('Get update token actions ', async(t)=>{
    const result = await paymentService.getUpdateTokenActions(getUpdateTokenActionsActions);
    t.is(result.actions[0].action, 'setCustomType');
    t.is(result.actions[0].type.key, 'isv_payments_customer_tokens');
})

test.serial('Get the failure response ', async(t)=>{
    const result = await paymentService.failureResponse(failurePaymentResponse, failureResponseTransactionDetail);
    t.is(result.action, 'addInterfaceInteraction');
    t.is(result.type.key, 'isv_payment_failure');
    t.is(result.fields.reasonCode, '201');
})

test.serial('Get delete token response ', async(t)=>{
    const result = await paymentService.deleteToken(deleteTokenResponse, deleteTokenCustomerObj);
    t.not(result, null);

})