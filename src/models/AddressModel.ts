import { Constants } from "../constants/constants";
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
