package com.cybersource.commercetools.mapping.transformer.fieldgroup;

import com.cybersource.commercetools.mapping.model.PaymentDetails;
import com.cybersource.payments.model.fields.PurchaseTotalsFieldGroup;
import io.sphere.sdk.payments.Payment;
import io.sphere.sdk.payments.TransactionState;

import javax.money.MonetaryAmount;
import java.math.BigDecimal;
import java.util.List;

/**
 * Configures PurchaseTotalsFieldGroup for payment
 */
public class PurchaseTotalsFieldGroupTransformer implements FieldGroupTransformer<PurchaseTotalsFieldGroup> {

    @Override
    public List<PurchaseTotalsFieldGroup> configure(PaymentDetails paymentDetails) {
        var payment = paymentDetails.getCustomPayment();
        var totals = new PurchaseTotalsFieldGroup();
        totals.setCurrency(payment.getBasePayment().getAmountPlanned().getCurrency().getCurrencyCode());
        totals.setGrandTotalAmount(amount(payment.getBasePayment()));
        return List.of(totals);
    }

    private BigDecimal amount(Payment payment) {
        MonetaryAmount amount;
        if (payment.getTransactions().isEmpty()) {
            amount = payment.getAmountPlanned();
        } else {
            amount = payment.getTransactions().stream()
                        .filter(it -> it.getState() == TransactionState.INITIAL)
                        .findFirst()
                        .map(it -> it.getAmount())
                        .get();
        }
        return amount.getNumber().numberValue(BigDecimal.class);
    }

}
