import { Payment } from '@commercetools/platform-sdk';
import test from 'ava';
import dotenv from 'dotenv';

import { FunctionConstant } from '../../../constants/functionConstant';
import { Constants } from '../../../constants/paymentConstants';
import prepareFields from '../../../requestBuilder/PrepareFields';
import PaymentUtils from '../../../utils/PaymentUtils';
import creditCard from '../../JSON/creditCard.json';
import HelperConst from '../../const/HelpersConst';

dotenv.config();

test.serial('Get config object with payment object', async (t) => {
  try {
    ;
    const result = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, null, HelperConst.payment as Payment, null);
    t.is(result?.authenticationType, Constants.PAYMENT_GATEWAY_AUTHENTICATION_TYPE);
    t.is(result?.runEnvironment, Constants.PAYMENT_GATEWAY_TEST_ENVIRONMENT);
    t.is(result?.merchantID, process.env.PAYMENT_GATEWAY_MERCHANT_ID);
    t.is(result?.merchantKeyId, process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID);
    t.is(result?.merchantsecretKey, process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY);
    t.is(result?.logConfiguration.enableLog, false);
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get config object with payment object for MLE', async (t) => {
  try {
    let originalEnv = process.env.PAYMENT_GATEWAY_USE_MLE;
    process.env.PAYMENT_GATEWAY_USE_MLE = 'true';
    const result = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, null, HelperConst.payment as Payment, null);
    t.is(result?.authenticationType, Constants.JWT_AUTHENTICATION);
    t.is(result?.runEnvironment, Constants.PAYMENT_GATEWAY_TEST_ENVIRONMENT);
    t.is(result?.merchantID, process.env.PAYMENT_GATEWAY_MERCHANT_ID);
    t.is(result?.merchantKeyId, process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID);
    t.is(result?.merchantsecretKey, process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY);
    t.is(result?.keyAlias, process.env.PAYMENT_GATEWAY_KEY_ALIAS);
    t.is(result?.keyPass, process.env.PAYMENT_GATEWAY_KEY_PASS);
    t.not(result?.keysDirectory, '');
    t.is(result?.keyFileName, process.env.PAYMENT_GATEWAY_KEY_FILE_NAME);
    process.env.PAYMENT_GATEWAY_USE_MLE = originalEnv;
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get config object with payment object for MLE with empty Key FileName', async (t) => {
  try {
    let originalEnv = process.env.PAYMENT_GATEWAY_USE_MLE;
    let originalKeyFileName = process.env.PAYMENT_GATEWAY_KEY_FILE_NAME;
    process.env.PAYMENT_GATEWAY_USE_MLE = 'true';
    process.env.PAYMENT_GATEWAY_KEY_FILE_NAME = '';
    const result = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, null, HelperConst.payment as Payment, null);
    t.is(result, null);
    process.env.PAYMENT_GATEWAY_USE_MLE = originalEnv;
    process.env.PAYMENT_GATEWAY_KEY_FILE_NAME = originalKeyFileName;
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get processing information for authorization response with Decision Manager turned ON', async (t) => {
  try {
    let originalEnv = process.env.PAYMENT_GATEWAY_DECISION_MANAGER;
    process.env.PAYMENT_GATEWAY_DECISION_MANAGER = 'true';
    const result: any = prepareFields.getProcessingInformation(FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, HelperConst.payment as Payment, '', 'Payments', null, false);
    if (result) {
      t.deepEqual(result?.actionList, []);
    }
    process.env.PAYMENT_GATEWAY_DECISION_MANAGER = originalEnv;
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get processing information for authorization response with Decision Manager turned OFF', async (t) => {
  try {
    ;
    let originalEnv = process.env.PAYMENT_GATEWAY_DECISION_MANAGER;
    process.env.PAYMENT_GATEWAY_DECISION_MANAGER = 'false';
    const result: any = prepareFields.getProcessingInformation(FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, HelperConst.payment as Payment, '', 'Payments', null, false);
    if (result) {
      t.deepEqual(result?.actionList, ['DECISION_SKIP']);
    }
    process.env.PAYMENT_GATEWAY_DECISION_MANAGER = originalEnv;
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get payment information for authorization response', async (t) => {
  try {
    const result = prepareFields.getPaymentInformation(FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, HelperConst.payment as Payment, null, null);
    if (result) {
      t.is(result.card.typeSelectionIndicator, 1);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get client reference information for payer auth setup response', async (t) => {
  try {
    const resourceId = '12345';
    const result = prepareFields.getClientReferenceInformation(FunctionConstant.FUNC_GET_PAYER_AUTH_SETUP_RESPONSE, '12345', HelperConst.payment as Payment);
    t.is(result.code, resourceId);
    t.is(result.partner.solutionId, Constants.PAYMENT_GATEWAY_PARTNER_SOLUTION_ID);
    t.is(result.applicationName, Constants.PAYMENT_GATEWAY_APPLICATION_NAME);
    t.is(result.applicationVersion, Constants.PAYMENT_GATEWAY_APPLICATION_VERSION);
    t.is(result.partner.originalTransactionId, HelperConst.payment.id);
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get order information for authorization response', async (t) => {
  try {
    const result: any = prepareFields.getOrderInformation(FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, HelperConst.payment as Payment, null, HelperConst.cart as any, HelperConst.payment.customer as any, null, 'Payments', 'USD');
    t.is(result.amountDetails.totalAmount, 59.8);
    t.is(result.amountDetails.currency, 'USD');
    t.is(result.billTo.firstName, 'john');
    t.is(result.billTo.lastName, 'doe');
    t.is(result.billTo.address1, '1295 Charleston Road');
    t.is(result.billTo.locality, 'Mountain View');
    t.is(result.billTo.administrativeArea, 'CA');
    t.is(result.billTo.postalCode, '94043');
    t.is(result.billTo.country, 'US');
    t.is(result.shipTo.firstName, 'john');
    t.is(result.shipTo.lastName, 'doe');
    t.is(result.shipTo.address1, 'ABC Street');
    t.is(result.shipTo.locality, 'Mountain Views');
    t.is(result.shipTo.administrativeArea, 'CA');
    t.is(result.shipTo.postalCode, '94043');
    t.is(result.shipTo.country, 'US');
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get order information amount details for authorization response', async (t) => {
  try {
    const result = prepareFields.getOrderInformationAmountDetails(FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, null, HelperConst.payment as Payment, HelperConst.cart as any, 'USD', 'Payments');
    t.is(result.totalAmount, 59.8);
    t.is(result.currency, 'USD');
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get order information amount details for capture response', async (t) => {
  try {
    const captureAmount = 5045.80;
    const result = prepareFields.getOrderInformationAmountDetails(FunctionConstant.FUNC_GET_CAPTURE_RESPONSE, captureAmount, HelperConst.payment as Payment, null, 'USD', 'Payments');
    t.is(result.totalAmount, 5045.80);
    t.is(result.currency, 'USD');
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get order information bill-to details for authorization response', async (t) => {
  try {
    const result = prepareFields.getOrderInformationBillToDetails(FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, HelperConst.cart as any, null, HelperConst?.payment?.customer as any);
    t.is(result.firstName, 'john');
    t.is(result.lastName, 'doe');
    t.is(result.address1, '1295 Charleston Road');
    t.is(result.locality, 'Mountain View');
    t.is(result.administrativeArea, 'CA');
    t.is(result.postalCode, '94043');
    t.is(result.country, 'US');
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get order information ship-to details', async (t) => {
  try {
    const cartObj = HelperConst.cart as any;
    const shippingMethod = 'Standard';
    const result = prepareFields.getOrderInformationShipToDetails(cartObj, shippingMethod);
    t.is(result.firstName, 'john');
    t.is(result.lastName, 'doe');
    t.is(result.address1, 'ABC Street');
    t.is(result.locality, 'Mountain Views');
    t.is(result.administrativeArea, 'CA');
    t.is(result.postalCode, '94043');
    t.is(result.country, 'US');
    t.is(result.method, 'Standard');
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get device information', async (t) => {
  try {
    const result = prepareFields.getDeviceInformation(HelperConst.payment as Payment, HelperConst.payment.customer as any, 'Payments');
    t.is(result.fingerprintSessionId, 'ecdce16c-7eee-45bc-8809-978623fb1272');
    t.is(result.ipAddress, '171.76.13.221');
    t.is(result.httpAcceptBrowserValue, '*/*');
    t.is(result.userAgentBrowserValue, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36');
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get consumer authentication information for validation', async (t) => {
  try {
    const result = prepareFields.getConsumerAuthenticationInformation(HelperConst.payment as Payment, Constants.VALIDATION, false, true);
    t.is(result.authenticationTransactionId, 'AftqasS2lskIPXS4Q2q0');
    t.is(result.signedPares, 'eyJtZXNzYWdlVHlwZSI6IkNSZXEiLCJtZXNzYWdlVmVyc2lvbiI6IjIuMi4wIiwidGhyZWVEU1NlcnZlclRyYW5zSUQiOiI1MjNkNzRiOS1kMWMwLTQ2MGItYWE5NC0yMDg4MTg1MmI2NGYiLCJhY3NUcmFuc0lEIjoiMGFmZmQ5NWEtZWYzZC00ZDM2LWI1YTEtNGFkNGE1YmU1MDI4IiwiY2hhbGxlbmdlV2luZG93U2l6ZSI6IjAyIn0');
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get consumer authentication information for enroll check', async (t) => {
  try {
    const result = prepareFields.getConsumerAuthenticationInformation(HelperConst.payment as Payment, Constants.STRING_ENROLL_CHECK, false, true);
    t.is(result.referenceId, '520d7555-8563-4819-899c-bed098ceeded');
    t.is(result.returnUrl, process.env.PAYMENT_GATEWAY_3DS_RETURN_URL);
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get target origins', async (t) => {
  try {
    let originalEnv = process.env.PAYMENT_GATEWAY_TARGET_ORIGINS;
    process.env.PAYMENT_GATEWAY_TARGET_ORIGINS = 'https://example.com,https://another-example.com';
    const result = prepareFields.getTargetOrigins();
    t.deepEqual(result, ['https://example.com', 'https://another-example.com']);
    process.env.PAYMENT_GATEWAY_TARGET_ORIGINS = originalEnv;
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get allowed payment methods', async (t) => {
  try {
    let originalEnv = process.env.PAYMENT_GATEWAY_UC_ALLOWED_PAYMENTS;
    process.env.PAYMENT_GATEWAY_UC_ALLOWED_PAYMENTS = 'PANENTRY,SRC,GOOGLEPAY';
    const result = prepareFields.getAllowedPaymentMethods();
    t.deepEqual(result, ['PANENTRY', 'SRC', 'GOOGLEPAY']);
    process.env.PAYMENT_GATEWAY_UC_ALLOWED_PAYMENTS = originalEnv;
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get allowed card networks for capture context', async (t) => {
  try {
    let originalEnv = process.env.PAYMENT_GATEWAY_CC_ALLOWED_CARD_NETWORKS;
    process.env.PAYMENT_GATEWAY_CC_ALLOWED_CARD_NETWORKS = 'VISA,MASTERCARD,AMEX';
    const functionName = FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT;
    const result = prepareFields.getAllowedCardNetworks(functionName);
    t.deepEqual(result, ['VISA', 'MASTERCARD', 'AMEX']);
    process.env.PAYMENT_GATEWAY_CC_ALLOWED_CARD_NETWORKS = originalEnv;
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get allowed card networks for other functions', async (t) => {
  try {
    let originalEnv = process.env.PAYMENT_GATEWAY_CC_ALLOWED_CARD_NETWORKS;
    process.env.PAYMENT_GATEWAY_CC_ALLOWED_CARD_NETWORKS = 'VISA,MASTERCARD,AMEX';
    const functionName = 'OtherFunction';
    const result = prepareFields.getAllowedCardNetworks(functionName);
    t.deepEqual(result, ['VISA', 'MASTERCARD', 'AMEX']);
    process.env.PAYMENT_GATEWAY_CC_ALLOWED_CARD_NETWORKS = originalEnv;
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get token information for payer auth setup data', async (t) => {
  try {
    const result = prepareFields.getTokenInformation(HelperConst.payment as Payment, FunctionConstant.FUNC_GET_PAYER_AUTH_SETUP_DATA);
    if (result) {
      t.is(typeof result.transientToken, 'string');
    } else {
      t.fail();
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get token information for other functions', async (t) => {
  try {
    const result = prepareFields.getTokenInformation(HelperConst.payment as Payment, FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE);
    t.is(result.transientTokenJwt, creditCard.isv_token);
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get capture mandate for Payments service', async (t) => {
  try {
    const result = prepareFields.getCaptureMandate('Payments');
    t.is(result.billingType, process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE);
    t.is(result.requestEmail, PaymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_UC_ENABLE_EMAIL));
    t.is(result.requestPhone, PaymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_UC_ENABLE_PHONE));
    t.is(result.requestShipping, PaymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_UC_ENABLE_SHIPPING));
    t.is(result.showAcceptedNetworkIcons, PaymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_UC_ENABLE_NETWORK_ICONS));
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get capture mandate for MyAccounts service', async (t) => {
  try {
    const result = prepareFields.getCaptureMandate('MyAccounts');
    t.is(result.billingType, process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE);
    t.is(result.requestShipping, false);
    t.is(result.requestEmail, Constants.STRING_FULL === process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE);
    t.is(result.requestPhone, PaymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_UC_ENABLE_PHONE));
    t.is(result.showAcceptedNetworkIcons, PaymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_UC_ENABLE_NETWORK_ICONS));
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get update token bill-to details', async (t) => {
  try {
    const addressData = HelperConst.cart.billingAddress as any;
    const result = prepareFields.getUpdateTokenBillTo(addressData);
    t.is(result.firstName, 'john');
    t.is(result.lastName, 'doe');
    t.is(result.address1, '1295 Charleston Road');
    t.is(result.locality, 'Mountain View');
    t.is(result.administrativeArea, 'CA');
    t.is(result.postalCode, '94043');
    t.is(result.country, 'US');
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get risk information', async (t) => {
  try {
    const payment = HelperConst.payment as Payment;
    const result = await prepareFields.getRiskInformation(payment);
    t.is(result?.buyerHistory?.customerAccount?.creationHistory, 'EXISTING_ACCOUNT');
    t.is(result?.buyerHistory?.customerAccount?.createDate, '2025-03-12');
    t.is(result?.buyerHistory?.accountPurchases, 9);
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get buyer information', async (t) => {
  try {
    const paymentObj = HelperConst.payment as Payment;
    const result = prepareFields.getBuyerInformation(paymentObj);
    t.is(result.merchantCustomerID, paymentObj?.customer?.id);
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get promotion information', async (t) => {
  try {
    const cartObject = HelperConst.cart as any;
    const result = await prepareFields.getPromotionInformation(cartObject);
    if (result && result.code) {
      t.is(result.code, 'DISCOUNT_CODE');
    } else {
      t.fail('No promotion code found');
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get meta data', async (t) => {
  try {
    const payment = HelperConst.payment as Payment;
    const result = prepareFields.getMetaData(payment);
    t.deepEqual(result, [
      { key: '1', value: 'testValue1' },
      { key: '2', value: 'testValue2' }
    ]);
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});
