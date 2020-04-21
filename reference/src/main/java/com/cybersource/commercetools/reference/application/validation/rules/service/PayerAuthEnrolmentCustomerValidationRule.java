package com.cybersource.commercetools.reference.application.validation.rules.service;

import com.cybersource.commercetools.api.extension.model.ExtensionError;
import com.cybersource.commercetools.api.extension.validation.InputValidator;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.sphere.sdk.carts.Cart;

import java.util.ArrayList;
import java.util.List;

/**
 * Returns an Invalid Input error for any missing fields that are required for Payer Auth Enrollment checks
 */
public class PayerAuthEnrolmentCustomerValidationRule extends InputValidator<Cart> {

    public PayerAuthEnrolmentCustomerValidationRule(ObjectMapper objectMapper) {
        super(objectMapper);
    }

    @Override
    public List<ExtensionError> validate(Cart cart) {
        List<ExtensionError> errors = new ArrayList<>();

        var billingAddress = cart.getBillingAddress();

        validateRequiredField(errors, billingAddress, "Billing address");
        if (billingAddress != null) {
            validateRequiredField(errors, billingAddress.getFirstName(), "Billing first name");
            validateRequiredField(errors, billingAddress.getLastName(), "Billing last name");
            validateRequiredField(errors, billingAddress.getEmail(), "Billing email");
        }

        return errors;
    }

}
