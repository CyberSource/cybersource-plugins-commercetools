package com.cybersource.commercetools.mapping.transformer.fieldgroup;

import com.cybersource.payments.model.fields.VisaCheckoutDataServiceFieldGroup;
import com.cybersource.commercetools.mapping.model.PaymentDetails;

import java.util.List;

public class VisaCheckoutDataServiceFieldGroupTransformer implements FieldGroupTransformer<VisaCheckoutDataServiceFieldGroup> {

    @Override
    public List<VisaCheckoutDataServiceFieldGroup> configure(PaymentDetails paymentDetails) {
        var fieldGroup = new VisaCheckoutDataServiceFieldGroup();
        fieldGroup.setRun(true);
        return List.of(fieldGroup);
    }

}
