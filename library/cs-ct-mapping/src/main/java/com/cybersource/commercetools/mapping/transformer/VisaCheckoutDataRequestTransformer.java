package com.cybersource.commercetools.mapping.transformer;

import com.cybersource.commercetools.mapping.model.CybersourceIds;
import com.cybersource.commercetools.mapping.transformer.fieldgroup.VisaCheckoutDataServiceFieldGroupTransformer;
import com.cybersource.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer;
import com.cybersource.commercetools.mapping.transformer.fieldgroup.VisaCheckoutFieldGroupTransformer;

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
