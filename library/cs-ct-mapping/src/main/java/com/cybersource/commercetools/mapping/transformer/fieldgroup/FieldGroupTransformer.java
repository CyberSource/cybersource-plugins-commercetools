package com.cybersource.commercetools.mapping.transformer.fieldgroup;

import com.cybersource.payments.model.fields.RequestServiceFieldGroup;
import com.cybersource.commercetools.mapping.model.PaymentDetails;

import java.util.List;

public interface FieldGroupTransformer<T extends RequestServiceFieldGroup> {

    List<T> configure(PaymentDetails paymentDetails);

}
