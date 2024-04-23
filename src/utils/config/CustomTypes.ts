import path from 'path';

import { Constants } from '../../constants';
import paymentCustomJson from '../../resources/isv_payment_data_type.json';
import paymentErrorJson from '../../resources/isv_payment_error_type.json';
import paymentFailureJson from '../../resources/isv_payment_failure_type.json';
import customerTokensJson from '../../resources/isv_payments_customer_tokens_type.json';
import enrollCheckJson from '../../resources/isv_payments_payer_authentication_enrolment_check_type.json';
import enrollValidateJson from '../../resources/isv_payments_payer_authentication_validate_result_type.json';
import transactionCustomJson from '../../resources/isv_transaction_data_type.json';
import paymentService from '../PaymentService';
import paymentUtils from '../PaymentUtils';
import commercetoolsApi from '../api/CommercetoolsApi';

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
};

const syncCustomType = async (paymentCustomType: any) => {
  let syncedCustomTypes = false;
  let scriptResponse = {
    statusCode: 0,
    body: {
      statusCode: 0,
      errors: [
        {
          code: '',
        },
      ],
    },
    message: '',
  };
  try {
    if (paymentCustomType) {
      scriptResponse = await commercetoolsApi.addCustomTypes(paymentCustomType);
      if (scriptResponse && Constants.HTTP_SUCCESS_STATUS_CODE !== scriptResponse.statusCode) {
        if (Constants.HTTP_BAD_REQUEST_STATUS_CODE === scriptResponse.statusCode && Constants.HTTP_BAD_REQUEST_STATUS_CODE === scriptResponse.body.statusCode && scriptResponse.body?.errors && Constants.STRING_DUPLICATE_FIELD === scriptResponse.body.errors[0].code) {
          const getCustomType = await commercetoolsApi.getCustomType(paymentCustomType.key);
          if (getCustomType && Constants.HTTP_OK_STATUS_CODE === getCustomType.statusCode) {
            const typeObj = getCustomType.body;
            paymentService.updateCustomField(paymentCustomType.fieldDefinitions, typeObj.fieldDefinitions, typeObj.id, typeObj.version);
          }
          syncedCustomTypes = true;
        } else {
          paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncSyncCustomType', Constants.LOG_INFO, '', Constants.ERROR_MSG_CREATE_CUSTOM_TYPE + Constants.REGEX_HYPHEN + paymentCustomType.key + Constants.STRING_HYPHEN + scriptResponse?.message);
        }
      }
    }
  } catch (err) {
    paymentUtils.logData(path.parse(path.basename(__filename)).name, 'FuncSyncCustomType', Constants.LOG_ERROR, '', Constants.ERROR_MSG_CREATE_CUSTOM_TYPE + Constants.REGEX_HYPHEN + paymentCustomType.key + Constants.STRING_HYPHEN + scriptResponse?.message);
  }
  return syncedCustomTypes;
};

export default {
  ensurePaymentCustomType,
  ensurePaymentErrorCustomType,
  ensurePaymentFailureCustomType,
  ensureCustomerTokensCustomType,
  ensurePayerEnrollCustomType,
  ensurePayerValidateCustomType,
  ensureTransactionCustomType,
  syncCustomType,
};
