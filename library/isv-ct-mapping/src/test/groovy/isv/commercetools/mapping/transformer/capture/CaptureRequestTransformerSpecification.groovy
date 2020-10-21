package isv.commercetools.mapping.transformer.capture

import isv.commercetools.mapping.model.PaymentServiceIds
import isv.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer
import isv.commercetools.mapping.transformer.fieldgroup.CaptureServiceFieldGroupTransformer
import isv.commercetools.mapping.transformer.fieldgroup.PurchaseTotalsFieldGroupTransformer
import spock.lang.Specification

class CaptureRequestTransformerSpecification extends Specification {

    def testObj

    def 'should configure required field group transformers'() {
        given:
        def paymentServiceIds = new PaymentServiceIds()

        when:
        testObj = new CaptureRequestTransformer(paymentServiceIds)

        then:
        testObj.fieldGroupTransformers.size() == 3
        testObj.fieldGroupTransformers[0] instanceof BaseFieldGroupTransformer
        testObj.fieldGroupTransformers[0].paymentServiceIds == paymentServiceIds
        testObj.fieldGroupTransformers[1] instanceof CaptureServiceFieldGroupTransformer
        testObj.fieldGroupTransformers[2] instanceof PurchaseTotalsFieldGroupTransformer
    }
}
