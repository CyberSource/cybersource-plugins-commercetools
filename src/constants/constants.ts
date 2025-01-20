export abstract class Constants {

  //Cybersource reason codes
  static readonly PAYMENT_GATEWAY_SUCCESS_REASON_CODE = '100';
  static readonly PAYMENT_GATEWAY_ERROR_REASON_CODE = '480';
  static readonly PAYMENT_GATEWAY_FAILURE_REASON_CODE = '481';

  //Payments data
  static readonly PAYMENT_GATEWAY_TEST_ENVIRONMENT = 'apitest.cybersource.com';
  static readonly PAYMENT_GATEWAY_PRODUCTION_ENVIRONMENT = 'api.cybersource.com';
  static readonly PAYMENT_GATEWAY_PUBLIC_KEY_VERIFICATION = '/flex/v2/public-keys/';
  static readonly TEST_ENVIRONMENT = 'TEST';
  static readonly LIVE_ENVIRONMENT = 'PRODUCTION';
  static readonly PAYMENT_GATEWAY_APPLE_PAY_DESCRIPTOR = 'RklEPUVNVi5QQVlNRU5ULkFQSQ==';
  static readonly PAYMENT_GATEWAY_APPLE_PAY_INITIATIVE = 'web';
  static readonly PAYMENT_GATEWAY_APPLE_PAY_PAYMENT_SOLUTION = '001';
  static readonly PAYMENT_GATEWAY_AUTHENTICATION_TYPE = 'http_signature';
  static readonly PAYMENT_GATEWAY_CLICK_TO_PAY_PAYMENT_SOLUTION = 'visaCheckout';
  static readonly PAYMENT_GATEWAY_CLICK_TO_PAY_UC_PAYMENT_SOLUTION = '027';
  static readonly PAYMENT_GATEWAY_CLIENT_REFERENCE_CODE = 'clientReferenceInformation.code:';
  static readonly PAYMENT_GATEWAY_CONSUMER_AUTHENTICATION = 'CONSUMER_AUTHENTICATION';
  static readonly PAYMENT_GATEWAY_DECISION_SKIP = 'DECISION_SKIP';
  static readonly PAYMENT_GATEWAY_E_CHECK_PAYMENT_TYPE = 'CHECK';
  static readonly PAYMENT_GATEWAY_ENCRYPTION_TYPE = 'RsaOaep';
  static readonly PAYMENT_GATEWAY_GOOGLE_PAY_PAYMENT_SOLUTION = '012';
  static readonly PAYMENT_GATEWAY_PARTNER_SOLUTION_ID = 'FAV669SU';
  static readonly PAYMENT_GATEWAY_PAYER_AUTH_CHALLENGE_CODE = '04';
  static readonly PAYMENT_GATEWAY_TOKEN_ACTION_TYPES = 'customer,paymentInstrument,instrumentIdentifier';
  static readonly PAYMENT_GATEWAY_TOKEN_ACTION_TYPES_CUSTOMER_EXISTS = 'paymentInstrument,instrumentIdentifier';
  static readonly PAYMENT_GATEWAY_TOKEN_CREATE = 'TOKEN_CREATE';
  static readonly PAYMENT_GATEWAY_ACS_WINDOW_SIZE = '01';
  static readonly PAYMENT_GATEWAY_WEBHOOK_PORT = '443';
  static readonly PAYMENT_GATEWAY_VALIDATE_CONSUMER_AUTHENTICATION = 'VALIDATE_CONSUMER_AUTHENTICATION';
  static readonly PAYMENT_GATEWAY_WEBHOOK_ENDPOINT = '/netTokenNotification';
  static readonly PAYMENT_GATEWAY_PRODUCT_ID = 'ctNetworkTokenSubscription';
  static readonly PAYMENT_GATEWAY_NETWORK_TOKEN_EVENT_TYPE = 'tms.networktoken.updated';
  static readonly PAYMENT_GATEWAY_APPLICATION_NAME = 'CommerceTools(REST)';
  static readonly PAYMENT_GATEWAY_APPLICATION_VERSION = '25.1.0';

  //Payment status codes
  static readonly HTTP_OK_STATUS_CODE = 200;
  static readonly HTTP_SUCCESS_STATUS_CODE = 201;
  static readonly HTTP_REDIRECT_STATUS_CODE = 302;
  static readonly HTTP_SUCCESS_NO_CONTENT_STATUS_CODE = 204;
  static readonly HTTP_BAD_REQUEST_STATUS_CODE = 400;
  static readonly HTTP_UNAUTHORIZED_STATUS_CODE = 401;
  static readonly HTTP_NOT_FOUND_STATUS_CODE = 404;
  static readonly HTTP_GONE_STATUS_CODE = 410;
  static readonly HTTP_SERVER_ERROR_STATUS_CODE = 500;

  //Payment response
  static readonly API_STATUS_AUTHORIZED = 'AUTHORIZED';
  static readonly API_STATUS_AUTHORIZED_RISK_DECLINED = 'AUTHORIZED_RISK_DECLINED';
  static readonly API_STATUS_COMPLETED = 'COMPLETED';
  static readonly API_STATUS_CUSTOMER_AUTHENTICATION_REQUIRED = 'CUSTOMER_AUTHENTICATION_REQUIRED';
  static readonly API_STATUS_DECLINED = 'DECLINED';
  static readonly API_STATUS_INVALID_REQUEST = 'INVALID_REQUEST';
  static readonly API_STATUS_PENDING = 'PENDING';
  static readonly API_STATUS_AUTHORIZED_PENDING_REVIEW = 'AUTHORIZED_PENDING_REVIEW';
  static readonly API_STATUS_PENDING_AUTHENTICATION = 'PENDING_AUTHENTICATION';
  static readonly API_STATUS_PENDING_REVIEW = 'PENDING_REVIEW';
  static readonly API_STATUS_REVERSED = 'REVERSED';
  static readonly HTTP_STATUS_DECISION_ACCEPT = 'ACCEPT';
  static readonly HTTP_STATUS_DECISION_REJECT = 'REJECT';
  static readonly APPLICATION_RCODE = '1';
  static readonly APPLICATION_RFLAG = 'SOK';
  //Regex
  static readonly CLICK_TO_PAY_CARD_MASK = 'XXXXXX';
  static readonly FORMAT_PAYMENT_ID_REGEX = /\s+/g;
  static readonly REGEX_COMMA = ',';
  static readonly REGEX_DOUBLE_SLASH = '//';
  static readonly REGEX_SINGLE_SLASH = '/';
  static readonly REGEX_DOT = '.';
  static readonly REGEX_HYPHEN = '-';
  static readonly REGEX_UNDERSCORE = '_';
  static readonly STRING_FULL_COLON = ':';
  static readonly STRING_HYPHEN = ' - ';

  //Payment methods
  static readonly CREDIT_CARD = 'creditCard';
  static readonly CC_PAYER_AUTHENTICATION = 'creditCardWithPayerAuthentication';
  static readonly CLICK_TO_PAY = 'clickToPay';
  static readonly APPLE_PAY = 'applePay';
  static readonly ECHECK = 'eCheck';
  static readonly GOOGLE_PAY = 'googlePay';

  //Strings
  static readonly STRING_AWS = 'aws';
  static readonly STRING_AZURE = 'azure';
  static readonly STRING_SECRET_KEY = '_SECRET_KEY';
  static readonly ACTIVE_CART_STATE = 'cartState="Active"';
  static readonly ANONYMOUS_ID = 'anonymousId';
  static readonly AUTHENTICATION_SCHEME = 'Basic';
  static readonly CUSTOMER_ID = 'customerId';
  static readonly DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss[Z]';
  static readonly DESC_ORDER = 'desc';
  static readonly LAST_MODIFIED_AT = 'lastModifiedAt';
  static readonly SHIPPING_AND_HANDLING = 'shipping_and_handling';
  static readonly SHIPPING_MODE_MULTIPLE = 'Multiple';
  static readonly STRING_AND = ' AND ';
  static readonly STRING_CARD = 'card';
  static readonly STATUS_CODE = 'statusCode';
  static readonly STRING_CUSTOM = 'custom';
  static readonly STRING_DUPLICATE_FIELD = 'DuplicateField';
  static readonly STRING_ENROLL_CHECK = 'enrollCheck';
  static readonly STRING_FALSE = 'false';
  static readonly STRING_RESPONSE = 'response';
  static readonly STRING_RESPONSE_STATUS = 'status';
  static readonly STRING_SYNC_AUTH_NAME = 'ics_auth';
  static readonly STRING_SYNC_AUTH_REVERSAL_NAME = 'ics_auth_reversal';
  static readonly STRING_SYNC_CAPTURE_NAME = 'ics_bill';
  static readonly STRING_SYNC_DECISION_NAME = 'ics_decision';
  static readonly STRING_SYNC_ECHECK_CREDIT_NAME = 'ics_ecp_credit';
  static readonly STRING_SYNC_ECHECK_DEBIT_NAME = 'ics_ecp_debit';
  static readonly STRING_SYNC_QUERY = 'submitTimeUtc:[NOW/DAY-1DAY TO NOW/HOUR+1HOUR}';
  static readonly STRING_SYNC_REFUND_NAME = 'ics_credit';
  static readonly STRING_SYNC_SORT = 'submitTimeUtc:desc';
  static readonly STRING_TRANSACTIONS = 'transactions';
  static readonly STRING_TRUE = 'true';
  static readonly STRING_DEFAULT = 'default';
  static readonly CART_ID = 'cartId';
  static readonly PAYMENT_ID = 'paymentId';
  static readonly INTERACTION_ID = 'interactionId';
  static readonly TRANSACTION_ID = 'transactionId';
  static readonly BASE_SIXTY_FOUR_ENCODING = 'Base64';
  static readonly CUSTOM_OBJECT_CONTAINER = 'ctWebHookSubscription';
  static readonly CUSTOM_OBJECT_KEY = 'webHookSubscription';
  static readonly STRING_ACTIVE = 'ACTIVE';
  static readonly NETWORK_TOKEN_EVENT = 'tms.networktoken.updated';
  static readonly ADDITIONAL_CUSTOM_TYPE_FILE_PATH = 'src/resources/isv_additonal_custom_type.json';

  static readonly ENCODING_BASE_SIXTY_FOUR = 'base64';
  static readonly ENCODING_SHA_TWO_FIFTY_SIX = 'sha256';
  static readonly HEADER_ENCRYPTION_ALGORITHM = 'aes-256-gcm';
  static readonly HEX = 'hex';
  static readonly LOG_DEBUG = 'debug';
  static readonly LOG_ERROR = 'error';
  static readonly LOG_INFO = 'info';
  static readonly LOG_WARN = 'warn';
  static readonly UNICODE_ENCODING_SYSTEM = 'utf8';
  static readonly VALIDATION = 'validation';
  static readonly STRING_FULL = 'FULL';
  static readonly UNIFIED_CHECKOUT_CAPTURE_CONTEXT_CLIENT_VERSION = '0.19';
  static readonly FLEX_MICROFORM_CLIENT_VERSION = 'v2';

  //CT transaction type
  static readonly CT_TRANSACTION_TYPE_AUTHORIZATION = 'Authorization';
  static readonly CT_TRANSACTION_TYPE_CANCEL_AUTHORIZATION = 'CancelAuthorization';
  static readonly CT_TRANSACTION_TYPE_CHARGE = 'Charge';
  static readonly CT_TRANSACTION_TYPE_REFUND = 'Refund';

  //CT transaction state
  static readonly CT_TRANSACTION_STATE_FAILURE = 'Failure';
  static readonly CT_TRANSACTION_STATE_INITIAL = 'Initial';
  static readonly CT_TRANSACTION_STATE_PENDING = 'Pending';
  static readonly CT_TRANSACTION_STATE_SUCCESS = 'Success';

  //CT custom fields
  static readonly ADD_INTERFACE_INTERACTION = 'addInterfaceInteraction';
  static readonly ADD_TRANSACTION = 'addTransaction';
  static readonly ADD_FIELD_DEFINITION = 'addFieldDefinition'
  static readonly CHANGE_TRANSACTION_STATE = 'changeTransactionState';
  static readonly CHANGE_TRANSACTION_INTERACTION_ID = 'changeTransactionInteractionId';
  static readonly INVALID_INPUT = 'InvalidInput';
  static readonly ISV_ADDRESS_ID = 'isv_addressId';
  static readonly ISV_TRANSACTION_DATA = 'isv_transaction_data';
  static readonly ISV_TOKEN_ACTION = 'isv_tokenAction';
  static readonly ISV_CARD_NEW_EXPIRY_MONTH = 'isv_cardNewExpiryMonth';
  static readonly ISV_CARD_NEW_EXPIRY_YEAR = 'isv_cardNewExpiryYear';
  static readonly ISV_FAILED_TOKENS = 'isv_failedTokens';
  static readonly ISV_SECURITY_CODE = 'isv_securityCode';
  static readonly ISV_TOKEN = 'isv_token';
  static readonly ISV_PAYMENTS_CUSTOMER_TOKENS = 'isv_payments_customer_tokens';
  static readonly ISV_TOKENS = 'isv_tokens';
  static readonly SET_CUSTOM_FIELD = 'setCustomField';
  static readonly SET_CUSTOM_TYPE = 'setCustomType';
  static readonly SET_TRANSACTION_CUSTOM_TYPE = 'setTransactionCustomType';
  static readonly TYPE_ID_TYPE = 'type';
  static readonly UC_ADDRESS = 'UCAddress';
  static readonly ISV_CUSTOMER_ID = 'isv_customerId';

  //  API Endpoints
  static readonly PAYMENT_CREATE_DESTINATION_URL = '/api/extension/payment/create';
  static readonly PAYMENT_UPDATE_DESTINATION_URL = '/api/extension/payment/update';
  static readonly CUSTOMER_UPDATE_DESTINATION_URL = '/api/extension/customer/update';
  static readonly EXTENSION_SERVICE_END_POINTS = ['/capture', '/refund', '/authReversal', '/orders', '/orderData', '/paymentData', '/paymentDetails', '/decisionSync', '/sync', '/configureExtension', '/generateHeader', '/testConnection', '/favicon.ico'];
  static readonly PAYER_AUTH_RETURN_URL = '/payerAuthReturnUrl';
  static readonly WHITE_LIST_ENDPOINTS = ['/api/extension/payment/create', '/api/extension/payment/update',
    '/api/extension/customer/update', '/netTokenNotification', '/captureContext', '/orders', '/orderData',
    '/capture', '/refund', '/authReversal', '/paymentDetails', '/paymentData', '/payerAuthReturnUrl',
    '/sync', '/decisionSync', '/configureExtension', '/generateHeader', '/favicon.ico', '/testConnection'];

  //HTMLContent
  static readonly HTML_PREFIX =
    '<!DOCTYPE html> <html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Commercetools Cybersource Extension</title><script>if (top != self) {top.location = encodeURI(self.location);}</script><link rel="stylesheet" href="css/styles.css" /></head><body>';
  static readonly HTML_SUFFIX = '</body></html>';

  //Function Arrays
  static readonly UPDATE_AMOUNT_RESPONSE_FUNCTIONS = ['FuncGetCaptureResponse', 'FuncGetRefundData', 'FuncGetAuthReversalResponse'];
  static readonly GET_CONFIG_BY_PAYMENT_OBJECT_FUNCTIONS = ['FuncGetTransactionData', 'FuncGetFlexKeys', 'FuncGetPayerAuthSetupData', 'FuncGetAuthReversalResponse', 'FuncGetAuthorizationResponse', 'FuncGetCaptureResponse', 'FuncGetRefundData'];
  static readonly GET_CONFIG_BY_MID_CREDENTIALS_FUNCTIONS = ['FuncGetTransactionSearchResponse', 'FuncGetConversionDetails', 'FuncGetPublicKeys', 'FuncGetTransientTokenDataResponse', 'FuncWebhookSubscriptionResponse', 'FuncGetKeyGenerationResponse', 'FuncGetCreateWebhookSubscriptionResponse', 'FuncDeleteWebhookSubscriptionResponse', 'FuncGetTransactionData'];

  //default cards
  static readonly UC_ALLOWED_CARD_NETWORKS = ['VISA'];
  static readonly FLEX_MICROFORM_ALLOWED_CARDS = ['VISA'];

  //Datatypes
  static readonly STR_ARRAY = 'array';
  static readonly STR_STRING = 'string';
  static readonly STR_OBJECT = 'object';
  static readonly STR_NUMBER = 'number';

  //Port
  static readonly DEFAULT_PORT = 3000;

  //Limits
  static readonly PAYMENT_GATEWAY_TRANSACTION_SUMMARIES_MAX_RETRY = 3;
  static readonly MAX_REQUESTS = 10;
  static readonly RATE_LIMIT_TIME_WINDOW = 60000; //1 minute in ms
}