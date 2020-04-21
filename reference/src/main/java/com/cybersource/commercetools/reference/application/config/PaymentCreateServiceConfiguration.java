package com.cybersource.commercetools.reference.application.config;

import com.cybersource.cardinal.service.CardinalService;
import com.cybersource.commercetools.mapping.PayerAuthEnrolmentCheckRequestTransformer;
import com.cybersource.commercetools.mapping.PayerAuthEnrolmentCheckResponseTransformer;
import com.cybersource.commercetools.mapping.model.CybersourceIds;
import com.cybersource.commercetools.reference.application.factory.payment.PaymentDetailsFactory;
import com.cybersource.commercetools.reference.application.service.payment.NoOpPaymentService;
import com.cybersource.commercetools.reference.application.service.payment.PayerAuthEnrolmentCheckService;
import com.cybersource.commercetools.reference.application.service.payment.PaymentService;
import com.cybersource.commercetools.reference.application.validation.ResourceValidator;
import com.cybersource.commercetools.reference.application.validation.rules.service.*;
import com.cybersource.payments.CybersourceClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.cybersource.commercetools.mapping.constants.PaymentMethodConstants.*;

@Configuration
public class PaymentCreateServiceConfiguration {

    /**
     * Creates a map from payment method to PaymentService for handling Payment creates
     * <p>
     * Payments without payer authentication enabled are configured with a service that returns empty success responses
     */
    @Bean
    public Map<String, PaymentService> paymentCreateServiceMap(
            PaymentService payerAuthEnrolmentCheckService
    ) {
        var paymentCreateServiceMap = new HashMap<String, PaymentService>();
        paymentCreateServiceMap.put(PAYMENT_METHOD_WITHOUT_PAYER_AUTH, new NoOpPaymentService());
        paymentCreateServiceMap.put(PAYMENT_METHOD_VISA_CHECKOUT, new NoOpPaymentService());
        paymentCreateServiceMap.put(PAYMENT_METHOD_WITH_PAYER_AUTH, payerAuthEnrolmentCheckService);
        return paymentCreateServiceMap;
    }

    /**
     * Payment service that makes a Payer Auth Enrolment check request, and saves response values onto the payment.
     */
    @Bean
    public PaymentService payerAuthEnrolmentCheckService(
            CybersourceIds cybersourceIds,
            CybersourceClient cybersourceClient,
            CardinalService cardinalService,
            ObjectMapper objectMapper,
            PaymentDetailsFactory paymentDetailsFactory
    ) {

        var paymentValidator = new ResourceValidator<>(List.of(
                new TokenValidationRule(objectMapper),
                new PaymentGreaterThanZeroValidationRule(objectMapper),
                new PayerAuthEnrolmentHeadersValidationRule(objectMapper)
        ));

        var cartValidator = new ResourceValidator<>(List.of(
                new BillingAddressValidationRule(objectMapper),
                new PayerAuthEnrolmentCustomerValidationRule(objectMapper)
        ));

        var requestTransformer = new PayerAuthEnrolmentCheckRequestTransformer(cybersourceIds, cardinalService);
        var responseTransformer = new PayerAuthEnrolmentCheckResponseTransformer(cardinalService);
        return new PayerAuthEnrolmentCheckService(paymentDetailsFactory, paymentValidator, cartValidator, requestTransformer, responseTransformer, cybersourceClient);
    }

}
