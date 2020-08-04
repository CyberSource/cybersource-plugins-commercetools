package isv.commercetools.reference.application

import groovy.json.JsonSlurper
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus
import spock.lang.Unroll

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CartRetrieveErrorSpecification extends MockExternalServicesBaseSpecification {

    @Unroll
    def 'should handle #scenario'() {
        given: 'mapping for cart search loaded'
        loadCtMapping(mapping)

        and: 'card is tokenised'
        def createTokenResponse = tokenHelper.tokeniseCard('4111111111111111', 'Visa')
        createTokenResponse.token != null

        when: 'we create a payment'
        def createResponse = testRestTemplate.postForEntity(paymentCreateUrl, requestBuilder.payerAuthPaymentCreateRequest('response jwt', createTokenResponse), String)

        then: 'there should be one error'
        createResponse.statusCode == HttpStatus.BAD_REQUEST
        def createResponseBody = new JsonSlurper().parseText(createResponse.body)
        createResponseBody.errors.size() == 1
        createResponseBody.actions.empty

        and: 'error should have expected message'
        createResponseBody.errors[0].message == expectedMessage

        where:
        scenario                     | mapping                            | expectedMessage
        'exception on cart retrieve' | 'retrieveCartError.json'           | 'Could not retrieve cart for payment b3308ae7-b464-4b32-ad6e-aee03d359dfb'
        'cart not found'             | 'retrieveCartNoResults.json'       | 'Could not find cart for payment b3308ae7-b464-4b32-ad6e-aee03d359dfb'
        'too many carts found'       | 'retrieveCartMultipleResults.json' | 'Found 2 carts for payment b3308ae7-b464-4b32-ad6e-aee03d359dfb'
    }

}
