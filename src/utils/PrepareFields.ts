import path from 'path';

import restApi from 'cybersource-rest-client';
import { jwtDecode } from 'jwt-decode';

import { Constants } from '../constants';
import { addressType, customerType, customTokenType, midCredentialsType, orderInformationLineItemsType, orderInformationType, paymentTransactionType, paymentType } from '../types/Types';
import multiMid from '../utils/config/MultiMid';

import paymentUtils from './PaymentUtils';

const getConfigObject = async (functionName: string, midCredentials: midCredentialsType | null, resourceObj: paymentType | null, merchantId: string | null) => {
  let configObject;
  let midCredentialsObject: midCredentialsType = {
    merchantId: '',
    merchantKeyId: '',
    merchantSecretKey: '',
  } as midCredentialsType;
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
    if( process.env.PAYMENT_GATEWAY_MERCHANT_ID === merchantId){
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

const getProcessingInformation = async (functionName: string, resourceObj: paymentType | null, orderNo: string, service: string, cardTokens: customTokenType | null, notSaveToken: boolean | null) => {
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

const getPaymentInformation = async (functionName: string, resourceObj: paymentType | null, cardTokens: customTokenType | null, customerTokenId: string | null) => {
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
          paymentInformation.paymentType = paymentInformationPaymentType;
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

const getClientReferenceInformation = async (service: string, resourceId: string) => {
  let clientReferenceInformationPartner = {
    solutionId: '',
  };
  let clientReferenceInformation = {
    code: '',
    partner: clientReferenceInformationPartner,
  };
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
  clientReferenceInformationPartner.solutionId = Constants.PAYMENT_GATEWAY_PARTNER_SOLUTION_ID;
  clientReferenceInformation.partner = clientReferenceInformationPartner;
  return clientReferenceInformation;
};

const getOrderInformation = async (functionName: string, paymentObj: paymentType | null, updateTransactions: paymentTransactionType | null, cartObj: any, customerObj: customerType | null, address: addressType | null, service: string | null, currencyCode: string) => {
  let orderInformationLineItems = {};
  let cartLocale = '';
  let unitPrice: number | null;
  let shippingCost = 0;
  let j = 0;
  let orderInformation: orderInformationType = {};
  let centAmount = 0.0;
  let captureAmount = 0.0;
  let fractionDigits = 0;
  try {
    if (null !== updateTransactions && null !== paymentObj) {
      centAmount = updateTransactions?.amount?.centAmount ? updateTransactions.amount.centAmount : paymentObj?.amountPlanned?.centAmount;
      captureAmount = paymentUtils.convertCentToAmount(centAmount, paymentObj.amountPlanned.fractionDigits);
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
      const orderInformationShipTo = await getOrderInformationShipTo(cartObj);
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
            if (lineItem?.discountedPricePerQuantity && 0 === lineItem.discountedPricePerQuantity.length) {
              unitPrice = lineItem?.price?.discounted?.value?.centAmount ? paymentUtils.convertCentToAmount(lineItem.price.discounted.value.centAmount, fractionDigits) : paymentUtils.convertCentToAmount(lineItem.price.value.centAmount, fractionDigits);
              orderInformationLineItems = await getLineItemDetails(lineItem, unitPrice, functionName, cartLocale, null, paymentObj, false, cartObj, false, false);
              if (orderInformationLineItems && orderInformation?.lineItems) {
                orderInformation.lineItems[j] = orderInformationLineItems;
              }
              j++;
            } else if (lineItem?.discountedPricePerQuantity && 0 < lineItem?.discountedPricePerQuantity.length) {
              lineItem.discountedPricePerQuantity.forEach(async (item: any) => {
                unitPrice = paymentUtils.convertCentToAmount(item.discountedPrice.value.centAmount, fractionDigits);
                orderInformationLineItems = await getLineItemDetails(lineItem, unitPrice, functionName, cartLocale, item, paymentObj, false, cartObj, false, false);
                if (orderInformationLineItems && orderInformation?.lineItems) {
                  orderInformation.lineItems[j] = orderInformationLineItems as orderInformationLineItemsType;
                }
                j++;
              });
            }
          });
          if (cartObj?.customLineItems && 0 < cartObj.customLineItems.length) {
            cartObj.customLineItems.forEach(async (customLineItem: any) => {
              if (customLineItem?.discountedPricePerQuantity && 0 === customLineItem.discountedPricePerQuantity.length) {
                unitPrice = paymentUtils.convertCentToAmount(customLineItem.money.centAmount, fractionDigits);
                orderInformationLineItems = await getLineItemDetails(customLineItem, unitPrice, functionName, cartLocale, null, paymentObj, false, cartObj, true, false);
                if (orderInformationLineItems && orderInformation?.lineItems) {
                  orderInformation.lineItems[j] = orderInformationLineItems as orderInformationLineItemsType;
                }
                j++;
              } else if (customLineItem?.discountedPricePerQuantity && 0 < customLineItem.discountedPricePerQuantity.length) {
                customLineItem.discountedPricePerQuantity.forEach(async (customItem: any) => {
                  unitPrice = paymentUtils.convertCentToAmount(customItem.discountedPrice.value.centAmount, fractionDigits);
                  orderInformationLineItems = await getLineItemDetails(customLineItem, unitPrice, functionName, cartLocale, customItem, paymentObj, false, cartObj, true, false);
                  if (orderInformationLineItems && orderInformation?.lineItems) {
                    orderInformation.lineItems[j] = orderInformationLineItems as orderInformationLineItemsType;
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
              orderInformationLineItems = await getLineItemDetails(shippingDetail, shippingCost, functionName, '', null, paymentObj, true, cartObj, false, false);
              if (orderInformationLineItems && orderInformation?.lineItems) {
                orderInformation.lineItems[j] = orderInformationLineItems as orderInformationLineItemsType;
              }
              j++;
            });
          } else if (cartObj?.shippingInfo) {
            if (cartObj.shippingInfo?.discountedPrice) {
              shippingCost = paymentUtils.convertCentToAmount(cartObj.shippingInfo.discountedPrice.value.centAmount, fractionDigits);
            } else if (cartObj.shippingInfo?.price) {
              shippingCost = paymentUtils.convertCentToAmount(cartObj.shippingInfo.price.centAmount, fractionDigits);
            }
            orderInformationLineItems = await getLineItemDetails(cartObj, shippingCost, functionName, '', null, paymentObj, true, cartObj, false, false);
            if (orderInformationLineItems && orderInformation?.lineItems) {
              orderInformation.lineItems[j] = orderInformationLineItems as orderInformationLineItemsType;
            }
            j++;
          }
          if (cartObj?.discountOnTotalPrice) {
            unitPrice = paymentUtils.convertCentToAmount(cartObj?.discountOnTotalPrice.discountedAmount.centAmount, cartObj?.discountOnTotalPrice.discountedAmount?.fractionDigits);
            orderInformationLineItems = await getLineItemDetails(cartObj, unitPrice, functionName, '', null, paymentObj, false, cartObj, false, true);
            if (orderInformationLineItems) {
              orderInformation.lineItems[j] = orderInformationLineItems as orderInformationLineItemsType;
            }
            j++;
          }
        }
      }
    }
    if ('FuncRefundResponse' === functionName || 'FuncAuthorizationResponse' === functionName || 'FuncCaptureResponse' === functionName || 'FuncAuthReversalResponse' === functionName) {
      const orderInformationAmountDetails = await getOrderInformationAmountDetails(functionName, captureAmount, paymentObj, null, null, null);
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

const getOrderInformationAmountDetails = async (functionName: string, captureAmount: number | null, paymentObj: paymentType | null, cartObj: any, currencyCode: string | null, service: string | null) => {
  let orderInformationAmountDetails: any;
  let totalAmount = 0;
  if ('FuncRefundResponse' === functionName || 'FuncAuthorizationResponse' === functionName || 'FuncCaptureResponse' === functionName || 'FuncAuthReversalResponse' === functionName) {
    if ('FuncCaptureResponse' === functionName) {
      orderInformationAmountDetails = new restApi.Ptsv2paymentsidcapturesOrderInformationAmountDetails();
    } else if ('FuncRefundResponse' === functionName) {
      orderInformationAmountDetails = new restApi.Ptsv2paymentsidcapturesOrderInformationAmountDetails();
    } else if ('FuncAuthorizationResponse' === functionName) {
      orderInformationAmountDetails = new restApi.Ptsv2paymentsOrderInformationAmountDetails();
    } else if ('FuncAuthReversalResponse' === functionName) {
      orderInformationAmountDetails = {
        totalAmount: 0,
        currency: '',
      };
    }
    orderInformationAmountDetails.totalAmount = captureAmount;
    orderInformationAmountDetails.currency = paymentObj?.amountPlanned?.currencyCode;
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

const getOrderInformationBillTo = async (functionName: string, cartObj: any, address: addressType | null, customerObj: customerType | null) => {
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
    }
    orderInformationBillTo.locality = cartObj.billingAddress?.city;
    orderInformationBillTo.administrativeArea = cartObj.billingAddress?.region;
    orderInformationBillTo.postalCode = cartObj.billingAddress?.postalCode;
    orderInformationBillTo.country = cartObj.billingAddress?.country;
    orderInformationBillTo.email = cartObj.billingAddress?.email;
    orderInformationBillTo.phoneNumber = cartObj.billingAddress?.phone;
  } else if ('FuncAddTokenResponse' === functionName && address && customerObj) {
    orderInformationBillTo.firstName = address?.firstName;
    orderInformationBillTo.lastName = address?.lastName;
    if (Constants.UC_ADDRESS === customerObj?.custom?.fields?.isv_addressId) {
      orderInformationBillTo.administrativeArea = address?.administrativeArea;
      orderInformationBillTo.address1 = address?.address1;
      if (address?.buildingNumber) {
        orderInformationBillTo.address2 = address.buildingNumber;
      }
      orderInformationBillTo.locality = address?.locality;
    } else {
      orderInformationBillTo.administrativeArea = address?.region;
      orderInformationBillTo.address1 = address?.streetName;
      if (address?.additionalStreetInfo) {
        orderInformationBillTo.address2 = address.additionalStreetInfo;
      }
      orderInformationBillTo.locality = address?.city;
    }
    orderInformationBillTo.postalCode = address?.postalCode;
    orderInformationBillTo.country = address?.country;
    orderInformationBillTo.email = address?.email;
    orderInformationBillTo.phoneNumber = address?.phone;
  }
  return orderInformationBillTo;
};

const getOrderInformationShipTo = async (cartObj: any) => {
  const orderInformationShipTo = new restApi.Ptsv2paymentsOrderInformationShipTo();
  if (cartObj?.shippingMode && Constants.SHIPPING_MODE_MULTIPLE == cartObj?.shippingMode && 0 < cartObj.shipping?.length) {
    orderInformationShipTo.firstName = cartObj.shipping[0].shippingAddress.firstName;
    orderInformationShipTo.lastName = cartObj.shipping[0].shippingAddress.lastName;
    orderInformationShipTo.address1 = cartObj.shipping[0].shippingAddress.streetName;
    if (cartObj?.shipping[0].shippingAddress?.additionalStreetInfo) {
      orderInformationShipTo.address2 = cartObj?.shipping[0].shippingAddress.additionalStreetInfo;
    } else if (cartObj?.shipping[0]?.shippingAddress?.streetNumber) {
      orderInformationShipTo.address2 = cartObj.shipping[0].shippingAddress.streetNumber;
    }
    orderInformationShipTo.locality = cartObj.shipping[0].shippingAddress.city;
    orderInformationShipTo.administrativeArea = cartObj.shipping[0].shippingAddress.region;
    orderInformationShipTo.postalCode = cartObj.shipping[0].shippingAddress.postalCode;
    orderInformationShipTo.country = cartObj.shipping[0].shippingAddress.country;
    orderInformationShipTo.email = cartObj.shipping[0].shippingAddress.email;
    orderInformationShipTo.phoneNumber = cartObj.shipping[0].shippingAddress.phone;
  } else if (cartObj?.shippingAddress) {
    orderInformationShipTo.firstName = cartObj.shippingAddress.firstName;
    orderInformationShipTo.lastName = cartObj.shippingAddress.lastName;
    orderInformationShipTo.address1 = cartObj.shippingAddress.streetName;
    if (cartObj?.shippingAddress?.additionalStreetInfo) {
      orderInformationShipTo.address2 = cartObj.shippingAddress.additionalStreetInfo;
    } else if (cartObj?.shippingAddress?.streetNumber) {
      orderInformationShipTo.address2 = cartObj.shippingAddress.streetNumber;
    }
    orderInformationShipTo.locality = cartObj.shippingAddress.city;
    orderInformationShipTo.administrativeArea = cartObj.shippingAddress.region;
    orderInformationShipTo.postalCode = cartObj.shippingAddress.postalCode;
    orderInformationShipTo.country = cartObj.shippingAddress.country;
    orderInformationShipTo.email = cartObj.shippingAddress.email;
    orderInformationShipTo.phoneNumber = cartObj.shippingAddress.phone;
  }
  return orderInformationShipTo;
};

const getLineItemDetails = async (lineItem: any, unitPrice: number, functionName: string, cartLocale: string, item: any, paymentObj: paymentType | null, shipping: boolean, cartObj: any, customLineItem: boolean, totalPriceDiscount: boolean) => {
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

const getDeviceInformation = async (paymentObj: paymentType | null, customerObj: customerType | null) => {
  const deviceInformation = new restApi.Ptsv2paymentsDeviceInformation();
  const customFields = paymentObj?.custom?.fields;
  if(Constants.STRING_TRUE === process.env.PAYMENT_GATEWAY_DECISION_MANAGER){
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
  return deviceInformation;
};

const getConsumerAuthenticationInformation = async (resourceObj: paymentType, service: string, notSaveToken: boolean, payerAuthMandateFlag: boolean) => {
  const customFields = resourceObj?.custom?.fields;
  const consumerAuthenticationInformation = new restApi.Ptsv2paymentsConsumerAuthenticationInformation();
  if (Constants.VALIDATION === service) {
    consumerAuthenticationInformation.authenticationTransactionId = customFields?.isv_payerAuthenticationTransactionId;
    consumerAuthenticationInformation.signedPares = customFields?.isv_payerAuthenticationPaReq;
  } else if (Constants.STRING_ENROLL_CHECK === service) {
    consumerAuthenticationInformation.referenceId = customFields?.isv_cardinalReferenceId;
    consumerAuthenticationInformation.acsWindowSize = Constants.PAYMENT_GATEWAY_ACS_WINDOW_SIZE;
    consumerAuthenticationInformation.returnUrl = process.env.PAYMENT_GATEWAY_3DS_RETURN_URL;
    if (payerAuthMandateFlag || (Constants.STRING_TRUE === process.env.PAYMENT_GATEWAY_SCA_CHALLENGE && (undefined === customFields?.isv_savedToken || null === customFields?.isv_savedToken || '' === customFields?.isv_savedToken) && customFields?.isv_tokenAlias && !notSaveToken)) {
      consumerAuthenticationInformation.challengeCode = Constants.PAYMENT_GATEWAY_PAYER_AUTH_CHALLENGE_CODE;
    }
  }
  return consumerAuthenticationInformation;
};

const getTargetOrigins = async (functionName: string) => {
  let targetOriginArray: string[] = [];
  if ('FuncKeys' === functionName || 'FuncGenerateCaptureContext' === functionName) {
    if (process.env.PAYMENT_GATEWAY_TARGET_ORIGINS) {
      const targetOrigins = process.env.PAYMENT_GATEWAY_TARGET_ORIGINS;
      targetOriginArray = targetOrigins.split(Constants.REGEX_COMMA);
    }
  }
  return targetOriginArray;
};

const getAllowedPaymentMethods = async () => {
  let allowedPaymentTypesArray = ['PANENTRY', 'SRC', 'GOOGLEPAY'];
  if (process.env.PAYMENT_GATEWAY_UC_ALLOWED_PAYMENTS) {
    const allowedPaymentTypes = process.env.PAYMENT_GATEWAY_UC_ALLOWED_PAYMENTS;
    allowedPaymentTypesArray = allowedPaymentTypes.split(Constants.REGEX_COMMA);
  }
  return allowedPaymentTypesArray;
};

const getAllowedCardNetworks = async (functionName: string) => {
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

const getTokenInformation = async (payment: paymentType, functionName: string) => {
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

const getCaptureMandate = async (service: string) => {
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

const getUpdateTokenBillTo = async (addressData: addressType | null) => {
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
    billTo.phoneNumber = addressData.phone;
  }
  return billTo;
};

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
};
