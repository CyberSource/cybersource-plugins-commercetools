package com.cybersource.commercetools.reference.application.service.payment;

import com.cybersource.commercetools.api.extension.model.ExtensionError;
import com.cybersource.commercetools.mapping.model.PaymentDetails;
import com.cybersource.commercetools.mapping.model.CustomPayment;
import io.sphere.sdk.commands.UpdateAction;

import java.util.Collections;
import java.util.List;

public class NoOpPaymentService implements PaymentService {

    @Override
    public PaymentDetails populatePaymentDetails(CustomPayment payment) {
        return null;
    }

    @Override
    public List<ExtensionError> validate(PaymentDetails paymentDetails) {
        return Collections.emptyList();
    }

    @Override
    public List<UpdateAction> process(PaymentDetails paymentDetails) {
        return Collections.emptyList();
    }

}
