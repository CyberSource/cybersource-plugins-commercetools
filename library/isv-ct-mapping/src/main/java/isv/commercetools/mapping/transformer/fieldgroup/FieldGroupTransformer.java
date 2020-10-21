package isv.commercetools.mapping.transformer.fieldgroup;

import isv.commercetools.mapping.model.PaymentDetails;
import isv.payments.model.fields.RequestServiceFieldGroup;
import java.util.List;

public interface FieldGroupTransformer<T extends RequestServiceFieldGroup> {

    List<T> configure(PaymentDetails paymentDetails);

}
