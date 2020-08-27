package isv.commercetools.mapping.transformer.credit;

import isv.commercetools.mapping.model.CybersourceIds;
import isv.commercetools.mapping.transformer.RequestTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.CreditServiceFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.PurchaseTotalsFieldGroupTransformer;
import java.util.Arrays;

public class CreditRequestTransformer extends RequestTransformer {

    public CreditRequestTransformer(CybersourceIds cybersourceIds) {
        super(Arrays.asList(
                new BaseFieldGroupTransformer(cybersourceIds),
                new CreditServiceFieldGroupTransformer(),
                new PurchaseTotalsFieldGroupTransformer()
        ));
    }

}
