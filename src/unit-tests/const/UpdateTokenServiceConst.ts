import { AddressType } from '../../types/Types';
import updateToken from '../JSON/updateToken.json';
 const tokens = {
  alias: updateToken.alias,
  value: updateToken.value,
  cardType: updateToken.cardType,
  cardName: updateToken.cardName,
  cardNumber: updateToken.cardNumber,
  cardExpiryMonth: updateToken.oldExpiryMonth,
  cardExpiryYear: updateToken.oldExpiryYear,
  paymentToken: updateToken.paymentToken,
  instrumentIdentifier: updateToken.instrumentIdentifier,
  addressId: 'OKxBLnRJ',
};

 const newExpiryMonth = updateToken.cardExpiryMonth;

 const newExpiryYear = updateToken.cardExpiryYear;

 const addressData : AddressType= {
  id: 'OKxBLnRJ',
  firstName: 'john',
  lastName: 'doe',
  streetName: '1295 Charleston Road',
  additionalStreetInfo: '5th lane',
  postalCode: '94043',
  city: 'Mountain View',
  region: 'CA',
  country: 'US',
  phone: '+19876543210',
  email: 'john.doe@wipro.com',
  address1: '',
  address2: '',
  buildingNumber: '',
  streetNumber: '',
  locality: '',
  administrativeArea: '',
  phoneNumber: '',
  mobile: ''
};

 const invalidAddressData : AddressType= {
  id: 'OKxBLnRJ',
  firstName: 'john',
  lastName: 'doe',
  streetName: '1295 Charleston Road',
  additionalStreetInfo: '5th lane',
  postalCode: '94043',
  city: 'Mountain View',
  region: 'California',
  country: 'US',
  phone: '+19876543210',
  email: 'john.doe@wipro.com',
  address1: '',
  address2: '',
  buildingNumber: '',
  streetNumber: '',
  locality: '',
  administrativeArea: '',
  phoneNumber: '',
  mobile: ''
};

 const tokenObject = {
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
  oldExpiryYear: '2029',
};

export default{
  tokens,
  newExpiryMonth,
  newExpiryYear,
  addressData,
  invalidAddressData,
  tokenObject
}