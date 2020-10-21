package isv.commercetools.mapping;

import static isv.commercetools.mapping.constants.EnrolmentCheckDataConstants.*;
import static isv.commercetools.mapping.util.MapUtil.putIfNotNull;

import io.sphere.sdk.commands.UpdateAction;
import io.sphere.sdk.payments.commands.updateactions.AddInterfaceInteraction;
import io.sphere.sdk.payments.commands.updateactions.SetCustomField;
import isv.commercetools.mapping.constants.PaymentCustomFieldConstants;
import isv.commercetools.model.PayerAuthenticationResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Maps PayerAuthEnrolmentCheckResponse to Commercetools UpdateActions
 */
public class PayerAuthenticationResponseToActionMapper {

  protected List<UpdateAction> mapResponseToActions(PayerAuthenticationResponse payerAuthenticationResponse) {
    var actions = new ArrayList<UpdateAction>();
    Map<String, Object> values = new HashMap<>();
    putIfNotNull(values, AUTHENTICATION_REQUIRED, payerAuthenticationResponse.isAuthenticationRequired());
    putIfNotNull(values, AUTHORIZATION_ALLOWED, payerAuthenticationResponse.isAuthorizationAllowed());
    putIfNotNull(values, AUTHENTICATION_TRANSACTION_ID, payerAuthenticationResponse.getAuthenticationTransactionId());
    putIfNotNull(values, REQUEST_REFERENCE_ID, payerAuthenticationResponse.getRequestReferenceId());
    putIfNotNull(values, PROOF_XML, payerAuthenticationResponse.getProofXml());
    putIfNotNull(values, XID, payerAuthenticationResponse.getXid());
    putIfNotNull(values, SPECIFICATION_VERSION, payerAuthenticationResponse.getSpecificationVersion());
    putIfNotNull(values, VERES_ENROLLED, payerAuthenticationResponse.getVeresEnrolled());
    putIfNotNull(values, COMMERCE_INDICATOR, payerAuthenticationResponse.getCommerceIndicator());
    putIfNotNull(values, ECI, payerAuthenticationResponse.getEci());

    var addInterfaceInteraction = AddInterfaceInteraction.ofTypeKeyAndObjects(TYPE_KEY, values);

    actions.add(addInterfaceInteraction);
    actions.add(SetCustomField.ofObject(PaymentCustomFieldConstants.PAYER_AUTH_AUTHENTICATION_REQUIRED, payerAuthenticationResponse.isAuthenticationRequired()));
    actions.add(SetCustomField.ofObject(PaymentCustomFieldConstants.PAYER_AUTH_AUTHENTICATION_TRANSACTION_ID, payerAuthenticationResponse.getAuthenticationTransactionId()));

    if (payerAuthenticationResponse.getAcsUrl() != null) {
      actions.add(SetCustomField.ofObject(PaymentCustomFieldConstants.PAYER_AUTH_ACS_URL, payerAuthenticationResponse.getAcsUrl()));
    }
    if (payerAuthenticationResponse.getPaReq() != null) {
      actions.add(SetCustomField.ofObject(PaymentCustomFieldConstants.PAYER_AUTH_PA_REQ, payerAuthenticationResponse.getPaReq()));
    }

    return actions;
  }

}
