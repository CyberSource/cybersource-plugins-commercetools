package isv.commercetools.mapping.transformer.fieldgroup;

import isv.commercetools.mapping.model.PaymentDetails;
import isv.payments.model.fields.VisaCheckoutDataServiceFieldGroup;
import java.util.List;

public class VisaCheckoutDataServiceFieldGroupTransformer implements FieldGroupTransformer<VisaCheckoutDataServiceFieldGroup> {

    @Override
    public List<VisaCheckoutDataServiceFieldGroup> configure(PaymentDetails paymentDetails) {
        var fieldGroup = new VisaCheckoutDataServiceFieldGroup();
        fieldGroup.setRun(true);
        return List.of(fieldGroup);
    }

}
