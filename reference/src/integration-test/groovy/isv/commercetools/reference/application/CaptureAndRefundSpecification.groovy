package isv.commercetools.reference.application

import groovy.json.JsonSlurper
import isv.commercetools.reference.application.model.testcase.TestCaseDataProvider
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus
import spock.lang.Unroll

import static java.util.Collections.emptyList

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CaptureAndRefundSpecification extends MockExternalServicesBaseSpecification {

    @Unroll
    @SuppressWarnings('MethodSize')
    def 'should successfully authorise, capture and refund payment for #testCase.description'() {
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

        when: 'we create an INITIAL CHARGE transaction'
        def paymentCaptureRequest = requestBuilder.paymentCaptureRequest(authInteractionId)
        def paymentCaptureResponse = testRestTemplate.postForEntity(paymentUpdateUrl, paymentCaptureRequest, String)

        then: 'we should get back the correct actions'
        def paymentCaptureResponseMap = new JsonSlurper().parseText(paymentCaptureResponse.body)
        validateActions(paymentCaptureResponseMap)
        def captureInteractionId = paymentCaptureResponseMap.actions.find { it.action == 'changeTransactionInteractionId' }.interactionId

        and: 'expected fields were sent to cybersource'
        def csCaptureRequest = cybersourceHelper.extractRequestFields(csWireMockServer)
        cybersourceHelper.with {
            validatePurchaseTotalFields(csCaptureRequest)
            validateMerchantFields(csCaptureRequest)
            validateCaptureServiceRun(csCaptureRequest, authInteractionId)
        }

        when: 'we create an INITIAL REFUND transaction for a partial refund'
        def paymentRefundRequest = requestBuilder.paymentPartialRefundRequest(captureInteractionId)
        def paymentRefundResponse = testRestTemplate.postForEntity(paymentUpdateUrl, paymentRefundRequest, String)

        then: 'we should get back the correct actions'
        validateActions(new JsonSlurper().parseText(paymentRefundResponse.body))

        and: 'expected fields were sent to cybersource'
        def csPartialRefundRequest = cybersourceHelper.extractRequestFields(csWireMockServer)
        cybersourceHelper.with {
            validatePurchaseTotalFields(csPartialRefundRequest, '1')
            validateMerchantFields(csPartialRefundRequest)
            validateCreditServiceRun(csPartialRefundRequest, captureInteractionId)
        }

        when: 'we create an INITIAL REFUND transaction to complete refund'
        def paymentRefundRequest2 = requestBuilder.paymentRemainingRefundRequest(captureInteractionId)
        def paymentRefundResponse2 = testRestTemplate.postForEntity(paymentUpdateUrl, paymentRefundRequest2, String)

        then: 'we should get back the correct actions'
        validateActions(new JsonSlurper().parseText(paymentRefundResponse2.body))

        and: 'expected fields were sent to cybersource'
        def csRemainingRefundRequest = cybersourceHelper.extractRequestFields(csWireMockServer)
        cybersourceHelper.with {
            validatePurchaseTotalFields(csRemainingRefundRequest, '4.49')
            validateMerchantFields(csRemainingRefundRequest)
            validateCreditServiceRun(csRemainingRefundRequest, captureInteractionId)
        }

        where:
        testCase << new TestCaseDataProvider('/testcases/success')
    }

    def validateActions(Map responseMap) {
        responseMap.errors == emptyList()
        responseMap.actions.size() == 2

        def interactionAction = responseMap.actions.find { it.action == 'changeTransactionInteractionId' }
        assert interactionAction.interactionId != null
        assert interactionAction.transactionId == '8788176c-e42f-4544-aeaf-a155e1232292'

        def changeTransactionStateAction = responseMap.actions.find { it.action == 'changeTransactionState' }
        assert changeTransactionStateAction.state == 'Success'
        assert changeTransactionStateAction.transactionId == '8788176c-e42f-4544-aeaf-a155e1232292'

        true
    }

    def 'Should set the capture to failed if the capture is rejected from Cybersource'() {
        given: 'We create an INITIAL CHARGE on the payment'
        def paymentCaptureRequest = requestBuilder.paymentCaptureRequest()

        when:
        def paymentCaptureResponse = testRestTemplate.postForEntity(paymentUpdateUrl, paymentCaptureRequest, String)

        then: 'we should get back the correct actions'
        def paymentCaptureResponseMap = new JsonSlurper().parseText(paymentCaptureResponse.body)
        paymentCaptureResponseMap.errors == emptyList()
        paymentCaptureResponseMap.actions.size() == 3

        def interactionAction = paymentCaptureResponseMap.actions.find { it.action == 'changeTransactionInteractionId' }
        interactionAction.interactionId != null
        interactionAction.transactionId == '8788176c-e42f-4544-aeaf-a155e1232292'

        def changeTransactionStateAction = paymentCaptureResponseMap.actions.find { it.action == 'changeTransactionState' }
        changeTransactionStateAction.state == 'Failure'
        changeTransactionStateAction.transactionId == '8788176c-e42f-4544-aeaf-a155e1232292'

        def addInterfaceInteraction = paymentCaptureResponseMap.actions.find { it.action == 'addInterfaceInteraction' }
        addInterfaceInteraction.type.key == 'cybersource_payment_failure'
        addInterfaceInteraction.fields.get('transactionId') == '8788176c-e42f-4544-aeaf-a155e1232292'
        addInterfaceInteraction.fields.get('reasonCode') == '102'

        and: 'expected fields were sent to cybersource'
        def csRefundRequest = cybersourceHelper.extractRequestFields(csWireMockServer)
        cybersourceHelper.with {
            validatePurchaseTotalFields(csRefundRequest)
            validateMerchantFields(csRefundRequest)
            validateCaptureServiceRun(csRefundRequest, 'null')
        }
    }

    def 'Should set the refund to failed if the refund is rejected from Cybersource'() {
        given: 'We create an INITIAL REFUND on the payment'
        def paymentRefundRequest = requestBuilder.paymentPartialRefundRequest()

        when:
        def paymentRefundResponse = testRestTemplate.postForEntity(paymentUpdateUrl, paymentRefundRequest, String)

        then: 'we should get back the correct actions'
        def paymentRefundResponseMap = new JsonSlurper().parseText(paymentRefundResponse.body)
        paymentRefundResponseMap.errors == emptyList()
        paymentRefundResponseMap.actions.size() == 3

        def interactionAction = paymentRefundResponseMap.actions.find { it.action == 'changeTransactionInteractionId' }
        interactionAction.interactionId != null
        interactionAction.transactionId == '8788176c-e42f-4544-aeaf-a155e1232292'

        def changeTransactionStateAction = paymentRefundResponseMap.actions.find { it.action == 'changeTransactionState' }
        changeTransactionStateAction.state == 'Failure'
        changeTransactionStateAction.transactionId == '8788176c-e42f-4544-aeaf-a155e1232292'

        def addInterfaceInteraction = paymentRefundResponseMap.actions.find { it.action == 'addInterfaceInteraction' }
        addInterfaceInteraction.type.key == 'cybersource_payment_failure'
        addInterfaceInteraction.fields.get('transactionId') == '8788176c-e42f-4544-aeaf-a155e1232292'
        addInterfaceInteraction.fields.get('reasonCode') == '102'

        and: 'expected fields were sent to cybersource'
        def csRefundRequest = cybersourceHelper.extractRequestFields(csWireMockServer)
        cybersourceHelper.with {
            validatePurchaseTotalFields(csRefundRequest, '1')
            validateMerchantFields(csRefundRequest)
            validateCreditServiceRun(csRefundRequest, 'null')
        }
    }

}
