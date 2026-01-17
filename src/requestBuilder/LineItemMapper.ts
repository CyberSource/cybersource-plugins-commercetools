import { Cart, Payment } from '@commercetools/platform-sdk';
import { Ptsv2paymentsidreversalsOrderInformationLineItems, Ptsv2paymentsOrderInformationLineItems } from 'cybersource-rest-client';

import { FunctionConstant } from '../constants/functionConstant';
import { Constants } from '../constants/paymentConstants';
import paymentUtils from '../utils/PaymentUtils';
import paymentValidator from '../utils/PaymentValidator';


/**
 * Factory class responsible for creating the appropriate line item object 
 * based on the function being executed.
 */
class LineItemFactory {
    /**
     * Creates and returns a line item object based on the provided function name.
     * @param {string} functionName - The name of the function requesting a line item.
     * @returns {Ptsv2paymentsidreversalsOrderInformationLineItems | Ptsv2paymentsOrderInformationLineItems} 
     *          The appropriate line item object based on the function.
     */
    static createLineItem(functionName: string): Ptsv2paymentsidreversalsOrderInformationLineItems | Ptsv2paymentsOrderInformationLineItems {
        if (FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE === functionName) {
            return {} as Ptsv2paymentsidreversalsOrderInformationLineItems;
        } else {
            return {} as Ptsv2paymentsOrderInformationLineItems;
        }
    }
}

/**
 * Mapper class responsible for mapping values to line item objects.
 */
class LineItemMapper {
    /**
     * Maps values to the line item object and returns the populated object.
     * @param {string} functionName - The name of the function requesting a line item.
     * @param {number} lineItemTotalAmount - The total amount for the line item.
     * @param {string} productName - The name of the product.
     * @param {string} productSku - The SKU of the product.
     * @param {string} productCode - The code representing the product.
     * @param {number} unitPrice - The unit price of the product.
     * @param {number} quantity - The quantity of the product.
     * @param {number} [discountAmount] - The discount applied to the product.
     * @param {number} [taxRate] - The tax rate applied to the product.
     * @returns {Ptsv2paymentsidreversalsOrderInformationLineItems | Ptsv2paymentsOrderInformationLineItems} - The populated line item object.
     */
    static mapLineItemValues(functionName: string, lineItemTotalAmount: number, productName: string, productSku: string, productCode: string,
        unitPrice: number, quantity: number, discountAmount?: number, taxRate?: number): Ptsv2paymentsidreversalsOrderInformationLineItems | Ptsv2paymentsOrderInformationLineItems {
        let orderInformationLineItem = LineItemFactory.createLineItem(functionName);
        orderInformationLineItem.totalAmount = lineItemTotalAmount;
        orderInformationLineItem.productName = productName;
        orderInformationLineItem.productSku = productSku;
        orderInformationLineItem.productCode = productCode;
        orderInformationLineItem.unitPrice = unitPrice;
        orderInformationLineItem.quantity = quantity;
        orderInformationLineItem.discountAmount = discountAmount;
        if (functionName === FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE) {
            (orderInformationLineItem as Ptsv2paymentsOrderInformationLineItems).taxAmount = taxRate ? String(taxRate * lineItemTotalAmount) : undefined;
        }
        paymentValidator.setObjectValue(orderInformationLineItem, 'taxRate', taxRate, '', Constants.STR_NUMBER, false);
        return orderInformationLineItem;
    }
}

/**
 * Main class responsible for handling and managing line items for payments.
 */
export class LineItem {
    private isShipping: boolean;
    private isCustomLineItem: boolean;
    private isTotalPriceDiscount: boolean;
    private functionName: string;
    private locale: string;
    private unitPrice: number;
    private lineItemTotalAmount: number;
    private fractionDigits: number;
    private paymentObj: Payment | null;
    private lineItem: any;
    private item: any;
    private cartObj: Cart;

    /**
     * Constructor for the LineItem class, initializes line item properties.
     * @param {any} lineItem - The line item data object.
     * @param {number} unitPrice - The unit price of the item.
     * @param {string} functionName - The name of the function being called.
     * @param {string} locale - The locale for the item.
     * @param {any} item - Additional item data.
     * @param {Payment | null} paymentObj - The payment object for processing.
     * @param {boolean} isShipping - Flag to indicate if the item is for shipping.
     * @param {Cart} cartObj - The cart object containing item details.
     * @param {boolean} isCustomLineItem - Flag to indicate if the item is a custom line item.
     * @param {boolean} isTotalPriceDiscount - Flag to indicate if the total price is discounted.
     * @param {number} lineItemTotalAmount - The total amount for the line item.
     */
    constructor(lineItem: any, unitPrice: number, functionName: string, locale: string, item: any, paymentObj: Payment | null, isShipping: boolean, cartObj: Cart, isCustomLineItem: boolean, isTotalPriceDiscount: boolean, lineItemTotalAmount: number) {
        this.lineItem = lineItem;
        this.unitPrice = unitPrice;
        this.functionName = functionName;
        this.locale = locale;
        this.item = item;
        this.paymentObj = paymentObj;
        this.isShipping = isShipping;
        this.cartObj = cartObj;
        this.isCustomLineItem = isCustomLineItem;
        this.isTotalPriceDiscount = isTotalPriceDiscount;
        this.lineItemTotalAmount = lineItemTotalAmount;
        this.fractionDigits = this.paymentObj?.amountPlanned?.fractionDigits || 0;
    }

    /**
     * Sets values for a coupon price line item.
     * @returns {any} - The mapped line item object for the coupon.
     */
    private setCouponPriceLineItemValues() {
        return LineItemMapper.mapLineItemValues(this.functionName, this.lineItemTotalAmount, 'coupon', 'coupon', 'coupon', this.unitPrice, 1);
    }

    private getTaxRate(isShipping: boolean): number | undefined {
        if (isShipping) {
            return this.cartObj.shippingInfo?.taxRate?.amount;
        }
        return this.lineItem?.taxRate?.amount;
    }

    /**
     * Sets values for a line item based on whether it is a shipping item.
     * @param {boolean} isShipping - Indicates if the line item is for shipping.
     * @returns {any} - The mapped line item object with values set.
     */
    private setLineItemValues(isShipping: boolean): any {
        let discountPrice = 0;
        let unitPrice: number;
        let quantity: number;
        let taxRate = undefined;
        let item: any;
        let discountArray: any;
        if (isShipping) {
            item = this.lineItem.shippingInfo;
            discountArray = item?.discountedPrice?.includedDiscounts;
            unitPrice = this.unitPrice;
            quantity = 1;
            taxRate = this.getTaxRate(isShipping);
        } else {
            item = this.item || this.lineItem;
            discountArray = item?.discountedPrice?.includedDiscounts;
            unitPrice = this.unitPrice;
            quantity = this.item ? this.item.quantity : this.lineItem.quantity;
            taxRate = this.getTaxRate(isShipping);
        }
        if (discountArray) {
            discountArray.forEach((discount: any) => {
                discountPrice += paymentUtils.convertCentToAmount(discount?.discountedAmount?.centAmount, this.fractionDigits) * (isShipping ? 1 : quantity);
            });
        }
        const discountAmount = paymentUtils.roundOff(discountPrice, this.fractionDigits);
        return LineItemMapper.mapLineItemValues(
            this.functionName, this.lineItemTotalAmount,
            isShipping ? item.shippingMethodName : this.lineItem.name[this.locale],
            isShipping ? Constants.SHIPPING_AND_HANDLING : (this.isCustomLineItem ? this.lineItem.slug : this.lineItem.variant.sku),
            isShipping ? Constants.SHIPPING_AND_HANDLING : Constants.STRING_DEFAULT,
            unitPrice,
            quantity,
            discountAmount,
            taxRate
        );
    }

    /**
     * Retrieves the details of the line item based on the flags set.
     * @returns {any} - The populated line item object.
     */
    public getLineItemDetails() {
        return this.isTotalPriceDiscount ? this.setCouponPriceLineItemValues() : this.setLineItemValues(this.isShipping);
    }
}