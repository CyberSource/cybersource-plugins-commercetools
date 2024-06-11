export abstract class Constants {
  //Constant values
  //Cybersource reason codes
  static readonly CYBS_SUCCESS_REASON_CODE = '100';
  static readonly CYBS_ERROR_REASON_CODE = '480';
  static readonly CYBS_FAILURE_REASON_CODE = '481';

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
  static readonly PAYMENT_GATEWAY_PARTNER_SOLUTION_ID = 'SWPVTQA0';
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

  //Payment status codes
  static readonly HTTP_OK_STATUS_CODE = 200;
  static readonly HTTP_SUCCESS_STATUS_CODE = 201;
  static readonly HTTP_REDIRECT_STATUS_CODE = 302;
  static readonly HTTP_SUCCESS_NO_CONTENT_STATUS_CODE = 204;
  static readonly HTTP_BAD_REQUEST_STATUS_CODE = 400;
  static readonly HTTP_UNAUTHORIZED_STATUS_CODE = 401;
  static readonly HTTP_NOT_FOUND_STATUS_CODE = 404;
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
  static readonly BASE_SIXTY_FOUR_ENCODING = 'Base64';
  static readonly CUSTOM_OBJECT_CONTAINER = 'ctWebHookSubscription';
  static readonly CUSTOM_OBJECT_KEY = 'webHookSubscription';
  static readonly STRING_ACTIVE = 'ACTIVE';

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
  static readonly CAPTURE_CONTEXT_CLIENT_VERSION = '0.15';
  static readonly FLEX_MICROFORM_CLIENT_VERSION = 'v2.0';

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
  static readonly CHANGE_TRANSACTION_INTERACTION_ID = 'changeTransactionInteractionId';
  static readonly INVALID_INPUT = 'InvalidInput';
  static readonly ISV_ADDRESS_ID = 'isv_addressId';
  static readonly ISV_FAILED_TOKENS = 'isv_failedTokens';
  static readonly ISV_SECURITY_CODE = 'isv_securityCode';
  static readonly ISV_TOKEN = 'isv_token';
  static readonly SET_CUSTOM_FIELD = 'setCustomField';
  static readonly TYPE_ID_TYPE = 'type';
  static readonly UC_ADDRESS = 'UCAddress';

  //Success messages
  static readonly SUCCESS_MSG_CAPTURE_SERVICE = 'Capture is completed successfully';
  static readonly SUCCESS_MSG_CARD_TOKENS_UPDATE = 'Successfully updated card tokens';
  static readonly SUCCESS_MSG_DECISION_SYNC_SERVICE = 'Successfully completed Decision sync';
  static readonly SUCCESS_MSG_REFUND_SERVICE = 'Refund is completed successfully';
  static readonly SUCCESS_MSG_REVERSAL_SERVICE = 'Authorization reversal is completed successfully';
  static readonly SUCCESS_MSG_SYNC_SERVICE = 'Successfully updated payment details';
  static readonly SUCCESS_MSG_EXTENSION_CREATION = 'Successfully executed the script';
  static readonly SUCCESS_MSG_UPDATE_CLICK_TO_PAY_CARD_DETAILS = 'Updated click to pay card details successfully';
  static readonly SUCCESS_MSG_UC_ADDRESS_DETAILS = 'Successfully updated cart address as the UC address';
  static readonly SUCCESS_MSG_UPDATED_CUSTOMER_TOKEN = 'Successfully updated customer token through webhooks API';
  static readonly SUCCESS_MSG_FAV_ICON = 'Resolving favicon.io';

  //Exception messages
  static readonly EXCEPTION_MSG_ADDING_CUSTOM_FIELD = 'An exception occurred while adding custom field';
  static readonly EXCEPTION_MSG_ADD_EXTENSION = 'An exception occurred while adding extension to Commercetools';
  static readonly EXCEPTION_MSG_ADD_TRANSACTION = 'An exception occurred while adding transaction to the payment';
  static readonly EXCEPTION_MSG_ALL_MID_DETAILS = 'An exception ocurred while retrieving multi-mid details';
  static readonly EXCEPTION_MSG_AUTHORIZING_PAYMENT = 'An exception occurred while authorizing the payment';
  static readonly EXCEPTION_MSG_ADDING_A_CARD = 'An exception occurred while adding a card token to customer';
  static readonly EXCEPTION_MSG_CART_UPDATE = 'An exception occurred while updating the cart';
  static readonly EXCEPTION_MSG_CART_DETAILS = 'An exception occurred while fetching cart details';
  static readonly EXCEPTION_MSG_COMMERCETOOLS_CONNECT = 'An exception occurred while connecting to Commercetools';
  static readonly EXCEPTION_MSG_CONVERSION_DETAILS = 'An exception occurred while fetching conversion details';
  static readonly EXCEPTION_MSG_CUSTOM_TYPE = 'An exception occurred while adding custom type to Commercetools';
  static readonly EXCEPTION_MSG_CUSTOMER_UPDATE_ADDRESS = 'An exception occurred while updating customer address';
  static readonly EXCEPTION_MSG_CUSTOMER_UPDATE = 'An exception occurred while updating card tokens to customer';
  static readonly EXCEPTION_MSG_DECISION_SYNC = 'An exception occurred while fetching conversion detail report';
  static readonly EXCEPTION_MSG_ENV_VARIABLE_NOT_SET = 'Please configure the mid credentials in env file';
  static readonly EXCEPTION_MSG_FETCH_PAYMENT_DETAILS = 'An exception occurred while fetching payment details';
  static readonly EXCEPTION_MSG_FETCH_ORDER_DETAILS = 'An exception occurred while fetching order details';
  static readonly EXCEPTION_MSG_FETCH_DISCOUNT_DETAILS = 'An exception occurred while fetching discount details';
  static readonly EXCEPTION_MSG_CHANGE_TRANSACTION_INTERACTION_ID = 'An exception occurred while changing the transaction interaction id';
  static readonly EXCEPTION_MSG_GET_MID_CREDENTIALS = 'An exception occurred while retrieving mid credentials';
  static readonly EXCEPTION_MERCHANT_KEY_ID_REQUIRED = 'MerchantKeyId is Mandatory';
  static readonly EXCEPTION_MERCHANT_SECRET_KEY_REQUIRED = 'MerchantseceretKey is Mandatory';
  static readonly EXCEPTION_MSG_PAYER_AUTH = 'An exception occurred while authenticating the payment';
  static readonly EXCEPTION_MSG_SERVICE_PROCESS = 'An exception occurred while processing your payment';
  static readonly EXCEPTION_MSG_SETUP_RESOURCES = 'An exception ocurred while creating the extensions and custom fields = ';
  static readonly EXCEPTION_MSG_SYNC_DETAILS = 'An exception occurred while fetching sync conversion details';
  static readonly EXCEPTION_MSG_TRANSACTION_SEARCH = 'An exception occurred while retrieving the transaction details';
  static readonly EXCEPTION_CREATE_PAYMENT_API = 'An exception occurred while creating a payment';
  static readonly EXCEPTION_UPDATE_PAYMENT_API = 'An exception occurred while updating a payment';
  static readonly EXCEPTION_UPDATE_CUSTOMER_API = 'An exception occurred while updating a Customer';

  //Error messages
  static readonly ERROR_MSG_ADD_TRANSACTION_DETAILS = 'There was an error while adding transaction details, please try again';
  static readonly ERROR_MSG_APPLICATION_DETAILS = 'Unable to fetch transaction application details';
  static readonly ERROR_MSG_APPLE_PAY_CERTIFICATES = 'Please provide certificates paths for Apple Pay in configuration file';
  static readonly ERROR_MSG_ACCESSING_CERTIFICATES = 'An error occurred while accessing ApplePay Certificates';
  static readonly ERROR_MSG_ENV_VARIABLES_NOT_FOUND = 'Missing configurations for merchant id ';
  static readonly ERROR_MSG_EMPTY_PAYMENT_DATA = 'There was an error while fetching payment details';
  static readonly ERROR_MSG_EMPTY_TRANSACTION_DETAILS = 'There was an error while fetching transaction details, please try again';
  static readonly ERROR_MSG_ENABLE_SYNC = 'Please enable Run sync';
  static readonly ERROR_MSG_CART_DETAILS = 'Unable to fetch cart details';
  static readonly ERROR_MSG_CAPTURE_FAILURE = 'Cannot process the capture as there are no transaction id available';
  static readonly ERROR_MSG_CAPTURE_SERVICE = 'Error in triggering capture service, please try again';
  static readonly ERROR_MSG_CANNOT_PROCESS = 'Unable to process your transaction, please try again';
  static readonly ERROR_MSG_CLICK_TO_PAY_DATA = 'There was an error while fetching click to pay data';
  static readonly ERROR_MSG_COMMERCETOOLS_CONNECT = 'There was an error connecting to Commercetools';
  static readonly ERROR_MSG_CREATE_CUSTOM_TYPE = 'There was an error creating custom type';
  static readonly ERROR_MSG_CUSTOMER_DETAILS = 'Unable to fetch customer details';
  static readonly ERROR_MSG_DISCOUNT_DETAILS = 'Unable to fetch discount details'
  static readonly ERROR_MSG_CUSTOMER_UPDATE = 'Unable to update the customer with customer address';
  static readonly ERROR_MSG_EMPTY_CART = 'There is no cart available for the payment';
  static readonly ERROR_MSG_EMPTY_CUSTOM_FIELDS = 'There was an error processing your request';
  static readonly ERROR_MSG_ENABLE_DECISION_SYNC = 'Please enable Decision sync';
  static readonly ERROR_MSG_ENABLE_DECISION_SYNC_MIDS = 'Please configure Decision sync mids';
  static readonly ERROR_MSG_CREATE_EXTENSION = 'There was an error while creating extension';
  static readonly ERROR_MSG_FETCH_TRANSACTIONS = 'Unable to fetch transactions details';
  static readonly ERROR_MSG_FLEX_TOKEN_KEYS = 'Failed to generate one time key for Flex token';
  static readonly ERROR_MSG_INVALID_CAPTURE_CONTEXT = 'Invalid capture context';
  static readonly ERROR_MSG_INVALID_CUSTOMER_INPUT = 'Cannot delete the token due to invalid input';
  static readonly ERROR_MSG_INVALID_AUTHENTICATION_CREDENTIALS = 'Invalid Authentication Credentials';
  static readonly ERROR_MSG_INVALID_OPERATION = 'Cannot process the payment due to invalid operation';
  static readonly ERROR_MSG_INVALID_INPUT = 'Cannot process the payment due to invalid input';
  static readonly ERROR_MSG_INVALID_REQUEST = 'Cannot process the request due to invalid input';
  static readonly ERROR_MSG_MISSING_AUTHORIZATION_HEADER = 'Missing Authorization Header';
  static readonly ERROR_MSG_MERCHANT_ID_NOT_FOUND = ' is not found. Please configure it in the env variables';
  static readonly ERROR_MSG_NO_CARD_DETAILS = 'There are no card details available for the payment';
  static readonly ERROR_MSG_NO_ORDER_DETAILS = 'Unable to retrieve order details, please try again';
  static readonly ERROR_MSG_NO_PAYMENT_METHODS = 'There are no payment method available for the payment';
  static readonly ERROR_MSG_NO_SYNC_DETAILS = 'There were no payment details found to update';
  static readonly ERROR_MSG_NO_TOKENS_UPDATE = 'There are no tokens to update';
  static readonly ERROR_MSG_NO_TOKENS_DELETE = 'There are no tokens to delete';
  static readonly ERROR_MSG_PAYMENT_DETAILS = 'Unable to fetch payment details';
  static readonly ERROR_MSG_PUBLIC_KEY_VERIFICATION = 'Failed to verify capture context';
  static readonly ERROR_MSG_INVALID_RATE_LIMITER_CONFIGURATIONS = 'Invalid configurations. Please configure the valid values for rate limiter in env file';
  static readonly ERROR_MSG_REFUND_EXCEEDS_CAPTURE_AMOUNT = 'Cannot perform refund as the entered amount exceeds captured amount';
  static readonly ERROR_MSG_REFUND_GREATER_THAN_ZERO = 'Refund amount should be greater than zero';
  static readonly ERROR_MSG_REFUND_SERVICE = 'Error in triggering refund service, please try again';
  static readonly ERROR_MSG_REFUND_AMOUNT = 'Refund amount must be a number and should be greater than zero';
  static readonly ERROR_MSG_RETRIEVE_PAYMENT_DETAILS = 'Unable to retrieve payment details';
  static readonly ERROR_MSG_REVERSAL_FAILURE = 'Cannot process authorization reversal as there are no transaction id available';
  static readonly ERROR_MSG_REVERSAL_SERVICE = 'Error in triggering authorization reversal service';
  static readonly ERROR_MSG_SERVICE_PROCESS = 'Unable to process your request';
  static readonly ERROR_MSG_SETUP_RESOURCES = 'Failed to create extensions and custom fields, please provide all the required data in env file';
  static readonly ERROR_MSG_SYNC_PAYMENT_DETAILS = 'An error occurred while trying to sync the payments details';
  static readonly ERROR_MSG_TOKEN_UPDATE = 'Failed to update card tokens';
  static readonly ERROR_MSG_UPDATE_CART = 'Unable to update the cart';
  static readonly ERROR_MSG_UPDATE_CUSTOM_TYPE = 'There was an error updating custom type';
  static readonly ERROR_MSG_UPDATE_CLICK_TO_PAY_DATA = 'Unable to update click to pay card details';
  static readonly ERROR_MSG_CAPTURE_AMOUNT = 'Capture amount must be a number and should be greater than zero';
  static readonly ERROR_MSG_CAPTURE_AMOUNT_GREATER_THAN_ZERO = 'Capture amount should be greater than zero';
  static readonly ERROR_MSG_CAPTURE_EXCEEDS_AUTHORIZED_AMOUNT = 'Cannot perform capture as the entered amount exceeds authorized amount';
  static readonly ERROR_MSG_RETRY_TRANSACTION_SEARCH = 'Missing transaction details';
  static readonly ERROR_MSG_UC_ADDRESS_DETAILS = 'Unable to update the address as the UC address';
  static readonly ERROR_MSG_CAPTURE_CONTEXT = 'Failed to generate capture context';
  static readonly ERROR_MSG_TRANSIENT_TOKEN_DATA = 'Unable to get transient token data';
  static readonly ERROR_MSG_INVALID_INSTRUMENT_ID_RESPONSE = 'Invalid instrument identifier response';
  static readonly ERROR_MSG_SIGNATURE_DOES_NOT_MATCH = 'Generated signature does not match with header signature';
  static readonly ERROR_MSG_UNHANDLED_REQUEST_METHOD = 'Unhandled request method';
  static readonly ERROR_MSG_NOT_FOUND = 'Not found';
  static readonly ERROR_MSG_POST_REQUEST = 'Unhandled post request';
  static readonly ERROR_MSG_GET_REQUEST = 'Unhandled get request';
  static readonly ERROR_MSG_INTERNAL_SERVER_ERROR = 'Internal Server Error';

  //Network token logs
  static readonly ERROR_MSG_INVALID_INSTRUMENT_IDENTIFIER = 'Invalid Instrument identifier';
  static readonly ERROR_MSG_INVALID_NOTIFICATION_DATA = 'Invalid Notification Data';
  static readonly ERROR_MSG_INSTRUMENT_ID_RESPONSE = 'Error in response with instrument identifier';
  static readonly ERROR_MSG_CUSTOMER_WITH_INSTRUMENT_ID_NOT_FOUND = 'There is no customer present with the given instrument id for the card';
  static readonly ERROR_MSG_DELETE_SUBSCRIPTION = 'Error in deleting subscription';
  static readonly ERROR_MSG_PROCESSING_SUBSCRIPTION = 'Error in processing subscription';
  static readonly ERROR_MSG_SUBSCRIPTION_ALREADY_EXIST = 'Subscription Already Exists';
  static readonly ERROR_MSG_UNABLE_TO_UPDATE_CUSTOMER_TOKEN = 'An error occurred while updating the card from notification';
  //  API Endpoints
  static readonly PAYMENT_CREATE_DESTINATION_URL = '/api/extension/payment/create';
  static readonly PAYMENT_UPDATE_DESTINATION_URL = '/api/extension/payment/update';
  static readonly CUSTOMER_CREATE_DESTINATION_URL = '/api/extension/customer/update';
  static readonly EXTENSION_SERVICE_END_POINTS = ['/capture', '/refund', '/authReversal', '/orders', '/orderData', '/paymentData', '/paymentDetails', '/decisionSync', '/sync', '/configureExtension', '/favicon.ico'];

  //HTMLContent
  static readonly HTML_PREFIX =
    '<!DOCTYPE html> <html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Commercetools Cybersource Extension</title><script>if (top != self) {top.location = encodeURI(self.location);}</script><link rel="stylesheet" href="css/styles.css" /></head><body>';
  static readonly HTML_SUFFIX = '</body></html>';
}