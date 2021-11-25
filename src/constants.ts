export abstract class Constants {
  static readonly AUTHENTICATION_TYPE = 'http_signature';
  static readonly RESPONSE_STATUS = 'status';
  static readonly ERROR_STRING = 'Error: ';
  static readonly JWT_FORMAT = 'JWT';
  static readonly ENCRYPTION_TYPE = 'RsaOaep';
  static readonly TRANSACTION_MODE = 'S';
  static readonly ISV_PAYMENT_PARTNER_SOLUTION_ID = '0RX6X1BO';

  static readonly VAL_ZERO = 0;
  static readonly VAL_FLOAT_ZERO = 0.0;
  static readonly VAL_ONE = 1;
  static readonly VAL_HUNDRED = 100;
  static readonly VAL_TWO = 2;

  static readonly EMPTY_STRING = '';
  static readonly DOUBLE_SLASH = '//';

  static readonly FALSE = 'false';
  static readonly DECISION_SKIP = 'DECISION_SKIP';
  static readonly SHIPPING_INFO = 'shippingInfo';
  static readonly SHIPPING_AND_HANDLING = 'shipping_and_handling';
  static readonly STATUS_CODE = 'statusCode';
  static readonly VISA_CHECKOUT = 'visaCheckout';
  static readonly VISA = 'visa';
  static readonly VALIDATION = 'validation';
  static readonly CARD = 'card';
  static readonly CREDIT_CARD = 'creditCard';
  static readonly CC_PAYER_AUTHENTICATION = 'creditCardWithPayerAuthentication';
  static readonly ANONYMOUS_ID = 'anonymousId';
  static readonly CUSTOMER_ID = 'customerId';
  static readonly ACTIVE_CART_STATE = 'cartState="Active"';
  static readonly LAST_MODIFIED_AT = 'lastModifiedAt';
  static readonly DESC_ORDER = 'desc';
  static readonly CUSTOMER = 'customer';
  static readonly VALIDATION_CALLBACK = 'validationCallback';
  static readonly BODY = 'body';
  static readonly RESOURCE = 'resource';
  static readonly OBJ = 'obj';

  static readonly AUTHORIZATION = 'Authorization';
  static readonly SUCCESS = 'Success';
  static readonly INITIAL = 'Initial';
  static readonly PENDING = 'Pending';
  static readonly FAILURE = 'Failure';
  static readonly CHARGE = 'Charge';
  static readonly REFUND = 'Refund';
  static readonly CANCEL_AUTHORIZATION = 'CancelAuthorization';
  static readonly ISV_TOKEN = 'isv_token';
  static readonly ISV_TOKEN_ALIAS = 'isv_tokenAlias';
  static readonly ISV_PAYMENT_FAILURE = 'isv_payment_failure';
  static readonly ISV_MASKED_PAN = 'isv_maskedPan';
  static readonly ISV_CARD_EXPIRY_MONTH = 'isv_cardExpiryMonth';
  static readonly ISV_CARD_EXPIRY_YEAR = 'isv_cardExpiryYear';
  static readonly ISV_CARD_TYPE = 'isv_cardType';
  static readonly ISV_ENROLLMENT_CHECK =
    'isv_payments_payer_authentication_enrolment_check';
  static readonly ISV_PAYER_AUTHENTICATION_REQUIRED =
    'isv_payerAuthenticationRequired';
  static readonly ISV_PAYER_AUTHETICATION_TRANSACTION_ID =
    'isv_payerAuthenticationTransactionId';
  static readonly ISV_ACS_URL = 'isv_payerAuthenticationAcsUrl';
  static readonly ISV_PAREQ = 'isv_payerAuthenticationPaReq';
  static readonly ISV_RESPONSE_JWT = 'isv_responseJwt';
  static readonly ADD_TRANSACTION = 'addTransaction';
  static readonly SET_BILLING_ADDRESS = 'setBillingAddress';
  static readonly SET_CUSTOM_FIELD = 'setCustomField';
  static readonly CHANGE_TRANSACTION_INTERACTION_ID =
    'changeTransactionInteractionId';
  static readonly CHANGE_TRANSACTION_STATE = 'changeTransactionState';
  static readonly ADD_INTERFACE_INTERACTION = 'addInterfaceInteraction';

  static readonly ISV_CAPTURE_CONTEXT_SIGNATURE =
    'isv_tokenCaptureContextSignature';
  static readonly ISV_MDD_1 = 'isv_merchantDefinedData_mddField_1';
  static readonly ISV_MDD_2 = 'isv_merchantDefinedData_mddField_2';
  static readonly ISV_MDD_3 = 'isv_merchantDefinedData_mddField_3';
  static readonly INVALID_OPERATION = 'InvalidOperation';
  static readonly INVALID_INPUT = 'InvalidInput';

  static readonly HTTP_METHOD_GET = 'GET';
  static readonly HTTP_METHOD_POST = 'POST';

  static readonly HTTP_CODE_TWO_HUNDRED = 200;
  static readonly HTTP_CODE_TWO_HUNDRED_ONE = 201;

  static readonly TOKEN_ACTION_TYPES =
    'customer,paymentInstrument,instrumentIdentifier';
  static readonly VALIDATE_CONSUMER_AUTHENTICATION =
    'VALIDATE_CONSUMER_AUTHENTICATION';
  static readonly TOKEN_CREATE = 'TOKEN_CREATE';
  static readonly API_STATUS_AUTHORIZED = 'AUTHORIZED';
  static readonly API_STATUS_PENDING_REVIEW = 'AUTHORIZED_PENDING_REVIEW';
  static readonly API_STATUS_COMPLETED = 'COMPLETED';
  static readonly API_STATUS_PENDING_AUTHENTICATION = 'PENDING_AUTHENTICATION';
  static readonly API_STATUS_AUTHENTICATION_SUCCESSFUL =
    'AUTHENTICATION_SUCCESSFUL';
  static readonly API_STATUS_PENDING = 'PENDING';
  static readonly API_STATUS_REVERSED = 'REVERSED';

  static readonly SUCCESS_MSG_CAPTURE = 'Capture is completed successfully';
  static readonly SUCCESS_MSG_REFUND = 'Refund is completed successfully';
  static readonly SUCCESS_MSG_REVERSAL =
    'Authorization reversal is completed successfully';
  static readonly SUCCESS_MSG_CART_UPDATE = 'Cart updated successfully';

  static readonly ERROR_MSG_FLEX_TOKEN =
    'Failed to generate one time key for Flex token: ';
  static readonly ERROR_MSG_RETRIEVE_PAYMENT_DETAILS =
    'Unable to retrieve payment details: ';
  static readonly ERROR_MSG_COMMERCETOOLS_CONNECT =
    'Unable to connect to Commercetools: ';
  static readonly ERROR_MSG_FETCHING_ORDER_DETAILS =
    'Exception during fetching order details: ';
  static readonly ERROR_MSG_NO_PAYMENTS =
    'There are no payment method available for the payment';
  static readonly ERROR_MSG_NO_CART =
    'There is no cart available for the payment';
  static readonly ERROR_MSG_AUTHORIZING_PAYMENT =
    'An exception occured while authorizing the payment: ';
  static readonly ERROR_MSG_NO_CARD_DETAILS =
    'There are no card details available for the payment';
  static readonly ERROR_MSG_NO_TRANSACTION_DETAILS =
    'There are no transaction details';
  static readonly ERROR_MSG_CAPTURE_FAILURE =
    'Cannot process capture as there are no transaction id avaialable';
  static readonly ERROR_MSG_CAPTURE_SERVICE =
    'Error in triggering capture service';
  static readonly ERROR_MSG_REFUND_FAILURE =
    'Cannot process refund as there are no transaction id avaialable';
  static readonly ERROR_MSG_REFUND_SERVICE =
    'Error in triggering refund service';
  static readonly ERROR_MSG_REFUND_GREATER_THAN_ZERO =
    'Refund amount should be greater than zero';
  static readonly ERROR_MSG_REFUND_EXCEEDS_CAPTURE_AMOUNT =
    'Cannot perform refund - amount exceeds captured amount';
  static readonly ERROR_MSG_REVERSAL_FAILURE =
    'Cannot process authorization reversal as there are no transaction id avaialable';
  static readonly ERROR_MSG_REVERSAL_SERVICE =
    'Error in triggering authorization reversal service';
  static readonly ERROR_MSG_NO_TRANSACTION =
    'There are no transactions created for the payment: ';
  static readonly ERROR_MSG_INVALID_OPERATION =
    'Cannot process this payment due to invalid operation';
  static readonly ERROR_MSG_INVALID_INPUT =
    'Cannot process this payment due to invalid input';
}
