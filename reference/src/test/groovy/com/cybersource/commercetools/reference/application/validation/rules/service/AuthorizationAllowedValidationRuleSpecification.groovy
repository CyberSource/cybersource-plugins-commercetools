package com.cybersource.commercetools.reference.application.validation.rules.service

import com.cybersource.commercetools.api.extension.model.ErrorCode
import com.cybersource.commercetools.mapping.model.CustomPayment
import com.cybersource.commercetools.mapping.model.interactions.EnrolmentData
import spock.lang.Specification
import spock.lang.Unroll

class AuthorizationAllowedValidationRuleSpecification extends Specification {

    AuthorizationAllowedValidationRule testObj

    def 'setup'() {
        testObj = new AuthorizationAllowedValidationRule()
    }

    def 'Should return validation errors if authorization is not allowed'() {
        given:
        CustomPayment paymentMock = Mock()
        EnrolmentData enrolmentDataMock = Mock()
        paymentMock.enrolmentData >> enrolmentDataMock
        enrolmentDataMock.authorizationAllowed >> Optional.of(false)

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.size() == 1
        result[0].message.contains('Payment cannot be authorized due to previous failure')
        result[0].code == ErrorCode.INVALID_OPERATION
    }

    @Unroll
    def 'Should not return validation errors when authorizationFlag is #desc'() {
        given:
        CustomPayment paymentMock = Mock()
        EnrolmentData enrolmentDataMock = Mock()
        paymentMock.enrolmentData >> enrolmentDataMock
        enrolmentDataMock.authorizationAllowed >> authFlag

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.isEmpty()

        where:
        desc      | authFlag
        'missing' | Optional.empty()
        'true'    | Optional.of(true)
    }
}
