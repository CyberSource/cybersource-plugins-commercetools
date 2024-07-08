import { AddressType } from "../types/Types";

export class Address {
    firstName?: string;
    lastName?: string;
    country?: string;
    streetName?: string;
    streetNumber?: string;
    postalCode?: string;
    city?: string;
    region?: string;
    email?: string;
    phone?: string;

    constructor(addressData: AddressType) {
        if (addressData?.firstName) this.firstName = addressData?.firstName;
        if (addressData?.lastName) this.lastName = addressData?.lastName;
        if (addressData?.country) this.country = addressData?.country;
        if (addressData?.streetName || addressData?.address1) this.streetName = addressData?.streetName || addressData?.address1;
        if (addressData?.streetNumber || addressData?.address2 || addressData?.buildingNumber) this.streetNumber = addressData?.streetNumber || addressData?.address2 || addressData?.buildingNumber;
        if (addressData?.postalCode) this.postalCode = addressData?.postalCode;
        if (addressData?.city) this.city = addressData?.city;
        if (addressData?.region || addressData?.administrativeArea) this.region = addressData?.region || addressData?.administrativeArea;
        if (addressData?.email) this.email = addressData?.email;
        if (addressData?.phone) this.phone = addressData?.phone;
    }
}
