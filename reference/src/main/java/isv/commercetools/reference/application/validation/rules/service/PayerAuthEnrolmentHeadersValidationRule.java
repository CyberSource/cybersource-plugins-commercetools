package isv.commercetools.reference.application.validation.rules.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import isv.commercetools.api.extension.model.ExtensionError;
import isv.commercetools.api.extension.validation.InputValidator;
import isv.commercetools.mapping.model.CustomPayment;
import java.util.ArrayList;
import java.util.List;

/**
 * Returns an Invalid Input error for any missing fields that are required for Payer Auth Enrollment checks
 */
public class PayerAuthEnrolmentHeadersValidationRule extends InputValidator<CustomPayment> {

    public PayerAuthEnrolmentHeadersValidationRule(ObjectMapper objectMapper) {
        super(objectMapper);
    }

    @Override
    public List<ExtensionError> validate(CustomPayment payment) {
        List<ExtensionError> errors = new ArrayList<>();

        validateRequiredField(errors, payment.getPayerAuthenticationAcceptHeader(), "Payer authentication accept header");
        validateRequiredField(errors, payment.getPayerAuthenticationUserAgentHeader(), "Payer authentication user agent header");

        return errors;
    }

}
