package isv.commercetools.reference.application.config;

import static isv.commercetools.mapping.constants.PaymentMethodConstants.PAYMENT_METHOD_VISA_CHECKOUT;
import static isv.commercetools.mapping.constants.PaymentMethodConstants.PAYMENT_METHOD_WITHOUT_PAYER_AUTH;
import static isv.commercetools.mapping.constants.PaymentMethodConstants.PAYMENT_METHOD_WITH_PAYER_AUTH;

import com.fasterxml.jackson.databind.ObjectMapper;
import isv.cardinal.service.CardinalService;
import isv.commercetools.mapping.PayerAuthEnrolmentCheckRequestTransformer;
import isv.commercetools.mapping.PayerAuthEnrolmentCheckResponseTransformer;
import isv.commercetools.mapping.model.CybersourceIds;
import isv.commercetools.reference.application.factory.payment.PaymentDetailsFactory;
import isv.commercetools.reference.application.service.payment.NoOpPaymentService;
import isv.commercetools.reference.application.service.payment.PayerAuthEnrolmentCheckService;
import isv.commercetools.reference.application.service.payment.PaymentService;
import isv.commercetools.reference.application.validation.FlexTokenVerifier;
import isv.commercetools.reference.application.validation.ResourceValidator;
import isv.commercetools.reference.application.validation.rules.service.BillingAddressValidationRule;
import isv.commercetools.reference.application.validation.rules.service.PayerAuthEnrolmentCustomerValidationRule;
import isv.commercetools.reference.application.validation.rules.service.PayerAuthEnrolmentHeadersValidationRule;
import isv.commercetools.reference.application.validation.rules.service.PaymentGreaterThanZeroValidationRule;
import isv.commercetools.reference.application.validation.rules.service.TokenValidationRule;
import isv.payments.CybersourceClient;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
            PaymentDetailsFactory paymentDetailsFactory,
            FlexTokenVerifier flexTokenVerifier
    ) {

        var paymentValidator = new ResourceValidator<>(List.of(
                new TokenValidationRule(objectMapper, flexTokenVerifier),
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
