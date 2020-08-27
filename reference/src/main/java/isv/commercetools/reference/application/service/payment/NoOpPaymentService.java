package isv.commercetools.reference.application.service.payment;

import io.sphere.sdk.commands.UpdateAction;
import isv.commercetools.api.extension.model.ExtensionError;
import isv.commercetools.mapping.model.CustomPayment;
import isv.commercetools.mapping.model.PaymentDetails;
import java.util.Collections;
import java.util.List;

public class NoOpPaymentService implements PaymentService {

    @Override
    public PaymentDetails populatePaymentDetails(CustomPayment payment) {
        return null;
    }

    @Override
    public List<ExtensionError> validate(PaymentDetails paymentDetails) {
        return Collections.emptyList();
    }

    @Override
    public List<UpdateAction> process(PaymentDetails paymentDetails) {
        return Collections.emptyList();
    }

}
