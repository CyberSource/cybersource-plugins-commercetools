import { Ptsv2paymentsClientReferenceInformation, Ptsv2paymentsConsumerAuthenticationInformation, Ptsv2paymentsDeviceInformation, Ptsv2paymentsidcapturesOrderInformationAmountDetails, Ptsv2paymentsidClientReferenceInformationPartner, Ptsv2paymentsidreversalsClientReferenceInformation, Ptsv2paymentsidreversalsClientReferenceInformationPartner, Ptsv2paymentsidreversalsOrderInformationAmountDetails, Ptsv2paymentsOrderInformationAmountDetails, Ptsv2paymentsOrderInformationBillTo, Ptsv2paymentsOrderInformationShipTo, Ptsv2paymentsPromotionInformation, Ptsv2paymentsRiskInformationBuyerHistory, Ptsv2paymentsRiskInformationBuyerHistoryCustomerAccount, Ptsv2paymentsTokenInformation, Riskv1authenticationsetupsTokenInformation, Riskv1authenticationsRiskInformation, Riskv1decisionsClientReferenceInformation, Riskv1decisionsClientReferenceInformationPartner, Tmsv2customersBuyerInformation, Upv1capturecontextsCaptureMandate, Upv1capturecontextsOrderInformationAmountDetails } from 'cybersource-rest-client';
import { jwtDecode } from 'jwt-decode';

import { Constants } from '../constants/constants';
import { CustomMessages } from '../constants/customMessages';
import { FunctionConstant } from '../constants/functionConstant';
import { AddressType, CustomerType, CustomTokenType, MidCredentialsType, PaymentTransactionType, PaymentType, ProcessingInformationType } from '../types/Types';
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
  let configObject = {
    authenticationType: Constants.PAYMENT_GATEWAY_AUTHENTICATION_TYPE,
    runEnvironment: '',
    merchantID: '',
    merchantKeyId: '',
    merchantsecretKey: '',
    logConfiguration: {
      enableLog: false,
    },
  };
  let midCredentialsObject: MidCredentialsType = {
    merchantId: '',
    merchantKeyId: '',
    merchantSecretKey: '',
  };
  let mid = '';
  configObject.runEnvironment = Constants.LIVE_ENVIRONMENT === process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase() ? Constants.PAYMENT_GATEWAY_PRODUCTION_ENVIRONMENT : Constants.PAYMENT_GATEWAY_TEST_ENVIRONMENT;
  if (resourceObj && Constants.GET_CONFIG_BY_PAYMENT_OBJECT_FUNCTIONS.includes(functionName)) {
    mid = resourceObj?.custom?.fields?.isv_merchantId ? resourceObj.custom.fields.isv_merchantId : '';
    midCredentialsObject = await multiMid.getMidCredentials(mid);
  } else if (merchantId && (FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT === functionName || FunctionConstant.FUNC_GET_CARD_BY_INSTRUMENT_RESPONSE === functionName)) {
    if (process.env.PAYMENT_GATEWAY_MERCHANT_ID === merchantId) {
      merchantId = '';
    }
    midCredentialsObject = await multiMid.getMidCredentials(merchantId);
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
  } else {
    paymentUtils.logData(__filename, 'FuncGetConfigObject', Constants.LOG_INFO, '', CustomMessages.EXCEPTION_MSG_ENV_VARIABLE_NOT_SET);
    return null;
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
 * @param {boolean | null} isSaveToken - Specifies whether to save the token or not. 
 * @returns {Promise<restApi.Ptsv2paymentsProcessingInformation>} - The processing information object.
 */
const getProcessingInformation = async (functionName: string, resourceObj: PaymentType | null, orderNo: string, service: string, cardTokens: CustomTokenType | null, isSaveToken: boolean | null) => {
  const processingInformation = new ProcessingInformation(functionName, resourceObj, orderNo, service, cardTokens, isSaveToken);
  return processingInformation.getProcessingInformation() as ProcessingInformationType;
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
  const paymentInformationInstance = new PaymentInformationModel();
  const paymentInformation = paymentInformationInstance.mapPaymentInformation(functionName, resourceObj, cardTokens, customerTokenId);
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
  let clientReferenceInformation;
  let customFields = payment?.custom?.fields;
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
 * @param {PaymentType | null} paymentObj - The payment object.
 * @param {PaymentTransactionType | null} updateTransactions - The updated transaction object.
 * @param {any} cartObj - The cart object.
 * @param {CustomerType | null} customerObj - The customer object.
 * @param {AddressType | null} address - The address object.
 * @param {string | null} service - The service name.
 * @param {string} currencyCode - The currency code.
 * @returns {Promise<OrderInformationType>} - The order information object.
 */
const getOrderInformation = (functionName: string, paymentObj: PaymentType | null, updateTransactions: Partial<PaymentTransactionType> | null, cartObj: any, customerObj: Partial<CustomerType> | null, address: AddressType | null, service: string | null, currencyCode: string) => {
  const orderInformationMapper = new OrderInformationMapper(functionName, paymentObj, updateTransactions, cartObj, customerObj, address, service, currencyCode);
  return orderInformationMapper.getOrderInformation();
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
const getOrderInformationAmountDetails = (functionName: string, captureAmount: number | null, paymentObj: PaymentType | null, cartObj: any, currencyCode: string | null, service: string | null) => {
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
  } else if (FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE === functionName) {
    orderInformationAmountDetails = {} as Ptsv2paymentsOrderInformationAmountDetails;
    orderInformationAmountDetails.totalAmount = paymentUtils.convertCentToAmount(cartObj.totalPrice.centAmount, cartObj.totalPrice.fractionDigits);
    orderInformationAmountDetails.currency = cartObj?.totalPrice?.currencyCode;
  } else if (FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT === functionName) {
    orderInformationAmountDetails = {} as Upv1capturecontextsOrderInformationAmountDetails;
    if ('Payments' === service) {
      orderInformationAmountDetails.totalAmount = `${paymentUtils.convertCentToAmount(cartObj.totalPrice.centAmount, cartObj.totalPrice.fractionDigits)}`;
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
 * @param {any} cartObj - The cart object.
 * @param {AddressType | null} address - The address object.
 * @param {CustomerType | null} customerObj - The customer object.
 * @returns {Promise<any>} - The order information bill-to details.
 */
const getOrderInformationBillToDetails = (functionName: string, cartObj: any, address: AddressType | null, customerObj: Partial<CustomerType> | null): any => {
  let orderInformationBillTo = {} as Ptsv2paymentsOrderInformationBillTo;
  if (FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE === functionName && cartObj) {
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
 * @param {any} cartObj - The cart object.
 * @returns {Promise<any>} - The order information ship-to details.
 */
const getOrderInformationShipToDetails = (cartObj: any, shippingMethod: string | undefined): any => {
  let orderInformationShipTo = {} as Ptsv2paymentsOrderInformationShipTo;
  let shippingAddress;
  if (cartObj?.shippingMode && Constants.SHIPPING_MODE_MULTIPLE === cartObj?.shippingMode && 0 < cartObj?.shipping?.length) {
    shippingAddress = cartObj.shipping[0].shippingAddress;
  } else if (cartObj.shippingAddress) {
    shippingAddress = cartObj.shippingAddress;
  }
  const addressMapper = new AddressMapper(shippingAddress);
  orderInformationShipTo = addressMapper.mapOrderInformationShipto();
  if (shippingMethod) {
    orderInformationShipTo.method = shippingMethod;
  };
  return orderInformationShipTo;
};


/**
 * Generates device information for payment based on the provided parameters.
 * 
 * @param {PaymentType | null} paymentObj - The payment object.
 * @param {CustomerType | null} customerObj - The customer object.
 * @param {string} service - The name of the service.
 * @returns {Promise<any>} - The device information.
 */
const getDeviceInformation = async (paymentObj: PaymentType | null, customerObj: Partial<CustomerType> | null, service: string): Promise<any> => {
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
 * @param {PaymentType} resourceObj - The payment object.
 * @param {string} service - The name of the service.
 * @param {boolean} isSaveToken - Flag indicating whether to save the token.
 * @param {boolean} payerAuthMandateFlag - Flag indicating whether payer authentication is mandated.
 * @returns {Promise<any>} - The consumer authentication information.
 */
const getConsumerAuthenticationInformation = async (resourceObj: PaymentType, service: string, isSaveToken: boolean, payerAuthMandateFlag: boolean): Promise<any> => {
  const { isv_payerAuthenticationTransactionId, isv_payerAuthenticationPaReq, isv_cardinalReferenceId, isv_tokenAlias, isv_savedToken } = resourceObj?.custom?.fields || {};
  const consumerAuthenticationInformation = {} as Ptsv2paymentsConsumerAuthenticationInformation;
  if (Constants.VALIDATION === service) {
    consumerAuthenticationInformation.authenticationTransactionId = isv_payerAuthenticationTransactionId;
    consumerAuthenticationInformation.signedPares = isv_payerAuthenticationPaReq;
  } else if (Constants.STRING_ENROLL_CHECK === service) {
    consumerAuthenticationInformation.referenceId = isv_cardinalReferenceId;
    consumerAuthenticationInformation.returnUrl = process.env.PAYMENT_GATEWAY_3DS_RETURN_URL;
    if (payerAuthMandateFlag || (paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_SCA_CHALLENGE) && !isv_savedToken && isv_tokenAlias && !isSaveToken)) {
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
const getTargetOrigins = async (): Promise<string[]> => {
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
 * @returns {Promise<string[]>} - An array of allowed payment methods.
 */
const getAllowedPaymentMethods = async (): Promise<string[]> => {
  let allowedPaymentTypesArray = ['PANENTRY', 'SRC', 'GOOGLEPAY'];
  let { PAYMENT_GATEWAY_UC_ALLOWED_PAYMENTS } = process.env;
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
 * @returns {Promise< Promise<string[] | undefined>>} - An array of allowed card networks.
 */
const getAllowedCardNetworks = async (functionName: string): Promise<string[] | undefined> => {
  let allowedCardNetworksArray = (FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT === functionName) ? Constants.UC_ALLOWED_CARD_NETWORKS : Constants.FLEX_MICROFORM_ALLOWED_CARDS;
  let { PAYMENT_GATEWAY_CC_ALLOWED_CARD_NETWORKS } = process.env;
  if (PAYMENT_GATEWAY_CC_ALLOWED_CARD_NETWORKS) {
    const allowedCardNetworks = PAYMENT_GATEWAY_CC_ALLOWED_CARD_NETWORKS;
    allowedCardNetworksArray = allowedCardNetworks.split(Constants.REGEX_COMMA);
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
    }
    else if (payment?.custom?.fields?.isv_transientToken) {
      tokenInformation.transientTokenJwt = payment.custom.fields.isv_transientToken;
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
 * @returns {Promise<any>} - Bill-to information.
 */
const getUpdateTokenBillTo = async (addressData: AddressType | null): Promise<any> => {
  let billTo;
  if (addressData) {
    const addressMapperInstance = new AddressMapper(addressData);
    billTo = addressMapperInstance.mapUpdateTokenBillTo();
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
  let creationHistory = 'GUEST';
  let orderDetails;
  let riskInformation = {} as Riskv1authenticationsRiskInformation;
  let riskInformationBuyerHistory = {} as Ptsv2paymentsRiskInformationBuyerHistory;
  let riskInformationBuyerHistoryCustomerAccount = {} as Ptsv2paymentsRiskInformationBuyerHistoryCustomerAccount;
  const customerId = payment?.customer?.id || '';
  if (customerId) {
    const customer = await commercetoolsApi.getCustomer(customerId);
    if (customer) {
      orderDetails = await commercetoolsApi.queryOrderById(customerId, Constants.CUSTOMER_ID);
      if (orderDetails?.total) {
        creationHistory = 'EXISTING_ACCOUNT';
        riskInformationBuyerHistoryCustomerAccount.createDate = customer?.createdAt?.split('T')[0];
        riskInformationBuyerHistory.accountPurchases = orderDetails.total;
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
 * @returns {Promise<any>} - The buyer information object.
 */
const getBuyerInformation = async (paymentObj: PaymentType): Promise<any> => {
  let buyerInformation = {} as Tmsv2customersBuyerInformation;
  paymentValidator.setObjectValue(buyerInformation, 'merchantCustomerID', paymentObj, 'customer.id', Constants.STR_STRING, false);
  if (!buyerInformation.merchantCustomerID) {
    buyerInformation.merchantCustomerID = paymentObj?.anonymousId
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
  let promotionInformation = {} as Ptsv2paymentsPromotionInformation;
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
  getPromotionInformation,
  getOrderInformationAmountDetails,
  getOrderInformationBillToDetails,
  getOrderInformationShipToDetails,
};
