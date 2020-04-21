package com.cybersource.commercetools.mapping.transformer.fieldgroup;

import com.cybersource.commercetools.mapping.model.PaymentDetails;
import com.cybersource.payments.model.fields.CaptureServiceFieldGroup;
import io.sphere.sdk.payments.TransactionState;
import io.sphere.sdk.payments.TransactionType;

import java.util.List;

public class CaptureServiceFieldGroupTransformer implements FieldGroupTransformer<CaptureServiceFieldGroup> {

    @Override
    public List<CaptureServiceFieldGroup> configure(PaymentDetails paymentDetails) {
        final CaptureServiceFieldGroup captureServiceFieldGroup = new CaptureServiceFieldGroup();
        captureServiceFieldGroup.setRun(true);
        var authTransaction = paymentDetails.getCustomPayment().getBasePayment().getTransactions().stream()
                .filter(it -> it.getType() == TransactionType.AUTHORIZATION)
                .filter(it -> it.getState() == TransactionState.SUCCESS)
                .findFirst()
                .get();
        captureServiceFieldGroup.setAuthRequestID(authTransaction.getInteractionId());
        return List.of(captureServiceFieldGroup);
    }

}
