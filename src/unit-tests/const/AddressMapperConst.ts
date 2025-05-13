const sourceAddress = {
  firstName: 'John',
  lastName: 'Doe',
  streetName: '1295 charleston bay',
  additionalStreetInfo: '5th lane',
  locality: 'Mountain view',
  city: 'Anytown',
  region: 'CA',
  postalCode: '12345',
  country: 'US',
  email: 'john.doe@example.com',
  phone: '1234567890',
};

const invalidAddress = {
  firstName: undefined,
  lastName: undefined,
  streetName: undefined,
  additionalStreetInfo: undefined,
  locality: undefined,
  administrativeArea: undefined,
  city: undefined,
  region: undefined,
  postalCode: undefined,
  country: undefined,
  email: undefined,
  phone: undefined,
};

const invaliAddressResult = {
  firstName: undefined,
  lastName: undefined,
  address1: undefined,
  address2: undefined,
  locality: undefined,
  administrativeArea: undefined,
  postalCode: undefined,
  country: undefined,
  email: undefined,
  phoneNumber: undefined,
};

const emptyAddressResult = {
  firstName: '',
  lastName: '',
  address1: '',
  address2: '',
  locality: '',
  administrativeArea: '',
  postalCode: '',
  country: '',
  email: '',
  phoneNumber: '',
};

export default {
  sourceAddress,
  invalidAddress,
  invaliAddressResult,
  emptyAddressResult
};
