
import test from 'ava';
import dotenv from 'dotenv';

import { FunctionConstant } from '../../../constants/functionConstant';
import { Constants } from '../../../constants/paymentConstants';
import { PaymentInformationModel } from '../../../requestBuilder/PaymentInformation';
import PaymentAuthorizationServiceConstAP from '../../const/ApplePay/PaymentAuthorizationServiceConstAP';
import PaymentAuthorizationServiceConstCC from '../../const/CreditCard/PaymentAuthorizationServiceConstCC';
import PaymentAuthorizationServiceConstECDebit from '../../const/ECheck/PaymentAuthorizationServiceConstECDebit';
import PaymentAuthorizationServiceConstGP from '../../const/GooglePay/PaymentAuthorizationServiceConstGP';
import PayerAuthenticationSetupServiceConst from '../../const/PayerAuthenticationSetupServiceConst';

dotenv.config();

const paymentInformationInstance = new PaymentInformationModel();

test.serial('Map payment information for credit card authorization', async (t) => {
  try {
    const result = paymentInformationInstance.mapPaymentInformation(
      FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE,
      PaymentAuthorizationServiceConstCC.payment as any,
      PaymentAuthorizationServiceConstCC.cardTokens,
      PaymentAuthorizationServiceConstCC.cardTokens.customerTokenId,
    );

    if (Object.keys(result).length) {
      t.is(result.customer.id, PaymentAuthorizationServiceConstCC.cardTokens.customerTokenId);
      t.is(result.card.typeSelectionIndicator, 1);
    } else {
      t.fail(`Unexpected error: information for credit card authorization' ${result}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Map payment information for google pay authorization', async (t) => {
  try {
    const result = paymentInformationInstance.mapPaymentInformation(
      FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE,
      PaymentAuthorizationServiceConstGP.payment as any,
      PaymentAuthorizationServiceConstECDebit.cardTokens,
      PaymentAuthorizationServiceConstECDebit.cardTokens.customerTokenId,
    );

    if (Object.keys(result).length) {
      t.is(result.fluidData.value, PaymentAuthorizationServiceConstGP.payment.custom.fields.isv_token);
    } else {
      t.fail(`Unexpected error: information for google pay authorization' ${result}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Map payment information for eCheck authorization', async (t) => {
  try {
    const result = paymentInformationInstance.mapPaymentInformation(
      FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE,
      PaymentAuthorizationServiceConstECDebit.payment as any,
      PaymentAuthorizationServiceConstECDebit.cardTokens,
      PaymentAuthorizationServiceConstECDebit.cardTokens.customerTokenId,
    );

    if (Object.keys(result).length) {
      t.is(result.bank.account.type, PaymentAuthorizationServiceConstECDebit.payment.custom.fields.isv_accountType);
      t.is(result.bank.account.number, PaymentAuthorizationServiceConstECDebit.payment.custom.fields.isv_accountNumber);
      t.is(result.bank.routingNumber, PaymentAuthorizationServiceConstECDebit.payment.custom.fields.isv_routingNumber);
    } else {
      t.fail(`Unexpected error: information for eCheck authorization' ${result}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Map payment information for add token', async (t) => {
  try {
    const result = paymentInformationInstance.mapPaymentInformation(
      FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE,
      PaymentAuthorizationServiceConstCC.payment as any,
      PaymentAuthorizationServiceConstCC.cardTokens,
      PaymentAuthorizationServiceConstCC.cardTokens.customerTokenId,
    );

    if (Object.keys(result).length) {
      t.is(result.customer.id, PaymentAuthorizationServiceConstCC.cardTokens.customerTokenId);
      t.is(result.card.typeSelectionIndicator, 1);
    } else {
      t.fail(`Unexpected error: information for add token' ${result}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Map payment information for payer auth set up', async (t) => {
  try {
    const result = paymentInformationInstance.mapPaymentInformation(
      FunctionConstant.FUNC_GET_PAYER_AUTH_SETUP_DATA,
      PayerAuthenticationSetupServiceConst.payments as any,
      PaymentAuthorizationServiceConstCC.cardTokens,
      PaymentAuthorizationServiceConstCC.cardTokens.customerTokenId,
    );
    if (Object.keys(result).length) {
      if (result?.customer) {
        t.is(result.customer.id, PaymentAuthorizationServiceConstCC.cardTokens.customerTokenId);
      } else {
        t.fail();
      }
    } else {
      t.fail(`Unexpected error: information for payer auth set up' ${result}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Map payment information for credit card authorization with saved card', async (t) => {
  try {
    const result = paymentInformationInstance.mapPaymentInformation(
      FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE,
      PaymentAuthorizationServiceConstCC.payments as any,
      PaymentAuthorizationServiceConstCC.cardTokens,
      PaymentAuthorizationServiceConstCC.cardTokens.customerTokenId,
    );

    if (Object.keys(result).length) {
      t.is(result.customer.id, PaymentAuthorizationServiceConstCC.cardTokens.customerTokenId);
      t.is(result.paymentInstrument.id, PaymentAuthorizationServiceConstCC.cardTokens.paymentInstrumentId);
    } else {
      t.fail(`Unexpected error: information for credit card authorization with saved card' ${result}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Map payment information for apple pay authorization', async (t) => {
  try {
    const result = paymentInformationInstance.mapPaymentInformation(
      FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE,
      PaymentAuthorizationServiceConstAP.payment as any,
      PaymentAuthorizationServiceConstCC.cardTokens,
      PaymentAuthorizationServiceConstCC.cardTokens.customerTokenId,
    );

    if (Object.keys(result).length) {
      t.is(result.fluidData.value, PaymentAuthorizationServiceConstAP.payment.custom.fields.isv_token);
      t.is(result.fluidData.descriptor, Constants.PAYMENT_GATEWAY_APPLE_PAY_DESCRIPTOR);
      t.is(result.fluidData.encoding, Constants.BASE_SIXTY_FOUR_ENCODING);
    } else {
      t.fail(`Unexpected error: information for apple pay authorization' ${result}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Map payment information with empty function name', async (t) => {
  try {
    const result = paymentInformationInstance.mapPaymentInformation(
      '',
      PaymentAuthorizationServiceConstCC.payment as any,
      PaymentAuthorizationServiceConstCC.cardTokens,
      PaymentAuthorizationServiceConstCC.cardTokens.customerTokenId,
    );
    if (!result) {
      t.falsy(result);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});