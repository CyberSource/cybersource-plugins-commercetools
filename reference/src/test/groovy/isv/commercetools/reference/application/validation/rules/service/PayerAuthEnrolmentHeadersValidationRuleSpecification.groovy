package isv.commercetools.reference.application.validation.rules.service

import io.sphere.sdk.json.SphereJsonUtils
import isv.commercetools.api.extension.model.ErrorCode
import isv.commercetools.mapping.model.CustomPayment
import spock.lang.Specification

class PayerAuthEnrolmentHeadersValidationRuleSpecification extends Specification {

    PayerAuthEnrolmentHeadersValidationRule testObj

    CustomPayment paymentMock = Mock()

    def setup() {
        testObj = new PayerAuthEnrolmentHeadersValidationRule(SphereJsonUtils.newObjectMapper())
    }

    def 'should return errors when no required fields present'() {
        when:
        def result = testObj.validate(paymentMock)

        then:
        result.size() == 2
        result.each { assert it.code == ErrorCode.REQUIRED_FIELD_MISSING }
        result.message.containsAll([
                'Payer authentication accept header is required',
                'Payer authentication user agent header is required',
        ])
    }

    def 'should return no errors when all required fields populated'() {
        given:
        paymentMock.payerAuthenticationAcceptHeader >> 'accept'
        paymentMock.payerAuthenticationUserAgentHeader >> 'agent'

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.isEmpty()
    }

}
