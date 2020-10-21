package isv.commercetools.reference.application.service.payment;

import io.sphere.sdk.payments.TransactionType;
import isv.commercetools.mapping.model.CustomPayment;
import isv.commercetools.mapping.transformer.RequestTransformer;
import isv.commercetools.mapping.transformer.response.ResponseTransformer;
import isv.commercetools.reference.application.factory.payment.PaymentDetailsFactory;
import isv.commercetools.reference.application.validation.ResourceValidator;
import isv.payments.PaymentServiceClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Handles processing INITIAL CANCEL_AUTHORIZATION transactions on payments. Processing a cancellation transaction requires a SUCCESS AUTHORIZATION
 * transaction that contains an interactionId relating to a payment service transaction to exist on the payment.
 * Any exceptions thrown while calling the payment service will fail the cancellation and add an interfaceInteraction onto the payment.
 */
public class PaymentCancelAuthorizationService extends BasePaymentService {

    public PaymentCancelAuthorizationService(
            PaymentDetailsFactory paymentDetailsFactory,
            ResourceValidator<CustomPayment> paymentValidator,
            RequestTransformer requestTransformer,
            ResponseTransformer responseTransformer,
            PaymentServiceClient paymentServiceClient
    ) {
        this(paymentDetailsFactory, paymentValidator, requestTransformer, responseTransformer, paymentServiceClient, LoggerFactory.getLogger(PaymentCancelAuthorizationService.class));
    }

    protected PaymentCancelAuthorizationService(
            PaymentDetailsFactory paymentDetailsFactory,
            ResourceValidator<CustomPayment> paymentValidator,
            RequestTransformer requestTransformer,
            ResponseTransformer responseTransformer,
            PaymentServiceClient paymentServiceClient,
            Logger logger
    ) {
        super(paymentDetailsFactory, paymentValidator, requestTransformer, responseTransformer, paymentServiceClient, logger);
    }

    @Override
    protected TransactionType transactionTypeToProcess() {
        return TransactionType.CANCEL_AUTHORIZATION;
    }
}
