package isv.commercetools.reference.application.service.extension;

import io.sphere.sdk.payments.Transaction;
import io.sphere.sdk.payments.TransactionState;
import io.sphere.sdk.payments.TransactionType;
import isv.commercetools.api.extension.model.ErrorCode;
import isv.commercetools.api.extension.model.ExtensionError;
import isv.commercetools.api.extension.model.ExtensionOutput;
import isv.commercetools.mapping.model.CustomPayment;
import isv.commercetools.reference.application.service.payment.PaymentService;
import isv.payments.exception.PaymentException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * A service which takes Commercetools payments and calls the correct PaymentService depending on what transactions exist
 * on the payment. This class will only process the first INITIAL transaction it finds.
 */
@Component
@SuppressWarnings("PMD.AvoidLiteralsInIfCondition")
public class PaymentUpdateExtensionService implements ExtensionService {

    private static final Logger LOGGER = LoggerFactory.getLogger(PaymentUpdateExtensionService.class);

    private final Map<TransactionType, Map<String, PaymentService>> paymentUpdateServiceMap;

    public PaymentUpdateExtensionService(
            Map<TransactionType, Map<String, PaymentService>> paymentUpdateServiceMap
    ) {
        this.paymentUpdateServiceMap = paymentUpdateServiceMap;
    }

    @Override
    public ExtensionOutput process(CustomPayment payment) {
        var extensionOutput = new ExtensionOutput();

        var optionalInitialTransaction = getInitialTransaction(payment);

        if (optionalInitialTransaction.isPresent()) {
            var transaction = optionalInitialTransaction.get();
            var paymentService = paymentUpdateServiceMap.get(transaction.getType()).get(payment.getPaymentMethod());
            if (paymentService == null) {
                LOGGER.warn("Could not determine how to process INITIAL transaction on payment {}, returning empty extension response", payment.getId());
                extensionOutput = new ExtensionOutput();
            } else {
                extensionOutput = process(payment, paymentService);
            }
        }

        return extensionOutput;
    }

    private ExtensionOutput process(CustomPayment payment, PaymentService paymentService) {
        ExtensionOutput response;
        try {
            var paymentDetails = paymentService.populatePaymentDetails(payment);
            var errors = paymentService.validate(paymentDetails);

            if (errors.isEmpty()) {
                var actions = paymentService.process(paymentDetails);
                response = new ExtensionOutput().withActions(actions);
            } else {
                response = new ExtensionOutput().withErrors(errors);
            }
        } catch (PaymentException e) {
            LOGGER.error("Failed to process payment update", e);
            response = new ExtensionOutput().withErrors(List.of(
                    new ExtensionError(ErrorCode.INVALID_OPERATION, e.getMessage())
            ));
        }
        return response;
    }

    private Optional<Transaction> getInitialTransaction(CustomPayment payment) {
        return payment.getBasePayment().getTransactions()
                .stream()
                .filter(it -> it.getState() == TransactionState.INITIAL)
                .findFirst();
    }

}
