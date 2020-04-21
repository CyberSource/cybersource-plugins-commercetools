package com.cybersource.commercetools.reference.application

import com.cybersource.commercetools.reference.application.model.testcase.TestCaseDataProvider
import groovy.json.JsonSlurper
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus
import org.springframework.test.context.ActiveProfiles
import spock.lang.Unroll

import static java.util.Collections.emptyList

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles(['proxycs'])
class ExceptionHandlingSpecification extends MockExternalServicesBaseSpecification {

    @Unroll
    def 'Should handle an exception on payment create with payer auth (enrollment check fails)'() {
        given: 'cybersource will fail with a 500 error when the enrollment request is sent'
        loadCsMapping('csServerError_enrollCheck.json')

        and: 'card is tokenised'
        def createTokenResponse = tokenHelper.tokeniseCard(testCase.cardNumber, testCase.cardType)

        and: 'cardinal is set up'
        def requestJwt = cardinalHelper.retrieveJwt()

        when: 'payment is created'
        def response = testRestTemplate.postForEntity(paymentCreateUrl, requestBuilder.payerAuthPaymentCreateRequest(requestJwt, createTokenResponse), String)

        then: 'the response failed'
        response.statusCode == HttpStatus.BAD_REQUEST

        and: 'errors were returned'
        def responseBody = new JsonSlurper().parseText(response.body)
        responseBody.actions.size() == 0
        responseBody.errors.size() == 1
        responseBody.errors[0].code == 'InvalidOperation'
        responseBody.errors[0].message.contains('Fault: \nXML parse error.\n')

        where:
        testCase << new TestCaseDataProvider('/testcases/success/v1/mastercard')
    }

    @Unroll
    def 'should handle exception on auth request'() {
        given: 'cybersource will fail on an auth request'
        loadCsMapping('csServerError_auth.json')

        and: 'card is tokenised'
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
        Map enrolmentCheckFields = responseBody.actions.find { it.action == 'addInterfaceInteraction' }.fields
        cardinalHelper.continueAuthentication(requestJwt, enrolmentCheckFields.authenticationTransactionId, consumerSessionId)

        then: 'process ACS form and submit the PA Res'
        def acsUrl = commerceToolsHelper.getCustomFieldValue(responseBody, 'cs_payerAuthenticationAcsUrl')
        def paReq = commerceToolsHelper.getCustomFieldValue(responseBody, 'cs_payerAuthenticationPaReq')
        def acsResponse = cardinalHelper.processAcsForm(acsUrl, paReq, consumerSessionId)
        def responseJwt = cardinalHelper.submitPaRes(acsResponse.body)

        and: 'payment is updated with transaction and response JWT'
        def paymentUpdateRequest = requestBuilder.payerAuthPaymentUpdateRequest(requestJwt, responseJwt, paReq, createTokenResponse, enrolmentCheckFields)
        def paymentUpdateResponse = testRestTemplate.postForEntity(paymentUpdateUrl, paymentUpdateRequest, String)

        then: 'payment failed and an OK status is returned'
        paymentUpdateResponse.statusCode == HttpStatus.OK

        and: 'we should have no errors, two actions'
        def paymentCaptureResponseMap = new JsonSlurper().parseText(paymentUpdateResponse.body)
        paymentCaptureResponseMap.errors == emptyList()
        paymentCaptureResponseMap.actions.size() == 2

        and: 'one action should be an AddInterfaceInteraction'
        def interactionAction = paymentCaptureResponseMap.actions.find { it.action == 'addInterfaceInteraction' }
        interactionAction.type.key == 'cybersource_payment_failure'
        interactionAction.fields.get('reason') == 'com.cybersource.ws.client.FaultException: Fault: \nXML parse error.\n'

        and: 'one action should be an changeTransactionState interaction'
        def changeTransactionStateAction = paymentCaptureResponseMap.actions.find {
            it.action == 'changeTransactionState'
        }
        changeTransactionStateAction.state == 'Failure'
        changeTransactionStateAction.transactionId == '8788176c-e42f-4544-aeaf-a155e1232292'

        where:
        testCase << new TestCaseDataProvider('/testcases/success/v1/mastercard')
    }

    @Unroll
    def 'should handle an exception on a capture'() {
        given: 'cybersource will fail on a capture request'
        loadCsMapping('csServerError_capture.json')

        and: 'card is tokenised'
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

        then: 'payment successful and validate response stored'
        paymentUpdateResponse.statusCode == HttpStatus.OK
        def updateResponseBody = new JsonSlurper().parseText(paymentUpdateResponse.body)

        and: 'we got back an interaction Id'
        def interactionIdAction = updateResponseBody['actions'].find { it -> it['action'] == 'changeTransactionInteractionId' }
        def interactionId = interactionIdAction.interactionId
        interactionId != null

        when: 'we create an INITIAL CHARGE transaction'
        def paymentCaptureRequest = requestBuilder.paymentCaptureRequest(interactionId)
        def paymentCaptureResponse = testRestTemplate.postForEntity(paymentUpdateUrl, paymentCaptureRequest, String)

        then: 'an OK status is returned'
        paymentUpdateResponse.statusCode == HttpStatus.OK

        and: 'we should have no errors, two actions'
        def paymentCaptureResponseMap = new JsonSlurper().parseText(paymentCaptureResponse.body)
        paymentCaptureResponseMap.errors == emptyList()
        paymentCaptureResponseMap.actions.size() == 2

        and: 'one action should be an addInterfaceInteraction of type payment_failure'
        def interactionAction = paymentCaptureResponseMap.actions.find { it.action == 'addInterfaceInteraction' }
        interactionAction.type.key == 'cybersource_payment_failure'
        interactionAction.fields.get('reason') == 'com.cybersource.ws.client.FaultException: Fault: \nXML parse error.\n'

        and: 'one action should be an changeTransactionState interaction setting transaction to failure'
        def changeTransactionStateAction = paymentCaptureResponseMap.actions.find {
            it.action == 'changeTransactionState'
        }
        changeTransactionStateAction.state == 'Failure'
        changeTransactionStateAction.transactionId == '8788176c-e42f-4544-aeaf-a155e1232292'

        where:
        testCase << new TestCaseDataProvider('/testcases/success/v1/mastercard')
    }

}
