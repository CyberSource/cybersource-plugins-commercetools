package isv.commercetools.mapping.transformer.payerauth;

import isv.commercetools.mapping.model.PaymentServiceIds;
import isv.commercetools.mapping.model.PaymentDetails;
import isv.commercetools.mapping.transformer.auth.AuthorizationRequestTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.PayerAuthValidateServiceFieldGroupTransformer;
import isv.payments.model.fields.RequestServiceFieldGroup;
import java.util.ArrayList;
import java.util.List;

/**
 * Transforms payment details to field group for authorization including payer authentication validation
 */
public class AuthorizationWithPayerAuthRequestTransformer extends AuthorizationRequestTransformer {

  private final PayerAuthValidateServiceFieldGroupTransformer payerAuthValidateFieldGroupTransformer;

  public AuthorizationWithPayerAuthRequestTransformer(PaymentServiceIds paymentServiceIds) {
    super(paymentServiceIds);
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
