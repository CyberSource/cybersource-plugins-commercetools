package com.cybersource.commercetools.mapping.transformer.payerauth;

import com.cybersource.commercetools.mapping.transformer.response.ReasonCodeResponseTransformer;
import com.cybersource.commercetools.mapping.transformer.response.ResponseTransformer;
import io.sphere.sdk.commands.UpdateAction;
import io.sphere.sdk.payments.Transaction;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Transforms Authorization responses from Cybersource that include Payer Authentication Validation into Commercetools API Extension UpdateActions.
 */
public class AuthorizationWithPayerAuthResponseTransformer implements ResponseTransformer {

  private final ReasonCodeResponseTransformer authorizationResponseTransformer;
  private final PayerAuthValidateResponseTransformer payerAuthValidateResponseTransformer;

  public AuthorizationWithPayerAuthResponseTransformer() {
    this(new ReasonCodeResponseTransformer(), new PayerAuthValidateResponseTransformer("payerAuthValidateReply_", true));
  }

  protected AuthorizationWithPayerAuthResponseTransformer(ReasonCodeResponseTransformer authorizationResponseTransformer, PayerAuthValidateResponseTransformer payerAuthValidateResponseTransformer) {
    this.authorizationResponseTransformer = authorizationResponseTransformer;
    this.payerAuthValidateResponseTransformer = payerAuthValidateResponseTransformer;
  }

  @Override
  public List<UpdateAction> transform(Map<String, String> cybersourceResponse, Transaction transaction) {
    var actions = new ArrayList<UpdateAction>();
    actions.addAll(authorizationResponseTransformer.transform(cybersourceResponse, transaction));
    actions.addAll(payerAuthValidateResponseTransformer.transform(cybersourceResponse));
    return actions;
  }

}
