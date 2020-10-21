package isv.commercetools.mapping.transformer.fieldgroup;

import isv.commercetools.mapping.model.PaymentDetails;
import isv.payments.model.fields.VisaCheckoutFieldGroup;
import java.util.List;

public class VisaCheckoutFieldGroupTransformer implements FieldGroupTransformer<VisaCheckoutFieldGroup> {

    @Override
    public List<VisaCheckoutFieldGroup> configure(PaymentDetails paymentDetails) {
        var fieldGroup = new VisaCheckoutFieldGroup();
        final String token = paymentDetails.getCustomPayment().getToken();
        fieldGroup.setOrderID(token);
        return List.of(fieldGroup);
    }
}
