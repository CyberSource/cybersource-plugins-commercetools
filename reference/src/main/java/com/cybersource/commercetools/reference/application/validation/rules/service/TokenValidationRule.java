package com.cybersource.commercetools.reference.application.validation.rules.service;

import com.cybersource.commercetools.api.extension.model.ExtensionError;
import com.cybersource.commercetools.api.extension.validation.InputValidator;
import com.cybersource.commercetools.mapping.model.CustomPayment;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

public class TokenValidationRule extends InputValidator<CustomPayment> {

    public TokenValidationRule(ObjectMapper objectMapper) {
        super(objectMapper);
    }

    @Override
    public List<ExtensionError> validate(CustomPayment payment) {
        var errors = new ArrayList<ExtensionError>();
        validateRequiredField(errors, payment.getToken(), "Token");
        return errors;
    }
}
