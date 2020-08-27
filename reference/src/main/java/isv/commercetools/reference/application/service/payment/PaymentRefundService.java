package isv.commercetools.reference.application.service.payment;

import io.sphere.sdk.payments.TransactionType;
import isv.commercetools.mapping.model.CustomPayment;
import isv.commercetools.mapping.transformer.RequestTransformer;
import isv.commercetools.mapping.transformer.response.ResponseTransformer;
import isv.commercetools.reference.application.factory.payment.PaymentDetailsFactory;
import isv.commercetools.reference.application.validation.ResourceValidator;
import isv.payments.CybersourceClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Handles processing INITIAL REFUND transactions on payments. Processing a refund transaction requires a SUCCESS CHARGE
 * transaction that contains an interactionId relating to a Cybersource transaction to exist on the payment.
 * Any exceptions thrown while calling cybersource will fail the refund and add an interfaceInteraction onto the payment.
 */
public class PaymentRefundService extends BasePaymentService {

    public PaymentRefundService(
            PaymentDetailsFactory paymentDetailsFactory,
            ResourceValidator<CustomPayment> paymentValidator,
            RequestTransformer requestTransformer,
            ResponseTransformer responseTransformer,
            CybersourceClient cybersourceClient
    ) {
        this(paymentDetailsFactory, paymentValidator, requestTransformer, responseTransformer, cybersourceClient, LoggerFactory.getLogger(PaymentRefundService.class));
    }

    protected PaymentRefundService(
            PaymentDetailsFactory paymentDetailsFactory,
            ResourceValidator<CustomPayment> paymentValidator,
            RequestTransformer requestTransformer,
            ResponseTransformer responseTransformer,
            CybersourceClient cybersourceClient,
            Logger logger
    ) {
        super(paymentDetailsFactory, paymentValidator, requestTransformer, responseTransformer, cybersourceClient, logger);
    }

    @Override
    protected TransactionType transactionTypeToProcess() {
        return TransactionType.REFUND;
    }
}
