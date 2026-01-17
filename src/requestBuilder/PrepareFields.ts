import fs from 'fs';
import path from 'path';

import { _BaseAddress, Cart, Customer, Payment } from '@commercetools/platform-sdk';
import {
  Ptsv2paymentsBuyerInformation, Ptsv2paymentsClientReferenceInformation, Ptsv2paymentsConsumerAuthenticationInformation,
  Ptsv2paymentsDeviceInformation, Ptsv2paymentsidcapturesOrderInformationAmountDetails, Ptsv2paymentsidClientReferenceInformationPartner,
  Ptsv2paymentsidreversalsClientReferenceInformation, Ptsv2paymentsidreversalsClientReferenceInformationPartner,
  Ptsv2paymentsidreversalsOrderInformationAmountDetails, Ptsv2paymentsOrderInformationAmountDetails,
  Ptsv2paymentsOrderInformationBillTo, Ptsv2paymentsOrderInformationShipTo, Ptsv2paymentsPromotionInformation, Ptsv2paymentsRiskInformationBuyerHistory,
  Ptsv2paymentsRiskInformationBuyerHistoryCustomerAccount, Ptsv2paymentsTokenInformation, Riskv1authenticationsetupsTokenInformation,
  Riskv1authenticationsRiskInformation, Riskv1decisionsClientReferenceInformation, Riskv1decisionsClientReferenceInformationPartner,
  Tmsv2customersEmbeddedDefaultPaymentInstrumentBillTo, Upv1capturecontextsCaptureMandate, Upv1capturecontextsOrderInformationAmountDetails
} from 'cybersource-rest-client';
import { jwtDecode } from 'jwt-decode';

import { CustomMessages } from '../constants/customMessages';
import { FunctionConstant } from '../constants/functionConstant';
import { Constants } from '../constants/paymentConstants';
import { AddressType, CustomTokenType, MetaDataType, MidCredentialsType, PaymentTransactionType, ProcessingInformationType } from '../types/Types';
import paymentUtils from '../utils/PaymentUtils';
import paymentValidator from '../utils/PaymentValidator';
import commercetoolsApi from '../utils/api/CommercetoolsApi';
import multiMid from '../utils/config/MultiMid';

import { AddressMapper } from './AddressMapper';
import { OrderInformationMapper } from './OrderInformationMapper';
import { PaymentInformationModel } from './PaymentInformation';
import { ProcessingInformation } from './ProcessingInformationMapper';

/**
 * Generates the configuration object based on the provided parameters.
 * 
 * @param {string} functionName - The name of the function.
 * @param {MidCredentialsType | null} midCredentials - MID credentials.
 * @param {Payment | null} resourceObj - The payment object.
 * @param {string | null} merchantId - The merchant ID.
 * @returns {
*   authenticationType: string;
*   runEnvironment: string;
*   merchantID: string;
*   merchantKeyId: string;
*   merchantsecretKey: string;
*   logConfiguration: { enableLog: boolean };
* } 
*/
const getConfigObject = async (functionName: string, midCredentials: MidCredentialsType | null, resourceObj: Payment | null, merchantId: string | null) => {
  let configObject: any = {
    authenticationType: Constants.PAYMENT_GATEWAY_AUTHENTICATION_TYPE,
    runEnvironment: '',
    mleKeyAlias: '',
    keyFileName: '',
    keysDirectory: '',
    logConfiguration: {
      enableLog: false,
    },
    useMLEGlobally: false,
  };
  let midCredentialsObject = {} as MidCredentialsType;
  let mid = '';
  configObject.runEnvironment = Constants.LIVE_ENVIRONMENT === process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase() ? Constants.PAYMENT_GATEWAY_PRODUCTION_ENVIRONMENT : Constants.PAYMENT_GATEWAY_TEST_ENVIRONMENT;
  if (resourceObj && Constants.GET_CONFIG_BY_PAYMENT_OBJECT_FUNCTIONS.includes(functionName)) {
    mid = resourceObj?.custom?.fields?.isv_merchantId ? resourceObj.custom.fields.isv_merchantId : '';
    midCredentialsObject = multiMid.getMidCredentials(mid);
  } else if (merchantId && (FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT === functionName || FunctionConstant.FUNC_GET_CARD_BY_INSTRUMENT_RESPONSE === functionName)) {
    if (process.env.PAYMENT_GATEWAY_MERCHANT_ID === merchantId) {
      merchantId = '';
    }
    midCredentialsObject = multiMid.getMidCredentials(merchantId);
  } else if (midCredentials && Constants.GET_CONFIG_BY_MID_CREDENTIALS_FUNCTIONS.includes(functionName)) {
    midCredentialsObject = midCredentials;
  } else {
    midCredentialsObject.merchantId = process.env.PAYMENT_GATEWAY_MERCHANT_ID;
    midCredentialsObject.merchantKeyId = process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID;
    midCredentialsObject.merchantSecretKey = process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY;
  }
  if (midCredentialsObject?.merchantId && midCredentialsObject?.merchantKeyId && midCredentialsObject?.merchantSecretKey) {
    configObject.merchantID = midCredentialsObject?.merchantId;
    configObject.merchantKeyId = midCredentialsObject.merchantKeyId;
    configObject.merchantsecretKey = midCredentialsObject.merchantSecretKey;
    if (paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_USE_MLE) && !Constants.MLE_UNSUPPORTED_FUNCTIONS.includes(functionName)) {
      const jwtConfiguration = multiMid.getKeyCredentials(midCredentialsObject.merchantId);
      if (jwtConfiguration.keyPass && (jwtConfiguration.keyFileName || jwtConfiguration.keyFileUrl)) {
        configObject.useMLEGlobally = true;
        configObject.authenticationType = Constants.JWT_AUTHENTICATION;
        configObject.mleKeyAlias = jwtConfiguration.keyAlias || '';
        configObject.keyPass = jwtConfiguration.keyPass;
        const keysDirectory = path.join(__dirname, Constants.CERTIFICATE_PATH);
        let filePath = path.resolve(path.join(keysDirectory, process.env.PAYMENT_GATEWAY_KEY_FILE_NAME + '.p12'));
        if (!jwtConfiguration.keyFileName && !fs.existsSync(filePath) && (Constants.STRING_AWS === process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT || Constants.STRING_AZURE === process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT) && jwtConfiguration.keyFileUrl) {
          configObject.keyFileName = Constants.STRING_TEST;
          configObject.keysDirectory = path.resolve(__dirname, Constants.CERTIFICATE_PATH);
          await paymentUtils.setCertificatecache(jwtConfiguration.keyFileUrl, jwtConfiguration.keyPass, midCredentialsObject.merchantId);
        } else if (jwtConfiguration.keyFileName && fs.existsSync(filePath)) {
          configObject.keyFileName = jwtConfiguration.keyFileName;
          configObject.keysDirectory = path.resolve(__dirname, Constants.CERTIFICATE_PATH);
        } else {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CONFIG_OBJECT, Constants.LOG_WARN, '', CustomMessages.ERROR_MSG_CERTIFICATE_NOT_SET);
        }
      } else {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CONFIG_OBJECT, Constants.LOG_WARN, '', CustomMessages.ERROR_MSG_JWT_ENV_VARIABLE_NOT_SET);
      }
    }
  } else {
    paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CONFIG_OBJECT, Constants.LOG_WARN, '', CustomMessages.EXCEPTION_MSG_ENV_VARIABLE_NOT_SET);
    return null;
  }
  return configObject;
};

/**
 * Generates processing information object based on the provided function name and payment scenario.
 * 
 * @param {string} functionName - The name of the function.
 * @param {Payment | null} resourceObj - The payment object containing custom fields.
 * @param {string} orderNo - The order number associated with the payment.
 * @param {string} service - The service type for the payment.
 * @param {CustomTokenType | null} cardTokens - The card tokens associated with the payment.
 * @param {boolean | null} isSaveToken - Specifies whether to save the token or not. 
 * @returns {restApi.Ptsv2paymentsProcessingInformation} - The processing information object.
 */
const getProcessingInformation = (functionName: string, resourceObj: Payment | null, orderNo: string, service: string, cardTokens: CustomTokenType | null, isSaveToken: boolean | null) => {
  const processingInformation = new ProcessingInformation(functionName, resourceObj, orderNo, service, cardTokens, isSaveToken);
  return processingInformation.getProcessingInformation() as ProcessingInformationType;
};

/**
 * Generates payment information object based on the provided function name and payment scenario.
 * 
 * @param {string} functionName - The name of the function.
 * @param {Payment | null} resourceObj - The payment object containing custom fields.
 * @param {CustomTokenType | null} cardTokens - The card tokens associated with the payment.
 * @param {string | null} customerTokenId - The customer token ID associated with the payment.
 * @returns {any} - The payment information object.
 */
const getPaymentInformation = (functionName: string, resourceObj: Payment | null, cardTokens: CustomTokenType | null, customerTokenId: string | null): any => {
  const paymentInformationInstance = new PaymentInformationModel();
  const paymentInformation = paymentInformationInstance.mapPaymentInformation(functionName, resourceObj, cardTokens, customerTokenId);
  return paymentInformation;
};

/**
 * Generates client reference information based on the provided service and resource ID.
 * 
 * @param {string} service - The name of the service.
 * @param {string} resourceId - The ID of the resource.
 * @returns {any} - The client reference information object.
 */
const getClientReferenceInformation = (service: string, resourceId: string, payment?: Payment): any => {
  let customFields = payment?.custom?.fields;
  let clientReferenceInformationPartner;
  let clientReferenceInformation;
  if (FunctionConstant.FUNC_GET_PAYER_AUTH_SETUP_RESPONSE === service) {
    clientReferenceInformation = {} as Riskv1decisionsClientReferenceInformation;
    clientReferenceInformationPartner = {} as Riskv1decisionsClientReferenceInformationPartner;
  } else if (FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE === service) {
    clientReferenceInformation = {} as Ptsv2paymentsidreversalsClientReferenceInformation;
    clientReferenceInformationPartner = {} as Ptsv2paymentsidreversalsClientReferenceInformationPartner;
  } else {
    clientReferenceInformation = {} as Ptsv2paymentsClientReferenceInformation;
    clientReferenceInformationPartner = {} as Ptsv2paymentsidClientReferenceInformationPartner;
  }
  clientReferenceInformation.code = resourceId;
  if (customFields?.isv_dmpaFlag && customFields?.isv_payerEnrollTransactionId) {
    clientReferenceInformation.pausedRequestId = customFields.isv_payerEnrollTransactionId;
  }
  clientReferenceInformationPartner.solutionId = Constants.PAYMENT_GATEWAY_PARTNER_SOLUTION_ID;
  clientReferenceInformation.partner = clientReferenceInformationPartner;
  clientReferenceInformation.applicationName = Constants.PAYMENT_GATEWAY_APPLICATION_NAME;
  clientReferenceInformation.applicationVersion = Constants.PAYMENT_GATEWAY_APPLICATION_VERSION;
  if (payment?.id) {
    clientReferenceInformation.partner.originalTransactionId = payment.id;
  } else if (resourceId) {
    clientReferenceInformation.partner.originalTransactionId = resourceId;
  }
  return clientReferenceInformation;
};

/**
 * Generates order information based on the provided parameters.
 * 
 * @param {string} functionName - The name of the function.
 * @param {Payment | null} paymentObj - The payment object.
 * @param {PaymentTransactionType | null} updateTransactions - The updated transaction object.
 * @param {Cart} cartObj - The cart object.
 * @param {Customer | null} customerObj - The customer object.
 * @param {AddressType | null} address - The address object.
 * @param {string | null} service - The service name.
 * @param {string} currencyCode - The currency code.
 * @returns {OrderInformationType} - The order information object.
 */
const getOrderInformation = (functionName: string, paymentObj: Payment | null, updateTransactions: Partial<PaymentTransactionType> | null, cartObj: Cart | null, customerObj: Customer | null, address: Partial<AddressType> | null, service: string, currencyCode: string) => {
  const orderInformationMapper = new OrderInformationMapper(functionName, paymentObj, updateTransactions, cartObj, customerObj, address, service, currencyCode);
  return orderInformationMapper.getOrderInformation();
};

const getCartTotalPrice = (cartObj: Cart): number => {
  return cartObj.taxedPrice?.totalGross?.centAmount ?? cartObj.totalPrice?.centAmount ?? 0;
}

/**
 * Generates order information amount details based on the provided parameters.
 * 
 * @param {string} functionName - The name of the function.
 * @param {number | null} captureAmount - The capture amount.
 * @param {Payment | null} paymentObj - The payment object.
 * @param {Cart} cartObj - The cart object.
 * @param {string | null} currencyCode - The currency code.
 * @param {string | null} service - The service type.
 * @returns {any} - The order information amount details.
 */
const getOrderInformationAmountDetails = (functionName: string, captureAmount: number | null, paymentObj: Payment | null, cartObj: Cart | null, currencyCode: string | null, service: string | null) => {
  let orderInformationAmountDetails: any;
  if (FunctionConstant.FUNC_GET_REFUND_DATA === functionName || FunctionConstant.FUNC_GET_CAPTURE_RESPONSE === functionName || FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE === functionName) {
    switch (functionName) {
      case FunctionConstant.FUNC_GET_CAPTURE_RESPONSE:
        orderInformationAmountDetails = {} as Ptsv2paymentsidcapturesOrderInformationAmountDetails;
        break;
      case FunctionConstant.FUNC_GET_REFUND_DATA:
        orderInformationAmountDetails = {} as Ptsv2paymentsidcapturesOrderInformationAmountDetails;
        break;
      case FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE:
        orderInformationAmountDetails = {} as Ptsv2paymentsidreversalsOrderInformationAmountDetails;
        break;
    }
    orderInformationAmountDetails.totalAmount = captureAmount;
    orderInformationAmountDetails.currency = paymentObj?.amountPlanned?.currencyCode;
  } else if (cartObj?.totalPrice && (FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE === functionName)) {
    orderInformationAmountDetails = {} as Ptsv2paymentsOrderInformationAmountDetails;
    orderInformationAmountDetails.totalAmount = paymentUtils.convertCentToAmount(getCartTotalPrice(cartObj), cartObj.totalPrice.fractionDigits);
    orderInformationAmountDetails.currency = cartObj?.totalPrice?.currencyCode;
  } else if (FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT === functionName) {
    orderInformationAmountDetails = {} as Upv1capturecontextsOrderInformationAmountDetails;
    if ('Payments' === service && cartObj?.totalPrice) {
      orderInformationAmountDetails.totalAmount = `${paymentUtils.convertCentToAmount(getCartTotalPrice(cartObj), cartObj.totalPrice.fractionDigits)}`;
      orderInformationAmountDetails.currency = cartObj?.totalPrice?.currencyCode;
    } else if ('MyAccounts' === service) {
      orderInformationAmountDetails.currency = currencyCode;
      orderInformationAmountDetails.totalAmount = '0.01';
    }
  } else if (FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE === functionName) {
    orderInformationAmountDetails = {} as Ptsv2paymentsOrderInformationAmountDetails;
    orderInformationAmountDetails.totalAmount = 0;
    orderInformationAmountDetails.currency = currencyCode;
  }
  return orderInformationAmountDetails;
};

/**
 * Generates order information bill-to details based on the provided parameters.
 * 
 * @param {string} functionName - The name of the function.
 * @param {Cart} cartObj - The cart object.
 * @param {AddressType | null} address - The address object.
 * @param {Customer | null} customerObj - The customer object.
 * @returns {Ptsv2paymentsOrderInformationBillTo} - The order information bill-to details.
 */
const getOrderInformationBillToDetails = (functionName: string, cartObj: Cart | null, address: Partial<AddressType> | null, customerObj: Customer | null): Ptsv2paymentsOrderInformationBillTo => {
  let orderInformationBillTo = {} as Ptsv2paymentsOrderInformationBillTo;
  if (FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE === functionName && cartObj?.billingAddress) {
    const addressMapper = new AddressMapper(cartObj.billingAddress);
    orderInformationBillTo = addressMapper.mapOrderInformationBillTo();
  } else if (FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE === functionName && address && customerObj) {
    let mappedAddress = address;
    if (Constants.UC_ADDRESS === customerObj?.custom?.fields?.isv_addressId) {
      mappedAddress = {
        ...address,
        address1: address.address1,
        buildingNumber: address.buildingNumber,
        locality: address.locality,
        administrativeArea: address.administrativeArea,
      };
    } else {
      mappedAddress = {
        ...address,
        streetName: address.streetName,
        additionalStreetInfo: address.additionalStreetInfo,
        city: address.city,
        region: address.region
      }
    }
    const addressMapper = new AddressMapper(mappedAddress);
    if (addressMapper) {
      orderInformationBillTo = addressMapper.mapOrderInformationBillTo();
    }
  }
  return orderInformationBillTo;
}

/**
 * Generates order information ship-to details based on the provided cart object.
 * 
 * @param {Cart} cartObj - The cart object.
 * @returns {Ptsv2paymentsOrderInformationShipTo} - The order information ship-to details.
 */
const getOrderInformationShipToDetails = (cartObj: Cart | null, shippingMethod: string | undefined): Ptsv2paymentsOrderInformationShipTo => {
  let orderInformationShipTo = {} as Ptsv2paymentsOrderInformationShipTo;
  let shippingAddress = {} as _BaseAddress;
  if (cartObj?.shippingMode && Constants.SHIPPING_MODE_MULTIPLE === cartObj?.shippingMode && 0 < cartObj?.shipping?.length) {
    shippingAddress = cartObj.shipping[0].shippingAddress;
  } else if (cartObj?.shippingAddress) {
    shippingAddress = cartObj.shippingAddress;
  }
  const addressMapper = new AddressMapper(shippingAddress);
  orderInformationShipTo = addressMapper.mapOrderInformationShipto();
  if (shippingMethod) {
    orderInformationShipTo.method = shippingMethod;
  }
  return orderInformationShipTo;
};

/**
 * Generates device information for payment based on the provided parameters.
 * 
 * @param {Payment | null} paymentObj - The payment object.
 * @param {Customer | null} customerObj - The customer object.
 * @param {string} service - The name of the service.
 * @returns {Ptsv2paymentsDeviceInformation} - The device information.
 */
const getDeviceInformation = (paymentObj: Payment | null, customerObj: Customer | null, service: string): Ptsv2paymentsDeviceInformation => {
  const deviceInformation = {} as Ptsv2paymentsDeviceInformation;
  const customFields = paymentObj?.custom?.fields;
  if (paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_DECISION_MANAGER)) {
    paymentValidator.setObjectValue(deviceInformation, 'fingerprintSessionId', customFields, 'isv_deviceFingerprintId', Constants.STR_STRING, false);
    if (!deviceInformation.fingerprintSessionId) {
      paymentValidator.setObjectValue(deviceInformation, 'fingerprintSessionId', customerObj, 'custom.fields.isv_deviceFingerprintId', Constants.STR_STRING, false);
    }
  }
  paymentValidator.setObjectValue(deviceInformation, 'ipAddress', customFields, 'isv_customerIpAddress', Constants.STR_STRING, false);
  paymentValidator.setObjectValue(deviceInformation, 'httpAcceptBrowserValue', customFields, 'isv_acceptHeader', Constants.STR_STRING, false);
  paymentValidator.setObjectValue(deviceInformation, 'userAgentBrowserValue', customFields, 'isv_userAgentHeader', Constants.STR_STRING, false);
  if (Constants.STRING_ENROLL_CHECK === service) {
    paymentValidator.setObjectValue(deviceInformation, 'httpBrowserScreenHeight', customFields, 'isv_screenHeight', 'number', false);
    paymentValidator.setObjectValue(deviceInformation, 'httpBrowserScreenWidth', customFields, 'isv_screenWidth', 'number', false);
  }
  return deviceInformation;
};

/**
 * Generates consumer authentication information for payment based on the provided parameters.
 * 
 * @param {Payment} resourceObj - The payment object.
 * @param {string} service - The name of the service.
 * @param {boolean} isSaveToken - Flag indicating whether to save the token.
 * @param {boolean} payerAuthMandateFlag - Flag indicating whether payer authentication is mandated.
 * @returns {Ptsv2paymentsConsumerAuthenticationInformation} - The consumer authentication information.
 */
const getConsumerAuthenticationInformation = (resourceObj: Payment, service: string, isSaveToken: boolean, payerAuthMandateFlag: boolean): Ptsv2paymentsConsumerAuthenticationInformation => {
  const { isv_payerAuthenticationTransactionId, isv_payerAuthenticationPaReq, isv_cardinalReferenceId, isv_tokenAlias, isv_savedToken } = resourceObj?.custom?.fields || {};
  const consumerAuthenticationInformation = {} as Ptsv2paymentsConsumerAuthenticationInformation;
  if (Constants.VALIDATION === service) {
    consumerAuthenticationInformation.authenticationTransactionId = isv_payerAuthenticationTransactionId;
    consumerAuthenticationInformation.signedPares = isv_payerAuthenticationPaReq;
  } else if (Constants.STRING_ENROLL_CHECK === service) {
    consumerAuthenticationInformation.referenceId = isv_cardinalReferenceId;
    consumerAuthenticationInformation.returnUrl = process.env.PAYMENT_GATEWAY_3DS_RETURN_URL;
    if (payerAuthMandateFlag || (paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_SCA_CHALLENGE) && !isv_savedToken && isv_tokenAlias && isSaveToken)) {
      consumerAuthenticationInformation.challengeCode = Constants.PAYMENT_GATEWAY_PAYER_AUTH_CHALLENGE_CODE;
    }
  }
  return consumerAuthenticationInformation;
};

/**
 * Generates target origins based on the provided function name.
 * 
 * @param {string} functionName - The name of the function.
 * @returns {string[]} - An array of target origins.
 */
const getTargetOrigins = (): string[] => {
  let targetOriginArray: string[] = [];
  let { PAYMENT_GATEWAY_TARGET_ORIGINS } = process.env;
  if (PAYMENT_GATEWAY_TARGET_ORIGINS) {
    const targetOrigins = PAYMENT_GATEWAY_TARGET_ORIGINS;
    targetOriginArray = targetOrigins.split(Constants.REGEX_COMMA);
  }
  return targetOriginArray;
};

/**
 * Generates allowed payment methods from environment variables.
 * 
 * @returns {string[]} - An array of allowed payment methods.
 */
const getAllowedPaymentMethods = (): string[] => {
  let { PAYMENT_GATEWAY_UC_ALLOWED_PAYMENTS } = process.env;
  let allowedPaymentTypesArray = ['PANENTRY', 'SRC', 'GOOGLEPAY'];
  if (PAYMENT_GATEWAY_UC_ALLOWED_PAYMENTS) {
    const allowedPaymentTypes = PAYMENT_GATEWAY_UC_ALLOWED_PAYMENTS;
    allowedPaymentTypesArray = allowedPaymentTypes.split(Constants.REGEX_COMMA);
  }
  return allowedPaymentTypesArray;
};

/**
 * Generates allowed card networks based on the function name from environment variables.
 * 
 * @param {string} functionName - The name of the function.
 * @returns {string[] | undefined} - An array of allowed card networks.
 */
const getAllowedCardNetworks = (functionName: string): string[] | undefined => {
  let { PAYMENT_GATEWAY_CC_ALLOWED_CARD_NETWORKS } = process.env;
  let allowedCardNetworksArray = (FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT === functionName) ? Constants.UC_ALLOWED_CARD_NETWORKS : Constants.FLEX_MICROFORM_ALLOWED_CARDS;
  if (PAYMENT_GATEWAY_CC_ALLOWED_CARD_NETWORKS) {
    const allowedCardNetworks = PAYMENT_GATEWAY_CC_ALLOWED_CARD_NETWORKS;
    allowedCardNetworksArray = allowedCardNetworks.split(Constants.REGEX_COMMA);
  }
  return allowedCardNetworksArray;
};

/**
 * Generates token information based on the payment and function name.
 * 
 * @param {Payment} payment - The payment object.
 * @param {string} functionName - The name of the function.
 * @returns {any} - Token information.
 */
const getTokenInformation = (payment: Payment, functionName: string): any => {
  let jtiToken = {
    jti: '',
  };
  let tokenInformation;
  if (FunctionConstant.FUNC_GET_PAYER_AUTH_SETUP_DATA === functionName) {
    tokenInformation = {} as Riskv1authenticationsetupsTokenInformation;
    if (payment?.custom?.fields?.isv_transientToken) {
      jtiToken = jwtDecode(payment.custom.fields.isv_transientToken);
    } else if (payment?.custom?.fields?.isv_token) {
      jtiToken = jwtDecode(payment.custom.fields.isv_token);
    }
    tokenInformation.transientToken = jtiToken.jti;
  } else {
    tokenInformation = {} as Ptsv2paymentsTokenInformation;
    if (!payment?.custom?.fields.isv_savedToken && !payment?.custom?.fields?.isv_transientToken) {
      tokenInformation.transientTokenJwt = payment?.custom?.fields.isv_token;
    } else if (payment?.custom?.fields?.isv_transientToken) {
      tokenInformation.transientTokenJwt = payment.custom.fields.isv_transientToken;
    }
  }
  return tokenInformation;
};

/**
 * Generates capture mandate based on the service.
 * 
 * @param {string} service - The service type.
 * @returns {Upv1capturecontextsCaptureMandate} - Capture mandate information.
 */
const getCaptureMandate = (service: string): Upv1capturecontextsCaptureMandate => {
  const captureMandate = {} as Upv1capturecontextsCaptureMandate;
  const { PAYMENT_GATEWAY_UC_BILLING_TYPE, PAYMENT_GATEWAY_UC_ENABLE_PHONE, PAYMENT_GATEWAY_UC_ENABLE_EMAIL, PAYMENT_GATEWAY_UC_ENABLE_NETWORK_ICONS,
    PAYMENT_GATEWAY_UC_ENABLE_SHIPPING, PAYMENT_GATEWAY_UC_ALLOWED_SHIP_TO_COUNTRIES
  } = process.env;
  captureMandate.requestEmail = false;
  captureMandate.requestPhone = false;
  if ('Payments' === service) {
    captureMandate.billingType = PAYMENT_GATEWAY_UC_BILLING_TYPE;
    if (Constants.STRING_FULL == PAYMENT_GATEWAY_UC_BILLING_TYPE) {
      captureMandate.requestEmail = paymentUtils.toBoolean(PAYMENT_GATEWAY_UC_ENABLE_EMAIL) ? true : false;
      captureMandate.requestPhone = paymentUtils.toBoolean(PAYMENT_GATEWAY_UC_ENABLE_PHONE) ? true : false;
    }
    captureMandate.requestShipping = paymentUtils.toBoolean(PAYMENT_GATEWAY_UC_ENABLE_SHIPPING) ? true : false;
    if (PAYMENT_GATEWAY_UC_ALLOWED_SHIP_TO_COUNTRIES) {
      const shipToCountries = PAYMENT_GATEWAY_UC_ALLOWED_SHIP_TO_COUNTRIES;
      if (shipToCountries) {
        const shipToCountriesArray = shipToCountries.split(Constants.REGEX_COMMA);
        captureMandate.shipToCountries = shipToCountriesArray;
      }
    }
  } else if ('MyAccounts' === service) {
    captureMandate.billingType = PAYMENT_GATEWAY_UC_BILLING_TYPE;
    captureMandate.requestShipping = false;
    captureMandate.requestEmail = Constants.STRING_FULL === PAYMENT_GATEWAY_UC_BILLING_TYPE ? true : false;
    captureMandate.requestPhone = paymentUtils.toBoolean(PAYMENT_GATEWAY_UC_ENABLE_PHONE) ? true : false;
  }
  captureMandate.showAcceptedNetworkIcons = paymentUtils.toBoolean(PAYMENT_GATEWAY_UC_ENABLE_NETWORK_ICONS) ? true : false;

  return captureMandate;
};

/**
 * Generates bill-to information for updating a token.
 * 
 * @param {AddressType | null} addressData - The address data.
 * @returns {Tmsv2customersEmbeddedDefaultPaymentInstrumentBillTo} billTo - Bill-to information.
 */
const getUpdateTokenBillTo = (addressData: AddressType | null): Tmsv2customersEmbeddedDefaultPaymentInstrumentBillTo => {
  let billTo: Tmsv2customersEmbeddedDefaultPaymentInstrumentBillTo = {};
  if (addressData) {
    const addressMapperInstance = new AddressMapper(addressData);
    billTo = addressMapperInstance.mapUpdateTokenBillTo();
  }
  return billTo;
};

/**
 * Generates risk information for a payment.
 * 
 * @param {Payment} payment - The payment object.
 * @returns {Promise<Riskv1authenticationsRiskInformation>} - Risk information.
 */
const getRiskInformation = async (payment: Payment): Promise<Riskv1authenticationsRiskInformation> => {
  let creationHistory = 'GUEST';
  let riskInformation = {} as Riskv1authenticationsRiskInformation;
  let riskInformationBuyerHistory = {} as Ptsv2paymentsRiskInformationBuyerHistory;
  let riskInformationBuyerHistoryCustomerAccount = {} as Ptsv2paymentsRiskInformationBuyerHistoryCustomerAccount;
  const customerId = payment?.customer?.id || '';
  if (customerId) {
    const customer = await commercetoolsApi.getCustomer(customerId);
    if (customer) {
      if (0 < payment?.custom?.fields?.isv_accountPurchaseCount) {
        creationHistory = 'EXISTING_ACCOUNT';
        riskInformationBuyerHistoryCustomerAccount.createDate = customer?.createdAt?.split('T')[0];
        riskInformationBuyerHistory.accountPurchases = payment?.custom?.fields?.isv_accountPurchaseCount;
      } else {
        creationHistory = 'NEW_ACCOUNT';
      }
    }
  }
  riskInformationBuyerHistoryCustomerAccount.creationHistory = creationHistory;
  riskInformationBuyerHistory.customerAccount = riskInformationBuyerHistoryCustomerAccount;
  riskInformation.buyerHistory = riskInformationBuyerHistory;
  return riskInformation;
}

/**
 * Generates buyer information based on the provided card tokens.
 * 
 * @param {object} paymentObj - The payment object.
 * @returns {Ptsv2paymentsBuyerInformation} - The buyer information object.
 */
const getBuyerInformation = (paymentObj: Payment): Ptsv2paymentsBuyerInformation => {
  let buyerInformation = {} as Ptsv2paymentsBuyerInformation;
  paymentValidator.setObjectValue(buyerInformation, 'merchantCustomerID', paymentObj, 'customer.id', Constants.STR_STRING, false);
  if (!buyerInformation.merchantCustomerID) {
    buyerInformation.merchantCustomerID = paymentObj?.anonymousId
  }
  return buyerInformation;
}

/**
 * Generates promotion information based on the provided cart object.
 * 
 * @param {Cart} cartObject - The card tokens.
 * @returns {Promise<Ptsv2paymentsPromotionInformation>} - The buyer information object.
 */
const getPromotionInformation = async (cartObject: Cart): Promise<Ptsv2paymentsPromotionInformation> => {
  let discountObject = null;
  let promotionInformation = {} as Ptsv2paymentsPromotionInformation;
  discountObject = await commercetoolsApi.getDiscountCodes(cartObject?.discountCodes[0]?.discountCode?.id);
  promotionInformation.code = discountObject?.code;
  return promotionInformation;
}

const getMetaData = (payment: Payment): MetaDataType[] => {
  let metaData: MetaDataType[] = [];
  let customMetaData = payment?.custom?.fields?.isv_metadata && JSON.parse(payment.custom.fields.isv_metadata);
  if (customMetaData) {
    metaData = Object.entries(customMetaData)
      .map(([key, value]) => ({
        key: key,
        value: value
      })) as MetaDataType[];
  }
  return metaData;
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
  getBuyerInformation,
  getRiskInformation,
  getPromotionInformation,
  getOrderInformationAmountDetails,
  getOrderInformationBillToDetails,
  getOrderInformationShipToDetails,
  getMetaData
};
