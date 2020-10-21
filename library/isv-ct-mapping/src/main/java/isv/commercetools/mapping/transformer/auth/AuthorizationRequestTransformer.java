package isv.commercetools.mapping.transformer.auth;

import isv.commercetools.mapping.model.PaymentServiceIds;
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
 * Transforms payment details to field group for authorization
 */
public class AuthorizationRequestTransformer extends RequestTransformer {

  public AuthorizationRequestTransformer(PaymentServiceIds paymentServiceIds) {
    super(Arrays.asList(
            new BaseFieldGroupTransformer(paymentServiceIds),
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
