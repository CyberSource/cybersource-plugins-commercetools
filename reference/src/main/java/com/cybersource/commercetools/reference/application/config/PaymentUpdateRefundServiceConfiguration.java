package com.cybersource.commercetools.reference.application.config;

import com.cybersource.commercetools.mapping.model.CustomPayment;
import com.cybersource.commercetools.mapping.model.CybersourceIds;
import com.cybersource.commercetools.mapping.transformer.credit.CreditRequestTransformer;
import com.cybersource.commercetools.mapping.transformer.credit.VisaCheckoutCreditRequestTransformer;
import com.cybersource.commercetools.mapping.transformer.response.ReasonCodeResponseTransformer;
import com.cybersource.commercetools.reference.application.factory.payment.PaymentDetailsFactory;
import com.cybersource.commercetools.reference.application.service.payment.PaymentRefundService;
import com.cybersource.commercetools.reference.application.service.payment.PaymentService;
import com.cybersource.commercetools.reference.application.validation.ResourceValidator;
import com.cybersource.commercetools.reference.application.validation.rules.service.RefundTotalNoMoreThanChargeAmountValidationRule;
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
import static com.cybersource.commercetools.reference.application.validation.rules.service.TransactionValidationRule.expectTransactionValidationRule;

@Configuration
public class PaymentUpdateRefundServiceConfiguration {

    /**
     * Creates a map from payment method to PaymentService for handling refund transactions
     */
    @Bean
    public Map<String, PaymentService> paymentUpdateRefundServiceMap(
            PaymentService paymentRefundService,
            PaymentService visaCheckoutPaymentRefundService
    ) {
        var paymentChargeServiceMap = new HashMap<String, PaymentService>();
        paymentChargeServiceMap.put(PAYMENT_METHOD_WITHOUT_PAYER_AUTH, paymentRefundService);
        paymentChargeServiceMap.put(PAYMENT_METHOD_WITH_PAYER_AUTH, paymentRefundService);
        paymentChargeServiceMap.put(PAYMENT_METHOD_VISA_CHECKOUT, visaCheckoutPaymentRefundService);
        return paymentChargeServiceMap;
    }

    /**
     * Payment service that will refund a previously charged payment.
     */
    @Bean
    public PaymentService paymentRefundService(
            ObjectMapper objectMapper,
            CybersourceIds cybersourceIds,
            CybersourceClient cybersourceClient,
            PaymentDetailsFactory paymentDetailsFactory
    ) {
        var requestTransformer = new CreditRequestTransformer(cybersourceIds);
        var reasonCodeResponseTransformer = new ReasonCodeResponseTransformer();

        return new PaymentRefundService(paymentDetailsFactory, validators(objectMapper), requestTransformer, reasonCodeResponseTransformer, cybersourceClient);
    }

    /**
     * Payment service that will refund a previously charged payment for Visa Checkout.
     */
    @Bean
    public PaymentService visaCheckoutPaymentRefundService(
            ObjectMapper objectMapper,
            CybersourceIds cybersourceIds,
            CybersourceClient cybersourceClient,
            PaymentDetailsFactory paymentDetailsFactory) {
        var requestTransformer = new VisaCheckoutCreditRequestTransformer(cybersourceIds);
        var reasonCodeResponseTransformer = new ReasonCodeResponseTransformer();

        return new PaymentRefundService(paymentDetailsFactory, validators(objectMapper), requestTransformer, reasonCodeResponseTransformer, cybersourceClient);
    }

    private ResourceValidator<CustomPayment> validators(ObjectMapper objectMapper) {
        return new ResourceValidator<>(List.of(
                expectTransactionValidationRule(objectMapper, TransactionState.INITIAL, TransactionType.REFUND),
                expectTransactionValidationRule(objectMapper, TransactionState.SUCCESS, TransactionType.AUTHORIZATION),
                expectTransactionValidationRule(objectMapper, TransactionState.SUCCESS, TransactionType.CHARGE),
                new RefundTotalNoMoreThanChargeAmountValidationRule(objectMapper)
        ));
    }

}
