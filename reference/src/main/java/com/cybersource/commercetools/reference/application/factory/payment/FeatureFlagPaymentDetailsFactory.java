package com.cybersource.commercetools.reference.application.factory.payment;

import com.cybersource.commercetools.mapping.model.CustomPayment;
import com.cybersource.commercetools.mapping.model.PaymentDetails;
import com.cybersource.commercetools.reference.application.config.ExtensionConfiguration;
import com.cybersource.commercetools.reference.application.feature.FeatureName;
import com.cybersource.commercetools.reference.application.service.cart.CartRetriever;
import com.cybersource.payments.exception.PaymentException;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class FeatureFlagPaymentDetailsFactory implements PaymentDetailsFactory {

    private final ExtensionConfiguration extensionConfiguration;
    private final CartRetriever cartRetriever;

    public FeatureFlagPaymentDetailsFactory(ExtensionConfiguration extensionConfiguration, CartRetriever cartRetriever) {
        this.extensionConfiguration = extensionConfiguration;
        this.cartRetriever = cartRetriever;
    }

    @Override
    public PaymentDetails paymentDetailsWithoutCart(CustomPayment payment) {
        PaymentDetails paymentDetails = new PaymentDetails(payment);
        return paymentDetailsWithOverrides(paymentDetails);
    }

    @Override
    public PaymentDetails paymentDetailsWithCart(CustomPayment payment) throws PaymentException {
        var cart = cartRetriever.retrieveCart(payment);
        PaymentDetails paymentDetails = new PaymentDetails(payment, cart);
        return paymentDetailsWithOverrides(paymentDetails);
    }

    private PaymentDetails paymentDetailsWithOverrides(PaymentDetails paymentDetails) {
        var decisionManagerFeature = extensionConfiguration.getFeatures().get(FeatureName.DECISION_MANAGER);

        if (decisionManagerFeature != null) {
            paymentDetails.getOverrides().setEnableDecisionManager(Optional.of(decisionManagerFeature.isEnabled()));
        }

        return paymentDetails;
    }
}
