import { AddressType, ReportSyncType } from '../../types/Types';
import creditCard from '../JSON/creditCard.json';
import unit from '../JSON/unit.json';

 const customerId = unit.customerId;
 const paymentId = unit.paymentId;
 const anonymousId = unit.anonymousId;
 const cartId = unit.cartId;
 const key = 'isv_payment_failure';

 const customerID = '950883c0-0bcd-41f3-bdc8-f7aa7f36cde4';

 const address : AddressType = {
  firstName: 'Example',
  lastName: 'Person',
  streetName: 'Examplary Street',
  streetNumber: '4711',
  additionalStreetInfo: 'Backhouse',
  postalCode: '80933',
  city: 'Exemplary City',
  region: 'Exemplary Region',
  country: 'DE',
  phone: '+49 89 12345678',
  mobile: '+49 171 2345678',
  email: 'mail@mail.com',
  id: '',
  address1: '',
  address2: '',
  buildingNumber: '',
  locality: '',
  administrativeArea: '',
  phoneNumber: ''
};

 const emptyAddressField : AddressType= {
  firstName: '',
  lastName: '',
  streetName: '',
  streetNumber: '',
  additionalStreetInfo: '',
  postalCode: '',
  city: '',
  region: '',
  country: '',
  phone: '',
  mobile: '',
  email: '',
  id: '',
  address1: '',
  address2: '',
  buildingNumber: '',
  locality: '',
  administrativeArea: '',
  phoneNumber: ''
};

 const addTransactionTransactionObject = {
  paymentId: unit.paymentId,
  version: 15,
  amount: {
    type: 'centPrecision',
    currencyCode: 'EUR',
    centAmount: 4050,
    fractionDigits: 2,
  },
  type: 'CancelAuthorization',
  state: 'Initial',
};

 const visaCheckoutData = {
  billToFieldGroup: {
    firstName: 'John',
    lastName: 'Doe',
    address1: '1293 Charleston road',
    address2: 'address 2',
    administrativeArea: 'CA',
    country: 'US',
    phoneNumber: '1234567890',
    email: 'john.doe@gmail.com',
  },
  shipToFieldGroup: {
    firstName: 'John',
    lastName: 'Doe',
    address1: '1293 Charleston road',
    address2: 'address 2',
    administrativeArea: 'CA',
    country: 'US',
    phoneNumber: '1234567890',
    email: 'john.doe@gmail.com',
  },
};

 let syncAddTransactionObject: ReportSyncType = {
  "id":unit.paymentId,
  "transactionId": "",
  "version": 12,
  "interactionId": "7223304358526864503955",
  "amountPlanned": {
    "currencyCode": "USD",
    "centAmount": 49310
  },
  "type": "Authorization",
  "state": "",
  "securityCodePresent": false
}

 let addTransactionForCharge = {
  amount: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 4000,
    fractionDigits: 2,
  },
  state: 'Initial',
  version: 13,
  type: 'Charge',
};

 let setCustomTypeFieldsData = [
  '{"alias":"1091 card","value":"11F5E62F2B492E0FE063AF598E0A35CB","paymentToken":"11F5E871374433B7E063AF598E0AE007","instrumentIdentifier":"7020000000005531091","cardType":"001","cardName":"001","cardNumber":"400000XXXXXXXXXXXX1091","cardExpiryMonth":"01","cardExpiryYear":"2032","addressId":"","timeStamp":"2024-02-22T09:20:23.405Z"}',
];

 const syncVisaCardEtailsActions = [
  {
    action: 'setCustomField',
    name: 'isv_maskedPan',
    value: '411111XXXXXX1111',
  },
  {
    action: 'setCustomField',
    name: 'isv_cardExpiryMonth',
    value: '05',
  },
  {
    action: 'setCustomField',
    name: 'isv_cardExpiryYear',
    value: '25',
  },
  { action: 'setCustomField', name: 'isv_cardType', value: '001' },
];

 const createCTCustomObjectData = {
  container: 'ctWebHookSubscription',
  key: 'webHookSubscription',
  value: [
    {
      merchantId: 'visa_isv_oraclecc_pmt_dm',
      key: 'PLnsPPGuu6982PGFESqUsZjCiM8H0zrUZG9EyTxef1s=',
      keyId: '10d7c1e2-9767-06cb-e063-5a588d0a6d47',
      keyExpiration: '2023-07-11T04:07:52.157-07:00',
      subscriptionId: '0baefc08-993a-63ad-e063-9e588e0a98ac',
    },
  ],
};

 const customFieldName = 'isv_cybersource_customer_id';

 const customFieldValue = '11B5C4B5776C40FCE063AF598E0AEC59';

 const customObjectContainer = 'ctWebHookSubscription';

 let changeTransactionInteractionIdTransactionObject : any = {
  paymentId: unit.paymentId,
  version: '',
  transactionId: creditCard.authId,
  interactionId: '0346f3bf-beb7-4b99-acdc-b1360504b58c',
}

export default {
  customerId,
  paymentId,
  anonymousId,
  cartId,
  key,
  customerID,
  address,
  emptyAddressField,
  addTransactionTransactionObject,
  visaCheckoutData,
  syncAddTransactionObject,
  addTransactionForCharge,
  setCustomTypeFieldsData,
  syncVisaCardEtailsActions,
  createCTCustomObjectData,
  customFieldName,
  customFieldValue,
  customObjectContainer,
  changeTransactionInteractionIdTransactionObject,
  
}