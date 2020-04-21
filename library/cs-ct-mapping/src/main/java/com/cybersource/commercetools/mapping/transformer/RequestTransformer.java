package com.cybersource.commercetools.mapping.transformer;

import com.cybersource.commercetools.mapping.model.PaymentDetails;
import com.cybersource.commercetools.mapping.transformer.fieldgroup.FieldGroupTransformer;
import com.cybersource.payments.model.CybersourceRequest;
import com.cybersource.payments.model.fields.RequestServiceFieldGroup;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Base class for transforming commercetools payments to Cybersource requests
 */
public class RequestTransformer {

    protected final List<FieldGroupTransformer> fieldGroupTransformers;

    public RequestTransformer(List<FieldGroupTransformer> fieldGroupTransformers) {
        this.fieldGroupTransformers = fieldGroupTransformers;
    }

    public CybersourceRequest transform(PaymentDetails paymentDetails) {
        return new CybersourceRequest(configureFieldGroups(paymentDetails));
    }

    protected List<RequestServiceFieldGroup> configureFieldGroups(PaymentDetails paymentDetails) {
        return fieldGroupTransformers.stream()
                .flatMap(t -> (Stream<RequestServiceFieldGroup>) t.configure(paymentDetails).stream())
                .collect(Collectors.toList());
    }

}
