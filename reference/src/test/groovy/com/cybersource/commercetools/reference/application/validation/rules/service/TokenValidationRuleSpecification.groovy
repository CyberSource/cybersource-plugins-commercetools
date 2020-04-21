package com.cybersource.commercetools.reference.application.validation.rules.service

import com.cybersource.commercetools.api.extension.model.ErrorCode
import com.cybersource.commercetools.mapping.model.CustomPayment
import io.sphere.sdk.json.SphereJsonUtils
import spock.lang.Specification

class TokenValidationRuleSpecification extends Specification {

    TokenValidationRule testObj

    def 'setup'() {
        testObj = new TokenValidationRule(SphereJsonUtils.newObjectMapper())
    }

    def 'Should return an error if there is no token'() {
        given:
        CustomPayment paymentMock = Mock()
        when:
        def result = testObj.validate(paymentMock)
        then:
        result.size() == 1
        result[0].code == ErrorCode.REQUIRED_FIELD_MISSING
        result[0].message == 'Token is required'
        result[0].extraInfo.field.textValue() == 'Token'
    }

    def 'Should not return an error if there is a token'() {
        given:
        CustomPayment paymentMock = Mock()
        paymentMock.token >> 'something'

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.isEmpty()
    }
}
