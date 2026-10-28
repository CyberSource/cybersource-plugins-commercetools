import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { Constants } from '../../../constants/paymentConstants';
import paymentHandler from '../../../utils/PaymentHandler';

test('isInitialState matches only the Initial transaction state', (t) => {
  t.true(paymentHandler.isInitialState(Constants.CT_TRANSACTION_STATE_INITIAL));
  t.false(paymentHandler.isInitialState(Constants.CT_TRANSACTION_STATE_SUCCESS));
  t.false(paymentHandler.isInitialState(undefined));
});

test('findAddressByIdLastMatch returns the last address matching the id', (t) => {
  const addresses = [
    { id: 'addr-1', city: 'First' } as any,
    { id: 'addr-2', city: 'Second' } as any,
    { id: 'addr-1', city: 'Duplicate' } as any,
  ];

  t.is(paymentHandler.findAddressByIdLastMatch(addresses, 'addr-1')?.city, 'Duplicate');
  t.is(paymentHandler.findAddressByIdLastMatch(addresses, 'missing'), null);
});

test('findTokenIndexByPaymentTokenLastMatch returns the last matching index', (t) => {
  const tokens = [
    JSON.stringify({ paymentToken: 'token-a' }),
    JSON.stringify({ paymentToken: 'token-b' }),
    JSON.stringify({ paymentToken: 'token-a' }),
  ];

  t.is(paymentHandler.findTokenIndexByPaymentTokenLastMatch(tokens, 'token-a'), 2);
  t.is(paymentHandler.findTokenIndexByPaymentTokenLastMatch(tokens, 'missing'), -1);
});

test('applyCardTokenPatch merges the patch into the token at the given index', (t) => {
  const tokens = [JSON.stringify({ paymentToken: 'token-a', cardExpiryMonth: '01', addressId: 'old-addr' })];

  paymentHandler.applyCardTokenPatch(tokens, 0, { cardExpiryMonth: '08', cardExpiryYear: '2031', addressId: 'new-addr' });

  t.deepEqual(JSON.parse(tokens[0]), {
    paymentToken: 'token-a',
    cardExpiryMonth: '08',
    cardExpiryYear: '2031',
    addressId: 'new-addr',
  });
});
