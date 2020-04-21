package com.cybersource.commercetools.mapping.transformer.fieldgroup;

import com.cybersource.commercetools.mapping.model.PaymentDetails;
import com.cybersource.payments.model.fields.RecurringSubscriptionInfoFieldGroup;

import java.util.List;

/**
 * Configures RecurringSubscriptionInfoFieldGroup for payment
 */
public class RecurringSubscriptionInfoFieldGroupTransformer implements FieldGroupTransformer<RecurringSubscriptionInfoFieldGroup> {

    @Override
    public List<RecurringSubscriptionInfoFieldGroup> configure(PaymentDetails paymentDetails) {
        var token = new RecurringSubscriptionInfoFieldGroup();
        token.setSubscriptionID(paymentDetails.getCustomPayment().getToken());
        return List.of(token);
    }

}
