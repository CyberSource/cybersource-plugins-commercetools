package isv.commercetools.mapping.transformer.reversal

import isv.commercetools.mapping.model.CybersourceIds
import isv.commercetools.mapping.transformer.fieldgroup.AuthReversalServiceFieldGroupTransformer
import isv.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer
import isv.commercetools.mapping.transformer.fieldgroup.PurchaseTotalsFieldGroupTransformer
import spock.lang.Specification

class AuthReversalRequestTransformerSpecification extends Specification {

    def testObj

    def 'should configure required field group transformers'() {
        given:
        def cybersourceIds = new CybersourceIds()

        when:
        testObj = new AuthReversalRequestTransformer(cybersourceIds)

        then:
        testObj.fieldGroupTransformers.size() == 3
        testObj.fieldGroupTransformers[0] instanceof BaseFieldGroupTransformer
        testObj.fieldGroupTransformers[0].cybersourceIds == cybersourceIds
        testObj.fieldGroupTransformers[1] instanceof AuthReversalServiceFieldGroupTransformer
        testObj.fieldGroupTransformers[2] instanceof PurchaseTotalsFieldGroupTransformer
    }
}
