package isv.commercetools.reference.application.config

import isv.commercetools.reference.application.service.payment.NoOpPaymentService
import isv.commercetools.reference.application.service.payment.PaymentService
import spock.lang.Specification

class PaymentCreateServiceConfigurationSpecification extends Specification {

    PaymentCreateServiceConfiguration testObj

    def setup() {
        testObj = new PaymentCreateServiceConfiguration()
    }

    def 'should create configuration for payment create services'() {
        given:
        def payerAuthEnrolmentCheckServiceMock = Mock(PaymentService)

        when:
        def result = testObj.paymentCreateServiceMap(payerAuthEnrolmentCheckServiceMock)

        then:
        result != null
        result['creditCard'] instanceof NoOpPaymentService
        result['visaCheckout'] instanceof NoOpPaymentService
        result['creditCardWithPayerAuthentication'] == payerAuthEnrolmentCheckServiceMock
    }

}
