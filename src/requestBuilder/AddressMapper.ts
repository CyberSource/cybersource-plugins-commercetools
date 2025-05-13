import { Ptsv2paymentsOrderInformationBillTo, Ptsv2paymentsOrderInformationShipTo, Tmsv2customersEmbeddedDefaultPaymentInstrumentBillTo } from 'cybersource-rest-client';

import { AddressType } from '../types/Types';

/**
 * This class maps address information from the source address object to
 * various CyberSource billing and shipping address objects.
 */
export class AddressMapper {
    private sourceAddress: Partial<AddressType>;

    /**
     * Creates an instance of AddressMapper.
     * @param {Partial<AddressType>} sourceAddress - The source address object to map from.
     */
    constructor(sourceAddress: Partial<AddressType>) {
        this.sourceAddress = sourceAddress;
    }

    /**
     * Maps the source address to a CyberSource update token billing address object.
     * @returns {Tmsv2customersEmbeddedDefaultPaymentInstrumentBillTo} - The mapped billing address object.
     */
    mapUpdateTokenBillTo(): Tmsv2customersEmbeddedDefaultPaymentInstrumentBillTo {
        const updateTokenBillTo = {} as Tmsv2customersEmbeddedDefaultPaymentInstrumentBillTo;
        CommonAddressMapper.mapCommonAddressFields(this.sourceAddress, updateTokenBillTo);
        return updateTokenBillTo;
    }

    /**
     * Maps the source address to a CyberSource order information billing address object.
     * @returns {Ptsv2paymentsOrderInformationBillTo} - The mapped billing address object.
     */
    mapOrderInformationBillTo(): Ptsv2paymentsOrderInformationBillTo {
        const orderInformationBillTo = {} as Ptsv2paymentsOrderInformationBillTo;
        CommonAddressMapper.mapCommonAddressFields(this.sourceAddress, orderInformationBillTo);
        return orderInformationBillTo;
    }

    /**
     * Maps the source address to a CyberSource order information shipping address object.
     * @returns {Ptsv2paymentsOrderInformationShipTo} - The mapped shipping address object.
     */
    mapOrderInformationShipto(): Ptsv2paymentsOrderInformationShipTo {
        const orderInformationShipTo = {} as Ptsv2paymentsOrderInformationShipTo;
        CommonAddressMapper.mapCommonAddressFields(this.sourceAddress, orderInformationShipTo);
        return orderInformationShipTo;
    }
}

/**
 * This class provides a common mapping method to transfer common address fields
 * from a source address object to a target address object.
 */
class CommonAddressMapper {
    /**
     * Maps common address fields from the source address to the target address object.
     * @param {Partial<AddressType>} sourceAddress - The source address object containing the address details.
     * @param {Ptsv2paymentsOrderInformationBillTo | Ptsv2paymentsOrderInformationShipTo} targetAddress - The target address object to which the address details will be mapped.
     */
    static mapCommonAddressFields(sourceAddress: Partial<AddressType>, targetAddress: Ptsv2paymentsOrderInformationBillTo | Ptsv2paymentsOrderInformationShipTo): void {
        targetAddress.firstName = sourceAddress?.firstName || '';
        targetAddress.lastName = sourceAddress?.lastName || '';
        targetAddress.address1 = sourceAddress?.streetName || sourceAddress?.address1 || '';
        targetAddress.address2 = sourceAddress?.additionalStreetInfo || sourceAddress?.streetNumber || sourceAddress?.buildingNumber || '';
        targetAddress.locality = sourceAddress?.city || sourceAddress?.locality || '';
        targetAddress.administrativeArea = sourceAddress?.region || sourceAddress?.administrativeArea || '';
        targetAddress.postalCode = sourceAddress?.postalCode || '';
        targetAddress.country = sourceAddress?.country || '';
        targetAddress.email = sourceAddress?.email || '';
        targetAddress.phoneNumber = sourceAddress?.phone || sourceAddress?.mobile || '';
    }
}
