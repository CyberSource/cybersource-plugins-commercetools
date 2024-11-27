import { Constants } from '../../constants/constants';
import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import { MidCredentialsType } from '../../types/Types';
import paymentUtils from '../../utils/PaymentUtils';
/**
 * Retrieves merchant credentials for a given merchant ID.
 * If no merchant ID is provided, it retrieves credentials from environment variables.
 * @param {string} merchantId - The ID of the merchant.
 * @returns {Promise<MidCredentialsType>} A promise that resolves with the merchant credentials.
 */
const getMidCredentials = async (merchantId: string): Promise<MidCredentialsType> => {
  let midData: MidCredentialsType = {
    merchantId: '',
    merchantKeyId: '',
    merchantSecretKey: '',
  };
  let allMidCredentials = [midData];
  if ('' === merchantId) {
    midData = {
      merchantId: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
      merchantKeyId: process.env.PAYMENT_GATEWAY_MERCHANT_KEY_ID,
      merchantSecretKey: process.env.PAYMENT_GATEWAY_MERCHANT_SECRET_KEY,
    };
  } else {
    allMidCredentials = await getAllMidDetails();
    allMidCredentials.forEach((key) => {
      if (merchantId == key?.merchantId) midData = key;
    });
  }
  return midData;
};
/**
 * Retrieves details of all merchant IDs and their corresponding credentials.
 * @returns {Promise<MidCredentialsType[]>} A promise that resolves with an array of merchant credentials.
 */
const getAllMidDetails = async (): Promise<MidCredentialsType[]> => {
  const midArray: MidCredentialsType[] = [];
  let secretKeyIndex: number;
  let secretKeyPrefix: string;
  let keyId: string;
  let secretKey: string;
  const environment = process?.env;
  try {
    if (environment) {
      for (let variable in environment) {
        if (variable.includes(Constants.STRING_SECRET_KEY) && 'PAYMENT_GATEWAY_MERCHANT_SECRET_KEY' !== variable) {
          secretKeyIndex = variable.indexOf(Constants.STRING_SECRET_KEY);
          secretKeyPrefix = variable.slice(0, secretKeyIndex);
          keyId = process.env[secretKeyPrefix + '_KEY_ID'] || '';
          secretKey = process.env[variable] || '';
          if (secretKeyPrefix && keyId && secretKey) {
            midArray.push({
              merchantId: secretKeyPrefix.toLowerCase(),
              merchantKeyId: keyId,
              merchantSecretKey: secretKey,
            });
          } else paymentUtils.logData(__filename, FunctionConstant.FUNC_GET_ALL_MID_DETAILS, Constants.LOG_ERROR, '', CustomMessages.ERROR_MSG_ENV_VARIABLES_NOT_FOUND + secretKeyPrefix.toLowerCase());
        }
      }
    }
  } catch (exception) {
    paymentUtils.logExceptionData(__filename, FunctionConstant.FUNC_GET_ALL_MID_DETAILS, CustomMessages.EXCEPTION_MSG_ALL_MID_DETAILS, exception, '', '', '');
  }
  return midArray;
};

export default {
  getMidCredentials,
  getAllMidDetails,
};
