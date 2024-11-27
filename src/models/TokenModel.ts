import { Constants } from "../constants/constants";
import { CustomerCustomType } from "../types/Types";
import PaymentUtils from "../utils/PaymentUtils";
import paymentValidator from "../utils/PaymentValidator";

export class Token {
    alias?: string;
    value?: string;
    paymentToken?: string;
    instrumentIdentifier?: string;
    cardType?: string;
    cardName?: string;
    cardNumber?: string;
    cardExpiryMonth?: string;
    cardExpiryYear?: string;
    addressId?: string;
    timestamp?: Date | string;
    address?: Record<string, unknown>;

    constructor(customFields: Partial<CustomerCustomType>, customerTokenId: string | undefined, paymentToken: string | undefined, instrumentIdentifier: string | undefined, addressId: string | undefined, address: any) {
        paymentValidator.setObjectValue(this, 'alias', customFields, 'isv_tokenAlias', Constants.STR_STRING, false);
        paymentValidator.setObjectValue(this, 'value', customerTokenId, '', Constants.STR_STRING, false);
        paymentValidator.setObjectValue(this, 'paymentToken', paymentToken, '', Constants.STR_STRING, false);
        paymentValidator.setObjectValue(this, 'instrumentIdentifier', instrumentIdentifier, '', Constants.STR_STRING, false);
        paymentValidator.setObjectValue(this, 'cardType', customFields, 'isv_cardType', Constants.STR_STRING, false);
        paymentValidator.setObjectValue(this, 'cardName', customFields, 'isv_cardType', Constants.STR_STRING, false);
        paymentValidator.setObjectValue(this, 'cardNumber', customFields, 'isv_maskedPan', Constants.STR_STRING, false);
        paymentValidator.setObjectValue(this, 'cardExpiryMonth', customFields, 'isv_cardExpiryMonth', Constants.STR_STRING, false);
        paymentValidator.setObjectValue(this, 'cardExpiryYear', customFields, 'isv_cardExpiryYear', Constants.STR_STRING, false);
        paymentValidator.setObjectValue(this, 'addressId', addressId, '', Constants.STR_STRING, false);
        paymentValidator.setObjectValue(this, 'address', address, '', Constants.STR_OBJECT, false);
        this.timestamp = PaymentUtils.getDate(Date.now(), true) as string;
    }
}