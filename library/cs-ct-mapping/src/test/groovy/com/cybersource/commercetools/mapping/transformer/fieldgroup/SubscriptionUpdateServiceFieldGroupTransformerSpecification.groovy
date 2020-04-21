package com.cybersource.commercetools.mapping.transformer.fieldgroup

import com.cybersource.commercetools.mapping.model.CustomPayment
import com.cybersource.commercetools.mapping.model.PaymentDetails
import io.sphere.sdk.payments.Payment
import spock.lang.Specification

class SubscriptionUpdateServiceFieldGroupTransformerSpecification extends Specification {

    def testObj = new SubscriptionUpdateServiceFieldGroupTransformer()

    def 'should transform payment to subscription update service field group'() {
        given: 'we have a payment'
        def ctPayment = Mock(Payment)
        def customPayment = new CustomPayment(ctPayment)
        def paymentDetails = new PaymentDetails(customPayment)

        when: 'we transform it'
        def result = testObj.configure(paymentDetails)

        then: 'it has the correct subscription update service values'
        result.run
    }

}
