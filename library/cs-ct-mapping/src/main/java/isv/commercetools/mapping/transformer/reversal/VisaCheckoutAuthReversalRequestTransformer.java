package isv.commercetools.mapping.transformer.reversal;

import isv.commercetools.mapping.model.CybersourceIds;
import isv.commercetools.mapping.transformer.RequestTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.AuthReversalServiceFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.PurchaseTotalsFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.VisaCheckoutFieldGroupTransformer;
import java.util.Arrays;

public class VisaCheckoutAuthReversalRequestTransformer extends RequestTransformer {

  public VisaCheckoutAuthReversalRequestTransformer(CybersourceIds cybersourceIds) {
    super(Arrays.asList(
      new BaseFieldGroupTransformer(cybersourceIds),
      new AuthReversalServiceFieldGroupTransformer(),
      new PurchaseTotalsFieldGroupTransformer(),
      new VisaCheckoutFieldGroupTransformer()
    ));
  }

}
