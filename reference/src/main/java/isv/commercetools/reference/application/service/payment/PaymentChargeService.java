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
 * Handles processing INITIAL CHARGE transactions on payments. Processing a charge transaction requires a SUCCESS AUTHORIZATION
 * transaction that contains an interactionId relating to a payment service transaction to exist on the payment.
 * Any exceptions thrown while calling the payment service will fail the charge and add an interfaceInteraction onto the payment.
 */

public class PaymentChargeService extends BasePaymentService {

    public PaymentChargeService(
            PaymentDetailsFactory paymentDetailsFactory,
            ResourceValidator<CustomPayment> paymentValidator,
            RequestTransformer requestTransformer,
            ResponseTransformer responseTransformer,
            PaymentServiceClient paymentServiceClient
    ) {
        this(paymentDetailsFactory, paymentValidator, requestTransformer, responseTransformer, paymentServiceClient, LoggerFactory.getLogger(PaymentChargeService.class));
    }

    protected PaymentChargeService(
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
        return TransactionType.CHARGE;
    }
}
