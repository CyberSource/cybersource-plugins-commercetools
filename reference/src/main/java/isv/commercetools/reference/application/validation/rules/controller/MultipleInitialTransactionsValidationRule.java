package isv.commercetools.reference.application.validation.rules.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.sphere.sdk.payments.TransactionState;
import isv.commercetools.api.extension.model.ExtensionError;
import isv.commercetools.api.extension.validation.InputValidator;
import isv.commercetools.mapping.model.CustomPayment;
import java.util.ArrayList;
import java.util.List;

/**
 * Returns an Invalid Input error if there are multiple transactions on the payment with an Initial transaction state.
 */
public class MultipleInitialTransactionsValidationRule extends InputValidator<CustomPayment> {

    public MultipleInitialTransactionsValidationRule(ObjectMapper objectMapper) {
        super(objectMapper);
    }

    @Override
    public List<ExtensionError> validate(CustomPayment payment) {
        var result = new ArrayList<ExtensionError>();
        var initialTransactionsCount = payment.getBasePayment().getTransactions().stream()
                .filter(it -> it.getState() == TransactionState.INITIAL)
                .count();
        if (initialTransactionsCount > 1) {
            result.add(invalidInputError("Cannot process this payment as it has multiple transactions with Initial state"));
        }
        return result;
    }
}
