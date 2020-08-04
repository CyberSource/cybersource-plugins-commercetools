package isv.commercetools.reference.application.validation.rules.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import isv.commercetools.api.extension.model.ExtensionError;
import isv.commercetools.api.extension.validation.InputValidator;
import isv.commercetools.mapping.model.CustomPayment;
import java.util.ArrayList;
import java.util.List;

/**
 * Returns an Invalid Input error if there is any transactions on the payment.
 */
public class ExpectNoTransactionsValidationRule extends InputValidator<CustomPayment> {

    public ExpectNoTransactionsValidationRule(ObjectMapper objectMapper) {
        super(objectMapper);
    }

    @Override
    public List<ExtensionError> validate(CustomPayment payment) {
        var result = new ArrayList<ExtensionError>();
        if (!payment.getBasePayment().getTransactions().isEmpty()) {
            result.add(invalidInputError("Cannot process this payment as it has existing transactions"));
        }
        return result;
    }
}
