package com.cybersource.commercetools.reference.application.validation.rules.controller;

import com.cybersource.commercetools.api.extension.model.ExtensionError;
import com.cybersource.commercetools.api.extension.validation.InputValidator;
import com.cybersource.commercetools.mapping.model.CustomPayment;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

/**
 * Returns an Invalid Input error if there is any transactions on the payment.
 */
public class ExpectNoTransactionsValidationRule extends InputValidator<CustomPayment> {

    public ExpectNoTransactionsValidationRule(ObjectMapper objectMapper) {
        super(objectMapper);
    }

    @Override
    public List<ExtensionError> validate(CustomPayment payment) {
        var result = new ArrayList<ExtensionError>();
        if (!payment.getBasePayment().getTransactions().isEmpty()) {
            result.add(invalidInputError("Cannot process this payment as it has existing transactions"));
        }
        return result;
    }
}
