package isv.commercetools.mapping.transformer;

import isv.commercetools.mapping.model.CybersourceIds;
import isv.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.VisaCheckoutDataServiceFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.VisaCheckoutFieldGroupTransformer;
import java.util.Arrays;

public class VisaCheckoutDataRequestTransformer extends RequestTransformer {

    public VisaCheckoutDataRequestTransformer(CybersourceIds cybersourceIds) {
        super(Arrays.asList(
                new BaseFieldGroupTransformer(cybersourceIds),
                new VisaCheckoutFieldGroupTransformer(),
                new VisaCheckoutDataServiceFieldGroupTransformer()
        ));
    }
}
