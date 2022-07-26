import restApi from 'cybersource-rest-client';
import path from 'path';
import paymentService from '../../utils/PaymentService';
import { Constants } from '../../constants';

const authorizationResponse = async (payment, cart, service, cardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNo) => {
  let runEnvironment: any;
  let errorData: any;
  let exceptionData: any;
  let selectedLocale: any;
  let locale: any;
  let actionList = new Array();
  let j = Constants.VAL_ZERO;
  let totalAmount = Constants.VAL_FLOAT_ZERO;
  let unitPrice = Constants.VAL_FLOAT_ZERO;
  let shippingCost = Constants.VAL_FLOAT_ZERO;
  let discountPrice = Constants.VAL_FLOAT_ZERO;
  let paymentResponse = {
    httpCode: null,
    transactionId: null,
    status: null,
    data: null,
  };
  try {
    if (null != payment && null != cart && null != service && Constants.STRING_LOCALE in cart && null != cart.locale) {
      selectedLocale = cart.locale.split(Constants.REGEX_HYPHEN);
      locale = selectedLocale[Constants.VAL_ZERO];
      const apiClient = new restApi.ApiClient();
      var requestObj = new restApi.CreatePaymentRequest();
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
      var clientReferenceInformation = new restApi.Ptsv2paymentsClientReferenceInformation();
      clientReferenceInformation.code = payment.id;
      requestObj.clientReferenceInformation = clientReferenceInformation;

      var clientReferenceInformationpartner = new restApi.Ptsv2paymentsClientReferenceInformationPartner();
      clientReferenceInformationpartner.solutionId = Constants.PAYMENT_GATEWAY_PARTNER_SOLUTION_ID;
      clientReferenceInformation.partner = clientReferenceInformationpartner;
      requestObj.clientReferenceInformation = clientReferenceInformation;

      var processingInformation = new restApi.Ptsv2paymentsProcessingInformation();
      if (Constants.STRING_CUSTOM in payment && Constants.STRING_FIELDS in payment.custom && Constants.ISV_ENABLED_MOTO in payment.custom.fields && payment.custom.fields.isv_enabledMoto) {
        processingInformation.commerceIndicator = Constants.STRING_MOTO;
      }
      if (Constants.STRING_CUSTOM in payment && Constants.STRING_FIELDS in payment.custom && Constants.ISV_SALE_ENABLED in payment.custom.fields && payment.custom.fields.isv_saleEnabled) {
        processingInformation.capture = true;
      }
      if (Constants.STRING_CUSTOM in payment && Constants.STRING_FIELDS in payment.custom && Constants.ISV_WALLET_TYPE in payment.custom.fields && Constants.STRING_EMPTY != payment.custom.fields.isv_walletType) {
        processingInformation.walletType = payment.custom.fields.isv_walletType;
      }
      if (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ORDER_RECONCILIATION && null != orderNo) {
        processingInformation.reconciliationId = orderNo;
      }
      if (Constants.STRING_FALSE == process.env.PAYMENT_GATEWAY_DECISION_MANAGER) {
        actionList.push(Constants.PAYMENT_GATEWAY_DECISION_SKIP);
      }
      if (Constants.STRING_ENROLL_CHECK == service) {
        actionList.push(Constants.PAYMENT_GATEWAY_CONSUMER_AUTHENTICATION);
      }
      if (Constants.VALIDATION == service) {
        actionList.push(Constants.PAYMENT_GATEWAY_VALIDATE_CONSUMER_AUTHENTICATION);
      }
      if ((null == payment.custom.fields.isv_savedToken || Constants.STRING_EMPTY == payment.custom.fields.isv_savedToken) && Constants.ISV_TOKEN_ALIAS in payment.custom.fields && Constants.STRING_EMPTY != payment.custom.fields.isv_tokenAlias && !dontSaveTokenFlag) {
        actionList.push(Constants.PAYMENT_GATEWAY_TOKEN_CREATE);
        var initiator = new restApi.Ptsv2paymentsProcessingInformationAuthorizationOptionsInitiator();
        initiator.credentialStoredOnFile = true;
        var authorizationOptions = new restApi.Ptsv2paymentsProcessingInformationAuthorizationOptions();
        authorizationOptions.initiator = initiator;
        processingInformation.authorizationOptions = authorizationOptions;
        if (null != cardTokens && null != cardTokens.customerTokenId) {
          processingInformation.actionTokenTypes = Constants.PAYMENT_GATEWAY_TOKEN_ACTION_TYPES_CUSTOMER_EXISTS;
        } else {
          processingInformation.actionTokenTypes = Constants.PAYMENT_GATEWAY_TOKEN_ACTION_TYPES;
        }
      }
      processingInformation.actionList = actionList;
      var paymentInformation = new restApi.Ptsv2paymentsPaymentInformation();
      var tokenInformation = new restApi.Ptsv2paymentsTokenInformation();
      if (Constants.CREDIT_CARD == payment.paymentMethodInfo.method || Constants.CC_PAYER_AUTHENTICATION == payment.paymentMethodInfo.method) {
        if (Constants.ISV_SAVED_TOKEN in payment.custom.fields && Constants.STRING_EMPTY != payment.custom.fields.isv_savedToken) {
          var paymentInformationCustomer = new restApi.Ptsv2paymentsPaymentInformationCustomer();
          paymentInformationCustomer.id = cardTokens.customerTokenId;
          paymentInformation.customer = paymentInformationCustomer;
          var paymentInformatioPaymentInstrument = new restApi.Ptsv2paymentsPaymentInformationPaymentInstrument();
          paymentInformatioPaymentInstrument.id = cardTokens.paymentInstrumentId;
          paymentInformation.paymentInstrument = paymentInformatioPaymentInstrument;
        } else {
          if (null != cardTokens && null != cardTokens.customerTokenId) {
            var paymentInformationCustomer = new restApi.Ptsv2paymentsPaymentInformationCustomer();
            paymentInformationCustomer.id = cardTokens.customerTokenId;
            paymentInformation.customer = paymentInformationCustomer;
          }
          var paymentInformationCard = new restApi.Ptsv2paymentsPaymentInformationCard();
          paymentInformationCard.typeSelectionIndicator = Constants.VAL_ONE;
          paymentInformation.card = paymentInformationCard;
          tokenInformation.transientTokenJwt = payment.custom.fields.isv_token;
          requestObj.tokenInformation = tokenInformation;
        }
        if (Constants.VALIDATION == service) {
          var consumerAuthenticationInformation = new restApi.Ptsv2paymentsConsumerAuthenticationInformation();
          consumerAuthenticationInformation.authenticationTransactionId = payment.custom.fields.isv_payerAuthenticationTransactionId;
          consumerAuthenticationInformation.signedPares = payment.custom.fields.isv_payerAuthenticationPaReq;
          requestObj.consumerAuthenticationInformation = consumerAuthenticationInformation;
        }
        if (Constants.STRING_ENROLL_CHECK == service) {
          var consumerAuthenticationInformation = new restApi.Ptsv2paymentsConsumerAuthenticationInformation();
          consumerAuthenticationInformation.referenceId = payment.custom.fields.isv_cardinalReferenceId;
          consumerAuthenticationInformation.acsWindowSize = Constants.PAYMENT_GATEWAY_ACS_WINDOW_SIZE;
          consumerAuthenticationInformation.returnUrl = process.env.PAYMENT_GATEWAY_3DS_RETURN_URL;
          if (
            payerAuthMandateFlag ||
            (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_SCA_CHALLENGE &&
              (null == payment.custom.fields.isv_savedToken || Constants.STRING_EMPTY == payment.custom.fields.isv_savedToken) &&
              Constants.ISV_TOKEN_ALIAS in payment.custom.fields &&
              Constants.STRING_EMPTY != payment.custom.fields.isv_tokenAlias &&
              !dontSaveTokenFlag)
          ) {
            consumerAuthenticationInformation.challengeCode = Constants.PAYMENT_GATEWAY_PAYER_AUTH_CHALLENGE_CODE;
          }
          requestObj.consumerAuthenticationInformation = consumerAuthenticationInformation;
        }
      } else if (Constants.CLICK_TO_PAY == payment.paymentMethodInfo.method) {
        processingInformation.paymentSolution = Constants.PAYMENT_GATEWAY_CLICK_TO_PAY_PAYMENT_SOLUTION;
        processingInformation.visaCheckoutId = payment.custom.fields.isv_token;
      } else if (Constants.GOOGLE_PAY == payment.paymentMethodInfo.method) {
        processingInformation.paymentSolution = Constants.PAYMENT_GATEWAY_GOOGLE_PAY_PAYMENT_SOLUTION;
        var fluidData = new restApi.Ptsv2paymentsPaymentInformationFluidData();
        fluidData.value = payment.custom.fields.isv_token;
        paymentInformation.fluidData = fluidData;
      } else if (Constants.APPLE_PAY == payment.paymentMethodInfo.method) {
        processingInformation.paymentSolution = Constants.PAYMENT_GATEWAY_APPLE_PAY_PAYMENT_SOLUTION;
        var paymentInformationFluidData = new restApi.Ptsv2paymentsPaymentInformationFluidData();
        paymentInformationFluidData.value = payment.custom.fields.isv_token;
        paymentInformationFluidData.descriptor = Constants.PAYMENT_GATEWAY_APPLE_PAY_DESCRIPTOR;
        paymentInformationFluidData.encoding = Constants.PAYMENT_GATEWAY_APPLE_PAY_ENCODING;
        paymentInformation.fluidData = paymentInformationFluidData;
      }else if (Constants.ECHECK == payment.paymentMethodInfo.method) {
        var banktransaferOptions = new restApi.Ptsv2creditsProcessingInformationBankTransferOptions();
        if (Constants.STRING_CUSTOM in payment && Constants.STRING_FIELDS in payment.custom && Constants.ISV_ENABLED_MOTO in payment.custom.fields && payment.custom.fields.isv_enabledMoto) {
          banktransaferOptions.secCode = Constants.SEC_CODE_TEL;
        } else {
          banktransaferOptions.secCode = Constants.SEC_CODE_WEB;
        }
        banktransaferOptions.fraudScreeningLevel = Constants.VAL_ONE;
      
        processingInformation.bankTransferOptions = banktransaferOptions;
        var paymentInformationBank = new restApi.Ptsv2paymentsPaymentInformationBank();
        var paymentInformationBankAccount = new restApi.Ptsv2paymentsPaymentInformationBankAccount();
        paymentInformationBankAccount.type = payment.custom.fields.isv_accountType;
        paymentInformationBankAccount.number = payment.custom.fields.isv_accountNumber;
        paymentInformationBank.account = paymentInformationBankAccount;
        paymentInformationBank.routingNumber = payment.custom.fields.isv_routingNumber;
        paymentInformation.bank = paymentInformationBank;
        var paymentInformationPaymentType = new restApi.Ptsv2paymentsPaymentInformationPaymentType();
        paymentInformationPaymentType.name = Constants.PAYMENT_GATEWAY_E_CHECK_PAYMENT_TYPE;
        paymentInformation.paymentType = paymentInformationPaymentType;
      }


      requestObj.processingInformation = processingInformation;
      requestObj.paymentInformation = paymentInformation;

      totalAmount = paymentService.convertCentToAmount(payment.amountPlanned.centAmount);

      var orderInformation = new restApi.Ptsv2paymentsOrderInformation();
      var orderInformationAmountDetails = new restApi.Ptsv2paymentsOrderInformationAmountDetails();
      orderInformationAmountDetails.totalAmount = totalAmount;
      orderInformationAmountDetails.currency = payment.amountPlanned.currencyCode;
      orderInformation.amountDetails = orderInformationAmountDetails;

      var orderInformationBillTo = new restApi.Ptsv2paymentsOrderInformationBillTo();
      orderInformationBillTo.firstName = cart.billingAddress.firstName;
      orderInformationBillTo.lastName = cart.billingAddress.lastName;
      orderInformationBillTo.address1 = cart.billingAddress.streetName;
      orderInformationBillTo.locality = cart.billingAddress.city;
      orderInformationBillTo.administrativeArea = cart.billingAddress.region;
      orderInformationBillTo.postalCode = cart.billingAddress.postalCode;
      orderInformationBillTo.country = cart.billingAddress.country;
      orderInformationBillTo.email = cart.billingAddress.email;
      orderInformationBillTo.phoneNumber = cart.billingAddress.phone;
      orderInformation.billTo = orderInformationBillTo;
      requestObj.orderInformation = orderInformation;

      var orderInformationShipTo = new restApi.Ptsv2paymentsOrderInformationShipTo();
      orderInformationShipTo.firstName = cart.shippingAddress.firstName;
      orderInformationShipTo.lastName = cart.shippingAddress.lastName;
      orderInformationShipTo.address1 = cart.shippingAddress.streetName;
      orderInformationShipTo.locality = cart.shippingAddress.city;
      orderInformationShipTo.administrativeArea = cart.shippingAddress.region;
      orderInformationShipTo.postalCode = cart.shippingAddress.postalCode;
      orderInformationShipTo.country = cart.shippingAddress.country;
      orderInformationShipTo.email = cart.shippingAddress.email;
      orderInformationShipTo.phoneNumber = cart.shippingAddress.phone;
      orderInformation.shipTo = orderInformationShipTo;
      requestObj.orderInformation = orderInformation;

      orderInformation.lineItems = [];
      cart.lineItems.forEach((lineItem) => {
        if (Constants.STRING_DISCOUNTED_PRICE_PER_QUANTITY in lineItem && Constants.VAL_ZERO == lineItem.discountedPricePerQuantity.length) {
          var orderInformationLineItems = new restApi.Ptsv2paymentsOrderInformationLineItems();
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
            orderInformationLineItems.taxRate = lineItem.taxRate.amount;
          }
          orderInformation.lineItems[j] = orderInformationLineItems;
          j++;
        } else if (Constants.STRING_DISCOUNTED_PRICE_PER_QUANTITY in lineItem && Constants.VAL_ZERO < lineItem.discountedPricePerQuantity.length) {
          lineItem.discountedPricePerQuantity.forEach((item) => {
            var orderInformationLineItems = new restApi.Ptsv2paymentsOrderInformationLineItems();
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
              orderInformationLineItems.taxRate = lineItem.taxRate.amount;
            }
            orderInformation.lineItems[j] = orderInformationLineItems;
            j++;
            discountPrice = Constants.VAL_FLOAT_ZERO;
          });
        }
      });
      if (Constants.STRING_CUSTOM_LINE_ITEMS in cart && Constants.VAL_ZERO < cart.customLineItems.length) {
        cart.customLineItems.forEach((customLineItem) => {
          if (Constants.STRING_DISCOUNTED_PRICE_PER_QUANTITY in customLineItem && Constants.VAL_ZERO == customLineItem.discountedPricePerQuantity.length) {
            var orderInformationLineItems = new restApi.Ptsv2paymentsOrderInformationLineItems();
            unitPrice = paymentService.convertCentToAmount(customLineItem.money.centAmount);
            orderInformationLineItems.productName = customLineItem.name[locale];
            orderInformationLineItems.quantity = customLineItem.quantity;
            orderInformationLineItems.productSku = customLineItem.slug;
            orderInformationLineItems.productCode = customLineItem.id;
            orderInformationLineItems.unitPrice = unitPrice;
            if (Constants.STRING_TAX_RATE in customLineItem && null != customLineItem.taxRate && true === customLineItem.taxRate.includedInPrice) {
              orderInformationLineItems.taxRate = customLineItem.taxRate.amount;
            }
            orderInformation.lineItems[j] = orderInformationLineItems;
            j++;
          } else if (Constants.STRING_DISCOUNTED_PRICE_PER_QUANTITY in customLineItem && Constants.VAL_ZERO < customLineItem.discountedPricePerQuantity.length) {
            customLineItem.discountedPricePerQuantity.forEach((customItem) => {
              var orderInformationLineItems = new restApi.Ptsv2paymentsOrderInformationLineItems();
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
                orderInformationLineItems.taxRate = customLineItem.taxRate.amount;
              }
              orderInformation.lineItems[j] = orderInformationLineItems;
              j++;
              discountPrice = Constants.VAL_FLOAT_ZERO;
            });
          }
        });
      }
      if (Constants.SHIPPING_INFO in cart) {
        var orderInformationLineItems = new restApi.Ptsv2paymentsOrderInformationLineItems();
        orderInformationLineItems.productName = cart.shippingInfo.shippingMethodName;
        orderInformationLineItems.quantity = Constants.VAL_ONE;
        orderInformationLineItems.productSku = Constants.SHIPPING_AND_HANDLING;
        orderInformationLineItems.productCode = Constants.SHIPPING_AND_HANDLING;
        if (Constants.STRING_DISCOUNTED_PRICE in cart.shippingInfo) {
          shippingCost = paymentService.convertCentToAmount(cart.shippingInfo.discountedPrice.value.centAmount);
          if (Constants.STRING_INCLUDED_DISCOUNTS in cart.shippingInfo.discountedPrice) {
            cart.shippingInfo.discountedPrice.includedDiscounts.forEach((discount) => {
              discountPrice += paymentService.convertCentToAmount(discount.discountedAmount.centAmount);
            });
            orderInformationLineItems.discountAmount = paymentService.roundOff(discountPrice);
          }
        } else {
          shippingCost = paymentService.convertCentToAmount(cart.shippingInfo.price.centAmount);
        }
        orderInformationLineItems.unitPrice = shippingCost;
        if (Constants.STRING_TAX_RATE in cart.shippingInfo && null != cart.shippingInfo.taxRate && true === cart.shippingInfo.taxRate.includedInPrice) {
          orderInformationLineItems.taxRate = cart.shippingInfo.taxRate.amount;
        }
        orderInformation.lineItems[j] = orderInformationLineItems;
        j++;
      }
      requestObj.orderInformation = orderInformation;
      var deviceInformation = new restApi.Ptsv2paymentsDeviceInformation();
      if (Constants.ISV_DEVICE_FINGERPRINT_ID in payment.custom.fields && Constants.STRING_EMPTY != payment.custom.fields.isv_deviceFingerprintId) {
        deviceInformation.fingerprintSessionId = payment.custom.fields.isv_deviceFingerprintId;
      }
      if (Constants.ISV_IP_ADDRESS in payment.custom.fields && Constants.STRING_EMPTY != payment.custom.fields.isv_customerIpAddress) {
        deviceInformation.ipAddress = payment.custom.fields.isv_customerIpAddress;
      }
      if (Constants.ISV_ACCEPT_HEADER in payment.custom.fields && Constants.STRING_EMPTY != payment.custom.fields.isv_acceptHeader) {
        deviceInformation.httpAcceptBrowserValue = payment.custom.fields.isv_acceptHeader;
      }
      if (Constants.ISV_USER_AGENT_HEADER in payment.custom.fields && Constants.STRING_EMPTY != payment.custom.fields.isv_userAgentHeader) {
        deviceInformation.userAgentBrowserValue = payment.custom.fields.isv_userAgentHeader;
      }
      requestObj.deviceInformation = deviceInformation;
      const instance = new restApi.PaymentsApi(configObject, apiClient);
      return await new Promise(function (resolve, reject) {
        instance.createPayment(requestObj, function (error, data, response) {
          if (data) {
            paymentResponse.httpCode = response[Constants.STATUS_CODE];
            paymentResponse.transactionId = data.id;
            paymentResponse.status = data.status;
            paymentResponse.data = data;
            resolve(paymentResponse);
          } else if (error) {
            if (error.hasOwnProperty(Constants.STRING_RESPONSE) && null != error.response && Constants.VAL_ZERO < Object.keys(error.response).length && error.response.hasOwnProperty(Constants.STRING_TEXT) && null != error.response.text && Constants.VAL_ZERO < Object.keys(error.response.text).length) {
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_RESPONSE, Constants.LOG_INFO, error.response.text);
              errorData = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, Constants.STRING_EMPTY));
              paymentResponse.transactionId = errorData.id;
              paymentResponse.status = errorData.status;
            } else {
              if (typeof error === 'object') {
                errorData = JSON.stringify(error);
              } else {
                errorData = error;
              }
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_RESPONSE, Constants.LOG_INFO, errorData);
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
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_RESPONSE, Constants.LOG_INFO, Constants.ERROR_MSG_INVALID_INPUT);
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
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_RESPONSE, Constants.LOG_ERROR, exceptionData);
    return paymentResponse;
  }
};

export default { authorizationResponse };
