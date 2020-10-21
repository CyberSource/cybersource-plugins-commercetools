package isv.commercetools.reference.application.config;

import static isv.commercetools.mapping.constants.PaymentMethodConstants.PAYMENT_METHOD_VISA_CHECKOUT;
import static isv.commercetools.mapping.constants.PaymentMethodConstants.PAYMENT_METHOD_WITHOUT_PAYER_AUTH;
import static isv.commercetools.mapping.constants.PaymentMethodConstants.PAYMENT_METHOD_WITH_PAYER_AUTH;
import static isv.commercetools.reference.application.validation.rules.service.TransactionValidationRule.doNotExpectTransactionValidationRule;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.sphere.sdk.carts.Cart;
import io.sphere.sdk.client.SphereClient;
import io.sphere.sdk.payments.TransactionState;
import io.sphere.sdk.payments.TransactionType;
import isv.cardinal.service.CardinalService;
import isv.commercetools.mapping.model.PaymentServiceIds;
import isv.commercetools.mapping.transformer.VisaCheckoutDataRequestTransformer;
import isv.commercetools.mapping.transformer.auth.AuthorizationRequestTransformer;
import isv.commercetools.mapping.transformer.auth.visacheckout.VisaCheckoutAuthorizationRequestTransformer;
import isv.commercetools.mapping.transformer.auth.visacheckout.VisaCheckoutUpdateActionCreator;
import isv.commercetools.mapping.transformer.payerauth.AuthorizationWithPayerAuthRequestTransformer;
import isv.commercetools.mapping.transformer.payerauth.PayerAuthValidateResponseTransformer;
import isv.commercetools.mapping.transformer.response.CompositeResponseTransformer;
import isv.commercetools.mapping.transformer.response.PaymentServiceResponseToFieldGroupTransformer;
import isv.commercetools.mapping.transformer.response.DefaultPaymentServiceResponseAddressMapper;
import isv.commercetools.mapping.transformer.response.ReasonCodeResponseTransformer;
import isv.commercetools.mapping.transformer.response.SubscriptionCreateResponseTransformer;
import isv.commercetools.reference.application.factory.payment.PaymentDetailsFactory;
import isv.commercetools.reference.application.service.payment.PaymentAuthorizationService;
import isv.commercetools.reference.application.service.payment.PaymentService;
import isv.commercetools.reference.application.service.payment.visacheckout.VisaCheckoutAuthorizationService;
import isv.commercetools.reference.application.service.payment.visacheckout.VisaCheckoutQueryService;
import isv.commercetools.reference.application.validation.FlexTokenVerifier;
import isv.commercetools.reference.application.validation.ResourceValidator;
import isv.commercetools.reference.application.validation.rules.service.AuthorizationAllowedValidationRule;
import isv.commercetools.reference.application.validation.rules.service.BillingAddressValidationRule;
import isv.commercetools.reference.application.validation.rules.service.ExpectNoEnrollmentDataValidationRule;
import isv.commercetools.reference.application.validation.rules.service.PayerAuthEnrolmentCustomerValidationRule;
import isv.commercetools.reference.application.validation.rules.service.PayerAuthEnrolmentHeadersValidationRule;
import isv.commercetools.reference.application.validation.rules.service.PayerAuthEnrolmentResponseDataValidationRule;
import isv.commercetools.reference.application.validation.rules.service.PaymentGreaterThanZeroValidationRule;
import isv.commercetools.reference.application.validation.rules.service.TokenValidationRule;
import isv.payments.PaymentServiceClient;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@SuppressWarnings("PMD.ExcessiveImports")
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
            PaymentServiceIds paymentServiceIds,
            PaymentServiceClient paymentServiceClient,
            PaymentDetailsFactory paymentDetailsFactory,
            FlexTokenVerifier flexTokenVerifier
    ) {

        var paymentValidator = new ResourceValidator<>(List.of(
                new TokenValidationRule(objectMapper, flexTokenVerifier),
                new PaymentGreaterThanZeroValidationRule(objectMapper),
                new ExpectNoEnrollmentDataValidationRule(objectMapper),
                doNotExpectTransactionValidationRule(objectMapper, TransactionState.SUCCESS, TransactionType.AUTHORIZATION)
        ));

        var cartValidator = new ResourceValidator<>(List.of(
                new BillingAddressValidationRule(objectMapper)
        ));

        var authorizationRequestTransformer = new AuthorizationRequestTransformer(paymentServiceIds);
        var authorizationResponseTransformer = new CompositeResponseTransformer(new ReasonCodeResponseTransformer(), new SubscriptionCreateResponseTransformer());

        return new PaymentAuthorizationService(paymentDetailsFactory, paymentValidator, cartValidator, authorizationRequestTransformer, authorizationResponseTransformer, paymentServiceClient);
    }

    /**
     * Payment authorization service which will authorize payments that do not require 3DS
     */
    @Bean
    public PaymentService visaCheckoutAuthorizationService(
            ObjectMapper objectMapper,
            PaymentServiceIds paymentServiceIds,
            PaymentServiceClient paymentServiceClient,
            SphereClient paymentSphereClient,
            PaymentDetailsFactory paymentDetailsFactory,
        FlexTokenVerifier flexTokenVerifier
    ) {
        var paymentValidator = new ResourceValidator<>(List.of(
                new TokenValidationRule(objectMapper, flexTokenVerifier),
                new ExpectNoEnrollmentDataValidationRule(objectMapper),
                new PaymentGreaterThanZeroValidationRule(objectMapper),
                doNotExpectTransactionValidationRule(objectMapper, TransactionState.SUCCESS, TransactionType.AUTHORIZATION)
        ));

        var cartValidator = new ResourceValidator<Cart>(Collections.emptyList());

        var authorizationRequestTransformer = new VisaCheckoutAuthorizationRequestTransformer(paymentServiceIds);
        var dataRequestTransformer = new VisaCheckoutDataRequestTransformer(paymentServiceIds);

        var authorizationResponseTransformer = new ReasonCodeResponseTransformer();
        var paymentServiceResponseTransformer = new PaymentServiceResponseToFieldGroupTransformer(objectMapper);

        var visaCheckoutQueryService = new VisaCheckoutQueryService(dataRequestTransformer, paymentServiceClient);
        var updateActionCreator = new VisaCheckoutUpdateActionCreator(new DefaultPaymentServiceResponseAddressMapper());

        return new VisaCheckoutAuthorizationService(
                paymentDetailsFactory,
                paymentValidator,
                cartValidator,
                authorizationRequestTransformer,
                authorizationResponseTransformer,
                paymentServiceClient,
                paymentSphereClient,
                visaCheckoutQueryService,
                updateActionCreator,
                paymentServiceResponseTransformer
        );
    }

    /**
     * Payment authorization service which will authorize payments that require 3DS
     */
    @Bean
    public PaymentService paymentWithPayerAuthAuthorizationService(
            ObjectMapper objectMapper,
            CardinalService cardinalService,
            PaymentServiceIds paymentServiceIds,
            PaymentServiceClient paymentServiceClient,
            PaymentDetailsFactory paymentDetailsFactory,
            FlexTokenVerifier flexTokenVerifier
    ) {

        var paymentValidator = new ResourceValidator<>(List.of(
                new TokenValidationRule(objectMapper, flexTokenVerifier),
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

        var authorizationWithPayerAuthRequestTransformer = new AuthorizationWithPayerAuthRequestTransformer(paymentServiceIds);
        var authorizationResponseTransformer = new CompositeResponseTransformer(new ReasonCodeResponseTransformer(), new PayerAuthValidateResponseTransformer("payerAuthValidateReply_", true), new SubscriptionCreateResponseTransformer());

        return new PaymentAuthorizationService(paymentDetailsFactory, paymentValidator, cartValidator, authorizationWithPayerAuthRequestTransformer, authorizationResponseTransformer, paymentServiceClient);
    }

}
