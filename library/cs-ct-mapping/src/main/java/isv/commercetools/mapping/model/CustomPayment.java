package isv.commercetools.mapping.model;

import io.sphere.sdk.payments.Payment;
import io.sphere.sdk.types.CustomFields;
import isv.commercetools.mapping.constants.EnrolmentCheckDataConstants;
import isv.commercetools.mapping.constants.PaymentCustomFieldConstants;
import isv.commercetools.mapping.model.interactions.EnrolmentData;
import isv.commercetools.mapping.types.TypeCache;
import java.util.Optional;

/***
 * A representation of a customised Commercetools payment. Provides convenient accessors for the defined custom fields.
 * The use of this class requires all of the custom fields to be configured in Commercetools.
 */
public class CustomPayment {

  private final Payment basePayment;

  public CustomPayment(Payment basePayment) {
    this.basePayment = basePayment;
  }

  public Payment getBasePayment() {
    return basePayment;
  }

  public String getId() {
    return basePayment.getId();
  }

  public String getToken() {
    return getField(PaymentCustomFieldConstants.TOKEN);
  }

  public String getTokenAlias() {
    return getField(PaymentCustomFieldConstants.TOKEN_ALIAS);
  }

  public String getSavedToken() {
    return getField(PaymentCustomFieldConstants.SAVED_TOKEN);
  }

  public String getTokenVerificationContext() {
    return getField(PaymentCustomFieldConstants.TOKEN_VERIFICATION_CONTEXT);
  }

  public String getMaskedCardNumber() {
    return getField(PaymentCustomFieldConstants.MASKED_CARD_NUMBER);
  }

  public String getCardType() {
    return getField(PaymentCustomFieldConstants.CARD_TYPE);
  }

  public String getCardExpiryMonth() {
    return getField(PaymentCustomFieldConstants.CARD_EXPIRY_MONTH);
  }

  public String getCardExpiryYear() {
    return getField(PaymentCustomFieldConstants.CARD_EXPIRY_YEAR);
  }

  public String getPayerAuthenticationRequestJwt() {
    return getField(PaymentCustomFieldConstants.PAYER_AUTH_REQUEST_JWT);
  }

  public String getPayerAuthenticationResponseJwt() {
    return getField(PaymentCustomFieldConstants.PAYER_AUTH_RESPONSE_JWT);
  }

  public Boolean isPayerAuthenticationRequired() {
    return getFieldAsBoolean(PaymentCustomFieldConstants.PAYER_AUTH_AUTHENTICATION_REQUIRED);
  }

  public String getPayerAuthenticationTransactionId() {
    return getField(PaymentCustomFieldConstants.PAYER_AUTH_AUTHENTICATION_TRANSACTION_ID);
  }

  public String getPayerAuthenticationAcsUrl() {
    return getField(PaymentCustomFieldConstants.PAYER_AUTH_ACS_URL);
  }

  public String getPayerAuthenticationPaReq() {
    return getField(PaymentCustomFieldConstants.PAYER_AUTH_PA_REQ);
  }

  public String getPayerAuthenticationAcceptHeader() {
    return getField(PaymentCustomFieldConstants.PAYER_AUTH_ACCEPT_HEADER);
  }

  public String getPayerAuthenticationUserAgentHeader() {
    return getField(PaymentCustomFieldConstants.PAYER_AUTH_USER_AGENT_HEADER);
  }

  public String getCustomerIpAddress() {
    return getField(PaymentCustomFieldConstants.CUSTOMER_IP_ADDRESS);
  }

  public String getDeviceFingerprintId() {
    return getField(PaymentCustomFieldConstants.DEVICE_FINGERPRINT_ID);
  }

  public EnrolmentData getEnrolmentData() {
    return new EnrolmentData(getInterfaceInteraction(EnrolmentCheckDataConstants.TYPE_KEY));
  }

  public String getPaymentMethod() {
    return basePayment.getPaymentMethodInfo().getMethod();
  }

  private Optional<CustomFields> getInterfaceInteraction(String key) {
    return basePayment.getInterfaceInteractions().stream()
            .filter(i -> key.equals(TypeCache.key(i.getType().getId())))
            .findFirst();
  }

  private String getField(String fieldKey) {
    return customFields().map(c -> c.getFieldAsString(fieldKey)).orElse(null);
  }

  private Boolean getFieldAsBoolean(String fieldKey) {
    return customFields().map(c -> c.getFieldAsBoolean(fieldKey)).orElse(null);
  }

  private Optional<CustomFields> customFields() {
    return Optional.ofNullable(basePayment.getCustom());
  }

}
