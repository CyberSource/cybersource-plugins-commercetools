import test from 'ava';


import paymentTransactionDisplayHelper from '../../../utils/helpers/PaymentTransactionDisplayHelper';

const filterTransactionsForDisplay = paymentTransactionDisplayHelper.filterTransactionsForDisplay;

test.serial('sale transaction with same interactionId -> only Charge displayed', (t) => {
  const transactions = [
    { type: 'Authorization', state: 'Initial', interactionId: '7833939645496323304012' },
    { type: 'Charge', state: 'Success', interactionId: '7833939645496323304012' },
  ];

  const result = filterTransactionsForDisplay(transactions);

  t.is(result.length, 1);
  t.is(result[0].type, 'Charge');
  t.is(result[0].interactionId, '7833939645496323304012');
});

test.serial('auth-only transaction -> Authorization displayed', (t) => {
  const transactions = [
    { type: 'Authorization', state: 'Success', interactionId: 'AUTH_ONLY_01' },
  ];

  const result = filterTransactionsForDisplay(transactions);

  t.is(result.length, 1);
  t.is(result[0].type, 'Authorization');
});

test.serial('auth + capture with different interactionId -> both displayed', (t) => {
  const transactions = [
    { type: 'Authorization', state: 'Success', interactionId: 'AUTH_ABC' },
    { type: 'Charge', state: 'Success', interactionId: 'CAPTURE_DEF' },
  ];

  const result = filterTransactionsForDisplay(transactions);

  t.is(result.length, 2);
  t.true(result.some((transaction) => transaction.type === 'Authorization'));
  t.true(result.some((transaction) => transaction.type === 'Charge'));
});

test.serial('refund transaction -> refund row still displayed', (t) => {
  const transactions = [
    { type: 'Authorization', state: 'Initial', interactionId: 'SALE_XYZ' },
    { type: 'Charge', state: 'Success', interactionId: 'SALE_XYZ' },
    { type: 'Refund', state: 'Success', interactionId: 'REFUND_001' },
  ];

  const result = filterTransactionsForDisplay(transactions);

  t.is(result.length, 2);
  t.is(result[0].type, 'Charge');
  t.is(result[1].type, 'Refund');
});

