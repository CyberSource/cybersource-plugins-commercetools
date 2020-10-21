package isv.commercetools.mapping.transformer.fieldgroup;

import io.sphere.sdk.payments.TransactionState;
import io.sphere.sdk.payments.TransactionType;
import isv.commercetools.mapping.model.PaymentDetails;
import isv.payments.model.fields.CreditServiceFieldGroup;
import java.util.List;

public class CreditServiceFieldGroupTransformer implements FieldGroupTransformer<CreditServiceFieldGroup> {

    @Override
    public List<CreditServiceFieldGroup> configure(PaymentDetails paymentDetails) {
        var result = new CreditServiceFieldGroup();
        var captureTransaction = paymentDetails.getCustomPayment().getBasePayment().getTransactions().stream()
                .filter(it -> it.getType() == TransactionType.CHARGE)
                .filter(it -> it.getState() == TransactionState.SUCCESS)
                .findFirst()
                .get();

        result.setRun(true);
        result.setCaptureRequestID(captureTransaction.getInteractionId());

        return List.of(result);
    }
}
