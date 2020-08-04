package isv.commercetools.reference.application.config

import io.sphere.sdk.payments.TransactionType
import isv.commercetools.reference.application.service.payment.PaymentService
import spock.lang.Specification

class PaymentUpdateServiceConfigurationSpecification extends Specification {

    PaymentUpdateServiceConfiguration testObj

    def setup() {
        testObj = new PaymentUpdateServiceConfiguration()
    }

    def 'should create configuration map for update payment services'() {
        given:
        Map<String, PaymentService> paymentUpdateAuthServiceMapMock = Mock()
        Map<String, PaymentService> paymentUpdateChargeServiceMapMock = Mock()
        Map<String, PaymentService> paymentUpdateCancelAuthServiceMapMock = Mock()
        Map<String, PaymentService> paymentUpdateRefundServiceMapMock = Mock()

        when:
        def result = testObj.paymentUpdateServiceMap(
                paymentUpdateAuthServiceMapMock,
                paymentUpdateChargeServiceMapMock,
                paymentUpdateCancelAuthServiceMapMock,
                paymentUpdateRefundServiceMapMock
        )

        then:
        result[TransactionType.AUTHORIZATION] == paymentUpdateAuthServiceMapMock
        result[TransactionType.CHARGE] == paymentUpdateChargeServiceMapMock
        result[TransactionType.CANCEL_AUTHORIZATION] == paymentUpdateCancelAuthServiceMapMock
        result[TransactionType.REFUND] == paymentUpdateRefundServiceMapMock
    }

}
