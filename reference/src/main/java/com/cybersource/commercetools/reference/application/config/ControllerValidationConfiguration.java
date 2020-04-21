package com.cybersource.commercetools.reference.application.config;

import com.cybersource.commercetools.mapping.model.CustomPayment;
import com.cybersource.commercetools.reference.application.validation.ResourceValidator;
import com.cybersource.commercetools.reference.application.validation.rules.controller.ExpectNoTransactionsValidationRule;
import com.cybersource.commercetools.reference.application.validation.rules.controller.ExpectPaymentMethodValidationRule;
import com.cybersource.commercetools.reference.application.validation.rules.controller.MultipleInitialTransactionsValidationRule;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configures the validation required when receiving payment create and update payloads. Should validate payments
 * in order to ensure that we can safely pass the payment to a {@link com.cybersource.commercetools.reference.application.service.payment.PaymentService}.
 * Further validations should be defined in the PaymentCreateServiceConfiguration and PaymentUpdate*ServiceConfiguration classes
 * configuration class.
 */
@Configuration
public class ControllerValidationConfiguration {

    private final ObjectMapper objectMapper;

    public ControllerValidationConfiguration(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Bean
    public ResourceValidator<CustomPayment> paymentCreateValidator() {
        return new ResourceValidator<>(List.of(
                new ExpectNoTransactionsValidationRule(objectMapper),
                new ExpectPaymentMethodValidationRule(objectMapper)
        ));
    }

    @Bean
    public ResourceValidator<CustomPayment> paymentUpdateValidator() {
        return new ResourceValidator<>(List.of(
                new MultipleInitialTransactionsValidationRule(objectMapper)
        ));
    }

}
