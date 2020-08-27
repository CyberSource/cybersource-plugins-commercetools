package isv.commercetools.reference.application.service.payment;

import static java.util.Collections.emptyList;
import static java.util.Collections.singletonMap;

import io.sphere.sdk.commands.UpdateAction;
import io.sphere.sdk.payments.Transaction;
import io.sphere.sdk.payments.TransactionState;
import io.sphere.sdk.payments.TransactionType;
import io.sphere.sdk.payments.commands.updateactions.AddInterfaceInteraction;
import io.sphere.sdk.payments.commands.updateactions.ChangeTransactionState;
import isv.commercetools.api.extension.model.ExtensionError;
import isv.commercetools.mapping.constants.PaymentErrorDataConstants;
import isv.commercetools.mapping.constants.PaymentFailureDataConstants;
import isv.commercetools.mapping.model.CustomPayment;
import isv.commercetools.mapping.model.PaymentDetails;
import isv.commercetools.mapping.transformer.RequestTransformer;
import isv.commercetools.mapping.transformer.response.ResponseTransformer;
import isv.commercetools.reference.application.factory.payment.PaymentDetailsFactory;
import isv.commercetools.reference.application.validation.ResourceValidator;
import isv.payments.CybersourceClient;
import isv.payments.exception.PaymentException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;

/**
 * Base class for handling processing INITIAL transactions on payments.
 */
public abstract class BasePaymentService implements PaymentService {

    private final RequestTransformer requestTransformer;
    private final CybersourceClient cybersourceClient;
    private final Logger logger;
    private final ResponseTransformer responseTransformer;
    protected final PaymentDetailsFactory paymentDetailsFactory;
    private final ResourceValidator<CustomPayment> paymentValidator;

    public BasePaymentService(
            PaymentDetailsFactory paymentDetailsFactory,
            ResourceValidator<CustomPayment> paymentValidator,
            RequestTransformer requestTransformer,
            ResponseTransformer responseTransformer,
            CybersourceClient cybersourceClient,
            Logger logger) {
        this.paymentDetailsFactory = paymentDetailsFactory;
        this.paymentValidator = paymentValidator;
        this.requestTransformer = requestTransformer;
        this.responseTransformer = responseTransformer;
        this.cybersourceClient = cybersourceClient;
        this.logger = logger;
    }

    @Override
    public PaymentDetails populatePaymentDetails(CustomPayment payment) throws PaymentException {
        return paymentDetailsFactory.paymentDetailsWithoutCart(payment);
    }

    @Override
    public List<ExtensionError> validate(PaymentDetails paymentDetails) {
        return paymentValidator.validate(paymentDetails.getCustomPayment());
    }

    @Override
    public List<UpdateAction> process(PaymentDetails paymentDetails) {
        List<UpdateAction> response = emptyList();
        var payment = paymentDetails.getCustomPayment();
        var optionalTransaction = getTransactionToProcess(payment);
        if (optionalTransaction.isPresent()) {
            var transactionToProcess = optionalTransaction.get();
            var request = requestTransformer.transform(paymentDetails);
            try {
                Map cybersourceResponse = cybersourceClient.makeRequest(request);
                logger.info("Response received: {}", cybersourceResponse.toString());
                response = responseTransformer.transform(cybersourceResponse, transactionToProcess);
            } catch (PaymentException exception) {
                logger.error(String.format("Received PaymentException when trying to process transaction %s on payment %s", transactionToProcess.getId(), payment.getId()), exception);
                response = handlePaymentException(exception, transactionToProcess);
            }
        } else {
            logger.error(String.format("%s called for payment %s but payment had no %s transaction", this.getClass().getSimpleName(), payment.getId(), transactionTypeToProcess()));
        }
        return response;
    }

    private List<UpdateAction> handlePaymentException(PaymentException exception, Transaction transaction) {
        return buildErrorActions(transaction, exception.getMessage());
    }

    private List<UpdateAction> buildErrorActions(Transaction authTransaction, String reason) {
        var updateAction = ChangeTransactionState.of(TransactionState.FAILURE, authTransaction.getId());
        var interactionAction = AddInterfaceInteraction.ofTypeKeyAndObjects(
                PaymentFailureDataConstants.TYPE_KEY,
                singletonMap(PaymentErrorDataConstants.REASON, reason)
        );
        return List.of(updateAction, interactionAction);
    }

    protected Optional<Transaction> getTransactionToProcess(CustomPayment payment) {
        return payment.getBasePayment().getTransactions().stream()
                .filter(it -> it.getType() == transactionTypeToProcess())
                .filter(it -> it.getState() == TransactionState.INITIAL)
                .findFirst();
    }

    protected abstract TransactionType transactionTypeToProcess();

}
