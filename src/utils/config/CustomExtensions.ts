import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import { Constants } from '../../constants/paymentConstants';
import customerUpdateJson from '../../resources/customer_update_extension.json';
import paymentCreateJson from '../../resources/payment_create_extension.json';
import paymentUpdateJson from '../../resources/payment_update_extension.json';
import paymentUtils from '../PaymentUtils';
import commercetoolsApi from '../api/CommercetoolsApi';
import authenticationHelper from '../helpers/AuthenticationHelper';

/**
 * Synchronizes the specified extension with the commercetools API.
 * 
 * This function checks the extension's key to determine the correct 
 * destination URL and sets the appropriate authentication header. 
 * It then attempts to add the extension to the commercetools API. 
 * If the operation fails, it logs an error message. The function 
 * returns a boolean indicating whether the synchronization was successful.
 * 
 * @param {any} extension - The extension object containing details 
 * such as the key and destination settings.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean 
 * indicating if the extension was successfully synced.
 */
const createPaymentCreateExtension = async () => {
  return syncExtensions(paymentCreateJson);
};

const createPaymentUpdateExtension = async () => {
  return syncExtensions(paymentUpdateJson);
};

const createCustomerUpdateExtension = async () => {
  return syncExtensions(customerUpdateJson);
};

const syncExtensions = async (extension: any) => {
  let isExtensionsSynced = false;
  let url = '';
  try {
    if (extension) {
      switch (extension.key) {
        case 'isv_payment_create_extension':
          url = Constants.PAYMENT_CREATE_DESTINATION_URL;
          break;
        case 'isv_payment_update_extension':
          url = Constants.PAYMENT_UPDATE_DESTINATION_URL;
          break;
        case 'isv_customer_update_extension':
          url = Constants.CUSTOMER_UPDATE_DESTINATION_URL;
      }
      if (process.env.PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE && url) {
        const headerValue = authenticationHelper.encryption(process.env.PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE);
        extension.destination.url = process.env.PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL + url;
        extension.destination.authentication.headerValue = 'Bearer' + ' ' + headerValue;
        const scriptResponse = await commercetoolsApi.addExtensions(extension);
        if (scriptResponse && Constants.HTTP_SUCCESS_STATUS_CODE !== parseInt(scriptResponse.statusCode)) {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_SYNC_EXTENSIONS, Constants.LOG_ERROR, '', CustomMessages.ERROR_MSG_CREATE_EXTENSION + Constants.STRING_FULL_COLON + extension.key + Constants.STRING_HYPHEN + scriptResponse.message);
        }
        isExtensionsSynced = true;
      } else {
        paymentUtils.logData(__filename, FunctionConstant.FUNC_SYNC_EXTENSIONS, Constants.LOG_ERROR, '', CustomMessages.ERROR_MSG_MISSING_AUTHORIZATION_HEADER);
      }
    }
  } catch (err) {
    paymentUtils.logData(__filename, FunctionConstant.FUNC_SYNC_EXTENSIONS, Constants.LOG_ERROR, '', CustomMessages.ERROR_MSG_CREATE_EXTENSION + Constants.REGEX_HYPHEN + extension.key);
  }
  return isExtensionsSynced;
};

export default {
  createPaymentCreateExtension,
  createPaymentUpdateExtension,
  createCustomerUpdateExtension,
  syncExtensions,
};
