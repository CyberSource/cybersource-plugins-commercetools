package com.cybersource.commercetools.reference.application.service.payment;

import com.cybersource.commercetools.mapping.model.CustomPayment;
import com.cybersource.commercetools.mapping.transformer.RequestTransformer;
import com.cybersource.commercetools.mapping.transformer.response.ResponseTransformer;
import com.cybersource.commercetools.reference.application.factory.payment.PaymentDetailsFactory;
import com.cybersource.commercetools.reference.application.validation.ResourceValidator;
import com.cybersource.payments.CybersourceClient;
import io.sphere.sdk.payments.TransactionType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Handles processing INITIAL CANCEL_AUTHORIZATION transactions on payments. Processing a cancellation transaction requires a SUCCESS AUTHORIZATION
 * transaction that contains an interactionId relating to a Cybersource transaction to exist on the payment.
 * Any exceptions thrown while calling cybersource will fail the cancellation and add an interfaceInteraction onto the payment.
 */
public class PaymentCancelAuthorizationService extends BasePaymentService {

    public PaymentCancelAuthorizationService(
            PaymentDetailsFactory paymentDetailsFactory,
            ResourceValidator<CustomPayment> paymentValidator,
            RequestTransformer requestTransformer,
            ResponseTransformer responseTransformer,
            CybersourceClient cybersourceClient
    ) {
        this(paymentDetailsFactory, paymentValidator, requestTransformer, responseTransformer, cybersourceClient, LoggerFactory.getLogger(PaymentCancelAuthorizationService.class));
    }

    protected PaymentCancelAuthorizationService(
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
        return TransactionType.CANCEL_AUTHORIZATION;
    }
}
