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
        def acsUrl = commerceToolsHelper.getCustomFieldValue(responseBody, 'isv_payerAuthenticationAcsUrl')
        def paReq = commerceToolsHelper.getCustomFieldValue(responseBody, 'isv_payerAuthenticationPaReq')
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

        and: 'we ignore previous requests to payment service'
        paymentServiceWireMockServer.resetRequests()

        when: 'we create an INITIAL CHARGE transaction'
        def paymentCaptureRequest = requestBuilder.paymentCaptureRequest(authInteractionId)
        def paymentCaptureResponse = testRestTemplate.postForEntity(paymentUpdateUrl, paymentCaptureRequest, String)

        then: 'we should get back the correct actions'
        def paymentCaptureResponseMap = new JsonSlurper().parseText(paymentCaptureResponse.body)
        validateActions(paymentCaptureResponseMap)
        def captureInteractionId = paymentCaptureResponseMap.actions.find { it.action == 'changeTransactionInteractionId' }.interactionId

        and: 'expected fields were sent to payment service'
        def psCaptureRequest = paymentServiceHelper.extractRequestFields(paymentServiceWireMockServer)
        paymentServiceHelper.with {
            validatePurchaseTotalFields(psCaptureRequest)
            validateMerchantFields(psCaptureRequest)
            validateCaptureServiceRun(psCaptureRequest, authInteractionId)
        }

        when: 'we create an INITIAL REFUND transaction for a partial refund'
        def paymentRefundRequest = requestBuilder.paymentPartialRefundRequest(captureInteractionId)
        def paymentRefundResponse = testRestTemplate.postForEntity(paymentUpdateUrl, paymentRefundRequest, String)

        then: 'we should get back the correct actions'
        validateActions(new JsonSlurper().parseText(paymentRefundResponse.body))

        and: 'expected fields were sent to payment service'
        def psPartialRefundRequest = paymentServiceHelper.extractRequestFields(paymentServiceWireMockServer)
        paymentServiceHelper.with {
            validatePurchaseTotalFields(psPartialRefundRequest, '1')
            validateMerchantFields(psPartialRefundRequest)
            validateCreditServiceRun(psPartialRefundRequest, captureInteractionId)
        }

        when: 'we create an INITIAL REFUND transaction to complete refund'
        def paymentRefundRequest2 = requestBuilder.paymentRemainingRefundRequest(captureInteractionId)
        def paymentRefundResponse2 = testRestTemplate.postForEntity(paymentUpdateUrl, paymentRefundRequest2, String)

        then: 'we should get back the correct actions'
        validateActions(new JsonSlurper().parseText(paymentRefundResponse2.body))

        and: 'expected fields were sent to payment service'
        def psRemainingRefundRequest = paymentServiceHelper.extractRequestFields(paymentServiceWireMockServer)
        paymentServiceHelper.with {
            validatePurchaseTotalFields(psRemainingRefundRequest, '4.49')
            validateMerchantFields(psRemainingRefundRequest)
            validateCreditServiceRun(psRemainingRefundRequest, captureInteractionId)
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

    def 'Should set the capture to failed if the capture is rejected from payment service'() {
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
        addInterfaceInteraction.type.key == 'isv_payment_failure'
        addInterfaceInteraction.fields.get('transactionId') == '8788176c-e42f-4544-aeaf-a155e1232292'
        addInterfaceInteraction.fields.get('reasonCode') == '102'

        and: 'expected fields were sent to payment service'
        def psRefundRequest = paymentServiceHelper.extractRequestFields(paymentServiceWireMockServer)
        paymentServiceHelper.with {
            validatePurchaseTotalFields(psRefundRequest)
            validateMerchantFields(psRefundRequest)
            validateCaptureServiceRun(psRefundRequest, 'null')
        }
    }

    def 'Should set the refund to failed if the refund is rejected from payment service'() {
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
        addInterfaceInteraction.type.key == 'isv_payment_failure'
        addInterfaceInteraction.fields.get('transactionId') == '8788176c-e42f-4544-aeaf-a155e1232292'
        addInterfaceInteraction.fields.get('reasonCode') == '102'

        and: 'expected fields were sent to payment service'
        def psRefundRequest = paymentServiceHelper.extractRequestFields(paymentServiceWireMockServer)
        paymentServiceHelper.with {
            validatePurchaseTotalFields(psRefundRequest, '1')
            validateMerchantFields(psRefundRequest)
            validateCreditServiceRun(psRefundRequest, 'null')
        }
    }

}
