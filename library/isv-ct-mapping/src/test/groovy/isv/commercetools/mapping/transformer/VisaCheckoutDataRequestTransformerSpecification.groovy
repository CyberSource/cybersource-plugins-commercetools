package isv.commercetools.mapping.transformer

import isv.commercetools.mapping.model.PaymentServiceIds
import isv.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer
import isv.commercetools.mapping.transformer.fieldgroup.VisaCheckoutDataServiceFieldGroupTransformer
import isv.commercetools.mapping.transformer.fieldgroup.VisaCheckoutFieldGroupTransformer
import spock.lang.Specification

class VisaCheckoutDataRequestTransformerSpecification extends Specification {

    VisaCheckoutDataRequestTransformer testObj

    def 'Should have the correct transformers'() {
        given:
        def paymentServiceIds = new PaymentServiceIds()

        when:
        testObj = new VisaCheckoutDataRequestTransformer(paymentServiceIds)

        then:
        testObj.fieldGroupTransformers.size() == 3
        testObj.fieldGroupTransformers.find { it instanceof BaseFieldGroupTransformer && it.paymentServiceIds == paymentServiceIds }
        testObj.fieldGroupTransformers.find { it instanceof VisaCheckoutFieldGroupTransformer }
        testObj.fieldGroupTransformers.find { it instanceof VisaCheckoutDataServiceFieldGroupTransformer }
    }
}
