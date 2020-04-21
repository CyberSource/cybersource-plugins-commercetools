package com.cybersource.commercetools.reference.application.service.payment

import com.cybersource.commercetools.mapping.model.PaymentDetails
import com.cybersource.commercetools.mapping.model.CustomPayment
import spock.lang.Specification

class NoOpPaymentServiceSpecification extends Specification {

    NoOpPaymentService testObj = new NoOpPaymentService()

    CustomPayment paymentMock = Mock()

    def 'should do nothing when validating'() {
        when:
        def result = testObj.validate(new PaymentDetails(paymentMock))

        then:
        result.isEmpty()
    }

    def 'should do nothing when processing'() {
        when:
        def result = testObj.process(new PaymentDetails(paymentMock))

        then:
        result.isEmpty()
    }

    def 'should return null'() {
        when:
        def result = testObj.populatePaymentDetails(paymentMock)

        then:
        result == null
    }

}
