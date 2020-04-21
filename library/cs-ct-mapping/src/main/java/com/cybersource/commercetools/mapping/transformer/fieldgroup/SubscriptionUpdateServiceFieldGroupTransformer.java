package com.cybersource.commercetools.mapping.transformer.fieldgroup;

import com.cybersource.commercetools.mapping.model.PaymentDetails;
import com.cybersource.payments.model.fields.SubscriptionUpdateServiceFieldGroup;

import java.util.List;

/**
 * Configures SubscriptionUpdateServiceFieldGroup to enable running of subscription update service
 */
public class SubscriptionUpdateServiceFieldGroupTransformer implements FieldGroupTransformer<SubscriptionUpdateServiceFieldGroup> {

    @Override
    public List<SubscriptionUpdateServiceFieldGroup> configure(PaymentDetails paymentDetails) {
        var fields = new SubscriptionUpdateServiceFieldGroup();
        fields.setRun(true);
        return List.of(fields);
    }

}
