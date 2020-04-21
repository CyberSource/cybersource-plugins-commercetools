package com.cybersource.commercetools.reference.application.validation.rules.service;

import com.cybersource.commercetools.api.extension.model.ExtensionError;
import com.cybersource.commercetools.api.extension.validation.InputValidator;
import com.cybersource.commercetools.mapping.model.CustomPayment;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.sphere.sdk.payments.Transaction;
import io.sphere.sdk.payments.TransactionState;
import io.sphere.sdk.payments.TransactionType;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Returns an Invalid Input error if the payment has a transaction with the provided state and type when it is not expected
 * or if the transaction is missing when it is expected.
 */
public final class TransactionValidationRule extends InputValidator<CustomPayment> {

    private final TransactionState state;
    private final TransactionType type;
    private final boolean expect;

    private TransactionValidationRule(ObjectMapper objectMapper, TransactionState state, TransactionType type, boolean expect) {
        super(objectMapper);
        this.state = state;
        this.type = type;
        this.expect = expect;
    }

    public static TransactionValidationRule doNotExpectTransactionValidationRule(ObjectMapper objectMapper, TransactionState state, TransactionType type) {
        return new TransactionValidationRule(objectMapper, state, type, false);
    }

    public static TransactionValidationRule expectTransactionValidationRule(ObjectMapper objectMapper, TransactionState state, TransactionType type) {
        return new TransactionValidationRule(objectMapper, state, type, true);
    }

    @Override
    public List<ExtensionError> validate(CustomPayment customPayment) {
        List<ExtensionError> errors = new ArrayList<>();

        var transaction = getTransaction(customPayment);

        if (expect && transaction.isEmpty()) {
            errors.add(invalidInputError(String.format("Cannot process this payment as no %s %s transaction exists", state, type)));
        } else if (! expect && ! transaction.isEmpty()) {
            errors.add(invalidInputError(String.format("Cannot process this payment as %s %s transaction exists", state, type)));
        }

        return errors;
    }

    private Optional<Transaction> getTransaction(CustomPayment payment) {
        return payment.getBasePayment().getTransactions().stream()
                .filter(it -> it.getType() == type)
                .filter(it -> it.getState() == state)
                .findFirst();
    }
}
