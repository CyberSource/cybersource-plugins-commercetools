import test from 'ava';
import dotenv from 'dotenv';

import apiController from '../../apiController';

dotenv.config();

// ============================================================
// Negative tests for isValidTokenSchema
// ============================================================

test.serial('isValidTokenSchema rejects null input', (t) => {
  t.false(apiController.isValidTokenSchema(null));
});

test.serial('isValidTokenSchema rejects undefined input', (t) => {
  t.false(apiController.isValidTokenSchema(undefined));
});

test.serial('isValidTokenSchema rejects array input', (t) => {
  t.false(apiController.isValidTokenSchema([{ paymentToken: 'abc', value: 'def' }]));
});

test.serial('isValidTokenSchema rejects string input', (t) => {
  t.false(apiController.isValidTokenSchema('not an object'));
});

test.serial('isValidTokenSchema rejects number input', (t) => {
  t.false(apiController.isValidTokenSchema(123));
});

test.serial('isValidTokenSchema rejects object with missing paymentToken', (t) => {
  t.false(apiController.isValidTokenSchema({ value: 'someValue', alias: 'myCard' }));
});

test.serial('isValidTokenSchema rejects object with missing value field', (t) => {
  t.false(apiController.isValidTokenSchema({ paymentToken: 'token123' }));
});

test.serial('isValidTokenSchema rejects object with empty paymentToken', (t) => {
  t.false(apiController.isValidTokenSchema({ paymentToken: '', value: 'someValue' }));
});

test.serial('isValidTokenSchema rejects object with whitespace-only paymentToken', (t) => {
  t.false(apiController.isValidTokenSchema({ paymentToken: '   ', value: 'someValue' }));
});

test.serial('isValidTokenSchema rejects object with empty value field', (t) => {
  t.false(apiController.isValidTokenSchema({ paymentToken: 'token123', value: '' }));
});

test.serial('isValidTokenSchema rejects object with extra/unexpected fields', (t) => {
  t.false(apiController.isValidTokenSchema({
    paymentToken: 'token123',
    value: 'someValue',
    maliciousField: 'attack',
  }));
});

test.serial('isValidTokenSchema rejects object with __proto__ field', (t) => {
  const malicious = JSON.parse('{"paymentToken":"tok","value":"val","__proto__":{"admin":true}}');
  t.false(apiController.isValidTokenSchema(malicious));
});

test.serial('isValidTokenSchema rejects object with constructor field', (t) => {
  t.false(apiController.isValidTokenSchema({
    paymentToken: 'token123',
    value: 'someValue',
    constructor: 'malicious',
  }));
});

test.serial('isValidTokenSchema rejects object with non-string paymentToken', (t) => {
  t.false(apiController.isValidTokenSchema({ paymentToken: 12345, value: 'someValue' }));
});

test.serial('isValidTokenSchema rejects object with non-string value for allowed field', (t) => {
  t.false(apiController.isValidTokenSchema({
    paymentToken: 'token123',
    value: 'someValue',
    cardExpiryMonth: 12,
  }));
});

test.serial('isValidTokenSchema accepts valid token object', (t) => {
  t.true(apiController.isValidTokenSchema({
    paymentToken: 'token123',
    value: 'customerTokenId',
    alias: 'My Visa Card',
    cardType: 'visa',
    cardNumber: '411111XXXXXX1111',
    cardExpiryMonth: '12',
    cardExpiryYear: '2028',
  }));
});

test.serial('isValidTokenSchema accepts minimal valid token', (t) => {
  t.true(apiController.isValidTokenSchema({
    paymentToken: 'abc',
    value: 'def',
  }));
});
