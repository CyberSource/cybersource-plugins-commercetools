package isv.commercetools.reference.application.config;

import io.sphere.sdk.payments.TransactionType;
import isv.commercetools.reference.application.service.payment.PaymentService;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PaymentUpdateServiceConfiguration {

    @Bean
    public Map<TransactionType, Map<String, PaymentService>> paymentUpdateServiceMap(
        @Qualifier("paymentUpdateAuthServiceMap") Map<String, PaymentService> paymentUpdateAuthServiceMap,
        @Qualifier("paymentUpdateChargeServiceMap") Map<String, PaymentService> paymentUpdateChargeServiceMap,
        @Qualifier("paymentUpdateCancelAuthServiceMap") Map<String, PaymentService> paymentUpdateCancelAuthServiceMap,
        @Qualifier("paymentUpdateRefundServiceMap") Map<String, PaymentService> paymentUpdateRefundServiceMap
    ) {
        var paymentUpdateServiceMap = new HashMap<TransactionType, Map<String, PaymentService>>();
        paymentUpdateServiceMap.put(TransactionType.AUTHORIZATION, paymentUpdateAuthServiceMap);
        paymentUpdateServiceMap.put(TransactionType.CHARGE, paymentUpdateChargeServiceMap);
        paymentUpdateServiceMap.put(TransactionType.CANCEL_AUTHORIZATION, paymentUpdateCancelAuthServiceMap);
        paymentUpdateServiceMap.put(TransactionType.REFUND, paymentUpdateRefundServiceMap);
        return paymentUpdateServiceMap;
    }

}
