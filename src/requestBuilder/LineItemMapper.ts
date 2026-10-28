import { Cart, Payment } from '@commercetools/platform-sdk';
import { Ptsv2paymentsidreversalsOrderInformationLineItems, Ptsv2paymentsOrderInformationLineItems } from 'cybersource-rest-client';

import { FunctionConstant } from '../constants/functionConstant';
import { Constants } from '../constants/paymentConstants';
import paymentUtils from '../utils/PaymentUtils';
class LineItemFactory {
    static createLineItem(functionName: string): Ptsv2paymentsidreversalsOrderInformationLineItems | Ptsv2paymentsOrderInformationLineItems {
        if (FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE === functionName || FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT === functionName) {
            return {} as Ptsv2paymentsOrderInformationLineItems;
        } else {
            return {} as Ptsv2paymentsidreversalsOrderInformationLineItems;
        }
    }
}

class LineItemMapper {
    /**
     * Helper to format ALL monetary values to CyberSource format
     */
    private static formatAmount(value?: number | string): string {
        const amount = Number(value || 0);
        return amount.toFixed(2);
    }
    static mapLineItemValues(
        functionName: string,
        lineItemTotalAmount: number,
        productName: string,
        productSku: string,
        productCode: string,
        unitPrice: number,
        quantity: number,
        discountAmount?: number,
        taxRate?: number,
        netAmountForTax?: number,
        productDescription?: string,
        typeOfSupply?: string,
    ): Ptsv2paymentsidreversalsOrderInformationLineItems | Ptsv2paymentsOrderInformationLineItems {
        const orderInformationLineItem = LineItemFactory.createLineItem(functionName);

        (orderInformationLineItem as any).totalAmount = LineItemMapper.formatAmount(lineItemTotalAmount);

        orderInformationLineItem.productName = productName;
        orderInformationLineItem.productSku = productSku;
        orderInformationLineItem.productCode = productCode;

        (orderInformationLineItem as Ptsv2paymentsOrderInformationLineItems).productDescription = productDescription || productName;
        (orderInformationLineItem as Ptsv2paymentsOrderInformationLineItems).typeOfSupply = typeOfSupply || (Constants.SHIPPING_AND_HANDLING === productCode ? '01' : '00');

        (orderInformationLineItem as any).unitPrice = LineItemMapper.formatAmount(unitPrice);

        orderInformationLineItem.quantity = quantity;

        (orderInformationLineItem as any).discountAmount = LineItemMapper.formatAmount(discountAmount);
        if (functionName === FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE || functionName === FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT) {
            const taxBaseAmount = netAmountForTax !== undefined && netAmountForTax !== null ? netAmountForTax : lineItemTotalAmount;

            const taxAmount = taxRate !== undefined && taxRate !== null ? taxRate * taxBaseAmount : 0;

            (orderInformationLineItem as Ptsv2paymentsOrderInformationLineItems).taxAmount = LineItemMapper.formatAmount(taxAmount);
        }

        return orderInformationLineItem;
    }
}
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

        this.fractionDigits = this.paymentObj?.amountPlanned?.fractionDigits ?? this.cartObj?.totalPrice?.fractionDigits ?? this.cartObj?.taxedPrice?.totalGross?.fractionDigits ?? 2;
    }
    /**
     * Dynamically resolves the coupon/discount name from the cart's discount data.
     * Reads from discountCodes or discountOnTotalPrice.includedDiscounts on the cart object.
     * Falls back to 'coupon' only if no cart-level discount data is available.
     */
    private getCouponProductName(): string {
        // Try from discount codes applied to the cart (discountCodes array)
        const discountCodes = this.lineItem?.discountCodes;
        if (Array.isArray(discountCodes) && discountCodes.length > 0) {
            const firstCodeInfo = discountCodes[0];
            const codeObj = (firstCodeInfo as any)?.discountCode?.obj;
            if (codeObj?.name) {
                const resolved = this.getLocalizedString(codeObj.name);
                if (resolved) return resolved;
            }
            if (typeof codeObj?.code === 'string' && codeObj.code) {
                return codeObj.code;
            }
        }

        // Try from includedDiscounts on discountOnTotalPrice
        const includedDiscounts = this.lineItem?.discountOnTotalPrice?.includedDiscounts;
        if (Array.isArray(includedDiscounts) && includedDiscounts.length > 0) {
            const discountObj = (includedDiscounts[0] as any)?.discount?.obj;
            if (discountObj?.name) {
                const resolved = this.getLocalizedString(discountObj.name);
                if (resolved) return resolved;
            }
            if (typeof discountObj?.key === 'string' && discountObj.key) {
                return discountObj.key;
            }
        }

        return 'coupon';
    }

    /**
     * Sets values for a coupon price line item.
     * @returns {any} - The mapped line item object for the coupon.
     */
    private setCouponPriceLineItemValues() {
        const couponName = this.getCouponProductName();
        return LineItemMapper.mapLineItemValues(this.functionName, this.lineItemTotalAmount, couponName, couponName, 'coupon', this.unitPrice, 1, undefined, undefined, undefined, couponName, '01');
    }
    private getTaxRate(isShipping: boolean): number | undefined {
        if (isShipping) {
            return this.cartObj.shippingInfo?.taxRate?.amount;
        }
        return this.lineItem?.taxRate?.amount;
    }
    private convertMoneyToAmount(moneyObj: any): number | undefined {
        if (!moneyObj || moneyObj.centAmount === undefined || moneyObj.fractionDigits === undefined) {
            return undefined;
        }
        return paymentUtils.convertCentToAmount(moneyObj.centAmount, moneyObj.fractionDigits);
    }

    private getNetAmountForTax(isShipping: boolean, quantity: number, taxRate?: number): number {
        let resolvedNetAmount: number | undefined;

        if (isShipping) {
            resolvedNetAmount = this.convertMoneyToAmount(this.lineItem?.shippingInfo?.taxedPrice?.totalNet);
        } else {
            const fullLineNetAmount = this.convertMoneyToAmount(this.lineItem?.taxedPrice?.totalNet);
            const fullLineQuantity = Number(this.lineItem?.quantity || quantity || 1);

            if (fullLineNetAmount !== undefined && fullLineQuantity > 0) {
                resolvedNetAmount = (fullLineNetAmount / fullLineQuantity) * Number(quantity || 1);
            }
        }

        if (resolvedNetAmount === undefined) {
            if (taxRate !== undefined && taxRate !== null && taxRate > -1) {
                resolvedNetAmount = this.lineItemTotalAmount / (1 + taxRate);
            } else {
                resolvedNetAmount = this.lineItemTotalAmount;
            }
        }

        return paymentUtils.roundOff(resolvedNetAmount, this.fractionDigits);
    }
    private getLocalizedString(value: any): string {
        if ('string' === typeof value) {
            return value;
        }
        if (value && 'object' === typeof value) {
            if (this.locale && 'string' === typeof value[this.locale] && value[this.locale]) {
                return value[this.locale];
            }
            const firstValue = Object.values(value).find((entry) => 'string' === typeof entry && '' !== entry);
            return 'string' === typeof firstValue ? firstValue : '';
        }
        return '';
    }

    private getTypeOfSupply(isShipping: boolean, productCode: string): string {
        if (isShipping || Constants.SHIPPING_AND_HANDLING === productCode) {
            return '01';
        }

        const lineItemTypeOfSupply = this.lineItem?.custom?.fields?.isv_typeOfSupply;
        if ('string' === typeof lineItemTypeOfSupply && '' !== lineItemTypeOfSupply.trim()) {
            const trimmedValue = lineItemTypeOfSupply.trim().toUpperCase();
            return ['00', '01'].includes(trimmedValue) ? trimmedValue : '00';
        }

        const variantAttributes = this.lineItem?.variant?.attributes;
        if (Array.isArray(variantAttributes)) {
            const supplyAttribute = variantAttributes.find((attribute: any) => 'typeOfSupply' === attribute?.name || 'isv_typeOfSupply' === attribute?.name);
            if ('string' === typeof supplyAttribute?.value && '' !== supplyAttribute.value.trim()) {
                const trimmedAttrValue = supplyAttribute.value.trim().toUpperCase();
                return ['00', '01'].includes(trimmedAttrValue) ? trimmedAttrValue : '00';
            }
        }

        return '00';
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
        let netAmountForTax = 0;
        let item: any;
        let discountArray: any;
        if (isShipping) {
            item = this.lineItem.shippingInfo;
            discountArray = item?.discountedPrice?.includedDiscounts;
            unitPrice = this.unitPrice;
            quantity = 1;
            taxRate = this.getTaxRate(isShipping);
            netAmountForTax = this.getNetAmountForTax(isShipping, quantity, taxRate);
        } else {
            item = this.item || this.lineItem;
            discountArray = item?.discountedPrice?.includedDiscounts;
            unitPrice = this.unitPrice;
            quantity = this.item ? this.item.quantity : this.lineItem.quantity;
            taxRate = this.getTaxRate(isShipping);
            netAmountForTax = this.getNetAmountForTax(isShipping, quantity, taxRate);
        }
        if (discountArray) {
            discountArray.forEach((discount: any) => {
                discountPrice += paymentUtils.convertCentToAmount(discount?.discountedAmount?.centAmount, this.fractionDigits) * (isShipping ? 1 : quantity);
            });
        }
        const discountAmount = paymentUtils.roundOff(discountPrice, this.fractionDigits);

        const productName = isShipping ? Constants.SHIPPING_AND_HANDLING : this.getLocalizedString(this.lineItem?.name);
        const productDescription = isShipping ? Constants.SHIPPING_AND_HANDLING : this.getLocalizedString(this.lineItem?.description) || productName;

        const productCode = isShipping ? Constants.SHIPPING_AND_HANDLING : Constants.STRING_DEFAULT;
        const typeOfSupply = this.getTypeOfSupply(isShipping, productCode);

        return LineItemMapper.mapLineItemValues(
            this.functionName,
            this.lineItemTotalAmount,
            productName,
            isShipping ? Constants.SHIPPING_AND_HANDLING : this.isCustomLineItem ? this.lineItem.slug : this.lineItem.variant.sku,
            productCode,
            unitPrice,
            quantity,
            discountAmount,
            taxRate,
            netAmountForTax,
            productDescription,
            typeOfSupply,
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
