import customExtension from './CustomExtensions';
import customType from './CustomTypes';

/**
 * Ensures the existence of custom types required for the payment gateway.
 * @returns {Promise<Promise<[boolean, boolean, boolean, boolean, boolean, boolean, boolean]>>} A promise that resolves when all custom types are ensured.
 */
const ensureCustomTypes = async () => {
  return Promise.all([
    customType.ensurePaymentCustomType(),
    customType.ensurePayerEnrollCustomType(),
    customType.ensurePayerValidateCustomType(),
    customType.ensureCustomerTokensCustomType(),
    customType.ensurePaymentErrorCustomType(),
    customType.ensurePaymentFailureCustomType(),
    customType.ensureTransactionCustomType(),
  ]);
};

/**
 * Ensures the existence of required extensions for the payment gateway.
 * @returns {Promise<Array>} A promise that resolves when all extensions are ensured.
 */
const ensureExtension = async () => {
  return Promise.all([customExtension.ensurePaymentCreateExtension(), customExtension.ensurePaymentUpdateExtension(), customExtension.ensureCustomerUpdateExtension()]);
};

export default {
  ensureCustomTypes,
  ensureExtension,
};
