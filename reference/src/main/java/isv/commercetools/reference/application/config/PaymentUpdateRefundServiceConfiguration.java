package isv.commercetools.reference.application.config;

import static isv.commercetools.mapping.constants.PaymentMethodConstants.PAYMENT_METHOD_VISA_CHECKOUT;
import static isv.commercetools.mapping.constants.PaymentMethodConstants.PAYMENT_METHOD_WITHOUT_PAYER_AUTH;
import static isv.commercetools.mapping.constants.PaymentMethodConstants.PAYMENT_METHOD_WITH_PAYER_AUTH;
import static isv.commercetools.reference.application.validation.rules.service.TransactionValidationRule.expectTransactionValidationRule;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.sphere.sdk.payments.TransactionState;
import io.sphere.sdk.payments.TransactionType;
import isv.commercetools.mapping.model.CustomPayment;
import isv.commercetools.mapping.model.PaymentServiceIds;
import isv.commercetools.mapping.transformer.credit.CreditRequestTransformer;
import isv.commercetools.mapping.transformer.credit.VisaCheckoutCreditRequestTransformer;
import isv.commercetools.mapping.transformer.response.ReasonCodeResponseTransformer;
import isv.commercetools.reference.application.factory.payment.PaymentDetailsFactory;
import isv.commercetools.reference.application.service.payment.PaymentRefundService;
import isv.commercetools.reference.application.service.payment.PaymentService;
import isv.commercetools.reference.application.validation.ResourceValidator;
import isv.commercetools.reference.application.validation.rules.service.RefundTotalNoMoreThanChargeAmountValidationRule;
import isv.payments.PaymentServiceClient;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
            PaymentServiceIds paymentServiceIds,
            PaymentServiceClient paymentServiceClient,
            PaymentDetailsFactory paymentDetailsFactory
    ) {
        var requestTransformer = new CreditRequestTransformer(paymentServiceIds);
        var reasonCodeResponseTransformer = new ReasonCodeResponseTransformer();

        return new PaymentRefundService(paymentDetailsFactory, validators(objectMapper), requestTransformer, reasonCodeResponseTransformer, paymentServiceClient);
    }

    /**
     * Payment service that will refund a previously charged payment for Visa Checkout.
     */
    @Bean
    public PaymentService visaCheckoutPaymentRefundService(
            ObjectMapper objectMapper,
            PaymentServiceIds paymentServiceIds,
            PaymentServiceClient paymentServiceClient,
            PaymentDetailsFactory paymentDetailsFactory) {
        var requestTransformer = new VisaCheckoutCreditRequestTransformer(paymentServiceIds);
        var reasonCodeResponseTransformer = new ReasonCodeResponseTransformer();

        return new PaymentRefundService(paymentDetailsFactory, validators(objectMapper), requestTransformer, reasonCodeResponseTransformer, paymentServiceClient);
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
