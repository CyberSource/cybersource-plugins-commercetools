package com.cybersource.commercetools.mapping.transformer.reversal;

import com.cybersource.commercetools.mapping.model.CybersourceIds;
import com.cybersource.commercetools.mapping.transformer.RequestTransformer;
import com.cybersource.commercetools.mapping.transformer.fieldgroup.AuthReversalServiceFieldGroupTransformer;
import com.cybersource.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer;
import com.cybersource.commercetools.mapping.transformer.fieldgroup.PurchaseTotalsFieldGroupTransformer;
import com.cybersource.commercetools.mapping.transformer.fieldgroup.VisaCheckoutFieldGroupTransformer;

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
