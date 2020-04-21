package com.cybersource.commercetools.reference.application.controller

import com.cybersource.cardinal.service.CardinalService
import org.springframework.http.HttpStatus
import spock.lang.Specification

class CardinalJwtControllerSpecification extends Specification {

    CardinalJwtController testObj

    CardinalService cardinalServiceMock = Mock()

    def setup() {
        testObj = new CardinalJwtController(cardinalServiceMock)

        cardinalServiceMock.createJWT(_) >> 'jwt'
    }

    def 'should create JWT'() {
        when:
        def result = testObj.createJwt()

        then:
        result.statusCode == HttpStatus.OK
        result.body == 'jwt'
    }

}
