package isv.commercetools.reference.application.controller

import Invokers.ApiException
import isv.commercetools.reference.application.validation.FlexTokenVerifier
import isv.flex.service.KeyService
import org.springframework.http.HttpStatus
import spock.lang.Specification

class KeyGenerationControllerSpecification extends Specification {

    KeyGenerationController testObj

    KeyService keyServiceMock = Mock()
    FlexTokenVerifier flexTokenVerifierMock = Mock()

    def setup() {
        testObj = new KeyGenerationController(keyServiceMock, flexTokenVerifierMock)
    }

    def 'should return success response with key'() {
        when:
        def result = testObj.generateKey()

        then:
        1 * keyServiceMock.generateKey() >> 'one time key'
        1 * flexTokenVerifierMock.createVerificationContext('one time key') >> 'verification context'

        and:
        result.statusCode == HttpStatus.OK
        result.body.captureContext == 'one time key'
        result.body.verificationContext == 'verification context'
    }

    def 'should return error response when key generation fails'() {
        when:
        def result = testObj.generateKey()

        then:
        1 * keyServiceMock.generateKey() >> { throw new ApiException('test') }
        result.statusCode == HttpStatus.INTERNAL_SERVER_ERROR
    }

}
