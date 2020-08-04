package isv.commercetools.mapping.transformer.fieldgroup;

import isv.commercetools.mapping.model.PaymentDetails;
import isv.payments.model.fields.AuthServiceFieldGroup;
import java.util.List;

/**
 * Configures AuthServiceFieldGroup to enable running of auth service
 */
public class AuthServiceFieldGroupTransformer implements FieldGroupTransformer<AuthServiceFieldGroup> {

    @Override
    public List<AuthServiceFieldGroup> configure(PaymentDetails paymentDetails) {
        var authFields = new AuthServiceFieldGroup();
        authFields.setRun(true);
        return List.of(authFields);
    }

}
