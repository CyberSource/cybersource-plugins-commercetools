package isv.commercetools.mapping

import isv.cardinal.service.CardinalService
import isv.commercetools.mapping.fieldgroup.PayerAuthEnrollServiceFieldGroupTransformer
import isv.commercetools.mapping.model.CybersourceIds
import isv.commercetools.mapping.transformer.fieldgroup.*
import spock.lang.Specification

class PayerAuthEnrolmentCheckRequestTransformerSpecification extends Specification {

    PayerAuthEnrolmentCheckRequestTransformer testObj

    CardinalService cardinalServiceMock = Mock()

    def 'should configure required field group transformers'() {
        given:
        def cybersourceIds = new CybersourceIds()

        when:
        testObj = new PayerAuthEnrolmentCheckRequestTransformer(cybersourceIds, cardinalServiceMock)

        then:
        testObj.fieldGroupTransformers.size() == 6
        testObj.fieldGroupTransformers[0] instanceof BaseFieldGroupTransformer
        testObj.fieldGroupTransformers[1] instanceof BillToFieldGroupTransformer
        testObj.fieldGroupTransformers[2] instanceof PayerAuthEnrollServiceFieldGroupTransformer
        testObj.fieldGroupTransformers[2].transactionMode == 'S'
        testObj.fieldGroupTransformers[2].cardinalService == cardinalServiceMock
        testObj.fieldGroupTransformers[3] instanceof PurchaseTotalsFieldGroupTransformer
        testObj.fieldGroupTransformers[4] instanceof RecurringSubscriptionInfoFieldGroupTransformer
        testObj.fieldGroupTransformers[5] instanceof TokenSourceFieldGroupTransformer
    }
}
