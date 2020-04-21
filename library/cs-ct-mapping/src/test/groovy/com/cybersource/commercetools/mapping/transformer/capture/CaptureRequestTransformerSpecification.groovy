package com.cybersource.commercetools.mapping.transformer.capture

import com.cybersource.commercetools.mapping.model.CybersourceIds
import com.cybersource.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer
import com.cybersource.commercetools.mapping.transformer.fieldgroup.CaptureServiceFieldGroupTransformer
import com.cybersource.commercetools.mapping.transformer.fieldgroup.PurchaseTotalsFieldGroupTransformer
import spock.lang.Specification

class CaptureRequestTransformerSpecification extends Specification {

    def testObj

    def 'should configure required field group transformers'() {
        given:
        def cybersourceIds = new CybersourceIds()

        when:
        testObj = new CaptureRequestTransformer(cybersourceIds)

        then:
        testObj.fieldGroupTransformers.size() == 3
        testObj.fieldGroupTransformers[0] instanceof BaseFieldGroupTransformer
        testObj.fieldGroupTransformers[0].cybersourceIds == cybersourceIds
        testObj.fieldGroupTransformers[1] instanceof CaptureServiceFieldGroupTransformer
        testObj.fieldGroupTransformers[2] instanceof PurchaseTotalsFieldGroupTransformer
    }
}
