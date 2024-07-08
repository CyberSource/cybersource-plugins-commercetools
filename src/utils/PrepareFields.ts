import path from 'path';

import restApi from 'cybersource-rest-client';
import { jwtDecode } from 'jwt-decode';

import { Constants } from '../constants';
import { AddressType, CustomerType, CustomTokenType, MidCredentialsType, OrderInformationType, PaymentTransactionType, PaymentType } from '../types/Types';
import multiMid from '../utils/config/MultiMid';

import paymentUtils from './PaymentUtils';
import commercetoolsApi from './api/CommercetoolsApi';

/**
 * Generates the configuration object based on the provided parameters.
 * 
 * @param {string} functionName - The name of the function.
 * @param {MidCredentialsType | null} midCredentials - MID credentials.
 * @param {PaymentType | null} resourceObj - The payment object.
 * @param {string | null} merchantId - The merchant ID.
 * @returns {Promise<{
*   authenticationType: string;
*   runEnvironment: string;
*   merchantID: string;
*   merchantKeyId: string;
*   merchantsecretKey: string;
*   logConfiguration: { enableLog: boolean };
* } | undefined>} - A promise resolving to the configuration object.
*/
const getConfigObject = async (functionName: string, midCredentials: MidCredentialsType | null, resourceObj: PaymentType | null, merchantId: string | null) => {
  let configObject;
  let midCredentialsObject: MidCredentialsType = {
    merchantId: '',
    merchantKeyId: '',
    merchantSecretKey: '',
  };
  let mid = '';
  const getConfigObjectByPaymentObjectFunctions = ['FuncGetTransactionData', 'FuncKeys', 'FuncPayerAuthSetupResponse', 'FuncAuthReversalResponse', 'FuncAuthorizationResponse', 'FuncCaptureResponse', 'FuncRefundResponse'];
  const getConfigObjectByMidCredentialsFunctions = [
    'FuncGetTransactionSearchResponse',
    'FuncConversionDetails',
    'FuncGetPublicKeys',
    'FuncTransientTokenDataResponse',
    'FuncGetWebhookSubscriptionResponse',
    'FuncKeyGenerationResponse',
    'FuncWebhookSubscriptionResponse',
    'FuncDeleteWebhookSubscriptionResponse',
  ];
  const runEnvironment = Constants.LIVE_ENVIRONMENT === process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase() ? Constants.PAYMENT_GATEWAY_PRODUCTION_ENVIRONMENT : Constants.PAYMENT_GATEWAY_TEST_ENVIRONMENT;
  if (resourceObj && getConfigObjectByPaymentObjectFunctions.includes(functionName)) {
    mid = resourceObj?.custom?.fields?.isv_merchantId ? resourceObj.custom.fields.isv_merchantId : '';
    midCredentialsObject = await multiMid.getMidCredentials(mid);
  } else if (merchantId && ('FuncGenerateCaptureContext' === functionName || 'FuncGetCardByInstrumentResponse' === functionName)) {
    if (process.env.PAYMENT_GATEWAY_MERCHANT_ID === merchantId) {
      merchantId = '';
    }
    midCredentialsObject = await multiMid.getMidCredentials(merchantId);
  } else if (midCredentials && getConfigObjectByMidCredentialsFunctions.includes(functionName)) {
    midCredentialsObject = midCredentials;
  } else {
    midCredentialsObject.merchantId = process.env.PAYMENT_GATEWAY_MERCHANT_ID;
    midCredentialsObject.merchantKeyId = process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID;
    midCredentialsObject.merchantSecretKey = process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY;
  }
  if (midCredentialsObject?.merchantId && midCredentialsObject?.merchantKeyId && midCredentialsObject?.merchantSecretKey) {
    configObject = {
      authenticationType: Constants.PAYMENT_GATEWAY_AUTHENTICATION_TYPE,
      runEnvironment: runEnvironment,
      merchantID: midCredentialsObject.merchantId,
      merchantKeyId: midCredentialsObject.merchantKeyId,
      merchantsecretKey: midCredentialsObject.merchantSecretKey,
      logConfiguration: {
        enableLog: false,
      },
    };
  } else {
    paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncGetConfigObject', Constants.LOG_INFO, '', Constants.EXCEPTION_MSG_ENV_VARIABLE_NOT_SET);
    return;
  }
  return configObject;
};

/**
 * Generates processing information object based on the provided function name and payment scenario.
 * 
 * @param {string} functionName - The name of the function.
 * @param {PaymentType | null} resourceObj - The payment object containing custom fields.
 * @param {string} orderNo - The order number associated with the payment.
 * @param {string} service - The service type for the payment.
 * @param {CustomTokenType | null} cardTokens - The card tokens associated with the payment.
 * @param {boolean | null} notSaveToken - Specifies whether to save the token or not.
 * @returns {Promise<restApi.Ptsv2paymentsProcessingInformation>} - The processing information object.
 */
const getProcessingInformation = async (functionName: string, resourceObj: PaymentType | null, orderNo: string, service: string, cardTokens: CustomTokenType | null, notSaveToken: boolean | null) => {
  let processingInformation;
  const actionList = [];
  const customFields = resourceObj?.custom?.fields;
  if ('FuncAddTokenResponse' !== functionName) {
    switch (functionName) {
      case 'FuncAuthReversalResponse':
        processingInformation = new restApi.Ptsv2paymentsidreversalsProcessingInformation();
        break;
      case 'FuncCaptureResponse':
        processingInformation = new restApi.Ptsv2paymentsidcapturesProcessingInformation();
        break;
      case 'FuncRefundResponse':
        processingInformation = new restApi.Ptsv2paymentsidrefundsProcessingInformation();
        break;
      case 'FuncAuthorizationResponse': {
        processingInformation = new restApi.Ptsv2paymentsProcessingInformation();
        if (customFields?.isv_enabledMoto) {
          processingInformation.commerceIndicator = 'MOTO';
        }
        if (customFields?.isv_saleEnabled) {
          processingInformation.capture = true;
        }
        if (customFields?.isv_walletType) {
          processingInformation.walletType = customFields.isv_walletType;
        }
        if (Constants.STRING_FALSE === process.env.PAYMENT_GATEWAY_DECISION_MANAGER) {
          actionList.push(Constants.PAYMENT_GATEWAY_DECISION_SKIP);
        }
        if (Constants.STRING_ENROLL_CHECK === service) {
          actionList.push(Constants.PAYMENT_GATEWAY_CONSUMER_AUTHENTICATION);
        }
        if (Constants.VALIDATION === service) {
          actionList.push(Constants.PAYMENT_GATEWAY_VALIDATE_CONSUMER_AUTHENTICATION);
        }
        if ((undefined === customFields?.isv_savedToken || '' === customFields?.isv_savedToken || null === customFields?.isv_savedToken) && undefined !== customFields?.isv_tokenAlias && '' !== customFields?.isv_tokenAlias && !notSaveToken) {
          actionList.push(Constants.PAYMENT_GATEWAY_TOKEN_CREATE);
          processingInformation.actionList = actionList;
          const initiator = new restApi.Ptsv2paymentsProcessingInformationAuthorizationOptionsInitiator();
          initiator.credentialStoredOnFile = true;
          const authorizationOptions = new restApi.Ptsv2paymentsProcessingInformationAuthorizationOptions();
          authorizationOptions.initiator = initiator;
          processingInformation.authorizationOptions = authorizationOptions;
          processingInformation.actionTokenTypes = null !== cardTokens && '' !== cardTokens.customerTokenId ? Constants.PAYMENT_GATEWAY_TOKEN_ACTION_TYPES_CUSTOMER_EXISTS : Constants.PAYMENT_GATEWAY_TOKEN_ACTION_TYPES;
        }
        processingInformation.actionList = actionList;
        break;
      }
    }
    if (Constants.STRING_TRUE === process.env.PAYMENT_GATEWAY_ORDER_RECONCILIATION && orderNo) {
      processingInformation.reconciliationId = orderNo;
    }
    if (Constants.CLICK_TO_PAY === resourceObj?.paymentMethodInfo?.method && resourceObj?.custom) {
      if (resourceObj.custom?.fields?.isv_transientToken) {
        processingInformation.paymentSolution = Constants.PAYMENT_GATEWAY_CLICK_TO_PAY_UC_PAYMENT_SOLUTION;
        processingInformation.visaCheckoutId = resourceObj.custom.fields.isv_transientToken;
      } else {
        processingInformation.paymentSolution = Constants.PAYMENT_GATEWAY_CLICK_TO_PAY_PAYMENT_SOLUTION;
        processingInformation.visaCheckoutId = resourceObj.custom.fields.isv_token;
      }
    }
    if (Constants.GOOGLE_PAY === resourceObj?.paymentMethodInfo?.method) {
      processingInformation.paymentSolution = Constants.PAYMENT_GATEWAY_GOOGLE_PAY_PAYMENT_SOLUTION;
    }
    if (Constants.APPLE_PAY === resourceObj?.paymentMethodInfo?.method) {
      processingInformation.paymentSolution = Constants.PAYMENT_GATEWAY_APPLE_PAY_PAYMENT_SOLUTION;
    }
    if (Constants.ECHECK === resourceObj?.paymentMethodInfo?.method) {
      const banktransaferOptions = new restApi.Ptsv2creditsProcessingInformationBankTransferOptions();
      banktransaferOptions.secCode = customFields?.isv_enabledMoto ? 'TEL' : 'WEB';
      banktransaferOptions.fraudScreeningLevel = 1;
      processingInformation.bankTransferOptions = banktransaferOptions;
    }
  } else if ('FuncAddTokenResponse' === functionName) {
    processingInformation = new restApi.Ptsv2paymentsProcessingInformation();
    if (Constants.STRING_FALSE === process.env.PAYMENT_GATEWAY_DECISION_MANAGER) {
      actionList.push(Constants.PAYMENT_GATEWAY_DECISION_SKIP);
    }
    actionList.push(Constants.PAYMENT_GATEWAY_TOKEN_CREATE);
    const initiator = new restApi.Ptsv2paymentsProcessingInformationAuthorizationOptionsInitiator();
    initiator.credentialStoredOnFile = true;
    const authorizationOptions = new restApi.Ptsv2paymentsProcessingInformationAuthorizationOptions();
    authorizationOptions.initiator = initiator;
    processingInformation.authorizationOptions = authorizationOptions;

    processingInformation.actionTokenTypes = cardTokens && cardTokens?.customerTokenId ? Constants.PAYMENT_GATEWAY_TOKEN_ACTION_TYPES_CUSTOMER_EXISTS : Constants.PAYMENT_GATEWAY_TOKEN_ACTION_TYPES;
    processingInformation.actionList = actionList;

    if ((undefined === customFields?.isv_savedToken || '' === customFields?.isv_savedToken || null === customFields?.isv_savedToken) && customFields?.isv_tokenAlias && customFields?.isv_tokenAlias && !notSaveToken) {
      actionList.push(Constants.PAYMENT_GATEWAY_TOKEN_CREATE);
      processingInformation.actionList = actionList;
      const initiatorObj = new restApi.Ptsv2paymentsProcessingInformationAuthorizationOptionsInitiator();
      initiatorObj.credentialStoredOnFile = true;
      const authorizationOptionsObj = new restApi.Ptsv2paymentsProcessingInformationAuthorizationOptions();
      authorizationOptionsObj.initiator = initiatorObj;
      processingInformation.authorizationOptions = authorizationOptionsObj;

      processingInformation.actionTokenTypes = cardTokens && cardTokens.customerTokenId ? Constants.PAYMENT_GATEWAY_TOKEN_ACTION_TYPES_CUSTOMER_EXISTS : Constants.PAYMENT_GATEWAY_TOKEN_ACTION_TYPES;
    }
  }
  return processingInformation;
};

/**
 * Generates payment information object based on the provided function name and payment scenario.
 * 
 * @param {string} functionName - The name of the function.
 * @param {PaymentType | null} resourceObj - The payment object containing custom fields.
 * @param {CustomTokenType | null} cardTokens - The card tokens associated with the payment.
 * @param {string | null} customerTokenId - The customer token ID associated with the payment.
 * @returns {Promise<any>} - The payment information object.
 */
const getPaymentInformation = async (functionName: string, resourceObj: PaymentType | null, cardTokens: CustomTokenType | null, customerTokenId: string | null): Promise<any> => {
  let paymentInformation: any;
  if (('FuncAuthorizationResponse' === functionName || 'FuncRefundResponse' === functionName) && resourceObj?.paymentMethodInfo?.method) {
    if ('FuncAuthorizationResponse' === functionName) {
      paymentInformation = new restApi.Ptsv2paymentsPaymentInformation();
    } else if ('FuncRefundResponse' === functionName) {
      paymentInformation = new restApi.Ptsv2paymentsidrefundsPaymentInformation();
    }
    const paymentInformationBank = new restApi.Ptsv2paymentsPaymentInformationBank();
    const paymentInformationBankAccount = new restApi.Ptsv2paymentsPaymentInformationBankAccount();
    const paymentInformationPaymentType = new restApi.Ptsv2paymentsPaymentInformationPaymentType();
    const customFields = resourceObj?.custom?.fields;
    switch (resourceObj.paymentMethodInfo.method) {
      case Constants.ECHECK: {
        if (resourceObj?.custom) {
          paymentInformationBankAccount.type = resourceObj.custom.fields.isv_accountType;
          paymentInformationBankAccount.number = resourceObj.custom.fields.isv_accountNumber;
          paymentInformationBank.account = paymentInformationBankAccount;
          paymentInformationBank.routingNumber = resourceObj.custom.fields.isv_routingNumber;
          paymentInformation.bank = paymentInformationBank;
          paymentInformationPaymentType.name = Constants.PAYMENT_GATEWAY_E_CHECK_PAYMENT_TYPE;
          paymentInformation.PaymentType = paymentInformationPaymentType;
        }
        break;
      }
      case Constants.GOOGLE_PAY: {
        const fluidData = new restApi.Ptsv2paymentsPaymentInformationFluidData();
        fluidData.value = resourceObj?.custom?.fields.isv_token;
        paymentInformation.fluidData = fluidData;
        break;
      }
      case Constants.APPLE_PAY: {
        const paymentInformationFluidData = new restApi.Ptsv2paymentsPaymentInformationFluidData();
        paymentInformationFluidData.value = resourceObj?.custom?.fields.isv_token;
        paymentInformationFluidData.descriptor = Constants.PAYMENT_GATEWAY_APPLE_PAY_DESCRIPTOR;
        paymentInformationFluidData.encoding = Constants.BASE_SIXTY_FOUR_ENCODING;
        paymentInformation.fluidData = paymentInformationFluidData;
        break;
      }
      case Constants.CREDIT_CARD:
      case Constants.CC_PAYER_AUTHENTICATION: {
        if (customFields?.isv_savedToken) {
          const paymentInformationCustomer = new restApi.Ptsv2paymentsPaymentInformationCustomer();
          paymentInformationCustomer.id = cardTokens?.customerTokenId;
          paymentInformation.customer = paymentInformationCustomer;
          const paymentInformatioPaymentInstrument = new restApi.Ptsv2paymentsPaymentInformationPaymentInstrument();
          paymentInformatioPaymentInstrument.id = cardTokens?.paymentInstrumentId;
          paymentInformation.paymentInstrument = paymentInformatioPaymentInstrument;
          if (customFields?.isv_securityCode) {
            const paymentInformationCard = new restApi.Ptsv2paymentsPaymentInformationCard();
            paymentInformationCard.securityCode = customFields.isv_securityCode;
            paymentInformation.card = paymentInformationCard;
          }
        } else {
          if (cardTokens && cardTokens?.customerTokenId) {
            const paymentInformationCustomer = new restApi.Ptsv2paymentsPaymentInformationCustomer();
            paymentInformationCustomer.id = cardTokens.customerTokenId;
            paymentInformation.customer = paymentInformationCustomer;
          }
          const paymentInformationCard = new restApi.Ptsv2paymentsPaymentInformationCard();
          paymentInformationCard.typeSelectionIndicator = 1;
          paymentInformation.card = paymentInformationCard;
        }
        break;
      }
      default:
        paymentUtils.logData(path.parse(path.basename(__filename)).name, '', Constants.LOG_ERROR, '', Constants.ERROR_MSG_NO_PAYMENT_METHODS);
        break;
    }
  } else if ('FuncAddTokenResponse' === functionName && cardTokens) {
    paymentInformation = new restApi.Ptsv2paymentsPaymentInformation();
    if (cardTokens?.customerTokenId) {
      const paymentInformationCustomer = new restApi.Ptsv2paymentsPaymentInformationCustomer();
      paymentInformationCustomer.id = cardTokens.customerTokenId;
      paymentInformation.customer = paymentInformationCustomer;
      const paymentInformationCard = new restApi.Ptsv2paymentsPaymentInformationCard();
      paymentInformationCard.typeSelectionIndicator = 1;
      paymentInformation.card = paymentInformationCard;
    }
  } else if ('FuncPayerAuthSetupResponse' === functionName) {
    paymentInformation = new restApi.Riskv1authenticationsetupsPaymentInformation();
    const paymentInformationCustomer = new restApi.Riskv1authenticationsetupsPaymentInformationCustomer();
    paymentInformationCustomer.id = customerTokenId;
    paymentInformation.customer = paymentInformationCustomer;
  }
  return paymentInformation;
};

/**
 * Generates client reference information based on the provided service and resource ID.
 * 
 * @param {string} service - The name of the service.
 * @param {string} resourceId - The ID of the resource.
 * @returns {Promise<any>} - The client reference information object.
 */
const getClientReferenceInformation = async (service: string, resourceId: string, payment?: PaymentType): Promise<any> => {
  let clientReferenceInformationPartner;
  let clientReferenceInformation: {
    code: string,
    pausedRequestId: string,
    partner: typeof clientReferenceInformationPartner;
  }
  if ('FuncPayerAuthSetupResponse' === service) {
    clientReferenceInformation = new restApi.Riskv1decisionsClientReferenceInformation();
    clientReferenceInformationPartner = new restApi.Riskv1decisionsClientReferenceInformationPartner();
  } else if ('FuncAuthReversalResponse' === service) {
    clientReferenceInformation = new restApi.Ptsv2paymentsidreversalsClientReferenceInformation();
    clientReferenceInformationPartner = new restApi.Ptsv2paymentsidreversalsClientReferenceInformationPartner();
  } else {
    clientReferenceInformation = new restApi.Ptsv2paymentsClientReferenceInformation();
    clientReferenceInformationPartner = new restApi.Ptsv2paymentsidClientReferenceInformationPartner();
  }
  clientReferenceInformation.code = resourceId;
  if (payment?.custom?.fields?.isv_dmpaFlag && payment.custom?.fields?.isv_payerEnrollTransactionId) {
    clientReferenceInformation.pausedRequestId = payment.custom.fields.isv_payerEnrollTransactionId;
  }
  clientReferenceInformationPartner.solutionId = Constants.PAYMENT_GATEWAY_PARTNER_SOLUTION_ID;
  clientReferenceInformation.partner = clientReferenceInformationPartner;
  return clientReferenceInformation;
};

/**
 * Generates order information based on the provided parameters.
 * 
 * @param {string} functionName - The name of the function.
 * @param {PaymentType | null} paymentObj - The payment object.
 * @param {PaymentTransactionType | null} updateTransactions - The updated transaction object.
 * @param {any} cartObj - The cart object.
 * @param {CustomerType | null} customerObj - The customer object.
 * @param {AddressType | null} address - The address object.
 * @param {string | null} service - The service name.
 * @param {string} currencyCode - The currency code.
 * @returns {Promise<OrderInformationType>} - The order information object.
 */
const getOrderInformation = async (functionName: string, paymentObj: PaymentType | null, updateTransactions: PaymentTransactionType | null, cartObj: any, customerObj: CustomerType | null, address: AddressType | null, service: string | null, currencyCode: string): Promise<OrderInformationType> => {
  let orderInformationLineItems = {};
  let cartLocale = '';
  let unitPrice: number | null;
  let shippingCost = 0;
  let j = 0;
  let orderInformation: OrderInformationType = {};
  let centAmount = 0.0;
  let captureAmount = 0.0;
  let fractionDigits = 0;
  let lineItemTotalAmount = 0;
  let shippingMethod = '';
  try {
    if (null !== updateTransactions && null !== paymentObj) {
      centAmount = updateTransactions?.amount?.centAmount ? updateTransactions.amount.centAmount : paymentObj?.amountPlanned?.centAmount;
      captureAmount = paymentUtils.convertCentToAmount(centAmount, paymentObj.amountPlanned.fractionDigits);
    }
    if (paymentObj?.custom?.fields?.isv_shippingMethod) {
      shippingMethod = paymentObj.custom.fields.isv_shippingMethod;
    }
    if ('FuncCaptureResponse' === functionName) {
      orderInformation = new restApi.Ptsv2paymentsidcapturesOrderInformation();
    } else if ('FuncRefundResponse' === functionName) {
      orderInformation = new restApi.Ptsv2paymentsidrefundsOrderInformation();
    } else if ('FuncAuthReversalResponse' === functionName) {
      orderInformation = new restApi.Ptsv2paymentsidreversalsOrderInformation();
      orderInformationLineItems = new restApi.Ptsv2paymentsidreversalsOrderInformationLineItems();
    } else if ('FuncAuthorizationResponse' === functionName && cartObj) {
      const orderInformationBillTo = await getOrderInformationBillTo('FuncAuthorizationResponse', cartObj, null, null);
      const orderInformationShipTo = await getOrderInformationShipTo(cartObj, shippingMethod);
      orderInformation = new restApi.Ptsv2paymentsOrderInformation();
      orderInformation.billTo = orderInformationBillTo;
      orderInformation.shipTo = orderInformationShipTo;
    } else if ('FuncAddTokenResponse' === functionName && address) {
      const orderInformationBillTo = await getOrderInformationBillTo('FuncAddTokenResponse', null, address, customerObj);
      orderInformation.billTo = orderInformationBillTo;
      const orderInformationAmountDetails = await getOrderInformationAmountDetails(functionName, null, null, null, currencyCode, service);
      orderInformation.amountDetails = orderInformationAmountDetails;
    } else if ('FuncGenerateCaptureContext' === functionName) {
      orderInformation = new restApi.Upv1capturecontextsOrderInformation();
    }
    if ('FuncAuthReversalResponse' === functionName || 'FuncAuthorizationResponse' === functionName) {
      orderInformation.lineItems = [];
      if (cartObj && 0 < cartObj?.lineItems?.length) {
        if (paymentObj?.amountPlanned?.fractionDigits) {
          fractionDigits = paymentObj.amountPlanned.fractionDigits;
        }
        if (cartObj?.locale) {
          cartLocale = cartObj.locale;
          orderInformationLineItems = 'FuncAuthReversalResponse' === functionName ? new restApi.Ptsv2paymentsidreversalsOrderInformationLineItems() : new restApi.Ptsv2paymentsOrderInformationLineItems();
          cartObj.lineItems.forEach(async (lineItem: any) => {
            lineItemTotalAmount = 0;
            if (lineItem?.discountedPricePerQuantity && 0 === lineItem.discountedPricePerQuantity.length) {
              if (lineItem?.totalPrice?.centAmount) {
                lineItemTotalAmount = paymentUtils.convertCentToAmount(lineItem?.totalPrice?.centAmount, fractionDigits);
              }
              unitPrice = lineItem?.price?.discounted?.value?.centAmount ? paymentUtils.convertCentToAmount(lineItem.price.discounted.value.centAmount, fractionDigits) : paymentUtils.convertCentToAmount(lineItem.price.value.centAmount, fractionDigits);
              orderInformationLineItems = await getLineItemDetails(lineItem, unitPrice, functionName, cartLocale, null, paymentObj, false, cartObj, false, false, lineItemTotalAmount);
              if (orderInformationLineItems && orderInformation?.lineItems) {
                orderInformation.lineItems[j] = orderInformationLineItems;
              }
              j++;
            } else if (lineItem?.discountedPricePerQuantity && 0 < lineItem?.discountedPricePerQuantity.length) {
              lineItem.discountedPricePerQuantity.forEach(async (item: any) => {
                unitPrice = paymentUtils.convertCentToAmount(item.discountedPrice.value.centAmount, fractionDigits);
                lineItemTotalAmount = unitPrice * (item.quantity);
                orderInformationLineItems = await getLineItemDetails(lineItem, unitPrice, functionName, cartLocale, item, paymentObj, false, cartObj, false, false, lineItemTotalAmount);
                if (orderInformationLineItems && orderInformation?.lineItems) {
                  orderInformation.lineItems[j] = orderInformationLineItems;
                }
                j++;
              });
            }
          });
          if (cartObj?.customLineItems && 0 < cartObj.customLineItems.length) {
            cartObj.customLineItems.forEach(async (customLineItem: any) => {
              lineItemTotalAmount = 0;
              if (customLineItem?.discountedPricePerQuantity && 0 === customLineItem.discountedPricePerQuantity.length) {
                if (customLineItem?.totalPrice?.centAmount) {
                  lineItemTotalAmount = paymentUtils.convertCentToAmount(customLineItem?.totalPrice?.centAmount, fractionDigits);
                }
                unitPrice = paymentUtils.convertCentToAmount(customLineItem.money.centAmount, fractionDigits);
                orderInformationLineItems = await getLineItemDetails(customLineItem, unitPrice, functionName, cartLocale, null, paymentObj, false, cartObj, true, false, lineItemTotalAmount);
                if (orderInformationLineItems && orderInformation?.lineItems) {
                  orderInformation.lineItems[j] = orderInformationLineItems;
                }
                j++;
              } else if (customLineItem?.discountedPricePerQuantity && 0 < customLineItem.discountedPricePerQuantity.length) {
                customLineItem.discountedPricePerQuantity.forEach(async (customItem: any) => {
                  unitPrice = paymentUtils.convertCentToAmount(customItem.discountedPrice.value.centAmount, fractionDigits);
                  lineItemTotalAmount = unitPrice * customItem.quantity;
                  orderInformationLineItems = await getLineItemDetails(customLineItem, unitPrice, functionName, cartLocale, customItem, paymentObj, false, cartObj, true, false, lineItemTotalAmount);
                  if (orderInformationLineItems && orderInformation?.lineItems) {
                    orderInformation.lineItems[j] = orderInformationLineItems;
                  }
                  j++;
                });
              }
            });
          }
          if (cartObj?.shippingMode && Constants.SHIPPING_MODE_MULTIPLE === cartObj.shippingMode && cartObj?.shipping && 0 < cartObj.shipping.length) {
            cartObj.shipping.forEach(async (shippingDetail: any) => {
              shippingCost = shippingDetail?.shippingInfo?.discountedPrice?.value?.centAmount
                ? paymentUtils.convertCentToAmount(shippingDetail.shippingInfo.discountedPrice.value.centAmount, fractionDigits)
                : paymentUtils.convertCentToAmount(shippingDetail.shippingInfo.price.centAmount, fractionDigits);
              orderInformationLineItems = await getLineItemDetails(shippingDetail, shippingCost, functionName, '', null, paymentObj, true, cartObj, false, false, shippingCost);
              if (orderInformationLineItems && orderInformation?.lineItems) {
                orderInformation.lineItems[j] = orderInformationLineItems;
              }
              j++;
            });
          } else if (cartObj?.shippingInfo) {
            if (cartObj.shippingInfo?.discountedPrice) {
              shippingCost = paymentUtils.convertCentToAmount(cartObj.shippingInfo.discountedPrice.value.centAmount, fractionDigits);
            } else if (cartObj.shippingInfo?.price) {
              shippingCost = paymentUtils.convertCentToAmount(cartObj.shippingInfo.price.centAmount, fractionDigits);
            }
            orderInformationLineItems = await getLineItemDetails(cartObj, shippingCost, functionName, '', null, paymentObj, true, cartObj, false, false, shippingCost);
            if (orderInformationLineItems && orderInformation?.lineItems) {
              orderInformation.lineItems[j] = orderInformationLineItems;
            }
            j++;
          }
          if (cartObj?.discountOnTotalPrice) {
            unitPrice = paymentUtils.convertCentToAmount(cartObj?.discountOnTotalPrice.discountedAmount.centAmount, cartObj?.discountOnTotalPrice.discountedAmount?.fractionDigits);
            orderInformationLineItems = await getLineItemDetails(cartObj, unitPrice, functionName, '', null, paymentObj, false, cartObj, false, true, unitPrice);
            if (orderInformationLineItems) {
              orderInformation.lineItems[j] = orderInformationLineItems;
            }
            j++;
          }
        }
      }
    }
    if ('FuncRefundResponse' === functionName || 'FuncCaptureResponse' === functionName || 'FuncAuthReversalResponse' === functionName) {
      const orderInformationAmountDetails = await getOrderInformationAmountDetails(functionName, captureAmount, paymentObj, null, null, null);
      orderInformation.amountDetails = orderInformationAmountDetails;
    } else if ('FuncAuthorizationResponse' === functionName) {
      const orderInformationAmountDetails = await getOrderInformationAmountDetails(functionName, null, paymentObj, cartObj, null, null);
      orderInformation.amountDetails = orderInformationAmountDetails;
    } else if ('FuncGenerateCaptureContext' === functionName) {
      const orderInformationAmountDetails = await getOrderInformationAmountDetails(functionName, null, paymentObj, cartObj, currencyCode, service);
      orderInformation.amountDetails = orderInformationAmountDetails;
    }
  } catch (exception) {
    const paymentId = paymentObj?.id ? paymentObj?.id : '';
    const resourceType = paymentObj?.id ? 'PaymentId : ' : '';
    paymentUtils.exceptionLog(path.parse(path.basename(__filename)).name, 'FuncGetOrderInformation', '', exception, paymentId, resourceType, '');
  }

  return orderInformation;
};

/**
 * Generates order information amount details based on the provided parameters.
 * 
 * @param {string} functionName - The name of the function.
 * @param {number | null} captureAmount - The capture amount.
 * @param {PaymentType | null} paymentObj - The payment object.
 * @param {any} cartObj - The cart object.
 * @param {string | null} currencyCode - The currency code.
 * @param {string | null} service - The service type.
 * @returns {Promise<any>} - The order information amount details.
 */
const getOrderInformationAmountDetails = async (functionName: string, captureAmount: number | null, paymentObj: PaymentType | null, cartObj: any, currencyCode: string | null, service: string | null) => {
  let orderInformationAmountDetails: any;
  let totalAmount = 0;
  if ('FuncRefundResponse' === functionName || 'FuncCaptureResponse' === functionName || 'FuncAuthReversalResponse' === functionName) {
    if ('FuncCaptureResponse' === functionName) {
      orderInformationAmountDetails = new restApi.Ptsv2paymentsidcapturesOrderInformationAmountDetails();
    } else if ('FuncRefundResponse' === functionName) {
      orderInformationAmountDetails = new restApi.Ptsv2paymentsidcapturesOrderInformationAmountDetails();
    } else if ('FuncAuthReversalResponse' === functionName) {
      orderInformationAmountDetails = {
        totalAmount: 0,
        currency: '',
      };
    }
    orderInformationAmountDetails.totalAmount = captureAmount;
    orderInformationAmountDetails.currency = paymentObj?.amountPlanned?.currencyCode;
  } else if ('FuncAuthorizationResponse' === functionName) {
    orderInformationAmountDetails = new restApi.Ptsv2paymentsOrderInformationAmountDetails();
    totalAmount = paymentUtils.convertCentToAmount(cartObj.totalPrice.centAmount, cartObj.totalPrice.fractionDigits);
    orderInformationAmountDetails.totalAmount = totalAmount;
    orderInformationAmountDetails.currency = cartObj?.totalPrice?.currencyCode;
  } else if ('FuncGenerateCaptureContext' === functionName) {
    orderInformationAmountDetails = new restApi.Upv1capturecontextsOrderInformationAmountDetails();
    if ('payment' === service) {
      totalAmount = paymentUtils.convertCentToAmount(cartObj.totalPrice.centAmount, cartObj.totalPrice.fractionDigits);
      orderInformationAmountDetails.totalAmount = `${totalAmount}`;
      orderInformationAmountDetails.currency = cartObj?.totalPrice?.currencyCode;
    } else if ('MyAccounts' === service) {
      totalAmount = 0.01;
      orderInformationAmountDetails.currency = currencyCode;
      orderInformationAmountDetails.totalAmount = `${totalAmount}`;
    }
  } else if ('FuncAddTokenResponse' === functionName) {
    orderInformationAmountDetails = new restApi.Ptsv2paymentsOrderInformationAmountDetails();
    orderInformationAmountDetails.totalAmount = `${totalAmount}`;
    orderInformationAmountDetails.currency = currencyCode;
  }
  return orderInformationAmountDetails;
};

/**
 * Generates order information bill-to details based on the provided parameters.
 * 
 * @param {string} functionName - The name of the function.
 * @param {any} cartObj - The cart object.
 * @param {AddressType | null} address - The address object.
 * @param {CustomerType | null} customerObj - The customer object.
 * @returns {Promise<any>} - The order information bill-to details.
 */
const getOrderInformationBillTo = async (functionName: string, cartObj: any, address: AddressType | null, customerObj: CustomerType | null): Promise<any> => {
  let orderInformationBillTo = new restApi.Ptsv2paymentsOrderInformationBillTo();
  if ('FuncAuthorizationResponse' === functionName && cartObj) {
    orderInformationBillTo = new restApi.Ptsv2paymentsOrderInformationBillTo();
    orderInformationBillTo.firstName = cartObj.billingAddress?.firstName;
    orderInformationBillTo.lastName = cartObj.billingAddress?.lastName;
    orderInformationBillTo.address1 = cartObj.billingAddress?.streetName;
    if (cartObj?.billingAddress?.additionalStreetInfo) {
      orderInformationBillTo.address2 = cartObj.billingAddress?.additionalStreetInfo;
    } else if (cartObj?.billingAddress?.streetNumber) {
      orderInformationBillTo.address2 = cartObj.billingAddress.streetNumber;
    } else {
      orderInformationBillTo.address2 = "";
    }
    orderInformationBillTo.locality = cartObj.billingAddress?.city;
    orderInformationBillTo.administrativeArea = cartObj.billingAddress?.region;
    orderInformationBillTo.postalCode = cartObj.billingAddress?.postalCode;
    orderInformationBillTo.country = cartObj.billingAddress?.country;
    orderInformationBillTo.email = cartObj.billingAddress?.email;
    if (cartObj.billingAddress?.phone) {
      orderInformationBillTo.phoneNumber = cartObj.billingAddress?.phone;
    } else if (cartObj.billingAddress?.mobile) {
      orderInformationBillTo.phoneNumber = cartObj.billingAddress?.mobile;
    }
  } else if ('FuncAddTokenResponse' === functionName && address && customerObj) {
    orderInformationBillTo.firstName = address?.firstName;
    orderInformationBillTo.lastName = address?.lastName;
    if (Constants.UC_ADDRESS === customerObj?.custom?.fields?.isv_addressId) {
      orderInformationBillTo.administrativeArea = address?.administrativeArea;
      orderInformationBillTo.address1 = address?.address1;
      if (address?.buildingNumber) {
        orderInformationBillTo.address2 = address.buildingNumber;
      } else {
        orderInformationBillTo.address2 = '';
      }
      orderInformationBillTo.locality = address?.locality;
    } else {
      orderInformationBillTo.administrativeArea = address?.region;
      orderInformationBillTo.address1 = address?.streetName;
      if (address?.additionalStreetInfo) {
        orderInformationBillTo.address2 = address.additionalStreetInfo;
      } else {
        orderInformationBillTo.address2 = '';
      }
      orderInformationBillTo.locality = address?.city;
    }
    orderInformationBillTo.postalCode = address?.postalCode;
    orderInformationBillTo.country = address?.country;
    orderInformationBillTo.email = address?.email;
    if (address?.phone) {
      orderInformationBillTo.phoneNumber = address.phone;
    } else if (address?.mobile) {
      orderInformationBillTo.phoneNumber = address.mobile
    }
  }
  return orderInformationBillTo;
};

/**
 * Generates order information ship-to details based on the provided cart object.
 * 
 * @param {any} cartObj - The cart object.
 * @returns {Promise<any>} - The order information ship-to details.
 */
const getOrderInformationShipTo = async (cartObj: any, shippingMethod: string): Promise<any> => {
  const orderInformationShipTo = new restApi.Ptsv2paymentsOrderInformationShipTo();
  if (cartObj?.shippingMode && Constants.SHIPPING_MODE_MULTIPLE == cartObj?.shippingMode && 0 < cartObj.shipping?.length) {
    orderInformationShipTo.firstName = cartObj.shipping[0].shippingAddress.firstName;
    orderInformationShipTo.lastName = cartObj.shipping[0].shippingAddress.lastName;
    orderInformationShipTo.address1 = cartObj.shipping[0].shippingAddress.streetName;
    if (cartObj?.shipping[0].shippingAddress?.additionalStreetInfo) {
      orderInformationShipTo.address2 = cartObj?.shipping[0].shippingAddress.additionalStreetInfo;
    } else if (cartObj?.shipping[0]?.shippingAddress?.streetNumber) {
      orderInformationShipTo.address2 = cartObj.shipping[0].shippingAddress.streetNumber;
    } else {
      orderInformationShipTo.address2 = '';
    }
    orderInformationShipTo.locality = cartObj.shipping[0].shippingAddress.city;
    orderInformationShipTo.administrativeArea = cartObj.shipping[0].shippingAddress.region;
    orderInformationShipTo.postalCode = cartObj.shipping[0].shippingAddress.postalCode;
    orderInformationShipTo.country = cartObj.shipping[0].shippingAddress.country;
    orderInformationShipTo.email = cartObj.shipping[0].shippingAddress.email;
    if (cartObj?.shipping[0]?.shippingAddress?.phone) {
      orderInformationShipTo.phoneNumber = cartObj.shipping[0].shippingAddress.phone;
    } else if (cartObj?.shipping[0]?.shippingAddress?.mobile) {
      orderInformationShipTo.phoneNumber = cartObj.shipping[0].shippingAddress.mobile;
    }
  } else if (cartObj?.shippingAddress) {
    orderInformationShipTo.firstName = cartObj.shippingAddress.firstName;
    orderInformationShipTo.lastName = cartObj.shippingAddress.lastName;
    orderInformationShipTo.address1 = cartObj.shippingAddress.streetName;
    if (cartObj?.shippingAddress?.additionalStreetInfo) {
      orderInformationShipTo.address2 = cartObj.shippingAddress.additionalStreetInfo;
    } else if (cartObj?.shippingAddress?.streetNumber) {
      orderInformationShipTo.address2 = cartObj.shippingAddress.streetNumber;
    } else {
      orderInformationShipTo.address2 = '';
    }
    orderInformationShipTo.locality = cartObj.shippingAddress.city;
    orderInformationShipTo.administrativeArea = cartObj.shippingAddress.region;
    orderInformationShipTo.postalCode = cartObj.shippingAddress.postalCode;
    orderInformationShipTo.country = cartObj.shippingAddress.country;
    orderInformationShipTo.email = cartObj.shippingAddress.email;
    if (cartObj?.shippingAddress?.phone) {
      orderInformationShipTo.phoneNumber = cartObj?.shippingAddress?.phone
    } else if (cartObj?.shippingAddress?.mobile) {
      orderInformationShipTo.phoneNumber = cartObj?.shippingAddress?.mobile
    }
  }
  if (shippingMethod) {
    orderInformationShipTo.method = shippingMethod;
  }
  return orderInformationShipTo;
};

/**
 * Generates line item details for order information based on the provided parameters.
 * 
 * @param {any} lineItem - The line item object.
 * @param {number} unitPrice - The unit price of the line item.
 * @param {string} functionName - The name of the function.
 * @param {string} cartLocale - The locale of the cart.
 * @param {any} item - The item object.
 * @param {PaymentType | null} paymentObj - The payment object.
 * @param {boolean} shipping - Indicates whether the line item is for shipping.
 * @param {any} cartObj - The cart object.
 * @param {boolean} customLineItem - Indicates whether the line item is a custom item.
 * @param {boolean} totalPriceDiscount - Indicates whether the line item has a total price discount.
 * @param {number} lineItemTotalAmount - The total amount of the line item.
 * @returns {Promise<any>} - The line item details.
 */
const getLineItemDetails = async (lineItem: any, unitPrice: number, functionName: string, cartLocale: string, item: any, paymentObj: PaymentType | null, shipping: boolean, cartObj: any, customLineItem: boolean, totalPriceDiscount: boolean, lineItemTotalAmount: number): Promise<any> => {
  let orderInformationLineItems;
  let discountPrice = 0;
  let fractionDigits = 0;
  if ('FuncAuthReversalResponse' === functionName) {
    orderInformationLineItems = new restApi.Ptsv2paymentsidreversalsOrderInformationLineItems();
  } else if ('FuncAuthorizationResponse' === functionName) {
    orderInformationLineItems = new restApi.Ptsv2paymentsOrderInformationLineItems();
  }
  if (paymentObj?.amountPlanned?.fractionDigits) {
    fractionDigits = paymentObj.amountPlanned.fractionDigits;
  }
  orderInformationLineItems.totalAmount = lineItemTotalAmount;
  if (shipping) {
    orderInformationLineItems.productName = lineItem.shippingInfo.shippingMethodName;
    orderInformationLineItems.quantity = 1;
    orderInformationLineItems.productSku = Constants.SHIPPING_AND_HANDLING;
    orderInformationLineItems.productCode = Constants.SHIPPING_AND_HANDLING;
    orderInformationLineItems.unitPrice = unitPrice;
    if (lineItem.shippingInfo?.discountedPrice?.includedDiscounts) {
      lineItem.shippingInfo.discountedPrice.includedDiscounts.forEach((discount: any) => {
        discountPrice += paymentUtils.convertCentToAmount(discount?.discountedAmount?.centAmount, fractionDigits);
      });
      orderInformationLineItems.discountAmount = paymentUtils.roundOff(discountPrice, fractionDigits);
    }
    if (cartObj?.shipping && cartObj.shipping[0]?.shippingInfo?.taxRate && true === cartObj?.shipping[0]?.shippingInfo?.taxRate?.includedInPrice) {
      orderInformationLineItems.taxRate = cartObj?.shipping[0].shippingInfo?.taxRate?.amount;
    }
  } else if (totalPriceDiscount) {
    orderInformationLineItems.productName = 'coupon';
    orderInformationLineItems.productSku = 'coupon';
    orderInformationLineItems.productCode = 'coupon';
    orderInformationLineItems.unitPrice = unitPrice;
    orderInformationLineItems.quantity = 1;
  } else {
    orderInformationLineItems.productName = lineItem.name[cartLocale];
    orderInformationLineItems.productSku = customLineItem ? lineItem.slug : lineItem.variant.sku;
    orderInformationLineItems.productCode = Constants.STRING_DEFAULT;
    orderInformationLineItems.unitPrice = unitPrice;
    if (item) {
      orderInformationLineItems.quantity = item.quantity;
      item.discountedPrice.includedDiscounts.forEach((discount: any) => {
        discountPrice = discountPrice + paymentUtils.convertCentToAmount(discount?.discountedAmount?.centAmount, fractionDigits) * item.quantity;
      });
      orderInformationLineItems.discountAmount = paymentUtils.roundOff(discountPrice, fractionDigits);
    } else {
      orderInformationLineItems.quantity = lineItem.quantity;
    }
    if (lineItem?.taxRate && true === lineItem.taxRate.includedInPrice) {
      if ('FuncAuthReversalResponse' === functionName) {
        orderInformationLineItems.tax = lineItem.taxRate.amount;
      } else if ('FuncAuthorizationResponse' === functionName) {
        orderInformationLineItems.taxRate = lineItem.taxRate.amount;
      }
    }
  }
  return orderInformationLineItems;
};

/**
 * Generates device information for payment based on the provided parameters.
 * 
 * @param {PaymentType | null} paymentObj - The payment object.
 * @param {CustomerType | null} customerObj - The customer object.
 * @param {string} service - The name of the service.
 * @returns {Promise<any>} - The device information.
 */
const getDeviceInformation = async (paymentObj: PaymentType | null, customerObj: CustomerType | null, service: string): Promise<any> => {
  const deviceInformation = new restApi.Ptsv2paymentsDeviceInformation();
  const customFields = paymentObj?.custom?.fields;
  if (Constants.STRING_TRUE === process.env.PAYMENT_GATEWAY_DECISION_MANAGER) {
    if (customFields?.isv_deviceFingerprintId) {
      deviceInformation.fingerprintSessionId = customFields?.isv_deviceFingerprintId;
    } else if (customerObj?.custom?.fields && customerObj.custom.fields.isv_deviceFingerprintId) {
      deviceInformation.fingerprintSessionId = customerObj?.custom?.fields.isv_deviceFingerprintId;
    }
  }
  if (customFields?.isv_customerIpAddress) {
    deviceInformation.ipAddress = customFields?.isv_customerIpAddress;
  }
  if (customFields?.isv_acceptHeader) {
    deviceInformation.httpAcceptBrowserValue = customFields?.isv_acceptHeader;
  }
  if (customFields?.isv_userAgentHeader) {
    deviceInformation.userAgentBrowserValue = customFields?.isv_userAgentHeader;
  }
  if (Constants.STRING_ENROLL_CHECK === service && customFields?.isv_screenHeight) {
    deviceInformation.httpBrowserScreenHeight = customFields?.isv_screenHeight;
  }
  if (Constants.STRING_ENROLL_CHECK === service && customFields?.isv_screenWidth) {
    deviceInformation.httpBrowserScreenWidth = customFields?.isv_screenWidth;
  }
  return deviceInformation;
};

/**
 * Generates consumer authentication information for payment based on the provided parameters.
 * 
 * @param {PaymentType} resourceObj - The payment object.
 * @param {string} service - The name of the service.
 * @param {boolean} notSaveToken - Flag indicating whether to save the token.
 * @param {boolean} payerAuthMandateFlag - Flag indicating whether payer authentication is mandated.
 * @returns {Promise<any>} - The consumer authentication information.
 */
const getConsumerAuthenticationInformation = async (resourceObj: PaymentType, service: string, notSaveToken: boolean, payerAuthMandateFlag: boolean): Promise<any> => {
  const customFields = resourceObj?.custom?.fields;
  const consumerAuthenticationInformation = new restApi.Ptsv2paymentsConsumerAuthenticationInformation();
  if (Constants.VALIDATION === service) {
    consumerAuthenticationInformation.authenticationTransactionId = customFields?.isv_payerAuthenticationTransactionId;
    consumerAuthenticationInformation.signedPares = customFields?.isv_payerAuthenticationPaReq;
  } else if (Constants.STRING_ENROLL_CHECK === service) {
    consumerAuthenticationInformation.referenceId = customFields?.isv_cardinalReferenceId;
    consumerAuthenticationInformation.acsWindowSize = Constants.PAYMENT_GATEWAY_ACS_WINDOW_SIZE;
    consumerAuthenticationInformation.returnUrl = process.env.PAYMENT_GATEWAY_3DS_RETURN_URL;
    if (payerAuthMandateFlag || (Constants.STRING_TRUE === process.env.PAYMENT_GATEWAY_SCA_CHALLENGE && !customFields?.isv_savedToken && customFields?.isv_tokenAlias && !notSaveToken)) {
      consumerAuthenticationInformation.challengeCode = Constants.PAYMENT_GATEWAY_PAYER_AUTH_CHALLENGE_CODE;
    }
  }
  return consumerAuthenticationInformation;
};

/**
 * Generates target origins based on the provided function name.
 * 
 * @param {string} functionName - The name of the function.
 * @returns {Promise<string[]>} - An array of target origins.
 */
const getTargetOrigins = async (functionName: string): Promise<string[]> => {
  let targetOriginArray: string[] = [];
  if ('FuncKeys' === functionName || 'FuncGenerateCaptureContext' === functionName) {
    if (process.env.PAYMENT_GATEWAY_TARGET_ORIGINS) {
      const targetOrigins = process.env.PAYMENT_GATEWAY_TARGET_ORIGINS;
      targetOriginArray = targetOrigins.split(Constants.REGEX_COMMA);
    }
  }
  return targetOriginArray;
};

/**
 * Generates allowed payment methods from environment variables.
 * 
 * @returns {Promise<string[]>} - An array of allowed payment methods.
 */
const getAllowedPaymentMethods = async (): Promise<string[]> => {
  let allowedPaymentTypesArray = ['PANENTRY', 'SRC', 'GOOGLEPAY'];
  if (process.env.PAYMENT_GATEWAY_UC_ALLOWED_PAYMENTS) {
    const allowedPaymentTypes = process.env.PAYMENT_GATEWAY_UC_ALLOWED_PAYMENTS;
    allowedPaymentTypesArray = allowedPaymentTypes.split(Constants.REGEX_COMMA);
  }
  return allowedPaymentTypesArray;
};

/**
 * Generates allowed card networks based on the function name from environment variables.
 * 
 * @param {string} functionName - The name of the function.
 * @returns {Promise< Promise<string[] | undefined>>} - An array of allowed card networks.
 */
const getAllowedCardNetworks = async (functionName: string): Promise<string[] | undefined> => {
  let allowedCardNetworksArray;
  if ('FuncKeys' === functionName) {
    allowedCardNetworksArray = ['VISA', 'MASTERCARD', 'AMEX', 'MAESTRO', 'CARTESBANCAIRES', 'CUP', 'JCB', 'DINERSCLUB', 'DISCOVER'];
    if (process.env.PAYMENT_GATEWAY_CC_ALLOWED_CARD_NETWORKS) {
      const allowedCardNetworks = process.env.PAYMENT_GATEWAY_CC_ALLOWED_CARD_NETWORKS;
      allowedCardNetworksArray = allowedCardNetworks.split(Constants.REGEX_COMMA);
    }
  } else if ('FuncGenerateCaptureContext' === functionName) {
    allowedCardNetworksArray = ['VISA', 'MASTERCARD', 'AMEX'];
    if (process.env.PAYMENT_GATEWAY_CC_ALLOWED_CARD_NETWORKS) {
      const allowedCardNetworks = process.env.PAYMENT_GATEWAY_CC_ALLOWED_CARD_NETWORKS;
      allowedCardNetworksArray = allowedCardNetworks.split(Constants.REGEX_COMMA);
    }
  }
  return allowedCardNetworksArray;
};

/**
 * Generates token information based on the payment and function name.
 * 
 * @param {PaymentType} payment - The payment object.
 * @param {string} functionName - The name of the function.
 * @returns {Promise<any>} - Token information.
 */
const getTokenInformation = async (payment: PaymentType, functionName: string): Promise<any> => {
  let jtiToken = {
    jti: '',
  };
  let tokenInformation;
  if ('FuncPayerAuthSetupResponse' === functionName) {
    tokenInformation = new restApi.Riskv1authenticationsetupsTokenInformation();
    if (payment?.custom?.fields?.isv_transientToken) {
      jtiToken = jwtDecode(payment.custom.fields.isv_transientToken);
    } else if (payment?.custom?.fields?.isv_token) {
      jtiToken = jwtDecode(payment.custom.fields.isv_token);
    }
    tokenInformation.transientToken = jtiToken.jti;
  } else if ('FuncAuthorizationResponse' === functionName) {
    tokenInformation = new restApi.Ptsv2paymentsTokenInformation();
    if (!payment?.custom?.fields.isv_savedToken) {
      tokenInformation.transientTokenJwt = payment?.custom?.fields.isv_token;
    } else if (payment?.custom?.fields?.isv_transientToken) {
      tokenInformation.transientTokenJwt = payment?.custom?.fields?.isv_transientToken;
    }
  }
  return tokenInformation;
};

/**
 * Generates capture mandate based on the service.
 * 
 * @param {string} service - The service type.
 * @returns {Promise<any>} - Capture mandate information.
 */
const getCaptureMandate = async (service: string): Promise<any> => {
  const captureMandate = new restApi.Upv1capturecontextsCaptureMandate();
  if ('Payments' === service) {
    captureMandate.billingType = process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE;
    if (Constants.STRING_FULL == process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE) {
      captureMandate.requestEmail = Constants.STRING_TRUE === process.env.PAYMENT_GATEWAY_UC_ENABLE_EMAIL ? true : false;
      captureMandate.requestPhone = Constants.STRING_TRUE === process.env.PAYMENT_GATEWAY_UC_ENABLE_PHONE ? true : false;
    } else {
      captureMandate.requestEmail = false;
      captureMandate.requestPhone = false;
    }
    captureMandate.requestShipping = Constants.STRING_TRUE === process.env.PAYMENT_GATEWAY_UC_ENABLE_SHIPPING ? true : false;
    if (process.env.PAYMENT_GATEWAY_UC_ALLOWED_SHIP_TO_COUNTRIES) {
      const shipToCountries = process.env.PAYMENT_GATEWAY_UC_ALLOWED_SHIP_TO_COUNTRIES;
      if (shipToCountries) {
        const shipToCountriesArray = shipToCountries.split(Constants.REGEX_COMMA);
        captureMandate.shipToCountries = shipToCountriesArray;
      }
    }
  } else if ('MyAccounts' === service) {
    captureMandate.billingType = process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE;
    captureMandate.requestShipping = false;
    captureMandate.requestEmail = Constants.STRING_FULL === process.env.PAYMENT_GATEWAY_UC_BILLING_TYPE ? true : false;
    captureMandate.requestPhone = Constants.STRING_TRUE === process.env.PAYMENT_GATEWAY_UC_ENABLE_PHONE ? true : false;
  }
  captureMandate.showAcceptedNetworkIcons = Constants.STRING_TRUE === process.env.PAYMENT_GATEWAY_UC_ENABLE_NETWORK_ICONS ? true : false;

  return captureMandate;
};

/**
 * Generates bill-to information for updating a token.
 * 
 * @param {AddressType | null} addressData - The address data.
 * @returns {Promise<any>} - Bill-to information.
 */
const getUpdateTokenBillTo = async (addressData: AddressType | null): Promise<any> => {
  let billTo;
  if (addressData) {
    billTo = new restApi.Tmsv2customersEmbeddedDefaultPaymentInstrumentBillTo();
    billTo.firstName = addressData.firstName;
    billTo.lastName = addressData.lastName;
    billTo.address1 = addressData.streetName;
    billTo.locality = addressData.city;
    billTo.administrativeArea = addressData.region;
    billTo.postalCode = addressData.postalCode;
    billTo.country = addressData.country;
    billTo.email = addressData.email;
    if (addressData.phone) {
      billTo.phoneNumber = addressData.phone;
    } else if (addressData.mobile) {
      billTo.phoneNumber = addressData.mobile;
    }
  }
  return billTo;
};

/**
 * Generates risk information for a payment.
 * 
 * @param {PaymentType} payment - The payment object.
 * @returns {Promise<any>} - Risk information.
 */
const getRiskInformation = async (payment: PaymentType) => {
  let purchaseCount = 0;
  let orderDetails;
  let riskInformation = new restApi.Riskv1authenticationsRiskInformation();
  let riskInformationBuyerHistory = new restApi.Ptsv2paymentsRiskInformationBuyerHistory();
  let riskInformationBuyerHistoryCustomerAccount = new restApi.Ptsv2paymentsRiskInformationBuyerHistoryCustomerAccount();
  if (payment?.customer?.id) {
    const customer = await commercetoolsApi.getCustomer(payment.customer.id);
    if (customer) {
      orderDetails = await commercetoolsApi.queryOrderById(customer.id, Constants.CUSTOMER_ID);
      if (orderDetails) {
        purchaseCount = orderDetails.total;
      }
      if (undefined !== purchaseCount && null !== purchaseCount) {
        if (purchaseCount) {
          riskInformationBuyerHistoryCustomerAccount.creationHistory = 'EXISTING_ACCOUNT';
          if (customer?.createdAt) {
            riskInformationBuyerHistoryCustomerAccount.createDate = customer.createdAt.split('T')[0];
          }
          riskInformationBuyerHistory.accountPurchases = purchaseCount;
        } else {
          riskInformationBuyerHistoryCustomerAccount.creationHistory = 'NEW_ACCOUNT';
        }
      }
    }
  } else {
    riskInformationBuyerHistoryCustomerAccount.creationHistory = 'GUEST';
  }
  riskInformationBuyerHistory.customerAccount = riskInformationBuyerHistoryCustomerAccount;
  riskInformation.buyerHistory = riskInformationBuyerHistory;
  return riskInformation;
}

/**
 * Generates buyer information based on the provided card tokens.
 * 
 * @param {object} paymentObj - The payment object.
 * @returns {Promise<any>} - The buyer information object.
 */
const getBuyerInformation = async (paymentObj: PaymentType): Promise<any> => {
  let buyerInformation = new restApi.Tmsv2customersBuyerInformation();
  if (paymentObj?.customer?.id) {
    buyerInformation.merchantCustomerID = paymentObj?.customer?.id;
  } else {
    buyerInformation.merchantCustomerID = paymentObj?.anonymousId;
  }
  return buyerInformation;
}

/**
 * Generates promotion information based on the provided cart object.
 * 
 * @param {any} cartObject - The card tokens.
 * @returns {Promise<any>} - The buyer information object.
 */
const getPromotionInformation = async (cartObject: any): Promise<any> => {
  let discountObject = null;
  let promotionInformation = new restApi.Ptsv2paymentsPromotionInformation();
  discountObject = await commercetoolsApi.getDiscountCodes(cartObject?.discountCodes[0]?.discountCode?.id);
  promotionInformation.code = discountObject?.code;
  return promotionInformation;
}

export default {
  getProcessingInformation,
  getPaymentInformation,
  getClientReferenceInformation,
  getOrderInformation,
  getDeviceInformation,
  getConsumerAuthenticationInformation,
  getTokenInformation,
  getUpdateTokenBillTo,
  getTargetOrigins,
  getAllowedCardNetworks,
  getCaptureMandate,
  getAllowedPaymentMethods,
  getConfigObject,
  getBuyerInformation,
  getRiskInformation,
  getPromotionInformation
};
