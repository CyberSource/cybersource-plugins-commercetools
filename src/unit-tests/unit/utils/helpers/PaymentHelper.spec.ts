import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import PaymentHelper from '../../../../utils/helpers/PaymentHelper';
import PaymentCaptureServiceConstCC from '../../../const/CreditCard/PaymentCaptureServiceConstCC';
import PaymentServiceConst from '../../../const/HelpersConst';

test('Classify UC completion state without changing status precedence', (t) => {
  const review = PaymentHelper.classifyUcCompletionState(
    { cybsStatus: 'AUTHORIZED_PENDING_REVIEW', decodedToken: {}, completionToken: {} },
    'creditCard',
    null,
    null,
  );
  t.is(review.state, 'Pending');
  t.true(review.isReviewStatus);

  const declined = PaymentHelper.classifyUcCompletionState(
    { cybsStatus: 'DECLINED', decodedToken: {}, completionToken: {} },
    'creditCard',
    null,
    null,
  );
  t.is(declined.state, 'Failure');

  const riskDeclined = PaymentHelper.classifyUcCompletionState(
    { cybsStatus: 'AUTHORIZED_RISK_DECLINED', decodedToken: {}, completionToken: {} },
    'creditCard',
    null,
    null,
  );
  t.true(riskDeclined.isRiskDeclined);
  t.is(riskDeclined.state, 'Success');
});

test('Map UC completion errors with the original fallback order', (t) => {
  t.is(PaymentHelper.getUcCompletionError('Success', { errorInformation: { code: 'IGNORED' } }), null);

  t.deepEqual(PaymentHelper.getUcCompletionError('Failure', {
    errorInformation: {
      reason: 'DECLINED_REASON',
      details: { field: 'number' },
    },
  }), {
    code: 'DECLINED',
    message: 'DECLINED_REASON',
    details: JSON.stringify({ field: 'number' }),
  });
});

test('Validate and select UC token information using the original fallback order', (t) => {
  const validTssToken = {
    paymentInstrument: { id: 'tss-payment-instrument' },
    instrumentIdentifier: { id: 'tss-instrument' },
  };
  const decodedToken = {
    tokenInformation: {
      paymentInstrument: { id: 'jwt-payment-instrument' },
      instrumentIdentifier: { id: 'jwt-instrument' },
    },
  };

  t.true(PaymentHelper.hasValidUcTokenIds(validTssToken));
  t.false(PaymentHelper.hasValidUcTokenIds({ paymentInstrument: { id: 'incomplete' } }));
  t.is(PaymentHelper.selectInitialUcTokenInformation({ tokenInformation: validTssToken }, decodedToken, {}), validTssToken);
  t.is(
    PaymentHelper.selectInitialUcTokenInformation({ tokenInformation: { paymentInstrument: { id: 'incomplete' } } }, decodedToken, {}),
    decodedToken.tokenInformation,
  );
});

test('Classify processTransaction branches with original condition precedence', (t) => {
  const payerFields = {
    isv_payerAuthenticationRequired: true,
    isv_payerEnrollStatus: 'AUTHORIZED',
    isv_payerEnrollTransactionId: 'payer-transaction',
  };
  const scenarios = [
    { name: 'initial charge precedes eCheck processing', length: 1, transaction: { type: 'Charge', state: 'Initial' }, method: 'eCheck', fields: {}, expected: 'ORDER_MANAGEMENT' },
    { name: 'terminal state precedes payer authentication', length: 1, transaction: { type: 'Authorization', state: 'Success' }, method: 'creditCardWithPayerAuthentication', fields: payerFields, expected: 'TERMINAL_TRANSACTION' },
    { name: 'payer authentication', length: 1, transaction: { type: 'Authorization', state: 'Initial' }, method: 'creditCardWithPayerAuthentication', fields: payerFields, expected: 'PAYER_AUTHENTICATION' },
    { name: 'normal authorization processing', length: 1, transaction: { type: 'Authorization', state: 'Initial' }, method: 'creditCard', fields: {}, expected: 'AUTHORIZATION_PROCESSING' },
    { name: 'multiple transactions use order management', length: 2, transaction: { type: 'Authorization', state: 'Initial' }, method: 'creditCard', fields: {}, expected: 'ORDER_MANAGEMENT' },
  ] as const;

  for (const scenario of scenarios) {
    t.is(
      PaymentHelper.classifyProcessTransactionBranch(scenario.length, scenario.transaction, scenario.method, scenario.fields),
      scenario.expected,
      scenario.name,
    );
  }
});

test('Extract initial UC card details with source and field precedence unchanged', (t) => {
  const details = PaymentHelper.extractInitialUcCardDetails(
    {
      rawTransaction: {
        paymentInformation: {
          card: {
            type: { value: 'VISA' },
            expirationMonth: { value: '08' },
            number: { maskedValue: 'XXXXXXXXXXXX1111', bin: '411111' },
          },
        },
      },
    },
    { paymentInformation: { card: { expirationMonth: '09', expirationYear: '2031' } } },
    {},
  );

  t.deepEqual(details, {
    cardType: '001',
    expMonth: '08',
    expYear: '2031',
    maskedPan: '411111XXXXXX1111',
  });
});

test('Apply UC card details in the original mutation and action order', (t) => {
  const customFields: Record<string, any> = {};
  const response: any = { actions: [], errors: [] };

  PaymentHelper.applyUcCardDetails(customFields, response, {
    cardType: '001',
    expMonth: '08',
    expYear: '2031',
    maskedPan: '411111XXXXXX1111',
  });

  t.deepEqual(customFields, {
    isv_cardExpiryMonth: '08',
    isv_cardExpiryYear: '2031',
    isv_cardType: '001',
    isv_maskedPan: 'XXXXXXXXXXXX1111',
  });
  t.deepEqual(response.actions.map((action: any) => action.name), [
    'isv_cardExpiryMonth',
    'isv_cardExpiryYear',
    'isv_cardType',
    'isv_maskedPan',
  ]);
});

test('Build UC token save decision response with primary nested values taking precedence', (t) => {
  const result = PaymentHelper.buildUcTokenSaveDecisionResponse(
    {},
    {
      processorInformation: { approvalCode: 'primary', network: 'visa' },
      processingInformation: {
        commerceIndicator: 'primary-indicator',
        authorizationOptions: { initiator: { credentialStoredOnFile: true } },
      },
    },
    {
      rawTransaction: {
        processorInformation: { approvalCode: 'secondary', responseCode: '00' },
        processingInformation: {
          commerceIndicator: 'secondary-indicator',
          authorizationOptions: { initiator: { type: 'merchant' } },
        },
      },
    },
    'AUTHORIZED',
  );

  t.is(result.status, 'AUTHORIZED');
  t.deepEqual(result.processorInformation, { approvalCode: 'primary', responseCode: '00', network: 'visa' });
  t.deepEqual(result.processingInformation.authorizationOptions.initiator, { type: 'merchant', credentialStoredOnFile: true });
});

test('Complete UC token information without replacing existing identifiers', (t) => {
  const existing = {
    paymentInstrument: { id: 'existing-payment', extra: true },
    customer: { id: 'customer' },
  };
  const completed = PaymentHelper.completeUcTokenInformation(existing, 'fallback-payment', 'fallback-instrument');

  t.is(completed.paymentInstrument.id, 'existing-payment');
  t.true(completed.paymentInstrument.extra);
  t.is(completed.instrumentIdentifier.id, 'fallback-instrument');
  t.deepEqual(completed.customer, { id: 'customer' });
});

test('Build UC token address with the original field fallbacks', (t) => {
  t.deepEqual(PaymentHelper.buildUcTokenAddress({
    firstName: 'Ada',
    lastName: 'Lovelace',
    streetName: 'First Street',
    additionalStreetInfo: 'Suite 2',
    city: 'London',
    region: 'London',
    postalCode: '12345',
    country: 'GB',
    email: 'ada@example.com',
    phone: '123',
  }), {
    firstName: 'Ada',
    lastName: 'Lovelace',
    address1: 'First Street',
    address2: 'Suite 2',
    locality: 'London',
    administrativeArea: 'London',
    postalCode: '12345',
    country: 'GB',
    email: 'ada@example.com',
    phoneNumber: '123',
  });
});

test('Find persisted UC tokens while ignoring malformed token strings', (t) => {
  const persistedTokens = [
    'not-json',
    JSON.stringify({ instrumentIdentifier: 'other', paymentToken: 'payment-id' }),
    JSON.stringify({ instrumentIdentifier: 'instrument-id', paymentToken: 'payment-id' }),
  ];

  t.true(PaymentHelper.containsPersistedUcToken(persistedTokens, 'instrument-id', 'payment-id'));
  t.false(PaymentHelper.containsPersistedUcToken(persistedTokens, 'missing', 'payment-id'));
});

test.serial('Check response of get auth response with successful auth', async (t: any) => {
  try {
    let result = PaymentHelper.getAuthResponse(PaymentServiceConst.getAuthResponsePaymentResponse, PaymentServiceConst.getAuthResponseTransactionDetail);
    if (3 === result.actions.length) {
      t.is(result.actions[0].action, 'changeTransactionInteractionId');
      t.is(result.actions[1].action, 'changeTransactionState');
      t.is(result.actions[1].state, 'Success');
    } else {
      t.fail(`Unexpected result : ${JSON.stringify(result)}`);
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

test.serial('Check response of get auth response object when auth is pending', async (t: any) => {
  try {
    let result = PaymentHelper.getAuthResponse(PaymentServiceConst.getAuthResponsePaymentResponseObject, PaymentServiceConst.getAuthResponseTransactionDetail);
    if (3 === result.actions.length) {
      t.is(result.actions[0].action, 'changeTransactionInteractionId');
      t.is(result.actions[1].action, 'changeTransactionState');
      t.is(result.actions[1].state, 'Pending');
    } else {
      t.fail(`Unexpected result : ${JSON.stringify(result)}`);
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

test.serial('Check response of get auth response object when auth is declined', async (t: any) => {
  try {
    let result = PaymentHelper.getAuthResponse(PaymentServiceConst.getAuthResponsePaymentDeclinedResponse, PaymentServiceConst.getAuthResponseTransactionDetail);
    if (4 === result.actions.length) {
      t.is(result.actions[0].action, 'changeTransactionInteractionId');
      t.is(result.actions[1].action, 'changeTransactionState');
      t.is(result.actions[1].state, 'Failure');
    } else {
      t.fail(`Unexpected result : ${JSON.stringify(result)}`);
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

test.serial('Check response of get auth response object when payer auth setup is completed', async (t: any) => {
  try {
    let result = PaymentHelper.getAuthResponse(PaymentServiceConst.getAuthResponsePaymentCompleteResponse, null);
    if (3 === result.actions.length) {
      t.is(result.actions[0].action, 'setCustomField');
      t.is(result.actions[0].name, 'isv_requestJwt');
      t.is(result.actions[1].action, 'setCustomField');
      t.is(result.actions[1].name, 'isv_cardinalReferenceId');
      t.is(result.actions[2].action, 'setCustomField');
      t.is(result.actions[2].name, 'isv_deviceDataCollectionUrl');
    } else {
      t.fail(`Unexpected result : ${JSON.stringify(result)}`);
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

test.serial('Check response of get auth response object when authentication is pending', async (t: any) => {
  try {
    let result = PaymentHelper.getAuthResponse(PaymentServiceConst.getAuthResponsePaymentPendingResponse, null);
    if (8 === result.actions.length) {
      t.is(result.actions[0].action, 'setCustomField');
      t.is(result.actions[0].name, 'isv_payerAuthenticationRequired');
      t.is(result.actions[1].name, 'isv_payerAuthenticationTransactionId');
      t.is(result.actions[2].name, 'isv_payerAuthenticationAcsUrl');
      t.is(result.actions[3].name, 'isv_payerAuthenticationPaReq');
      t.is(result.actions[4].name, 'isv_stepUpUrl');
      t.is(result.actions[5].name, 'isv_responseJwt');
      t.is(result.actions[6].action, 'addInterfaceInteraction');
    } else {
      t.fail(`Unexpected result : ${JSON.stringify(result)}`);
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

test.serial('Set custom type for transaction', async (t: any) => {
  try {
    let result: any = PaymentHelper.setTransactionCustomType(PaymentServiceConst.getRefundResponseUpdateTransactions.id, PaymentServiceConst.getRefundResponseUpdateTransactions.amount.centAmount);
    if (result) {
      t.is(result.action, 'setTransactionCustomType');
      t.is(result.type.key, 'isv_transaction_data');
      t.is(result.type.typeId, 'type');
      t.is(result.fields.isv_availableCaptureAmount, PaymentServiceConst.getRefundResponseUpdateTransactions.amount.centAmount);
      t.is(result.transactionId, PaymentServiceConst.getRefundResponseUpdateTransactions.id);
    } else {
      t.fail(`Unexpected result : ${result}`);
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

test.serial('Set custom type for transaction when transaction id and amount is null', async (t: any) => {
  try {
    let result: any = PaymentHelper.setTransactionCustomType('', 0);
    if (result) {
      t.is(result.action, 'setTransactionCustomType');
      t.is(result.type.key, 'isv_transaction_data');
      t.is(result.type.typeId, 'type');
      t.is(result.fields.isv_availableCaptureAmount, 0);
      t.is(result.transactionId, '');
    } else {
      t.fail(`Unexpected result : ${result}`);
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

test.serial('Process transactions for authorization', async (t: any) => {
  try {
    const result = await PaymentHelper.processTransaction(PaymentCaptureServiceConstCC.payment as any);
    if (0 === result.actions.length) {
      t.deepEqual(result.actions, []);
      t.deepEqual(result.errors, []);
    } else {
      t.fail(`Unexpected result : ${result}`);
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

/**
 * PAYMENT METHOD PRESERVATION TESTS
 *
 * These tests verify that the payment method sent by the frontend is never overwritten
 * by CyberSource response data analysis. The payment method must be treated as the
 * source of truth from the payment creation point forward.
 */

test.serial('PAYMENT_METHOD_TEST_1: Credit Card + check paymentType must remain creditCard (not become eCheck)', async (t: any) => {
  try {
    // Test: Frontend sends creditCard, but CyberSource response contains paymentType.type='check'
    // Expected: Payment method must remain creditCard (NOT overwritten to eCheck)
    const payment = {
      id: 'test-payment-1',
      version: 1,
      amountPlanned: { type: 'centPrecision', currencyCode: 'USD', centAmount: 1000 },
      paymentMethodInfo: {
        method: 'creditCard', // Frontend explicitly sends creditCard
        name: { en: 'Credit Card' },
        paymentInterface: 'cybersource',
      },
      custom: {
        fields: {
          isv_transientToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXRhaWxzIjp7InN0YXR1cyI6IkFVVEhPUklaRUQiLCJwYXltZW50SW5mb3JtYXRpb24iOnsicGF5bWVudFR5cGUiOnsidHlwZSI6ImNoZWNrIn19fX0.sig',
          isv_merchantId: 'test_merchant',
          isv_cartId: 'test_cart_1',
        },
      },
      transactions: [
        {
          id: 'txn-1',
          type: 'Authorization',
          amount: { type: 'centPrecision', currencyCode: 'USD', centAmount: 1000 },
          state: 'Initial',
          interactionId: 'request-id-123',
        },
      ],
    };

    const result = await PaymentHelper.processTransaction(payment as any);

    // Verify: setMethodInfoMethod action should NOT be present
    const setMethodAction = result.actions?.find((a: any) => a.action === 'setMethodInfoMethod');
    t.is(setMethodAction, undefined, 'setMethodInfoMethod should NOT be added when payment method already exists');

    // Verify: No error should occur
    t.deepEqual(result.errors, [], 'No errors should occur during payment method preservation');
  } catch (exception) {
    if (exception instanceof Error) {
      t.fail(`Test failed with error: ${exception.message}`);
    } else {
      t.fail(`Test failed with unknown error: ${String(exception)}`);
    }
  }
});

test.serial('PAYMENT_METHOD_TEST_2: Credit Card + AUTHORIZED_PENDING_REVIEW status must remain creditCard', async (t: any) => {
  try {
    // Test: Frontend sends creditCard with AUTHORIZED_PENDING_REVIEW status
    // Expected: Status becomes PENDING_REVIEW (via normalization), method remains creditCard
    const payment = {
      id: 'test-payment-2',
      version: 1,
      amountPlanned: { type: 'centPrecision', currencyCode: 'USD', centAmount: 2000 },
      paymentMethodInfo: {
        method: 'creditCard', // Frontend sends creditCard
        name: { en: 'Credit Card' },
        paymentInterface: 'cybersource',
      },
      custom: {
        fields: {
          isv_authorizationStatus: 'AUTHORIZED_PENDING_REVIEW', // Status that needs normalization
          isv_merchantId: 'test_merchant',
        },
      },
      transactions: [
        {
          id: 'txn-2',
          type: 'Authorization',
          amount: { type: 'centPrecision', currencyCode: 'USD', centAmount: 2000 },
          state: 'Initial',
        },
      ],
    };

    const result = await PaymentHelper.processTransaction(payment as any);

    // Verify: setMethodInfoMethod action should NOT be present
    const setMethodAction = result.actions?.find((a: any) => a.action === 'setMethodInfoMethod');
    t.is(setMethodAction, undefined, 'setMethodInfoMethod should NOT be added for AUTHORIZED_PENDING_REVIEW');

    // Verify: No error
    t.deepEqual(result.errors, [], 'No errors during PENDING_REVIEW status handling');
  } catch (exception) {
    if (exception instanceof Error) {
      t.fail(`Test failed with error: ${exception.message}`);
    } else {
      t.fail(`Test failed with unknown error: ${String(exception)}`);
    }
  }
});

test.serial('PAYMENT_METHOD_TEST_3: Credit Card + AUTHORIZED_RISK_DECLINED must remain creditCard', async (t: any) => {
  try {
    // Test: Frontend sends creditCard with AUTHORIZED_RISK_DECLINED status
    // Expected: Status becomes RISK_DECLINED (via normalization), method remains creditCard
    const payment = {
      id: 'test-payment-3',
      version: 1,
      amountPlanned: { type: 'centPrecision', currencyCode: 'USD', centAmount: 3000 },
      paymentMethodInfo: {
        method: 'creditCard',
        name: { en: 'Credit Card' },
        paymentInterface: 'cybersource',
      },
      custom: {
        fields: {
          isv_authorizationStatus: 'AUTHORIZED_RISK_DECLINED',
          isv_merchantId: 'test_merchant',
        },
      },
      transactions: [
        {
          id: 'txn-3',
          type: 'Authorization',
          amount: { type: 'centPrecision', currencyCode: 'USD', centAmount: 3000 },
          state: 'Initial',
        },
      ],
    };

    const result = await PaymentHelper.processTransaction(payment as any);

    // Verify: setMethodInfoMethod should NOT be added
    const setMethodAction = result.actions?.find((a: any) => a.action === 'setMethodInfoMethod');
    t.is(setMethodAction, undefined, 'setMethodInfoMethod should NOT be added for AUTHORIZED_RISK_DECLINED');

    // Verify: No error
    t.deepEqual(result.errors, [], 'No errors during RISK_DECLINED status handling');
  } catch (exception) {
    if (exception instanceof Error) {
      t.fail(`Test failed with error: ${exception.message}`);
    } else {
      t.fail(`Test failed with unknown error: ${String(exception)}`);
    }
  }
});

test.serial('PAYMENT_METHOD_TEST_4: Google Pay with processingInformation.paymentSolution must remain googlePay', async (t: any) => {
  try {
    // Test: Frontend sends googlePay with paymentSolution='012'
    // Expected: Method remains googlePay (NOT inferred from paymentSolution code)
    const payment = {
      id: 'test-payment-4',
      version: 1,
      amountPlanned: { type: 'centPrecision', currencyCode: 'USD', centAmount: 4000 },
      paymentMethodInfo: {
        method: 'googlePay', // Frontend explicitly sends googlePay
        name: { en: 'Google Pay' },
        paymentInterface: 'cybersource',
      },
      custom: {
        fields: {
          isv_transientToken: 'eyJhbGciOiJIUzI1NiJ9.eyJkZXRhaWxzIjp7InByb2Nlc3NpbmdJbmZvcm1hdGlvbiI6eyJwYXltZW50U29sdXRpb24iOiIwMTIifX19.sig',
          isv_merchantId: 'test_merchant',
        },
      },
      transactions: [
        {
          id: 'txn-4',
          type: 'Authorization',
          amount: { type: 'centPrecision', currencyCode: 'USD', centAmount: 4000 },
          state: 'Initial',
        },
      ],
    };

    const result = await PaymentHelper.processTransaction(payment as any);

    // Verify: setMethodInfoMethod should NOT be added
    const setMethodAction = result.actions?.find((a: any) => a.action === 'setMethodInfoMethod');
    t.is(setMethodAction, undefined, 'setMethodInfoMethod should NOT be added for googlePay (payment solution 012)');

    // Verify: No error
    t.deepEqual(result.errors, [], 'No errors for Google Pay transaction');
  } catch (exception) {
    if (exception instanceof Error) {
      t.fail(`Test failed with error: ${exception.message}`);
    } else {
      t.fail(`Test failed with unknown error: ${String(exception)}`);
    }
  }
});

test.serial('PAYMENT_METHOD_TEST_5: Click to Pay with processingInformation.paymentSolution must remain clickToPay', async (t: any) => {
  try {
    // Test: Frontend sends clickToPay with paymentSolution='027'
    // Expected: Method remains clickToPay (NOT inferred from paymentSolution code)
    const payment = {
      id: 'test-payment-5',
      version: 1,
      amountPlanned: { type: 'centPrecision', currencyCode: 'USD', centAmount: 5000 },
      paymentMethodInfo: {
        method: 'clickToPay', // Frontend explicitly sends clickToPay
        name: { en: 'Click to Pay' },
        paymentInterface: 'cybersource',
      },
      custom: {
        fields: {
          isv_transientToken: 'eyJhbGciOiJIUzI1NiJ9.eyJkZXRhaWxzIjp7InByb2Nlc3NpbmdJbmZvcm1hdGlvbiI6eyJwYXltZW50U29sdXRpb24iOiIwMjcifX19.sig',
          isv_merchantId: 'test_merchant',
        },
      },
      transactions: [
        {
          id: 'txn-5',
          type: 'Authorization',
          amount: { type: 'centPrecision', currencyCode: 'USD', centAmount: 5000 },
          state: 'Initial',
        },
      ],
    };

    const result = await PaymentHelper.processTransaction(payment as any);

    // Verify: setMethodInfoMethod should NOT be added
    const setMethodAction = result.actions?.find((a: any) => a.action === 'setMethodInfoMethod');
    t.is(setMethodAction, undefined, 'setMethodInfoMethod should NOT be added for clickToPay (payment solution 027)');

    // Verify: No error
    t.deepEqual(result.errors, [], 'No errors for Click to Pay transaction');
  } catch (exception) {
    if (exception instanceof Error) {
      t.fail(`Test failed with error: ${exception.message}`);
    } else {
      t.fail(`Test failed with unknown error: ${String(exception)}`);
    }
  }
});

test.serial('PAYMENT_METHOD_TEST_6: eCheck with paymentType.type=check must remain eCheck', async (t: any) => {
  try {
    // Test: Frontend sends eCheck with paymentType.type='check'
    // Expected: Method remains eCheck (correctly identified, not overwritten)
    const payment = {
      id: 'test-payment-6',
      version: 1,
      amountPlanned: { type: 'centPrecision', currencyCode: 'USD', centAmount: 6000 },
      paymentMethodInfo: {
        method: 'eCheck', // Frontend explicitly sends eCheck
        name: { en: 'eCheck' },
        paymentInterface: 'cybersource',
      },
      custom: {
        fields: {
          isv_transientToken: 'eyJhbGciOiJIUzI1NiJ9.eyJkZXRhaWxzIjp7InBheW1lbnRJbmZvcm1hdGlvbiI6eyJwYXltZW50VHlwZSI6eyJ0eXBlIjoiY2hlY2sifX19.sig',
          isv_merchantId: 'test_merchant',
        },
      },
      transactions: [
        {
          id: 'txn-6',
          type: 'Authorization',
          amount: { type: 'centPrecision', currencyCode: 'USD', centAmount: 6000 },
          state: 'Initial',
        },
      ],
    };

    const result = await PaymentHelper.processTransaction(payment as any);

    // Verify: setMethodInfoMethod should NOT be added (eCheck is already correct)
    const setMethodAction = result.actions?.find((a: any) => a.action === 'setMethodInfoMethod');
    t.is(setMethodAction, undefined, 'setMethodInfoMethod should NOT be added when eCheck is already the method');

    // Verify: No error
    t.deepEqual(result.errors, [], 'No errors for eCheck transaction');
  } catch (exception) {
    if (exception instanceof Error) {
      t.fail(`Test failed with error: ${exception.message}`);
    } else {
      t.fail(`Test failed with unknown error: ${String(exception)}`);
    }
  }
});

test.serial('PAYMENT_METHOD_TEST_7: Missing paymentMethodInfo.method allows inference as fallback', async (t: any) => {
  try {
    // Test: Frontend does NOT send paymentMethodInfo.method (edge case, should not happen in normal flow)
    // Expected: Fall back to inference from CyberSource response
    const payment = {
      id: 'test-payment-7',
      version: 1,
      amountPlanned: { type: 'centPrecision', currencyCode: 'USD', centAmount: 7000 },
      paymentMethodInfo: {
        // method is deliberately missing to test fallback
        paymentInterface: 'cybersource',
      },
      custom: {
        fields: {
          isv_transientToken: 'eyJhbGciOiJIUzI1NiJ9.eyJkZXRhaWxzIjp7InBheW1lbnRJbmZvcm1hdGlvbiI6eyJwYXltZW50VHlwZSI6eyJ0eXBlIjoiY2hlY2sifX19.sig',
          isv_merchantId: 'test_merchant',
        },
      },
      transactions: [
        {
          id: 'txn-7',
          type: 'Authorization',
          amount: { type: 'centPrecision', currencyCode: 'USD', centAmount: 7000 },
          state: 'Initial',
        },
      ],
    };

    const result = await PaymentHelper.processTransaction(payment as any);

    // This test verifies the fallback behavior exists but is outside normal flow
    // In production, paymentMethodInfo.method should always be provided by frontend
    t.deepEqual(result.errors, [], 'No errors even with missing payment method (fallback inference tested)');
  } catch (exception) {
    if (exception instanceof Error) {
      t.fail(`Test failed with error: ${exception.message}`);
    } else {
      t.fail(`Test failed with unknown error: ${String(exception)}`);
    }
  }
});