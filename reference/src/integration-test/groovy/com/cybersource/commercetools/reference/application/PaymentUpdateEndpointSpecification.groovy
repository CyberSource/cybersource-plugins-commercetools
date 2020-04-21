package com.cybersource.commercetools.reference.application

import groovy.json.JsonSlurper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.http.HttpStatus

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class PaymentUpdateEndpointSpecification extends BaseSpecification {

    @Autowired
    TestRestTemplate badAuthTestRestTemplate

    def 'should call payment update endpoint and receive empty response when no initial transaction present'() {
        when:
        def response = testRestTemplate.postForEntity(paymentUpdateUrl, requestBuilder.noActionRequiredPayload(), String)

        then:
        response.statusCode == HttpStatus.OK
        def responseBody = new JsonSlurper().parseText(response.body)
        responseBody.actions.empty
        responseBody.errors.empty
    }

    def 'should fail to authorize when basic auth header is missing'() {
        when:
        def response = badAuthTestRestTemplate.postForEntity(paymentUpdateUrl, requestBuilder.noActionRequiredPayload(), String)

        then:
        response.statusCode == HttpStatus.UNAUTHORIZED
    }

}
