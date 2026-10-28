import fs from 'fs';
import path from 'path';

import { _BaseAddress, Cart, Customer, Payment } from '@commercetools/platform-sdk';
import axios from 'axios';
import {
  Ptsv2paymentsBuyerInformation,
  Ptsv2paymentsClientReferenceInformation,
  Ptsv2paymentsConsumerAuthenticationInformation,
  Ptsv2paymentsDeviceInformation,
  Ptsv2paymentsidcapturesOrderInformationAmountDetails,
  Ptsv2paymentsidClientReferenceInformationPartner,
  Ptsv2paymentsidreversalsClientReferenceInformation,
  Ptsv2paymentsidreversalsClientReferenceInformationPartner,
  Ptsv2paymentsidreversalsOrderInformationAmountDetails,
  Ptsv2paymentsMerchantInformation,
  Ptsv2paymentsOrderInformationAmountDetails,
  Ptsv2paymentsOrderInformationBillTo,
  Ptsv2paymentsOrderInformationShipTo,
  Ptsv2paymentsPromotionInformation,
  Ptsv2paymentsRiskInformationBuyerHistory,
  Ptsv2paymentsRiskInformationBuyerHistoryCustomerAccount,
  Ptsv2paymentsTokenInformation,
  Riskv1authenticationsRiskInformation,
  Riskv1decisionsClientReferenceInformation,
  Riskv1decisionsClientReferenceInformationPartner,
  Tmsv2customersEmbeddedDefaultPaymentInstrumentBillTo,
  Upv1capturecontextsCaptureMandate,
  Upv1capturecontextsOrderInformationAmountDetails,
} from 'cybersource-rest-client';

import { CustomMessages } from '../constants/customMessages';
import { FunctionConstant } from '../constants/functionConstant';
import { Constants } from '../constants/paymentConstants';
import { AddressType, CaptureContextAddressFields, CustomTokenType, MetaDataType, MidCredentialsType, PaymentTransactionType, ProcessingInformationType } from '../types/Types';
import paymentUtils from '../utils/PaymentUtils';
import paymentValidator from '../utils/PaymentValidator';
import commercetoolsApi from '../utils/api/CommercetoolsApi';
import multiMid from '../utils/config/MultiMid';
import { AddressMapper } from './AddressMapper';
import { OrderInformationMapper } from './OrderInformationMapper';
import { PaymentInformationModel } from './PaymentInformation';
import { ProcessingInformation } from './ProcessingInformationMapper';
import cache from 'memory-cache';

/**
 * Safely normalizes P12 filename by ensuring proper extension handling.
 * If filename already ends with ".p12", returns as-is.
 * If filename has no extension, appends ".p12".
 *
 * @param {string} fileName - The P12 filename to normalize
 * @returns {string} - Normalized filename with proper .p12 extension
 */
const normalizeP12FileName = (fileName: string): string => {
  if (!fileName) return '';
  const trimmed = fileName.trim();
  if (trimmed.endsWith('.p12')) {
    return trimmed;
  }
  return `${trimmed}.p12`;
};

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
    authenticationType: Constants.JWT_AUTHENTICATION,
    jwtKeyType: Constants.PAYMENT_GATEWAY_JWT_KEY_TYPE,
    runEnvironment: '',
    logConfiguration: {
      enableLog: false,
    },
  };
  let midCredentialsObject = {} as MidCredentialsType;
  let mid = '';
  configObject.runEnvironment = Constants.LIVE_ENVIRONMENT === process.env.PAYMENT_GATEWAY_RUN_ENVIRONMENT?.toUpperCase() ? Constants.PAYMENT_GATEWAY_PRODUCTION_ENVIRONMENT : Constants.PAYMENT_GATEWAY_TEST_ENVIRONMENT;
  if (resourceObj && Constants.GET_CONFIG_BY_PAYMENT_OBJECT_FUNCTIONS.includes(functionName)) {
    mid = resourceObj?.custom?.fields?.isv_merchantId ? resourceObj.custom.fields.isv_merchantId : '';
    midCredentialsObject = multiMid.getMidCredentials(mid);
  } else if (merchantId) {
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

    const isFollowOnServiceFunction = [FunctionConstant.FUNC_GET_CAPTURE_RESPONSE, FunctionConstant.FUNC_GET_REFUND_DATA, FunctionConstant.FUNC_GET_AUTH_REVERSAL_RESPONSE].includes(functionName);

    if (isFollowOnServiceFunction) {
      configObject.authenticationType = Constants.JWT_AUTHENTICATION;
      configObject.jwtKeyType = Constants.PAYMENT_GATEWAY_JWT_KEY_TYPE;
    }
    cache.del(Constants.CACHE_CERTIFICATE_FROM_P12_FILE);
    cache.del(Constants.CACHE_CERTIFICATE_LAST_MODIFIED_TIMESTAMP);
    const jwtConfiguration = multiMid.getKeyCredentials(midCredentialsObject.merchantId);

    if (!jwtConfiguration) {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CONFIG_OBJECT, Constants.LOG_WARN, '', CustomMessages.ERROR_MSG_JWT_ENV_VARIABLE_NOT_SET);
      return null;
    }

    const hasMerchantRequestMleConfig = Boolean(jwtConfiguration?.requestMlePublicCertFile || jwtConfiguration?.requestMlePublicCertUrl);
    const requestMlePublicCertFileBase = (hasMerchantRequestMleConfig ? jwtConfiguration?.requestMlePublicCertFile : process.env.PAYMENT_GATEWAY_REQUEST_MLE_PUBLIC_CERT_FILE) || '';
    const requestMlePublicCertFile = requestMlePublicCertFileBase ? (requestMlePublicCertFileBase.endsWith('.p12') ? requestMlePublicCertFileBase : `${requestMlePublicCertFileBase}.p12`) : '';
    const requestMlePublicCertUrl = (hasMerchantRequestMleConfig ? jwtConfiguration?.requestMlePublicCertUrl : process.env.PAYMENT_GATEWAY_REQUEST_MLE_PUBLIC_CERT_URL) || '';
    const requestMleP12Password = (hasMerchantRequestMleConfig ? jwtConfiguration?.requestMleP12Password : process.env.PAYMENT_GATEWAY_REQUEST_MLE_P12_PASSWORD) || '';
    const hasMerchantResponseMleConfig = Boolean(jwtConfiguration?.responseMlePrivateKeyFile || jwtConfiguration?.responseMlePrivateKeyUrl);
    const responseMleKID = (hasMerchantResponseMleConfig ? jwtConfiguration?.responseMleKID : process.env.PAYMENT_GATEWAY_RESPONSE_MLE_KID) || '';

    if (Constants.PAYMENT_GATEWAY_JWT_KEY_TYPE === 'SHARED_SECRET') {
      let resolvedRequestMlePublicCertPath: string | undefined;
      if (requestMlePublicCertFile && requestMleP12Password) {
        try {
          resolvedRequestMlePublicCertPath = await paymentUtils.loadP12CertificateForRequestMLE(requestMlePublicCertFile, requestMleP12Password, midCredentialsObject.merchantId || 'default', requestMlePublicCertUrl);
          if (resolvedRequestMlePublicCertPath) {
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CONFIG_OBJECT, Constants.LOG_DEBUG, '', `P12 certificate successfully converted to PEM: ${resolvedRequestMlePublicCertPath}`);
          }
        } catch (error: any) {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CONFIG_OBJECT, Constants.LOG_WARN, '', `Error loading P12 certificate: ${error?.message || String(error)}`);
        }
      }

      if (!resolvedRequestMlePublicCertPath) {
        const errorMessageDetail = `${CustomMessages.ERROR_MSG_REQUEST_MLE_CERTIFICATE_NOT_FOUND}. P12 File: ${requestMlePublicCertFile}, Expected path: ${requestMlePublicCertFile ? path.resolve(path.join(__dirname, Constants.CERTIFICATE_PATH, requestMlePublicCertFile)) : 'undefined'}, Cloud URL configured: ${!!requestMlePublicCertUrl}`;
        paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CONFIG_OBJECT, Constants.LOG_ERROR, '', errorMessageDetail);
        throw new Error(errorMessageDetail);
      }
      configObject.authenticationType = Constants.JWT_AUTHENTICATION;
      configObject.jwtKeyType = Constants.PAYMENT_GATEWAY_JWT_KEY_TYPE;
      configObject.enableRequestMLEForOptionalApisGlobally = true;
      configObject.mleForRequestPublicCertPath = resolvedRequestMlePublicCertPath;
      configObject.mapToControlMLEonAPI = {
        generateUnifiedCheckoutV1CaptureContext: true,
        generateUnifiedCheckoutCaptureContext: true,
        refundPayment: true,
      };

      delete configObject.useMLEGlobally;
      delete configObject.mleKeyAlias;
      delete configObject.keyPass;
      delete configObject.keyFileName;
      delete configObject.keyAlias;
      delete configObject.keysDirectory;

      const responseMlePrivateKeyFileBase = (hasMerchantResponseMleConfig ? jwtConfiguration?.responseMlePrivateKeyFile : process.env.PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_FILE) || '';
      const responseMlePrivateKeyUrl = (hasMerchantResponseMleConfig ? jwtConfiguration?.responseMlePrivateKeyUrl : process.env.PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_URL) || '';
      const responseMlePrivateKeyPassword = (hasMerchantResponseMleConfig ? jwtConfiguration?.responseMlePrivateKeyPassword : process.env.PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_PASSWORD) || '';

      const responseMleEnabled = paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_RESPONSE_MLE_ENABLED);
      if (responseMleEnabled) {
        if (!responseMlePrivateKeyFileBase) {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CONFIG_OBJECT, Constants.LOG_ERROR, '', CustomMessages.ERROR_MSG_RESPONSE_MLE_PRIVATE_KEY_FILE_NOT_CONFIGURED);
          throw new Error(CustomMessages.ERROR_MSG_RESPONSE_MLE_PRIVATE_KEY_FILE_NOT_CONFIGURED);
        }
        if (!responseMlePrivateKeyPassword) {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CONFIG_OBJECT, Constants.LOG_ERROR, '', CustomMessages.ERROR_MSG_RESPONSE_MLE_PRIVATE_KEY_PASSWORD_NOT_CONFIGURED);
          throw new Error(CustomMessages.ERROR_MSG_RESPONSE_MLE_PRIVATE_KEY_PASSWORD_NOT_CONFIGURED);
        }

        const responseMlePrivateKeyFile = normalizeP12FileName(responseMlePrivateKeyFileBase);
        const certificateDirectory = path.join(__dirname, Constants.CERTIFICATE_PATH);
        const responseMlePrivateKeyFilePath = path.resolve(path.join(certificateDirectory, responseMlePrivateKeyFile));
        let finalResponseMlePrivateKeyFilePath: string = responseMlePrivateKeyFilePath;
        if (fs.existsSync(responseMlePrivateKeyFilePath)) {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CONFIG_OBJECT, Constants.LOG_INFO, '', `Response MLE: Using local P12 certificate: ${responseMlePrivateKeyFilePath}`);
        } else if (responseMlePrivateKeyUrl) {

          try {
            const downloadResponse = await axios({
              method: 'GET',
              url: responseMlePrivateKeyUrl,
              responseType: 'arraybuffer',
            });

            if (Constants.HTTP_OK_STATUS_CODE !== downloadResponse.status || !downloadResponse.data) {
              const errorMessageDetail = `${CustomMessages.ERROR_MSG_RESPONSE_MLE_DOWNLOAD_FAILED}. HTTP Status: ${downloadResponse.status}`;
              paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CONFIG_OBJECT, Constants.LOG_ERROR, '', errorMessageDetail);
              throw new Error(errorMessageDetail);
            }

            const tmpP12Path = path.resolve(paymentUtils.getTempDirectory(), paymentUtils.getResponseMleTempP12Name(midCredentialsObject.merchantId || 'default'));
            fs.writeFileSync(tmpP12Path, downloadResponse.data);
            if (!fs.existsSync(tmpP12Path) || fs.statSync(tmpP12Path).size === 0) {
              const errorMessageDetail = `${CustomMessages.ERROR_MSG_RESPONSE_MLE_FILE_VALIDATION_FAILED} at ${tmpP12Path}`;
              paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CONFIG_OBJECT, Constants.LOG_ERROR, '', errorMessageDetail);
              throw new Error(errorMessageDetail);
            }

            finalResponseMlePrivateKeyFilePath = tmpP12Path;
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CONFIG_OBJECT, Constants.LOG_INFO, '', `Response MLE: Downloaded P12 to ${tmpP12Path}`);
          } catch (downloadError: any) {
            const errorMessageDetail = `${CustomMessages.ERROR_MSG_RESPONSE_MLE_DOWNLOAD_ERROR}: ${downloadError?.message || String(downloadError)}`;
            paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CONFIG_OBJECT, Constants.LOG_ERROR, '', errorMessageDetail);
            throw new Error(errorMessageDetail);
          }
        } else {
          const errorMessageDetail = `${CustomMessages.ERROR_MSG_RESPONSE_MLE_PRIVATE_KEY_FILE_NOT_FOUND}. Expected path: ${responseMlePrivateKeyFilePath}. Configured filename: ${responseMlePrivateKeyFileBase}. Cloud URL not configured.`;
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_CONFIG_OBJECT, Constants.LOG_ERROR, '', errorMessageDetail);
          throw new Error(errorMessageDetail);
        }
        configObject.enableResponseMleGlobally = true;
        configObject.responseMlePrivateKeyFilePath = finalResponseMlePrivateKeyFilePath;
        configObject.responseMlePrivateKeyFilePassword = responseMlePrivateKeyPassword;
        if (responseMleKID) {
          configObject.responseMleKID = responseMleKID;
        }

      } else {
        delete configObject.enableResponseMleGlobally;
        delete configObject.responseMlePrivateKeyFilePath;
        delete configObject.responseMlePrivateKeyFilePassword;
        delete configObject.responseMleKID;
      }
    } else {
      if (jwtConfiguration.keyPass && (jwtConfiguration.keyFileName || jwtConfiguration.keyFileUrl)) {
        configObject.useMLEGlobally = true;
        configObject.authenticationType = Constants.JWT_AUTHENTICATION;
        configObject.mleKeyAlias = jwtConfiguration.keyAlias || '';
        configObject.keyPass = jwtConfiguration.keyPass;
        const keysDirectory = path.join(__dirname, Constants.CERTIFICATE_PATH);
        let filePath = path.resolve(path.join(keysDirectory, process.env.PAYMENT_GATEWAY_KEY_FILE_NAME + '.p12'));
        if (
          !jwtConfiguration.keyFileName &&
          !fs.existsSync(filePath) &&
          (Constants.STRING_AWS === process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT || Constants.STRING_AZURE === process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT || Constants.STRING_GCP === process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT) &&
          jwtConfiguration.keyFileUrl
        ) {
          configObject.keyFileName = Constants.STRING_TEST;
          configObject.keysDirectory = path.resolve(__dirname, Constants.CERTIFICATE_PATH);
          await paymentUtils.setCertificatecache(jwtConfiguration.keyFileUrl, jwtConfiguration.keyPass, midCredentialsObject.merchantId, jwtConfiguration.keyAlias || '');
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

const isJWECompact = (str: string): boolean => {
  return typeof str === Constants.STR_STRING && str.trim().split('.').length === 5 && str.trim().startsWith('eyJ');
};

// CyberSource rejects blank address attributes, so drop any field that resolved to an empty string.
const omitEmptyCaptureContextFields = (resolvedFields: Record<string, string>): Record<string, string> => {
  const compactedFields: Record<string, string> = {};
  Object.keys(resolvedFields).forEach((fieldName) => {
    if ('' !== resolvedFields[fieldName]) {
      compactedFields[fieldName] = resolvedFields[fieldName];
    }
  });
  return compactedFields;
};

const buildCaptureContextBillTo = (billTo?: CaptureContextAddressFields, fallbackBillTo?: CaptureContextAddressFields): Record<string, string> => {
  const resolvedBillTo: Record<string, string> = {
    firstName: paymentUtils.resolveCaptureContextValue(billTo?.firstName, fallbackBillTo?.firstName),
    lastName: paymentUtils.resolveCaptureContextValue(billTo?.lastName, fallbackBillTo?.lastName),
    address1: paymentUtils.resolveCaptureContextValue(billTo?.address1, fallbackBillTo?.address1),
    address2: paymentUtils.resolveCaptureContextValue(billTo?.address2, fallbackBillTo?.address2),
    locality: paymentUtils.resolveCaptureContextValue(billTo?.locality, fallbackBillTo?.locality),
    postalCode: paymentUtils.resolveCaptureContextValue(billTo?.postalCode, fallbackBillTo?.postalCode),
    administrativeArea: paymentUtils.resolveCaptureContextValue(billTo?.administrativeArea, fallbackBillTo?.administrativeArea),
    country: paymentUtils.resolveCaptureContextValue(billTo?.country, fallbackBillTo?.country),
    email: paymentUtils.resolveCaptureContextValue(billTo?.email, fallbackBillTo?.email),
    phoneNumber: paymentUtils.resolveCaptureContextValue(billTo?.phoneNumber, fallbackBillTo?.phoneNumber),
  };
  return omitEmptyCaptureContextFields(resolvedBillTo);
};

const buildCaptureContextShipTo = (shipTo?: CaptureContextAddressFields, fallbackShipTo?: CaptureContextAddressFields): Record<string, string> => {
  const resolvedShipTo: Record<string, string> = {
    firstName: paymentUtils.resolveCaptureContextValue(shipTo?.firstName, fallbackShipTo?.firstName),
    lastName: paymentUtils.resolveCaptureContextValue(shipTo?.lastName, fallbackShipTo?.lastName),
    address1: paymentUtils.resolveCaptureContextValue(shipTo?.address1, fallbackShipTo?.address1),
    address2: paymentUtils.resolveCaptureContextValue(shipTo?.address2, fallbackShipTo?.address2),
    locality: paymentUtils.resolveCaptureContextValue(shipTo?.locality, fallbackShipTo?.locality),
    postalCode: paymentUtils.resolveCaptureContextValue(shipTo?.postalCode, fallbackShipTo?.postalCode),
    administrativeArea: paymentUtils.resolveCaptureContextValue(shipTo?.administrativeArea, fallbackShipTo?.administrativeArea),
    country: paymentUtils.resolveCaptureContextValue(shipTo?.country, fallbackShipTo?.country),
  };
  return omitEmptyCaptureContextFields(resolvedShipTo);
};
const getCartCaptureContextBillTo = (cartObj: Cart | null): CaptureContextAddressFields | undefined => {
  const billingAddr = cartObj?.billingAddress as any;
  if (!billingAddr) {
    return undefined;
  }
  return {
    firstName: billingAddr.firstName || '',
    lastName: billingAddr.lastName || '',
    address1: billingAddr.streetName || billingAddr.address1 || '',
    locality: billingAddr.city || billingAddr.locality || '',
    postalCode: billingAddr.postalCode || '',
    administrativeArea: billingAddr.state || billingAddr.region || billingAddr.administrativeArea || '',
    country: billingAddr.country || '',
    email: billingAddr.email || cartObj?.customerEmail || '',
    phoneNumber: billingAddr.phone || billingAddr.mobile || billingAddr.phoneNumber || '',
  };
};
const getCartCaptureContextShipTo = (cartObj: Cart | null): CaptureContextAddressFields | undefined => {
  const shippingAddr = cartObj?.shippingMode && Constants.SHIPPING_MODE_MULTIPLE === cartObj?.shippingMode && 0 < (cartObj?.shipping?.length || 0) ? (cartObj.shipping?.[0]?.shippingAddress as any) : (cartObj?.shippingAddress as any);

  if (!shippingAddr) {
    return undefined;
  }

  return {
    firstName: shippingAddr.firstName || '',
    lastName: shippingAddr.lastName || '',
    address1: shippingAddr.streetName || shippingAddr.address1 || '',
    address2: shippingAddr.additionalStreetInfo || shippingAddr.streetNumber || shippingAddr.buildingNumber || '',
    locality: shippingAddr.city || shippingAddr.locality || '',
    postalCode: shippingAddr.postalCode || '',
    administrativeArea: shippingAddr.state || shippingAddr.region || shippingAddr.administrativeArea || '',
    country: shippingAddr.country || '',
  };
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
const getProcessingInformation = (functionName: string, resourceObj: Payment | null, orderNo: string, service: string, cardTokens: CustomTokenType | null, isSaveToken: boolean | null, intentsId?: string) => {
  const processingInformation = new ProcessingInformation(functionName, resourceObj, orderNo, service, cardTokens, isSaveToken, intentsId);
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
  clientReferenceInformation.applicationVersion = Constants.PAYMENT_GATEWAY_APPLICATION_VERSION;
  clientReferenceInformation.applicationName = Constants.PAYMENT_GATEWAY_APPLICATION_NAME;
  if (customFields?.isv_dmpaFlag && customFields?.isv_payerEnrollTransactionId) {
    clientReferenceInformation.pausedRequestId = customFields.isv_payerEnrollTransactionId;
  }
  clientReferenceInformationPartner.solutionId = Constants.PAYMENT_GATEWAY_PARTNER_SOLUTION_ID;
  clientReferenceInformation.partner = clientReferenceInformationPartner;
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
};
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
    orderInformationAmountDetails.totalAmount = Number(captureAmount || 0).toFixed(2);
    orderInformationAmountDetails.currency = paymentObj?.amountPlanned?.currencyCode;
  } else if (cartObj?.totalPrice && (FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE === functionName || FunctionConstant.FUNC_CREATE_ORDER_RESPONSE === functionName || FunctionConstant.FUNC_GET_SESSION_RESPONSE === functionName)) {
    orderInformationAmountDetails = {} as Ptsv2paymentsOrderInformationAmountDetails;
    orderInformationAmountDetails.totalAmount = Number(paymentUtils.convertCentToAmount(getCartTotalPrice(cartObj), cartObj.totalPrice.fractionDigits)).toFixed(2);
    orderInformationAmountDetails.currency = cartObj?.totalPrice?.currencyCode;
  } else if (FunctionConstant.FUNC_GENERATE_CAPTURE_CONTEXT === functionName) {
    orderInformationAmountDetails = {} as Upv1capturecontextsOrderInformationAmountDetails;
    if ('Payments' === service && cartObj?.totalPrice) {
      orderInformationAmountDetails.totalAmount = `${Number(paymentUtils.convertCentToAmount(getCartTotalPrice(cartObj), cartObj.totalPrice.fractionDigits)).toFixed(2)}`;
      orderInformationAmountDetails.currency = cartObj?.totalPrice?.currencyCode;
      if (cartObj?.taxedPrice?.totalTax) {
        (orderInformationAmountDetails as any).taxAmount = paymentUtils.convertCentToAmount(cartObj.taxedPrice.totalTax.centAmount, cartObj.taxedPrice.totalTax.fractionDigits).toFixed(2);
      }
    } else if ('MyAccounts' === service) {
      orderInformationAmountDetails.currency = currencyCode;
      orderInformationAmountDetails.totalAmount = '0.00';
      orderInformationAmountDetails.taxAmount = '0.00';
    }
  } else if (FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE === functionName) {
    orderInformationAmountDetails = {} as Ptsv2paymentsOrderInformationAmountDetails;
    orderInformationAmountDetails.totalAmount = '0.00';
    orderInformationAmountDetails.currency = currencyCode;
    orderInformationAmountDetails.taxAmount = '0.00';
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
  if (FunctionConstant.FUNC_GET_AUTHORIZATION_RESPONSE === functionName) {
    if (!cartObj?.billingAddress) {
      throw new Error('Billing address is required for payment.');
    }
    const addressMapper = new AddressMapper(cartObj.billingAddress);
    orderInformationBillTo = addressMapper.mapOrderInformationBillTo();
  } else if (FunctionConstant.FUNC_GET_ADD_TOKEN_RESPONSE === functionName) {
    if (!address) {
      throw new Error('Billing address is required for saving card.');
    }
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
        region: address.region,
      };
    }
    const addressMapper = new AddressMapper(mappedAddress);
    if (addressMapper) {
      orderInformationBillTo = addressMapper.mapOrderInformationBillTo();
    }
    // When using UC address, remove empty string fields so CyberSource uses billing data from the transient token
    if (Constants.UC_ADDRESS === customerObj?.custom?.fields?.isv_addressId) {
      Object.keys(orderInformationBillTo).forEach((key) => {
        if (orderInformationBillTo[key as keyof Ptsv2paymentsOrderInformationBillTo] === '') {
          delete orderInformationBillTo[key as keyof Ptsv2paymentsOrderInformationBillTo];
        }
      });
    }
  }
  return orderInformationBillTo;
};

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
const getDeviceInformation = (paymentObj: Payment | null, _customerObj: Customer | null, service: string): Ptsv2paymentsDeviceInformation => {
  const deviceInformation = {} as Ptsv2paymentsDeviceInformation;
  const customFields = paymentObj?.custom?.fields;
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
  const { isv_payerAuthenticationTransactionId, isv_payerAuthenticationPaReq, isv_cardinalReferenceId, isv_savedToken } = resourceObj?.custom?.fields || {};
  const consumerAuthenticationInformation = {} as Ptsv2paymentsConsumerAuthenticationInformation;
  if (Constants.VALIDATION === service) {
    consumerAuthenticationInformation.authenticationTransactionId = isv_payerAuthenticationTransactionId;
    consumerAuthenticationInformation.signedPares = isv_payerAuthenticationPaReq;
  } else if (Constants.STRING_ENROLL_CHECK === service) {
    consumerAuthenticationInformation.referenceId = isv_cardinalReferenceId;
    consumerAuthenticationInformation.returnUrl = process.env.PAYMENT_GATEWAY_3DS_RETURN_URL + '/payerAuthReturnUrl';
    if (payerAuthMandateFlag || (paymentUtils.toBoolean(process.env.PAYMENT_GATEWAY_SCA_CHALLENGE) && !isv_savedToken && isSaveToken)) {
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
const getTargetOrigins = (...customFieldSources: Array<Record<string, unknown> | null | undefined>): string[] => {
  for (const customFields of customFieldSources) {
    const customTargetOrigins = customFields?.[Constants.ISV_UC_TARGET_ORIGINS] || customFields?.targetOrigins;

    if (hasMeaningfulValue(customTargetOrigins)) {
      const normalizedOrigins = Array.isArray(customTargetOrigins)
        ? customTargetOrigins.map((origin) => String(origin).trim()).filter((origin) => '' !== origin)
        : String(customTargetOrigins)
          .split(Constants.REGEX_COMMA)
          .map((origin) => origin.trim())
          .filter((origin) => '' !== origin);

      if (!normalizedOrigins.length) {
        throw new Error('Unified Checkout target origins must include at least one value in frontend custom fields.');
      }

      return normalizedOrigins;
    }
  }

  let targetOriginArray: string[] = [];
  let { PAYMENT_GATEWAY_TARGET_ORIGINS } = process.env;
  if (PAYMENT_GATEWAY_TARGET_ORIGINS) {
    const targetOrigins = PAYMENT_GATEWAY_TARGET_ORIGINS;
    targetOriginArray = targetOrigins.split(Constants.REGEX_COMMA);
  }
  return targetOriginArray;
};

/**
 * Generates allowed payment methods from frontend custom fields.
 *
 * @returns {string[]} - An array of allowed payment methods.
 */
const hasMeaningfulValue = (value: unknown): boolean => {
  if (Array.isArray(value)) {
    return 0 < value.length;
  }
  if ('string' === typeof value) {
    return '' !== value.trim();
  }
  return undefined !== value && null !== value;
};

const normalizeAllowedPaymentTypes = (allowedPaymentTypes: string | string[], isV1Session: boolean): string[] => {
  const paymentTypes = Array.isArray(allowedPaymentTypes) ? allowedPaymentTypes : allowedPaymentTypes.split(Constants.REGEX_COMMA);
  return paymentTypes
    .map((type: string) => {
      const trimmed = type.trim().toUpperCase();
      if (!trimmed) {
        return '';
      }
      if (isV1Session) {
        if ('SRC' === trimmed) {
          return 'CLICKTOPAY';
        }
        if ('CHECK' === trimmed) {
          return 'CHECK';
        }
      }
      return trimmed;
    })
    .filter((type: string) => '' !== type);
};

const getUnifiedCheckoutBillingType = (...customFieldSources: Array<Record<string, unknown> | null | undefined>): string => {
  for (const customFields of customFieldSources) {
    const billingType = customFields?.[Constants.ISV_UC_BILLING_TYPE];
    if (hasMeaningfulValue(billingType)) {
      if ('string' !== typeof billingType) {
        throw new Error('Unified Checkout billing type must be provided as a string in frontend custom fields.');
      }
      return billingType.trim().toUpperCase();
    }
  }
  throw new Error('Unified Checkout billing type must be provided in frontend custom fields.');
};

/**
 * Determines whether to show accepted network icons based on custom fields or environment variable.
 * @param {...Array<Record<string, unknown> | null | undefined>} customFieldSources - Custom field sources from frontend.
 * @returns {boolean} - Whether to show accepted network icons.
 */
const getShowAcceptedNetworkIcons = (...customFieldSources: Array<Record<string, unknown> | null | undefined>): boolean => {
  for (const customFields of customFieldSources) {
    const showNetworkIcons = customFields?.[Constants.ISV_UC_SHOW_ACCEPTED_NETWORK_ICONS];
    if (hasMeaningfulValue(showNetworkIcons)) {
      return paymentUtils.toBoolean(String(showNetworkIcons));
    }
  }
  // Fall back to environment variable if custom field not provided
  const { PAYMENT_GATEWAY_UC_ENABLE_NETWORK_ICONS } = process.env;
  return paymentUtils.toBoolean(PAYMENT_GATEWAY_UC_ENABLE_NETWORK_ICONS);
};

const getEnableMoto = (...customFieldSources: Array<Record<string, unknown> | null | undefined>): boolean => {
  for (const customFields of customFieldSources) {
    const enableMoto = customFields?.[Constants.ISV_ENABLED_MOTO];
    if (hasMeaningfulValue(enableMoto)) {
      return paymentUtils.toBoolean(String(enableMoto).trim());
    }
  }
  return false;
}; 

const getAllowedPaymentMethods = (functionName?: string, ...customFieldSources: Array<Record<string, unknown> | null | undefined>): string[] => {
  const isV1Session = functionName === FunctionConstant.FUNC_CREATE_CHECKOUT_SESSION;
  let customAllowedPaymentTypes: string | string[] | undefined;
  for (const customFields of customFieldSources) {
    const allowedPaymentTypes = customFields?.[Constants.ISV_UC_ALLOWED_PAYMENT_TYPES];
    if (hasMeaningfulValue(allowedPaymentTypes)) {
      if ('string' === typeof allowedPaymentTypes || Array.isArray(allowedPaymentTypes)) {
        customAllowedPaymentTypes = allowedPaymentTypes;
        break;
      }
      throw new Error('Unified Checkout allowed payment types must be provided as a string or string array in frontend custom fields.');
    }
  }
  if (!customAllowedPaymentTypes) {
    throw new Error('Unified Checkout allowed payment types must be provided in frontend custom fields.');
  }
  const allowedPaymentTypesArray = normalizeAllowedPaymentTypes(customAllowedPaymentTypes, isV1Session);
  if (!allowedPaymentTypesArray.length) {
    throw new Error('Unified Checkout allowed payment types must include at least one value in frontend custom fields.');
  }
  return allowedPaymentTypesArray;
};

/**
 * Generates token information based on the payment and function name.
 *
 * @param {Payment} payment - The payment object.
 * @param {string} functionName - The name of the function.
 * @returns {any} - Token information.
 */
const getTokenInformation = (payment: Payment, _functionName: string): any => {
  const tokenInformation = {} as Ptsv2paymentsTokenInformation;
  if (!payment?.custom?.fields.isv_savedToken && !payment?.custom?.fields?.isv_transientToken) {
    tokenInformation.transientTokenJwt = payment?.custom?.fields.isv_token;
  } else if (payment?.custom?.fields?.isv_transientToken) {
    tokenInformation.transientTokenJwt = payment.custom.fields.isv_transientToken;
  }

  return tokenInformation;
};

/**
 * Generates capture mandate based on the service and frontend custom fields.
 *
 * @param {string} service - The service type.
 * @returns {Upv1capturecontextsCaptureMandate} - Capture mandate information.
 */
const getCaptureMandate = (service: string, ...customFieldSources: Array<Record<string, unknown> | null | undefined>): Upv1capturecontextsCaptureMandate => {
  const captureMandate = {} as Upv1capturecontextsCaptureMandate;
  const { PAYMENT_GATEWAY_UC_ALLOWED_SHIP_TO_COUNTRIES } = process.env;
  captureMandate.showAcceptedNetworkIcons = getShowAcceptedNetworkIcons(...customFieldSources);
  const billingType = getUnifiedCheckoutBillingType(...customFieldSources);
  if ('Payments' === service) {
    captureMandate.billingType = billingType;
    captureMandate.requestShipping = false;
    captureMandate.requestEmail = false;
    captureMandate.requestPhone = false;
    if (PAYMENT_GATEWAY_UC_ALLOWED_SHIP_TO_COUNTRIES) {
      const shipToCountries = PAYMENT_GATEWAY_UC_ALLOWED_SHIP_TO_COUNTRIES;
      if (shipToCountries) {
        const shipToCountriesArray = shipToCountries.split(Constants.REGEX_COMMA);
        captureMandate.shipToCountries = shipToCountriesArray;
      }
    }
  } else if ('MyAccounts' === service) {
    captureMandate.billingType = billingType;
    captureMandate.requestShipping = false;
    captureMandate.requestEmail = Constants.STRING_FULL === billingType;
  }

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
};

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
    buyerInformation.merchantCustomerID = paymentObj?.anonymousId;
  }
  return buyerInformation;
};

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
};

const getMetaData = (payment: Payment): MetaDataType[] => {
  let metaData: MetaDataType[] = [];
  let customMetaData = payment?.custom?.fields?.isv_metadata && JSON.parse(payment.custom.fields.isv_metadata);
  if (customMetaData) {
    metaData = Object.entries(customMetaData).map(([key, value]) => ({
      key: key,
      value: value,
    })) as MetaDataType[];
  }
  return metaData;
};

const getMerchantInformation = (functionName: string): Ptsv2paymentsMerchantInformation => {
  let merchantInformation = {} as Ptsv2paymentsMerchantInformation;
  if (FunctionConstant.FUNC_GET_SESSION_RESPONSE === functionName && process.env.PAYMENT_GATEWAY_PAYPAL_RETURN_URL && process.env.PAYMENT_GATEWAY_PAYPAL_CANCEL_URL) {
    merchantInformation.successUrl = process.env.PAYMENT_GATEWAY_PAYPAL_RETURN_URL;
    merchantInformation.cancelUrl = process.env.PAYMENT_GATEWAY_PAYPAL_CANCEL_URL;
    merchantInformation.failureUrl = process.env.PAYMENT_GATEWAY_PAYPAL_FAILURE_URL;
  }
  return merchantInformation;
};

/**
 * Validates that locale is in ISO-639_ISO-3166 format (e.g. en_US, en_GB).
 *
 * @param {string} locale - The locale string to validate.
 * @returns {boolean} - Whether the locale format is valid.
 */
const validateLocaleFormat = (locale: string): boolean => {
  return /^[a-z]{2}_[A-Z]{2}$/.test(locale);
};

/**
 * Validates that the Unified Checkout client version is blank or in a strict 1.x format.
 *
 * @param {string} clientVersion - The client version string to validate.
 * @returns {boolean} - Whether the client version format is valid.
 */
const validateUnifiedCheckoutClientVersion = (clientVersion: string): boolean => {
  const normalizedClientVersion = clientVersion?.trim();
  if (!normalizedClientVersion) {
    return true;
  }
  return /^1\.\d+$/.test(normalizedClientVersion);
};

/**
 * Generates payment configurations for per-payment-type overrides (UC v1).
 * Configuration is separated from payment type selection in v1.
 *
 * @returns {Record<string, any>} - Payment configurations object.
 */
const getPaymentConfigurations = (): Record<string, any> => {
  const paymentConfigurations: Record<string, any> = {};
  const { PAYMENT_GATEWAY_UC_PANENTRY_CUSTOM_FLOW } = process.env;

  if (PAYMENT_GATEWAY_UC_PANENTRY_CUSTOM_FLOW) {
    paymentConfigurations.PANENTRY = {
      customFlow: PAYMENT_GATEWAY_UC_PANENTRY_CUSTOM_FLOW,
    };
  }
  return Object.keys(paymentConfigurations).length > 0 ? paymentConfigurations : {};
};

/**
 * Generates complete mandate for UC v1 sessions.
 * Controls AUTH/CAPTURE behaviour, fraud (Decision Manager), 3DS, and token creation.
 *
 * @param {string} service - The service type.
 * @param {{ completeType?: string; enable3DS?: boolean }} [overrides] - Optional frontend overrides.
 * @returns {Record<string, any>} - Complete mandate object.
 */
const getCompleteMandate = (service: string, overrides?: { completeType?: string; enable3DS?: boolean; challengeCode04?: boolean }): Record<string, any> => {
  const completeMandate: Record<string, any> = {};
  const { PAYMENT_GATEWAY_UC_3DS_ENABLED } = process.env;
  if ('Payments' === service) {
    const effective3DS = overrides?.enable3DS !== undefined ? overrides.enable3DS : paymentUtils.toBoolean(PAYMENT_GATEWAY_UC_3DS_ENABLED);
    if (effective3DS) {
      completeMandate.consumerAuthentication = '3DS';
    }
    completeMandate.tms = {
      tokenTypes: ['customer', 'paymentInstrument', 'instrumentIdentifier'],
    };
  } else if ('MyAccounts' === service) {
    completeMandate.type = 'PREFER_AUTH';
    completeMandate.decisionManager = false;
    completeMandate.consumerAuthentication = 'NONE';
    completeMandate.tms = {
      tokenCreate: true,
      tokenTypes: ['customer', 'paymentInstrument', 'instrumentIdentifier'],
    };
  }
  return completeMandate;
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
  getCaptureMandate,
  getAllowedPaymentMethods,
  getUnifiedCheckoutBillingType,
  getShowAcceptedNetworkIcons,
  getEnableMoto,
  getConfigObject,
  getBuyerInformation,
  getRiskInformation,
  getPromotionInformation,
  getOrderInformationAmountDetails,
  getOrderInformationBillToDetails,
  getOrderInformationShipToDetails,
  getMetaData,
  getMerchantInformation,
  validateLocaleFormat,
  validateUnifiedCheckoutClientVersion,
  getPaymentConfigurations,
  getCompleteMandate,
  buildCaptureContextBillTo,
  buildCaptureContextShipTo,
  getCartCaptureContextBillTo,
  getCartCaptureContextShipTo,
  isJWECompact,
};
