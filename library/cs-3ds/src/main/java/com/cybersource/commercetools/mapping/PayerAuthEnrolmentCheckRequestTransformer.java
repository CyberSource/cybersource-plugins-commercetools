package com.cybersource.commercetools.mapping;

import com.cybersource.cardinal.service.CardinalService;
import com.cybersource.commercetools.mapping.fieldgroup.PayerAuthEnrollServiceFieldGroupTransformer;
import com.cybersource.commercetools.mapping.model.CybersourceIds;
import com.cybersource.commercetools.mapping.transformer.RequestTransformer;
import com.cybersource.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer;
import com.cybersource.commercetools.mapping.transformer.fieldgroup.BillToFieldGroupTransformer;
import com.cybersource.commercetools.mapping.transformer.fieldgroup.PurchaseTotalsFieldGroupTransformer;
import com.cybersource.commercetools.mapping.transformer.fieldgroup.RecurringSubscriptionInfoFieldGroupTransformer;

import java.util.Arrays;

/**
 * Transforms payment to CybersourceRequest for payer authentication enrolment check
 */
public class PayerAuthEnrolmentCheckRequestTransformer extends RequestTransformer {

    public PayerAuthEnrolmentCheckRequestTransformer(CybersourceIds cybersourceIds, CardinalService cardinalService) {
        super(Arrays.asList(
                new BaseFieldGroupTransformer(cybersourceIds),
                new BillToFieldGroupTransformer(),
                PayerAuthEnrollServiceFieldGroupTransformer.forECommerceOrder(cardinalService),
                new PurchaseTotalsFieldGroupTransformer(),
                new RecurringSubscriptionInfoFieldGroupTransformer()
        ));
    }

}
