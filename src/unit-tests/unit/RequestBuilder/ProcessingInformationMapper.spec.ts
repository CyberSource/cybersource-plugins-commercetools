import test from 'ava';
import dotenv from 'dotenv';

import { FunctionConstant } from '../../../constants/functionConstant';
import { ProcessingInformation } from '../../../requestBuilder/ProcessingInformationMapper';
import PaymentAuthorizationServiceConstAP from '../../const/ApplePay/PaymentAuthorizationServiceConstAP';
import PaymentAuthorizationServiceVsConst from '../../const/ClickToPay/PaymentAuthorizationServiceVsConst';
import PaymentAuthorizationReversalConstCC from '../../const/CreditCard/PaymentAuthorizationReversalConstCC';
import PaymentAuthorizationServiceConstCC from '../../const/CreditCard/PaymentAuthorizationServiceConstCC';
import PaymentAuthorizationServiceConstGP from '../../const/GooglePay/PaymentAuthorizationServiceConstGP';

dotenv.config();

const processingInformation = new ProcessingInformation(
  FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE,
  PaymentAuthorizationServiceConstCC.payment as any,
  PaymentAuthorizationServiceConstCC.orderNo,
  PaymentAuthorizationServiceConstCC.service,
  PaymentAuthorizationServiceConstCC.cardTokens,
  false,
);
const processingInformationForClickToPay = new ProcessingInformation(
  FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE,
  PaymentAuthorizationServiceVsConst.payment as any,
  PaymentAuthorizationServiceConstGP.orderNo,
  PaymentAuthorizationServiceConstGP.service,
  PaymentAuthorizationServiceConstGP.cardTokens,
  false,
);
const processingInformationForUCClickToPay = new ProcessingInformation(
  FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE,
  PaymentAuthorizationServiceVsConst.payment as any,
  PaymentAuthorizationServiceConstGP.orderNo,
  PaymentAuthorizationServiceConstGP.service,
  PaymentAuthorizationServiceConstGP.cardTokens,
  false,
);
const processingInformationForGooglePay = new ProcessingInformation(
  FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE,
  PaymentAuthorizationServiceConstGP.payment as any,
  PaymentAuthorizationServiceConstGP.orderNo,
  PaymentAuthorizationServiceConstGP.service,
  PaymentAuthorizationServiceConstGP.cardTokens,
  false,
);
const processingInformationForApplePay = new ProcessingInformation(
  FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE,
  PaymentAuthorizationServiceConstAP.payment as any,
  PaymentAuthorizationServiceConstGP.orderNo,
  PaymentAuthorizationServiceConstGP.service,
  PaymentAuthorizationServiceConstGP.cardTokens,
  false,
);
const processingInformationForAuthReversal = new ProcessingInformation(
  FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE,
  PaymentAuthorizationReversalConstCC.payment as any,
  PaymentAuthorizationServiceConstGP.orderNo,
  PaymentAuthorizationServiceConstGP.service,
  PaymentAuthorizationServiceConstGP.cardTokens,
  false,
);
const processingInformationForRefund = new ProcessingInformation(
  FunctionConstant.FUNC_GET_REFUND_DATA,
  PaymentAuthorizationReversalConstCC.payment as any,
  PaymentAuthorizationServiceConstGP.orderNo,
  PaymentAuthorizationServiceConstGP.service,
  PaymentAuthorizationServiceConstGP.cardTokens,
  false,
);

test.serial('Get processing information for credit card', async (t) => {
  try {
    const result = processingInformation.getProcessingInformation();
    if (!result.length) {
      t.deepEqual(result.actionList, []);
    } else {
      t.fail(`Unexpected error: information for credit card processing' ${JSON.stringify(result)}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Get processing information for click to pay', async (t) => {
  try {
    const result = processingInformationForClickToPay.getProcessingInformation();
    if (!result.length) {
      t.deepEqual(result.actionList, []);
      t.is(result.paymentSolution, 'visaCheckout');
      t.is(result.visaCheckoutId, PaymentAuthorizationServiceVsConst.payment.custom.fields.isv_token);
    } else {
      t.fail(`Unexpected error: information for click to pay' ${JSON.stringify(result)}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Get processing information for unified checkout click to pay', async (t) => {
  try {
    const result = processingInformationForUCClickToPay.getProcessingInformation();
    if (!result?.length) {
      t.deepEqual(result.actionList, []);
      t.is(result.paymentSolution, 'visaCheckout');
    } else {
      t.fail(`Unexpected error: information for unified checkout click to pay' ${JSON.stringify(result)}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Get processing information for google pay', async (t) => {
  try {
    const result = processingInformationForGooglePay.getProcessingInformation();

    if (!result.length) {
      t.deepEqual(result.actionList, []);
      t.is(result.paymentSolution, '012');
    } else {
      t.fail(`Unexpected error: information for google pay' ${JSON.stringify(result)}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Get processing information for apple pay', async (t) => {
  try {
    const result = processingInformationForApplePay.getProcessingInformation();

    if (!result.length) {
      t.deepEqual(result.actionList, []);
      t.is(result.paymentSolution, '001');
    } else {
      t.fail(`Unexpected error: information for apple pay' ${JSON.stringify(result)}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Get processing information for auth reversal', async (t) => {
  try {
    const result = processingInformationForAuthReversal.getProcessingInformation();

    if (!result.length) {
      t.deepEqual(result.actionList, []);
    } else {
      t.fail(`Unexpected error: information for auth reversal' ${JSON.stringify(result)}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});

test.serial('Get processing information for refund', async (t) => {
  try {
    const result = processingInformationForRefund.getProcessingInformation();
    if (!result.length) {
      t.deepEqual(result.actionList, []);
    } else {
      t.fail(`Unexpected error: information for refund' ${JSON.stringify(result)}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});