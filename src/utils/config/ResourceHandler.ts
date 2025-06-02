import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from '../../constants/paymentConstants';
import { ApiError, errorHandler } from '../ErrorHandler';
import paymentUtils from '../PaymentUtils';

import customExtension from './CustomExtensions';
import customType from './CustomTypes';

/**
 * creates the existence of custom types required for the payment gateway.
 * @returns {Promise<Promise<[boolean, boolean, boolean, boolean, boolean, boolean, boolean]>>} A promise that resolves when all custom types are created.
 */
const createCustomTypes = async () => {
  return Promise.all([
    customType.createPaymentCustomType(),
    customType.createPayerEnrollCustomType(),
    customType.createPayerValidateCustomType(),
    customType.createCustomerTokensCustomType(),
    customType.createPaymentErrorCustomType(),
    customType.createPaymentFailureCustomType(),
    customType.createTransactionCustomType(),
  ]);
};

/**
 * Adds a custom type if the required environment variables are set.
 * 
 * This function checks for essential environment variables needed to create a custom type.
 * If all required variables are present, it calls the method to create the custom type is created.
 * Logs success or error messages based on the outcome.
 * 
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
const addCustomType = async (): Promise<void> => {
  try {
    if (process.env.CT_PROJECT_KEY && process.env.CT_CLIENT_ID && process.env.CT_CLIENT_SECRET && process.env.CT_AUTH_HOST && process.env.CT_API_HOST) {
      await customType.createAdditionalCustomType();
      paymentUtils.logData(__filename, FunctionConstant.FUNC_ADD_CUSTOM_TYPE, Constants.LOG_INFO, '', CustomMessages.SUCCESS_MSG_EXTENSION_CREATION);
    } else {
      paymentUtils.logData(__filename, FunctionConstant.FUNC_ADD_CUSTOM_TYPE, Constants.LOG_WARN, '', CustomMessages.ERROR_MSG_CUSTOM_FIELD_SETUP);
    }
  } catch (exception) {
    errorHandler.logError(new ApiError(CustomMessages.EXCEPTION_MSG_CUSTOM_TYPE, exception, FunctionConstant.FUNC_ADD_CUSTOM_TYPE), __filename, '');
  }
}

/**
 * creates the existence of required extensions for the payment gateway.
 * @returns {Promise<Array>} A promise that resolves when all extensions are created.
 */
const createExtension = async (): Promise<[boolean, boolean, boolean]> => {
  return Promise.all([customExtension.createPaymentCreateExtension(), customExtension.createPaymentUpdateExtension(), customExtension.createCustomerUpdateExtension()]);
};

export {
  createCustomTypes,
  addCustomType,
  createExtension
};
