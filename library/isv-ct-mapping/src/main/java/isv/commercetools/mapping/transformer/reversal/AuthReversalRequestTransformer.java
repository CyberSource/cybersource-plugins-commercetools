package isv.commercetools.mapping.transformer.reversal;

import isv.commercetools.mapping.model.PaymentServiceIds;
import isv.commercetools.mapping.transformer.RequestTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.AuthReversalServiceFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.PurchaseTotalsFieldGroupTransformer;
import java.util.Arrays;

public class AuthReversalRequestTransformer extends RequestTransformer {

  public AuthReversalRequestTransformer(PaymentServiceIds paymentServiceIds) {
    super(Arrays.asList(
      new BaseFieldGroupTransformer(paymentServiceIds),
      new AuthReversalServiceFieldGroupTransformer(),
      new PurchaseTotalsFieldGroupTransformer()
    ));
  }

}
