import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from '../../constants/paymentConstants';
import { KeyCredentialsType, MidCredentialsType } from '../../types/Types';
import paymentUtils from '../PaymentUtils';


/**
 * Retrieves merchant credentials for a given merchant ID.
 * If no merchant ID is provided or it matches the default, it retrieves credentials from environment variables.
 * @param {string} merchantId - The ID of the merchant.
 * @returns {MidCredentialsType} The merchant credentials.
 */
const getMidCredentials = (merchantId: string) => {
  let midData = {} as any;
  const defaultMerchantId = process.env.PAYMENT_GATEWAY_MERCHANT_ID;
  if (!merchantId || merchantId === defaultMerchantId || merchantId === '') {
    midData = {
      merchantId: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
      merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
      merchantSecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
    };
  } else {
    const allMidCredentials = getAllMidDetails();
    const targetMerchantId = merchantId.toLowerCase();
    const foundCredential = allMidCredentials.find((key) =>
      targetMerchantId === key?.merchantId?.toLowerCase()
    );
    if (foundCredential) {
      midData = foundCredential;
    }
    if (!midData?.merchantId) {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_MID_CREDENTIALS, Constants.LOG_WARN, '', CustomMessages.ERROR_MSG_ENV_VARIABLES_NOT_FOUND + targetMerchantId);
    }
  }
  return midData;
};


/**
 * Retrieves details of all merchant IDs and their corresponding credentials.
 * @returns {MidCredentialsType[]} A promise that resolves with an array of merchant credentials.
 */
const getAllMidDetails = (): MidCredentialsType[] => {
  let merchantIdPrefix: string;
  let keyId: string;
  let secretKey: string;
  const environment = process?.env;
  let secretKeyIndex: number;
  const midArray: MidCredentialsType[] = [];
  if (environment) {
    for (let variable in environment) {
      if (variable.includes('_SECRET_KEY') && 'PAYMENT_GATEWAY_MERCHANT_SECRET_KEY' !== variable) {
        secretKeyIndex = variable.indexOf('_SECRET_KEY');
        merchantIdPrefix = variable.slice(0, secretKeyIndex);
        keyId = process.env[merchantIdPrefix + '_KEY_ID'] || '';
        secretKey = process.env[variable] || '';
        if (merchantIdPrefix && keyId && secretKey) {
          midArray.push({
            merchantId: merchantIdPrefix.toLowerCase(),
            merchantKeyId: keyId,
            merchantSecretKey: secretKey,
          });
        } else {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_ALL_MID_DETAILS, Constants.LOG_WARN, '', CustomMessages.ERROR_MSG_ENV_VARIABLES_NOT_FOUND + merchantIdPrefix.toLowerCase());
        }
      }
    }
  }
  return midArray;
};

/**
 * Resolves the environment variable prefix configured for a given merchant ID.
 * A merchant may be configured with JWT key variables (_KEY_FILE_NAME/_KEY_FILE_URL)
 * and/or MLE variables (_REQUEST_MLE_* / _RESPONSE_MLE_*), so all of them are considered.
 *
 * @param merchantId - The merchant ID to resolve the prefix for.
 * @returns The matching environment variable prefix, or an empty string when not configured.
 */
const getMerchantEnvPrefix = (merchantId: string): string => {
  const environment = process?.env;
  if (!merchantId || !environment) {
    return '';
  }
  const suffixes = [
    Constants.STRING_FILE_NAME,
    Constants.STRING_FILE_URL,
    Constants.STRING_REQUEST_MLE_PUBLIC_CERT_FILE,
    Constants.STRING_REQUEST_MLE_PUBLIC_CERT_URL,
    Constants.ENV_SUFFIX_REQUEST_MLE_P12_SECRET, //checkmarx fix
    Constants.STRING_RESPONSE_MLE_PRIVATE_KEY_FILE,
    Constants.STRING_RESPONSE_MLE_PRIVATE_KEY_URL,
    Constants.STRING_RESPONSE_MLE_PRIVATE_KEY_PASSWORD,
  ];
  const targetMerchantId = merchantId.toLowerCase();
  for (const variable in environment) {
    for (const suffix of suffixes) {
      const suffixIndex = variable.indexOf(suffix);
      if (0 < suffixIndex) {
        const prefix = variable.slice(0, suffixIndex);
        if (prefix.toLowerCase() === targetMerchantId) {
          return prefix;
        }
      }
    }
  }
  return '';
};

const DEFAULT_KEY_CREDENTIALS: Partial<KeyCredentialsType> = {
  keyFileName: '',
  keyAlias: '',
  keyFileUrl: '',
  requestMlePublicCertUrl: '',
  requestMlePublicCertFile: '',
  requestMleP12Password: undefined,
  responseMlePrivateKeyFile: '',
  responseMlePrivateKeyUrl: '',
  responseMlePrivateKeyPassword: undefined,
  responseMleKID: '',
};

/**
 * Builds key credentials from the unprefixed (default) PAYMENT_GATEWAY_* environment variables,
 * used when no merchant-specific prefix is configured.
 */
const buildDefaultKeyCredentials = (merchantId: string): Partial<KeyCredentialsType> | null => {
  const { PAYMENT_GATEWAY_MERCHANT_ID, PAYMENT_GATEWAY_KEY_FILE_NAME, PAYMENT_GATEWAY_KEY_ALIAS, PAYMENT_GATEWAY_KEY_FILE_URL, PAYMENT_GATEWAY_KEY_PASS, PAYMENT_GATEWAY_REQUEST_MLE_PUBLIC_CERT_URL, PAYMENT_GATEWAY_REQUEST_MLE_PUBLIC_CERT_FILE, PAYMENT_GATEWAY_REQUEST_MLE_P12_PASSWORD, PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_FILE, PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_URL, PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_PASSWORD, PAYMENT_GATEWAY_RESPONSE_MLE_KID } = process.env || '';
  if (PAYMENT_GATEWAY_MERCHANT_ID === merchantId && (PAYMENT_GATEWAY_KEY_FILE_NAME || PAYMENT_GATEWAY_KEY_FILE_URL) && PAYMENT_GATEWAY_KEY_PASS) {
    return {
      keyFileName: PAYMENT_GATEWAY_KEY_FILE_NAME,
      keyAlias: PAYMENT_GATEWAY_KEY_ALIAS,
      keyFileUrl: PAYMENT_GATEWAY_KEY_FILE_URL,
      requestMlePublicCertUrl: PAYMENT_GATEWAY_REQUEST_MLE_PUBLIC_CERT_URL,
      requestMlePublicCertFile: PAYMENT_GATEWAY_REQUEST_MLE_PUBLIC_CERT_FILE,
      requestMleP12Password: PAYMENT_GATEWAY_REQUEST_MLE_P12_PASSWORD,
      responseMlePrivateKeyFile: PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_FILE,
      responseMlePrivateKeyUrl: PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_URL,
      responseMlePrivateKeyPassword: PAYMENT_GATEWAY_RESPONSE_MLE_PRIVATE_KEY_PASSWORD,
      responseMleKID: PAYMENT_GATEWAY_RESPONSE_MLE_KID,
      keyPass: PAYMENT_GATEWAY_KEY_PASS,
    };
  }
  return null;
};

/**
 * Builds key credentials from merchant-prefixed environment variables (e.g. `<PREFIX>_KEY_FILE_NAME`).
 * Returns null (and logs a warning) when none of JWT key, request MLE, or response MLE is configured.
 */
const buildPrefixedKeyCredentials = (environment: NodeJS.ProcessEnv, merchantEnvPrefix: string): Partial<KeyCredentialsType> | null => {
  const keyPass = environment[merchantEnvPrefix + Constants.STRING_KEY_PASS] || '';
  const keyAlias = environment[merchantEnvPrefix + Constants.STRING_KEY_ALIAS] || '';
  const keyFileUrl = environment[merchantEnvPrefix + Constants.STRING_FILE_URL] || '';
  const keyFileName = environment[merchantEnvPrefix + Constants.STRING_FILE_NAME] || '';
  const requestMlePublicCertUrl = environment[merchantEnvPrefix + Constants.STRING_REQUEST_MLE_PUBLIC_CERT_URL] || '';
  const requestMlePublicCertFile = environment[merchantEnvPrefix + Constants.STRING_REQUEST_MLE_PUBLIC_CERT_FILE] || '';
  const requestMleP12Password = environment[merchantEnvPrefix + Constants.ENV_SUFFIX_REQUEST_MLE_P12_SECRET] || ''; //checkmarx fix
  const responseMlePrivateKeyFile = environment[merchantEnvPrefix + Constants.STRING_RESPONSE_MLE_PRIVATE_KEY_FILE] || '';
  const responseMlePrivateKeyUrl = environment[merchantEnvPrefix + Constants.STRING_RESPONSE_MLE_PRIVATE_KEY_URL] || '';
  const responseMlePrivateKeyPassword = environment[merchantEnvPrefix + Constants.STRING_RESPONSE_MLE_PRIVATE_KEY_PASSWORD] || '';
  const responseMleKID = environment[merchantEnvPrefix + Constants.STRING_RESPONSE_MLE_KID] || '';
  const isJwtKeyConfigured = Boolean(keyPass) && Boolean(keyFileName || keyFileUrl);
  const isRequestMleConfigured = Boolean(requestMlePublicCertFile || requestMlePublicCertUrl);
  const isResponseMleConfigured = Boolean(responseMlePrivateKeyFile || responseMlePrivateKeyUrl);
  if (!isJwtKeyConfigured && !isRequestMleConfigured && !isResponseMleConfigured) {
    paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_KEY_CREDENTIALS, Constants.LOG_WARN, '', CustomMessages.ERROR_MSG_ENV_VARIABLES_NOT_FOUND + merchantEnvPrefix.toLowerCase());
    return null;
  }
  return {
    keyFileName: keyFileName,
    keyAlias: keyAlias,
    keyFileUrl: keyFileUrl,
    requestMlePublicCertUrl: requestMlePublicCertUrl,
    requestMlePublicCertFile: requestMlePublicCertFile,
    requestMleP12Password: requestMleP12Password,
    responseMlePrivateKeyFile: responseMlePrivateKeyFile,
    responseMlePrivateKeyUrl: responseMlePrivateKeyUrl,
    responseMlePrivateKeyPassword: responseMlePrivateKeyPassword,
    responseMleKID: responseMleKID,
    keyPass: keyPass,
  };
};

/**
 * Retrieves key credentials for a given merchant ID from environment variables.
 *
 * The function first checks if the default environment variables are set for the given merchant ID.
 * If not, it searches for merchant-specific prefixed variables to construct the key credentials.
 *
 * @param merchantId - The merchant ID for which key credentials are to be retrieved.
 * @returns An object containing key file name, key alias, key file URL, key password and MLE details.
 */
const getKeyCredentials = (merchantId: string): Partial<KeyCredentialsType> => {
  const environment = process?.env;
  if (!environment) {
    return DEFAULT_KEY_CREDENTIALS;
  }
  const merchantEnvPrefix = getMerchantEnvPrefix(merchantId);
  const resolvedCredentials = merchantEnvPrefix
    ? buildPrefixedKeyCredentials(environment, merchantEnvPrefix)
    : buildDefaultKeyCredentials(merchantId);
  return resolvedCredentials ?? DEFAULT_KEY_CREDENTIALS;
};

export default {
  getMidCredentials,
  getAllMidDetails,
  getKeyCredentials,
  buildDefaultKeyCredentials,
  buildPrefixedKeyCredentials
};
