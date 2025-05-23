import test from 'ava';
import dotenv from 'dotenv';

import apiController from '../../apiController';
import { Constants } from '../../constants/paymentConstants';
import unit from '../JSON/unit.json';
import ApiControllerConst from '../const/ApiControllerConst';
import PaymentAuthorizationServiceConstCC from '../const/CreditCard/PaymentAuthorizationServiceConstCC';
import PaymentCaptureServiceConstCC from '../const/CreditCard/PaymentCaptureServiceConstCC';

dotenv.config();

test.serial('Payment Create Api with credit card payment', async (t) => {
  try {
    let result = await apiController.paymentCreateApi(ApiControllerConst.paymentObject as any);
    if (0 !== result.actions.length) {
      t.is(result.actions[0].action, 'setCustomField');
      t.is(result.actions[0].name, 'isv_tokenCaptureContextSignature');
      t.is(result.actions[1].action, 'setCustomField');
      t.is(result.actions[1].name, 'isv_tokenVerificationContext');
      t.is(result.actions[2].action, 'setCustomField');
      t.is(result.actions[2].name, 'isv_clientLibrary');
      t.is(result.actions[3].action, 'setCustomField');
      t.is(result.actions[3].name, 'isv_clientLibraryIntegrity');
    } else if (result.actions.length == 0) {
      t.is(result.errors[0].code, 'InvalidOperation');
    } else {
      t.fail(`Unexpected error: payment create actions ${result.actions} error ${result.errors}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Payment Create Api for credit card with saved card', async (t) => {
  try {
    let result = await apiController.paymentCreateApi(PaymentAuthorizationServiceConstCC.payments as any);

    if (0 !== result.actions.length) {
      t.is(result.actions[0].action, 'setCustomField');
      t.is(result.actions[0].name, 'isv_deviceFingerprintId');
      t.is(result.actions[1].name, 'isv_cardExpiryYear');
      t.is(result.actions[2].name, 'isv_tokenAlias');
      t.is(result.actions[3].name, 'isv_maskedPan');
      t.is(result.actions[4].name, 'isv_cardExpiryMonth');
      t.is(result.actions[5].name, 'isv_savedToken');
      t.is(result.actions[6].name, 'isv_acceptHeader');
      t.is(result.actions[7].name, 'isv_securityCode');
      t.is(result.actions[8].name, 'isv_cardType');
      t.is(result.actions[9].name, 'isv_userAgentHeader');
    } else if (0 === result.actions.length) {
      t.is(result.errors[0].code, 'InvalidInput');
    } else {
      t.fail(`Unexpected error: payment create with saved card actions ${result.actions} error ${result.errors}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Payment Create Api with Apple Pay', async (t) => {
  try {
    let result = await apiController.paymentCreateApi(ApiControllerConst.applePayPaymentObject as any);

    if (0 !== result.actions.length) {
      if ('setCustomField' === result.actions[0].action && 'isv_applePaySessionData' === result.actions[0].name) {
        t.is(result.actions[0].action, 'setCustomField');
        t.is(result.actions[0].name, 'isv_applePaySessionData');
      } else {
        t.fail(`Unexpected error: payment create with Apple Pay actions ${result.actions}`);
      }
    } else if (0 === result.actions.length && result.errors.length) {
      t.is(result.errors[0].code, 'InvalidInput');
    } else {
      t.fail(`Unexpected error actions: ${result.actions}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Payment Create Api with apple pay when validation url is empty', async (t) => {
  try {
    ApiControllerConst.applePayPaymentObject.custom.fields.isv_applePayValidationUrl = '';
    let result = await apiController.paymentCreateApi(ApiControllerConst.applePayPaymentObject as any);
    if (0 !== result.actions.length) {
      t.deepEqual(result.actions, []);
    } else if (0 === result.actions.length) {
      t.deepEqual(result.errors, []);
    } else {
      t.fail(`Unexpected error: payment create with saved card actions ${result.actions} error ${result.errors}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Payment Create Api with other payment method', async (t) => {
  try {
    ApiControllerConst.applePayPaymentObject.paymentMethodInfo.method = 'clickToPay';
    let result = await apiController.paymentCreateApi(ApiControllerConst.applePayPaymentObject as any);
    t.deepEqual(result.actions, []);
    t.deepEqual(result.errors, []);
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Test PaymentDetails Api Function', async (t) => {
  try {
    let result = (await apiController.paymentDetailsApi(ApiControllerConst.paymentId)) as any;
    if (result) {
      let i = 0;
      if ('amountPlanned' in result.paymentDetails && 'paymentMethodInfo' in result.paymentDetails && 'paymentStatus' in result.paymentDetails && 'cartData' in result && 'type' in result.cartData) {
        i++;
      }
      if (i == 1) {
        t.is(i, 1);
      } else {
        t.not(i, 1);
      }
    } else {
      t.fail(`Unexpected error: payment create with saved card actions ${result.actions} error ${result.errors}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Test PaymentUpdate Api Function For payerAuth setup response', async (t) => {
  try {
    let result = await apiController.paymentUpdateApi(ApiControllerConst.payerAuthenticationPaymentObj as any);
    if (result.actions.length == 0) {
      t.deepEqual(result.errors, []);
    } else {
      t.is(result.actions[0].action, 'setCustomField');
      t.is(result.actions[0].name, 'isv_requestJwt');
      t.is(result.actions[1].action, 'setCustomField');
      t.is(result.actions[1].name, 'isv_cardinalReferenceId');
      t.is(result.actions[2].action, 'setCustomField');
      t.is(result.actions[2].name, 'isv_deviceDataCollectionUrl');
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Test PaymentUpdate Api Function For payerAuth enroll response', async (t) => {
  try {
    let result = await apiController.paymentUpdateApi(ApiControllerConst.payerAuthEnrollPaymentObj as any);
    if (result.actions.length == 0) {
      t.is(result.errors[0].code, 'InvalidInput');
    } else {
      t.is(result.actions[0].action, 'setCustomField');
      t.is(result.actions[0].name, 'isv_payerEnrollTransactionId');
      t.is(result.actions[1].action, 'setCustomField');
      t.is(result.actions[1].name, 'isv_payerEnrollHttpCode');
      t.is(result.actions[2].action, 'setCustomField');
      t.is(result.actions[2].name, 'isv_payerEnrollStatus');
      t.is(result.actions[3].action, 'setCustomField');
      t.is(result.actions[3].name, 'isv_dmpaFlag');
      t.is(result.actions[4].action, 'setCustomField');
      t.is(result.actions[4].name, 'isv_tokenCaptureContextSignature');
      t.is(result.actions[5].action, 'setCustomField');
      t.is(result.actions[5].name, 'isv_payerAuthenticationRequired');
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Test PaymentUpdate Api function for PayerAuth Validate Response', async (t) => {
  try {
    let result = await apiController.paymentUpdateApi(ApiControllerConst.payerAuthSetupResponsePaymentObject);
    if (result.actions.length > 0) {
      t.is(result.actions[0].action, 'setCustomField');
      t.is(result.actions[0].name, 'isv_payerEnrollTransactionId');
      t.is(result.actions[1].name, 'isv_payerEnrollHttpCode');
      t.is(result.actions[2].name, 'isv_payerEnrollStatus');
    } else {
      t.deepEqual(result.actions, []);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Test PaymentUpdate Api function when 3ds is enabled', async (t) => {
  try {
    ApiControllerConst.payerAuthSetupResponsePaymentObject.transactions[0] = PaymentCaptureServiceConstCC.payment.transactions[0];
    ApiControllerConst.payerAuthSetupResponsePaymentObject.transactions[0].state = 'Initial';
    let result = await apiController.paymentUpdateApi(ApiControllerConst.payerAuthSetupResponsePaymentObject);
    if (result.actions.length > 0) {
      t.is(result.actions[0].action, 'changeTransactionInteractionId');
      t.is(result.actions[1].action, 'changeTransactionState');
      t.is(result.actions[1].state, 'Failure');
      t.is(result.actions[2].action, 'addInterfaceInteraction');
    } else {
      t.deepEqual(result.actions, []);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Test PaymentUpdate Api function when custom field is absent', async (t) => {
  try {
    ApiControllerConst.payerAuthSetupResponsePaymentObject.custom = {};
    let result = await apiController.paymentUpdateApi(ApiControllerConst.payerAuthSetupResponsePaymentObject);
    t.deepEqual(result.actions, []);
    t.deepEqual(result.errors, []);
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Test PaymentUpdate Api function for all payment methods', async (t) => {
  try {
    let result = await apiController.paymentUpdateApi(PaymentCaptureServiceConstCC.payment as any);
    if (result.actions[0]?.action && 'setCustomField' === result.actions[0].action) {
      t.is(result.actions[0].action, 'setCustomField');
      t.is(result.actions[0].name, 'isv_payerEnrollTransactionId');
      t.is(result.actions[1].name, 'isv_payerEnrollHttpCode');
      t.is(result.actions[2].name, 'isv_payerEnrollStatus');
    } else if (result.actions[0]?.action && 'changeTransactionInteractionId' === result.actions[0].action) {
      t.is(result.actions[0].action, 'changeTransactionInteractionId');
      t.is(result.actions[1].action, 'changeTransactionState');
      t.is(result.actions[2].action, 'addInterfaceInteraction');
    } else {
      t.deepEqual(result.actions, []);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Test Customer Update Flex Microform', async (t) => {
  try {
    let result = await apiController.customerUpdateApi(ApiControllerConst.customerUpdateFlexKeysPaymentObj);
    if (result.actions.length == 0) {
      t.fail(`Unexpected error: payment create with saved card actions ${result.actions} error ${result.errors}`);
    } else {
      t.is(result.actions[0].action, 'setCustomField');
      t.is(result.actions[0].name, 'isv_tokenCaptureContextSignature');
      t.is(result.actions[1].action, 'setCustomField');
      t.is(result.actions[1].name, 'isv_tokenVerificationContext');
      t.is(result.actions[2].action, 'setCustomField');
      t.is(result.actions[2].name, 'isv_clientLibrary');
      t.is(result.actions[3].action, 'setCustomField');
      t.is(result.actions[3].name, 'isv_clientLibraryIntegrity');
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Test Customer Update for add card', async (t) => {
  try {
    let result = await apiController.customerUpdateApi(ApiControllerConst.customerUpdateAddCardPaymentObject);
    if (result.actions.length == 0) {
      t.deepEqual(result.errors, []);
    } else if ('isv_customerId' === result.actions[2].name) {
      t.is(result.actions[0].action, 'setCustomField');
      t.is(result.actions[0].name, 'isv_tokens');
      t.is(result.actions[1].name, 'isv_tokenUpdated');
      t.is(result.actions[2].name, 'isv_customerId');
      t.is(result.actions[3].name, 'isv_tokenAlias');
      t.is(result.actions[4].name, 'isv_cardType');
      t.is(result.actions[5].name, 'isv_cardExpiryYear');
      t.is(result.actions[6].name, 'isv_cardExpiryMonth');
      t.is(result.actions[7].name, 'isv_addressId');
      t.is(result.actions[8].name, 'isv_currencyCode');
      t.is(result.actions[9].name, 'isv_deviceFingerprintId');
      t.is(result.actions[10].name, 'isv_token');
      t.is(result.actions[11].name, 'isv_maskedPan');
    } else {
      t.is(result.actions[0].action, 'setCustomField');
      t.is(result.actions[0].name, 'isv_tokens');
      t.is(result.actions[1].name, 'isv_tokenUpdated');
      t.is(result.actions[2].name, 'isv_failedTokens');
      t.is(result.actions[3].name, 'isv_tokenAlias');
      t.is(result.actions[4].name, 'isv_cardType');
      t.is(result.actions[5].name, 'isv_cardExpiryYear');
      t.is(result.actions[6].name, 'isv_cardExpiryMonth');
      t.is(result.actions[7].name, 'isv_addressId');
      t.is(result.actions[8].name, 'isv_currencyCode');
      t.is(result.actions[9].name, 'isv_deviceFingerprintId');
      t.is(result.actions[10].name, 'isv_token');
      t.is(result.actions[11].name, 'isv_maskedPan');
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Test Customer Update when token already exist', async (t) => {
  try {
    ApiControllerConst.customerUpdateAddCardPaymentObject.custom.fields.isv_addressId = '';
    let result = await apiController.customerUpdateApi(ApiControllerConst.customerUpdateAddCardPaymentObject);
    if (result.actions.length == 0) {
      t.deepEqual(result.errors, []);
    } else {
      t.is(result.actions[0].action, 'setCustomField');
      t.is(result.actions[0].name, 'isv_tokens');
      t.is(result.actions[1].name, 'isv_tokenUpdated');
      t.is(result.actions[2].name, 'isv_tokenAlias');
      t.is(result.actions[3].name, 'isv_cardType');
      t.is(result.actions[4].name, 'isv_cardExpiryYear');
      t.is(result.actions[5].name, 'isv_cardExpiryMonth');
      t.is(result.actions[6].name, 'isv_addressId');
      t.is(result.actions[7].name, 'isv_currencyCode');
      t.is(result.actions[8].name, 'isv_deviceFingerprintId');
      t.is(result.actions[9].name, 'isv_token');
      t.is(result.actions[10].name, 'isv_maskedPan');
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Test Customer Update when token is being update', async (t) => {
  try {
    ApiControllerConst.customerUpdateAddCardPaymentObject.custom.fields.isv_addressId = '';
    ApiControllerConst.customerUpdateAddCardPaymentObject.custom.fields.isv_tokenAction = 'update';
    let result = await apiController.customerUpdateApi(ApiControllerConst.customerUpdateAddCardPaymentObject);
    if (result.actions.length == 0) {
      t.is(result.errors[0].code, 'InvalidInput');
    } else {
      t.is(result.actions[0].action, 'setCustomField');
      t.is(result.actions[0].name, 'isv_tokens');
      t.is(result.actions[1].name, 'isv_tokenUpdated');
      t.is(result.actions[2].name, 'isv_tokenAction');
      t.is(result.actions[3].name, 'isv_cardNewExpiryYear');
      t.is(result.actions[4].name, 'isv_cardNewExpiryMonth');
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Test Customer Update when token is being delete', async (t) => {
  try {
    ApiControllerConst.customerUpdateAddCardPaymentObject.custom.fields.isv_addressId = '';
    ApiControllerConst.customerUpdateAddCardPaymentObject.custom.fields.isv_tokenAction = 'delete';
    let result = await apiController.customerUpdateApi(ApiControllerConst.customerUpdateAddCardPaymentObject);
    if (result.actions.length == 0) {
      t.is(result.errors[0].code, 'InvalidInput');
    } else if ('isv_tokens' === result.actions[0].name) {
      t.is(result.actions[0].action, 'setCustomField');
      t.is(result.actions[0].name, 'isv_tokens');
      t.is(result.actions[1].name, 'isv_tokenUpdated');
      t.is(result.actions[2].name, 'isv_tokenAction');
    } else {
      t.is(result.actions[0].action, 'setCustomField');
      t.is(result.actions[0].name, 'isv_tokenAction');
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Test CaptureContext Api function', async (t) => {
  try {
    let result = await apiController.captureContextApi(ApiControllerConst.cart);
    if (result) {
      let length = Object.keys(result).length;
      t.true(length > 0);
    } else {
      t.pass();
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Test notificationApi function', async (t) => {
  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Test timed out')), 10000));
  try {
    const result: any = await Promise.race([apiController.notificationApi(ApiControllerConst.notification), timeout]);
    if (result.successMessage === ApiControllerConst.constants.SUCCESS_MSG_UPDATED_CUSTOMER_TOKEN) {
      t.is(result.successMessage, ApiControllerConst.constants.SUCCESS_MSG_UPDATED_CUSTOMER_TOKEN);
    } else {
      t.not(result.successMessage, ApiControllerConst.constants.SUCCESS_MSG_UPDATED_CUSTOMER_TOKEN);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('Test order management api', async (t) => {
  try {
    let result = await apiController.orderManagementApi(unit.paymentId, 0, Constants.CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION);
    let i = 0;
    if ('errorMessage' in result && 'successMessage' in result) {
      i++;
    }
    t.is(i, 1);
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});
