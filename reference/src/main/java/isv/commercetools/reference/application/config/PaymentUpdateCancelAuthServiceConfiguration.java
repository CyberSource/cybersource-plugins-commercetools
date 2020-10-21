package isv.commercetools.reference.application.config;

import static isv.commercetools.mapping.constants.PaymentMethodConstants.*;
import static isv.commercetools.reference.application.validation.rules.service.TransactionValidationRule.doNotExpectTransactionValidationRule;
import static isv.commercetools.reference.application.validation.rules.service.TransactionValidationRule.expectTransactionValidationRule;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.sphere.sdk.payments.TransactionState;
import io.sphere.sdk.payments.TransactionType;
import isv.commercetools.mapping.model.CustomPayment;
import isv.commercetools.mapping.model.PaymentServiceIds;
import isv.commercetools.mapping.transformer.response.ReasonCodeResponseTransformer;
import isv.commercetools.mapping.transformer.reversal.AuthReversalRequestTransformer;
import isv.commercetools.mapping.transformer.reversal.VisaCheckoutAuthReversalRequestTransformer;
import isv.commercetools.reference.application.factory.payment.PaymentDetailsFactory;
import isv.commercetools.reference.application.service.payment.PaymentCancelAuthorizationService;
import isv.commercetools.reference.application.service.payment.PaymentService;
import isv.commercetools.reference.application.validation.ResourceValidator;
import isv.commercetools.reference.application.validation.rules.service.CancelAuthAmountEqualsAuthAmountValidationRule;
import isv.payments.PaymentServiceClient;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
            PaymentServiceIds paymentServiceIds,
            PaymentServiceClient paymentServiceClient,
            PaymentDetailsFactory paymentDetailsFactory
    ) {
        var requestTransformer = new AuthReversalRequestTransformer(paymentServiceIds);
        var reasonCodeResponseTransformer = new ReasonCodeResponseTransformer();

        return new PaymentCancelAuthorizationService(paymentDetailsFactory, validator(objectMapper), requestTransformer, reasonCodeResponseTransformer, paymentServiceClient);
    }

    /**
     * Payment service that will cancel a previously-made authorization request for Visa Checkout.
     */
    @Bean
    public PaymentService visaCheckoutPaymentCancelAuthService(
            ObjectMapper objectMapper,
            PaymentServiceIds paymentServiceIds,
            PaymentServiceClient paymentServiceClient,
            PaymentDetailsFactory paymentDetailsFactory
    ) {
        var requestTransformer = new VisaCheckoutAuthReversalRequestTransformer(paymentServiceIds);
        var reasonCodeResponseTransformer = new ReasonCodeResponseTransformer();

        return new PaymentCancelAuthorizationService(paymentDetailsFactory, validator(objectMapper), requestTransformer, reasonCodeResponseTransformer, paymentServiceClient);
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
