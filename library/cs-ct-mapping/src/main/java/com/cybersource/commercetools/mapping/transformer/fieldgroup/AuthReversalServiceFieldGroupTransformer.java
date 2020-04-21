package com.cybersource.commercetools.mapping.transformer.fieldgroup;

import com.cybersource.payments.model.fields.AuthReversalServiceFieldGroup;
import com.cybersource.commercetools.mapping.model.PaymentDetails;
import io.sphere.sdk.payments.TransactionState;
import io.sphere.sdk.payments.TransactionType;

import java.util.List;

public class AuthReversalServiceFieldGroupTransformer implements FieldGroupTransformer<AuthReversalServiceFieldGroup> {

    @Override
    public List<AuthReversalServiceFieldGroup> configure(PaymentDetails paymentDetails) {
        var result = new AuthReversalServiceFieldGroup();
        var authTransaction = paymentDetails.getCustomPayment().getBasePayment().getTransactions().stream()
                .filter(it -> it.getType() == TransactionType.AUTHORIZATION)
                .filter(it -> it.getState() == TransactionState.SUCCESS)
                .findFirst()
                .get();

        result.setRun(true);
        result.setAuthRequestID(authTransaction.getInteractionId());

        return List.of(result);
    }
}
