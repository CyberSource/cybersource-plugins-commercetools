package com.cybersource.commercetools.mapping.transformer.credit;

import com.cybersource.commercetools.mapping.model.CybersourceIds;
import com.cybersource.commercetools.mapping.transformer.RequestTransformer;
import com.cybersource.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer;
import com.cybersource.commercetools.mapping.transformer.fieldgroup.CreditServiceFieldGroupTransformer;
import com.cybersource.commercetools.mapping.transformer.fieldgroup.PurchaseTotalsFieldGroupTransformer;

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
