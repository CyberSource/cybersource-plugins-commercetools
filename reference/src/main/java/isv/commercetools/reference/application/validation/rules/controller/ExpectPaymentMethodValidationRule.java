package isv.commercetools.reference.application.validation.rules.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import isv.commercetools.api.extension.model.ExtensionError;
import isv.commercetools.api.extension.validation.InputValidator;
import isv.commercetools.mapping.constants.PaymentMethodConstants;
import isv.commercetools.mapping.model.CustomPayment;
import java.util.ArrayList;
import java.util.List;

public class ExpectPaymentMethodValidationRule extends InputValidator<CustomPayment> {

    private final List<String> validPaymentMethods = List.of(
            PaymentMethodConstants.PAYMENT_METHOD_WITHOUT_PAYER_AUTH,
            PaymentMethodConstants.PAYMENT_METHOD_WITH_PAYER_AUTH,
            PaymentMethodConstants.PAYMENT_METHOD_VISA_CHECKOUT
    );

    public ExpectPaymentMethodValidationRule(ObjectMapper objectMapper) {
        super(objectMapper);
    }

    @Override
    public List<ExtensionError> validate(CustomPayment payment) {
        List<ExtensionError> errors = new ArrayList<>();

        final String paymentMethod = payment.getPaymentMethod();

        validateRequiredField(errors, paymentMethod, "paymentMethodInfo.method");

        if (errors.isEmpty() && !validPaymentMethods.contains(paymentMethod)) {
            errors.add(invalidInputError(String.format("Unrecognized payment method: %s", paymentMethod)));
        }

        return errors;
    }
}
