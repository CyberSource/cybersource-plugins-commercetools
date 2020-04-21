package com.cybersource.commercetools.reference.application.config;

import com.cybersource.commercetools.mapping.model.CustomPayment;
import com.cybersource.commercetools.mapping.model.CybersourceIds;
import com.cybersource.commercetools.mapping.transformer.response.ReasonCodeResponseTransformer;
import com.cybersource.commercetools.mapping.transformer.reversal.AuthReversalRequestTransformer;
import com.cybersource.commercetools.mapping.transformer.reversal.VisaCheckoutAuthReversalRequestTransformer;
import com.cybersource.commercetools.reference.application.factory.payment.PaymentDetailsFactory;
import com.cybersource.commercetools.reference.application.service.payment.PaymentCancelAuthorizationService;
import com.cybersource.commercetools.reference.application.service.payment.PaymentService;
import com.cybersource.commercetools.reference.application.validation.ResourceValidator;
import com.cybersource.commercetools.reference.application.validation.rules.service.CancelAuthAmountEqualsAuthAmountValidationRule;
import com.cybersource.payments.CybersourceClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.sphere.sdk.payments.TransactionState;
import io.sphere.sdk.payments.TransactionType;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.cybersource.commercetools.mapping.constants.PaymentMethodConstants.*;
import static com.cybersource.commercetools.reference.application.validation.rules.service.TransactionValidationRule.doNotExpectTransactionValidationRule;
import static com.cybersource.commercetools.reference.application.validation.rules.service.TransactionValidationRule.expectTransactionValidationRule;

@Configuration
public class PaymentUpdateCancelAuthServiceConfiguration {

    /**
     * Creates a map from payment method to PaymentService for cancelling authorizations
     */
    @Bean
    public Map<String, PaymentService> paymentUpdateCancelAuthServiceMap(
            PaymentService paymentCancelAuthService,
            PaymentService visaCheckoutPaymentCancelAuthService
    ) {
        var paymentCancelAuthServiceMap = new HashMap<String, PaymentService>();
        paymentCancelAuthServiceMap.put(PAYMENT_METHOD_WITHOUT_PAYER_AUTH, paymentCancelAuthService);
        paymentCancelAuthServiceMap.put(PAYMENT_METHOD_WITH_PAYER_AUTH, paymentCancelAuthService);
        paymentCancelAuthServiceMap.put(PAYMENT_METHOD_VISA_CHECKOUT, visaCheckoutPaymentCancelAuthService);
        return paymentCancelAuthServiceMap;
    }

    /**
     * Payment service that will cancel a previously-made authorization request.
     */
    @Bean
    public PaymentService paymentCancelAuthService(
            ObjectMapper objectMapper,
            CybersourceIds cybersourceIds,
            CybersourceClient cybersourceClient,
            PaymentDetailsFactory paymentDetailsFactory
    ) {
        var requestTransformer = new AuthReversalRequestTransformer(cybersourceIds);
        var reasonCodeResponseTransformer = new ReasonCodeResponseTransformer();

        return new PaymentCancelAuthorizationService(paymentDetailsFactory, validator(objectMapper), requestTransformer, reasonCodeResponseTransformer, cybersourceClient);
    }

    /**
     * Payment service that will cancel a previously-made authorization request for Visa Checkout.
     */
    @Bean
    public PaymentService visaCheckoutPaymentCancelAuthService(
            ObjectMapper objectMapper,
            CybersourceIds cybersourceIds,
            CybersourceClient cybersourceClient,
            PaymentDetailsFactory paymentDetailsFactory
    ) {
        var requestTransformer = new VisaCheckoutAuthReversalRequestTransformer(cybersourceIds);
        var reasonCodeResponseTransformer = new ReasonCodeResponseTransformer();

        return new PaymentCancelAuthorizationService(paymentDetailsFactory, validator(objectMapper), requestTransformer, reasonCodeResponseTransformer, cybersourceClient);
    }

    private ResourceValidator<CustomPayment> validator(ObjectMapper objectMapper) {
        return new ResourceValidator<>(List.of(
                expectTransactionValidationRule(objectMapper, TransactionState.INITIAL, TransactionType.CANCEL_AUTHORIZATION),
                expectTransactionValidationRule(objectMapper, TransactionState.SUCCESS, TransactionType.AUTHORIZATION),
                doNotExpectTransactionValidationRule(objectMapper, TransactionState.SUCCESS, TransactionType.CANCEL_AUTHORIZATION),
                new CancelAuthAmountEqualsAuthAmountValidationRule(objectMapper)
        ));
    }


}
