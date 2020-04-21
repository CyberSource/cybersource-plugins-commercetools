package com.cybersource.commercetools.reference.application.validation.rules.service

import com.cybersource.commercetools.api.extension.model.ErrorCode
import com.cybersource.commercetools.mapping.model.CustomPayment
import io.sphere.sdk.json.SphereJsonUtils
import io.sphere.sdk.payments.Payment
import io.sphere.sdk.utils.MoneyImpl
import spock.lang.Specification

class PaymentGreaterThanZeroValidationRuleSpecification extends Specification {

    PaymentGreaterThanZeroValidationRule testObj

    CustomPayment paymentMock = Mock()
    Payment basePaymentMock = Mock()

    def setup() {
        testObj = new PaymentGreaterThanZeroValidationRule(SphereJsonUtils.newObjectMapper())
        paymentMock.basePayment >> basePaymentMock
    }

    def 'should error when amount invalid'() {
        given:
        basePaymentMock.amountPlanned >> MoneyImpl.of(0.0, 'GBP')

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.size() == 1
        result[0].code == ErrorCode.INVALID_INPUT
        result[0].message == 'Payment amount must be greater than zero'
    }

}
