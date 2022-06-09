import updateToken from '../JSON/updateToken.json'
export const tokens = {
    alias: updateToken.alias,
    value: updateToken.value,
    cardType: updateToken.cardType,
    cardName: updateToken.cardName,
    cardNumber: updateToken.cardNumber,
    cardExpiryMonth: updateToken.oldExpiryMonth,
    cardExpiryYear: updateToken.oldExpiryYear,
    paymentToken: updateToken.paymentToken,
    instrumentIdentifier: updateToken.instrumentIdentifier,
    addressId: 'OKxBLnRJ'
  }

  export const newExpiryMonth = updateToken.cardExpiryMonth

  export const newExpiryYear = updateToken.cardExpiryYear

  export const addressData =  {
    id: 'OKxBLnRJ',
    firstName: 'shakshi',
    lastName: 'poddar',
    streetName: '1295 Charleston Road',
    additionalStreetInfo: '5th lane',
    postalCode: '94043',
    city: 'Mountain View',
    region: 'CA',
    country: 'US',
    phone: '+19876543210',
    email: 'shakshi.poddar@wipro.com'
  }

  export const tokenObject = {
    alias: 'card1',
    value: 'D3CF932491B77AE0E053AF598E0A79',
    cardType: '001',
    cardName: '001',
    cardNumber: '411111XXXXXX1111',
    cardExpiryMonth: '01',
    cardExpiryYear: '2024',
    paymentToken: 'D3CD8A8C0904A730E053AF598E0A08',
    flag: 'update',
    oldExpiryMonth: '03',
    oldExpiryYear: '2029'
  }