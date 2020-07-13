package isv.commercetools.reference.application.factory.payment;

import isv.commercetools.mapping.model.CustomPayment;
import isv.commercetools.mapping.model.PaymentDetails;
import isv.commercetools.reference.application.config.ExtensionConfiguration;
import isv.commercetools.reference.application.feature.FeatureName;
import isv.commercetools.reference.application.service.cart.CartRetriever;
import isv.payments.exception.PaymentException;
import java.util.Optional;
import org.springframework.stereotype.Component;

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
