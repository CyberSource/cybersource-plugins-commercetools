package com.cybersource.cardinal.service

import com.fasterxml.jackson.annotation.JsonProperty
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.MalformedJwtException
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.SignatureException
import io.jsonwebtoken.impl.DefaultClaims
import io.jsonwebtoken.impl.DefaultJwsHeader
import spock.lang.Specification

import javax.crypto.spec.SecretKeySpec

class CardinalServiceSpecification extends Specification {

    CardinalService testObj

    def setup() {
        testObj = new CardinalService('api key'.bytes, 'api identifier', 'org unit id', 2000)
    }

    @SuppressWarnings('UnnecessaryGetter') //DefaultClaims implements Map so need to call getters explicitly
    def 'should create and sign JWT with payload'() {
        given:
        def signingKey = new SecretKeySpec('api key'.bytes, SignatureAlgorithm.HS256.jcaName)
        def parser = Jwts.parser().setSigningKey(signingKey)
        def payload = new OrderDetails(orderNumber:'order number', amount:1234, currencyCode:'GBP')

        when:
        def result = testObj.createJWT('reference id', payload)

        then:
        def jwt = parser.parse(result)
        DefaultClaims body = jwt.body
        DefaultJwsHeader header = jwt.header
        body.getId() != null
        body.getIssuedAt() != null
        body.getExpiration().toInstant().toEpochMilli() - body.getIssuedAt().toInstant().toEpochMilli() == 2000
        body.getIssuer() == 'api identifier'
        body.get('OrgUnitId', String) == 'org unit id'
        body.get('ReferenceId', String) == 'reference id'
        body.get('ObjectifyPayload', Boolean) == true
        def orderDetails = body.get('Payload', Map)
        orderDetails.Amount == 1234
        orderDetails.CurrencyCode == 'GBP'
        orderDetails.OrderNumber == 'order number'
        header.getAlgorithm() == SignatureAlgorithm.HS256.toString()
    }

    @SuppressWarnings('UnnecessaryGetter')
    def 'should create and sign JWT without payload'() {
        given:
        def signingKey = new SecretKeySpec('api key'.bytes, SignatureAlgorithm.HS256.jcaName)
        def parser = Jwts.parser().setSigningKey(signingKey)

        when:
        def result = testObj.createJWT('reference id')

        then:
        def jwt = parser.parse(result)
        DefaultClaims body = jwt.body
        DefaultJwsHeader header = jwt.header
        body.getId() != null
        body.getIssuedAt() != null
        body.getExpiration().toInstant().toEpochMilli() - body.getIssuedAt().toInstant().toEpochMilli() == 2000
        body.getIssuer() == 'api identifier'
        body.get('OrgUnitId', String) == 'org unit id'
        body.get('ReferenceId', String) == 'reference id'
        body.get('Payload', Object) == null
        body.get('ObjectifyPayload', Object) == null
        header.getAlgorithm() == SignatureAlgorithm.HS256.toString()
    }

    def 'should not parse with wrong key'() {
        given:
        def signingKey = new SecretKeySpec('bad key'.bytes, SignatureAlgorithm.HS256.jcaName)
        def parser = Jwts.parser().setSigningKey(signingKey)

        when:
        def result = testObj.createJWT('reference id', '{amount: 1234}')
        parser.parse(result)

        then:
        thrown(SignatureException)
    }

    def 'should validate response JWT and return reference id'() {
        given:
        def responseJwt = testObj.createJWT('response reference id')

        when:
        def result = testObj.validateJWTAndExtractReferenceId(responseJwt)

        then:
        result == 'response reference id'
    }

    def 'should not validate when wrong signing key is used'() {
        given:
        def responseService = new CardinalService('another api key'.bytes, 'api identifier', 'org unit id', 2000)
        def responseJwt = responseService.createJWT('response reference id')

        when:
        testObj.validateJWTAndExtractReferenceId(responseJwt)

        then:
        thrown(SignatureException)
    }

    def 'should not validate invalid jwt'() {
        when:
        testObj.validateJWTAndExtractReferenceId('invalid jwt')

        then:
        thrown(MalformedJwtException)
    }

    class OrderDetails {

        @JsonProperty('OrderNumber')
        String orderNumber

        @JsonProperty('Amount')
        int amount

        @JsonProperty('CurrencyCode')
        String currencyCode

    }

}
