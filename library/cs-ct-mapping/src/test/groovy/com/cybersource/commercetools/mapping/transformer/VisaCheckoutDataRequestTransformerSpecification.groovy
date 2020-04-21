package com.cybersource.commercetools.mapping.transformer

import com.cybersource.commercetools.mapping.model.CybersourceIds
import com.cybersource.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer
import com.cybersource.commercetools.mapping.transformer.fieldgroup.VisaCheckoutDataServiceFieldGroupTransformer
import com.cybersource.commercetools.mapping.transformer.fieldgroup.VisaCheckoutFieldGroupTransformer
import spock.lang.Specification

class VisaCheckoutDataRequestTransformerSpecification extends Specification {

    VisaCheckoutDataRequestTransformer testObj

    def 'Should have the correct transformers'() {
        given:
        def cybersourceIds = new CybersourceIds()

        when:
        testObj = new VisaCheckoutDataRequestTransformer(cybersourceIds)

        then:
        testObj.fieldGroupTransformers.size() == 3
        testObj.fieldGroupTransformers.find { it instanceof BaseFieldGroupTransformer && it.cybersourceIds == cybersourceIds }
        testObj.fieldGroupTransformers.find { it instanceof VisaCheckoutFieldGroupTransformer }
        testObj.fieldGroupTransformers.find { it instanceof VisaCheckoutDataServiceFieldGroupTransformer }
    }
}
