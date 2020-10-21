package isv.commercetools.mapping.transformer.reversal;

import isv.commercetools.mapping.model.PaymentServiceIds;
import isv.commercetools.mapping.transformer.RequestTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.AuthReversalServiceFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.PurchaseTotalsFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.VisaCheckoutFieldGroupTransformer;
import java.util.Arrays;

public class VisaCheckoutAuthReversalRequestTransformer extends RequestTransformer {

  public VisaCheckoutAuthReversalRequestTransformer(PaymentServiceIds paymentServiceIds) {
    super(Arrays.asList(
      new BaseFieldGroupTransformer(paymentServiceIds),
      new AuthReversalServiceFieldGroupTransformer(),
      new PurchaseTotalsFieldGroupTransformer(),
      new VisaCheckoutFieldGroupTransformer()
    ));
  }

}
