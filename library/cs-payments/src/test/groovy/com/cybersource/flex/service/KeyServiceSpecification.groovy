package com.cybersource.flex.service

import com.cybersource.flex.sdk.FlexService
import com.cybersource.flex.sdk.model.FlexPublicKey
import com.cybersource.flex.sdk.model.JsonWebKey
import groovy.json.JsonSlurper
import spock.lang.Specification

class KeyServiceSpecification extends Specification {

    KeyService testObj

    FlexService flexServiceMock = Mock()
    FlexPublicKey flexPublicKeyMock = Mock()

    def setup() {
        testObj = new KeyService(flexServiceMock)
    }

    def "should generate key"() {
        given:
        flexServiceMock.createKey(_) >> flexPublicKeyMock
        flexPublicKeyMock.jwk >> new JsonWebKey('key type', 'key use', 'key id', 'modulus', 'exponent')

        when:
        def result = testObj.generateKey()
        def json = new JsonSlurper().parseText(result)

        then:
        json.use == 'key use'
        json.kid == 'key id'
        json.kty == 'key type'
        json.e == 'exponent'
        json.n == 'modulus'
    }
}
