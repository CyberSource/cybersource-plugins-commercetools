package isv.commercetools.reference.application.service.payment;

import io.sphere.sdk.carts.Cart;
import io.sphere.sdk.payments.TransactionType;
import isv.commercetools.api.extension.model.ExtensionError;
import isv.commercetools.mapping.model.CustomPayment;
import isv.commercetools.mapping.model.PaymentDetails;
import isv.commercetools.mapping.transformer.RequestTransformer;
import isv.commercetools.mapping.transformer.response.ResponseTransformer;
import isv.commercetools.reference.application.factory.payment.PaymentDetailsFactory;
import isv.commercetools.reference.application.validation.ResourceValidator;
import isv.payments.CybersourceClient;
import isv.payments.exception.PaymentException;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/***
 * Attempts to authorizeTransactions a payment when a payment has an INITIAL AUTHORIZATION transaction. This class
 * will only handle one authorization - if there are multiple authorizations on the payment, only one will be processed.
 * If there are no Initial Authorization transactions, will return an empty list of actions. If there is any error in authorizing,
 * will set the authorization transaction state to Failed and add an error message to the payment's interfaceInteractions.
 */
@SuppressWarnings("unchecked")
public class PaymentAuthorizationService extends BasePaymentService {

    private final ResourceValidator<Cart> cartValidator;

    public PaymentAuthorizationService(
            PaymentDetailsFactory paymentDetailsFactory,
            ResourceValidator<CustomPayment> paymentValidator,
            ResourceValidator<Cart> cartValidator,
            RequestTransformer authorizationRequestTransformer,
            ResponseTransformer responseTransformer,
            CybersourceClient cybersourceClient
    ) {
        this(paymentDetailsFactory, paymentValidator, cartValidator, authorizationRequestTransformer, responseTransformer, cybersourceClient, LoggerFactory.getLogger(PaymentAuthorizationService.class));
    }

    protected PaymentAuthorizationService(
            PaymentDetailsFactory paymentDetailsFactory,
            ResourceValidator<CustomPayment> paymentValidator,
            ResourceValidator<Cart> cartValidator,
            RequestTransformer authorizationRequestTransformer,
            ResponseTransformer responseTransformer,
            CybersourceClient cybersourceClient,
            Logger logger
    ) {
        super(paymentDetailsFactory, paymentValidator, authorizationRequestTransformer, responseTransformer, cybersourceClient, logger);
        this.cartValidator = cartValidator;
    }

    @Override
    public PaymentDetails populatePaymentDetails(CustomPayment payment) throws PaymentException {
        return paymentDetailsFactory.paymentDetailsWithCart(payment);
    }

    @Override
    protected TransactionType transactionTypeToProcess() {
        return TransactionType.AUTHORIZATION;
    }

    @Override
    public List<ExtensionError> validate(PaymentDetails paymentDetails) {
        var errors = super.validate(paymentDetails);
        errors.addAll(cartValidator.validate(paymentDetails.getCart()));
        return errors;
    }

}
