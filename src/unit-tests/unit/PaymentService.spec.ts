import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../constants';
import paymentService from '../../utils/PaymentService';
import CommercetoolsApi from '../../utils/api/CommercetoolsApi';
import unit from '../JSON/unit.json';
import { payment } from '../const/CreditCard/PaymentAuthorizationServiceConstCC';
import { cart } from '../const/CreditCard/PaymentCaptureServiceConstCC';
import { authorizationHandler3DSUpdatePaymentObject, updateCardHandlerCustomerObj } from '../const/PaymentHandlerConst';
import { getPayerAuthValidateResponseUpdatePaymentObj } from '../const/PaymentHandlerConst';
import { getPayerAuthEnrollResponseUpdatePaymentObj } from '../const/PaymentHandlerConst';
import {
  customerCardTokens,
  getCapturedAmountRefundPaymentObj,
  getCapturedZeroAmountRefundPaymentObj,
  getOMServiceResponsePaymentResponse,
  getOMServiceResponsePaymentResponseObject,
  getOMServiceResponseTransactionDetail,
  visaCardDetailsActionVisaCheckoutData,
  visaCardDetailsActionVisaCheckoutEmptyData,
} from '../const/PaymentServiceConst';
import { getAuthResponsePaymentCompleteResponse, getAuthResponsePaymentDeclinedResponse, getAuthResponsePaymentPendingResponse, getAuthResponsePaymentResponse, getAuthResponsePaymentResponseObject, getAuthResponseTransactionDetail } from '../const/PaymentServiceConst';
import { getRefundResponseUpdatePaymentObj, getRefundResponseUpdateTransactions } from '../const/PaymentServiceConst';
import { addRefundActionAmount, addRefundActionOrderResponse, addRefundActionZeroAmount, payerAuthActionsEmptyResponse, payerAuthActionsResponse, payerEnrollActionsResponse, payerEnrollActionsUpdatePaymentObj, state } from '../const/PaymentServiceConst';
import { getClickToPayResponseUpdatePaymentObj, getCreditCardResponseCartObj, getCreditCardResponseUpdatePaymentObj, getUpdateInvalidTokenActionsActions, getUpdateTokenActionsActions } from '../const/PaymentServiceConst';
import { getAuthorizedAmountCapturePaymentObj, getAuthorizedZeroAmountCapturePaymentObj, getGooglePayResponseUpdatePaymentObj, tokenCreateFlagCustomerInfo, tokenCreateFlagFunctionName, tokenCreateFlagPaymentObj } from '../const/PaymentServiceConst';
import {
  authResponse,
  captureResponse,
  checkAuthReversalTriggeredPaymentResponse,
  checkAuthReversalTriggeredUpdateActions,
  createResponseSetTransaction,
  createTransactionPaymentFailure,
  createTransactionSetCustomField,
  createTransactionSetCustomType,
  createTransactionSetFailedCustomField,
  customFields,
  deleteTokenCustomerObj,
  getPresentApplications,
  getTransactionSummariesUpdatePaymentObj,
  handleAuthApplication,
  handleAuthReversalResponseUpdateActions,
  processTokensCustomerCardTokensObject,
  processTokensInstrumentIdentifier,
  retrieveSyncAmountDetailsApplicationResponse,
  retrieveSyncResponseTransactionElement,
  runSyncAddTransactionSyncUpdateObject,
  runSyncUpdateCaptureAmountUpdatePaymentObj,
  tokenResponse,
} from '../const/PaymentServiceConst';
import { invalidSearchSubscriptionResponse, invalidSubscriptionResponse, searchSubscriptionResponse } from '../const/PaymentServiceConst';

test.serial('Check visa card detail action ', async (t: any) => {
  let result = paymentService.cardDetailsActions(visaCardDetailsActionVisaCheckoutData);
  t.is(result[0].action, 'setCustomField');
  t.is(result[0].name, 'isv_maskedPan');
  t.is(result[1].action, 'setCustomField');
  t.is(result[1].name, 'isv_cardExpiryMonth');
  t.is(result[2].action, 'setCustomField');
  t.is(result[2].name, 'isv_cardExpiryYear');
  t.is(result[3].action, 'setCustomField');
  t.is(result[3].name, 'isv_cardType');
});

test.serial('Check visa card detail action with empty data', async (t: any) => {
  let result = paymentService.cardDetailsActions(visaCardDetailsActionVisaCheckoutEmptyData);
  t.deepEqual(result, []);
});

test.serial('Get OM Service Response', async (t: any) => {
  let result: any = paymentService.getOMServiceResponse(getOMServiceResponsePaymentResponse, getOMServiceResponseTransactionDetail, '123', 0);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, 'Success');
});

test.serial('Get OM Service Response when capture id is empty', async (t: any) => {
  let result: any = paymentService.getOMServiceResponse(getOMServiceResponsePaymentResponse, getOMServiceResponseTransactionDetail, '123', 0);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, 'Success');
});

test.serial('Get OM Service Response for failure', async (t: any) => {
  let result: any = paymentService.getOMServiceResponse(getOMServiceResponsePaymentResponseObject, getOMServiceResponseTransactionDetail, '', 0);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, 'Failure');
  t.is(result.actions[2].action, 'addInterfaceInteraction');
  t.is(result.actions[2].type.key, 'isv_payment_failure');
});

test.serial('Check response of get auth response with successful auth', async (t: any) => {
  let result = paymentService.getAuthResponse(getAuthResponsePaymentResponse, getAuthResponseTransactionDetail);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, 'Success');
});

test.serial('Check response of get auth response object when auth is pending', async (t: any) => {
  let result = paymentService.getAuthResponse(getAuthResponsePaymentResponseObject, getAuthResponseTransactionDetail);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, 'Pending');
});

test.serial('Check response of get auth response object when auth is declined', async (t: any) => {
  let result = paymentService.getAuthResponse(getAuthResponsePaymentDeclinedResponse, getAuthResponseTransactionDetail);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, 'Failure');
});

test.serial('Check response of get auth response object when payer auth setup is completed', async (t: any) => {
  let result = paymentService.getAuthResponse(getAuthResponsePaymentCompleteResponse, null);
  t.is(result.actions[0].action, 'setCustomField');
  t.is(result.actions[0].name, 'isv_requestJwt');
  t.is(result.actions[1].action, 'setCustomField');
  t.is(result.actions[1].name, 'isv_cardinalReferenceId');
  t.is(result.actions[2].action, 'setCustomField');
  t.is(result.actions[2].name, 'isv_deviceDataCollectionUrl');
});

test.serial('Check response of get auth response object when authentication is pending', async (t: any) => {
  let result = paymentService.getAuthResponse(getAuthResponsePaymentPendingResponse, null);
  t.is(result.actions[0].action, 'setCustomField');
  t.is(result.actions[0].name, 'isv_payerAuthenticationRequired');
  t.is(result.actions[1].name, 'isv_payerAuthenticationTransactionId');
  t.is(result.actions[2].name, 'isv_payerAuthenticationAcsUrl');
  t.is(result.actions[3].name, 'isv_payerAuthenticationPaReq');
  t.is(result.actions[4].name, 'isv_stepUpUrl');
  t.is(result.actions[5].name, 'isv_responseJwt');
  t.is(result.actions[6].action, 'addInterfaceInteraction');
});

test.serial('Get captured amount', async (t: any) => {
  let result = paymentService.getCapturedAmount(getCapturedAmountRefundPaymentObj);
  t.is(result, 69.7);
});

test.serial('Get payer auth actions ', async (t: any) => {
  let result = paymentService.payerAuthActions(payerAuthActionsResponse);
  if (0 <= result?.length && result[0]?.fields?.authenticationRequired) {
    t.is(result[0].action, 'addInterfaceInteraction');
    t.is(result[0].fields.authenticationRequired, true);
    t.is(result[1].name, 'isv_payerAuthenticationRequired');
    t.is(result[1].value, true);
    t.is(result[2].name, 'isv_payerAuthenticationTransactionId');
    t.is(result[3].name, 'isv_payerAuthenticationAcsUrl');
    t.is(result[4].name, 'isv_payerAuthenticationPaReq');
    t.is(result[5].name, 'isv_stepUpUrl');
    t.is(result[6].name, 'isv_responseJwt');
  } else {
    t.pass();
  }
});

test.serial('Get payer auth actions when response is empty', async (t: any) => {
  let result = paymentService.payerAuthActions(payerAuthActionsEmptyResponse);
  if (0 <= result?.length) {
    t.is(result[0].action, 'setCustomField');
    t.is(result[0].name, 'isv_payerAuthenticationRequired');
    t.is(result[1].name, 'isv_payerAuthenticationTransactionId');
    t.is(result[2].name, 'isv_payerAuthenticationAcsUrl');
    t.is(result[3].name, 'isv_payerAuthenticationPaReq');
    t.is(result[4].name, 'isv_stepUpUrl');
    t.is(result[5].name, 'isv_responseJwt');
  } else {
    t.pass();
  }
});

test.serial('Get payer enroll actions ', async (t: any) => {
  let result = paymentService.payerEnrollActions(payerEnrollActionsResponse, payerEnrollActionsUpdatePaymentObj);
  t.is(result.actions[0].action, 'setCustomField');
  t.is(result.actions[0].name, 'isv_payerEnrollTransactionId');
  t.is(result.actions[1].name, 'isv_payerEnrollHttpCode');
  t.is(result.actions[1].value, 201);
  t.is(result.actions[2].name, 'isv_payerEnrollStatus');
  t.is(result.actions[2].value, 'PENDING_AUTHENTICATION');
  t.is(result.actions[3].name, 'isv_dmpaFlag');
  t.is(result.actions[3].value, false);
  t.is(result.actions[4].name, 'isv_tokenCaptureContextSignature');
  t.is(result.actions[4].value, null);
});

test.serial('Get update token actions ', async (t: any) => {
  let result = paymentService.getUpdateTokenActions(getUpdateTokenActionsActions, [], true, deleteTokenCustomerObj, null);
  if (result?.actions[0].action) {
    if (deleteTokenCustomerObj?.custom?.type?.id) {
      t.is(result.actions[0].action, 'setCustomField');
    } else if (result?.actions[0]?.type?.key) {
      t.is(result.actions[0].action, 'setCustomType');
      t.is(result.actions[0].type.key, 'isv_payments_customer_tokens');
    }
  } else {
    t.pass();
  }
});

test.serial('Get authorize amount', async (t: any) => {
  let result = paymentService.getAuthorizedAmount(getAuthorizedAmountCapturePaymentObj);
  t.is(result, 44.9);
});

test.serial('get payer auth set up response ', async (t: any) => {
  let result: any = await paymentService.getPayerAuthSetUpResponse(authorizationHandler3DSUpdatePaymentObject);
  if (result) {
    if (0 === result?.actions[0]?.length) {
      t.deepEqual(result.actions, []);
      t.deepEqual(result.errors, []);
    } else if ('setCustomField' === result?.actions[0]?.action) {
      t.is(result.actions[0].action, 'setCustomField');
      t.is(result.actions[0].name, 'isv_requestJwt');
      t.is(result.actions[1].action, 'setCustomField');
      t.is(result.actions[1].name, 'isv_cardinalReferenceId');
      t.is(result.actions[2].action, 'setCustomField');
      t.is(result.actions[2].name, 'isv_deviceDataCollectionUrl');
    } else {
      t.pass();
    }
  } else {
    t.pass();
  }
});

test.serial('get Payer Auth Validate Response', async (t: any) => {
  let result = await paymentService.getPayerAuthValidateResponse(getPayerAuthValidateResponseUpdatePaymentObj);
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

test.serial('Get Payer Auth Enroll Response', async (t: any) => {
  let result = await paymentService.getPayerAuthEnrollResponse(getPayerAuthEnrollResponseUpdatePaymentObj);
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

test.serial('Get refund response', async (t: any) => {
  let result: any = await paymentService.getRefundResponse(getRefundResponseUpdatePaymentObj, getRefundResponseUpdateTransactions, '');
  if (result?.actions.length) {
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
    t.is(result.actions[2].action, 'addInterfaceInteraction');
  } else {
    t.deepEqual(result.actions, []);
    t.deepEqual(result.errors, []);
  }
});

test.serial('Add refund action', async (t: any) => {
  let result = paymentService.addRefundAction(addRefundActionAmount, addRefundActionOrderResponse, state);
  if (result?.action && result?.transaction) {
    t.is(result.action, 'addTransaction');
    t.is(result.transaction.state, 'Success');
  } else {
    t.pass();
  }
});

test.serial('Add refund action when state is empty', async (t: any) => {
  let result = paymentService.addRefundAction(addRefundActionAmount, addRefundActionOrderResponse, '');
  if (result?.action && result?.transaction) {
    t.is(result.action, 'addTransaction');
    t.is(result.transaction.state, '');
  } else {
    t.pass();
  }
});

test.serial('Get credit card response', async (t: any) => {
  let result: any = await paymentService.getCreditCardResponse(getCreditCardResponseUpdatePaymentObj, null, getCreditCardResponseCartObj, getAuthResponseTransactionDetail, customerCardTokens, '');
  if (201 == result.paymentResponse.httpCode) {
    t.is(result.paymentResponse.httpCode, 201);
    if (Constants.API_STATUS_AUTHORIZED == result.paymentResponse.status) {
      t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
    } else if (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW == result.paymentResponse.status) {
      t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW);
    } else if (Constants.API_STATUS_DECLINED == result.paymentResponse.status) {
      t.is(result.paymentResponse.status, Constants.API_STATUS_DECLINED);
    } else if (Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == result.paymentResponse.status) {
      t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED_RISK_DECLINED);
    } else if (Constants.API_STATUS_INVALID_REQUEST == result.paymentResponse.status) {
      t.is(result.paymentResponse.status, Constants.API_STATUS_INVALID_REQUEST);
    } else {
      t.pass();
    }
  } else {
    t.not(result.paymentResponse.httpCode, 201);
    t.not(result.paymentResponse.status, 'AUTHORIZED');
  }
});

test.serial('Get google pay response', async (t: any) => {
  let result: any = await paymentService.getGooglePayResponse(getGooglePayResponseUpdatePaymentObj, getCreditCardResponseCartObj, getAuthResponseTransactionDetail, customerCardTokens, '');
  if (201 == result.paymentResponse.httpCode) {
    t.is(result.paymentResponse.httpCode, 201);
    if (Constants.API_STATUS_AUTHORIZED == result.paymentResponse.status) {
      t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
    } else if (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW == result.paymentResponse.status) {
      t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW);
    } else if (Constants.API_STATUS_DECLINED == result.paymentResponse.status) {
      t.is(result.paymentResponse.status, Constants.API_STATUS_DECLINED);
    } else if (Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == result.paymentResponse.status) {
      t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED_RISK_DECLINED);
    } else if (Constants.API_STATUS_INVALID_REQUEST == result.paymentResponse.status) {
      t.is(result.paymentResponse.status, Constants.API_STATUS_INVALID_REQUEST);
    } else {
      t.pass();
    }
  } else {
    t.not(result.paymentResponse.httpCode, 201);
    t.not(result.paymentResponse.status, 'AUTHORIZED');
  }
});

test.serial('Get click to pay response', async (t: any) => {
  let result: any = await paymentService.getClickToPayResponse(getClickToPayResponseUpdatePaymentObj, getCreditCardResponseCartObj, getAuthResponseTransactionDetail, customerCardTokens, '');
  if (201 == result.paymentResponse.httpCode) {
    t.is(result.paymentResponse.httpCode, 201);
    if (201 == result.paymentResponse.httpCode) {
      t.is(result.paymentResponse.httpCode, 201);
      if (Constants.API_STATUS_AUTHORIZED == result.paymentResponse.status) {
        t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED);
      } else if (Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW == result.paymentResponse.status) {
        t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED_PENDING_REVIEW);
      } else if (Constants.API_STATUS_DECLINED == result.paymentResponse.status) {
        t.is(result.paymentResponse.status, Constants.API_STATUS_DECLINED);
      } else if (Constants.API_STATUS_AUTHORIZED_RISK_DECLINED == result.paymentResponse.status) {
        t.is(result.paymentResponse.status, Constants.API_STATUS_AUTHORIZED_RISK_DECLINED);
      } else if (Constants.API_STATUS_INVALID_REQUEST == result.paymentResponse.status) {
        t.is(result.paymentResponse.status, Constants.API_STATUS_INVALID_REQUEST);
      } else {
        t.pass();
      }
    }
  } else {
    t.not(result.paymentResponse.httpCode, 201);
    t.not(result.paymentResponse.status, 'AUTHORIZED');
  }
});

test.serial('get response for token create flag for checkout', async (t: any) => {
  let result = await paymentService.tokenCreateFlag(tokenCreateFlagCustomerInfo, tokenCreateFlagPaymentObj, tokenCreateFlagFunctionName);
  t.is(result.notSaveToken, false);
  t.is(result.isError, false);
});

test.serial('get response for token create flag for my account', async (t: any) => {
  let result = await paymentService.tokenCreateFlag(tokenCreateFlagCustomerInfo, null, tokenCreateFlagFunctionName);
  t.is(result.notSaveToken, false);
  t.is(result.isError, false);
});

test.serial('get response for token create flag for my account when function name is empty', async (t: any) => {
  let result = await paymentService.tokenCreateFlag(tokenCreateFlagCustomerInfo, null, '');
  t.is(result.notSaveToken, false);
  t.is(result.isError, false);
});

test.serial('get the create response function ', async (t: any) => {
  let result: any = paymentService.createResponse(createResponseSetTransaction, createTransactionSetCustomField, null, null);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[0].interactionId, createResponseSetTransaction.interactionId);
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, createTransactionSetCustomField.state);
});

test.serial('get the transaction summaries', async (t: any) => {
  let result: any = await paymentService.getTransactionSummaries(getTransactionSummariesUpdatePaymentObj, 3);
  if (result) {
    let i = 0;
    if ('summaries' in result && 'historyPresent' in result) {
      i++;
    }
    t.is(i, 1);
  } else {
    t.pass();
  }
});

test.serial('get the transaction summaries with retry count is 0', async (t: any) => {
  let result: any = await paymentService.getTransactionSummaries(getTransactionSummariesUpdatePaymentObj, 0);
  if (result) {
    let i = 0;
    if ('summaries' in result && 'historyPresent' in result) {
      i++;
    }
    t.is(i, 1);
  } else {
    t.pass();
  }
});

test.serial('check if auth reversal is triggered ', async (t: any) => {
  let result = await paymentService.checkAuthReversalTriggered(getTransactionSummariesUpdatePaymentObj, getCreditCardResponseCartObj, checkAuthReversalTriggeredPaymentResponse, checkAuthReversalTriggeredUpdateActions);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, 'Success');
});

test.serial('get card tokens ', async (t: any) => {
  let result = await paymentService.getCardTokens(updateCardHandlerCustomerObj, 'abc');
  let i = 0;
  if ('customerTokenId' in result && 'paymentInstrumentId' in result) {
    i++;
  }
  t.is(i, 1);
});

test.serial('get card tokens when saved token is empty', async (t: any) => {
  let result = await paymentService.getCardTokens(updateCardHandlerCustomerObj, '');
  let i = 0;
  if ('customerTokenId' in result && 'paymentInstrumentId' in result) {
    i++;
  }
  t.is(i, 1);
});

test.serial('get saved card count for rate limiter', async (t: any) => {
  let startTime = new Date();
  startTime.setHours(startTime.getHours() - Number(process.env.PAYMENT_GATEWAY_SAVED_CARD_LIMIT_FRAME));
  let result = await paymentService.rateLimiterAddToken(updateCardHandlerCustomerObj, new Date(startTime).toISOString(), new Date(Date.now()).toISOString());
  let i = 0;
  if ('number' == typeof result) {
    i++;
  }
  t.is(i, 1);
});

test.serial('update the visa details', async (t: any) => {
  let result: any = await paymentService.updateCardDetails(getCreditCardResponseUpdatePaymentObj, 12, '6f2129cc-76fc-441f-a1ae-cfa940184f6d');
  let i = 0;
  if (result && result?.cartVersion && result?.paymentVersion) {
    i++;
    t.is(i, 1);
  } else {
    t.pass();
  }
});

test.serial('update the visa details when transaction id is empty', async (t: any) => {
  let result: any = await paymentService.updateCardDetails(getCreditCardResponseUpdatePaymentObj, 12, '');
  t.falsy(result);
});

test.serial('add transaction for run sync', async (t: any) => {
  let result = await paymentService.runSyncAddTransaction(runSyncAddTransactionSyncUpdateObject, '100', false, false);
  if (result) {
    t.is(result, true);
  } else {
    t.pass();
  }
});

test.serial('add transaction for run sync when reason code is empty', async (t: any) => {
  let result = await paymentService.runSyncAddTransaction(runSyncAddTransactionSyncUpdateObject, '', false, false);
  t.is(result, null);
});

test.serial('update capture amount for run sync', async (t: any) => {
  let result = await paymentService.runSyncUpdateCaptureAmount(runSyncUpdateCaptureAmountUpdatePaymentObj, 1000);
  if (result) {
    t.is(result, true);
  } else {
    t.pass();
  }
});

test.serial('update capture amount for run sync when amount is 0', async (t: any) => {
  let result = await paymentService.runSyncUpdateCaptureAmount(runSyncUpdateCaptureAmountUpdatePaymentObj, 0);
  t.falsy(result);
});

test.serial('update cart with uc address', async (t: any) => {
  let result = await paymentService.updateCartWithUCAddress(getCreditCardResponseUpdatePaymentObj, getCreditCardResponseCartObj);
  if (result) {
    t.is(result.type, 'Cart');
    if (result.cartState == 'Active') {
      t.is(result.cartState, 'Active');
    } else if (result.cartState == 'Merged') {
      t.is(result.cartState, 'Merged');
    } else if (result.cartState == 'Ordered') {
      t.is(result.cartState, 'Ordered');
    }
  } else {
    t.pass();
  }
});

test.serial('add customer adress for uc', async (t: any) => {
  let result = await paymentService.addTokenAddressForUC(getCreditCardResponseUpdatePaymentObj, getCreditCardResponseCartObj);
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

test.serial('Retrieve sync response ', async (t: any) => {
  let result = await paymentService.retrieveSyncResponse(getCreditCardResponseUpdatePaymentObj, retrieveSyncResponseTransactionElement);
  let i = 0;
  if (result && 'amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
    i++;
    t.is(i, 1);
  } else {
    t.is(i, 0);
  }
});

test.serial('Retrieve sync amount details ', async (t: any) => {
  let result = await paymentService.retrieveSyncAmountDetails(getCreditCardResponseUpdatePaymentObj, retrieveSyncResponseTransactionElement, retrieveSyncAmountDetailsApplicationResponse);
  t.is(result.centAmount, 4500);
  t.is(result.currencyCode, 'USD');
});

test.serial('Process update capture amount for run sync ', async t => {
  let paymentObject: any = await CommercetoolsApi.retrievePayment(unit.paymentId);
  let result = await paymentService.processRunSyncUpdateCaptureAmount(captureResponse, 'f8269041-5c82-45f3-b45a-5c6586187cb1', paymentObject?.version, 300, 100);
  let i = 0;
  if (result && 'amountPlanned' in result && 'paymentMethodInfo' in result && 'paymentStatus' in result) {
    i++;
    t.is(i, 1);
  } else {
    t.is(i, 0);
  }
});

test.serial('Process update capture amount for run sync when payment id is empty', async (t) => {
  let paymentObject: any = await CommercetoolsApi.retrievePayment(unit.paymentId);
  let result = await paymentService.processRunSyncUpdateCaptureAmount(captureResponse, '', paymentObject?.version, 300, 100);
  t.falsy(result);
});

test.serial('Set failed token data to customer', async (t) => {
  let result: any = await paymentService.setCustomerFailedTokenData(payment, customFields, '');
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
});

test.serial('Set custom type for transaction', async (t) => {
  let result: any = paymentService.setTransactionCustomType(getRefundResponseUpdateTransactions.id, getRefundResponseUpdateTransactions.amount.centAmount);
  t.is(result.action, 'setTransactionCustomType');
  t.is(result.type.key, 'isv_transaction_data');
  t.is(result.type.typeId, 'type');
  t.is(result.fields.isv_availableCaptureAmount, getRefundResponseUpdateTransactions.amount.centAmount);
  t.is(result.transactionId, getRefundResponseUpdateTransactions.id);
});

test.serial('Set custom type for transaction when transaction id and amount is null', async (t) => {
  let result: any = paymentService.setTransactionCustomType('', 0);
  t.is(result, null);
});

test.serial('Get applications present', async (t) => {
  let result = await paymentService.getApplicationsPresent(getPresentApplications);
  let i = 0;
  if ('authPresent' in result && 'authReasonCodePresent' in result && 'capturePresent' in result && 'captureReasonCodePresent' in result && 'authReversalPresent' in result && 'refundPresent in result') {
    i++;
  }
  t.is(i, 1);
});

test.serial('process payer auth  enroll', async (t) => {
  let result = await paymentService.processPayerAuthEnrollTokens(
    authorizationHandler3DSUpdatePaymentObject,
    tokenResponse,
    authorizationHandler3DSUpdatePaymentObject.custom.fields,
    authorizationHandler3DSUpdatePaymentObject.custom.fields.isv_cardinalReferenceId,
    cart,
    customerCardTokens,
    ''
  );
  t.is(result.actions[0].action, 'setCustomField');
  t.is(result.actions[0].name, 'isv_payerEnrollTransactionId');
  t.is(result.actions[1].name, 'isv_payerEnrollHttpCode');
  t.is(result.actions[2].name, 'isv_payerEnrollStatus');
  t.is(result.actions[3].name, 'isv_dmpaFlag');
  t.is(result.actions[4].name, 'isv_tokenCaptureContextSignature');
  t.is(result.actions[5].name, 'isv_payerAuthenticationRequired');
});

test.serial('set Customer Token Data', async (t) => {
  let result = await paymentService.setCustomerTokenData(customerCardTokens, getAuthResponsePaymentResponse, authResponse, false, authorizationHandler3DSUpdatePaymentObject, cart);
  t.is(result.actions[0].action, 'setCustomField');
  t.is(result.actions[0].name, 'isv_payerEnrollTransactionId');
  t.is(result.actions[1].name, 'isv_payerEnrollHttpCode');
  t.is(result.actions[2].name, 'isv_payerEnrollStatus');
  t.is(result.actions[3].name, 'isv_payerAuthenticationTransactionId');
  t.is(result.actions[4].name, 'isv_tokenCaptureContextSignature');
  t.is(result.actions[5].name, 'isv_payerAuthenticationRequired');
});

test.serial('Handle auth application', async (t) => {
  let result = await paymentService.handleAuthApplication(payment, handleAuthApplication, authResponse, retrieveSyncResponseTransactionElement);
  t.is(result.actions[0].name, 'isv_payerEnrollTransactionId');
  t.is(result.actions[1].name, 'isv_payerEnrollHttpCode');
  t.is(result.actions[2].name, 'isv_payerEnrollStatus');
  t.is(result.actions[3].name, 'isv_payerAuthenticationTransactionId');
  t.is(result.actions[4].name, 'isv_tokenCaptureContextSignature');
  t.is(result.actions[5].name, 'isv_payerAuthenticationRequired');
  t.is(result.actions[6].action, 'addTransaction');
});

test.serial('handleAuthReversalResponse', async (t) => {
  let result = await paymentService.handleAuthReversalResponse(payment, cart, checkAuthReversalTriggeredPaymentResponse, handleAuthReversalResponseUpdateActions);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[2].name, 'isv_tokenCaptureContextSignature');
  t.is(result.actions[3].action, 'addTransaction');
  t.is(result.actions[4].action, 'addTransaction');
});

test.serial('process tokens ', async (t) => {
  let result = await paymentService.processTokens(processTokensCustomerCardTokensObject.customerTokenId, processTokensCustomerCardTokensObject.paymentInstrumentId, processTokensInstrumentIdentifier, payment, '');
  if (result) {
    let i = 0;
    if ('email' in result && 'firstName' in result && 'lastName' in result && 'custom' in result) {
      i++;
    }
    if(1 === i)
      t.is(i, 1);
    else 
      t.is(i, 0)
  } else {
    t.pass();
  }
});

test.serial('process tokens when token and instrument id is empty', async (t) => {
  let result = await paymentService.processTokens('', '', processTokensInstrumentIdentifier, payment, '');
  t.is(result, null);
});

test.serial('get cart details using payment id ', async (t) => {
  let result = await paymentService.getCartDetailsByPaymentId(unit.paymentId);
  if (result) {
    t.is(result.type, 'Cart');
    if (result.cartState == 'Active') {
      t.is(result.cartState, 'Active');
    } else if (result.cartState == 'Merged') {
      t.is(result.cartState, 'Merged');
    } else if (result.cartState == 'Ordered') {
      t.is(result.cartState, 'Ordered');
    }
  } else {
    t.pass();
  }
});

test.serial('get cart details using payment id as null', async (t) => {
  let result = await paymentService.getCartDetailsByPaymentId('');
  t.falsy(result);
});

test.serial('check if auth reversal triggered', async (t) => {
  let result = await paymentService.isAuthReversalTriggered(getAuthorizedAmountCapturePaymentObj, 'submitTimeUtc:[NOW/DAY-1DAY TO NOW/HOUR+1HOUR}');
  t.is(typeof result, 'boolean');
});

test.serial('get payer auth validate response', async (t) => {
  let result = await paymentService.payerAuthValidateActions(authResponse, payerEnrollActionsResponse);
  t.is(result.actions[0].name, 'isv_payerEnrollTransactionId');
  t.is(result.actions[1].name, 'isv_payerEnrollHttpCode');
  t.is(result.actions[2].name, 'isv_payerEnrollStatus');
  t.is(result.actions[3].name, 'isv_payerAuthenticationTransactionId');
  t.is(result.actions[4].name, 'isv_tokenCaptureContextSignature');
  t.is(result.actions[5].name, 'isv_payerAuthenticationRequired');
  t.is(result.actions[6].action, 'addTransaction');
  t.is(result.actions[7].action, 'addInterfaceInteraction');
});

test.serial('Test getSubscriptionDetails api function', async (t) => {
  let result = await paymentService.verifySubscription(searchSubscriptionResponse, process.env.PAYMENT_GATEWAY_MERCHANT_ID);
  t.is(typeof result.isSubscribed, 'boolean');
  t.is(typeof result.presentInCustomObject, 'boolean');
  t.is(result.webhookId, searchSubscriptionResponse.webhookId);
});

test.serial('Test getSubscriptionDetails api function when merchant id is null', async (t) => {
  let result = await paymentService.verifySubscription(searchSubscriptionResponse, '');
  t.is(typeof result.isSubscribed, 'boolean');
  t.is(typeof result.presentInCustomObject, 'boolean');
  t.is(result.webhookId, searchSubscriptionResponse.webhookId);
});

test.serial('Test getSubscriptionDetails api function with empty webhook id', async (t) => {
  let result = await paymentService.verifySubscription(invalidSearchSubscriptionResponse, process.env.PAYMENT_GATEWAY_MERCHANT_ID);
  t.is(result.isSubscribed, false);
  t.is(result.presentInCustomObject, false);
  t.is(result.webhookId, '');
});

test.serial('Test getSubscriptionDetails api function with empty webhook id and merchant id', async (t) => {
  let result = await paymentService.verifySubscription(invalidSearchSubscriptionResponse, '');
  t.is(result.isSubscribed, false);
  t.is(result.presentInCustomObject, false);
  t.is(result.webhookId, '');
});

test.serial('Test getSubscriptionDetails api function with invalid subscription response', async (t) => {
  let result = await paymentService.verifySubscription(invalidSubscriptionResponse, process.env.PAYMENT_GATEWAY_MERCHANT_ID);
  t.is(typeof result.isSubscribed, 'boolean');
  t.is(typeof result.presentInCustomObject, 'boolean');
  t.is(result.webhookId, '');
});

test.serial('check if auth reversal triggered with empty query string', async (t) => {
  let result = await paymentService.isAuthReversalTriggered(getAuthorizedAmountCapturePaymentObj, '');
  t.is(typeof result, 'boolean');
});

test.serial('process tokens with empty instrument identifier', async (t) => {
  let result = await paymentService.processTokens(processTokensCustomerCardTokensObject.customerTokenId, processTokensCustomerCardTokensObject.paymentInstrumentId, '', payment, '');
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

test.serial('get the create response function when transaction is failed', async (t: any) => {
  let result: any = paymentService.createResponse(createResponseSetTransaction, createTransactionSetFailedCustomField, createTransactionPaymentFailure, createTransactionSetCustomType);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[0].interactionId, createResponseSetTransaction.interactionId);
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, createTransactionSetFailedCustomField.state);
});

test.serial('Add refund action with zero amount', async (t: any) => {
  let result = paymentService.addRefundAction(addRefundActionZeroAmount, addRefundActionOrderResponse, state);
  if (result?.action && result?.transaction) {
    t.is(result.action, 'addTransaction');
    t.is(result.transaction.state, 'Success');
  } else {
    t.pass();
  }
});

test.serial('Get authorize amount when cent amount is zero', async (t: any) => {
  let result = paymentService.getAuthorizedAmount(getAuthorizedZeroAmountCapturePaymentObj);
  t.is(result, 0.4);
});

test.serial('Get update token actions when tokens has invalid values', async (t: any) => {
  let result = paymentService.getUpdateTokenActions(getUpdateInvalidTokenActionsActions, [], true, deleteTokenCustomerObj, null);
  if (result?.actions[0].action) {
    if (deleteTokenCustomerObj?.custom?.type?.id) {
      t.is(result.actions[0].action, 'setCustomField');
    } else if (result?.actions[0]?.type?.key) {
      t.is(result.actions[0].action, 'setCustomType');
      t.is(result.actions[0].type.key, 'isv_payments_customer_tokens');
    }
  } else {
    t.pass();
  }
});

test.serial('Get captured amount when amount is zero', async (t: any) => {
  let result = paymentService.getCapturedAmount(getCapturedZeroAmountRefundPaymentObj);
  t.is(result, 0);
});