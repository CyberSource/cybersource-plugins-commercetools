export abstract class Constants {

  //Cybersource reason codes
  static readonly PAYMENT_GATEWAY_SUCCESS_REASON_CODE = '100';
  static readonly PAYMENT_GATEWAY_ERROR_REASON_CODE = '480';
  static readonly PAYMENT_GATEWAY_FAILURE_REASON_CODE = '481';

  //Payments data
  static readonly PAYMENT_GATEWAY_TEST_ENVIRONMENT = 'apitest.visaacceptance.com';

  static readonly PAYMENT_GATEWAY_PRODUCTION_ENVIRONMENT = 'api.visaacceptance.com';
  static readonly PAYMENT_GATEWAY_PUBLIC_KEY_VERIFICATION = '/flex/v2/public-keys/';
  static readonly TEST_ENVIRONMENT = 'TEST';
  static readonly LIVE_ENVIRONMENT = 'PRODUCTION';
  static readonly PAYMENT_GATEWAY_APPLE_PAY_DESCRIPTOR = 'RklEPUVNVi5QQVlNRU5ULkFQSQ==';
  static readonly PAYMENT_GATEWAY_APPLE_PAY_INITIATIVE = 'web';
  static readonly PAYMENT_GATEWAY_APPLE_PAY_PAYMENT_SOLUTION = '001';
  static readonly PAYMENT_GATEWAY_AUTHENTICATION_TYPE = 'jwt';

  static readonly PAYMENT_GATEWAY_JWT_KEY_TYPE = 'SHARED_SECRET';

  static readonly PAYMENT_GATEWAY_CLICK_TO_PAY_PAYMENT_SOLUTION = 'visaCheckout';
  static readonly PAYMENT_GATEWAY_CLICK_TO_PAY_UC_PAYMENT_SOLUTION = '027';
  static readonly PAYMENT_GATEWAY_CLIENT_REFERENCE_CODE = 'clientReferenceInformation.code:';
  static readonly PAYMENT_GATEWAY_CONSUMER_AUTHENTICATION = 'CONSUMER_AUTHENTICATION';
  static readonly PAYMENT_GATEWAY_DECISION_SKIP = 'DECISION_SKIP';
  static readonly PAYMENT_GATEWAY_E_CHECK_PAYMENT_TYPE = 'CHECK';
  static readonly PAYMENT_GATEWAY_E_CHECK_UC_PAYMENT_TYPE = 'CHECK';
  static readonly PAYMENT_GATEWAY_ENCRYPTION_TYPE = 'RsaOaep';
  static readonly PAYMENT_GATEWAY_GOOGLE_PAY_PAYMENT_SOLUTION = '012';
  static readonly PAYMENT_GATEWAY_PARTNER_SOLUTION_ID = 'oo6h28vu';
  static readonly PAYMENT_GATEWAY_PAYER_AUTH_CHALLENGE_CODE = '04';

  static readonly PAYMENT_GATEWAY_TOKEN_ACTION_TYPES: string[] = ['customer', 'paymentInstrument', 'instrumentIdentifier'];
  static readonly PAYMENT_GATEWAY_TOKEN_ACTION_TYPES_CUSTOMER_EXISTS: string[] = ['paymentInstrument', 'instrumentIdentifier'];

  static readonly PAYMENT_GATEWAY_TOKEN_CREATE = 'TOKEN_CREATE';
  static readonly PAYMENT_GATEWAY_ACS_WINDOW_SIZE = '01';
  static readonly PAYMENT_GATEWAY_WEBHOOK_PORT = '443';
  static readonly PAYMENT_GATEWAY_VALIDATE_CONSUMER_AUTHENTICATION = 'VALIDATE_CONSUMER_AUTHENTICATION';
  static readonly PAYMENT_GATEWAY_WEBHOOK_ENDPOINT = '/netTokenNotification';
  static readonly PAYMENT_GATEWAY_FRAUD_WEBHOOK_ENDPOINT = '/fraudNotification';
  static readonly PAYMENT_GATEWAY_PRODUCT_ID = 'ctNetworkTokenSubscription';
  static readonly PAYMENT_GATEWAY_NETWORK_TOKEN_EVENT_TYPE = 'tms.networktoken.updated';
  static readonly PAYMENT_GATEWAY_FRAUD_PRODUCT_ID = 'decisionManager';
  static readonly PAYMENT_GATEWAY_FRAUD_MANAGEMENT_ESSENTIALS_PRODUCT_ID = 'fraudManagementEssentials';
  static readonly PAYMENT_GATEWAY_FRAUD_DM_EVENT_TYPE = 'risk.profile.decision.reject';
  static readonly PAYMENT_GATEWAY_FRAUD_REVIEW_EVENT_TYPES = ['risk.casemanagement.decision.accept', 'risk.casemanagement.decision.reject'];

  static readonly API_STATUS_SETTLE_INITIATED = 'SETTLE_INITIATED';
  static readonly API_STATUS_FAILED = 'FAILED';
  static readonly API_STATUS_CANCELLED = 'CANCELLED';

  static readonly FRAUD_REVIEW_ACCEPT_EVENT = 'risk.casemanagement.decision.accept';
  static readonly FRAUD_REVIEW_REJECT_EVENT = 'risk.casemanagement.decision.reject';
  static readonly FRAUD_DM_REJECT_EVENT = 'risk.profile.decision.reject';
  static readonly UC_ORDER_TRANSACTION_RESULT_EVENT = 'uc.orders.transactionresults';
  static readonly PAYMENT_GATEWAY_UNIFIED_CHECKOUT_PRODUCT_ID = 'unifiedCheckout';
  static readonly PAYMENT_GATEWAY_APPLICATION_NAME = 'Commercetools(REST)';
  static readonly PAYMENT_GATEWAY_APPLICATION_VERSION = '3.0.0';
  static readonly PAYMENT_GATEWAY_AP_SESSIONS = 'AP_SESSIONS';
  static readonly PAYMENT_GATEWAY_AP_STATUS = 'AP_STATUS';
  static readonly PAYMENT_GATEWAY_AP_ORDER = 'AP_ORDER';
  static readonly PAYMENT_GATEWAY_AP_AUTH = 'AP_AUTH';
  static readonly PAYMENT_GATEWAY_AP_SALE = 'AP_SALE';
  static readonly PAYMENT_GATEWAY_AP_CAPTURE = 'AP_CAPTURE';
  static readonly PAYMENT_GATEWAY_AP_REFUND = 'AP_REFUND';
  static readonly PAYMENT_GATEWAY_AP_REVERSAL = 'AP_AUTH_REVERSAL';

  //Payment status codes
  static readonly HTTP_CODE_ZERO = 0;
  static readonly HTTP_OK_STATUS_CODE = 200;
  static readonly HTTP_SUCCESS_STATUS_CODE = 201;
  static readonly HTTP_SUCCESS_NO_CONTENT_STATUS_CODE = 204;
  static readonly HTTP_REDIRECT_STATUS_CODE = 302;
  static readonly HTTP_BAD_REQUEST_STATUS_CODE = 400;
  static readonly HTTP_UNAUTHORIZED_STATUS_CODE = 401;
  static readonly HTTP_NOT_FOUND_STATUS_CODE = 404;
  static readonly HTTP_GONE_STATUS_CODE = 410;
  static readonly HTTP_SERVER_ERROR_STATUS_CODE = 500;

  //Content types
  static readonly CONTENT_TYPE_JSON = 'application/json';
  static readonly CONTENT_TYPE_TEXT_HTML = 'text/html';
  static readonly CONTENT_TYPE_TEXT_PLAIN = 'text/plain';

  //Payment response
  static readonly API_STATUS_AUTHORIZED = 'AUTHORIZED';
  static readonly API_STATUS_REVIEW = 'REVIEW';
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
  static readonly API_STATUS_AUTH_REVERSED = 'AUTH_REVERSED';
  static readonly API_STATUS_SETTLED = 'SETTLED';
  static readonly API_STATUS_REFUNDED = 'REFUNDED';
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
  static readonly REGEX_TWO_LETTER_LOCALE = /^[a-zA-Z]{2}$/;
  static readonly STRING_FULL_COLON = ':';
  static readonly STRING_HYPHEN = ' - ';
  static readonly STATIC_FILE_REGEX = /\.(css|js|png|jpg|jpeg|gif|ico)$/;

  //Payment methods
  static readonly CREDIT_CARD = 'creditCard';
  static readonly CC_PAYER_AUTHENTICATION = 'creditCardWithPayerAuthentication';
  static readonly CLICK_TO_PAY = 'clickToPay';
  static readonly APPLE_PAY = 'applePay';
  static readonly ECHECK = 'eCheck';
  static readonly GOOGLE_PAY = 'googlePay';
  static readonly EWALLET = 'EWALLET';
  static readonly PAYPAL = 'payPal';

  //Strings
  static readonly STRING_AWS = 'aws';
  static readonly STRING_AZURE = 'azure';
  static readonly STRING_FILE_NAME = '_KEY_FILE_NAME';
  static readonly STRING_FILE_URL = '_KEY_FILE_URL'
  static readonly STRING_KEY_PASS = '_KEY_PASS';
  static readonly STRING_KEY_ALIAS = '_KEY_ALIAS';
  static readonly STRING_REQUEST_MLE_PUBLIC_CERT_FILE = '_REQUEST_MLE_PUBLIC_CERT_FILE';
  static readonly STRING_REQUEST_MLE_PUBLIC_CERT_URL = '_REQUEST_MLE_PUBLIC_CERT_URL';
  // Environment variable name suffix, not a credential value.
  static readonly ENV_SUFFIX_REQUEST_MLE_P12_SECRET = '_REQUEST_MLE_P12_PASSWORD'; //checkmarx fix
  static readonly STRING_RESPONSE_MLE_PRIVATE_KEY_FILE = '_RESPONSE_MLE_PRIVATE_KEY_FILE';
  static readonly STRING_RESPONSE_MLE_PRIVATE_KEY_URL = '_RESPONSE_MLE_PRIVATE_KEY_URL';
  static readonly STRING_RESPONSE_MLE_PRIVATE_KEY_PASSWORD = '_RESPONSE_MLE_PRIVATE_KEY_PASSWORD';
  static readonly STRING_RESPONSE_MLE_KID = '_RESPONSE_MLE_KID';
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
  static readonly STRING_SESSIONS = 'session';
  static readonly STRING_STATUS = 'status';
  static readonly STRING_ORDER = 'order';
  static readonly STRING_CREATED = 'CREATED';
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
  static readonly STRING_AUTH_REVERSAL_LOOKUP_QUERY = 'submitTimeUtc:[NOW/DAY-30DAY TO NOW/HOUR+1HOUR}';
  static readonly STRING_SYNC_REFUND_NAME = 'ics_credit';
  static readonly STRING_SYNC_SORT = 'submitTimeUtc:desc';
  static readonly STRING_TRANSACTIONS = 'transactions';
  static readonly STRING_TRUE = 'true';
  static readonly CACHE_CERTIFICATE_FROM_P12_FILE = 'certificateFromP12File';
  static readonly CACHE_CERTIFICATE_LAST_MODIFIED_TIMESTAMP = 'certificateLastModifideTimeStamp';
  static readonly CACHE_PEM_CERTIFICATE_FROM_FILE = 'certificateFromPemFile';
  static readonly CACHE_PEM_CERTIFICATE_LAST_MODIFIED_TIMESTAMP = 'certificatePemLastModifideTimeStamp';
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
  static readonly CERTIFICATE_PATH = '../certificates';
  static readonly STRING_TEST = 'test';
  static readonly STRING_GOOGLE_PAY = 'googlePay';
  static readonly STRING_VISA = 'visa';
  static readonly STRING_GCP = 'gcp';

  static readonly ENCODING_BASE_SIXTY_FOUR = 'base64';
  static readonly ENCODING_SHA_TWO_FIFTY_SIX = 'sha256';
  static readonly HEADER_ENCRYPTION_ALGORITHM = 'aes-256-gcm';
  static readonly HEX = 'hex';
  static readonly JWT_AUTHENTICATION = 'jwt';

  static readonly LOG_DEBUG = 'debug';
  static readonly LOG_ERROR = 'error';
  static readonly LOG_INFO = 'info';
  static readonly LOG_WARN = 'warn';
  static readonly UNICODE_ENCODING_SYSTEM = 'utf8';
  static readonly VALIDATION = 'validation';
  static readonly STRING_FULL = 'FULL';
  static readonly UNIFIED_CHECKOUT_CAPTURE_CONTEXT_CLIENT_VERSION = '0.19';
  static readonly UNIFIED_CHECKOUT_SESSION_CLIENT_VERSION = '1.0';
  static readonly FLEX_MICROFORM_CLIENT_VERSION = 'v2';
  static readonly UC_SESSION_ENDPOINT = '/uc/v1/sessions';

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
  static readonly ISV_TOKEN_ACTION = 'isv_tokenAction';
  static readonly ISV_TOKEN_ACTION_DELETE = 'delete';
  static readonly ISV_TOKEN_ACTION_UPDATE = 'update';
  static readonly ADD_TRANSACTION = 'addTransaction';
  static readonly ADD_FIELD_DEFINITION = 'addFieldDefinition'
  static readonly CHANGE_TRANSACTION_STATE = 'changeTransactionState';
  static readonly CHANGE_TRANSACTION_INTERACTION_ID = 'changeTransactionInteractionId';
  static readonly INVALID_INPUT = 'InvalidInput';
  static readonly ISV_ADDRESS_ID = 'isv_addressId';
  static readonly ISV_TRANSACTION_DATA = 'isv_transaction_data';
  static readonly ISV_CARD_NEW_EXPIRY_MONTH = 'isv_cardNewExpiryMonth';
  static readonly ISV_CARD_NEW_EXPIRY_YEAR = 'isv_cardNewExpiryYear';
  static readonly ISV_FAILED_TOKENS = 'isv_failedTokens';
  static readonly ISV_METADATA = 'isv_metadata';
  static readonly ISV_TOKEN = 'isv_token';
  static readonly ISV_UC_ALLOWED_PAYMENT_TYPES = 'isv_ucAllowedPaymentTypes';
  static readonly ISV_UC_BILLING_TYPE = 'isv_ucBillingType';
  static readonly ISV_UC_TARGET_ORIGINS = 'isv_ucTargetOrigins';
  static readonly ISV_UC_SHOW_ACCEPTED_NETWORK_ICONS = 'isv_ucShowAcceptedNetworkIcons';
  static readonly ISV_PAYMENTS_CUSTOMER_TOKENS = 'isv_payments_customer_tokens';
  static readonly ISV_TOKENS = 'isv_tokens';
  static readonly SET_CUSTOM_FIELD = 'setCustomField';
  static readonly SET_CUSTOM_TYPE = 'setCustomType';
  static readonly SET_TRANSACTION_CUSTOM_TYPE = 'setTransactionCustomType';
  static readonly TYPE_ID_TYPE = 'type';
  static readonly UC_ADDRESS = 'UCAddress';
  static readonly ISV_CUSTOMER_ID = 'isv_customerId';
  static readonly ISV_ENABLED_MOTO = 'isv_enabledMoto';

  //  API Endpoints
  static readonly PAYMENT_CREATE_DESTINATION_URL = '/api/extension/payment/create';
  static readonly PAYMENT_UPDATE_DESTINATION_URL = '/api/extension/payment/update';
  static readonly CUSTOMER_UPDATE_DESTINATION_URL = '/api/extension/customer/update';
  static readonly CAPTURE_CONTEXT_DESTINATION_URL = '/captureContext';
  static readonly CHECKOUT_SESSION_DESTINATION_URL = '/checkoutSession';
  static readonly REFRESH_SAVED_TOKENS_DESTINATION_URL = '/refreshSavedTokens';
  static readonly EXTENSION_SERVICE_END_POINTS = ['/capture', '/refund', '/refreshStatus', '/authReversal', '/orders', '/orderData', '/paymentData', '/paymentDetails', '/decisionSync', '/sync', '/configureExtension', '/generateHeader', '/testConnection', '/favicon.ico'];
  static readonly PAYER_AUTH_RETURN_URL = '/payerAuthReturnUrl';

  static readonly WHITE_LIST_ENDPOINTS = ['/api/extension/payment/create',
    '/api/extension/payment/update', '/api/extension/customer/update', '/netTokenNotification', '/fraudNotification', '/captureContext', '/checkoutSession', '/refreshSavedTokens', '/orders', '/orderData',
    '/capture', '/refund', '/refreshStatus', '/authReversal', '/paymentDetails', '/paymentData', '/payerAuthReturnUrl',
    '/sync', '/decisionSync', '/configureExtension', '/generateHeader', '/favicon.ico', '/testConnection', '/payPalReturnUrl', '/payPalCancelUrl'];


  //HTMLContent
  static readonly HTML_PREFIX =
    '<!DOCTYPE html> <html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Commercetools Cybersource Extension</title><script type="text/javascript">if (self === top) {var antiClickjack = document.getElementById("antiClickjack");if (antiClickjack) {antiClickjack.parentNode.removeChild(antiClickjack);}} else {top.location = encodeURI(self.location);}</script><link rel="stylesheet" href="css/styles.css" /></head><body>';
  static readonly HTML_SUFFIX = '</body></html>';

  //Function Arrays
  static readonly UPDATE_AMOUNT_RESPONSE_FUNCTIONS = ['FuncGetCaptureResponse', 'FuncGetRefundData', 'FuncGetAuthReversalResponse'];

  static readonly GET_CONFIG_BY_PAYMENT_OBJECT_FUNCTIONS = ['FuncGetTransactionData', 'FuncGetAuthReversalResponse', 'FuncGetAuthorizationResponse', 'FuncGetCaptureResponse', 'FuncGetRefundData', 'FuncGetSessionResponse', 'FuncGetTransactionStatus', 'FuncCreateOrderResponse'];
  static readonly GET_CONFIG_BY_MID_CREDENTIALS_FUNCTIONS = ['FuncGetTransactionSearchResponse', 'FuncGetConversionDetails', 'FuncGetTransientTokenDataResponse', 'FuncWebhookSubscriptionResponse', 'FuncGetKeyGenerationResponse', 'FuncGetCreateWebhookSubscriptionResponse', 'FuncDeleteWebhookSubscriptionResponse', 'FuncGetTransactionData'];

  static readonly GET_PROCESSING_INFORMATION_FUNCTIONS = ['FuncGetAuthorizationResponse', 'FuncGetAddTokenResponse', 'FuncGetSessionResponse', 'FuncGetTransactionStatus', 'FuncCreateOrderResponse', 'FuncGetCaptureResponse', 'FuncGetRefundData', 'FuncGetAuthReversalResponse'];
  static readonly MAP_PAYMENT_INFORMATION_FUNCTIONS = ['FuncGetAuthorizationResponse', 'FuncGetRefundData', 'FuncGetSessionResponse', 'FuncGetTransactionStatus', 'FuncCreateOrderResponse', 'FuncGetCaptureResponse', 'FuncGetAuthReversalResponse'];
  static readonly MLE_UNSUPPORTED_FUNCTIONS = ['FuncGenerateCaptureContext', 'FuncCreateCheckoutSession', 'FuncGetTransientTokenDataResponse'];

  //default cards
  static readonly UC_ALLOWED_CARD_NETWORKS = ['VISA'];
  static readonly FLEX_MICROFORM_ALLOWED_CARDS = ['VISA'];
  static readonly REFRESH_STATUS_TRANSACTION_SCAN_MAX = 100;

  //Datatypes
  static readonly STR_ARRAY = 'array';
  static readonly STR_STRING = 'string';
  static readonly STR_OBJECT = 'object';
  static readonly STR_NUMBER = 'number';

  //Port
  static readonly DEFAULT_PORT = 3000;

  //Limits
  static readonly PAYMENT_GATEWAY_TRANSACTION_SUMMARIES_MAX_RETRY = 3;
  static readonly PAYMENT_GATEWAY_AUTH_REVERSAL_LOOKUP_MAX_RETRY = 3;
  static readonly PAYMENT_GATEWAY_AUTH_REVERSAL_LOOKUP_DELAY = 2000;
  static readonly MAX_REQUESTS = 10;
  static readonly RATE_LIMIT_TIME_WINDOW = 60000; //1 minute in ms

  //Locale and Country Validation Messages
  static readonly LOCALE_EMPTY_ERROR = 'LOCALE IS EMPTY';
  static readonly COUNTRY_REQUIRED_FOR_PAYMENT_WARNING = 'Country is required for payment.';
  static readonly COUNTRY_REQUIRED_FOR_LOCALE_FORMATTING_WARNING = 'Country is required for locale formatting.';
  static readonly SAVED_CARD_NO_PAYMENT_INSTRUMENT_WARNING = 'isSavedCard=true but no paymentInstrumentId was provided in the frontend payload';

}