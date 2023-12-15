import path from 'path';
import commercetoolsApi from '../api/CommercetoolsApi';
import paymentService from '../PaymentService';
import { Constants } from '../../constants';
import paymentCreateJson from '../../resources/payment_create_extension.json';
import paymentUpdateJson from '../../resources/payment_update_extenison.json';
import customerUpdateJson from '../../resources/customer_update_extension.json';

const ensurePaymentCreateExtension = async () => {
  return syncExtensions(paymentCreateJson);
};

const ensurePaymentUpdateExtension = async () => {
  return syncExtensions(paymentUpdateJson);
};

const ensureCustomerUpdateExtension = async () => {
  return syncExtensions(customerUpdateJson);
};

const syncExtensions = async (extension) => {
  let headerValue;
  let scriptResponse: any;
  let url: any;
  try {
    if (Constants.PAYMENT_CREATE_KEY == extension.key) {
      url = Constants.PAYMENT_CREATE_DESTINATION_URL;
    } else if (Constants.PAYMENT_UPDATE_KEY == extension.key) {
      url = Constants.PAYMENT_UPDATE_DESTINATION_URL;
    } else if (Constants.CUSTOMER_UPDATE_KEY == extension.key) {
      url = Constants.CUSTOMER_CREATE_DESTINATION_URL;
    }
    headerValue = paymentService.encryption(process.env.PAYMENT_GATEWAY_EXTENSION_HEADER_VALUE);
    extension.destination.url = process.env.PAYMENT_GATEWAY_EXTENSION_DESTINATION_URL + url;
    extension.destination.authentication.headerValue = 'Bearer' + Constants.STRING_EMPTY_SPACE + headerValue;
    scriptResponse = await commercetoolsApi.addExtensions(extension);
    if (null != scriptResponse && Constants.HTTP_CODE_TWO_HUNDRED_ONE != parseInt(scriptResponse.statusCode)) {
      paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_CONFIGURE_PLUGIN, Constants.LOG_INFO, null, Constants.ERROR_MSG_CREATE_EXTENSION + Constants.STRING_FULLCOLON + extension.key + Constants.STRING_HYPHEN + scriptResponse.message);
    }
  } catch (err) {
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_CONFIGURE_PLUGIN, Constants.LOG_INFO, null, Constants.ERROR_MSG_CREATE_CUSTOM_TYPE + Constants.REGEX_HYPHEN + extension.key + Constants.STRING_HYPHEN + scriptResponse.message);
  }
};

export default {
  ensurePaymentCreateExtension,
  ensurePaymentUpdateExtension,
  ensureCustomerUpdateExtension,
};
