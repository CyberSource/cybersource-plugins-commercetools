package isv.commercetools.reference.application

import groovy.json.JsonSlurper
import isv.commercetools.reference.application.model.testcase.TestCase
import isv.commercetools.reference.application.model.testcase.TestCaseDataProvider
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus
import spock.lang.Unroll

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class PayerAuthSpecification extends MockExternalServicesBaseSpecification {

    @Unroll
    @SuppressWarnings('AbcMetric')
    def "payment create response should contain payer auth enrolment data when authentication not required for #testCase"() {
        given: 'card is tokenised'
        def createTokenResponse = tokenHelper.tokeniseCard(cardNumber, cardType)

        and: 'cardinal is set up'
        def requestJwt = cardinalHelper.retrieveJwt()
        cardinalHelper.setupForEnrolmentCheck(requestJwt, cardNumber)

        when: 'payment is created'
        def response = testRestTemplate.postForEntity(paymentCreateUrl, requestBuilder.payerAuthPaymentCreateRequest(requestJwt, createTokenResponse), String)

        then: 'enrolment check data is in response'
        response.statusCode == HttpStatus.OK
        def responseBody = new JsonSlurper().parseText(response.body)
        responseBody.errors.empty
        responseBody.actions.size == 3

        def enrolmentCheckInteraction = responseBody.actions.find { it.action == 'addInterfaceInteraction' }
        enrolmentCheckInteraction.type.key == 'cybersource_payer_authentication_enrolment_check'
        enrolmentCheckInteraction.fields.commerceIndicator == ci
        expectTransactionId == (enrolmentCheckInteraction.fields.authenticationTransactionId != null)
        enrolmentCheckInteraction.fields.veresEnrolled == veres
        enrolmentCheckInteraction.fields.cardinalReferenceId != null
        expectProof == (enrolmentCheckInteraction.fields.proofXml != null)
        if (version == null) {
            assert enrolmentCheckInteraction.fields.specificationVersion == null
        } else {
            assert enrolmentCheckInteraction.fields.specificationVersion.startsWith(version)
        }
        enrolmentCheckInteraction.fields.authenticationRequired == false
        enrolmentCheckInteraction.fields.authorizationAllowed == true
        enrolmentCheckInteraction.fields.eci == eci

        commerceToolsHelper.getCustomFieldValue(responseBody, 'cs_payerAuthenticationRequired') == false
        expectTransactionId == (commerceToolsHelper.getCustomFieldValue(responseBody, 'cs_payerAuthenticationTransactionId') != null)

        and: 'expected fields were sent to cybersource'
        def csRequest = cybersourceHelper.extractRequestFields(csWireMockServer)
        cybersourceHelper.with {
            validateBillingFields(csRequest)
            validatePurchaseTotalFields(csRequest)
            validateMerchantFields(csRequest)
            validateToken(csRequest)
            validatePayerAuthEnrolmentCheckServiceRun(csRequest)
        }

        when: 'payment is updated with transaction'
        def paymentUpdateRequest = requestBuilder.paymentUpdateWithoutAuthenticationRequest(requestJwt, createTokenResponse, enrolmentCheckInteraction.fields)
        def paymentUpdateResponse = testRestTemplate.postForEntity(paymentUpdateUrl, paymentUpdateRequest, String)

        then: 'payment succeeds'
        paymentUpdateResponse.statusCode == HttpStatus.OK
        def updateResponseBody = new JsonSlurper().parseText(paymentUpdateResponse.body)
        updateResponseBody.errors.empty
        updateResponseBody.actions.size == 2

        def changeTransactionInteractionId = updateResponseBody.actions.find {
            it.action == 'changeTransactionInteractionId'
        }
        changeTransactionInteractionId.interactionId != null
        changeTransactionInteractionId.transactionId != null

        def changeTransactionState = updateResponseBody.actions.find { it.action == 'changeTransactionState' }
        changeTransactionState.state == 'Success'
        changeTransactionState.transactionId == '8788176c-e42f-4544-aeaf-a155e1232292'

        and: 'expected fields were sent to cybersource'
        def csAuthRequest = cybersourceHelper.extractRequestFields(csWireMockServer)
        cybersourceHelper.with {
            validateBillingFields(csAuthRequest)
            validateShippingFields(csAuthRequest)
            validateLineItemFields(csAuthRequest, 0)
            validateLineItemFields(csAuthRequest, 1)
            validatePurchaseTotalFields(csAuthRequest)
            validateMerchantFields(csAuthRequest)
            validateToken(csAuthRequest)
            validateDeviceFingerprint(csAuthRequest)
            validateMerchantDefinedFields(csAuthRequest)
            validateAuthServiceRun(csAuthRequest)
        }

        where:
        testCase                | cardNumber         | cardType     | version | ci              | veres | eci  | expectTransactionId | expectProof
        'V1 Visa not enrolled'  | '4000000000000051' | 'Visa'       | '1.0.2' | 'vbv_attempted' | 'N'   | '06' | true                | true
        'V1 Visa unavailable'   | '4000000000000069' | 'Visa'       | '1.0.2' | 'vbv_failure'   | 'U'   | null | true                | true
        'V2 Visa unavailable'   | '4000000000001059' | 'Visa'       | '2.'    | 'vbv_failure'   | 'U'   | null | true                | false
        'V2 Visa bypassed'      | '4000000000001083' | 'Visa'       | '2.'    | 'internet'      | 'B'   | null | true                | false
        'V1 Visa error'         | '4000000000000085' | 'Visa'       | '1.0.2' | 'vbv_failure'   | 'U'   | null | true                | true
        'V2 Visa error'         | '4000000000001067' | 'Visa'       | '2.'    | 'vbv_failure'   | 'U'   | null | true                | false
        'V1 Visa timeout'       | '4000000000000044' | 'Visa'       | null    | 'vbv_failure'   | null  | '07' | false               | true
        'V2 Visa timeout'       | '4000000000001075' | 'Visa'       | null    | 'vbv_failure'   | null  | '07' | false               | true
        'V1 Mastercard timeout' | '5200000000000049' | 'Mastercard' | null    | 'internet'      | null  | null | false               | true
    }

    @Unroll
    @SuppressWarnings('AbcMetric')
    def "payment create should fail for #description"() {
        given: 'card is tokenised'
        def createTokenResponse = tokenHelper.tokeniseCard(cardNumber, 'Visa')

        and: 'cardinal is set up'
        def requestJwt = cardinalHelper.retrieveJwt()
        cardinalHelper.setupForEnrolmentCheck(requestJwt, cardNumber)

        when: 'we attempt to create a payment'
        def response = testRestTemplate.postForEntity(paymentCreateUrl, requestBuilder.payerAuthPaymentCreateRequest(requestJwt, createTokenResponse), String)

        then: 'response contains actions'
        response.statusCode == HttpStatus.OK
        def responseBody = new JsonSlurper().parseText(response.body)
        responseBody.errors.empty
        responseBody.actions.size == 4

        def enrolmentCheckInteraction = responseBody.actions.find {
            it.action == 'addInterfaceInteraction' && it.type.key == 'cybersource_payer_authentication_enrolment_check'
        }
        enrolmentCheckInteraction.fields.commerceIndicator == null
        enrolmentCheckInteraction.fields.authenticationTransactionId != null
        enrolmentCheckInteraction.fields.veresEnrolled == 'Y'
        enrolmentCheckInteraction.fields.cardinalReferenceId != null
        enrolmentCheckInteraction.fields.proofXml == null
        enrolmentCheckInteraction.fields.specificationVersion.startsWith('2.')
        enrolmentCheckInteraction.fields.authenticationRequired == false
        enrolmentCheckInteraction.fields.authorizationAllowed == false
        enrolmentCheckInteraction.fields.eci == null

        def validateResultInteraction = responseBody.actions.find {
            it.action == 'addInterfaceInteraction' && it.type.key == 'cybersource_payer_authentication_validate_result'
        }
        validateResultInteraction.fields.paresStatus == paresStatus
        validateResultInteraction.fields.eciRaw == '07'
        validateResultInteraction.fields.authenticationResult == '9'
        validateResultInteraction.fields.authenticationStatusMessage == message
        validateResultInteraction.fields.directoryServerTransactionId != null
        validateResultInteraction.fields.specificationVersion.startsWith('2.')

        commerceToolsHelper.getCustomFieldValue(responseBody, 'cs_payerAuthenticationRequired') == false
        commerceToolsHelper.getCustomFieldValue(responseBody, 'cs_payerAuthenticationTransactionId') != null

        when: 'payment is updated with transaction'
        def paymentUpdateRequest = requestBuilder.paymentUpdateWithoutAuthenticationRequest(requestJwt, createTokenResponse, enrolmentCheckInteraction.fields)
        def paymentUpdateResponse = testRestTemplate.postForEntity(paymentUpdateUrl, paymentUpdateRequest, String)

        then: 'payment fails'
        paymentUpdateResponse.statusCode == HttpStatus.BAD_REQUEST
        def updateResponseBody = new JsonSlurper().parseText(paymentUpdateResponse.body)
        updateResponseBody.errors.size == 1
        updateResponseBody.errors[0].code == 'InvalidOperation'
        updateResponseBody.errors[0].message == 'Payment cannot be authorized due to previous failure.'

        and: 'expected fields were sent to cybersource'
        def csRequest = cybersourceHelper.extractRequestFields(csWireMockServer)
        cybersourceHelper.with {
            validateBillingFields(csRequest)
            validatePurchaseTotalFields(csRequest)
            validateMerchantFields(csRequest)
            validateToken(csRequest)
            validatePayerAuthEnrolmentCheckServiceRun(csRequest)
        }

        where:
        description             | cardNumber         | paresStatus | message
        'failed frictionless'   | '4000000000001018' | 'N'         | 'User failed authentication'
        'rejected frictionless' | '4000000000001042' | 'R'         | 'Issuer rejected authentication'
    }

    @Unroll
    @SuppressWarnings('AbcMetric')
    def "payment create response should contain payer auth enrolment and validate data for #testCase.description"() {
        given: 'card is tokenised'
        def createTokenResponse = tokenHelper.tokeniseCard(testCase.cardNumber, testCase.cardType)

        and: 'cardinal is set up'
        def requestJwt = cardinalHelper.retrieveJwt()
        cardinalHelper.setupForEnrolmentCheck(requestJwt, testCase.cardNumber)

        when: 'payment is created'
        def response = testRestTemplate.postForEntity(paymentCreateUrl, requestBuilder.payerAuthPaymentCreateRequest(requestJwt, createTokenResponse), String)

        then: 'enrolment check data is in response'
        response.statusCode == HttpStatus.OK
        Map responseBody = (Map) new JsonSlurper().parseText(response.body)
        responseBody.errors.empty
        responseBody.actions.size == 4

        def enrolmentCheckInteraction = responseBody.actions.find {
            it.action == 'addInterfaceInteraction' && it.type.key == 'cybersource_payer_authentication_enrolment_check'
        }
        testCase.expectXid == (enrolmentCheckInteraction.fields.xid != null)
        enrolmentCheckInteraction.fields.authenticationTransactionId != null
        enrolmentCheckInteraction.fields.veresEnrolled == 'Y'
        enrolmentCheckInteraction.fields.cardinalReferenceId != null
        enrolmentCheckInteraction.fields.proofXml == null
        enrolmentCheckInteraction.fields.specificationVersion.startsWith('2.')
        enrolmentCheckInteraction.fields.authenticationRequired == false
        enrolmentCheckInteraction.fields.authorizationAllowed == true
        enrolmentCheckInteraction.fields.eci == testCase.eci

        commerceToolsHelper.getCustomFieldValue(responseBody, 'cs_payerAuthenticationRequired') == false
        commerceToolsHelper.getCustomFieldValue(responseBody, 'cs_payerAuthenticationTransactionId') != null

        and: 'auth validate data in response'
        validateResultInteraction(responseBody, testCase)

        and: 'expected fields were sent to cybersource'
        def csRequest = cybersourceHelper.extractRequestFields(csWireMockServer)
        cybersourceHelper.with {
            validateBillingFields(csRequest)
            validatePurchaseTotalFields(csRequest)
            validateMerchantFields(csRequest)
            validateToken(csRequest)
            validatePayerAuthEnrolmentCheckServiceRun(csRequest)
        }

        when: 'payment is updated with transaction'
        def paymentUpdateRequest = requestBuilder.paymentUpdateWithoutAuthenticationRequest(requestJwt, createTokenResponse, enrolmentCheckInteraction.fields)
        def paymentUpdateResponse = testRestTemplate.postForEntity(paymentUpdateUrl, paymentUpdateRequest, String)

        then: 'payment succeeds'
        paymentUpdateResponse.statusCode == HttpStatus.OK
        def updateResponseBody = new JsonSlurper().parseText(paymentUpdateResponse.body)
        updateResponseBody.errors.empty
        updateResponseBody.actions.size == 2

        def changeTransactionInteractionId = updateResponseBody.actions.find {
            it.action == 'changeTransactionInteractionId'
        }
        changeTransactionInteractionId.interactionId != null
        changeTransactionInteractionId.transactionId != null

        def changeTransactionState = updateResponseBody.actions.find { it.action == 'changeTransactionState' }
        changeTransactionState.state == 'Success'
        changeTransactionState.transactionId == '8788176c-e42f-4544-aeaf-a155e1232292'

        and: 'expected fields were sent to cybersource'
        def csAuthRequest = cybersourceHelper.extractRequestFields(csWireMockServer)
        cybersourceHelper.with {
            validateBillingFields(csAuthRequest)
            validateShippingFields(csAuthRequest)
            validateLineItemFields(csAuthRequest, 0)
            validateLineItemFields(csAuthRequest, 1)
            validatePurchaseTotalFields(csAuthRequest)
            validateMerchantFields(csAuthRequest)
            validateToken(csAuthRequest)
            validateDeviceFingerprint(csAuthRequest)
            validateMerchantDefinedFields(csAuthRequest)
            validateAuthServiceRun(csAuthRequest)
        }

        where:
        testCase << new TestCaseDataProvider('/testcases/frictionless')
    }

    @Unroll
    def 'should successfully process payment when authentication required for #testCase.description'() {
        given: 'card is tokenised'
        def createTokenResponse = tokenHelper.tokeniseCard(testCase.cardNumber, testCase.cardType)

        and: 'cardinal is set up'
        def requestJwt = cardinalHelper.retrieveJwt()
        def consumerSessionId = cardinalHelper.setupForEnrolmentCheck(requestJwt, testCase.cardNumber)

        when: 'payment is created'
        def response = testRestTemplate.postForEntity(paymentCreateUrl, requestBuilder.payerAuthPaymentCreateRequest(requestJwt, createTokenResponse), String)

        then: 'enrolment check data is in response'
        response.statusCode == HttpStatus.OK
        def responseBody = new JsonSlurper().parseText(response.body)
        validateCreateResponseForCardRequiringAuthentication(responseBody, testCase.specificationVersion)

        and: 'expected fields were sent to cybersource'
        def csRequest = cybersourceHelper.extractRequestFields(csWireMockServer)
        cybersourceHelper.with {
            validateBillingFields(csRequest)
            validatePurchaseTotalFields(csRequest)
            validateMerchantFields(csRequest)
            validateToken(csRequest)
            validatePayerAuthEnrolmentCheckServiceRun(csRequest)
        }

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
        validateSuccessfulUpdateResponseForCardRequiringAuthentication(updateResponseBody, testCase)

        and: 'expected fields were sent to cybersource'
        def csAuthRequest = cybersourceHelper.extractRequestFields(csWireMockServer)
        cybersourceHelper.with {
            validateBillingFields(csAuthRequest)
            validateShippingFields(csAuthRequest)
            validateLineItemFields(csAuthRequest, 0)
            validateLineItemFields(csAuthRequest, 1)
            validatePurchaseTotalFields(csAuthRequest)
            validateMerchantFields(csAuthRequest)
            validateToken(csAuthRequest)
            validateDeviceFingerprint(csAuthRequest)
            validateMerchantDefinedFields(csAuthRequest)
            validateAuthServiceRun(csAuthRequest)
            validatePayerAuthValidateServiceRun(csAuthRequest)
        }

        where:
        testCase << new TestCaseDataProvider('/testcases/success')
    }

    @Unroll
    def "should fail to process payment when authentication required for #testCase.description"() {
        given: 'card is tokenised'
        def createTokenResponse = tokenHelper.tokeniseCard(testCase.cardNumber, testCase.cardType)

        and: 'cardinal is set up'
        def requestJwt = cardinalHelper.retrieveJwt()
        def consumerSessionId = cardinalHelper.setupForEnrolmentCheck(requestJwt, testCase.cardNumber)

        when: 'payment is created'
        def response = testRestTemplate.postForEntity(paymentCreateUrl, requestBuilder.payerAuthPaymentCreateRequest(requestJwt, createTokenResponse), String)

        then: 'enrolment check data is in response'
        response.statusCode == HttpStatus.OK
        def responseBody = new JsonSlurper().parseText(response.body)
        validateCreateResponseForCardRequiringAuthentication(responseBody, testCase.specificationVersion)

        and: 'expected fields were sent to cybersource'
        def csRequest = cybersourceHelper.extractRequestFields(csWireMockServer)
        cybersourceHelper.with {
            validateBillingFields(csRequest)
            validatePurchaseTotalFields(csRequest)
            validateMerchantFields(csRequest)
            validateToken(csRequest)
            validatePayerAuthEnrolmentCheckServiceRun(csRequest)
        }

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

        then: 'payment failed and validate response stored'
        paymentUpdateResponse.statusCode == HttpStatus.OK
        def updateResponseBody = new JsonSlurper().parseText(paymentUpdateResponse.body)
        validateFailureUpdateResponseForCardRequiringAuthentication(updateResponseBody, testCase)

        and: 'expected fields were sent to cybersource'
        def csAuthRequest = cybersourceHelper.extractRequestFields(csWireMockServer)
        cybersourceHelper.with {
            validateBillingFields(csAuthRequest)
            validateShippingFields(csAuthRequest)
            validateLineItemFields(csAuthRequest, 0)
            validateLineItemFields(csAuthRequest, 1)
            validatePurchaseTotalFields(csAuthRequest)
            validateMerchantFields(csAuthRequest)
            validateToken(csAuthRequest)
            validateDeviceFingerprint(csAuthRequest)
            validateMerchantDefinedFields(csAuthRequest)
            validateAuthServiceRun(csAuthRequest)
            validatePayerAuthValidateServiceRun(csAuthRequest)
        }

        where:
        testCase << new TestCaseDataProvider('/testcases/failure')
    }

    @Unroll
    def 'should successfully process payment for anonymous user'() {
        given: 'card is tokenised'
        def createTokenResponse = tokenHelper.tokeniseCard(testCase.cardNumber, testCase.cardType)

        and: 'cardinal is set up'
        def requestJwt = cardinalHelper.retrieveJwt()
        def consumerSessionId = cardinalHelper.setupForEnrolmentCheck(requestJwt, testCase.cardNumber)

        when: 'payment is created'
        def response = testRestTemplate.postForEntity(paymentCreateUrl, requestBuilder.payerAuthAnonymousPaymentCreateRequest(requestJwt, createTokenResponse), String)

        then: 'enrolment check data is in response'
        response.statusCode == HttpStatus.OK
        def responseBody = new JsonSlurper().parseText(response.body)
        validateCreateResponseForCardRequiringAuthentication(responseBody, testCase.specificationVersion)

        and: 'expected fields were sent to cybersource'
        def csRequest = cybersourceHelper.extractRequestFields(csWireMockServer)
        cybersourceHelper.with {
            validateBillingFields(csRequest)
            validatePurchaseTotalFields(csRequest)
            validateMerchantFields(csRequest)
            validateToken(csRequest)
            validatePayerAuthEnrolmentCheckServiceRun(csRequest)
        }

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
        def paymentUpdateRequest = requestBuilder.payerAuthAnonymousPaymentUpdateRequest(requestJwt, responseJwt, paReq, createTokenResponse, enrolmentCheckFields)
        def paymentUpdateResponse = testRestTemplate.postForEntity(paymentUpdateUrl, paymentUpdateRequest, String)

        then: 'payment successful and validate response stored'
        paymentUpdateResponse.statusCode == HttpStatus.OK
        def updateResponseBody = new JsonSlurper().parseText(paymentUpdateResponse.body)
        validateSuccessfulUpdateResponseForCardRequiringAuthentication(updateResponseBody, testCase)

        and: 'expected fields were sent to cybersource'
        def csAuthRequest = cybersourceHelper.extractRequestFields(csWireMockServer)
        cybersourceHelper.with {
            validateBillingFields(csAuthRequest)
            validateShippingFields(csAuthRequest)
            validateLineItemFields(csAuthRequest, 0)
            validateLineItemFields(csAuthRequest, 1)
            validatePurchaseTotalFields(csAuthRequest)
            validateMerchantFields(csAuthRequest)
            validateToken(csAuthRequest)
            validateDeviceFingerprint(csAuthRequest)
            validateMerchantDefinedFields(csAuthRequest)
            validateAuthServiceRun(csAuthRequest)
            validatePayerAuthValidateServiceRun(csAuthRequest)
        }

        where:
        testCase << new TestCaseDataProvider('/testcases/success/v2/visa/4000000000001091.json')
    }

    @Unroll
    @SuppressWarnings('MethodSize')
    def 'should successfully process payment with saved token'() {
        given: 'card is tokenised'
        def createTokenResponse = tokenHelper.tokeniseCard(testCase.cardNumber, testCase.cardType)

        and: 'cardinal is set up'
        def requestJwt = cardinalHelper.retrieveJwt()
        def consumerSessionId = cardinalHelper.setupForEnrolmentCheck(requestJwt, testCase.cardNumber)

        when: 'payment is created'
        def response = testRestTemplate.postForEntity(paymentCreateUrl, requestBuilder.payerAuthPaymentCreateRequest(requestJwt, createTokenResponse, 'Token alias'), String)

        then: 'enrolment check data is in response'
        response.statusCode == HttpStatus.OK
        def responseBody = new JsonSlurper().parseText(response.body)
        validateCreateResponseForCardRequiringAuthentication(responseBody, testCase.specificationVersion)

        and: 'expected fields were sent to cybersource'
        def csRequest = cybersourceHelper.extractRequestFields(csWireMockServer)
        cybersourceHelper.with {
            validateBillingFields(csRequest)
            validatePurchaseTotalFields(csRequest)
            validateMerchantFields(csRequest)
            validateToken(csRequest)
            validatePayerAuthEnrolmentCheckServiceRun(csRequest)
        }

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
        def paymentUpdateRequest = requestBuilder.payerAuthPaymentUpdateRequest(requestJwt, responseJwt, paReq, createTokenResponse, enrolmentCheckFields, 'Token alias')
        def paymentUpdateResponse = testRestTemplate.postForEntity(paymentUpdateUrl, paymentUpdateRequest, String)

        then: 'payment successful'
        paymentUpdateResponse.statusCode == HttpStatus.OK
        def updateResponseBody = new JsonSlurper().parseText(paymentUpdateResponse.body)

        and: 'expected fields were sent to cybersource'
        def csAuthRequest = cybersourceHelper.extractRequestFields(csWireMockServer)
        cybersourceHelper.with {
            validateBillingFields(csAuthRequest)
            validateShippingFields(csAuthRequest)
            validateLineItemFields(csAuthRequest, 0)
            validateLineItemFields(csAuthRequest, 1)
            validatePurchaseTotalFields(csAuthRequest)
            validateMerchantFields(csAuthRequest)
            validateToken(csAuthRequest)
            validateDeviceFingerprint(csAuthRequest)
            validateMerchantDefinedFields(csAuthRequest)
            validateAuthServiceRun(csAuthRequest)
            validatePayerAuthValidateServiceRun(csAuthRequest)
            validateSubscriptionCreateServiceRun(csAuthRequest)
        }

        and: 'a persistent token is returned'
        def savedToken = updateResponseBody.actions.find {
            it.action == 'setCustomField'
        }.value
        savedToken != null

        when: 'cardinal is set up'
        def requestJwtForSavedToken = cardinalHelper.retrieveJwt()
        def consumerSessionIdForSavedToken = cardinalHelper.setupForEnrolmentCheck(requestJwtForSavedToken, testCase.cardNumber)

        and: 'payment is created with saved token'
        def paymentCreateWithSavedTokenRequest = requestBuilder.payerAuthPaymentCreateRequestWithSavedToken(requestJwtForSavedToken, createTokenResponse, savedToken)
        def responseForSavedToken = testRestTemplate.postForEntity(paymentCreateUrl, paymentCreateWithSavedTokenRequest, String)

        then: 'enrolment check data is in response'
        responseForSavedToken.statusCode == HttpStatus.OK
        def responseBodyForSavedToken = new JsonSlurper().parseText(responseForSavedToken.body)
        validateCreateResponseForCardRequiringAuthentication(responseBody, testCase.specificationVersion)

        and: 'expected fields were sent to cybersource'
        def csRequestForSavedToken = cybersourceHelper.extractRequestFields(csWireMockServer)
        cybersourceHelper.with {
            validateBillingFields(csRequestForSavedToken)
            validatePurchaseTotalFields(csRequestForSavedToken)
            validateMerchantFields(csRequestForSavedToken)
            validateSavedToken(csRequestForSavedToken)
            validatePayerAuthEnrolmentCheckServiceRun(csRequestForSavedToken)
        }

        when: 'authentication continued'
        def acsUrlForSavedToken = commerceToolsHelper.getCustomFieldValue(responseBodyForSavedToken, 'cs_payerAuthenticationAcsUrl')
        def paReqForSavedToken = commerceToolsHelper.getCustomFieldValue(responseBodyForSavedToken, 'cs_payerAuthenticationPaReq')
        Map enrolmentCheckFieldsForSavedToken = responseBodyForSavedToken.actions.find { it.action == 'addInterfaceInteraction' }.fields
        def authenticationTransactionIdForSavedToken = enrolmentCheckFields.authenticationTransactionId

        def continueResponseForSavedToken = cardinalHelper.continueAuthentication(requestJwtForSavedToken, authenticationTransactionIdForSavedToken, consumerSessionIdForSavedToken)

        then: 'response is okay'
        continueResponseForSavedToken.statusCode == HttpStatus.OK

        when: 'process ACS form'
        def acsResponseForSavedToken = cardinalHelper.processAcsForm(acsUrlForSavedToken, paReqForSavedToken, consumerSessionIdForSavedToken)

        then: 'response is okay'
        acsResponseForSavedToken.status == 200

        when: 'paRes is submitted'
        def responseJwtForSavedToken = cardinalHelper.submitPaRes(acsResponseForSavedToken.body)

        and: 'payment is updated with transaction and response JWT'
        def paymentUpdateRequestForSavedToken = requestBuilder.payerAuthPaymentUpdateRequestWithSavedToken(requestJwtForSavedToken,
                responseJwtForSavedToken, paReqForSavedToken, createTokenResponse, enrolmentCheckFieldsForSavedToken, savedToken)
        def paymentUpdateResponseForSavedToken = testRestTemplate.postForEntity(paymentUpdateUrl, paymentUpdateRequestForSavedToken, String)

        then: 'payment successful and validate response stored'
        paymentUpdateResponseForSavedToken.statusCode == HttpStatus.OK
        def updateResponseBodyForSavedToken = new JsonSlurper().parseText(paymentUpdateResponseForSavedToken.body)
        validateSuccessfulUpdateResponseForCardRequiringAuthentication(updateResponseBodyForSavedToken, testCase)

        and: 'expected fields were sent to cybersource'
        def csAuthRequestForSavedToken = cybersourceHelper.extractRequestFields(csWireMockServer)
        cybersourceHelper.with {
            validateBillingFields(csAuthRequestForSavedToken)
            validateShippingFields(csAuthRequestForSavedToken)
            validateLineItemFields(csAuthRequestForSavedToken, 0)
            validateLineItemFields(csAuthRequestForSavedToken, 1)
            validatePurchaseTotalFields(csAuthRequestForSavedToken)
            validateMerchantFields(csAuthRequestForSavedToken)
            validateSavedToken(csAuthRequestForSavedToken)
            validateDeviceFingerprint(csAuthRequestForSavedToken)
            validateMerchantDefinedFields(csAuthRequestForSavedToken)
            validateAuthServiceRun(csAuthRequestForSavedToken)
            validatePayerAuthValidateServiceRun(csAuthRequestForSavedToken)
            validateSubscriptionUpdateServiceRun(csAuthRequestForSavedToken)
        }

        where:
        testCase << new TestCaseDataProvider('/testcases/success/v2/visa/4000000000001091.json')
    }

    def validateCreateResponseForCardRequiringAuthentication(Map responseBody, String version) {
        assert responseBody.errors.empty
        assert responseBody.actions.size == 5

        def addInterfaceInteraction = responseBody.actions.find { it.action == 'addInterfaceInteraction' }
        assert addInterfaceInteraction.type.key == 'cybersource_payer_authentication_enrolment_check'
        assert addInterfaceInteraction.fields.size() == (version == '1.0.2' ? 8 : 6)
        assert addInterfaceInteraction.fields.authenticationTransactionId != null
        assert addInterfaceInteraction.fields.veresEnrolled == 'Y'
        assert addInterfaceInteraction.fields.cardinalReferenceId != null
        assert addInterfaceInteraction.fields.specificationVersion.startsWith(version)
        assert addInterfaceInteraction.fields.authenticationRequired == true
        assert addInterfaceInteraction.fields.authorizationAllowed == true

        assert commerceToolsHelper.getCustomFieldValue(responseBody, 'cs_payerAuthenticationRequired') == true
        assert commerceToolsHelper.getCustomFieldValue(responseBody, 'cs_payerAuthenticationTransactionId') != null
        assert commerceToolsHelper.getCustomFieldValue(responseBody, 'cs_payerAuthenticationAcsUrl') != null
        assert commerceToolsHelper.getCustomFieldValue(responseBody, 'cs_payerAuthenticationPaReq') != null

        if (version == '1.0.2') {
            assert addInterfaceInteraction.fields.xid != null
            assert addInterfaceInteraction.fields.proofXml != null
            assert commerceToolsHelper
                    .getCustomFieldValue(responseBody, 'cs_payerAuthenticationAcsUrl')
                    .startsWith('https://merchantacsstag.cardinalcommerce.com/MerchantACSWeb/pareq.jsp')
        } else {
            assert addInterfaceInteraction.fields.xid == null
            assert addInterfaceInteraction.fields.proofXml == null
            assert commerceToolsHelper
                    .getCustomFieldValue(responseBody, 'cs_payerAuthenticationAcsUrl')
                    .startsWith('https://0merchantacsstag.cardinalcommerce.com/MerchantACSWeb/creq.jsp')
        }
        true
    }

    def validateSuccessfulUpdateResponseForCardRequiringAuthentication(Map responseBody, TestCase testCase) {
        assert responseBody.errors.empty
        assert responseBody.actions.size == 3

        def changeTransactionInteractionId = responseBody.actions.find { it.action == 'changeTransactionInteractionId' }
        assert changeTransactionInteractionId.interactionId != null
        assert changeTransactionInteractionId.transactionId != null

        def changeTransactionState = responseBody.actions.find { it.action == 'changeTransactionState' }
        assert changeTransactionState.state == 'Success'
        assert changeTransactionState.transactionId == '8788176c-e42f-4544-aeaf-a155e1232292'

        validateResultInteraction(responseBody, testCase)

        true
    }

    def validateFailureUpdateResponseForCardRequiringAuthentication(Map responseBody, TestCase testCase) {
        assert responseBody.errors.empty
        assert responseBody.actions.size == 4

        def changeTransactionInteractionId = responseBody.actions.find { it.action == 'changeTransactionInteractionId' }
        assert changeTransactionInteractionId.interactionId != null
        assert changeTransactionInteractionId.transactionId != null

        def changeTransactionState = responseBody.actions.find { it.action == 'changeTransactionState' }
        assert changeTransactionState.state == 'Failure'
        assert changeTransactionState.transactionId == '8788176c-e42f-4544-aeaf-a155e1232292'

        def addInterfaceInteraction = responseBody.actions.find { it.action == 'addInterfaceInteraction' }
        addInterfaceInteraction.type.key == 'cybersource_payment_failure'
        addInterfaceInteraction.fields.get('transactionId') == '8788176c-e42f-4544-aeaf-a155e1232292'
        addInterfaceInteraction.fields.get('reasonCode') == '476'

        validateResultInteraction(responseBody, testCase)

        true
    }

    def validateResultInteraction(Map responseBody, TestCase testCase) {
        def addInterfaceInteraction = responseBody.actions.find {
            it.action == 'addInterfaceInteraction' && it.type.key == 'cybersource_payer_authentication_validate_result'
        }
        assert addInterfaceInteraction.fields.size() == testCase.fieldCount
        assert addInterfaceInteraction.fields.authenticationStatusMessage == testCase.authenticationStatusMessage
        assert addInterfaceInteraction.fields.paresStatus == testCase.paResStatus
        assert addInterfaceInteraction.fields.authenticationResult == testCase.authenticationResult
        assert addInterfaceInteraction.fields.specificationVersion.startsWith(testCase.specificationVersion)
        assert addInterfaceInteraction.fields.commerceIndicator == testCase.commerceIndicator
        assert addInterfaceInteraction.fields.eciRaw == testCase.eciRaw
        assert addInterfaceInteraction.fields.eci == testCase.eci
        assert addInterfaceInteraction.fields.cavvAlgorithm == testCase.cavvAlgorithm
        assert addInterfaceInteraction.fields.ucafCollectionIndicator == testCase.collectionIndicator

        assert testCase.expectXid == (addInterfaceInteraction.fields.xid != null)
        assert testCase.expectCavv == (addInterfaceInteraction.fields.cavv != null)
        assert testCase.expectAav == (addInterfaceInteraction.fields.ucafAuthenticationData != null)

        true
    }
}
