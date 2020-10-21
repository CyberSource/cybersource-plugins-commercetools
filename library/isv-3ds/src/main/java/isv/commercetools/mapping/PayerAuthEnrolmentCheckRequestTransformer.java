package isv.commercetools.mapping;

import isv.cardinal.service.CardinalService;
import isv.commercetools.mapping.fieldgroup.PayerAuthEnrollServiceFieldGroupTransformer;
import isv.commercetools.mapping.model.PaymentServiceIds;
import isv.commercetools.mapping.transformer.RequestTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.BillToFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.PurchaseTotalsFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.RecurringSubscriptionInfoFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.TokenSourceFieldGroupTransformer;
import java.util.Arrays;

/**
 * Transforms payment to ISVRequest for payer authentication enrolment check
 */
public class PayerAuthEnrolmentCheckRequestTransformer extends RequestTransformer {

    public PayerAuthEnrolmentCheckRequestTransformer(PaymentServiceIds paymentServiceIds, CardinalService cardinalService) {
        super(Arrays.asList(
                new BaseFieldGroupTransformer(paymentServiceIds),
                new BillToFieldGroupTransformer(),
                PayerAuthEnrollServiceFieldGroupTransformer.forECommerceOrder(cardinalService),
                new PurchaseTotalsFieldGroupTransformer(),
                new RecurringSubscriptionInfoFieldGroupTransformer(),
                new TokenSourceFieldGroupTransformer()
        ));
    }

}
