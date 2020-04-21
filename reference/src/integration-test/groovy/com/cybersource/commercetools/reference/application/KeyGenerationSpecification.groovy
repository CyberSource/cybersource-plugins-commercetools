package com.cybersource.commercetools.reference.application

import groovy.json.JsonSlurper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.http.HttpStatus

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class KeyGenerationSpecification extends BaseSpecification {

    @Autowired
    TestRestTemplate noAuthTestRestTemplate

    def "should retrieve one time key"() {
        when:
        def response = noAuthTestRestTemplate.postForEntity('/keys', null, String)

        then:
        response.statusCode == HttpStatus.OK
        def responseBody = new JsonSlurper().parseText(response.body)
        responseBody.n != null
        responseBody.kty != null
        responseBody.use != null
        responseBody.kid != null
        responseBody.e != null
    }

    def "should retrieve Cardinal JWT"() {
        when:
        def response = noAuthTestRestTemplate.postForEntity('/jwt', null, String)

        then:
        response.statusCode == HttpStatus.OK
        response.body != null
    }

}
