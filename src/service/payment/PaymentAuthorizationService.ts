import restApi from 'cybersource-rest-client';
import path from 'path';
import paymentService from '../../utils/PaymentService';
import { Constants } from '../../constants';
import multiMid from '../../utils/config/MultiMid';

const authorizationResponse = async (payment, cart, service, cardTokens, dontSaveTokenFlag, payerAuthMandateFlag, orderNo) => {
  let runEnvironment: any;
  let errorData: any;
  let exceptionData: any;
  let cartLocale: any;
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
  let midCredentials: any;
  let fractionDigits = Constants.VAL_ZERO;
  try {
    if (null != payment && null != cart && null != service && Constants.STRING_LOCALE in cart && null != cart.locale) {
      fractionDigits = payment.amountPlanned.fractionDigits;
      cartLocale = cart.locale;
      const apiClient = new restApi.ApiClient();
      var requestObj = new restApi.CreatePaymentRequest();
      runEnvironment = (Constants.LIVE_ENVIRONMENT == process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase()) ? Constants.PAYMENT_GATEWAY_PRODUCTION_ENVIRONMENT : runEnvironment = Constants.PAYMENT_GATEWAY_TEST_ENVIRONMENT;
      midCredentials = await multiMid.getMidCredentials(payment);
      const configObject = {
        authenticationType: Constants.PAYMENT_GATEWAY_AUTHENTICATION_TYPE,
        runEnvironment: runEnvironment,
        merchantID: midCredentials.merchantId,
        merchantKeyId: midCredentials.merchantKeyId,
        merchantsecretKey: midCredentials.merchantSecretKey,
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
        processingInformation.commerceIndicator = 'MOTO';
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
          if (payment?.custom?.fields?.isv_securityCode && null != payment.custom.fields.isv_securityCode) {
            var paymentInformationCard = new restApi.Ptsv2paymentsPaymentInformationCard();
            paymentInformationCard.securityCode = payment.custom.fields.isv_securityCode;
            paymentInformation.card = paymentInformationCard;
          }
        } else {
          if (null != cardTokens && null != cardTokens.customerTokenId) {
            var paymentInformationCustomer = new restApi.Ptsv2paymentsPaymentInformationCustomer();
            paymentInformationCustomer.id = cardTokens.customerTokenId;
            paymentInformation.customer = paymentInformationCustomer;
          }
          var paymentInformationCard = new restApi.Ptsv2paymentsPaymentInformationCard();
          paymentInformationCard.typeSelectionIndicator = Constants.VAL_ONE;
          paymentInformation.card = paymentInformationCard;
          tokenInformation.transientTokenJwt = payment.custom.fields?.isv_token;
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
      } else if (Constants.CLICK_TO_PAY == payment.paymentMethodInfo.method && payment?.custom?.fields?.isv_token && Constants.STRING_EMPTY != payment.custom.fields.isv_token) {
        processingInformation.paymentSolution = Constants.PAYMENT_GATEWAY_CLICK_TO_PAY_PAYMENT_SOLUTION;
        processingInformation.visaCheckoutId = payment.custom.fields.isv_token;
      } else if (Constants.GOOGLE_PAY == payment.paymentMethodInfo.method && payment?.custom?.fields?.isv_token && Constants.STRING_EMPTY != payment.custom.fields.isv_token) {
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
      } else if (Constants.ECHECK == payment.paymentMethodInfo.method) {
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
      if (payment?.custom?.fields?.isv_transientToken && Constants.STRING_EMPTY != payment.custom.fields.isv_transientToken) {
        var tokenInformation = new restApi.Ptsv2paymentsTokenInformation();
        tokenInformation.transientTokenJwt = payment.custom.fields.isv_transientToken;
        requestObj.tokenInformation = tokenInformation;
        processingInformation.commerceIndicator = 'internet';
      }
      requestObj.processingInformation = processingInformation;
      requestObj.paymentInformation = paymentInformation;
      totalAmount = paymentService.convertCentToAmount(payment.amountPlanned.centAmount, fractionDigits);
      var orderInformation = new restApi.Ptsv2paymentsOrderInformation();
      var orderInformationAmountDetails = new restApi.Ptsv2paymentsOrderInformationAmountDetails();
      orderInformationAmountDetails.totalAmount = totalAmount;
      orderInformationAmountDetails.currency = payment.amountPlanned.currencyCode;
      orderInformation.amountDetails = orderInformationAmountDetails;
      var orderInformationBillTo = new restApi.Ptsv2paymentsOrderInformationBillTo();
      orderInformationBillTo.firstName = cart.billingAddress.firstName;
      orderInformationBillTo.lastName = cart.billingAddress.lastName;
      orderInformationBillTo.address1 = cart.billingAddress.streetName;
      if (cart?.billingAddress?.additionalStreetInfo) {
        orderInformationBillTo.address2 = cart.billingAddress.additionalStreetInfo;
      }else if(cart?.billingAddress?.streetNumber){
        orderInformationBillTo.address2 = cart.billingAddress.streetNumber;
      }
      orderInformationBillTo.locality = cart.billingAddress.city;
      orderInformationBillTo.administrativeArea = cart.billingAddress.region;
      orderInformationBillTo.postalCode = cart.billingAddress.postalCode;
      orderInformationBillTo.country = cart.billingAddress.country;
      orderInformationBillTo.email = cart.billingAddress.email;
      orderInformationBillTo.phoneNumber = cart.billingAddress.phone;
      orderInformation.billTo = orderInformationBillTo;
      orderInformation.lineItems = [];
      cart.lineItems.forEach((lineItem) => {
        if (Constants.STRING_DISCOUNTED_PRICE_PER_QUANTITY in lineItem && Constants.VAL_ZERO == lineItem.discountedPricePerQuantity.length) {
          var orderInformationLineItems = new restApi.Ptsv2paymentsOrderInformationLineItems();
          if (Constants.STRING_DISCOUNTED in lineItem.price) {
            unitPrice = paymentService.convertCentToAmount(lineItem.price.discounted.value.centAmount, fractionDigits);
          } else {
            unitPrice = paymentService.convertCentToAmount(lineItem.price.value.centAmount, fractionDigits);
          }
          orderInformationLineItems.productName = lineItem.name[cartLocale];
          orderInformationLineItems.quantity = lineItem.quantity;
          orderInformationLineItems.productSku = lineItem.variant.sku;
          orderInformationLineItems.productCode = Constants.STRING_DEFAULT;
          orderInformationLineItems.unitPrice = unitPrice;
          if (Constants.STRING_TAX_RATE in lineItem && null != lineItem.taxRate && true === lineItem.taxRate.includedInPrice) {
            orderInformationLineItems.taxRate = lineItem.taxRate.amount;
          }
          orderInformation.lineItems[j] = orderInformationLineItems;
          j++;
        } else if (Constants.STRING_DISCOUNTED_PRICE_PER_QUANTITY in lineItem && Constants.VAL_ZERO < lineItem.discountedPricePerQuantity.length) {
          lineItem.discountedPricePerQuantity.forEach((item) => {
            var orderInformationLineItems = new restApi.Ptsv2paymentsOrderInformationLineItems();
            unitPrice = paymentService.convertCentToAmount(item.discountedPrice.value.centAmount, fractionDigits);
            orderInformationLineItems.productName = lineItem.name[cartLocale];
            orderInformationLineItems.quantity = item.quantity;
            orderInformationLineItems.productSku = lineItem.variant.sku;
            orderInformationLineItems.productCode = Constants.STRING_DEFAULT;
            orderInformationLineItems.unitPrice = unitPrice;
            item.discountedPrice.includedDiscounts.forEach((discount) => {
              discountPrice = discountPrice + paymentService.convertCentToAmount(discount.discountedAmount.centAmount, fractionDigits) * item.quantity;
            });
            orderInformationLineItems.discountAmount = paymentService.roundOff(discountPrice, fractionDigits);
            if (Constants.STRING_TAX_RATE in lineItem && null != lineItem.taxRate && true === lineItem.taxRate.includedInPrice) {
              orderInformationLineItems.taxRate = lineItem.taxRate.amount;
            }
            orderInformation.lineItems[j] = orderInformationLineItems;
            j++;
            discountPrice = Constants.VAL_FLOAT_ZERO;
          });
        } else {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + payment.id, Constants.ERROR_MSG_SHIPPING_DETAILS_NOT_FOUND + payment.id);
        }
      });
      if (Constants.STRING_CUSTOM_LINE_ITEMS in cart && Constants.VAL_ZERO < cart.customLineItems.length) {
        cart.customLineItems.forEach((customLineItem) => {
          if (Constants.STRING_DISCOUNTED_PRICE_PER_QUANTITY in customLineItem && Constants.VAL_ZERO == customLineItem.discountedPricePerQuantity.length) {
            var orderInformationLineItems = new restApi.Ptsv2paymentsOrderInformationLineItems();
            unitPrice = paymentService.convertCentToAmount(customLineItem.money.centAmount, fractionDigits);
            orderInformationLineItems.productName = customLineItem.name[cartLocale];
            orderInformationLineItems.quantity = customLineItem.quantity;
            orderInformationLineItems.productSku = customLineItem.slug;
            orderInformationLineItems.productCode = Constants.STRING_DEFAULT;
            orderInformationLineItems.unitPrice = unitPrice;
            if (Constants.STRING_TAX_RATE in customLineItem && null != customLineItem.taxRate && true === customLineItem.taxRate.includedInPrice) {
              orderInformationLineItems.taxRate = customLineItem.taxRate.amount;
            }
            orderInformation.lineItems[j] = orderInformationLineItems;
            j++;
          } else if (Constants.STRING_DISCOUNTED_PRICE_PER_QUANTITY in customLineItem && Constants.VAL_ZERO < customLineItem.discountedPricePerQuantity.length) {
            customLineItem.discountedPricePerQuantity.forEach((customItem) => {
              var orderInformationLineItems = new restApi.Ptsv2paymentsOrderInformationLineItems();
              unitPrice = paymentService.convertCentToAmount(customItem.discountedPrice.value.centAmount, fractionDigits);
              orderInformationLineItems.productName = customLineItem.name[cartLocale];
              orderInformationLineItems.quantity = customItem.quantity;
              orderInformationLineItems.productSku = customLineItem.slug;
              orderInformationLineItems.productCode = Constants.STRING_DEFAULT;
              orderInformationLineItems.unitPrice = unitPrice;
              customItem.discountedPrice.includedDiscounts.forEach((discount) => {
                discountPrice = discountPrice + paymentService.convertCentToAmount(discount.discountedAmount.centAmount, fractionDigits) * customItem.quantity;
              });
              orderInformationLineItems.discountAmount = paymentService.roundOff(discountPrice, fractionDigits);
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
      if (cart?.shippingMode && Constants.SHIPPING_MODE_MULTIPLE == cart.shippingMode && cart?.shipping && Constants.VAL_ZERO < cart.shipping.length) {
        var orderInformationShipTo = new restApi.Ptsv2paymentsOrderInformationShipTo();
        orderInformationShipTo.firstName = cart.shipping[Constants.VAL_ZERO].shippingAddress.firstName;
        orderInformationShipTo.lastName = cart.shipping[Constants.VAL_ZERO].shippingAddress.lastName;
        orderInformationShipTo.address1 = cart.shipping[Constants.VAL_ZERO].shippingAddress.streetName;
        if (cart?.shipping[Constants.VAL_ZERO]?.shippingAddress?.additionalStreetInfo) {
          orderInformationShipTo.address2 = cart.shipping[Constants.VAL_ZERO].shippingAddress.additionalStreetInfo;
        }else if(cart?.shipping[Constants.VAL_ZERO]?.shippingAddress?.streetNumber){
          orderInformationShipTo.address2 = cart.shipping[Constants.VAL_ZERO].shippingAddress.streetNumber;
        }
        orderInformationShipTo.locality = cart.shipping[Constants.VAL_ZERO].shippingAddress.city;
        orderInformationShipTo.administrativeArea = cart.shipping[Constants.VAL_ZERO].shippingAddress.region;
        orderInformationShipTo.postalCode = cart.shipping[Constants.VAL_ZERO].shippingAddress.postalCode;
        orderInformationShipTo.country = cart.shipping[Constants.VAL_ZERO].shippingAddress.country;
        orderInformationShipTo.email = cart.shipping[Constants.VAL_ZERO].shippingAddress.email;
        orderInformationShipTo.phoneNumber = cart.shipping[Constants.VAL_ZERO].shippingAddress.phone;
        orderInformation.shipTo = orderInformationShipTo;
        cart.shipping.forEach((shippingDetail) => {
          var orderInformationLineItems = new restApi.Ptsv2paymentsOrderInformationLineItems();
          orderInformationLineItems.productName = shippingDetail.shippingInfo.shippingMethodName;
          orderInformationLineItems.quantity = Constants.VAL_ONE;
          orderInformationLineItems.productSku = Constants.SHIPPING_AND_HANDLING;
          orderInformationLineItems.productCode = Constants.SHIPPING_AND_HANDLING;
          if (Constants.STRING_DISCOUNTED_PRICE in shippingDetail.shippingInfo) {
            shippingCost = paymentService.convertCentToAmount(shippingDetail.shippingInfo.discountedPrice.value.centAmount, fractionDigits);
            if (Constants.STRING_INCLUDED_DISCOUNTS in shippingDetail.shippingInfo.discountedPrice) {
              shippingDetail.shippingInfo.discountedPrice.includedDiscounts.forEach((discount) => {
                discountPrice += paymentService.convertCentToAmount(discount.discountedAmount.centAmount, fractionDigits);
              });
              orderInformationLineItems.discountAmount = paymentService.roundOff(discountPrice, fractionDigits);
            }
          } else {
            shippingCost = paymentService.convertCentToAmount(shippingDetail.shippingInfo.price.centAmount, fractionDigits);
          }
          orderInformationLineItems.unitPrice = shippingCost;
          if (Constants.STRING_TAX_RATE in shippingDetail.shippingInfo && null != shippingDetail.shippingInfo.taxRate && true === shippingDetail.shippingInfo.taxRate.includedInPrice) {
            orderInformationLineItems.taxRate = shippingDetail.shippingInfo.taxRate.amount;
          }
          orderInformation.lineItems[j] = orderInformationLineItems;
          j++;
        });
      } else if (cart?.shippingAddress) {
        var orderInformationShipTo = new restApi.Ptsv2paymentsOrderInformationShipTo();
        orderInformationShipTo.firstName = cart.shippingAddress.firstName;
        orderInformationShipTo.lastName = cart.shippingAddress.lastName;
        orderInformationShipTo.address1 = cart.shippingAddress.streetName;
        if (cart?.shippingAddress?.additionalStreetInfo) {
          orderInformationShipTo.address2 = cart.shippingAddress.additionalStreetInfo;
        }else if(cart?.shippingAddress?.streetNumber){
          orderInformationShipTo.address2 = cart.shippingAddress.streetNumber;
        }
        orderInformationShipTo.locality = cart.shippingAddress.city;
        orderInformationShipTo.administrativeArea = cart.shippingAddress.region;
        orderInformationShipTo.postalCode = cart.shippingAddress.postalCode;
        orderInformationShipTo.country = cart.shippingAddress.country;
        orderInformationShipTo.email = cart.shippingAddress.email;
        orderInformationShipTo.phoneNumber = cart.shippingAddress.phone;
        orderInformation.shipTo = orderInformationShipTo;
        if (cart?.shippingInfo) {
          var orderInformationLineItems = new restApi.Ptsv2paymentsOrderInformationLineItems();
          orderInformationLineItems.productName = cart.shippingInfo.shippingMethodName;
          orderInformationLineItems.quantity = Constants.VAL_ONE;
          orderInformationLineItems.productSku = Constants.SHIPPING_AND_HANDLING;
          orderInformationLineItems.productCode = Constants.SHIPPING_AND_HANDLING;
          if (Constants.STRING_DISCOUNTED_PRICE in cart.shippingInfo) {
            shippingCost = paymentService.convertCentToAmount(cart.shippingInfo.discountedPrice.value.centAmount, fractionDigits);
            if (Constants.STRING_INCLUDED_DISCOUNTS in cart.shippingInfo.discountedPrice) {
              cart.shippingInfo.discountedPrice.includedDiscounts.forEach((discount) => {
                discountPrice += paymentService.convertCentToAmount(discount.discountedAmount.centAmount, fractionDigits);
              });
              orderInformationLineItems.discountAmount = paymentService.roundOff(discountPrice, fractionDigits);
            }
          } else {
            shippingCost = paymentService.convertCentToAmount(cart.shippingInfo.price.centAmount, fractionDigits);
          }
          orderInformationLineItems.unitPrice = shippingCost;
          if (Constants.STRING_TAX_RATE in cart.shippingInfo && null != cart.shippingInfo.taxRate && true === cart.shippingInfo.taxRate.includedInPrice) {
            orderInformationLineItems.taxRate = cart.shippingInfo.taxRate.amount;
          }
          orderInformation.lineItems[j] = orderInformationLineItems;
          j++;
        }
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
      if (Constants.STRING_TRUE == process.env.PAYMENT_GATEWAY_ENABLE_DEBUG) {
        if (Constants.STRING_ENROLL_CHECK == service) {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + payment.id, Constants.PAYER_AUTHENTICATION_ENROLMENT_CHECK_REQUEST + JSON.stringify(requestObj));
        } else {
          paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + payment.id, Constants.AUTHORIZATION_REQUEST + JSON.stringify(requestObj));
        }
      }
      const paymentsApiInstance = new restApi.PaymentsApi(configObject, apiClient);
      return await new Promise(function (resolve, reject) {
        paymentsApiInstance.createPayment(requestObj, function (error, data, response) {
          if (Constants.STRING_ENROLL_CHECK == service) {
            paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + payment.id, Constants.PAYER_AUTHENTICATION_ENROLMENT_CHECK_RESPONSE + JSON.stringify(response));
          } else {
            paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + payment.id, Constants.AUTHORIZATION_RESPONSE + JSON.stringify(response));
          }
          if (data) {
            paymentResponse.httpCode = response[Constants.STATUS_CODE];
            paymentResponse.transactionId = data.id;
            paymentResponse.status = data.status;
            paymentResponse.data = data;
            resolve(paymentResponse);
          } else if (error) {
            if (
              error.hasOwnProperty(Constants.STRING_RESPONSE) &&
              null != error.response &&
              Constants.VAL_ZERO < Object.keys(error.response).length &&
              error.response.hasOwnProperty(Constants.STRING_TEXT) &&
              null != error.response.text &&
              Constants.VAL_ZERO < Object.keys(error.response.text).length
            ) {
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + payment.id, error.response.text);
              errorData = JSON.parse(error.response.text.replace(Constants.REGEX_DOUBLE_SLASH, Constants.STRING_EMPTY));
              paymentResponse.transactionId = errorData.id;
              paymentResponse.status = errorData.status;
            } else {
              if (typeof error === 'object') {
                errorData = JSON.stringify(error);
              } else {
                errorData = error;
              }
              paymentService.logData(path.parse(path.basename(__filename)).name, Constants.LOG_PAYMENT_ID + payment.id, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + payment.id, errorData);
            }
            paymentResponse.httpCode = error.status;
            reject(paymentResponse);
          } else {
            reject(paymentResponse);
          }
        });
      }).catch((error) => {
        return error;
      });
    } else {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_RESPONSE, Constants.LOG_INFO, Constants.LOG_PAYMENT_ID + payment.id, Constants.ERROR_MSG_INVALID_INPUT);
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
    if (Constants.EXCEPTION_MERCHANT_SECRET_KEY_REQUIRED == exceptionData || Constants.EXCEPTION_MERCHANT_KEY_ID_REQUIRED == exceptionData) {
      exceptionData = Constants.EXCEPTION_MSG_ENV_VARIABLE_NOT_SET + midCredentials.merchantId;
    }
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_AUTHORIZATION_RESPONSE, Constants.LOG_ERROR, Constants.LOG_PAYMENT_ID + payment.id, exceptionData);
    return paymentResponse;
  }
};

export default { authorizationResponse };
