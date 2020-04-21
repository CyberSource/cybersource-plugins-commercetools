package com.cybersource.commercetools.reference.application.validation.rules.controller

import com.cybersource.commercetools.api.extension.model.ErrorCode
import com.cybersource.commercetools.mapping.model.CustomPayment
import io.sphere.sdk.json.SphereJsonUtils
import spock.lang.Specification
import spock.lang.Unroll

class ExpectPaymentMethodValidationRuleSpecification extends Specification {

    ExpectPaymentMethodValidationRule testObj

    def 'setup'() {
        testObj = new ExpectPaymentMethodValidationRule(SphereJsonUtils.newObjectMapper())
    }

    def 'Should throw a validation error if there is no payment method'() {
        given:
        def paymentMock = Mock(CustomPayment)
        paymentMock.paymentMethod >> null

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.size() == 1
        result[0].code == ErrorCode.REQUIRED_FIELD_MISSING
        result[0].message == 'paymentMethodInfo.method is required'
    }

    def 'Should throw a validation error if payment method isnt one we are expecting'() {
        given:
        def paymentMock = Mock(CustomPayment)
        paymentMock.paymentMethod >> 'IOU'

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.size() == 1
        result[0].code == ErrorCode.INVALID_INPUT
        result[0].message == 'Unrecognized payment method: IOU'
    }

    @Unroll
    def 'should not throw a validation error if payment method exists and we are expecting it (#paymentMethod)'() {
        given:
        def paymentMock = Mock(CustomPayment)
        paymentMock.paymentMethod >> paymentMethod

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.size() == 0

        where:
        paymentMethod << ['creditCard', 'creditCardWithPayerAuthentication', 'visaCheckout']
    }
}
