package isv.commercetools.mapping.constants;

/**
 * Keys for custom fields on a Commercetools Payment resource.
 */
public class PaymentCustomFieldConstants {

  public static final String TOKEN = "isv_token";
  public static final String TOKEN_ALIAS = "isv_tokenAlias";
  public static final String SAVED_TOKEN = "isv_savedToken";
  public static final String TOKEN_VERIFICATION_CONTEXT = "isv_tokenVerificationContext";
  public static final String CARD_TYPE = "isv_cardType";
  public static final String MASKED_CARD_NUMBER = "isv_maskedPan";
  public static final String CARD_EXPIRY_MONTH = "isv_cardExpiryMonth";
  public static final String CARD_EXPIRY_YEAR = "isv_cardExpiryYear";

  //3DSecure
  public static final String PAYER_AUTH_REQUEST_JWT = "isv_requestJwt";
  public static final String PAYER_AUTH_RESPONSE_JWT = "isv_responseJwt";
  public static final String PAYER_AUTH_AUTHENTICATION_REQUIRED = "isv_payerAuthenticationRequired";
  public static final String PAYER_AUTH_AUTHENTICATION_TRANSACTION_ID = "isv_payerAuthenticationTransactionId";
  public static final String PAYER_AUTH_ACS_URL = "isv_payerAuthenticationAcsUrl";
  public static final String PAYER_AUTH_PA_REQ = "isv_payerAuthenticationPaReq";
  public static final String PAYER_AUTH_ACCEPT_HEADER = "isv_acceptHeader";
  public static final String PAYER_AUTH_USER_AGENT_HEADER = "isv_userAgentHeader";

  public static final String DEVICE_FINGERPRINT_ID = "isv_deviceFingerprintId";
  public static final String CUSTOMER_IP_ADDRESS = "isv_customerIpAddress";

  public static final String PRODUCT_CODE = "isv_productCode";
  public static final String PRODUCT_RISK = "isv_productRisk";
}
