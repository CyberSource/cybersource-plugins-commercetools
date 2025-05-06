import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from '../../constants/paymentConstants';
import { KeyCredentialsType, MidCredentialsType } from '../../types/Types';
import paymentUtils from '../PaymentUtils';

/**
 * Retrieves merchant credentials for a given merchant ID.
 * If no merchant ID is provided, it retrieves credentials from environment variables.
 * @param {string} merchantId - The ID of the merchant.
 * @returns {Promise<MidCredentialsType>} A promise that resolves with the merchant credentials.
 */
const getMidCredentials = (merchantId: string) => {
  let midData = {} as any;
  let allMidCredentials = [midData];
  if ('' === merchantId) {
    midData = {
      merchantId: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
      merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
      merchantSecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
    };
  } else {
    allMidCredentials = getAllMidDetails();
    allMidCredentials.forEach((key) => {
      if (merchantId == key?.merchantId) {
        midData = key;
      }
    });
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
 * Retrieves key credentials for a given merchant ID from environment variables.
 *
 * The function first checks if the default environment variables are set for the given merchant ID.
 * If not, it searches for merchant-specific prefixed variables to construct the key credentials.
 *
 * @param merchantId - The merchant ID for which key credentials are to be retrieved.
 * @returns An object containing key file name, key alias, key file URL, and key password.
 */
const getKeyCredentials = (merchantId: string): Partial<KeyCredentialsType> => {
  let fileNamePrefix = '';
  let keyFileName = '';
  let keyAlias: string;
  let keyFileUrl: string;
  const environment = process?.env;
  let fileNameIndex = 0;
  let keyCredentials: Partial<KeyCredentialsType> = {
    keyFileName: '',
    keyAlias: '',
    keyFileUrl: '',
  };
  const { PAYMENT_GATEWAY_MERCHANT_ID, PAYMENT_GATEWAY_KEY_FILE_NAME, PAYMENT_GATEWAY_KEY_ALIAS, PAYMENT_GATEWAY_KEY_FILE_URL, PAYMENT_GATEWAY_KEY_PASS } = process.env || '';
  if (environment) {
    if (PAYMENT_GATEWAY_MERCHANT_ID === merchantId && (PAYMENT_GATEWAY_KEY_FILE_NAME || PAYMENT_GATEWAY_KEY_FILE_URL) && PAYMENT_GATEWAY_KEY_PASS) {
      keyCredentials = {
        keyFileName: PAYMENT_GATEWAY_KEY_FILE_NAME,
        keyAlias: PAYMENT_GATEWAY_KEY_ALIAS,
        keyFileUrl: PAYMENT_GATEWAY_KEY_FILE_URL,
        keyPass: PAYMENT_GATEWAY_KEY_PASS
      };
    } else {
      for (let variable in environment) {
        if ((variable.includes(Constants.STRING_FILE_NAME) && 'PAYMENT_GATEWAY_KEY_FILE_NAME' !== variable) || (variable.includes(Constants.STRING_FILE_URL) && 'PAYMENT_GATEWAY_KEY_FILE_URL' !== variable)) {
          if (variable.indexOf(Constants.STRING_FILE_NAME)) {
            fileNameIndex = variable.indexOf(Constants.STRING_FILE_NAME)
          }
          if (variable.indexOf(Constants.STRING_FILE_URL)) {
            fileNameIndex = variable.indexOf(Constants.STRING_FILE_URL)
          }
          fileNamePrefix = variable.slice(0, fileNameIndex);
          if (fileNamePrefix.toLowerCase() === merchantId) {
            const keyPass = process.env[fileNamePrefix + '_KEY_PASS'] || '';
            keyAlias = process.env[fileNamePrefix + '_KEY_ALIAS'] || '';
            keyFileUrl = process.env[fileNamePrefix + '_KEY_FILE_URL'] || '';
            keyFileName = process.env[fileNamePrefix + '_KEY_FILE_NAME'] || '';
            if (keyPass && (keyFileName || keyFileUrl)) {
              keyCredentials = {
                keyFileName: keyFileName,
                keyAlias: keyAlias,
                keyFileUrl: keyFileUrl,
                keyPass: keyPass
              };
            } else {
              paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_KEY_CREDENTIALS, Constants.LOG_WARN, '', CustomMessages.ERROR_MSG_ENV_VARIABLES_NOT_FOUND + fileNamePrefix.toLowerCase());
            }
          }
        }
      }
    }
  }
  return keyCredentials;
};

export default {
  getMidCredentials,
  getAllMidDetails,
  getKeyCredentials
};
