import { Ptsv2paymentsOrderInformationBillTo, Ptsv2paymentsOrderInformationShipTo, Tmsv2customersEmbeddedDefaultPaymentInstrumentBillTo } from 'cybersource-rest-client';

import { AddressType } from '../types/Types';

export class AddressMapper {
    private sourceAddress: Partial<AddressType>;

    constructor(sourceAddress: Partial<AddressType>) {
        this.sourceAddress = sourceAddress;
    }

    mapUpdateTokenBillTo() {
        const updateTokenBillTo = {} as Tmsv2customersEmbeddedDefaultPaymentInstrumentBillTo;
        this.mapCommonAddressFields(updateTokenBillTo);
        return updateTokenBillTo;
    }

    mapOrderInformationBillTo() {
        const orderInformationBillTo = {} as Ptsv2paymentsOrderInformationBillTo;
        this.mapCommonAddressFields(orderInformationBillTo);
        return orderInformationBillTo;
    }

    mapOrderInformationShipto() {
        const orderInformationShipTo = {} as Ptsv2paymentsOrderInformationShipTo;
        this.mapCommonAddressFields(orderInformationShipTo);
        return orderInformationShipTo;
    }

    private mapCommonAddressFields(targetAddress: any): void {
        targetAddress.firstName = this.sourceAddress?.firstName;
        targetAddress.lastName = this.sourceAddress?.lastName;
        targetAddress.address1 = this.sourceAddress?.streetName || this.sourceAddress?.address1;
        targetAddress.address2 = this.sourceAddress?.additionalStreetInfo || this.sourceAddress?.streetNumber || this.sourceAddress?.buildingNumber;
        targetAddress.locality = this.sourceAddress?.city || this.sourceAddress?.locality;
        targetAddress.administrativeArea = this.sourceAddress?.region || this.sourceAddress?.administrativeArea;
        targetAddress.postalCode = this.sourceAddress?.postalCode;
        targetAddress.country = this.sourceAddress?.country;
        targetAddress.email = this.sourceAddress?.email;
        targetAddress.phoneNumber = this.sourceAddress?.phone || this.sourceAddress?.mobile;
    }
}