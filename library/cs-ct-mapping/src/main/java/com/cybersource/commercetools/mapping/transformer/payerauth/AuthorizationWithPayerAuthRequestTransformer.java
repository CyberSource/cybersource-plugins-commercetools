package com.cybersource.commercetools.mapping.transformer.payerauth;

import com.cybersource.commercetools.mapping.model.CybersourceIds;
import com.cybersource.commercetools.mapping.model.PaymentDetails;
import com.cybersource.commercetools.mapping.transformer.auth.AuthorizationRequestTransformer;
import com.cybersource.commercetools.mapping.transformer.fieldgroup.PayerAuthValidateServiceFieldGroupTransformer;
import com.cybersource.payments.model.fields.RequestServiceFieldGroup;

import java.util.ArrayList;
import java.util.List;

/**
 * Transforms payment to CybersourceRequest for authorization including payer authentication validation
 */
public class AuthorizationWithPayerAuthRequestTransformer extends AuthorizationRequestTransformer {

  private final PayerAuthValidateServiceFieldGroupTransformer payerAuthValidateFieldGroupTransformer;

  public AuthorizationWithPayerAuthRequestTransformer(CybersourceIds cybersourceIds) {
    super(cybersourceIds);
    this.payerAuthValidateFieldGroupTransformer = new PayerAuthValidateServiceFieldGroupTransformer();
  }

  @Override
  protected List<RequestServiceFieldGroup> configureFieldGroups(PaymentDetails paymentDetails) {
    var fieldGroups = new ArrayList<RequestServiceFieldGroup>();
    fieldGroups.addAll(super.configureFieldGroups(paymentDetails));
    var payerAuthValidateServiceFieldGroup = payerAuthValidateFieldGroupTransformer.configure(paymentDetails);
    if (payerAuthValidateServiceFieldGroup != null) {
      fieldGroups.addAll(payerAuthValidateServiceFieldGroup);
    }
    return fieldGroups;
  }

}
