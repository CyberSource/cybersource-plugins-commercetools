package isv.commercetools.mapping.transformer.reversal;

import isv.commercetools.mapping.model.CybersourceIds;
import isv.commercetools.mapping.transformer.RequestTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.AuthReversalServiceFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.PurchaseTotalsFieldGroupTransformer;
import java.util.Arrays;

public class AuthReversalRequestTransformer extends RequestTransformer {

  public AuthReversalRequestTransformer(CybersourceIds cybersourceIds) {
    super(Arrays.asList(
      new BaseFieldGroupTransformer(cybersourceIds),
      new AuthReversalServiceFieldGroupTransformer(),
      new PurchaseTotalsFieldGroupTransformer()
    ));
  }

}
