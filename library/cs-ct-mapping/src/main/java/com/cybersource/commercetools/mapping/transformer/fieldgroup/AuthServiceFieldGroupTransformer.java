package com.cybersource.commercetools.mapping.transformer.fieldgroup;

import com.cybersource.payments.model.fields.AuthServiceFieldGroup;
import com.cybersource.commercetools.mapping.model.PaymentDetails;

import java.util.List;

/**
 * Configures AuthServiceFieldGroup to enable running of auth service
 */
public class AuthServiceFieldGroupTransformer implements FieldGroupTransformer<AuthServiceFieldGroup> {

    @Override
    public List<AuthServiceFieldGroup> configure(PaymentDetails paymentDetails) {
        var authFields = new AuthServiceFieldGroup();
        authFields.setRun(true);
        return List.of(authFields);
    }

}
