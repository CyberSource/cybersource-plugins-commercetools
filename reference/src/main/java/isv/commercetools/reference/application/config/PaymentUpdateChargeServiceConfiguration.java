package isv.commercetools.reference.application.config;

import static isv.commercetools.mapping.constants.PaymentMethodConstants.*;
import static isv.commercetools.reference.application.validation.rules.service.TransactionValidationRule.doNotExpectTransactionValidationRule;
import static isv.commercetools.reference.application.validation.rules.service.TransactionValidationRule.expectTransactionValidationRule;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.sphere.sdk.payments.TransactionState;
import io.sphere.sdk.payments.TransactionType;
import isv.commercetools.mapping.model.CybersourceIds;
import isv.commercetools.mapping.transformer.capture.CaptureRequestTransformer;
import isv.commercetools.mapping.transformer.capture.VisaCheckoutCaptureRequestTransformer;
import isv.commercetools.mapping.transformer.response.ReasonCodeResponseTransformer;
import isv.commercetools.reference.application.factory.payment.PaymentDetailsFactory;
import isv.commercetools.reference.application.service.payment.PaymentChargeService;
import isv.commercetools.reference.application.service.payment.PaymentService;
import isv.commercetools.reference.application.validation.ResourceValidator;
import isv.payments.CybersourceClient;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PaymentUpdateChargeServiceConfiguration {

    /**
     * Creates a map from payment method to PaymentService for handling payment charges
     */
    @Bean
    public Map<String, PaymentService> paymentUpdateChargeServiceMap(
            PaymentService paymentChargeService,
            PaymentService visaCheckoutPaymentChargeService
    ) {
        var paymentChargeServiceMap = new HashMap<String, PaymentService>();
        paymentChargeServiceMap.put(PAYMENT_METHOD_WITHOUT_PAYER_AUTH, paymentChargeService);
        paymentChargeServiceMap.put(PAYMENT_METHOD_WITH_PAYER_AUTH, paymentChargeService);
        paymentChargeServiceMap.put(PAYMENT_METHOD_VISA_CHECKOUT, visaCheckoutPaymentChargeService);
        return paymentChargeServiceMap;
    }

    /**
     * Payment service that will charge a previously-made authorization request.
     */
    @Bean
    public PaymentService paymentChargeService(
            ObjectMapper objectMapper,
            CybersourceIds cybersourceIds,
            CybersourceClient cybersourceClient,
            PaymentDetailsFactory paymentDetailsFactory
    ) {
        var requestTransformer = new CaptureRequestTransformer(cybersourceIds);
        var reasonCodeResponseTransformer = new ReasonCodeResponseTransformer();

        var validator = new ResourceValidator<>(List.of(
                expectTransactionValidationRule(objectMapper, TransactionState.INITIAL, TransactionType.CHARGE),
                expectTransactionValidationRule(objectMapper, TransactionState.SUCCESS, TransactionType.AUTHORIZATION),
                doNotExpectTransactionValidationRule(objectMapper, TransactionState.SUCCESS, TransactionType.CHARGE)
        ));
        return new PaymentChargeService(paymentDetailsFactory, validator, requestTransformer, reasonCodeResponseTransformer, cybersourceClient);
    }

    /**
     * Payment service that will charge a previously-made authorization request.
     */
    @Bean
    public PaymentService visaCheckoutPaymentChargeService(
            ObjectMapper objectMapper,
            CybersourceIds cybersourceIds,
            CybersourceClient cybersourceClient,
            PaymentDetailsFactory paymentDetailsFactory
    ) {
        var requestTransformer = new VisaCheckoutCaptureRequestTransformer(cybersourceIds);
        var reasonCodeResponseTransformer = new ReasonCodeResponseTransformer();

        var validator = new ResourceValidator<>(List.of(
                expectTransactionValidationRule(objectMapper, TransactionState.INITIAL, TransactionType.CHARGE),
                expectTransactionValidationRule(objectMapper, TransactionState.SUCCESS, TransactionType.AUTHORIZATION),
                doNotExpectTransactionValidationRule(objectMapper, TransactionState.SUCCESS, TransactionType.CHARGE)
        ));
        return new PaymentChargeService(paymentDetailsFactory, validator, requestTransformer, reasonCodeResponseTransformer, cybersourceClient);
    }

}
