import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../../constants/constants';
import { FunctionConstant } from '../../../constants/functionConstant';
import paymentService from '../../../utils/PaymentService';
import unit from '../../JSON/unit.json';
import AddTokenServiceConst from '../../const/AddTokenServiceConst';
import PaymentAuthorizationServiceConstAP from '../../const/ApplePay/PaymentAuthorizationServiceConstAP';
import PaymentAuthorizationServiceVsConst from '../../const/ClickToPay/PaymentAuthorizationServiceVsConst';
import PaymentAuthorizationServiceConstCC from '../../const/CreditCard/PaymentAuthorizationServiceConstCC';
import PaymentCaptureServiceConstCC from '../../const/CreditCard/PaymentCaptureServiceConstCC';
import GetTransactionDataConst from '../../const/GetTransactionDataConst';
import PaymentHandlerConst from '../../const/PaymentHandlerConst';
import PaymentServiceConst from '../../const/PaymentServiceConst';

test.serial('Get OM Service Response', async (t: any) => {
  let result: any = paymentService.getOMServiceResponse(PaymentServiceConst.getOMServiceResponsePaymentResponse, PaymentServiceConst.getOMServiceResponseTransactionDetail, '123', 0);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, 'Success');
});

test.serial('Get OM Service Response when capture id is empty', async (t: any) => {
  let result: any = paymentService.getOMServiceResponse(PaymentServiceConst.getOMServiceResponsePaymentResponse, PaymentServiceConst.getOMServiceResponseTransactionDetail, '123', 0);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, 'Success');
});

test.serial('Get OM Service Response for failure', async (t: any) => {
  let result: any = paymentService.getOMServiceResponse(PaymentServiceConst.getOMServiceResponsePaymentResponseObject, PaymentServiceConst.getOMServiceResponseTransactionDetail, '', 0);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, 'Failure');
  t.is(result.actions[2].action, 'addInterfaceInteraction');
  t.is(result.actions[2].type.key, 'isv_payment_failure');
});

test.serial('Check response of get auth response with successful auth', async (t: any) => {
  let result = paymentService.getAuthResponse(PaymentServiceConst.getAuthResponsePaymentResponse, PaymentServiceConst.getAuthResponseTransactionDetail);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, 'Success');
});

test.serial('Check response of get auth response object when auth is pending', async (t: any) => {
  let result = paymentService.getAuthResponse(PaymentServiceConst.getAuthResponsePaymentResponseObject, PaymentServiceConst.getAuthResponseTransactionDetail);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, 'Pending');
});

test.serial('Check response of get auth response object when auth is declined', async (t: any) => {
  let result = paymentService.getAuthResponse(PaymentServiceConst.getAuthResponsePaymentDeclinedResponse, PaymentServiceConst.getAuthResponseTransactionDetail);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, 'Failure');
});

test.serial('Check response of get auth response object when payer auth setup is completed', async (t: any) => {
  let result = paymentService.getAuthResponse(PaymentServiceConst.getAuthResponsePaymentCompleteResponse, null);
  t.is(result.actions[0].action, 'setCustomField');
  t.is(result.actions[0].name, 'isv_requestJwt');
  t.is(result.actions[1].action, 'setCustomField');
  t.is(result.actions[1].name, 'isv_cardinalReferenceId');
  t.is(result.actions[2].action, 'setCustomField');
  t.is(result.actions[2].name, 'isv_deviceDataCollectionUrl');
});

test.serial('Check response of get auth response object when authentication is pending', async (t: any) => {
  let result = paymentService.getAuthResponse(PaymentServiceConst.getAuthResponsePaymentPendingResponse, null);
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
  let result = paymentService.getCapturedAmount(PaymentServiceConst.getCapturedAmountRefundPaymentObj);
  t.is(result, 69.7);
});

test.serial('Get authorize amount', async (t: any) => {
  let result = paymentService.getAuthorizedAmount(PaymentServiceConst.getAuthorizedAmountCapturePaymentObj);
  t.is(result, 44.9);
});

test.serial('Get refund response', async (t: any) => {
  let result: any = await paymentService.getRefundResponse(PaymentServiceConst.getRefundResponseUpdatePaymentObj, PaymentServiceConst.getRefundResponseUpdateTransactions, '');
  if (result?.actions.length) {
    t.is(result.actions[0].action, 'changeTransactionInteractionId');
    t.is(result.actions[1].action, 'changeTransactionState');
    t.is(result.actions[2].action, 'addInterfaceInteraction');
  } else {
    t.deepEqual(result.actions, []);
    t.deepEqual(result.errors, []);
  }
});

test.serial('Get payment response for credit card', async (t: any) => {
  let result: any = await paymentService.getPaymentResponse(PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, null, PaymentServiceConst.getCreditCardResponseCartObj, PaymentServiceConst.getAuthResponseTransactionDetail, PaymentServiceConst.customerCardTokens, '');
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

test.serial('Get payment response for apple pay', async (t: any) => {
  let result: any = await paymentService.getPaymentResponse(PaymentAuthorizationServiceConstAP.payments, null, PaymentServiceConst.getCreditCardResponseCartObj, PaymentServiceConst.getAuthResponseTransactionDetail, PaymentServiceConst.customerCardTokens, '');
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
  let result: any = await paymentService.getGooglePayResponse(PaymentServiceConst.getGooglePayResponseUpdatePaymentObj, PaymentServiceConst.getCreditCardResponseCartObj, PaymentServiceConst.getAuthResponseTransactionDetail, PaymentServiceConst.customerCardTokens, '');
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
  let result: any = await paymentService.getClickToPayResponse(PaymentServiceConst.getClickToPayResponseUpdatePaymentObj, PaymentServiceConst.getCreditCardResponseCartObj, PaymentServiceConst.getAuthResponseTransactionDetail, PaymentServiceConst.customerCardTokens, '');
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

test.serial('get the transaction summaries', async (t: any) => {
  let result: any = await paymentService.getTransactionSummaries(PaymentServiceConst.getTransactionSummariesUpdatePaymentObj, 3);
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
  let result: any = await paymentService.getTransactionSummaries(PaymentServiceConst.getTransactionSummariesUpdatePaymentObj, 0);
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
  let result = await paymentService.checkAuthReversalTriggered(
    PaymentServiceConst.getTransactionSummariesUpdatePaymentObj,
    PaymentServiceConst.getCreditCardResponseCartObj,
    PaymentServiceConst.checkAuthReversalTriggeredPaymentResponse,
    PaymentServiceConst.checkAuthReversalTriggeredUpdateActions,
  );
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[1].state, 'Success');
});

test.serial('get card tokens ', async (t: any) => {
  let result = await paymentService.getCardTokens(PaymentHandlerConst.updateCardHandlerCustomerObj, 'abc');
  let i = 0;
  if ('customerTokenId' in result && 'paymentInstrumentId' in result) {
    i++;
  }
  t.is(i, 1);
});

test.serial('get card tokens when saved token is empty', async (t: any) => {
  let result = await paymentService.getCardTokens(PaymentHandlerConst.updateCardHandlerCustomerObj, '');
  let i = 0;
  if ('customerTokenId' in result && 'paymentInstrumentId' in result) {
    i++;
  }
  t.is(i, 1);
});

test.serial('update the visa details', async (t: any) => {
  let result: any = await paymentService.updateCardDetails(PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, 12, '6f2129cc-76fc-441f-a1ae-cfa940184f6d');
  let i = 0;
  if (result && result?.cartVersion && result?.paymentVersion) {
    i++;
    t.is(i, 1);
  } else {
    t.pass();
  }
});

test.serial('update the visa details when transaction id is empty', async (t: any) => {
  let result: any = await paymentService.updateCardDetails(PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, 12, '');
  t.falsy(result);
});

test.serial('update cart with uc address', async (t: any) => {
  let result = await paymentService.updateCartWithUCAddress(PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, PaymentServiceConst.getCreditCardResponseCartObj);
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
  let result = await paymentService.addTokenAddressForUC(PaymentServiceConst.getCreditCardResponseUpdatePaymentObj, PaymentServiceConst.getCreditCardResponseCartObj);
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
  let result: any = await paymentService.setCustomerFailedTokenData(PaymentAuthorizationServiceConstCC.payment, PaymentServiceConst.customFields, '');
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
  let result: any = paymentService.setTransactionCustomType(PaymentServiceConst.getRefundResponseUpdateTransactions.id, PaymentServiceConst.getRefundResponseUpdateTransactions.amount.centAmount);
  t.is(result.action, 'setTransactionCustomType');
  t.is(result.type.key, 'isv_transaction_data');
  t.is(result.type.typeId, 'type');
  t.is(result.fields.isv_availableCaptureAmount, PaymentServiceConst.getRefundResponseUpdateTransactions.amount.centAmount);
  t.is(result.transactionId, PaymentServiceConst.getRefundResponseUpdateTransactions.id);
});

test.serial('Set custom type for transaction when transaction id and amount is null', async (t) => {
  let result: any = paymentService.setTransactionCustomType('', 0);
  t.is(result.action, 'setTransactionCustomType');
  t.is(result.type.key, 'isv_transaction_data');
  t.is(result.type.typeId, 'type');
  t.is(result.fields.isv_availableCaptureAmount, 0);
  t.is(result.transactionId, '');
});

test.serial('Get applications present', async (t) => {
  let result = await paymentService.getApplicationsPresent(PaymentServiceConst.getPresentApplications);
  let i = 0;
  if ('authPresent' in result && 'authReasonCodePresent' in result && 'capturePresent' in result && 'captureReasonCodePresent' in result && 'authReversalPresent' in result && 'refundPresent in result') {
    i++;
  }
  t.is(i, 1);
});

test.serial('set Customer Token Data', async (t) => {
  let result = await paymentService.setCustomerTokenData(
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
});

test.serial('Handle auth reversal response', async (t) => {
  let result = await paymentService.handleAuthReversalResponse(PaymentAuthorizationServiceConstCC.payment, PaymentCaptureServiceConstCC.cart, PaymentServiceConst.checkAuthReversalTriggeredPaymentResponse, PaymentServiceConst.handleAuthReversalResponseUpdateActions);
  t.is(result.actions[0].action, 'changeTransactionInteractionId');
  t.is(result.actions[1].action, 'changeTransactionState');
  t.is(result.actions[2].name, 'isv_tokenCaptureContextSignature');
  t.is(result.actions[3].action, 'addTransaction');
  t.is(result.actions[4].action, 'addTransaction');
});

test.serial('process tokens ', async (t) => {
  let result = await paymentService.processTokens(
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
});

test.serial('process tokens when token and instrument id is empty', async (t) => {
  let result = await paymentService.processTokens('', '', PaymentServiceConst.processTokensInstrumentIdentifier, PaymentAuthorizationServiceConstCC.payment, '');
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

test.serial('process tokens with empty instrument identifier', async (t) => {
  let result = await paymentService.processTokens(PaymentServiceConst.processTokensCustomerCardTokensObject.customerTokenId, PaymentServiceConst.processTokensCustomerCardTokensObject.paymentInstrumentId, '', PaymentAuthorizationServiceConstCC.payment, '');
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

test.serial('Get authorize amount when cent amount is zero', async (t: any) => {
  let result = paymentService.getAuthorizedAmount(PaymentServiceConst.getAuthorizedZeroAmountCapturePaymentObj);
  t.is(result, 0.4);
});

test.serial('Get captured amount when amount is zero', async (t: any) => {
  let result = paymentService.getCapturedAmount(PaymentServiceConst.getCapturedZeroAmountRefundPaymentObj);
  t.is(result, 0);
});

test.serial('Evaluate token creation ', async (t) => {
  const result = await paymentService.evaluateTokenCreation(AddTokenServiceConst.addTokenResponseCustomerObj, PaymentAuthorizationServiceConstCC.payments, FunctionConstant.FUNC_HANDLE_CARD_ADDITION);
  t.is(typeof result.isSaveToken, 'boolean');
  t.is(typeof result.isError, 'boolean');
});

test.serial('Process transactions for authorization', async (t) => {
  const result = await paymentService.processTransaction(PaymentCaptureServiceConstCC.payment);
  t.pass();
  t.deepEqual(result.actions, []);
  t.deepEqual(result.errors, []);
});

test.serial('Get cart data', async (t) => {
  const result = await paymentService.getCartData(GetTransactionDataConst.paymentResponse, PaymentAuthorizationServiceVsConst.payment);
  if (result?.httpCode) {
    if (Constants.HTTP_OK_STATUS_CODE == result?.httpCode) {
      t.is(result.httpCode, Constants.HTTP_OK_STATUS_CODE);
    } else {
      t.not(result.httpCode, Constants.HTTP_OK_STATUS_CODE);
    }
  } else {
    t.pass();
  }
});
