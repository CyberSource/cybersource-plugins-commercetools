package com.cybersource.commercetools.reference.application.validation.rules.service;

import com.cybersource.commercetools.api.extension.model.ExtensionError;
import com.cybersource.commercetools.api.extension.validation.InputValidator;
import com.cybersource.commercetools.mapping.model.CustomPayment;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.sphere.sdk.payments.TransactionState;
import io.sphere.sdk.payments.TransactionType;

import java.util.ArrayList;
import java.util.List;

/**
 * Returns an Invalid Input error if the requested cancellation amount is not equal to the authorized amount
 */
public class CancelAuthAmountEqualsAuthAmountValidationRule extends InputValidator<CustomPayment> {

    public CancelAuthAmountEqualsAuthAmountValidationRule(ObjectMapper objectMapper) {
        super(objectMapper);
    }

    @Override
    public List<ExtensionError> validate(CustomPayment payment) {
        List<ExtensionError> errors = new ArrayList<>();

        var authTransaction = payment.getBasePayment().getTransactions().stream()
            .filter(it -> it.getType() == TransactionType.AUTHORIZATION)
            .filter(it -> it.getState() == TransactionState.SUCCESS)
            .findFirst();

        if (authTransaction.isPresent()) {
            double cancellationAmount = payment.getBasePayment().getTransactions().stream()
                    .filter(it -> it.getType() == TransactionType.CANCEL_AUTHORIZATION)
                    .filter(it -> it.getState() == TransactionState.INITIAL)
                    .map(it -> it.getAmount().getNumber().doubleValue())
                    .findFirst()
                    .get();

            if (cancellationAmount != authTransaction.get().getAmount().getNumber().doubleValue()) {
                errors.add(invalidInputError("Cancel Authorization amount does not equal Authorization amount"));
            }
        }

        return errors;
    }
}
