import { Ptsv2paymentsidcapturesOrderInformation, Ptsv2paymentsidrefundsOrderInformation, Ptsv2paymentsidreversalsOrderInformation, Ptsv2paymentsOrderInformation, Upv1capturecontextsOrderInformation } from 'cybersource-rest-client';

import { Constants } from '../constants/constants';
import { FunctionConstant } from '../constants/functionConstant';
import { AddressType, CustomerType, PaymentTransactionType, PaymentType } from '../types/Types';
import paymentUtils from '../utils/PaymentUtils';
import paymentValidator from '../utils/PaymentValidator';

import { LineItem } from './LineItemMapper';
import prepareFields from './PrepareFields';

class OrderInformationFactory {
  /**
  * Creates an order information object based on the provided function name.
  * 
  * @param {string} functionName - The name of the function requesting the order information.
  * @returns {object} - An object representing the order information specific to the function.
  */
  static createOrderInformation(functionName: string) {
    let orderInformation = {};
    switch (functionName) {
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
}

class ProcessLineItemInformation {
  /**
   * Processes line items for the provided payment object and cart.
   * 
   * @param {string} functionName - The name of the function processing line items.
   * @param {string} locale - Locale for processing the items.
   * @param {PaymentType} paymentObject - The payment object containing payment details.
   * @param {any} cartObj - The cart object containing items.
   * @param {number} fractionDigits - The number of fraction digits for currency conversion.
   * @returns {Array} - An array of processed line items.
   */
  static processLineItems(functionName: string, locale: string, paymentObject: PaymentType, cartObj: any, fractionDigits: number): any[] {
    return this.processLineItemDetails(functionName, locale, paymentObject, cartObj, cartObj.lineItems, false, false, fractionDigits);
  }

  /**
  * Processes custom line items for the provided cart.
  * 
  * @param {string} functionName - The name of the function processing custom line items.
  * @param {string} locale - Locale for processing the items.
  * @param {PaymentType} paymentObject - The payment object containing payment details.
  * @param {any} cartObj - The cart object containing custom items.
  * @param {number} fractionDigits - The number of fraction digits for currency conversion.
  * @returns {Array} - An array of processed custom line items.
  */
  static processCustomLineItems(functionName: string, locale: string, paymentObject: PaymentType, cartObj: any, fractionDigits: number): any[] {
    let customLineItemDetails = [];
    if (cartObj.customLineItems) {
      customLineItemDetails = this.processLineItemDetails(functionName, locale, paymentObject, cartObj, cartObj.customLineItems, true, false, fractionDigits);
    }
    return customLineItemDetails;
  }

  /**
  * Creates an instance of LineItem with the provided details.
  * 
  * @param {string} functionName - The name of the function.
  * @param {string} locale - Locale for processing.
  * @param {PaymentType} paymentObject - The payment object containing payment details.
  * @param {any} cartObj - The cart object containing the item.
  * @param {any} lineitem - The line item to be processed.
  * @param {number} unitPrice - Unit price for the item.
  * @param {any} item - The item being processed.
  * @param {boolean} isShipping - Indicates if the item is for shipping.
  * @param {boolean} isCustom - Indicates if the item is custom.
  * @param {boolean} isTotalPriceDiscount - Indicates if the total price is discounted.
  * @param {number} lineItemTotalAmount - The total amount for the line item.
  * @returns {any} - A new instance of the line item.
  */
  static createLineItemDetailsInstance(functionName: string, locale: string, paymentObject: PaymentType, cartObj: any, lineitem: any, unitPrice: number, item: any, isShipping: boolean, isCustom: boolean, isTotalPriceDiscount: boolean, lineItemTotalAmount: number): any {
    return new LineItem(lineitem, unitPrice, functionName, locale, item, paymentObject, isShipping, cartObj, isCustom, isTotalPriceDiscount, lineItemTotalAmount);
  }

  /**
   * Processes shipping information for the cart.
   * 
   * @param {string} functionName - The name of the function processing shipping information.
   * @param {string} locale - Locale for processing.
   * @param {PaymentType} paymentObject - The payment object containing payment details.
   * @param {number} fractionDigits - The number of fraction digits for currency conversion.
   * @param {any} cartObj - The cart object containing shipping details.
   * @returns {Array} - An array of processed shipping line items.
   */
  static processShippingInfo(functionName: string, locale: string, paymentObject: PaymentType, fractionDigits: number, cartObj: any): any[] {
    let shippingLineItems = [];
    if (Constants.SHIPPING_MODE_MULTIPLE === cartObj.shippingMode && cartObj.shipping) {
      shippingLineItems = this.processLineItemDetails(functionName, locale, paymentObject, cartObj, cartObj.shipping, false, true, fractionDigits);
    } else if (cartObj.shippingInfo) {
      const shippingCost = cartObj.shippingInfo.discountedPrice
        ? paymentUtils.convertCentToAmount(cartObj.shippingInfo.discountedPrice.value.centAmount, fractionDigits)
        : paymentUtils.convertCentToAmount(cartObj.shippingInfo.price.centAmount, fractionDigits);
      const lineItemsDetailsInstance = this.createLineItemDetailsInstance(functionName, locale, paymentObject, cartObj, cartObj, shippingCost, null, true, false, false, shippingCost);
      const lineItemDetails = lineItemsDetailsInstance.getLineItemDetails();
      if (lineItemDetails) {
        shippingLineItems.push(lineItemDetails);
      }
    }
    return shippingLineItems;
  }

  /**
   * Processes discount information for the cart.
   * 
   * @param {string} functionName - The name of the function processing discount information.
   * @param {string} locale - Locale for processing.
   * @param {PaymentType} paymentObject - The payment object containing payment details.
   * @param {any} cartObj - The cart object containing discount details.
   * @returns {Array} - An array of processed discount line items.
   */
  static processDiscountsInfo(functionName: string, locale: string, paymentObject: PaymentType, cartObj: any): any[] {
    let lineItems = [];
    if (cartObj.discountOnTotalPrice) {
      const unitPrice = paymentUtils.convertCentToAmount(cartObj.discountOnTotalPrice.discountedAmount.centAmount, cartObj.discountOnTotalPrice.discountedAmount.fractionDigits);
      const lineItemsDetailsInstance = this.createLineItemDetailsInstance(functionName, locale, paymentObject, cartObj, cartObj, unitPrice, null, false, false, true, unitPrice);
      const lineItemDetails = lineItemsDetailsInstance.getLineItemDetails();
      if (lineItemDetails) {
        lineItems.push(lineItemDetails);
      }
    }
    return lineItems;
  }

  /**
   * Processes the details of line items, handling various pricing and discount scenarios.
   * 
   * @param {string} functionName - The name of the function processing line item details.
   * @param {string} locale - Locale for processing the items.
   * @param {PaymentType} paymentObject - The payment object containing payment details.
   * @param {any} cartObj - The cart object containing items.
   * @param {Array} items - The list of items to process.
   * @param {boolean} isCustom - Indicates if the items are custom.
   * @param {boolean} isShipping - Indicates if the items are for shipping.
   * @param {number} fractionDigits - The number of fraction digits for currency conversion.
   * @returns {Array} - An array of processed line item details.
   */
  static processLineItemDetails(functionName: string, locale: string, paymentObject: PaymentType, cartObj: any, items: any[], isCustom: boolean, isShipping: boolean, fractionDigits: number) {
    let lineItems = [];
    for (let item of items) {
      let lineItemTotalAmount = 0;
      const discountedPricePerQuantity = item?.discountedPricePerQuantity;
      if (discountedPricePerQuantity && 0 < discountedPricePerQuantity.length) {
        for (let discountedItem of discountedPricePerQuantity) {
          let unitPrice = paymentUtils.convertCentToAmount(discountedItem.discountedPrice.value.centAmount, fractionDigits);
          lineItemTotalAmount = unitPrice * discountedItem.quantity;
          let lineItemsDetailsInstance = this.createLineItemDetailsInstance(functionName, locale, paymentObject, cartObj, item, unitPrice, discountedItem, isShipping, isCustom, false, lineItemTotalAmount);
          const lineItemsDetails = lineItemsDetailsInstance.getLineItemDetails();
          if (lineItemsDetails) {
            lineItems.push(lineItemsDetails);
          }
        }
      } else {
        let unitPrice;
        if (item?.totalPrice?.centAmount) {
          lineItemTotalAmount = paymentUtils.convertCentToAmount(item?.totalPrice?.centAmount, fractionDigits);
        }
        if (isCustom) {
          unitPrice = paymentUtils.convertCentToAmount(item.money.centAmount, fractionDigits);
        } else if (item?.shippingInfo?.price?.centAmount) {
          unitPrice = item?.shippingInfo?.discountedPrice ? paymentUtils.convertCentToAmount(item?.shippingInfo?.discountedPrice?.value.centAmount, fractionDigits) : paymentUtils.convertCentToAmount(item.shippingInfo.price.centAmount, fractionDigits);
          lineItemTotalAmount = unitPrice;
        } else {
          unitPrice = item?.price?.discounted?.value?.centAmount ? paymentUtils.convertCentToAmount(item?.price?.discounted?.value?.centAmount, fractionDigits) : paymentUtils.convertCentToAmount(item?.price?.value?.centAmount, fractionDigits);
        }
        const lineItemsDetailsInstance = this.createLineItemDetailsInstance(functionName, locale, paymentObject, cartObj, item, unitPrice, null, isShipping, isCustom, false, lineItemTotalAmount);
        const lineItemsDetails = lineItemsDetailsInstance.getLineItemDetails();
        if (lineItemsDetails) {
          lineItems.push(lineItemsDetails);
        }
      }
    }
    return lineItems;
  }
}

export class OrderInformationMapper {
  private functionName: string;
  private locale: string;
  private service: string | null;
  private fractionDigits: number;
  private currencyCode: string;
  private paymentObject: PaymentType | null;
  private customerObject: Partial<CustomerType> | null;
  private address: AddressType | null;
  private updateTransactions: Partial<PaymentTransactionType> | null;
  private cartObj: any;

  /**
  * Constructs the OrderInformationMapper with the necessary parameters.
  * 
  * @param {string} functionName - The name of the function for which order information is being created.
  * @param {PaymentType | null} paymentObj - The payment object containing payment details.
  * @param {Partial<PaymentTransactionType> | null} updateTransactions - The updated transaction details, if available.
  * @param {any} cartObj - The cart object containing cart details and line items.
  * @param {Partial<CustomerType> | null} customerObj - The customer object containing customer details.
  * @param {AddressType | null} address - The address object containing billing or shipping details.
  * @param {string | null} service - The service name associated with the function.
  * @param {string} currencyCode - The currency code for the transaction.
  */
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

  /**
  * Creates and returns the order information object based on the provided function name.
  * Uses different setters to populate fields like billing, shipping, line items, and amount details.
  * 
  * @returns {any} The constructed order information object.
  */
  getOrderInformation() {
    let orderInformation = OrderInformationFactory.createOrderInformation(this.functionName);
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

  /**
   * Sets and returns the billing information based on the function name.
   * It either uses the cart object or customer object to set the bill-to details.
   * 
   * @returns {any} The bill-to details.
   */
  private setBillTo() {
    return (FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE === this.functionName) ? this.getBillToFromCartObject() : this.getBillToFromCustomerObject();
  }

  /**
   * Sets and returns the shipping information using the cart object.
   * 
   * @returns {any} The ship-to details.
   */
  private setShipTo() {
    return this.getShipToFromCartObject();
  }

  /**
   * Constructs and returns the line items information from the cart object.
   * It processes the line items, custom line items, shipping, and discount information.
   * 
   * @returns {any[]} The list of line items.
   */
  private setLineItems() {
    let lineItems: any = [];
    if (this.cartObj && this.cartObj.lineItems) {
      paymentValidator.setObjectValue(lineItems, '', ProcessLineItemInformation.processLineItems(this.functionName, this.locale, this.paymentObject as PaymentType, this.cartObj, this.fractionDigits), '', Constants.STR_ARRAY, false);
      paymentValidator.setObjectValue(lineItems, '', ProcessLineItemInformation.processCustomLineItems(this.functionName, this.locale, this.paymentObject as PaymentType, this.cartObj, this.fractionDigits), '', Constants.STR_ARRAY, false);
      paymentValidator.setObjectValue(lineItems, '', ProcessLineItemInformation.processShippingInfo(this.functionName, this.locale, this.paymentObject as PaymentType, this.fractionDigits, this.cartObj), '', Constants.STR_ARRAY, false);
      paymentValidator.setObjectValue(lineItems, '', ProcessLineItemInformation.processDiscountsInfo(this.functionName, this.locale, this.paymentObject as PaymentType, this.cartObj), '', Constants.STR_ARRAY, false);
    }
    return lineItems;
  }

  /**
   * Constructs and returns the amount details for the order information.
   * The logic depends on the specific function (e.g., authorization, refund, capture).
   * 
   * @returns {any} The amount details object.
   */
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

  /**
   * Returns the bill-to details from the cart object for authorization responses.
   * 
   * @returns {any} The bill-to information from the cart.
   */
  private getBillToFromCartObject() {
    return prepareFields.getOrderInformationBillToDetails(FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE, this.cartObj, null, null);
  }

  /**
  * Returns the bill-to details from the customer object for token-related responses.
  * 
  * @returns {any} The bill-to information from the customer.
  */
  private getBillToFromCustomerObject() {
    return prepareFields.getOrderInformationBillToDetails(FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE, null, this.address, this.customerObject);
  }

  /**
  * Returns the ship-to details from the cart object.
  * 
  * @returns {any} The ship-to information from the cart.
  */
  private getShipToFromCartObject() {
    return prepareFields.getOrderInformationShipToDetails(this.cartObj, this.paymentObject?.custom?.fields.isv_shippingMethod);
  }
}
