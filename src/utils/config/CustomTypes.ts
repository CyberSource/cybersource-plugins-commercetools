import path from 'path';
import commercetoolsApi from '../api/CommercetoolsApi';
import paymentService from '../PaymentService';
import paymentHandler from '../PaymentHandler';
import { Constants } from '../../constants';
import paymentCustomJson from '../../resources/isv_payment_data_type.json';
import enrollCheckJson from '../../resources/isv_payments_payer_authentication_enrolment_check_type.json';
import enrollValidateJson from '../../resources/isv_payments_payer_authentication_validate_result_type.json';
import customerTokensJson from '../../resources/isv_payments_customer_tokens_type.json';
import paymentErrorJson from '../../resources/isv_payment_error_type.json';
import paymentFailureJson from '../../resources/isv_payment_failure_type.json';
import transactionCustomJson from '../../resources/isv_transaction_data_type.json';

const ensurePaymentCustomType = async () => {
  return syncCustomType(paymentCustomJson);
};

const ensurePayerEnrollCustomType = async () => {
  return syncCustomType(enrollCheckJson);
};

const ensurePayerValidateCustomType = async () => {
  return syncCustomType(enrollValidateJson);
};

const ensureCustomerTokensCustomType = async () => {
  return syncCustomType(paymentFailureJson);
};

const ensurePaymentErrorCustomType = async () => {
  return syncCustomType(paymentErrorJson);
};

const ensurePaymentFailureCustomType = async () => {
  return syncCustomType(customerTokensJson);
};

const ensureTransactionCustomType = async () => {
  return syncCustomType(transactionCustomJson);
}

const syncCustomType = async (paymentCustomType) => {
  let scriptResponse: any;
  let getCustomType: any;
  let typeObj: any;
  try {
    scriptResponse = await commercetoolsApi.addCustomTypes(paymentCustomType);
    if (null != scriptResponse && Constants.HTTP_CODE_TWO_HUNDRED_ONE != scriptResponse.statusCode) {
      if (
        Constants.HTTP_CODE_FOUR_HUNDRED == scriptResponse.statusCode &&
        Constants.HTTP_CODE_FOUR_HUNDRED == scriptResponse.body.statusCode &&
        Constants.STRING_ERRORS in scriptResponse.body &&
        Constants.STRING_DUPLICATE_FIELD == scriptResponse.body.errors[Constants.VAL_ZERO].code
      ) {
        getCustomType = await commercetoolsApi.getCustomType(paymentCustomType.key);
        if (null != getCustomType && Constants.HTTP_CODE_TWO_HUNDRED == getCustomType.statusCode) {
          typeObj = getCustomType.body;
          paymentHandler.updateCustomField(paymentCustomType.fieldDefinitions, typeObj.fieldDefinitions, typeObj.id, typeObj.version);
        }
      } else {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_CONFIGURE_PLUGIN, Constants.LOG_INFO, null, Constants.ERROR_MSG_CREATE_CUSTOM_TYPE + Constants.REGEX_HYPHEN + paymentCustomType.key + Constants.STRING_HYPHEN + scriptResponse.message);
      }
    }
  } catch (err) {
    paymentService.logData(path.parse(path.basename(__filename)).name, Constants.POST_CONFIGURE_PLUGIN, Constants.LOG_INFO, null, Constants.ERROR_MSG_CREATE_CUSTOM_TYPE + Constants.REGEX_HYPHEN + paymentCustomType.key + Constants.STRING_HYPHEN + scriptResponse.message);
  }
};

export default {
  ensurePaymentCustomType,
  ensurePaymentErrorCustomType,
  ensurePaymentFailureCustomType,
  ensureCustomerTokensCustomType,
  ensurePayerEnrollCustomType,
  ensurePayerValidateCustomType,
  ensureTransactionCustomType
};
