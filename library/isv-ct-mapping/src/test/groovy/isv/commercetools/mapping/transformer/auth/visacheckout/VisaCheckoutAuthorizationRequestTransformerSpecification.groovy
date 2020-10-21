package isv.commercetools.mapping.transformer.auth.visacheckout

import isv.commercetools.mapping.model.PaymentServiceIds
import isv.commercetools.mapping.transformer.fieldgroup.*
import spock.lang.Specification

class VisaCheckoutAuthorizationRequestTransformerSpecification extends Specification {

    def testObj

    def 'should configure required field group transformers'() {
        given:
        def paymentServiceIds = new PaymentServiceIds()

        when:
        testObj = new VisaCheckoutAuthorizationRequestTransformer(paymentServiceIds)

        then:
        testObj.fieldGroupTransformers.size() == 7

        def baseTransformer = (BaseFieldGroupTransformer) testObj.fieldGroupTransformers.find { it instanceof BaseFieldGroupTransformer }
        baseTransformer.paymentServiceIds == paymentServiceIds

        testObj.fieldGroupTransformers.find { it instanceof AuthServiceFieldGroupTransformer }
        testObj.fieldGroupTransformers.find { it instanceof PurchaseTotalsFieldGroupTransformer }
        testObj.fieldGroupTransformers.find { it instanceof LineItemFieldGroupTransformer }
        testObj.fieldGroupTransformers.find { it instanceof MerchantDefinedDataFieldGroupTransformer }
        testObj.fieldGroupTransformers.find { it instanceof VisaCheckoutFieldGroupTransformer }
        testObj.fieldGroupTransformers.find { it instanceof DecisionManagerFieldGroupTransformer }
    }

}
