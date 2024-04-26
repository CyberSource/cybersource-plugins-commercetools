import path from 'path';

import { Constants } from '../../constants';
import customerUpdateJson from '../../resources/customer_update_extension.json';
import paymentCreateJson from '../../resources/payment_create_extension.json';
import paymentUpdateJson from '../../resources/payment_update_extension.json';
import paymentUtils from '../PaymentUtils';
import commercetoolsApi from '../api/CommercetoolsApi';

const ensurePaymentCreateExtension = async () => {
  return syncExtensions(paymentCreateJson);
};

const ensurePaymentUpdateExtension = async () => {
  return syncExtensions(paymentUpdateJson);
};

const ensureCustomerUpdateExtension = async () => {
  return syncExtensions(customerUpdateJson);
};

const syncExtensions = async (extension: any) => {
  let url = '';
  let syncedExtensions = false;
  try {
    if (extension) {
      if ('isv_payment_create_extension' === extension.key) {
        url = Constants.PAYMENT_CREATE_DESTINATION_URL;
      } else if ('isv_payment_update_extension' === extension.key) {
        url = Constants.PAYMENT_UPDATE_DESTINATION_URL;
      } else if ('isv_customer_update_extension' === extension.key) {
        url = Constants.CUSTOMER_CREATE_DESTINATION_URL;
      }
      if (process.env.PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE && url) {
        const headerValue = paymentUtils.encryption(process.env.PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE);
        extension.destination.url = process.env.PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL + url;
        extension.destination.authentication.headerValue = 'Bearer' + ' ' + headerValue;
        const scriptResponse = await commercetoolsApi.addExtensions(extension);
        if (scriptResponse && Constants.HTTP_SUCCESS_STATUS_CODE !== parseInt(scriptResponse.statusCode)) {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncSyncExtensions', Constants.LOG_INFO, '', Constants.ERROR_MSG_CREATE_EXTENSION + Constants.STRING_FULL_COLON + extension.key + Constants.STRING_HYPHEN + scriptResponse.message);
        }
        syncedExtensions = true;
      } else {
        paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncSyncExtensions', Constants.LOG_INFO, '', Constants.ERROR_MSG_MISSING_AUTHORIZATION_HEADER);
      }
    }
  } catch (err) {
    paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncSyncExtensions', Constants.LOG_INFO, '', Constants.ERROR_MSG_CREATE_EXTENSION + Constants.REGEX_HYPHEN + extension.key);
  }
  return syncedExtensions;
};

export default {
  ensurePaymentCreateExtension,
  ensurePaymentUpdateExtension,
  ensureCustomerUpdateExtension,
  syncExtensions,
};
