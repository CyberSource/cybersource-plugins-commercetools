import { Ptsv2paymentsidreversalsOrderInformationLineItems, Ptsv2paymentsOrderInformationLineItems } from 'cybersource-rest-client';

import { Constants } from '../constants/constants';
import { FunctionConstant } from '../constants/functionConstant';
import { PaymentType } from "../types/Types";
import paymentUtils from '../utils/PaymentUtils';
import paymentValidator from '../utils/PaymentValidator';

export class LineItem {
    private isShipping: boolean;
    private isCustomLineItem: boolean;
    private isTotalPriceDiscount: boolean;
    private unitPrice: number;
    private lineItemTotalAmount: number;
    private fractionDigits: number;
    private functionName: string;
    private locale: string;
    private lineItem: any;
    private item: any;
    private paymentObj: PaymentType | null;
    private cartObj: any;

    constructor(lineItem: any, unitPrice: number, functionName: string, locale: string, item: any, paymentObj: PaymentType | null, isShipping: boolean, cartObj: any, isCustomLineItem: boolean, isTotalPriceDiscount: boolean, lineItemTotalAmount: number) {
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

    private createLineItem() {
        if (FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE === this.functionName) {
            return {} as Ptsv2paymentsidreversalsOrderInformationLineItems;
        } else {
            return {} as Ptsv2paymentsOrderInformationLineItems;
        }
    }

    private mapLineItemValues(productName: string, productSku: string, productCode: string, unitPrice: number, quantity: number, discountAmount?: number, taxRate?: number) {
        let orderInformationLineItem = this.createLineItem();
        orderInformationLineItem.totalAmount = this.lineItemTotalAmount;
        orderInformationLineItem.productName = productName;
        orderInformationLineItem.productSku = productSku;
        orderInformationLineItem.productCode = productCode;
        orderInformationLineItem.unitPrice = unitPrice;
        orderInformationLineItem.quantity = quantity;
        orderInformationLineItem.discountAmount = discountAmount;
        paymentValidator.setObjectValue(orderInformationLineItem, 'taxRate', taxRate, '', Constants.STR_STRING, false);
        return orderInformationLineItem;
    }

    private setCouponPriceLineItemValues() {
        return this.mapLineItemValues('coupon', 'coupon', 'coupon', this.unitPrice, 1);
    }

    private setLineItemValues(isShipping: boolean): any {
        let discountPrice = 0;
        let item: any;
        let discountArray: any;
        let unitPrice: number
        let quantity: number;
        let taxRate: number;
        if (isShipping) {
            item = this.lineItem.shippingInfo;
            discountArray = item?.discountedPrice?.includedDiscounts;
            unitPrice = this.unitPrice;
            quantity = 1;
            taxRate = this.cartObj?.shipping && this.cartObj.shipping[0]?.shippingInfo?.taxRate?.includedInPrice
                ? this.cartObj.shipping[0].shippingInfo.taxRate.amount
                : undefined;
        } else {
            item = this.item || this.lineItem;
            discountArray = item?.discountedPrice?.includedDiscounts;
            unitPrice = this.unitPrice;
            quantity = this.item ? this.item.quantity : this.lineItem.quantity;
            taxRate = this.lineItem?.taxRate?.includedInPrice ? this.lineItem.taxRate.amount : undefined;
        }
        if (discountArray) {
            discountArray.forEach((discount: any) => {
                discountPrice += paymentUtils.convertCentToAmount(discount?.discountedAmount?.centAmount, this.fractionDigits) * (isShipping ? 1 : quantity);
            });
        }
        const discountAmount = paymentUtils.roundOff(discountPrice, this.fractionDigits);
        return this.mapLineItemValues(
            isShipping ? item.shippingMethodName : this.lineItem.name[this.locale],
            isShipping ? Constants.SHIPPING_AND_HANDLING : (this.isCustomLineItem ? this.lineItem.slug : this.lineItem.variant.sku),
            isShipping ? Constants.SHIPPING_AND_HANDLING : Constants.STRING_DEFAULT,
            unitPrice,
            quantity,
            discountAmount,
            taxRate
        );
    }

    public getLineItemDetails() {
        return this.isTotalPriceDiscount ? this.setCouponPriceLineItemValues() : this.setLineItemValues(this.isShipping);
    }
}
