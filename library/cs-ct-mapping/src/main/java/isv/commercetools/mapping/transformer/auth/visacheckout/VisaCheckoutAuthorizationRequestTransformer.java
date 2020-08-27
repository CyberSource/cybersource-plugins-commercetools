package isv.commercetools.mapping.transformer.auth.visacheckout;

import isv.commercetools.mapping.model.CybersourceIds;
import isv.commercetools.mapping.transformer.RequestTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.AuthServiceFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.DecisionManagerFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.LineItemFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.MerchantDefinedDataFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.PurchaseTotalsFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.VisaCheckoutFieldGroupTransformer;
import java.util.Arrays;

/**
 * Transforms a Visa Checkout payment to CybersourceRequest for authorization
 */
public class VisaCheckoutAuthorizationRequestTransformer extends RequestTransformer {

  public VisaCheckoutAuthorizationRequestTransformer(CybersourceIds cybersourceIds) {
    super(Arrays.asList(
            new BaseFieldGroupTransformer(cybersourceIds),
            new AuthServiceFieldGroupTransformer(),
            new PurchaseTotalsFieldGroupTransformer(),
            new LineItemFieldGroupTransformer(),
            new MerchantDefinedDataFieldGroupTransformer(),
            new VisaCheckoutFieldGroupTransformer(),
            new DecisionManagerFieldGroupTransformer()
    ));
  }

}
