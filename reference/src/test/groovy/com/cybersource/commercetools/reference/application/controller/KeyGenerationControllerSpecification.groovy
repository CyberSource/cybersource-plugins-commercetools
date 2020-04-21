package com.cybersource.commercetools.reference.application.controller

import com.cybersource.flex.sdk.exception.FlexException
import com.cybersource.flex.service.KeyService
import org.springframework.http.HttpStatus
import spock.lang.Specification

class KeyGenerationControllerSpecification extends Specification {

    KeyGenerationController testObj

    KeyService keyServiceMock = Mock()

    def setup() {
        testObj = new KeyGenerationController(keyServiceMock)
    }

    def 'should return success response with key'() {
        when:
        def result = testObj.generateKey()

        then:
        1 * keyServiceMock.generateKey() >> 'one time key'
        result.statusCode == HttpStatus.OK
        result.body == 'one time key'
    }

    def 'should return error response when key generation fails'() {
        when:
        def result = testObj.generateKey()

        then:
        1 * keyServiceMock.generateKey() >> { throw new FlexException('test') }
        result.statusCode == HttpStatus.INTERNAL_SERVER_ERROR
    }

}
