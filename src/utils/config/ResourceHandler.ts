import customType from './CustomTypes';
import customExtension from './CustomExtensions';

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

const ensureExtension = async () => {
  return Promise.all([customExtension.ensurePaymentCreateExtension(), customExtension.ensurePaymentUpdateExtension(), customExtension.ensureCustomerUpdateExtension()]);
};

export default {
  ensureCustomTypes,
  ensureExtension,
};
