import deleteToken from '../JSON/deleteToken.json';
export const customerTokenObj = {
  alias: deleteToken.alias,
  value: deleteToken.value,
  paymentToken: deleteToken.paymentToken,
  instrumentIdentifier: deleteToken.instrumentIdentifier,
  cardType: deleteToken.cardType,
  cardName: deleteToken.cardName,
  cardNumber: deleteToken.cardNumber,
  cardExpiryMonth: deleteToken.cardExpiryMonth,
  cardExpiryYear: deleteToken.cardExpiryYear,
  addressId: 'OKxBLnRJ',
};

export const customerTokenObject = {
  alias: 'sp2',
  value: 'D3CD8072D10089FEE053AF598E0AA',
  cardType: '001',
  cardName: '001',
  cardNumber: '411111XXXXXX1111',
  cardExpiryMonth: '01delete',
  cardExpiryYear: '2024',
};

export const customerInvalidTokenObj = {
  alias: deleteToken.value,
  value: 'abc',
  paymentToken: deleteToken.paymentToken,
  instrumentIdentifier: deleteToken.instrumentIdentifier,
  cardType: deleteToken.cardType,
  cardName: deleteToken.cardName,
  cardNumber: deleteToken.cardNumber,
  cardExpiryMonth: deleteToken.cardExpiryMonth,
  cardExpiryYear: deleteToken.cardExpiryYear,
  addressId: 'OKxBLnRJ',
};

export const customerInvalidPaymentTokenObj = {
  alias: deleteToken.alias,
  value: deleteToken.value,
  paymentToken: 'abc',
  instrumentIdentifier: deleteToken.instrumentIdentifier,
  cardType: deleteToken.cardType,
  cardName: deleteToken.cardName,
  cardNumber: deleteToken.cardNumber,
  cardExpiryMonth: deleteToken.cardExpiryMonth,
  cardExpiryYear: deleteToken.cardExpiryYear,
  addressId: 'OKxBLnRJ',
};
