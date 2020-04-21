package com.cybersource.commercetools.reference.application.config

import com.cybersource.commercetools.reference.application.service.payment.PaymentService
import spock.lang.Specification

class PaymentUpdateCancelAuthServiceConfigurationSpecification extends Specification {

    PaymentUpdateCancelAuthServiceConfiguration testObj

    def setup() {
        testObj = new PaymentUpdateCancelAuthServiceConfiguration()
    }

    def 'should create configuration for update cancel auth payment services'() {
        given:
        def cancelAuthServiceMock = Mock(PaymentService)
        def visaCancelAuthServiceMock = Mock(PaymentService)

        when:
        def result = testObj.paymentUpdateCancelAuthServiceMap(cancelAuthServiceMock, visaCancelAuthServiceMock)

        then:
        result != null
        result['creditCard'] == cancelAuthServiceMock
        result['creditCardWithPayerAuthentication'] == cancelAuthServiceMock
        result['visaCheckout'] == visaCancelAuthServiceMock
    }

}
