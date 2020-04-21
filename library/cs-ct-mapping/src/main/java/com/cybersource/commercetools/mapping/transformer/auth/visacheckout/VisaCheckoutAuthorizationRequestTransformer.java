package com.cybersource.commercetools.mapping.transformer.auth.visacheckout;

import com.cybersource.commercetools.mapping.model.CybersourceIds;
import com.cybersource.commercetools.mapping.transformer.fieldgroup.*;
import com.cybersource.commercetools.mapping.transformer.RequestTransformer;

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
