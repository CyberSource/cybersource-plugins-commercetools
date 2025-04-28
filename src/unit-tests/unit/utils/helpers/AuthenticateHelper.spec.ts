import test from 'ava';
import dotenv from 'dotenv';

import AuthenticationHelper from '../../../../utils/helpers/AuthenticationHelper';
import ApiControllerConst from '../../../const/ApiControllerConst';
import PaymentUtilsConst from '../../../const/PaymentUtilsConst';

dotenv.config();

test.serial('Get InterationID with Invalid Signature', async (t) => {
  try {
    const result = await AuthenticationHelper.authenticateNetToken(PaymentUtilsConst.invalidSignature, ApiControllerConst.notification);
    if (false === result) {
      t.is(result, false);
    } else {
      t.fail(`Unexpected result ${result}`);
    }
  } catch (exception) {
    if (exception instanceof Error) {
      t.fail(`Caught an error during execution: ${exception.message}`);
      t.log(`Stack trace: ${exception.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(exception)}`);
    }
  }
});

test.serial('Test Encryption', async (t) => {
  try {
    const result = AuthenticationHelper.encryption(PaymentUtilsConst.decodedValue);
    if (PaymentUtilsConst.headerValue != result) {
      t.not(result, PaymentUtilsConst.headerValue);
    } else {
      t.fail(`Unexpected result ${result}`);
    }
  } catch (exception) {
    if (exception instanceof Error) {
      t.fail(`Caught an error during execution: ${exception.message}`);
      t.log(`Stack trace: ${exception.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(exception)}`);
    }
  }
});

test.serial('Test Decryption', async (t) => {
  try {
    const result = AuthenticationHelper.decryption(PaymentUtilsConst.headerValue);
    if (PaymentUtilsConst.decodedValue != result) {
      t.not(result, PaymentUtilsConst.decodedValue);
    } else {
      t.fail(`Unexpected result ${result}`);
    }
  } catch (exception) {
    if (exception instanceof Error) {
      t.fail(`Caught an error during execution: ${exception.message}`);
      t.log(`Stack trace: ${exception.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(exception)}`);
    }
  }
});

test.serial('Test Rate Limit Endpoint Access', async (t) => {
  try {
    const result = AuthenticationHelper.rateLimitEndpointAccess();
    if (!result) {
      t.is(result, false);
    } else {
      t.fail(`Unexpected result ${result}`);
    }
  } catch (exception) {
    if (exception instanceof Error) {
      t.fail(`Caught an error during execution: ${exception.message}`);
      t.log(`Stack trace: ${exception.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(exception)}`);
    }
  }
});

test.serial('Test Rate Limit Endpoint Access with maximum limit reached', async (t) => {
  let result;
  try {
    for (let i = 0; i < 10; i++) {
      result = AuthenticationHelper.rateLimitEndpointAccess();
    }
    if (result) {
      t.is(result, true);
    } else {
      t.fail(`Unexpected result ${result}`);
    }
  } catch (exception) {
    if (exception instanceof Error) {
      t.fail(`Caught an error during execution: ${exception.message}`);
      t.log(`Stack trace: ${exception.stack}`);
    } else {
      t.fail(`Caught an unknown error: ${String(exception)}`);
    }
  }
});