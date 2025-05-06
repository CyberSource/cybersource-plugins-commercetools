import { Constants } from "../constants/paymentConstants";
import { AddressType } from "../types/Types";
import paymentValidator from "../utils/PaymentValidator";

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

    /**
        * Constructor for the Address class.
        * It initializes the address fields by mapping values from the given addressData.
        * If specific fields are not available in the provided addressData, fallback logic is used to fill in the missing values.
        * 
        * @param {Partial<AddressType>} addressData - Partial object containing address data to be mapped.
        */
    constructor(addressData: Partial<AddressType>) {
        paymentValidator.setObjectValue(this, 'firstName', addressData, 'firstName', Constants.STR_STRING, false);
        paymentValidator.setObjectValue(this, 'lastName', addressData, 'lastName', Constants.STR_STRING, false);
        paymentValidator.setObjectValue(this, 'country', addressData, 'country', Constants.STR_STRING, false);
        paymentValidator.setObjectValue(this, 'streetName', addressData, 'streetName', Constants.STR_STRING, false);
        if (!this.streetName) {
            this.streetName = addressData.address1;
        }
        paymentValidator.setObjectValue(this, 'streetNumber', addressData, 'streetNumber', Constants.STR_STRING, false);
        if (!this.streetNumber) {
            this.streetNumber = addressData.address2 || addressData.buildingNumber;
        }
        paymentValidator.setObjectValue(this, 'postalCode', addressData, 'postalCode', Constants.STR_STRING, false);
        paymentValidator.setObjectValue(this, 'city', addressData, 'city', Constants.STR_STRING, false);
        if (!this.city) {
            this.city = addressData?.locality;
        }
        paymentValidator.setObjectValue(this, 'region', addressData, 'region', Constants.STR_STRING, false);
        if (!this.region) {
            this.region = addressData.administrativeArea;
        }
        paymentValidator.setObjectValue(this, 'email', addressData, 'email', Constants.STR_STRING, false);
        paymentValidator.setObjectValue(this, 'phone', addressData, 'phone', Constants.STR_STRING, false);
        if (!this.phone) {
            this.phone = addressData?.phoneNumber;
        }
    }
}
