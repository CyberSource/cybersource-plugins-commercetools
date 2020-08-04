package isv.commercetools.reference.application.validation.rules.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.sphere.sdk.payments.TransactionState;
import io.sphere.sdk.payments.TransactionType;
import isv.commercetools.api.extension.model.ExtensionError;
import isv.commercetools.api.extension.validation.InputValidator;
import isv.commercetools.mapping.model.CustomPayment;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Returns an Invalid Input error if the sum of refund amounts exceeds the charged amount
 */
public class RefundTotalNoMoreThanChargeAmountValidationRule extends InputValidator<CustomPayment> {

    public RefundTotalNoMoreThanChargeAmountValidationRule(ObjectMapper objectMapper) {
        super(objectMapper);
    }

    @Override
    public List<ExtensionError> validate(CustomPayment payment) {
        List<ExtensionError> errors = new ArrayList<>();

        var chargeTransaction = payment.getBasePayment().getTransactions().stream()
            .filter(it -> it.getType() == TransactionType.CHARGE)
            .filter(it -> it.getState() == TransactionState.SUCCESS)
            .findFirst();

        if (chargeTransaction.isPresent()) {
            BigDecimal refundTotal = payment.getBasePayment().getTransactions().stream()
                    .filter(it -> it.getType() == TransactionType.REFUND)
                    .filter(it -> it.getState() == TransactionState.SUCCESS || it.getState() == TransactionState.INITIAL)
                    .map(it -> it.getAmount().getNumber().numberValue(BigDecimal.class))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            if (refundTotal.compareTo(chargeTransaction.get().getAmount().getNumber().numberValue(BigDecimal.class)) == 1) {
                errors.add(invalidInputError("Sum of refunds exceeds charge"));
            }
        }

        return errors;
    }
}
