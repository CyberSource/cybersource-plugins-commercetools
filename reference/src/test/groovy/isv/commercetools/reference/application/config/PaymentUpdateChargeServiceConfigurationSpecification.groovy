package isv.commercetools.reference.application.config

import isv.commercetools.reference.application.service.payment.PaymentService
import spock.lang.Specification

class PaymentUpdateChargeServiceConfigurationSpecification extends Specification {

    PaymentUpdateChargeServiceConfiguration testObj

    def setup() {
        testObj = new PaymentUpdateChargeServiceConfiguration()
    }

    def 'should create configuration for update charge payment services'() {
        given:
        def chargeServiceMock = Mock(PaymentService)
        def visaChargeServiceMock = Mock(PaymentService)

        when:
        def result = testObj.paymentUpdateChargeServiceMap(chargeServiceMock, visaChargeServiceMock)

        then:
        result != null
        result['creditCard'] == chargeServiceMock
        result['creditCardWithPayerAuthentication'] == chargeServiceMock
        result['visaCheckout'] == visaChargeServiceMock
    }

}
