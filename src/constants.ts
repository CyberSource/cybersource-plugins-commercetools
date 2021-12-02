export abstract class Constants {
  //Numbers
  static readonly VAL_ZERO = 0;
  static readonly VAL_FLOAT_ZERO = 0.0;
  static readonly VAL_ONE = 1;
  static readonly VAL_HUNDRED = 100;
  static readonly VAL_TWO = 2;
  static readonly VAL_TWENTYTHREE = 23;
  static readonly VAL_FIFTYNINE = 59;

  //Payments data
  static readonly ISV_PAYMENT_AUTHENTICATION_TYPE = 'http_signature';
  static readonly ISV_PAYMENT_PARTNER_SOLUTION_ID = '0RX6X1BO';
  static readonly ISV_PAYMENT_JWT_FORMAT = 'JWT';
  static readonly ISV_PAYMENT_ENCRYPTION_TYPE = 'RsaOaep';
  static readonly ISV_PAYMENT_TRANSACTION_MODE = 'S';
  static readonly ISV_PAYMENT_DECISION_SKIP = 'ISV_PAYMENT_DECISION_SKIP';
  static readonly ISV_PAYMENT_TOKEN_ACTION_TYPES =
    'customer,paymentInstrument,instrumentIdentifier';
  static readonly ISV_PAYMENT_VALIDATE_CONSUMER_AUTHENTICATION =
    'ISV_PAYMENT_VALIDATE_CONSUMER_AUTHENTICATION';
  static readonly ISV_PAYMENT_TOKEN_CREATE = 'ISV_PAYMENT_TOKEN_CREATE';

  static readonly HTTP_METHOD_GET = 'GET';
  static readonly HTTP_METHOD_POST = 'POST';

  //Payment status codes
  static readonly HTTP_CODE_TWO_HUNDRED = 200;
  static readonly HTTP_CODE_TWO_HUNDRED_ONE = 201;

  //Payment response
  static readonly HTTP_STATUS_DECISION_ACCEPT = 'ACCEPT';
  static readonly HTTP_STATUS_DECISION_REJECT = 'REJECT';
  static readonly API_STATUS_AUTHORIZED = 'AUTHORIZED';
  static readonly API_STATUS_PENDING_REVIEW = 'AUTHORIZED_PENDING_REVIEW';
  static readonly API_STATUS_COMPLETED = 'COMPLETED';
  static readonly API_STATUS_PENDING_AUTHENTICATION = 'PENDING_AUTHENTICATION';
  static readonly API_STATUS_AUTHENTICATION_SUCCESSFUL =
    'AUTHENTICATION_SUCCESSFUL';
  static readonly API_STATUS_PENDING = 'CT_TRANSACTION_STATE_PENDING';
  static readonly API_STATUS_REVERSED = 'REVERSED';
  static readonly API_STATUS_AUTHORIZED_RISK_DECLINED =
    'AUTHORIZED_RISK_DECLINED';

  //Regex
  static readonly STRING_EMPTY = '';
  static readonly REGEX_DOUBLE_SLASH = '//';
  static readonly REGEX_DOT = '.';
  static readonly CLICK_TO_PAY_CARD_MASK = '...';

  static readonly VISA_CHECKOUT = 'visaCheckout';
  static readonly CREDIT_CARD = 'creditCard';
  static readonly CC_PAYER_AUTHENTICATION = 'creditCardWithPayerAuthentication';

  static readonly DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss[Z]';
  static readonly STRING_RESPONSE_STATUS = 'status';
  static readonly STRING_ERROR = 'Error: ';
  static readonly STRING_EXCEPTION = 'Exception: ';
  static readonly STRING_HOURS = 'hours';
  static readonly STRING_FALSE = 'false';
  static readonly STRING_TRUE = 'true';
  static readonly STRING_VISA = 'visa';
  static readonly STRING_CARD = 'card';
  static readonly STRING_CUSTOM = 'custom';
  static readonly STRING_FIELDS = 'fields';
  static readonly STRING_ID = 'id';
  static readonly STRING_QUERY = 'query';
  static readonly STRING_BODY = 'body';
  static readonly STRING_RESOURCE = 'resource';
  static readonly STRING_OBJ = 'obj';
  static readonly STRING_CUSTOMER = 'customer';
  static readonly SHIPPING_INFO = 'shippingInfo';
  static readonly SHIPPING_AND_HANDLING = 'shipping_and_handling';
  static readonly STATUS_CODE = 'statusCode';
  static readonly VALIDATION = 'validation';
  static readonly ANONYMOUS_ID = 'anonymousId';
  static readonly CUSTOMER_ID = 'customerId';
  static readonly ACTIVE_CART_STATE = 'cartState="Active"';
  static readonly LAST_MODIFIED_AT = 'lastModifiedAt';
  static readonly DESC_ORDER = 'desc';
  static readonly VALIDATION_CALLBACK = 'validationCallback';
  static readonly TOKEN_INFORMATION = 'tokenInformation';
  static readonly PAYMENT_INSTRUMENT = 'paymentInstrument';
  static readonly REFUND_ID = 'refundId';
  static readonly REFUND_AMOUNT = 'refundAmount';
  //static readonly TRANSACTIONS = 'transactions';

  //CT transaction type
  static readonly CT_TRANSACTION_TYPE_AUTHORIZATION = 'Authorization';
  static readonly CT_TRANSACTION_TYPE_CHARGE = 'Charge';
  static readonly CT_TRANSACTION_TYPE_REFUND = 'Refund';
  static readonly CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION =
    'CancelAuthorization';

  //CT transaction state
  static readonly CT_TRANSACTION_STATE_SUCCESS = 'Success';
  static readonly CT_TRANSACTION_STATE_INITIAL = 'Initial';
  static readonly CT_TRANSACTION_STATE_PENDING = 'Pending';
  static readonly CT_TRANSACTION_STATE_FAILURE = 'Failure';

  //CT custom fields
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
  static readonly ISV_SAVED_TOKEN = 'isv_savedToken';
  static readonly ISV_CAPTURE_CONTEXT_SIGNATURE =
    'isv_tokenCaptureContextSignature';
  static readonly ISV_MDD_1 = 'isv_merchantDefinedData_mddField_1';
  static readonly ISV_MDD_2 = 'isv_merchantDefinedData_mddField_2';
  static readonly ISV_MDD_3 = 'isv_merchantDefinedData_mddField_3';
  static readonly ISV_TOKENS = 'isv_tokens';
  static readonly ADD_TRANSACTION = 'addTransaction';
  static readonly SET_BILLING_ADDRESS = 'setBillingAddress';
  static readonly SET_CUSTOM_FIELD = 'setCustomField';
  static readonly CHANGE_TRANSACTION_INTERACTION_ID =
    'changeTransactionInteractionId';
  static readonly CHANGE_TRANSACTION_STATE = 'changeTransactionState';
  static readonly ADD_INTERFACE_INTERACTION = 'addInterfaceInteraction';
  static readonly INVALID_OPERATION = 'InvalidOperation';
  static readonly INVALID_INPUT = 'InvalidInput';

  //Extension success messages
  static readonly SUCCESS_MSG_CAPTURE_SERVICE =
    'Capture is completed successfully';
  static readonly SUCCESS_MSG_REFUND_SERVICE =
    'Refund is completed successfully';
  static readonly SUCCESS_MSG_REVERSAL_SERVICE =
    'Authorization reversal is completed successfully';
  static readonly SUCCESS_MSG_UPDATE_CLICK_TO_PAY_CARD_DETAILS =
    'Updated click to pay card details successfully';
  static readonly SUCCESS_MSG_DECISION_SYNC_SERVICE =
    'Successfully completed DecisionSync';
  static readonly SUCCESS_MSG_CARD_TOKENS_UPDATE =
    'Successfully updated card tokens';

  //Exceptions
  static readonly EXCEPTION_MSG_FETCH_ORDER_DETAILS =
    'An exception occured while fetching order details';
  static readonly EXCEPTION_MSG_AUTHORIZING_PAYMENT =
    'An exception occured while authorizing the payment';
  static readonly EXCEPTION_MSG_PAYER_AUTH =
    'An exception occured while authenticating the payment';
  static readonly EXCEPTION_MSG_FETCH_PAYMENT_DETAILS =
    'An exception occured while fetching payment details';
  static readonly EXCEPTION_MSG_SERVICE_PROCESS =
    'An exception occured while processing your payment';
  static readonly EXCEPTION_MSG_CONVERSION_DETAILS =
    'An exception occured while fetching conversion details';
  static readonly EXCEPTION_MSG_COMMERCETOOLS_CONNECT =
    'An exception occured while connecting to commercetools';
  static readonly EXCEPTION_MSG_CART_DETAILS =
    'An exception occured while fething cart details';
  static readonly EXCEPTION_MSG_ADD_TRANSACTION =
    'An exception occured while adding transaction to the payment';
  static readonly EXCEPTION_MSG_CART_UPDATE =
    'An exception occured while updating the cart';
  static readonly EXCEPTION_MSG_CUSTOMER_UPDATE =
    'An exception occured while updating card tokens to customer';
  static readonly EXCEPTION_MSG_DECISON_SYNC =
    'An exception occured while fecting conversion detail report';

  //payments error
  static readonly ERROR_MSG_RETRIEVE_PAYMENT_DETAILS =
    'Unable to retrieve payment details';
  static readonly ERROR_MSG_EMPTY_PAYMENT_DATA =
    'There was an error while fetching payment details';
  static readonly ERROR_MSG_NO_PAYMENT_METHODS =
    'There are no payment method available for the payment';

  //order error
  static readonly ERROR_MSG_NO_ORDER_DETAILS =
    'Unable to retrieve order details, please try again';

  //cart error
  static readonly ERROR_MSG_EMPTY_CART =
    'There is no cart available for the payment';
  static readonly ERROR_MSG_CART_DETAILS = 'Unable to fetch cart details';

  //click to pay
  static readonly ERROR_MSG_CLICK_TO_PAY_DATA =
    'There was an error while fetching click to pay data';
  static readonly ERROR_MSG_UPDATE_CLICK_TO_PAY_DATA =
    'Unable to update click to pay card deatils';

  //transaction errror
  static readonly ERROR_MSG_FETCH_TRANSACTIONS =
    'Unable to feth transactions details';
  static readonly ERROR_MSG_EMPTY_TRANSACTION_DETAILS =
    'There was an error while fetching transaction details, please try again';
  static readonly ERROR_MSG_ADD_TRANSACTION_DETAILS =
    'There was an error adding transaction details, please try again';
  static readonly ERROR_MSG_NO_TRANSACTION =
    'There are no transactions created for the payment';

  //card details
  static readonly ERROR_MSG_NO_CARD_DETAILS =
    'There are no card details available for the payment';

  //General errors
  static readonly ERROR_MSG_FLEX_TOKEN_KEYS =
    'Failed to generate one time key for Flex token';
  static readonly ERROR_MSG_COMMERCETOOLS_CONNECT =
    'There was an error connecting to Commercetools';
  static readonly ERROR_MSG_SERVICE_PROCESS = 'Unable to process your payment';
  static readonly ERROR_MSG_CUSTOMER_DETAILS =
    'Unable to feth customer details';
  static readonly ERROR_MSG_EMPTY_CUSTOM_FIELDS =
    'There was an error processing your request';

  //service errors
  static readonly ERROR_MSG_CAPTURE_FAILURE =
    'Cannot process the capture as there are no transaction id available';
  static readonly ERROR_MSG_CAPTURE_SERVICE =
    'Error in triggering capture service, please try again';
  static readonly ERROR_MSG_REFUND_FAILURE =
    'Cannot process refund as there are no transaction id available';
  static readonly ERROR_MSG_REFUND_SERVICE =
    'Error in triggering refund service, please try again';
  static readonly ERROR_MSG_REFUND_GREATER_THAN_ZERO =
    'Refund amount should be greater than zero';
  static readonly ERROR_MSG_REFUND_EXCEEDS_CAPTURE_AMOUNT =
    'Cannot perform refund as amount exceeds captured amount';
  static readonly ERROR_MSG_REVERSAL_FAILURE =
    'Cannot process authorization reversal as there are no transaction id available';
  static readonly ERROR_MSG_REVERSAL_SERVICE =
    'Error in triggering authorization reversal service';
  static readonly ERROR_MSG_NO_CONVERSION_DETAILS =
    'Conversion details not found';
  static readonly ERROR_MSG_ENABLE_DECISION_SYNC = 'Please enable DecisionSync';
  static readonly ERROR_MSG_TOKEN_UPDATE = 'Failed to update card tokens';

  //invalid error
  static readonly ERROR_MSG_INVALID_OPERATION =
    'Cannot process this payment due to invalid operation';
  static readonly ERROR_MSG_INVALID_INPUT =
    'Cannot process this payment due to invalid input';
}
