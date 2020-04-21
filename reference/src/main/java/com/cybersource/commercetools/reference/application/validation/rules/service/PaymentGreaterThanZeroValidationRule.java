package com.cybersource.commercetools.reference.application.validation.rules.service;

import com.cybersource.commercetools.api.extension.model.ExtensionError;
import com.cybersource.commercetools.api.extension.validation.InputValidator;
import com.cybersource.commercetools.mapping.model.CustomPayment;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

/**
 * Returns an Invalid Input error if the payment amount planned is less than zero.
 */
public class PaymentGreaterThanZeroValidationRule extends InputValidator<CustomPayment> {

    public PaymentGreaterThanZeroValidationRule(ObjectMapper objectMapper) {
        super(objectMapper);
    }

    @Override
    public List<ExtensionError> validate(CustomPayment payment) {
        List<ExtensionError> errors = new ArrayList<>();

        if (payment.getBasePayment().getAmountPlanned() != null && payment.getBasePayment().getAmountPlanned().isNegativeOrZero()) {
            errors.add(invalidInputError("Payment amount must be greater than zero"));
        }

        return errors;
    }
}
