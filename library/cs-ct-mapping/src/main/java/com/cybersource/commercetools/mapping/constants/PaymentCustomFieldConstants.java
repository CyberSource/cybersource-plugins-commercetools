package com.cybersource.commercetools.mapping.constants;

/**
 * Keys for custom fields on a Commercetools Payment resource.
 */
public class PaymentCustomFieldConstants {

  public static final String TOKEN = "cs_token";
  public static final String CARD_TYPE = "cs_cardType";
  public static final String MASKED_CARD_NUMBER = "cs_maskedPan";
  public static final String CARD_EXPIRY_MONTH = "cs_cardExpiryMonth";
  public static final String CARD_EXPIRY_YEAR = "cs_cardExpiryYear";

  //3DSecure
  public static final String PAYER_AUTH_REQUEST_JWT = "cs_requestJwt";
  public static final String PAYER_AUTH_RESPONSE_JWT = "cs_responseJwt";
  public static final String PAYER_AUTH_AUTHENTICATION_REQUIRED = "cs_payerAuthenticationRequired";
  public static final String PAYER_AUTH_AUTHENTICATION_TRANSACTION_ID = "cs_payerAuthenticationTransactionId";
  public static final String PAYER_AUTH_ACS_URL = "cs_payerAuthenticationAcsUrl";
  public static final String PAYER_AUTH_PA_REQ = "cs_payerAuthenticationPaReq";
  public static final String PAYER_AUTH_ACCEPT_HEADER = "cs_acceptHeader";
  public static final String PAYER_AUTH_USER_AGENT_HEADER = "cs_userAgentHeader";

  public static final String DEVICE_FINGERPRINT_ID = "cs_deviceFingerprintId";
  public static final String CUSTOMER_IP_ADDRESS = "cs_customerIpAddress";
}
