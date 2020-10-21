package isv.commercetools.mapping.transformer.reversal

import isv.commercetools.mapping.model.PaymentServiceIds
import isv.commercetools.mapping.transformer.fieldgroup.AuthReversalServiceFieldGroupTransformer
import isv.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer
import isv.commercetools.mapping.transformer.fieldgroup.PurchaseTotalsFieldGroupTransformer
import isv.commercetools.mapping.transformer.fieldgroup.VisaCheckoutFieldGroupTransformer
import spock.lang.Specification

class VisaCheckoutAuthReversalRequestTransformerSpecification extends Specification {

    def testObj

    def 'should configure required field group transformers'() {
        given:
        def paymentServiceIds = new PaymentServiceIds()

        when:
        testObj = new VisaCheckoutAuthReversalRequestTransformer(paymentServiceIds)

        then:
        testObj.fieldGroupTransformers.size() == 4
        testObj.fieldGroupTransformers[0] instanceof BaseFieldGroupTransformer
        testObj.fieldGroupTransformers[0].paymentServiceIds == paymentServiceIds
        testObj.fieldGroupTransformers[1] instanceof AuthReversalServiceFieldGroupTransformer
        testObj.fieldGroupTransformers[2] instanceof PurchaseTotalsFieldGroupTransformer
        testObj.fieldGroupTransformers[3] instanceof VisaCheckoutFieldGroupTransformer
    }
}
