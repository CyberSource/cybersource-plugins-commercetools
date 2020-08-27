package isv.commercetools.mapping.transformer.auth

import isv.commercetools.mapping.model.CybersourceIds
import isv.commercetools.mapping.transformer.fieldgroup.*
import spock.lang.Specification

class AuthorizationRequestTransformerSpecification extends Specification {

    def testObj

    def 'should configure required field group transformers'() {
        given:
        def cybersourceIds = new CybersourceIds()

        when:
        testObj = new AuthorizationRequestTransformer(cybersourceIds)

        then:
        testObj.fieldGroupTransformers.size() == 12
        testObj.fieldGroupTransformers[0] instanceof BaseFieldGroupTransformer
        testObj.fieldGroupTransformers[0].cybersourceIds == cybersourceIds
        testObj.fieldGroupTransformers[1] instanceof AuthServiceFieldGroupTransformer
        testObj.fieldGroupTransformers[2] instanceof BillToFieldGroupTransformer
        testObj.fieldGroupTransformers[3] instanceof ShipToFieldGroupTransformer
        testObj.fieldGroupTransformers[4] instanceof PurchaseTotalsFieldGroupTransformer
        testObj.fieldGroupTransformers[5] instanceof TokenSourceFieldGroupTransformer
        testObj.fieldGroupTransformers[6] instanceof LineItemFieldGroupTransformer
        testObj.fieldGroupTransformers[7] instanceof MerchantDefinedDataFieldGroupTransformer
        testObj.fieldGroupTransformers[8] instanceof DecisionManagerFieldGroupTransformer
        testObj.fieldGroupTransformers[9] instanceof SubscriptionCreateServiceFieldGroupTransformer
        testObj.fieldGroupTransformers[10] instanceof SubscriptionUpdateServiceFieldGroupTransformer
        testObj.fieldGroupTransformers[11] instanceof RecurringSubscriptionInfoFieldGroupTransformer
    }

}
