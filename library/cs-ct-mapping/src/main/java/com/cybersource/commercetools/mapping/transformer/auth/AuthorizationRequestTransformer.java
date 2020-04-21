package com.cybersource.commercetools.mapping.transformer.auth;

import com.cybersource.commercetools.mapping.model.CybersourceIds;
import com.cybersource.commercetools.mapping.transformer.fieldgroup.*;
import com.cybersource.commercetools.mapping.transformer.RequestTransformer;

import java.util.Arrays;

/**
 * Transforms payment to CybersourceRequest for authorization
 */
public class AuthorizationRequestTransformer extends RequestTransformer {

  public AuthorizationRequestTransformer(CybersourceIds cybersourceIds) {
    super(Arrays.asList(
            new BaseFieldGroupTransformer(cybersourceIds),
            new AuthServiceFieldGroupTransformer(),
            new BillToFieldGroupTransformer(),
            new ShipToFieldGroupTransformer(),
            new PurchaseTotalsFieldGroupTransformer(),
            new RecurringSubscriptionInfoFieldGroupTransformer(),
            new LineItemFieldGroupTransformer(),
            new MerchantDefinedDataFieldGroupTransformer(),
            new DecisionManagerFieldGroupTransformer(),
            new SubscriptionUpdateServiceFieldGroupTransformer()
    ));
  }

}
