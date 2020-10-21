package isv.commercetools.mapping.transformer.credit;

import isv.commercetools.mapping.model.PaymentServiceIds;
import isv.commercetools.mapping.transformer.RequestTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.CreditServiceFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.PurchaseTotalsFieldGroupTransformer;
import java.util.Arrays;

public class CreditRequestTransformer extends RequestTransformer {

    public CreditRequestTransformer(PaymentServiceIds paymentServiceIds) {
        super(Arrays.asList(
                new BaseFieldGroupTransformer(paymentServiceIds),
                new CreditServiceFieldGroupTransformer(),
                new PurchaseTotalsFieldGroupTransformer()
        ));
    }

}
