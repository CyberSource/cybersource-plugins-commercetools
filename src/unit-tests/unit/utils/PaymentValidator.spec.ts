import test from 'ava';
import dotenv from 'dotenv';

import { Constants } from '../../../constants/constants';
import paymentValidator from '../../../utils/PaymentValidator';
import PaymentServiceConst from '../../const/PaymentServiceConst';
import PaymentValidatorConst from '../../const/PaymentValidatorConst';

dotenv.config();

test.serial('Set Object value with valid inputs', async (t) => {
  const target = {};
  const source = { key: 'value' };
  paymentValidator.setObjectValue(target, 'fieldName', source, 'key', 'string', false);

  t.deepEqual(target, { fieldName: 'value' });
})

test.serial('Set Object value with invalid inputs', async (t) => {
  const target = {};
  const source = { key: 123 };
  paymentValidator.setObjectValue(target, 'fieldName', source, 'key', 'string', false);

  t.deepEqual(target, {});
})

test.serial('Validate Actions And Push with valid inputs', async (t) => {
  const sourceArray = [1, 2, 3];
  const targetArray = [4, 5];

  paymentValidator.validateActionsAndPush(sourceArray, targetArray);

  t.deepEqual(targetArray, [4, 5, 1, 2, 3]);
});

test.serial('Validate Actions And Push with invalid inputs', async (t) => {
  const sourceArray = [1, 2, 3];
  const targetArray = {} as any;

  paymentValidator.validateActionsAndPush(sourceArray, targetArray);

  t.deepEqual(targetArray, {});
});

test.serial('Valid Add token service response', async (t) => {
  const result = paymentValidator.isValidAddTokenResponse(PaymentValidatorConst.validAddTokenServiceResponse);
  t.is(result, true);
})

test.serial('Test Is Valid Card response', async (t) => {
  const result = paymentValidator.isValidCardResponse(PaymentValidatorConst.validAddTokenServiceResponse);
  t.is(result, true);
})

test.serial('Test Is Valid Card response with invald http code', async (t) => {
  PaymentValidatorConst.validAddTokenServiceResponse.httpCode = 401;
  const result = paymentValidator.isValidCardResponse(PaymentValidatorConst.validAddTokenServiceResponse);
  t.is(result, false);
})

test.serial('Valid Add Token service response when status is declined', async (t) => {
  PaymentValidatorConst.validAddTokenServiceResponse.status = 'Declined';
  const result = paymentValidator.isValidAddTokenResponse(PaymentValidatorConst.validAddTokenServiceResponse);
  t.is(result, false);
})

test.serial('Valid AddToken service response with invalid httpCode', async (t) => {
  PaymentValidatorConst.validAddTokenServiceResponse.httpCode = 401;
  const result = paymentValidator.isValidAddTokenResponse(PaymentValidatorConst.validAddTokenServiceResponse);
  t.is(result, false);
})

test.serial('Valid Update service response', async (t) => {
  const result = paymentValidator.isValidUpdateServiceResponse(PaymentValidatorConst.validUpdateResponse);
  t.is(result, true);
})

test.serial('Valid Update service response with invalid httpCode', async (t) => {
  PaymentValidatorConst.validUpdateResponse.httpCode = 401;
  const result = paymentValidator.isValidUpdateServiceResponse(PaymentValidatorConst.validUpdateResponse);
  t.is(result, false);
})

test.serial('Validate Rate Limiter Input', async (t) => {
  const result = paymentValidator.isValidRateLimiterInput();
  t.is(typeof result, 'boolean');
})


test.serial('Test Is Valid Transaction with Valid Input', async (t) => {
  const result = paymentValidator.isValidTransaction(PaymentServiceConst.getRefundResponseUpdatePaymentObj, PaymentServiceConst.getRefundResponseUpdateTransactions);
  t.is(result, true);
});

test.serial('Test Is Valid Transaction with Invalid fraction digits', async (t) => {
  PaymentServiceConst.getRefundResponseUpdateTransactions.amount.fractionDigits = -1;
  const result = paymentValidator.isValidTransaction(PaymentServiceConst.getRefundResponseUpdatePaymentObj, PaymentServiceConst.getRefundResponseUpdateTransactions);
  t.is(result, false);
});

test.serial('Test Is Successful Charge Transaction with Valid Input', async (t) => {
  let i = 0;
  for (let transaction of PaymentServiceConst.getRefundResponseUpdatePaymentObj.transactions) {
    const result = paymentValidator.isSuccessFulChargeTransaction(transaction);
    if (result === true) {
      i++;
    }
  }
  t.is(i, 1);
});

test.serial('Test Is Successful Charge Transaction with status failure', async (t) => {
  let i = 0;
  for (let transaction of PaymentServiceConst.getRefundResponseUpdatePaymentObj.transactions) {
    if (Constants.CT_TRANSACTION_TYPE_CHARGE === transaction.type) {
      transaction.state = 'Failure';
    }
    const result = paymentValidator.isSuccessFulChargeTransaction(transaction);
    if (result === true) {
      i++;
    }
  }
  t.is(i, 0);
});

test.serial('Test Validate Pending Authentication Response', async (t) => {
  const { httpCode, status, data } = PaymentServiceConst.getAuthResponsePaymentPendingResponse;
  const { consumerAuthenticationInformation } = data || {};
  const result = paymentValidator.isValidPendinAuthenticationResponse(httpCode, status, data, consumerAuthenticationInformation);
  t.is(result, true);
})

test.serial('Test Validate Pending Authentication Response with Invalid status', async (t) => {
  const { httpCode, data } = PaymentServiceConst.getAuthResponsePaymentPendingResponse;
  const { consumerAuthenticationInformation } = data || {};
  const status = 'AUTHORIZED';
  const result = paymentValidator.isValidPendinAuthenticationResponse(httpCode, status, data, consumerAuthenticationInformation);
  t.is(result, false);
})

test.serial('Test Validate transaction summaries', async (t) => {
  const result = paymentValidator.isValidTransactionSummaries(PaymentValidatorConst.validTransactionDetail, PaymentValidatorConst.validateTransactionUpdatePaymentObj, 3);
  t.is(result, true);
})

test.serial('Test Validate transaction summaries  with Invalid retry count', async (t) => {
  const result = paymentValidator.isValidTransactionSummaries(PaymentValidatorConst.validTransactionDetail, PaymentValidatorConst.validateTransactionUpdatePaymentObj, 1);
  t.is(result, false);
})

test.serial('Test Validate Consumer Authentication Required', async (t) => {
  const result = paymentValidator.isConsumerAuthenticationRequired(PaymentValidatorConst.validateConsumerAuthenticationRequiredResponse);
  t.is(result, false);
})

test.serial('Test Validate Consumer Authentication Required with Invalid Reason', async (t) => {
  PaymentValidatorConst.validateConsumerAuthenticationRequiredResponse.data.errorInformation.reason = 'PENDING_AUTHENTICATION';
  const result = paymentValidator.isConsumerAuthenticationRequired(PaymentValidatorConst.validateConsumerAuthenticationRequiredResponse);
  t.is(result, false);
})

test.serial('Test Validate should process tokens', async (t) => {
  const result = paymentValidator.shouldProcessTokens(false, PaymentValidatorConst.processTokenPaymentResponse, PaymentValidatorConst.processTokenUpdatePaymentObj);
  t.is(result, true);
})

test.serial('Test Validate should process tokens with invalid Payment method', async (t) => {
  PaymentValidatorConst.processTokenUpdatePaymentObj.paymentMethodInfo.method = 'googlePay';
  const result = paymentValidator.shouldProcessTokens(false, PaymentValidatorConst.processTokenPaymentResponse, PaymentValidatorConst.processTokenUpdatePaymentObj);
  t.is(result, false);
})

test.serial('Test Validate should process failed token', async (t) => {
  const result = paymentValidator.shouldProcessFailedTokens(PaymentValidatorConst.processFailedTokenPaymentResponse, PaymentValidatorConst.processFailedTokenUpdatePaymentObj);
  t.is(result, true);
})

test.serial('Test Validate should process failed token with invalid tokenAlias', async (t) => {
  PaymentValidatorConst.processFailedTokenUpdatePaymentObj.custom.fields.isv_tokenAlias = '';
  const result = paymentValidator.shouldProcessFailedTokens(PaymentValidatorConst.processFailedTokenPaymentResponse, PaymentValidatorConst.processFailedTokenUpdatePaymentObj);
  t.is(result, false);
})