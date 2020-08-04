package isv.commercetools.mapping.transformer.auth;

import isv.commercetools.mapping.model.CybersourceIds;
import isv.commercetools.mapping.transformer.RequestTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.AuthServiceFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.BillToFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.DecisionManagerFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.LineItemFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.MerchantDefinedDataFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.PurchaseTotalsFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.RecurringSubscriptionInfoFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.ShipToFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.SubscriptionCreateServiceFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.SubscriptionUpdateServiceFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.TokenSourceFieldGroupTransformer;
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
            new TokenSourceFieldGroupTransformer(),
            new LineItemFieldGroupTransformer(),
            new MerchantDefinedDataFieldGroupTransformer(),
            new DecisionManagerFieldGroupTransformer(),
            new SubscriptionCreateServiceFieldGroupTransformer(),
            new SubscriptionUpdateServiceFieldGroupTransformer(),
            new RecurringSubscriptionInfoFieldGroupTransformer()
    ));
  }

}
