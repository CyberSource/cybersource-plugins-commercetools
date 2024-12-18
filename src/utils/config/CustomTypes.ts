import fs from 'fs';

import { Constants } from '../../constants/constants';
import { CustomMessages } from '../../constants/customMessages';
import { FunctionConstant } from '../../constants/functionConstant';
import paymentCustomJson from '../../resources/isv_payment_data_type.json';
import paymentErrorJson from '../../resources/isv_payment_error_type.json';
import paymentFailureJson from '../../resources/isv_payment_failure_type.json';
import customerTokensJson from '../../resources/isv_payments_customer_tokens_type.json';
import enrollCheckJson from '../../resources/isv_payments_payer_authentication_enrolment_check_type.json';
import enrollValidateJson from '../../resources/isv_payments_payer_authentication_validate_result_type.json';
import transactionCustomJson from '../../resources/isv_transaction_data_type.json';
import paymentUtils from '../PaymentUtils';
import commercetoolsApi from '../api/CommercetoolsApi';
import paymentHelper from '../helpers/PaymentHelper';

/**
 * creates the creation and synchronization of various payment-related custom types
 * in the commercetools API. Each function checks for specific custom types 
 * (such as payment, payer enroll, and transaction types) and calls the 
 * `syncCustomType` function to handle the synchronization process. 
 * If the required JSON files are present, the corresponding custom types 
 * are created or updated based on their definitions.
 * 
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating 
 * whether the custom types were successfully created or updated.
 */
const createPaymentCustomType = async () => {
  return syncCustomType(paymentCustomJson);
};

const createPayerEnrollCustomType = async () => {
  return syncCustomType(enrollCheckJson);
};

const createPayerValidateCustomType = async () => {
  return syncCustomType(enrollValidateJson);
};

const createCustomerTokensCustomType = async () => {
  return syncCustomType(paymentFailureJson);
};

const createPaymentErrorCustomType = async () => {
  return syncCustomType(paymentErrorJson);
};

const createPaymentFailureCustomType = async () => {
  return syncCustomType(customerTokensJson);
};

const createTransactionCustomType = async () => {
  return syncCustomType(transactionCustomJson);
};

const createAdditionalCustomType = async () => { //sudharsan review comment
  let customTypeCreated = false;
  let filePath = Constants.ADDITIONAL_CUSTOM_TYPE_FILE_PATH;
  if (!fs.existsSync(filePath)) {
    throw new Error(`${CustomMessages.ERROR_MSG_FILE_NOT_FOUND}: ${filePath}`);
  } else {
    const file = fs.readFileSync(filePath, 'utf8');
    const additionalFields = JSON.parse(file).types;
    for (let additionalCustomFields of additionalFields) {
      customTypeCreated = await syncCustomType(additionalCustomFields);
    }
  }
  return customTypeCreated;
}

/**
 * Synchronizes a custom type with the commercetools API.
 * 
 * This function attempts to create or update a custom type based on the 
 * provided definition. It handles cases for duplicate custom types by fetching 
 * the existing type and updating its field definitions if necessary. 
 * Logs error messages in case of failures during the API request.
 * 
 * @param {any} paymentCustomType - The custom type definition to sync.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating 
 * whether the synchronization was successful.
 */
const syncCustomType = async (paymentCustomType: any) => {
  let isCustomTypesSynced = false;
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
            paymentHelper.updateCustomField(paymentCustomType.fieldDefinitions, typeObj.fieldDefinitions, typeObj.id, typeObj.version);
          }
          isCustomTypesSynced = true;
        } else {
          paymentUtils.logData(__filename, FunctionConstant.FUNC_SYNC_CUSTOM_TYPE, Constants.LOG_ERROR, '', CustomMessages.ERROR_MSG_CREATE_CUSTOM_TYPE + Constants.REGEX_HYPHEN + paymentCustomType.key + Constants.STRING_HYPHEN + scriptResponse?.message);
        }
      }
    }
  } catch (err) {
    paymentUtils.logData(__filename, FunctionConstant.FUNC_SYNC_CUSTOM_TYPE, Constants.LOG_ERROR, '', CustomMessages.ERROR_MSG_CREATE_CUSTOM_TYPE + Constants.REGEX_HYPHEN + paymentCustomType.key + Constants.STRING_HYPHEN + scriptResponse?.message);
  }
  return isCustomTypesSynced;
};

export default {
  createPaymentCustomType,
  createPaymentErrorCustomType,
  createPaymentFailureCustomType,
  createCustomerTokensCustomType,
  createPayerEnrollCustomType,
  createPayerValidateCustomType,
  createTransactionCustomType,
  createAdditionalCustomType,
  syncCustomType,
};
