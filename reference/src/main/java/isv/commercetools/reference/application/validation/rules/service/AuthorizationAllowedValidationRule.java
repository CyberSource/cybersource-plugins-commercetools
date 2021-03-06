package isv.commercetools.reference.application.validation.rules.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import isv.commercetools.api.extension.model.ExtensionError;
import isv.commercetools.api.extension.validation.InputValidator;
import isv.commercetools.mapping.model.CustomPayment;
import java.util.ArrayList;
import java.util.List;

public class AuthorizationAllowedValidationRule extends InputValidator<CustomPayment> {

    public AuthorizationAllowedValidationRule(ObjectMapper objectMapper) {
        super(objectMapper);
    }

    @Override
    public List<ExtensionError> validate(CustomPayment payment) {
        var result = new ArrayList<ExtensionError>();
        var authorizationAllowedOptional = payment.getEnrolmentData().getAuthorizationAllowed();
        if (authorizationAllowedOptional.isPresent() && !authorizationAllowedOptional.get()) {
            result.add(invalidOperationError("Payment cannot be authorized due to previous failure."));
        }
        return result;
    }
}
