package isv.commercetools.mapping.model.interactions

import io.sphere.sdk.types.CustomFields
import isv.commercetools.mapping.constants.EnrolmentCheckDataConstants
import spock.lang.Specification

class EnrolmentDataSpecification extends Specification {

    CustomFields customFieldsMock = Mock()

    def testObj = new EnrolmentData(Optional.ofNullable(customFieldsMock))

    def 'should return authentication required flag'() {
        given:
        customFieldsMock.getFieldAsBoolean(EnrolmentCheckDataConstants.AUTHENTICATION_REQUIRED) >> true

        when:
        def result = testObj.authenticationRequired

        then:
        result.get()
    }

    def 'should return authorization allowed flag'() {
        given:
        customFieldsMock.getFieldAsBoolean(EnrolmentCheckDataConstants.AUTHORIZATION_ALLOWED) >> true

        when:
        def result = testObj.authorizationAllowed

        then:
        result.get()
    }

    def 'should return empty when data missing'() {
        given:
        testObj = new EnrolmentData(Optional.ofNullable(null))

        when:
        def result = testObj.authenticationRequired

        then:
        result.isEmpty()
    }

    def 'should return authentication transaction id'() {
        given:
        customFieldsMock.getFieldAsString(EnrolmentCheckDataConstants.AUTHENTICATION_TRANSACTION_ID) >> 'authentication transaction id'

        when:
        def result = testObj.authenticationTransactionId

        then:
        result.get() == 'authentication transaction id'
    }

    def 'should return request reference id'() {
        given:
        customFieldsMock.getFieldAsString(EnrolmentCheckDataConstants.REQUEST_REFERENCE_ID) >> 'request reference id'

        when:
        def result = testObj.requestReferenceId

        then:
        result.get() == 'request reference id'
    }

    def 'should return proof xml'() {
        given:
        customFieldsMock.getFieldAsString(EnrolmentCheckDataConstants.PROOF_XML) >> 'proof xml'

        when:
        def result = testObj.proofXml

        then:
        result.get() == 'proof xml'
    }

    def 'should return commerce indicator'() {
        given:
        customFieldsMock.getFieldAsString(EnrolmentCheckDataConstants.COMMERCE_INDICATOR) >> 'commerce indicator'

        when:
        def result = testObj.commerceIndicator

        then:
        result.get() == 'commerce indicator'
    }

}
