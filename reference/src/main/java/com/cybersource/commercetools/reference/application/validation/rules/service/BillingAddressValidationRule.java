package com.cybersource.commercetools.reference.application.validation.rules.service;

import com.cybersource.commercetools.api.extension.model.ExtensionError;
import com.cybersource.commercetools.api.extension.validation.InputValidator;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.sphere.sdk.carts.Cart;

import java.util.ArrayList;
import java.util.List;

/**
 * Returns Invalid Input errors for any missing Billing Address fields on the cart.
 */
public class BillingAddressValidationRule extends InputValidator<Cart> {

    public BillingAddressValidationRule(ObjectMapper objectMapper) {
        super(objectMapper);
    }

    @Override
    public List<ExtensionError> validate(Cart cart) {
        var errors = new ArrayList<ExtensionError>();
        var billingAddress = cart.getBillingAddress();
        validateRequiredField(errors, billingAddress, "Billing address");
        if (billingAddress != null) {
            validateRequiredField(errors, billingAddress.getStreetName(), "Billing address street");
            validateRequiredField(errors, billingAddress.getCity(), "Billing address city");
            validateRequiredField(errors, billingAddress.getPostalCode(), "Billing address post code");
            validateRequiredField(errors, billingAddress.getRegion(), "Billing address state");
            validateRequiredField(errors, billingAddress.getCountry(), "Billing address country");
        }
        return errors;
    }

}
