package com.cybersource.commercetools.reference.application.service.payment;

import com.cybersource.commercetools.api.extension.model.ExtensionError;
import com.cybersource.commercetools.mapping.model.PaymentDetails;
import com.cybersource.commercetools.mapping.model.CustomPayment;
import com.cybersource.commercetools.mapping.transformer.RequestTransformer;
import com.cybersource.commercetools.mapping.transformer.response.ResponseTransformer;
import com.cybersource.commercetools.reference.application.factory.payment.PaymentDetailsFactory;
import com.cybersource.commercetools.reference.application.validation.ResourceValidator;
import com.cybersource.payments.CybersourceClient;
import com.cybersource.payments.exception.PaymentException;
import io.sphere.sdk.carts.Cart;
import io.sphere.sdk.payments.TransactionType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

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
