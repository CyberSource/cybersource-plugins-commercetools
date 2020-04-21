package com.cybersource.commercetools.reference.application.config

import com.cybersource.commercetools.reference.application.service.payment.PaymentService
import spock.lang.Specification

class PaymentUpdateRefundServiceConfigurationSpecification extends Specification {

    PaymentUpdateRefundServiceConfiguration testObj

    def setup() {
        testObj = new PaymentUpdateRefundServiceConfiguration()
    }

    def 'should create configuration for update credit payment services'() {
        given:
        def refundServiceMock = Mock(PaymentService)
        def visaRefundServiceMock = Mock(PaymentService)

        when:
        def result = testObj.paymentUpdateRefundServiceMap(refundServiceMock, visaRefundServiceMock)

        then:
        result != null
        result['creditCard'] == refundServiceMock
        result['creditCardWithPayerAuthentication'] == refundServiceMock
        result['visaCheckout'] == visaRefundServiceMock
    }

}
