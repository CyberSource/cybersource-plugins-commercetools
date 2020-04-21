package com.cybersource.commercetools.mapping.transformer.fieldgroup;

import com.cybersource.payments.model.fields.VisaCheckoutFieldGroup;
import com.cybersource.commercetools.mapping.model.PaymentDetails;

import java.util.List;

public class VisaCheckoutFieldGroupTransformer implements FieldGroupTransformer<VisaCheckoutFieldGroup> {

    @Override
    public List<VisaCheckoutFieldGroup> configure(PaymentDetails paymentDetails) {
        var fieldGroup = new VisaCheckoutFieldGroup();
        final String token = paymentDetails.getCustomPayment().getToken();
        fieldGroup.setOrderID(token);
        return List.of(fieldGroup);
    }
}
