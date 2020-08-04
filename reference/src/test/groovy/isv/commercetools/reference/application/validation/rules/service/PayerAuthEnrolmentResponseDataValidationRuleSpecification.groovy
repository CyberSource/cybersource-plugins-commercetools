package isv.commercetools.reference.application.validation.rules.service

import io.jsonwebtoken.ExpiredJwtException
import io.jsonwebtoken.MalformedJwtException
import io.jsonwebtoken.SignatureException
import io.sphere.sdk.json.SphereJsonUtils
import isv.cardinal.service.CardinalService
import isv.commercetools.api.extension.model.ErrorCode
import isv.commercetools.mapping.model.CustomPayment
import isv.commercetools.mapping.model.interactions.EnrolmentData
import spock.lang.Specification
import spock.lang.Unroll

class PayerAuthEnrolmentResponseDataValidationRuleSpecification extends Specification {

    PayerAuthEnrolmentResponseDataValidationRule testObj

    CardinalService cardinalServiceMock = Mock()

    CustomPayment paymentMock = Mock()
    EnrolmentData enrolmentDataMock = Mock()

    def setup() {
        testObj = new PayerAuthEnrolmentResponseDataValidationRule(SphereJsonUtils.newObjectMapper(), cardinalServiceMock)
    }

    def 'should return errors when enrolment data missing entirely'() {
        given:
        paymentMock.enrolmentData >> null

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.size() == 1
        result[0].code == ErrorCode.REQUIRED_FIELD_MISSING
        result[0].message == 'enrolment data is required'
    }

    def 'should return errors when no required fields present'() {
        given:
        paymentMock.enrolmentData >> enrolmentDataMock
        enrolmentDataMock.authenticationRequired >> Optional.of(true)
        enrolmentDataMock.requestReferenceId >> Optional.of('reference id')
        enrolmentDataMock.authenticationTransactionId >> Optional.of('transaction id')

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.size() == 1
        result[0].code == ErrorCode.REQUIRED_FIELD_MISSING
        result[0].message == 'Payer authentication response JWT is required'
    }

    def 'should return errors when enrolment data absent'() {
        given:
        paymentMock.enrolmentData >> enrolmentDataMock
        cardinalServiceMock.validateJWTAndExtractReferenceId('response jwt') >> 'reference id'
        enrolmentDataMock.authenticationRequired >> Optional.ofNullable(null)
        enrolmentDataMock.requestReferenceId >> Optional.ofNullable(null)
        enrolmentDataMock.authenticationTransactionId >> Optional.ofNullable(null)
        enrolmentDataMock.proofXml >> Optional.ofNullable(null)
        enrolmentDataMock.commerceIndicator >> Optional.ofNullable(null)
        paymentMock.payerAuthenticationResponseJwt >> 'response jwt'

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.size() == 3
        result.each { assert it.code == ErrorCode.INVALID_OPERATION }
        result.message.containsAll([
                'Payer authentication enrolment flag missing',
                'Payer authentication enrolment request reference id missing',
                'Payer authentication enrolment authentication transaction id missing',
        ])
    }

    @Unroll
    def 'should return error when response jwt is invalid'() {
        given:
        paymentMock.enrolmentData >> enrolmentDataMock
        enrolmentDataMock.requestReferenceId >> Optional.of('reference id')
        enrolmentDataMock.authenticationRequired >> Optional.of(true)
        enrolmentDataMock.requestReferenceId >> Optional.of('reference id')
        enrolmentDataMock.authenticationTransactionId >> Optional.of('transaction id')
        paymentMock.payerAuthenticationResponseJwt >> 'response jwt'

        cardinalServiceMock.validateJWTAndExtractReferenceId('response jwt') >> { throw exception }

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.size() == 1
        result[0].code == ErrorCode.INVALID_INPUT
        result[0].message == 'Invalid response JWT'

        where:
        exception << [
                new ExpiredJwtException(null, null, 'test'),
                new MalformedJwtException('test'),
                new SignatureException('test'),
                new IllegalArgumentException(),
        ]
    }

    def 'should return error when jwt reference ids do not match'() {
        given:
        paymentMock.enrolmentData >> enrolmentDataMock
        cardinalServiceMock.validateJWTAndExtractReferenceId('response jwt') >> 'fake reference id'
        enrolmentDataMock.requestReferenceId >> Optional.of('reference id')
        enrolmentDataMock.authenticationTransactionId >> Optional.of('transaction id')
        enrolmentDataMock.authenticationRequired >> Optional.of(true)
        paymentMock.payerAuthenticationResponseJwt >> 'response jwt'

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.size() == 1
        result[0].code == ErrorCode.INVALID_INPUT
        result[0].message == 'Reference id mismatch detected'
    }

    def 'should return no errors when all data is present and correct'() {
        given:
        paymentMock.enrolmentData >> enrolmentDataMock
        cardinalServiceMock.validateJWTAndExtractReferenceId('response jwt') >> 'reference id'
        enrolmentDataMock.requestReferenceId >> Optional.of('reference id')
        enrolmentDataMock.authenticationTransactionId >> Optional.of('transaction id')
        enrolmentDataMock.authenticationRequired >> Optional.of(true)
        paymentMock.payerAuthenticationResponseJwt >> 'response jwt'

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.size() == 0
    }

    @Unroll
    def 'should not return errors when enrolment data is for timeout where commerce indicator is #commerceIndicator'() {
        given:
        paymentMock.enrolmentData >> enrolmentDataMock
        cardinalServiceMock.validateJWTAndExtractReferenceId('response jwt') >> 'reference id'
        enrolmentDataMock.authenticationRequired >> Optional.of(true)
        enrolmentDataMock.requestReferenceId >> Optional.of('reference id')
        enrolmentDataMock.authenticationTransactionId >> Optional.ofNullable(null)
        enrolmentDataMock.proofXml >> Optional.of('proof xml')
        enrolmentDataMock.commerceIndicator >> Optional.of(commerceIndicator)
        paymentMock.payerAuthenticationResponseJwt >> 'response jwt'

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.isEmpty()

        where:
        commerceIndicator << ['internet', 'vbv_failure']
    }

}
