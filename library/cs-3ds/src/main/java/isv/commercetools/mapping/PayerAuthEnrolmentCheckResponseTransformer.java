package isv.commercetools.mapping;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.sphere.sdk.commands.UpdateAction;
import isv.cardinal.service.CardinalService;
import isv.commercetools.mapping.model.CustomPayment;
import isv.commercetools.mapping.transformer.payerauth.PayerAuthValidateResponseTransformer;
import isv.commercetools.model.PayerAuthenticationResponse;
import isv.payments.exception.PaymentException;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Transforms Cybersource response for payer authentication check into PayerAuthEnrolmentCheckResponse
 */
public class PayerAuthEnrolmentCheckResponseTransformer {

  private static final Logger LOGGER = LoggerFactory.getLogger(PayerAuthEnrolmentCheckResponseTransformer.class);

  private static final String AUTHORIZATION_REQUIRED_REASON_CODE = "475";
  private static final String AUTHORIZATION_NOT_REQUIRED_REASON_CODE = "100";

  private final CardinalService cardinalService;
  private final PayerAuthenticationResponseToActionMapper responseToActionMapper;
  private final PayerAuthValidateResponseTransformer payerAuthValidateResponseTransformer;

  public PayerAuthEnrolmentCheckResponseTransformer(CardinalService cardinalService) {
    this(cardinalService, new PayerAuthenticationResponseToActionMapper(), new PayerAuthValidateResponseTransformer("payerAuthEnrollReply_", false));
  }

  protected PayerAuthEnrolmentCheckResponseTransformer(CardinalService cardinalService, PayerAuthenticationResponseToActionMapper responseToActionMapper, PayerAuthValidateResponseTransformer payerAuthValidateResponseTransformer) {
    this.cardinalService = cardinalService;
    this.responseToActionMapper = responseToActionMapper;
    this.payerAuthValidateResponseTransformer = payerAuthValidateResponseTransformer;
  }

  public List<UpdateAction> transform(Map<String, String> cybersourceResponse, CustomPayment payment) throws PaymentException {
    var actions = responseToActionMapper.mapResponseToActions(extractResponse(cybersourceResponse, payment));
    actions.addAll(payerAuthValidateResponseTransformer.transform(cybersourceResponse, null));
    return actions;
  }

  protected PayerAuthenticationResponse extractResponse(Map<String, String> cybersourceResponse, CustomPayment payment) throws PaymentException {
    var response = new PayerAuthenticationResponse();
    var reasonCode = cybersourceResponse.get("reasonCode");

    switch (reasonCode) {
      case AUTHORIZATION_REQUIRED_REASON_CODE:
        response.setAuthenticationRequired(true);
        response.setAuthorizationAllowed(true);
        break;
      case AUTHORIZATION_NOT_REQUIRED_REASON_CODE:
        response.setAuthenticationRequired(false);
        response.setAuthorizationAllowed(true);
        break;
      default:
        LOGGER.warn(String.format("Unexpected reason code for payer auth enrolment check: %s", reasonCode));
        response.setAuthenticationRequired(false);
        response.setAuthorizationAllowed(false);
        break;
    }

    response.setAcsUrl(cybersourceResponse.get("payerAuthEnrollReply_acsURL"));
    response.setPaReq(cybersourceResponse.get("payerAuthEnrollReply_paReq"));
    response.setProofXml(cybersourceResponse.get("payerAuthEnrollReply_proofXML"));
    response.setXid(cybersourceResponse.get("payerAuthEnrollReply_xid"));
    response.setSpecificationVersion(cybersourceResponse.get("payerAuthEnrollReply_specificationVersion"));
    response.setVeresEnrolled(cybersourceResponse.get("payerAuthEnrollReply_veresEnrolled"));
    response.setCommerceIndicator(cybersourceResponse.get("payerAuthEnrollReply_commerceIndicator"));
    response.setEci(cybersourceResponse.get("payerAuthEnrollReply_eci"));
    response.setAuthenticationTransactionId(cybersourceResponse.get("payerAuthEnrollReply_authenticationTransactionID"));

    try {
      response.setRequestReferenceId(cardinalService.validateJWTAndExtractReferenceId(payment.getPayerAuthenticationRequestJwt()));
    } catch (ExpiredJwtException | MalformedJwtException | SignatureException | IllegalArgumentException e) {
      throw new PaymentException(e);
    }
    return response;
  }

}
