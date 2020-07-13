package isv.commercetools.reference.application.validation.rules.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import isv.commercetools.api.extension.model.ExtensionError;
import isv.commercetools.api.extension.validation.InputValidator;
import isv.commercetools.mapping.model.CustomPayment;
import java.util.ArrayList;
import java.util.List;

/**
 * Returns an Invalid Operation error if there is unexpected payer authentication data on the payment
 */
public class ExpectNoEnrollmentDataValidationRule extends InputValidator<CustomPayment> {

    public ExpectNoEnrollmentDataValidationRule(ObjectMapper objectMapper) {
        super(objectMapper);
    }

    @Override
    public List<ExtensionError> validate(CustomPayment payment) {
        var errors = new ArrayList<ExtensionError>();

        if (payment.getEnrolmentData().getAuthenticationRequired().isPresent()) {
            errors.add(invalidOperationError("Unexpected payer authentication enrolment data present"));
        }

        return errors;
    }
}
