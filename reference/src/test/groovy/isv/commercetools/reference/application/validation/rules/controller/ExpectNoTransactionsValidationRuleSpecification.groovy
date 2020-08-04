package isv.commercetools.reference.application.validation.rules.controller

import com.fasterxml.jackson.databind.ObjectMapper
import io.sphere.sdk.payments.Payment
import io.sphere.sdk.payments.Transaction
import isv.commercetools.api.extension.model.ErrorCode
import isv.commercetools.mapping.model.CustomPayment
import spock.lang.Specification

class ExpectNoTransactionsValidationRuleSpecification extends Specification {

    ExpectNoTransactionsValidationRule testObj

    CustomPayment paymentMock
    Payment basePaymentMock

    def 'setup'() {
        testObj = new ExpectNoTransactionsValidationRule(Mock(ObjectMapper))
        paymentMock = Mock()
        basePaymentMock = Mock()
        paymentMock.basePayment >> basePaymentMock
    }

    def 'Should return a validation error if transactions exist'() {
        given:
        basePaymentMock.transactions >> [Mock(Transaction)]

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.size() == 1
        result[0].code == ErrorCode.INVALID_INPUT
        result[0].message == 'Cannot process this payment as it has existing transactions'
    }

    def 'Should not return a validation error if no transactions exist'() {
        given:
        basePaymentMock.transactions >> []

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.size() == 0
    }
}
