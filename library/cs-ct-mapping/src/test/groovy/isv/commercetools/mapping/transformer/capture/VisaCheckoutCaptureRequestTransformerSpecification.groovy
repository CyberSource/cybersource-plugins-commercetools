package isv.commercetools.mapping.transformer.capture

import isv.commercetools.mapping.model.CybersourceIds
import isv.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer
import isv.commercetools.mapping.transformer.fieldgroup.CaptureServiceFieldGroupTransformer
import isv.commercetools.mapping.transformer.fieldgroup.PurchaseTotalsFieldGroupTransformer
import isv.commercetools.mapping.transformer.fieldgroup.VisaCheckoutFieldGroupTransformer
import spock.lang.Specification

class VisaCheckoutCaptureRequestTransformerSpecification extends Specification {

    def testObj

    def 'should configure required field group transformers'() {
        given:
        def cybersourceIds = new CybersourceIds()

        when:
        testObj = new VisaCheckoutCaptureRequestTransformer(cybersourceIds)

        then:
        testObj.fieldGroupTransformers.size() == 4
        testObj.fieldGroupTransformers.find { it instanceof BaseFieldGroupTransformer }
        testObj.fieldGroupTransformers[0] instanceof BaseFieldGroupTransformer
        testObj.fieldGroupTransformers[0].cybersourceIds == cybersourceIds
        testObj.fieldGroupTransformers.find { it instanceof CaptureServiceFieldGroupTransformer }
        testObj.fieldGroupTransformers.find { it instanceof PurchaseTotalsFieldGroupTransformer }
        testObj.fieldGroupTransformers.find { it instanceof VisaCheckoutFieldGroupTransformer }
    }
}
