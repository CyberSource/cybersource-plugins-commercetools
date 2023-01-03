import restApi from 'cybersource-rest-client';
import path from 'path';
import paymentService from '../../utils/PaymentService';
import { Constants } from '../../constants';

const authReversalResponse = async (payment, cart, authReversalId) => {
  let runEnvironment: any;
  let cartData: any;
  let errorData: any;
  let exceptionData: any;
  let selectedLocale: any;
  let locale: any;
  let j = Constants.VAL_ZERO;
  let shippingCost = Constants.VAL_FLOAT_ZERO;
  let totalAmount = Constants.VAL_FLOAT_ZERO;
  let unitPrice = Constants.VAL_FLOAT_ZERO;
  let discountPrice = Constants.VAL_FLOAT_ZERO;
  let paymentResponse = {
    httpCode: null,
    transactionId: null,
    status: null,
  };
  try {
    if (null != authReversalId && null != payment) {
      const apiClient = new restApi.ApiClient();
      var requestObj = new restApi.AuthReversalRequest();
      if (process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase() == Constants.TEST_ENVIRONMENT) {
        runEnvironment = Constants.PAYMENT_GATEWAY_TEST_ENVIRONMENT;
      } else if (process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase() == Constants.LIVE_ENVIRONMENT) {
        runEnvironment = Constants.PAYMENT_GATEWAY_PRODUCTION_ENVIRONMENT;
      }
      const configObject = {
        authenticationType: Constants.PAYMENT_GATEWAY_AUTHENTICATION_TYPE,
        runEnvironment: runEnvironment,
        merchantID: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
        merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
        merchantsecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
        logConfiguration: {
          enableLog: false,
        },
      };
      var clientReferenceInformation = new restApi.Ptsv2paymentsidreversalsClientReferenceInformation();
      clientReferenceInformation.code = payment.id;
      requestObj.clientReferenceInformation = clientReferenceInformation;

      var clientReferenceInformationpartner = new restApi.Ptsv2paymentsidreversalsClientReferenceInformationPartner();
      clientReferenceInformationpartner.solutionId = Constants.PAYMENT_GATEWAY_PARTNER_SOLUTION_ID;
      clientReferenceInformation.partner = clientReferenceInformationpartner;
      requestObj.clientReferenceInformation = clientReferenceInformation;

      var processingInformation = new restApi.Ptsv2paymentsidreversalsProcessingInformation();

      if (Constants.CLICK_TO_PAY == payment.paymentMethodInfo.method) {
        processingInformation.paymentSolution = Constants.PAYMENT_GATEWAY_CLICK_TO_PAY_PAYMENT_SOLUTION;
        processingInformation.visaCheckoutId = payment.custom.fields.isv_token;
      } else if (Constants.GOOGLE_PAY == payment.paymentMethodInfo.method) {
        processingInformation.paymentSolution = Constants.PAYMENT_GATEWAY_GOOGLE_PAY_PAYMENT_SOLUTION;
      } else if (Constants.APPLE_PAY == payment.paymentMethodInfo.method) {
        processingInformation.paymentSolution = Constants.PAYMENT_GATEWAY_APPLE_PAY_PAYMENT_SOLUTION;
      }
      requestObj.processingInformation = processingInformation;
      
      var orderInformation = new restApi.Ptsv2paymentsidreversalsOrderInformation();

      if (null != cart && Constants.VAL_ZERO < cart.count && Constants.STRING_RESULTS in cart) {
        cartData = cart.results[Constants.VAL_ZERO];
        if (Constants.STRING_LOCALE in cartData && null != cartData.locale) {
          selectedLocale = cartData.locale.split(Constants.REGEX_HYPHEN);
          locale = selectedLocale[Constants.VAL_ZERO];
          orderInformation.lineItems = [];
          cartData.lineItems.forEach((lineItem) => {
            if (Constants.STRING_DISCOUNTED_PRICE_PER_QUANTITY in lineItem && Constants.VAL_ZERO == lineItem.discountedPricePerQuantity.length) {
              var orderInformationLineItems = new restApi.Ptsv2paymentsidreversalsOrderInformationLineItems();
              if (Constants.STRING_DISCOUNTED in lineItem.price) {
                unitPrice = paymentService.convertCentToAmount(lineItem.price.discounted.value.centAmount);
              } else {
                unitPrice = paymentService.convertCentToAmount(lineItem.price.value.centAmount);
              }
              orderInformationLineItems.productName = lineItem.name[locale];
              orderInformationLineItems.quantity = lineItem.quantity;
              orderInformationLineItems.productSku = lineItem.variant.sku;
              orderInformationLineItems.productCode = lineItem.productId;
              orderInformationLineItems.unitPrice = unitPrice;
              if (Constants.STRING_TAX_RATE in lineItem && null != lineItem.taxRate && true === lineItem.taxRate.includedInPrice) {
                orderInformationLineItems.tax = lineItem.taxRate.amount;
              }
              orderInformation.lineItems[j] = orderInformationLineItems;
              j++;
            } else if (Constants.STRING_DISCOUNTED_PRICE_PER_QUANTITY in lineItem && Constants.VAL_ZERO < lineItem.discountedPricePerQuantity.length) {
              lineItem.discountedPricePerQuantity.forEach((item) => {
                var orderInformationLineItems = new restApi.Ptsv2paymentsidreversalsOrderInformationLineItems();
                unitPrice = paymentService.convertCentToAmount(item.discountedPrice.value.centAmount);
                orderInformationLineItems.productName = lineItem.name[locale];
                orderInformationLineItems.quantity = item.quantity;
                orderInformationLineItems.productSku = lineItem.variant.sku;
                orderInformationLineItems.productCode = lineItem.productId;
                orderInformationLineItems.unitPrice = unitPrice;
                item.discountedPrice.includedDiscounts.forEach((discount) => {
                  discountPrice = discountPrice + paymentService.convertCentToAmount(discount.discountedAmount.centAmount) * item.quantity;
                });
                orderInformationLineItems.discountAmount = paymentService.roundOff(discountPrice);
                if (Constants.STRING_TAX_RATE in lineItem && null != lineItem.taxRate && true === lineItem.taxRate.includedInPrice) {
                  orderInformationLineItems.tax = lineItem.taxRate.amount;
                }
                orderInformation.lineItems[j] = orderInformationLineItems;
                j++;
                discountPrice = Constants.VAL_FLOAT_ZERO;
              });
            }
          });
          if (Constants.STRING_CUSTOM_LINE_ITEMS in cartData && Constants.VAL_ZERO < cartData.customLineItems.length) {
            cartData.customLineItems.forEach((customLineItem) => {
              if (Constants.STRING_DISCOUNTED_PRICE_PER_QUANTITY in customLineItem && Constants.VAL_ZERO == customLineItem.discountedPricePerQuantity.length) {
                var orderInformationLineItems = new restApi.Ptsv2paymentsidreversalsOrderInformationLineItems();
                unitPrice = paymentService.convertCentToAmount(customLineItem.money.centAmount);
                orderInformationLineItems.productName = customLineItem.name[locale];
                orderInformationLineItems.quantity = customLineItem.quantity;
                orderInformationLineItems.productSku = customLineItem.slug;
                orderInformationLineItems.productCode = customLineItem.id;
                orderInformationLineItems.unitPrice = unitPrice;
                if (Constants.STRING_TAX_RATE in customLineItem && null != customLineItem.taxRate && true === customLineItem.taxRate.includedInPrice) {
                  orderInformationLineItems.tax = customLineItem.taxRate.amount;
                }
                orderInformation.lineItems[j] = orderInformationLineItems;
                j++;
              } else if (Constants.STRING_DISCOUNTED_PRICE_PER_QUANTITY in customLineItem && Constants.VAL_ZERO < customLineItem.discountedPricePerQuantity.length) {
                customLineItem.discountedPricePerQuantity.forEach((customItem) => {
                  var orderInformationLineItems = new restApi.Ptsv2paymentsidreversalsOrderInformationLineItems();
                  unitPrice = paymentService.convertCentToAmount(customItem.discountedPrice.value.centAmount);
                  orderInformationLineItems.productName = customLineItem.name[locale];
                  orderInformationLineItems.quantity = customItem.quantity;
                  orderInformationLineItems.productSku = customLineItem.slug;
                  orderInformationLineItems.productCode = customLineItem.id;
                  orderInformationLineItems.unitPrice = unitPrice;
                  customItem.discountedPrice.includedDiscounts.forEach((discount) => {
                    discountPrice = discountPrice + paymentService.convertCentToAmount(discount.discountedAmount.centAmount) * customItem.quantity;
                  });
                  orderInformationLineItems.discountAmount = paymentService.roundOff(discountPrice);
                  if (Constants.STRING_TAX_RATE in customLineItem && null != customLineItem.taxRate && true === customLineItem.taxRate.includedInPrice) {
                    orderInformationLineItems.tax = customLineItem.taxRate.amount;
                  }
                  orderInformation.lineItems[j] = orderInformationLineItems;
                  j++;
                  discountPrice = Constants.VAL_FLOAT_ZERO;
                });
              }
            });
          }
          if (Constants.SHIPPING_INFO in cartData) {
            var orderInformationLineItems = new restApi.Ptsv2paymentsidreversalsOrderInformationLineItems();
            orderInformationLineItems.productName = cartData.shippingInfo.shippingMethodName;
            orderInformationLineItems.quantity = Constants.VAL_ONE;
            orderInformationLineItems.productSku = Constants.SHIPPING_AND_HANDLING;
            orderInformationLineItems.productCode = Constants.SHIPPING_AND_HANDLING;
            if (Constants.STRING_DISCOUNTED_PRICE in cartData.shippingInfo) {
              shippingCost = paymentService.convertCentToAmount(cartData.shippingInfo.discountedPrice.value.centAmount);
              if (Constants.STRING_INCLUDED_DISCOUNTS in cartData.shippingInfo.discountedPrice) {
                cartData.shippingInfo.discountedPrice.includedDiscounts.forEach((discount) => {
                  discountPrice += paymentService.convertCentToAmount(discount.discountedAmount.centAmount);
                });
                orderInformationLineItems.discountAmount = discountPrice;
              }
            } else {
              shippingCost = paymentService.convertCentToAmount(cartData.shippingInfo.price.centAmount);
            }
            orderInformationLineItems.unitPrice = shippingCost;
            if (Constants.STRING_TAX_RATE in cartData.shippingInfo && null != cartData.shippingInfo.taxRate && true === cartData.shippingInfo.taxRate.includedInPrice) {
              orderInformationLineItems.tax = cartData.shippingInfo.taxRate.amount;
            }
            orderInformation.lineItems[j] = orderInformationLineItems;
            j++;
          }
        } else {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTH_REVERSAL_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + payment.id, Constants.ERROR_MSG_CART_LOCALE);
        }
      }
      requestObj.orderInformation = orderInformation;

      totalAmount = paymentService.convertCentToAmount(payment.amountPlanned.centAmount);

      var orderInformationAmountDetails = new restApi.Ptsv2paymentsidreversalsOrderInformationAmountDetails();
      orderInformationAmountDetails.totalAmount = totalAmount;
      orderInformationAmountDetails.currency = payment.amountPlanned.currencyCode;
      orderInformation.amountDetails = orderInformationAmountDetails;

      if(Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ENABLE_DEBUG){
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTH_REVERSAL_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + payment.id, Constants.AUTHORIZATION_REVERSAL_REQUEST +JSON.stringify(requestObj));
      }

      var instance = new restApi.ReversalApi(configObject, apiClient);
      return await new Promise((resolve, reject) => {
        instance.authReversal(authReversalId, requestObj, function (error, data, response) {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTH_REVERSAL_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + payment.id, Constants.AUTHORIZATION_REVERSAL_RESPONSE+JSON.stringify(response));
          if (data) {
            paymentResponse.httpCode = response[Constants.STATUS_CODE];
            paymentResponse.transactionId = data.id;
            paymentResponse.status = data.status;
            resolve(paymentResponse);
          } else if (error) {
            if (error.hasOwnProperty(Constants.STRING_RESPONSE) && null != error.response && Constants.VAL_ZERO < Object.keys(error.response).length && error.response.hasOwnProperty(Constants.STRING_TEXT) && null != error.response.text && Constants.VAL_ZERO < Object.keys(error.response.text).length) {
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTH_REVERSAL_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + payment.id, error.response.text);
              errorData = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, Constants.STRING_EMPTY));
              paymentResponse.transactionId = errorData.id;
              paymentResponse.status = errorData.status;
            } else {
              if (typeof error === 'object') {
                errorData = JSON.stringify(error);
              } else {
                errorData = error;
              }
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTH_REVERSAL_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + payment.id, errorData);
            }
            paymentResponse.httpCode = error.status;
            reject(paymentResponse);
          } else {
            reject(paymentResponse);
          }
        });
      }).catch((error) => {
        return paymentResponse;
      });
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTH_REVERSAL_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + payment.id, Constants.ERROR_MSG_INVALID_INPUT);
      return paymentResponse;
    }
  } catch (exception) {
    if (typeof exception === 'string') {
      exceptionData = exception.toUpperCase();
    } else if (exception instanceof Error) {
      exceptionData = exception.message;
    } else {
      exceptionData = exception;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTH_REVERSAL_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + payment.id, exceptionData);
    return paymentResponse;
  }
};

export default { authReversalResponse };
