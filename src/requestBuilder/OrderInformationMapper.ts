import { Ptsv2paymentsidcapturesOrderInformation, Ptsv2paymentsidrefundsOrderInformation, Ptsv2paymentsidreversalsOrderInformation, Ptsv2paymentsOrderInformation, Upv1capturecontextsOrderInformation } from 'cybersource-rest-client';

import { Constants } from '../constants/constants';
import { FunctionConstant } from '../constants/functionConstant';
import { AddressType, CustomerType, PaymentTransactionType, PaymentType } from '../types/Types';
import paymentUtils from '../utils/PaymentUtils';
import paymentValidator from '../utils/PaymentValidator';

import { LineItem } from './LineItemMapper';
import prepareFields from './PrepareFields';


export class OrderInformationMapper {
  private functionName: string;
  private paymentObject: PaymentType | null;
  private cartObj: any;
  private customerObject: Partial<CustomerType> | null;
  private address: AddressType | null;
  private service: string | null;
  private currencyCode: string;
  private fractionDigits: number;
  private updateTransactions: Partial<PaymentTransactionType> | null;
  private locale: string;

  constructor(functionName: string, paymentObj: PaymentType | null, updateTransactions: Partial<PaymentTransactionType> | null, cartObj: any, customerObj: Partial<CustomerType> | null, address: AddressType | null, service: string | null, currencyCode: string) {
    this.functionName = functionName;
    this.paymentObject = paymentObj;
    this.updateTransactions = updateTransactions;
    this.cartObj = cartObj;
    this.customerObject = customerObj;
    this.address = address;
    this.service = service;
    this.currencyCode = currencyCode;
    this.fractionDigits = paymentObj?.amountPlanned?.fractionDigits || 0;
    this.locale = cartObj?.locale;
  }

  getOrderInformation() {
    let orderInformation = this.createOrderInformation();
    switch (this.functionName) {
      case FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE:
        paymentValidator.setObjectValue(orderInformation, 'billTo', this.setBillTo(), '', Constants.STR_OBJECT, false);
        paymentValidator.setObjectValue(orderInformation, 'shipTo', this.setShipTo(), '', Constants.STR_OBJECT, false);
        paymentValidator.setObjectValue(orderInformation, 'lineItems', this.setLineItems(), '', Constants.STR_ARRAY, false);
        paymentValidator.setObjectValue(orderInformation, 'amountDetails', this.setAmountDetails(), '', Constants.STR_OBJECT, false);
        break;
      case FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE:
        paymentValidator.setObjectValue(orderInformation, 'billTo', this.setBillTo(), '', Constants.STR_OBJECT, false);
        paymentValidator.setObjectValue(orderInformation, 'amountDetails', this.setAmountDetails(), '', Constants.STR_OBJECT, false);
        break;
      case FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE:
        paymentValidator.setObjectValue(orderInformation, 'lineItems', this.setLineItems(), '', Constants.STR_ARRAY, false);
        paymentValidator.setObjectValue(orderInformation, 'amountDetails', this.setAmountDetails(), '', Constants.STR_OBJECT, false);
        break;
      case FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT:
        paymentValidator.setObjectValue(orderInformation, 'amountDetails', this.setAmountDetails(), '', Constants.STR_OBJECT, false);
        break;
      case FunctionConstant.FUNC_GET_REFUND_DATA:
      case FunctionConstant.FUNC_GET_CAPTURE_RESPONSE:
        paymentValidator.setObjectValue(orderInformation, 'amountDetails', this.setAmountDetails(), '', Constants.STR_OBJECT, false);
        break;
    }
    return orderInformation;
  }

  private createOrderInformation() {
    let orderInformation = {};
    switch (this.functionName) {
      case FunctionConstant.FUNC_GET_CAPTURE_RESPONSE:
        orderInformation = {} as Ptsv2paymentsidcapturesOrderInformation;
        break;
      case FunctionConstant.FUNC_GET_REFUND_DATA:
        orderInformation = {} as Ptsv2paymentsidrefundsOrderInformation;
        break;
      case FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE:
        orderInformation = {} as Ptsv2paymentsidreversalsOrderInformation;
        break;
      case FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE:
      case FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE:
        orderInformation = {} as Ptsv2paymentsOrderInformation;
        break;
      case FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT:
        orderInformation = {} as Upv1capturecontextsOrderInformation;
        break;
    }
    return orderInformation;
  }

  private setBillTo() {
    return (FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE === this.functionName) ? this.getBillToFromCartObject() : this.getBillToFromCustomerObject();
  }

  private setShipTo() {
    return this.getShipToFromCartObject();
  }

  private setLineItems() {
    let lineItems: any = [];
    if (this.cartObj && this.cartObj.lineItems) {
      paymentValidator.setObjectValue(lineItems, '', this.processLineItems(), '', Constants.STR_ARRAY, false);
      paymentValidator.setObjectValue(lineItems, '', this.processCustomLineItems(), '', Constants.STR_ARRAY, false);
      paymentValidator.setObjectValue(lineItems, '', this.processShippingInfo(), '', Constants.STR_ARRAY, false);
      paymentValidator.setObjectValue(lineItems, '', this.processDiscountsInfo(), '', Constants.STR_ARRAY, false);
    }
    return lineItems;
  }


  private setAmountDetails() {
    let centAmount = 0;
    let captureAmount = 0.0;
    let amountDetails;
    switch (this.functionName) {
      case FunctionConstant.FUNC_GET_CAPTURE_RESPONSE:
      case FunctionConstant.FUNC_GET_REFUND_DATA:
      case FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE:
        if (this.updateTransactions && this.paymentObject) {
          centAmount = this.updateTransactions?.amount?.centAmount ? this.updateTransactions.amount.centAmount : this.paymentObject?.amountPlanned?.centAmount;
          captureAmount = paymentUtils.convertCentToAmount(centAmount, this.paymentObject.amountPlanned.fractionDigits);
          amountDetails = prepareFields.getOrderInformationAmountDetails(this.functionName, captureAmount, this.paymentObject, this.cartObj, this.currencyCode, this.service);
        }
        break;
      case FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE:
        amountDetails = prepareFields.getOrderInformationAmountDetails(this.functionName, null, this.paymentObject, this.cartObj, this.currencyCode, this.service);
        break;
      case FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE: {
        const orderInformationAmountDetails = prepareFields.getOrderInformationAmountDetails(this.functionName, null, null, null, this.currencyCode, this.service);
        amountDetails = orderInformationAmountDetails;
        break;
      }
      case FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT:
        amountDetails = prepareFields.getOrderInformationAmountDetails(this.functionName, null, this.paymentObject, this.cartObj, this.currencyCode, this.service);
        break;
    }
    return amountDetails;
  }

  private getBillToFromCartObject() {
    return prepareFields.getOrderInformationBillToDetails(FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, this.cartObj, null, null);
  }

  private getBillToFromCustomerObject() {
    return prepareFields.getOrderInformationBillToDetails(FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE, null, this.address, this.customerObject);
  }

  private getShipToFromCartObject() {
    return prepareFields.getOrderInformationShipToDetails(this.cartObj, this.paymentObject?.custom?.fields.isv_shippingMethod);
  }

  private processLineItems() {
    return this.processLineItemDetails(this.cartObj.lineItems, false, false);
  }

  private processCustomLineItems() {
    let customLineItemDetails = [];
    if (this.cartObj.customLineItems) {
      customLineItemDetails = this.processLineItemDetails(this.cartObj.customLineItems, true, false);
    }
    return customLineItemDetails;
  }

  private createLineItemDetailsInstance(lineitem: any, unitPrice: number, item: any, isShipping: boolean, isCustom: boolean, isTotalPriceDiscount: boolean, lineItemTotalAmount: number): any {
    return new LineItem(lineitem, unitPrice, this.functionName, this.locale, item, this.paymentObject, isShipping, this.cartObj, isCustom, isTotalPriceDiscount, lineItemTotalAmount);
  }

  private processShippingInfo() {
    let shippingLineItems = [];
    if (Constants.SHIPPING_MODE_MULTIPLE === this.cartObj.shippingMode && this.cartObj.shipping) {
      shippingLineItems = this.processLineItemDetails(this.cartObj.shipping, false, true);
    } else if (this.cartObj.shippingInfo) {
      const shippingCost = this.cartObj.shippingInfo.discountedPrice
        ? paymentUtils.convertCentToAmount(this.cartObj.shippingInfo.discountedPrice.value.centAmount, this.fractionDigits)
        : paymentUtils.convertCentToAmount(this.cartObj.shippingInfo.price.centAmount, this.fractionDigits);
      const lineItemsDetailsInstance = this.createLineItemDetailsInstance(this.cartObj, shippingCost, null, true, false, false, shippingCost);
      const lineItemDetails = lineItemsDetailsInstance.getLineItemDetails();
      if (lineItemDetails) {
        shippingLineItems.push(lineItemDetails);
      }
    }
    return shippingLineItems;
  }

  private processDiscountsInfo() {
    let lineItems = [];
    if (this.cartObj.discountOnTotalPrice) {
      const unitPrice = paymentUtils.convertCentToAmount(this.cartObj.discountOnTotalPrice.discountedAmount.centAmount, this.cartObj.discountOnTotalPrice.discountedAmount.fractionDigits);
      const lineItemsDetailsInstance = this.createLineItemDetailsInstance(this.cartObj, unitPrice, null, false, false, true, unitPrice);
      const lineItemDetails = lineItemsDetailsInstance.getLineItemDetails();
      if (lineItemDetails) {
        lineItems.push(lineItemDetails);
      }
    }
    return lineItems;
  }

  private processLineItemDetails(items: any[], isCustom: boolean, isShipping: boolean) {
    let lineItems = [];
    for (let item of items) {
      let lineItemTotalAmount = 0;
      const discountedPricePerQuantity = item?.discountedPricePerQuantity;
      if (discountedPricePerQuantity && 0 < discountedPricePerQuantity.length) {
        for (let discountedItem of discountedPricePerQuantity) {
          let unitPrice = paymentUtils.convertCentToAmount(discountedItem.discountedPrice.value.centAmount, this.fractionDigits);
          lineItemTotalAmount = unitPrice * discountedItem.quantity;
          let lineItemsDetailsInstance = this.createLineItemDetailsInstance(item, unitPrice, discountedItem, isShipping, isCustom, false, lineItemTotalAmount);
          const lineItemsDetails = lineItemsDetailsInstance.getLineItemDetails();
          if (lineItemsDetails) {
            lineItems.push(lineItemsDetails);
          }
        }
      } else {
        let unitPrice;
        if (item?.totalPrice?.centAmount) {
          lineItemTotalAmount = paymentUtils.convertCentToAmount(item?.totalPrice?.centAmount, this.fractionDigits);
        }
        if (isCustom) {
          unitPrice = paymentUtils.convertCentToAmount(item.money.centAmount, this.fractionDigits);
        } else if (item?.shippingInfo?.price?.centAmount) {
          unitPrice = item?.shippingInfo?.discountedPrice ? paymentUtils.convertCentToAmount(item?.shippingInfo?.discountedPrice?.value.centAmount, this.fractionDigits) : paymentUtils.convertCentToAmount(item.shippingInfo.price.centAmount, this.fractionDigits);
          lineItemTotalAmount = unitPrice;
        } else {
          unitPrice = item?.price?.discounted?.value?.centAmount ? paymentUtils.convertCentToAmount(item?.price?.discounted?.value?.centAmount, this.fractionDigits) : paymentUtils.convertCentToAmount(item?.price?.value?.centAmount, this.fractionDigits);
        }
        const lineItemsDetailsInstance = this.createLineItemDetailsInstance(item, unitPrice, null, isShipping, isCustom, false, lineItemTotalAmount);
        const lineItemsDetails = lineItemsDetailsInstance.getLineItemDetails();
        if (lineItemsDetails) {
          lineItems.push(lineItemsDetails);
        }
      }
    }
    return lineItems;
  }
}
