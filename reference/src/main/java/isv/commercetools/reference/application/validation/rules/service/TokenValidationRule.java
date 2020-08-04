package isv.commercetools.reference.application.validation.rules.service;

import static isv.commercetools.mapping.constants.PaymentMethodConstants.PAYMENT_METHOD_VISA_CHECKOUT;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

import com.fasterxml.jackson.databind.ObjectMapper;
import isv.commercetools.api.extension.model.ErrorCode;
import isv.commercetools.api.extension.model.ExtensionError;
import isv.commercetools.api.extension.validation.InputValidator;
import isv.commercetools.mapping.model.CustomPayment;
import isv.commercetools.reference.application.validation.FlexTokenVerifier;
import java.util.ArrayList;
import java.util.List;

public class TokenValidationRule extends InputValidator<CustomPayment> {

    private final FlexTokenVerifier tokenVerifier;

    public TokenValidationRule(ObjectMapper objectMapper, FlexTokenVerifier tokenVerifier) {
        super(objectMapper);
        this.tokenVerifier = tokenVerifier;
    }

    @Override
    public List<ExtensionError> validate(CustomPayment payment) {
        var errors = new ArrayList<ExtensionError>();

        if (isBlank(payment.getToken()) && isBlank(payment.getSavedToken())) {
            errors.add(new ExtensionError(ErrorCode.REQUIRED_FIELD_MISSING, "Token is required"));
        }

        if (isNotBlank(payment.getToken()) && isNotBlank(payment.getSavedToken())) {
            errors.add(invalidInputError("Only one of transient and saved token can be supplied"));
        }

        if (isNotBlank(payment.getTokenAlias()) && isBlank(payment.getToken())) {
            errors.add(new ExtensionError(ErrorCode.REQUIRED_FIELD_MISSING, "Transient token is required when saving token"));
        }

        validateToken(payment, errors);

        return errors;
    }

    private void validateToken(CustomPayment payment, List<ExtensionError> errors) {
        if (isNotBlank(payment.getToken()) && ! PAYMENT_METHOD_VISA_CHECKOUT.equals(payment.getPaymentMethod())) {
            if (isBlank(payment.getTokenVerificationContext())) {
                errors.add(new ExtensionError(ErrorCode.REQUIRED_FIELD_MISSING, "Verification context is required"));
            } else {
                if (! tokenVerifier.verifyToken(payment)) {
                    errors.add(invalidInputError("Token verification failed"));
                }
            }
        }
    }
}
