package isv.commercetools.mapping.transformer.credit

import isv.commercetools.mapping.model.CybersourceIds
import isv.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer
import isv.commercetools.mapping.transformer.fieldgroup.CreditServiceFieldGroupTransformer
import isv.commercetools.mapping.transformer.fieldgroup.PurchaseTotalsFieldGroupTransformer
import isv.commercetools.mapping.transformer.fieldgroup.VisaCheckoutFieldGroupTransformer
import spock.lang.Specification

class VisaCheckoutCreditRequestTransformerSpecification extends Specification {

    def testObj

    def 'should configure required field group transformers'() {
        given:
        def cybersourceIds = new CybersourceIds()

        when:
        testObj = new VisaCheckoutCreditRequestTransformer(cybersourceIds)

        then:
        testObj.fieldGroupTransformers.size() == 4
        testObj.fieldGroupTransformers[0] instanceof BaseFieldGroupTransformer
        testObj.fieldGroupTransformers[0].cybersourceIds == cybersourceIds
        testObj.fieldGroupTransformers[1] instanceof CreditServiceFieldGroupTransformer
        testObj.fieldGroupTransformers[2] instanceof PurchaseTotalsFieldGroupTransformer
        testObj.fieldGroupTransformers[3] instanceof VisaCheckoutFieldGroupTransformer
    }
}
