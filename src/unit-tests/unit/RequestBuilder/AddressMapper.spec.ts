import test from 'ava';

import { AddressMapper } from '../../../requestBuilder/AddressMapper';
import AddressMapperConst from '../../const/AddressMapperConst';

const addressMapper = new AddressMapper(AddressMapperConst.sourceAddress);
const invalidAddressMapper = new AddressMapper(AddressMapperConst.invalidAddress);

test.serial('verify update token bill to object is mapped', (t: any) => {
  try {
    const result = addressMapper.mapUpdateTokenBillTo();
    if (Object.keys(result).length) {
      t.is(result.firstName, AddressMapperConst.sourceAddress.firstName);
      t.is(result.lastName, AddressMapperConst.sourceAddress.lastName);
      t.is(result.address1, AddressMapperConst.sourceAddress.streetName);
      t.is(result.address2, AddressMapperConst.sourceAddress.additionalStreetInfo);
      t.is(result.locality, AddressMapperConst.sourceAddress.city);
      t.is(result.administrativeArea, AddressMapperConst.sourceAddress.region);
      t.is(result.postalCode, AddressMapperConst.sourceAddress.postalCode);
      t.is(result.country, AddressMapperConst.sourceAddress.country);
      t.is(result.email, AddressMapperConst.sourceAddress.email);
      t.is(result.phoneNumber, AddressMapperConst.sourceAddress.phone);
    } else {
      t.fail(`Unexpected error: mapUpdateTokenBillTo' ${result}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('verify order information bill to object is mapped', (t: any) => {
  try {
    const result = addressMapper.mapOrderInformationBillTo();
    if (Object.keys(result).length) {
      t.is(result.firstName, AddressMapperConst.sourceAddress.firstName);
      t.is(result.lastName, AddressMapperConst.sourceAddress.lastName);
      t.is(result.address1, AddressMapperConst.sourceAddress.streetName);
      t.is(result.address2, AddressMapperConst.sourceAddress.additionalStreetInfo);
      t.is(result.locality, AddressMapperConst.sourceAddress.city);
      t.is(result.administrativeArea, AddressMapperConst.sourceAddress.region);
      t.is(result.postalCode, AddressMapperConst.sourceAddress.postalCode);
      t.is(result.country, AddressMapperConst.sourceAddress.country);
      t.is(result.email, AddressMapperConst.sourceAddress.email);
      t.is(result.phoneNumber, AddressMapperConst.sourceAddress.phone);
    } else {
      t.fail(`Unexpected error: mapOrderInformationBillTo ' ${result}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test.serial('verify order information ship to object is mapped', (t: any) => {
  try {
    const result = addressMapper.mapOrderInformationShipto();
    if (Object.keys(result).length) {
      t.is(result.firstName, AddressMapperConst.sourceAddress.firstName);
      t.is(result.lastName, AddressMapperConst.sourceAddress.lastName);
      t.is(result.address1, AddressMapperConst.sourceAddress.streetName);
      t.is(result.address2, AddressMapperConst.sourceAddress.additionalStreetInfo);
      t.is(result.locality, AddressMapperConst.sourceAddress.city);
      t.is(result.administrativeArea, AddressMapperConst.sourceAddress.region);
      t.is(result.postalCode, AddressMapperConst.sourceAddress.postalCode);
      t.is(result.country, AddressMapperConst.sourceAddress.country);
      t.is(result.email, AddressMapperConst.sourceAddress.email);
      t.is(result.phoneNumber, AddressMapperConst.sourceAddress.phone);
    } else {
      t.fail(`Unexpected error: mapOrderInformationShipto' ${result}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test('mapUpdateTokenBillTo should handle incomplete AddressMapperConst.sourceAddress', (t) => {
  const result = invalidAddressMapper.mapUpdateTokenBillTo();
  if (result) {
    t.not(result.firstName, AddressMapperConst.invalidAddress.firstName);
    t.not(result.lastName, AddressMapperConst.invalidAddress.lastName);
    t.not(result.address1, AddressMapperConst.invalidAddress.streetName);
    t.not(result.address2, AddressMapperConst.invalidAddress.additionalStreetInfo);
    t.not(result.locality, AddressMapperConst.invalidAddress.city);
    t.not(result.administrativeArea, AddressMapperConst.invalidAddress.region);
    t.not(result.postalCode, AddressMapperConst.invalidAddress.postalCode);
    t.not(result.country, AddressMapperConst.invalidAddress.country);
    t.not(result.email, AddressMapperConst.invalidAddress.email);
    t.not(result.phoneNumber, AddressMapperConst.invalidAddress.phone);
  } else {
    t.fail(`Unexpected error: mapUpdateTokenBillTo' ${result}`);
  }
});

test('mapOrderInformationBillTo should handle incomplete AddressMapperConst.sourceAddress', (t) => {
  try {
    const result = invalidAddressMapper.mapUpdateTokenBillTo();
    if (Object.keys(result).length) {
      t.not(result.firstName, AddressMapperConst.invalidAddress.firstName);
      t.not(result.lastName, AddressMapperConst.invalidAddress.lastName);
      t.not(result.address1, AddressMapperConst.invalidAddress.streetName);
      t.not(result.address2, AddressMapperConst.invalidAddress.additionalStreetInfo);
      t.not(result.locality, AddressMapperConst.invalidAddress.city);
      t.not(result.administrativeArea, AddressMapperConst.invalidAddress.region);
      t.not(result.postalCode, AddressMapperConst.invalidAddress.postalCode);
      t.not(result.country, AddressMapperConst.invalidAddress.country);
      t.not(result.email, AddressMapperConst.invalidAddress.email);
      t.not(result.phoneNumber, AddressMapperConst.invalidAddress.phone);
    } else {
      t.fail(`Unexpected error: mapUpdateTokenBillTo' ${result}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test('mapOrderInformationShipTo should handle incomplete AddressMapperConst.sourceAddress', (t) => {
  try {
    const result = invalidAddressMapper.mapUpdateTokenBillTo();
    if (Object.keys(result).length) {
      t.not(result.firstName, AddressMapperConst.invalidAddress.firstName);
      t.not(result.lastName, AddressMapperConst.invalidAddress.lastName);
      t.not(result.address1, AddressMapperConst.invalidAddress.streetName);
      t.not(result.address2, AddressMapperConst.invalidAddress.additionalStreetInfo);
      t.not(result.locality, AddressMapperConst.invalidAddress.city);
      t.not(result.administrativeArea, AddressMapperConst.invalidAddress.region);
      t.not(result.postalCode, AddressMapperConst.invalidAddress.postalCode);
      t.not(result.country, AddressMapperConst.invalidAddress.country);
      t.not(result.email, AddressMapperConst.invalidAddress.email);
      t.not(result.phoneNumber, AddressMapperConst.invalidAddress.phone);
    } else {
      t.fail(`Unexpected error: mapUpdateTokenBillTo' ${result}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});

test('test empty object to the constructor', (t) => {
  try {
    const invalidData = new AddressMapper({});
    const result = invalidData.mapUpdateTokenBillTo();
    if (Object.keys(result).length) {
      t.deepEqual(result, AddressMapperConst.emptyAddressResult);
    } else {
      t.fail(`Unexpected error: mapUpdateTokenBillTo' ${result}`);
    }
  } catch (error) {
    t.fail(`Caught an error during execution: ${error instanceof Error ? error.message : String(error)}`);
  }
});