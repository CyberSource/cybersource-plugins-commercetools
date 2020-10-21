package isv.commercetools.mapping.transformer;

import isv.commercetools.mapping.model.PaymentServiceIds;
import isv.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.VisaCheckoutDataServiceFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.VisaCheckoutFieldGroupTransformer;
import java.util.Arrays;

public class VisaCheckoutDataRequestTransformer extends RequestTransformer {

    public VisaCheckoutDataRequestTransformer(PaymentServiceIds paymentServiceIds) {
        super(Arrays.asList(
                new BaseFieldGroupTransformer(paymentServiceIds),
                new VisaCheckoutFieldGroupTransformer(),
                new VisaCheckoutDataServiceFieldGroupTransformer()
        ));
    }
}
