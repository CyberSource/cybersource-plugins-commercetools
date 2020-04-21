package com.cybersource.commercetools.reference.application.config;

import com.cybersource.cardinal.service.CardinalService;
import com.cybersource.commercetools.mapping.model.CybersourceIds;
import com.cybersource.commercetools.mapping.transformer.VisaCheckoutDataRequestTransformer;
import com.cybersource.commercetools.mapping.transformer.auth.AuthorizationRequestTransformer;
import com.cybersource.commercetools.mapping.transformer.auth.visacheckout.VisaCheckoutAuthorizationRequestTransformer;
import com.cybersource.commercetools.mapping.transformer.auth.visacheckout.VisaCheckoutUpdateActionCreator;
import com.cybersource.commercetools.mapping.transformer.payerauth.AuthorizationWithPayerAuthRequestTransformer;
import com.cybersource.commercetools.mapping.transformer.payerauth.AuthorizationWithPayerAuthResponseTransformer;
import com.cybersource.commercetools.mapping.transformer.response.CybersourceResponseToFieldGroupTransformer;
import com.cybersource.commercetools.mapping.transformer.response.DefaultCybersourceResponseAddressMapper;
import com.cybersource.commercetools.mapping.transformer.response.ReasonCodeResponseTransformer;
import com.cybersource.commercetools.reference.application.factory.payment.PaymentDetailsFactory;
import com.cybersource.commercetools.reference.application.service.payment.PaymentAuthorizationService;
import com.cybersource.commercetools.reference.application.service.payment.PaymentService;
import com.cybersource.commercetools.reference.application.service.payment.visacheckout.VisaCheckoutAuthorizationService;
import com.cybersource.commercetools.reference.application.service.payment.visacheckout.VisaCheckoutQueryService;
import com.cybersource.commercetools.reference.application.validation.ResourceValidator;
import com.cybersource.commercetools.reference.application.validation.rules.service.*;
import com.cybersource.payments.CybersourceClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.sphere.sdk.carts.Cart;
import io.sphere.sdk.client.SphereClient;
import io.sphere.sdk.payments.TransactionState;
import io.sphere.sdk.payments.TransactionType;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.*;

import static com.cybersource.commercetools.mapping.constants.PaymentMethodConstants.*;
import static com.cybersource.commercetools.reference.application.validation.rules.service.TransactionValidationRule.doNotExpectTransactionValidationRule;

@Configuration
public class PaymentUpdateAuthServiceConfiguration {

    /**
     * Creates a map from payment method to PaymentService for handling authorization transactions
     * <p>
     * There are separate PaymentServices configured for payment methods where payer authentication is enabled and
     * where it is disabled. In a typical implementation it would be expected to configure only one of these.
     */
    @Bean
    public Map<String, PaymentService> paymentUpdateAuthServiceMap(
            PaymentService paymentWithoutPayerAuthAuthorizationService,
            PaymentService paymentWithPayerAuthAuthorizationService,
            PaymentService visaCheckoutAuthorizationService
    ) {
        var paymentUpdateServiceMap = new HashMap<String, PaymentService>();

        paymentUpdateServiceMap.put(PAYMENT_METHOD_WITHOUT_PAYER_AUTH, paymentWithoutPayerAuthAuthorizationService);
        paymentUpdateServiceMap.put(PAYMENT_METHOD_VISA_CHECKOUT, visaCheckoutAuthorizationService);
        paymentUpdateServiceMap.put(PAYMENT_METHOD_WITH_PAYER_AUTH, paymentWithPayerAuthAuthorizationService);
        return paymentUpdateServiceMap;
    }

    /**
     * Payment authorization service which will authorize payments that do not require 3DS
     */
    @Bean
    public PaymentService paymentWithoutPayerAuthAuthorizationService(
            ObjectMapper objectMapper,
            CybersourceIds cybersourceIds,
            CybersourceClient cybersourceClient,
            PaymentDetailsFactory paymentDetailsFactory
    ) {

        var paymentValidator = new ResourceValidator<>(List.of(
                new TokenValidationRule(objectMapper),
                new PaymentGreaterThanZeroValidationRule(objectMapper),
                new ExpectNoEnrollmentDataValidationRule(objectMapper),
                doNotExpectTransactionValidationRule(objectMapper, TransactionState.SUCCESS, TransactionType.AUTHORIZATION)
        ));

        var cartValidator = new ResourceValidator<>(List.of(
                new BillingAddressValidationRule(objectMapper)
        ));

        var authorizationRequestTransformer = new AuthorizationRequestTransformer(cybersourceIds);
        var authorizationResponseTransformer = new ReasonCodeResponseTransformer();

        return new PaymentAuthorizationService(paymentDetailsFactory, paymentValidator, cartValidator, authorizationRequestTransformer, authorizationResponseTransformer, cybersourceClient);
    }

    /**
     * Payment authorization service which will authorize payments that do not require 3DS
     */
    @Bean
    public PaymentService visaCheckoutAuthorizationService(
            ObjectMapper objectMapper,
            CybersourceIds cybersourceIds,
            CybersourceClient cybersourceClient,
            SphereClient paymentSphereClient,
            PaymentDetailsFactory paymentDetailsFactory
    ) {
        var paymentValidator = new ResourceValidator<>(List.of(
                new TokenValidationRule(objectMapper),
                new ExpectNoEnrollmentDataValidationRule(objectMapper),
                new PaymentGreaterThanZeroValidationRule(objectMapper),
                doNotExpectTransactionValidationRule(objectMapper, TransactionState.SUCCESS, TransactionType.AUTHORIZATION)
        ));

        var cartValidator = new ResourceValidator<Cart>(Collections.emptyList());

        var authorizationRequestTransformer = new VisaCheckoutAuthorizationRequestTransformer(cybersourceIds);
        var dataRequestTransformer = new VisaCheckoutDataRequestTransformer(cybersourceIds);

        var authorizationResponseTransformer = new ReasonCodeResponseTransformer();
        var cybersourceResponseTransformer = new CybersourceResponseToFieldGroupTransformer(objectMapper);

        var visaCheckoutQueryService = new VisaCheckoutQueryService(dataRequestTransformer, cybersourceClient);
        var updateActionCreator = new VisaCheckoutUpdateActionCreator(new DefaultCybersourceResponseAddressMapper());

        return new VisaCheckoutAuthorizationService(
                paymentDetailsFactory,
                paymentValidator,
                cartValidator,
                authorizationRequestTransformer,
                authorizationResponseTransformer,
                cybersourceClient,
                paymentSphereClient,
                visaCheckoutQueryService,
                updateActionCreator,
                cybersourceResponseTransformer
        );
    }

    /**
     * Payment authorization service which will authorize payments that require 3DS
     */
    @Bean
    public PaymentService paymentWithPayerAuthAuthorizationService(
            ObjectMapper objectMapper,
            CardinalService cardinalService,
            CybersourceIds cybersourceIds,
            CybersourceClient cybersourceClient,
            PaymentDetailsFactory paymentDetailsFactory
    ) {

        var paymentValidator = new ResourceValidator<>(List.of(
                new TokenValidationRule(objectMapper),
                new PaymentGreaterThanZeroValidationRule(objectMapper),
                new PayerAuthEnrolmentHeadersValidationRule(objectMapper),
                new PayerAuthEnrolmentResponseDataValidationRule(objectMapper, cardinalService),
                new AuthorizationAllowedValidationRule(objectMapper),
                doNotExpectTransactionValidationRule(objectMapper, TransactionState.SUCCESS, TransactionType.AUTHORIZATION)
        ));

        var cartValidator = new ResourceValidator<>(List.of(
                new BillingAddressValidationRule(objectMapper),
                new PayerAuthEnrolmentCustomerValidationRule(objectMapper)
        ));

        var authorizationWithPayerAuthRequestTransformer = new AuthorizationWithPayerAuthRequestTransformer(cybersourceIds);
        var authorizationWithPayerAuthResponseTransformer = new AuthorizationWithPayerAuthResponseTransformer();

        return new PaymentAuthorizationService(paymentDetailsFactory, paymentValidator, cartValidator, authorizationWithPayerAuthRequestTransformer, authorizationWithPayerAuthResponseTransformer, cybersourceClient);
    }

}
