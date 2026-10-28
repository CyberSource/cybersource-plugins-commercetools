import fs from 'fs';
import os from 'os';
import path from 'path';

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


test.serial('Get config object for follow-on services uses JWT SHARED_SECRET', async (t) => {
  try {
    const originalUseMle = process.env.PAYMENT_GATEWAY_USE_MLE;
    process.env.PAYMENT_GATEWAY_USE_MLE = 'false';

    const result = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_REFUND_DATA, null, HelperConst.payment as Payment, null);
    t.is(result?.authenticationType, Constants.JWT_AUTHENTICATION);
    t.is(result?.jwtKeyType, Constants.PAYMENT_GATEWAY_JWT_KEY_TYPE);
    t.is(result?.merchantKeyId, process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID);
    t.is(result?.merchantsecretKey, process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY);

    process.env.PAYMENT_GATEWAY_USE_MLE = originalUseMle;
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

test.serial('Get config object applies Request MLE to capture context for JWT SHARED_SECRET', async (t) => {
  try {
    const originalUseMle = process.env.PAYMENT_GATEWAY_USE_MLE;
    const originalRequestMlePath = process.env.PAYMENT_GATEWAY_REQUEST_MLE_PUBLIC_CERT_PATH;
    const tempRequestMleCertPath = path.join(os.tmpdir(), 'request-mle-public-cert-capture-context.pem');
    fs.writeFileSync(tempRequestMleCertPath, 'request mle cert for capture context test');

    process.env.PAYMENT_GATEWAY_USE_MLE = 'true';
    process.env.PAYMENT_GATEWAY_REQUEST_MLE_PUBLIC_CERT_PATH = tempRequestMleCertPath;

    const result = await prepareFields.getConfigObject(FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT, null, null, process.env.PAYMENT_GATEWAY_MERCHANT_ID || null);
    t.is(result?.authenticationType, Constants.JWT_AUTHENTICATION);
    t.is(result?.jwtKeyType, Constants.PAYMENT_GATEWAY_JWT_KEY_TYPE);
    t.is(result?.enableRequestMLEForOptionalApisGlobally, true);
    t.is(result?.mleForRequestPublicCertPath, tempRequestMleCertPath);

    process.env.PAYMENT_GATEWAY_USE_MLE = originalUseMle;
    process.env.PAYMENT_GATEWAY_REQUEST_MLE_PUBLIC_CERT_PATH = originalRequestMlePath;
    if (fs.existsSync(tempRequestMleCertPath)) {
      fs.unlinkSync(tempRequestMleCertPath);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get config object applies Request MLE to follow-on services for JWT SHARED_SECRET', async (t) => {
  try {
    const originalUseMle = process.env.PAYMENT_GATEWAY_USE_MLE;
    const originalRequestMlePath = process.env.PAYMENT_GATEWAY_REQUEST_MLE_PUBLIC_CERT_PATH;
    const tempRequestMleCertPath = path.join(os.tmpdir(), 'request-mle-public-cert-follow-on.pem');
    fs.writeFileSync(tempRequestMleCertPath, 'request mle cert for follow-on test');

    process.env.PAYMENT_GATEWAY_USE_MLE = 'true';
    process.env.PAYMENT_GATEWAY_REQUEST_MLE_PUBLIC_CERT_PATH = tempRequestMleCertPath;

    const result = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_CAPTURE_RESPONSE, null, HelperConst.payment as Payment, null);
    t.is(result?.authenticationType, Constants.JWT_AUTHENTICATION);
    t.is(result?.jwtKeyType, Constants.PAYMENT_GATEWAY_JWT_KEY_TYPE);
    t.is(result?.enableRequestMLEForOptionalApisGlobally, true);
    t.is(result?.mleForRequestPublicCertPath, tempRequestMleCertPath);

    process.env.PAYMENT_GATEWAY_USE_MLE = originalUseMle;
    process.env.PAYMENT_GATEWAY_REQUEST_MLE_PUBLIC_CERT_PATH = originalRequestMlePath;
    if (fs.existsSync(tempRequestMleCertPath)) {
      fs.unlinkSync(tempRequestMleCertPath);
    }
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
      t.false(Object.prototype.hasOwnProperty.call(result.card, 'typeSelectionIndicator'));
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
    //t.is(result.applicationName, Constants.PAYMENT_GATEWAY_APPLICATION_NAME);
    //t.is(result.applicationVersion, Constants.PAYMENT_GATEWAY_APPLICATION_VERSION);
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

test.serial('Get Unified Checkout MOTO setting from custom fields only', (t) => {
  t.true(prepareFields.getEnableMoto({ [Constants.ISV_ENABLED_MOTO]: true }));
  t.false(prepareFields.getEnableMoto({ [Constants.ISV_ENABLED_MOTO]: false }));
  t.false(prepareFields.getEnableMoto());
});

test.serial('Get allowed payment methods', async (t) => {
  try {
    const customFields = {
      isv_ucAllowedPaymentTypes: 'TMS_TOKEN,PANENTRY',
    };
    const result = prepareFields.getAllowedPaymentMethods(undefined, customFields as any);
    t.deepEqual(result, ['TMS_TOKEN', 'PANENTRY']);
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
    const customFields = {
      [Constants.ISV_UC_ALLOWED_PAYMENT_TYPES]: 'TMS_TOKEN,PANENTRY',
      [Constants.ISV_UC_BILLING_TYPE]: 'FULL',
    };
    const result = prepareFields.getCaptureMandate('Payments', customFields as any);
    t.is(result.billingType, 'FULL');
    t.is(result.showAcceptedNetworkIcons, PaymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_UC_ENABLE_NETWORK_ICONS));
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Get capture mandate for MyAccounts service', async (t) => {
  try {
    const customFields = {
      [Constants.ISV_UC_ALLOWED_PAYMENT_TYPES]: 'TMS_TOKEN,PANENTRY',
      [Constants.ISV_UC_BILLING_TYPE]: 'FULL',
    };
    const result = prepareFields.getCaptureMandate('MyAccounts', customFields as any);
    t.is(result.billingType, 'FULL');
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

test.serial('Response MLE disabled: config does not include Response MLE fields', async (t) => {
  try {
    const originalResponseMleEnabled = process.env.PAYMENT_GATEWAY_RESPONSE_MLE_ENABLED;
    const originalUseMle = process.env.PAYMENT_GATEWAY_USE_MLE;
    process.env.PAYMENT_GATEWAY_RESPONSE_MLE_ENABLED = 'false';
    process.env.PAYMENT_GATEWAY_USE_MLE = 'true';

    const result = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_REFUND_DATA, null, HelperConst.payment as Payment, null);

    // Verify Response MLE fields are not present
    t.false(result?.enableResponseMleGlobally);
    t.is(result?.responseMlePrivateKeyFilePath, undefined);
    t.is(result?.responseMlePrivateKeyFilePassword, undefined);

    // Verify core authentication remains unchanged
    t.is(result?.authenticationType, Constants.JWT_AUTHENTICATION);
    t.is(result?.jwtKeyType, Constants.PAYMENT_GATEWAY_JWT_KEY_TYPE);
    t.is(result?.merchantKeyId, process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID);
    t.is(result?.merchantsecretKey, process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY);

    process.env.PAYMENT_GATEWAY_RESPONSE_MLE_ENABLED = originalResponseMleEnabled;
    process.env.PAYMENT_GATEWAY_USE_MLE = originalUseMle;
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Response MLE enabled with dedicated P12 configuration: config includes Response MLE fields', async (t) => {
  try {
    const originalResponseMleEnabled = process.env.PAYMENT_GATEWAY_RESPONSE_MLE_ENABLED;
    const originalUseMle = process.env.PAYMENT_GATEWAY_USE_MLE;
    const originalResponseMleFile = process.env.PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_FILE;
    const originalResponseMlePassword = process.env.PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_PASSWORD;

    // Create a temporary P12 file for testing
    const tempP12Path = path.join(__dirname, '../../certificates/test-response-mle.p12');
    const tempP12Dir = path.dirname(tempP12Path);
    if (!fs.existsSync(tempP12Dir)) {
      fs.mkdirSync(tempP12Dir, { recursive: true });
    }
    fs.writeFileSync(tempP12Path, Buffer.from([0x30, 0x00])); // Minimal binary content

    process.env.PAYMENT_GATEWAY_RESPONSE_MLE_ENABLED = 'true';
    process.env.PAYMENT_GATEWAY_USE_MLE = 'true';
    // Use dedicated Response MLE configuration variables
    process.env.PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_FILE = 'test-response-mle';
    process.env.PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_PASSWORD = 'test-response-password';

    const result = await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_REFUND_DATA, null, HelperConst.payment as Payment, null);

    // Verify Response MLE is enabled with dedicated configuration
    t.is(result?.enableResponseMleGlobally, true);
    t.truthy(result?.responseMlePrivateKeyFilePath);
    t.is(result?.responseMlePrivateKeyFilePassword, 'test-response-password');

    // Verify core authentication remains unchanged
    t.is(result?.authenticationType, Constants.JWT_AUTHENTICATION);
    t.is(result?.jwtKeyType, Constants.PAYMENT_GATEWAY_JWT_KEY_TYPE);

    // Cleanup
    process.env.PAYMENT_GATEWAY_RESPONSE_MLE_ENABLED = originalResponseMleEnabled;
    process.env.PAYMENT_GATEWAY_USE_MLE = originalUseMle;
    process.env.PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_FILE = originalResponseMleFile;
    process.env.PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_PASSWORD = originalResponseMlePassword;
    if (fs.existsSync(tempP12Path)) {
      fs.unlinkSync(tempP12Path);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Response MLE enabled without private key file: throws validation error', async (t) => {
  try {
    const originalResponseMleEnabled = process.env.PAYMENT_GATEWAY_RESPONSE_MLE_ENABLED;
    const originalUseMle = process.env.PAYMENT_GATEWAY_USE_MLE;
    const originalResponseMleFile = process.env.PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_FILE;
    const originalResponseMlePassword = process.env.PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_PASSWORD;

    process.env.PAYMENT_GATEWAY_RESPONSE_MLE_ENABLED = 'true';
    process.env.PAYMENT_GATEWAY_USE_MLE = 'true';
    // Clear the dedicated Response MLE private key file
    process.env.PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_FILE = '';
    process.env.PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_PASSWORD = 'test-password';

    try {
      await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_REFUND_DATA, null, HelperConst.payment as Payment, null);
      t.fail('Expected an error for missing Response MLE private key file');
    } catch (error: any) {
      t.true(error?.message.includes('PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_FILE'), `Expected error about missing private key file, got: ${error?.message}`);
    }

    process.env.PAYMENT_GATEWAY_RESPONSE_MLE_ENABLED = originalResponseMleEnabled;
    process.env.PAYMENT_GATEWAY_USE_MLE = originalUseMle;
    process.env.PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_FILE = originalResponseMleFile;
    process.env.PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_PASSWORD = originalResponseMlePassword;
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Response MLE enabled without private key password: throws validation error', async (t) => {
  try {
    const originalResponseMleEnabled = process.env.PAYMENT_GATEWAY_RESPONSE_MLE_ENABLED;
    const originalUseMle = process.env.PAYMENT_GATEWAY_USE_MLE;
    const originalResponseMleFile = process.env.PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_FILE;
    const originalResponseMlePassword = process.env.PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_PASSWORD;

    process.env.PAYMENT_GATEWAY_RESPONSE_MLE_ENABLED = 'true';
    process.env.PAYMENT_GATEWAY_USE_MLE = 'true';
    // Set private key file but clear password
    process.env.PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_FILE = 'test-cert';
    process.env.PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_PASSWORD = '';

    try {
      await prepareFields.getConfigObject(FunctionConstant.FUNC_GET_REFUND_DATA, null, HelperConst.payment as Payment, null);
      t.fail('Expected an error for missing Response MLE private key password');
    } catch (error: any) {
      t.true(error?.message.includes('PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_PASSWORD'), `Expected error about missing password, got: ${error?.message}`);
    }

    process.env.PAYMENT_GATEWAY_RESPONSE_MLE_ENABLED = originalResponseMleEnabled;
    process.env.PAYMENT_GATEWAY_USE_MLE = originalUseMle;
    process.env.PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_FILE = originalResponseMleFile;
    process.env.PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_PASSWORD = originalResponseMlePassword;
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});
