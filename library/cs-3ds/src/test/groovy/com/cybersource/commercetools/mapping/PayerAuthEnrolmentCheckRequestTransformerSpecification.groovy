package com.cybersource.commercetools.mapping

import com.cybersource.cardinal.service.CardinalService
import com.cybersource.commercetools.mapping.fieldgroup.PayerAuthEnrollServiceFieldGroupTransformer
import com.cybersource.commercetools.mapping.model.CybersourceIds
import com.cybersource.commercetools.mapping.transformer.fieldgroup.BaseFieldGroupTransformer
import com.cybersource.commercetools.mapping.transformer.fieldgroup.BillToFieldGroupTransformer
import com.cybersource.commercetools.mapping.transformer.fieldgroup.PurchaseTotalsFieldGroupTransformer
import com.cybersource.commercetools.mapping.transformer.fieldgroup.RecurringSubscriptionInfoFieldGroupTransformer
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
        testObj.fieldGroupTransformers.size() == 5
        testObj.fieldGroupTransformers[0] instanceof BaseFieldGroupTransformer
        testObj.fieldGroupTransformers[1] instanceof BillToFieldGroupTransformer
        testObj.fieldGroupTransformers[2] instanceof PayerAuthEnrollServiceFieldGroupTransformer
        testObj.fieldGroupTransformers[2].transactionMode == 'S'
        testObj.fieldGroupTransformers[2].cardinalService == cardinalServiceMock
        testObj.fieldGroupTransformers[3] instanceof PurchaseTotalsFieldGroupTransformer
        testObj.fieldGroupTransformers[4] instanceof RecurringSubscriptionInfoFieldGroupTransformer
    }
}
