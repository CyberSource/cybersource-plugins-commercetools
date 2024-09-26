import test from 'ava';

import { AddressMapper } from '../../../requestBuilder/AddressMapper';
import AddressMapperConst from '../../const/AddressMapperConst';

const addressMapper = new AddressMapper(AddressMapperConst.sourceAddress);
const invalidAddressMapper = new AddressMapper(AddressMapperConst.invalidAddress);

test.serial('verify update token bill to object is mapped', (t: any) => {
    const result = addressMapper.mapUpdateTokenBillTo();
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
});

test.serial('verify order information bill to object is mapped', (t: any) => {
    const result = addressMapper.mapOrderInformationBillTo();
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
});

test.serial('verify order information ship to object is mapped', (t: any) => {
    const result = addressMapper.mapOrderInformationShipto();
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
});

test('mapUpdateTokenBillTo should handle incomplete AddressMapperConst.sourceAddress', t => {
    const result = invalidAddressMapper.mapUpdateTokenBillTo();
    t.is(result.firstName, AddressMapperConst.invalidAddress.firstName);
    t.is(result.lastName, AddressMapperConst.invalidAddress.lastName);
    t.is(result.address1, AddressMapperConst.invalidAddress.streetName);
    t.is(result.address2, AddressMapperConst.invalidAddress.additionalStreetInfo);
    t.is(result.locality, AddressMapperConst.invalidAddress.city);
    t.is(result.administrativeArea, AddressMapperConst.invalidAddress.region);
    t.is(result.postalCode, AddressMapperConst.invalidAddress.postalCode);
    t.is(result.country, AddressMapperConst.invalidAddress.country);
    t.is(result.email, AddressMapperConst.invalidAddress.email);
    t.is(result.phoneNumber, AddressMapperConst.invalidAddress.phone);
});

test('mapOrderInformationBillTo should handle incomplete AddressMapperConst.sourceAddress', t => {
    const result = invalidAddressMapper.mapUpdateTokenBillTo();
    t.is(result.firstName, AddressMapperConst.invalidAddress.firstName);
    t.is(result.lastName, AddressMapperConst.invalidAddress.lastName);
    t.is(result.address1, AddressMapperConst.invalidAddress.streetName);
    t.is(result.address2, AddressMapperConst.invalidAddress.additionalStreetInfo);
    t.is(result.locality, AddressMapperConst.invalidAddress.city);
    t.is(result.administrativeArea, AddressMapperConst.invalidAddress.region);
    t.is(result.postalCode, AddressMapperConst.invalidAddress.postalCode);
    t.is(result.country, AddressMapperConst.invalidAddress.country);
    t.is(result.email, AddressMapperConst.invalidAddress.email);
    t.is(result.phoneNumber, AddressMapperConst.invalidAddress.phone);
});


test('mapOrderInformationShipTo should handle incomplete AddressMapperConst.sourceAddress', t => {
    const result = invalidAddressMapper.mapUpdateTokenBillTo();
    t.is(result.firstName, AddressMapperConst.invalidAddress.firstName);
    t.is(result.lastName, AddressMapperConst.invalidAddress.lastName);
    t.is(result.address1, AddressMapperConst.invalidAddress.streetName);
    t.is(result.address2, AddressMapperConst.invalidAddress.additionalStreetInfo);
    t.is(result.locality, AddressMapperConst.invalidAddress.city);
    t.is(result.administrativeArea, AddressMapperConst.invalidAddress.region);
    t.is(result.postalCode, AddressMapperConst.invalidAddress.postalCode);
    t.is(result.country, AddressMapperConst.invalidAddress.country);
    t.is(result.email, AddressMapperConst.invalidAddress.email);
    t.is(result.phoneNumber, AddressMapperConst.invalidAddress.phone);
});

test('test empty object to the constructor', t => {
    const invalidData = new AddressMapper({});
    const result = invalidData.mapUpdateTokenBillTo();
    t.deepEqual(result, AddressMapperConst.invaliAddressResult);
});