package isv.commercetools.reference.application

import groovy.json.JsonSlurper
import isv.commercetools.reference.application.model.testcase.TestCaseDataProvider
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus
import spock.lang.Unroll

import static java.util.Collections.emptyList

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ReversalSpecification extends MockExternalServicesBaseSpecification {

    @Unroll
    def 'should successfully process payment when reversal required for #testCase.description'() {
        given: 'card is tokenised'
        def createTokenResponse = tokenHelper.tokeniseCard(testCase.cardNumber, testCase.cardType)

        and: 'cardinal is set up'
        def requestJwt = cardinalHelper.retrieveJwt()
        def consumerSessionId = cardinalHelper.setupForEnrolmentCheck(requestJwt, testCase.cardNumber)

        when: 'payment is created'
        def createPaymentRequest = requestBuilder.payerAuthPaymentCreateRequest(requestJwt, createTokenResponse)
        def response = testRestTemplate.postForEntity(paymentCreateUrl, createPaymentRequest, String)

        then: 'enrolment check data is in response'
        response.statusCode == HttpStatus.OK
        def responseBody = new JsonSlurper().parseText(response.body)

        when: 'authentication continued'
        def acsUrl = commerceToolsHelper.getCustomFieldValue(responseBody, 'cs_payerAuthenticationAcsUrl')
        def paReq = commerceToolsHelper.getCustomFieldValue(responseBody, 'cs_payerAuthenticationPaReq')
        Map enrolmentCheckFields = responseBody.actions.find { it.action == 'addInterfaceInteraction' }.fields
        def authenticationTransactionId = enrolmentCheckFields.authenticationTransactionId

        def continueResponse = cardinalHelper.continueAuthentication(requestJwt, authenticationTransactionId, consumerSessionId)

        then: 'response is okay'
        continueResponse.statusCode == HttpStatus.OK

        when: 'process ACS form'
        def acsResponse = cardinalHelper.processAcsForm(acsUrl, paReq, consumerSessionId)

        then: 'response is okay'
        acsResponse.status == 200

        when: 'paRes is submitted'
        def responseJwt = cardinalHelper.submitPaRes(acsResponse.body)

        and: 'payment is updated with transaction and response JWT'
        def paymentUpdateRequest = requestBuilder.payerAuthPaymentUpdateRequest(requestJwt, responseJwt, paReq, createTokenResponse, enrolmentCheckFields)
        def paymentUpdateResponse = testRestTemplate.postForEntity(paymentUpdateUrl, paymentUpdateRequest, String)

        then: 'payment successful'
        paymentUpdateResponse.statusCode == HttpStatus.OK
        def updateResponseBody = new JsonSlurper().parseText(paymentUpdateResponse.body)

        and: 'we got back an interaction Id'
        def authInteractionIdAction = updateResponseBody['actions'].find { it -> it['action'] == 'changeTransactionInteractionId' }
        def authInteractionId = authInteractionIdAction.interactionId
        authInteractionId != null

        and: 'we ignore previous requests to cybersource'
        csWireMockServer.resetRequests()

        when: 'we create an INITIAL CANCEL_AUTHORIZATION transaction'
        def paymentReversalRequest = requestBuilder.paymentReversalRequest(authInteractionId)
        def paymentReversalResponse = testRestTemplate.postForEntity(paymentUpdateUrl, paymentReversalRequest, String)

        then: 'we should get back the correct actions'
        def paymentReversalResponseMap = new JsonSlurper().parseText(paymentReversalResponse.body)
        paymentReversalResponseMap.errors == emptyList()
        paymentReversalResponseMap.actions.size() == 2

        def reversalInteractionAction = paymentReversalResponseMap.actions.find { it.action == 'changeTransactionInteractionId' }
        reversalInteractionAction.interactionId != null
        reversalInteractionAction.transactionId == '8788176c-e42f-4544-aeaf-a155e1232292'

        def changeTransactionStateAction = paymentReversalResponseMap.actions.find { it.action == 'changeTransactionState' }
        changeTransactionStateAction.state == 'Success'
        changeTransactionStateAction.transactionId == '8788176c-e42f-4544-aeaf-a155e1232292'

        and: 'expected fields were sent to cybersource'
        def csAuthReversalRequest = cybersourceHelper.extractRequestFields(csWireMockServer)
        cybersourceHelper.with {
            validatePurchaseTotalFields(csAuthReversalRequest)
            validateMerchantFields(csAuthReversalRequest)
            validateAuthReversalServiceRun(csAuthReversalRequest, authInteractionId)
        }

        where:
        testCase << new TestCaseDataProvider('/testcases/success')
    }

    def 'Should set the reversal to failed if the reversal is rejected from Cybersource'() {
        given: 'We create an INITIAL CANCEL_AUTHORIZATION on the payment'
        def paymentReversalRequest = requestBuilder.paymentReversalRequest()

        when:
        def paymentReversalResponse = testRestTemplate.postForEntity(paymentUpdateUrl, paymentReversalRequest, String)

        then: 'we should get back the correct actions'
        def paymentReversalResponseMap = new JsonSlurper().parseText(paymentReversalResponse.body)
        paymentReversalResponseMap.errors == emptyList()
        paymentReversalResponseMap.actions.size() == 3

        def interactionAction = paymentReversalResponseMap.actions.find { it.action == 'changeTransactionInteractionId' }
        interactionAction.interactionId != null
        interactionAction.transactionId == '8788176c-e42f-4544-aeaf-a155e1232292'

        def changeTransactionStateAction = paymentReversalResponseMap.actions.find { it.action == 'changeTransactionState' }
        changeTransactionStateAction.state == 'Failure'
        changeTransactionStateAction.transactionId == '8788176c-e42f-4544-aeaf-a155e1232292'

        def addInterfaceInteraction = paymentReversalResponseMap.actions.find { it.action == 'addInterfaceInteraction' }
        addInterfaceInteraction.type.key == 'cybersource_payment_failure'
        addInterfaceInteraction.fields.get('transactionId') == '8788176c-e42f-4544-aeaf-a155e1232292'
        addInterfaceInteraction.fields.get('reasonCode') == '102'

        and: 'expected fields were sent to cybersource'
        def csAuthReversalRequest = cybersourceHelper.extractRequestFields(csWireMockServer)
        cybersourceHelper.with {
            validatePurchaseTotalFields(csAuthReversalRequest)
            validateMerchantFields(csAuthReversalRequest)
            validateAuthReversalServiceRun(csAuthReversalRequest, 'null')
        }
    }

}
