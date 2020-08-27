package isv.commercetools.reference.application.validation.rules.service

import io.sphere.sdk.json.SphereJsonUtils
import isv.commercetools.api.extension.model.ErrorCode
import isv.commercetools.mapping.constants.PaymentMethodConstants
import isv.commercetools.mapping.model.CustomPayment
import isv.commercetools.reference.application.validation.FlexTokenVerifier
import spock.lang.Specification

class TokenValidationRuleSpecification extends Specification {

    TokenValidationRule testObj

    FlexTokenVerifier flexTokenVerifierMock = Mock()
    CustomPayment paymentMock = Mock()

    def 'setup'() {
        testObj = new TokenValidationRule(SphereJsonUtils.newObjectMapper(), flexTokenVerifierMock)
    }

    def 'Should return an error if there is no token'() {
        given:
        paymentMock.paymentMethod >> PaymentMethodConstants.PAYMENT_METHOD_WITH_PAYER_AUTH

        when:
        def result = testObj.validate(paymentMock)

        then:
        0 * flexTokenVerifierMock.verifyToken(_)

        and:
        result.size() == 1
        result[0].code == ErrorCode.REQUIRED_FIELD_MISSING
        result[0].message == 'Token is required'
    }

    def 'Should not return an error if there is a transient token'() {
        given:
        paymentMock.paymentMethod >> PaymentMethodConstants.PAYMENT_METHOD_WITH_PAYER_AUTH
        paymentMock.token >> 'token'
        paymentMock.tokenVerificationContext >> 'verification context'

        when:
        def result = testObj.validate(paymentMock)

        then:
        1 * flexTokenVerifierMock.verifyToken(paymentMock) >> true

        and:
        result.isEmpty()
    }

    def 'Should not return an error if there is a saved token'() {
        given:
        paymentMock.paymentMethod >> PaymentMethodConstants.PAYMENT_METHOD_WITH_PAYER_AUTH
        paymentMock.savedToken >> 'something'

        when:
        def result = testObj.validate(paymentMock)

        then:
        0 * flexTokenVerifierMock.verifyToken(_)

        and:
        result.isEmpty()
    }

    def 'Should return an error if there are both types of tokens'() {
        given:
        paymentMock.paymentMethod >> PaymentMethodConstants.PAYMENT_METHOD_WITH_PAYER_AUTH
        paymentMock.token >> 'token'
        paymentMock.tokenVerificationContext >> 'verification context'
        paymentMock.savedToken >> 'something'

        when:
        def result = testObj.validate(paymentMock)

        then:
        1 * flexTokenVerifierMock.verifyToken(paymentMock) >> true

        and:
        result.size() == 1
        result[0].code == ErrorCode.INVALID_INPUT
        result[0].message == 'Only one of transient and saved token can be supplied'
    }

    def 'Should return an error if there is no transient token when saving token'() {
        given:
        paymentMock.paymentMethod >> PaymentMethodConstants.PAYMENT_METHOD_WITH_PAYER_AUTH
        paymentMock.tokenAlias >> 'something'
        paymentMock.savedToken >> 'something'

        when:
        def result = testObj.validate(paymentMock)

        then:
        0 * flexTokenVerifierMock.verifyToken(_)

        and:
        result.size() == 1
        result[0].code == ErrorCode.REQUIRED_FIELD_MISSING
        result[0].message == 'Transient token is required when saving token'
    }

    def 'Should return an error if there is a transient token but no verification context'() {
        given:
        paymentMock.paymentMethod >> PaymentMethodConstants.PAYMENT_METHOD_WITH_PAYER_AUTH
        paymentMock.token >> 'token'

        when:
        def result = testObj.validate(paymentMock)

        then:
        0 * flexTokenVerifierMock.verifyToken(_)

        and:
        result.size() == 1
        result[0].code == ErrorCode.REQUIRED_FIELD_MISSING
        result[0].message == 'Verification context is required'
    }

    def 'Should return an error if there is a transient token but verification fails'() {
        given:
        paymentMock.paymentMethod >> PaymentMethodConstants.PAYMENT_METHOD_WITH_PAYER_AUTH
        paymentMock.token >> 'token'
        paymentMock.tokenVerificationContext >> 'verification context'

        when:
        def result = testObj.validate(paymentMock)

        then:
        1 * flexTokenVerifierMock.verifyToken(paymentMock) >> false

        and:
        result.size() == 1
        result[0].code == ErrorCode.INVALID_INPUT
        result[0].message == 'Token verification failed'
    }

    def 'Should not verify visa checkout tokens'() {
        given:
        paymentMock.paymentMethod >> PaymentMethodConstants.PAYMENT_METHOD_VISA_CHECKOUT
        paymentMock.token >> 'token'
        paymentMock.tokenVerificationContext >> 'verification context'

        when:
        def result = testObj.validate(paymentMock)

        then:
        0 * flexTokenVerifierMock.verifyToken(_)

        and:
        result.isEmpty()
    }

}
