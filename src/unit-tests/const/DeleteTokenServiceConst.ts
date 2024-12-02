import deleteToken from '../JSON/deleteToken.json';
 const customerTokenObj = {
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

 const customerTokenObject = {
  alias: 'sp2',
  value: 'D3CD8072D10089FEE053AF598E0AA',
  cardType: '001',
  cardName: '001',
  cardNumber: '411111XXXXXX1111',
  cardExpiryMonth: '01delete',
  cardExpiryYear: '2024',
};

 const customerInvalidTokenObj = {
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

 const customerInvalidPaymentTokenObj = {
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

export default {
  customerTokenObj,
  customerTokenObject,
  customerInvalidTokenObj,
  customerInvalidPaymentTokenObj
}