package isv.commercetools.mapping.transformer.credit;

import isv.commercetools.mapping.model.PaymentServiceIds;
import isv.commercetools.mapping.transformer.RequestTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.CreditServiceFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.PurchaseTotalsFieldGroupTransformer;
import isv.commercetools.mapping.transformer.fieldgroup.VisaCheckoutFieldGroupTransformer;
import java.util.Arrays;

public class VisaCheckoutCreditRequestTransformer extends RequestTransformer {

    public VisaCheckoutCreditRequestTransformer(PaymentServiceIds paymentServiceIds) {
        super(Arrays.asList(
                new BaseFieldGroupTransformer(paymentServiceIds),
                new CreditServiceFieldGroupTransformer(),
                new PurchaseTotalsFieldGroupTransformer(),
                new VisaCheckoutFieldGroupTransformer()
        ));
    }

}
