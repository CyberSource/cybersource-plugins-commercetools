package isv.commercetools.reference.application

import groovy.json.JsonSlurper
import isv.commercetools.reference.application.feature.FeatureFlag
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus
import spock.lang.Unroll

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AuthorizationSpecification extends MockExternalServicesBaseSpecification {

    def decisionManagerFeatureFlagUrl = '/actuator/features/DECISION_MANAGER'

    @Unroll
    def 'Should successfully authorize when card request is a #description request'() {
        given: 'card is tokenised'
        def createTokenResponse = tokenHelper.tokeniseCard(cardNumber, cardType)
        createTokenResponse.token != null

        when: 'we create a payment'
        def createResponse = testRestTemplate.postForEntity(paymentCreateUrl, requestBuilder.noPayerAuthPaymentCreateRequest(createTokenResponse), String)

        then: 'there should be no errors or actions'
        createResponse.statusCode == HttpStatus.OK
        def createResponseBody = new JsonSlurper().parseText(createResponse.body)
        createResponseBody.errors.empty
        createResponseBody.actions.empty

        when: 'we update the payment with an initial auth transaction'
        def updateResponse = testRestTemplate.postForEntity(paymentUpdateUrl, requestBuilder.noPayerAuthPaymentUpdateRequest(createTokenResponse, amount), String)

        then: 'the updateResponse should be OK'
        updateResponse.statusCode == HttpStatus.OK
        def responseBody = new JsonSlurper().parseText(updateResponse.body)

        and: 'we should have a changeTransactionState action and a changeTransactionInteractionId'
        responseBody.errors.empty
        responseBody.actions.size == 2

        def changeTransactionInteractionId = responseBody.actions.find {
            it.action == 'changeTransactionInteractionId'
        }
        changeTransactionInteractionId.interactionId != null
        changeTransactionInteractionId.transactionId == '8788176c-e42f-4544-aeaf-a155e1232292'

        def changeTransactionState = responseBody.actions.find { it.action == 'changeTransactionState' }
        changeTransactionState.state == 'Success'
        changeTransactionState.transactionId == '8788176c-e42f-4544-aeaf-a155e1232292'

        and: 'expected fields were sent to payment service'
        def psRequest = paymentServiceHelper.extractRequestFields(paymentServiceWireMockServer)
        paymentServiceHelper.with {
            validateBillingFields(psRequest)
            validateShippingFields(psRequest)
            validateLineItemFields(psRequest, 0)
            validateLineItemFields(psRequest, 1)
            validatePurchaseTotalFields(psRequest, new BigDecimal(amount).movePointLeft(2).toString())
            validateMerchantFields(psRequest)
            validateToken(psRequest)
            validateDeviceFingerprint(psRequest)
            validateMerchantDefinedFields(psRequest)
            validateAuthServiceRun(psRequest)
        }

        where:
        description               | cardType      | cardNumber           | amount
        'successful amex'         | 'Amex'        | '3782 8224 6310 005' | '123'
        'successful jcb'          | 'JCB'         | '3566111111111113'   | '123'
        'successful maestro intl' | 'MaestroIntl' | '50339619890917'     | '123'
        'successful maestro uk'   | 'MaestroUK'   | '6759411100000008'   | '123'
        'successful mastercard'   | 'Mastercard'  | '2222420000001113'   | '123'
        'successful visa'         | 'Visa'        | '4111111111111111'   | '123'
    }

    def 'Should successfully authorize for anonymous user'() {
        given: 'card is tokenised'
        def createTokenResponse = tokenHelper.tokeniseCard('4111111111111111', 'Visa')
        createTokenResponse.token != null

        when: 'we create a payment'
        def createResponse = testRestTemplate.postForEntity(paymentCreateUrl, requestBuilder.noPayerAuthAnonymousPaymentCreateRequest(createTokenResponse), String)

        then: 'there should be no errors or actions'
        createResponse.statusCode == HttpStatus.OK
        def createResponseBody = new JsonSlurper().parseText(createResponse.body)
        createResponseBody.errors.empty
        createResponseBody.actions.empty

        when: 'we update the payment with an initial auth transaction'
        def updateResponse = testRestTemplate.postForEntity(paymentUpdateUrl, requestBuilder.noPayerAuthAnonymousPaymentUpdateRequest(createTokenResponse), String)

        then: 'the updateResponse should be OK'
        updateResponse.statusCode == HttpStatus.OK
        def responseBody = new JsonSlurper().parseText(updateResponse.body)

        and: 'we should have a changeTransactionState action and a changeTransactionInteractionId'
        responseBody.errors.empty
        responseBody.actions.size == 2

        def changeTransactionInteractionId = responseBody.actions.find {
            it.action == 'changeTransactionInteractionId'
        }
        changeTransactionInteractionId.interactionId != null
        changeTransactionInteractionId.transactionId == '8788176c-e42f-4544-aeaf-a155e1232292'

        def changeTransactionState = responseBody.actions.find { it.action == 'changeTransactionState' }
        changeTransactionState.state == 'Success'
        changeTransactionState.transactionId == '8788176c-e42f-4544-aeaf-a155e1232292'

        and: 'expected fields were sent to payment service'
        def psRequest = paymentServiceHelper.extractRequestFields(paymentServiceWireMockServer)
        paymentServiceHelper.with {
            validateBillingFields(psRequest)
            validateShippingFields(psRequest)
            validateLineItemFields(psRequest, 0)
            validateLineItemFields(psRequest, 1)
            validatePurchaseTotalFields(psRequest)
            validateMerchantFields(psRequest)
            validateToken(psRequest)
            validateDeviceFingerprint(psRequest)
            validateMerchantDefinedFields(psRequest)
            validateAuthServiceRun(psRequest)
        }
    }

    @SuppressWarnings('MethodSize')
    def 'Should successfully save a token and then authorize with it'() {
        given: 'card is tokenised'
        def createTokenResponse = tokenHelper.tokeniseCard('4111111111111111', 'Visa')
        createTokenResponse.token != null

        when: 'we create a payment providing an alias for the token'
        def createRequest = requestBuilder.noPayerAuthPaymentCreateRequest(createTokenResponse, 'customer-with-accept-address', 'Save it')
        def createResponse = testRestTemplate.postForEntity(paymentCreateUrl, createRequest, String)

        then: 'there should be no errors or actions'
        createResponse.statusCode == HttpStatus.OK
        def createResponseBody = new JsonSlurper().parseText(createResponse.body)
        createResponseBody.errors.empty
        createResponseBody.actions.empty

        when: 'we update the payment with an initial auth transaction'
        def updateRequest = requestBuilder.noPayerAuthPaymentUpdateRequest(createTokenResponse, '123', 'customer-with-accept-address', 'Save it')
        def updateResponse = testRestTemplate.postForEntity(paymentUpdateUrl, updateRequest, String)

        then: 'the updateResponse should be OK'
        updateResponse.statusCode == HttpStatus.OK
        def responseBody = new JsonSlurper().parseText(updateResponse.body)

        and: 'we should have a changeTransactionState action and a changeTransactionInteractionId'
        responseBody.errors.empty
        responseBody.actions.size == 3

        def changeTransactionInteractionId = responseBody.actions.find {
            it.action == 'changeTransactionInteractionId'
        }
        changeTransactionInteractionId.interactionId != null
        changeTransactionInteractionId.transactionId == '8788176c-e42f-4544-aeaf-a155e1232292'

        def changeTransactionState = responseBody.actions.find { it.action == 'changeTransactionState' }
        changeTransactionState.state == 'Success'
        changeTransactionState.transactionId == '8788176c-e42f-4544-aeaf-a155e1232292'

        and: 'expected fields were sent to payment service'
        def psRequest = paymentServiceHelper.extractRequestFields(paymentServiceWireMockServer)
        paymentServiceHelper.with {
            validateBillingFields(psRequest)
            validateShippingFields(psRequest)
            validateLineItemFields(psRequest, 0)
            validateLineItemFields(psRequest, 1)
            validatePurchaseTotalFields(psRequest, '1.23')
            validateMerchantFields(psRequest)
            validateToken(psRequest)
            validateDeviceFingerprint(psRequest)
            validateMerchantDefinedFields(psRequest)
            validateAuthServiceRun(psRequest)
            validateSubscriptionCreateServiceRun(psRequest)
        }

        and: 'a persistent token is returned'
        def savedToken = responseBody.actions.find {
            it.action == 'setCustomField'
        }.value
        savedToken != null

        when: 'we create a payment using the saved token'
        def createWithSavedTokenRequest = requestBuilder.noPayerAuthWithSavedTokenPaymentCreateRequest(createTokenResponse, savedToken)
        def createWithSavedTokenResponse = testRestTemplate.postForEntity(paymentCreateUrl, createWithSavedTokenRequest, String)

        then: 'there should be no errors or actions'
        createWithSavedTokenResponse.statusCode == HttpStatus.OK
        def createWithSavedTokenResponseBody = new JsonSlurper().parseText(createWithSavedTokenResponse.body)
        createWithSavedTokenResponseBody.errors.empty
        createWithSavedTokenResponseBody.actions.empty

        when: 'we update the payment with an initial auth transaction'
        def updateWithSavedTokenRequest = requestBuilder.noPayerAuthWithSavedTokenPaymentUpdateRequest(createTokenResponse, savedToken)
        def updateWithSavedTokenResponse = testRestTemplate.postForEntity(paymentUpdateUrl, updateWithSavedTokenRequest, String)

        then: 'the updateWithSavedTokenResponse should be OK'
        updateWithSavedTokenResponse.statusCode == HttpStatus.OK
        def updateWithSavedTokenResponseBody = new JsonSlurper().parseText(updateWithSavedTokenResponse.body)

        and: 'we should have a changeTransactionState action and a changeTransactionInteractionId'
        updateWithSavedTokenResponseBody.errors.empty
        updateWithSavedTokenResponseBody.actions.size == 2

        def savedTokenChangeTransactionInteractionId = updateWithSavedTokenResponseBody.actions.find {
            it.action == 'changeTransactionInteractionId'
        }
        savedTokenChangeTransactionInteractionId.interactionId != null
        savedTokenChangeTransactionInteractionId.transactionId == '8788176c-e42f-4544-aeaf-a155e1232292'

        def savedTokenChangeTransactionState = updateWithSavedTokenResponseBody.actions.find { it.action == 'changeTransactionState' }
        savedTokenChangeTransactionState.state == 'Success'
        savedTokenChangeTransactionState.transactionId == '8788176c-e42f-4544-aeaf-a155e1232292'

        and: 'expected fields were sent to payment service'
        def psSavedTokenRequest = paymentServiceHelper.extractRequestFields(paymentServiceWireMockServer)
        paymentServiceHelper.with {
            validateBillingFields(psSavedTokenRequest)
            validateShippingFields(psSavedTokenRequest)
            validateLineItemFields(psSavedTokenRequest, 0)
            validateLineItemFields(psSavedTokenRequest, 1)
            validatePurchaseTotalFields(psSavedTokenRequest, '1.23')
            validateMerchantFields(psSavedTokenRequest)
            validateSavedToken(psSavedTokenRequest)
            validateDeviceFingerprint(psSavedTokenRequest)
            validateMerchantDefinedFields(psSavedTokenRequest)
            validateAuthServiceRun(psSavedTokenRequest)
            validateSubscriptionUpdateServiceRun(psSavedTokenRequest)
        }
    }

    @Unroll
    def 'should fail authorizations when the request contains #description'() {
        given: 'card is tokenised'
        def createTokenResponse = tokenHelper.tokeniseCard(cardNumber, cardType)
        createTokenResponse.token != null

        when: 'we update a payment with an initial auth transaction'
        def response = testRestTemplate.postForEntity(paymentUpdateUrl, requestBuilder.noPayerAuthPaymentUpdateRequest(createTokenResponse, amount), String)

        then:
        response.statusCode == HttpStatus.OK
        def responseBody = new JsonSlurper().parseText(response.body)

        and:
        responseBody.errors.empty
        responseBody.actions.size == 3

        def changeTransactionInteractionId = responseBody.actions.find {
            it.action == 'changeTransactionInteractionId'
        }
        changeTransactionInteractionId.interactionId != null
        changeTransactionInteractionId.transactionId == '8788176c-e42f-4544-aeaf-a155e1232292'

        def changeTransactionState = responseBody.actions.find { it.action == 'changeTransactionState' }
        changeTransactionState.state == 'Failure'
        changeTransactionState.transactionId == '8788176c-e42f-4544-aeaf-a155e1232292'

        def addInterfaceInteraction = responseBody.actions.find { it.action == 'addInterfaceInteraction' }
        addInterfaceInteraction.type.key == 'isv_payment_failure'
        addInterfaceInteraction.fields.get('transactionId') == '8788176c-e42f-4544-aeaf-a155e1232292'
        addInterfaceInteraction.fields.get('reasonCode') == expectedReasonCode

        and: 'expected fields were sent to payment service'
        def psRequest = paymentServiceHelper.extractRequestFields(paymentServiceWireMockServer)
        paymentServiceHelper.with {
            validateBillingFields(psRequest)
            validateShippingFields(psRequest)
            validateLineItemFields(psRequest, 0)
            validateLineItemFields(psRequest, 1)
            validatePurchaseTotalFields(psRequest, new BigDecimal(amount).movePointLeft(2).setScale(0).toString())
            validateMerchantFields(psRequest)
            validateToken(psRequest)
            validateDeviceFingerprint(psRequest)
            validateMerchantDefinedFields(psRequest)
            validateAuthServiceRun(psRequest)
        }

        where:
        description     | cardType | cardNumber         | amount         | expectedReasonCode
        'rejected visa' | 'Visa'   | '4111111111111111' | '100000000000' | '102'
        'error visa'    | 'Visa'   | '4111111111111111' | '999800'       | '150'
    }

    @Unroll
    def 'transaction state should be #expectedState where decision manager response is #decision and override is #featureFlag'() {
        given: 'decision manager feature flag is configured'
        configureDecisionManagerFeatureFlag(featureFlagValue)
        def failureExpected = expectedState == 'Failure'

        and: 'card is tokenised'
        def createTokenResponse = tokenHelper.tokeniseCard('4111111111111111', 'Visa')

        when: 'payment is created'
        def response = testRestTemplate.postForEntity(paymentCreateUrl, requestBuilder.noPayerAuthPaymentCreateRequest(createTokenResponse, customerId), String)

        then: 'create was successful'
        response.statusCode == HttpStatus.OK
        def responseBody = new JsonSlurper().parseText(response.body)
        responseBody.errors.empty
        responseBody.actions.empty

        when: 'payment is updated with transaction'
        def paymentUpdateRequest = requestBuilder.noPayerAuthPaymentUpdateRequest(createTokenResponse, '123', customerId)
        def paymentUpdateResponse = testRestTemplate.postForEntity(paymentUpdateUrl, paymentUpdateRequest, String)

        then: 'payment has expected state'
        paymentUpdateResponse.statusCode == HttpStatus.OK
        def updateResponseBody = new JsonSlurper().parseText(paymentUpdateResponse.body)
        updateResponseBody.errors.empty
        updateResponseBody.actions.size == failureExpected ? 3 : 2

        def changeTransactionInteractionId = updateResponseBody.actions.find {
            it.action == 'changeTransactionInteractionId'
        }
        changeTransactionInteractionId.interactionId != null
        changeTransactionInteractionId.transactionId != null

        def changeTransactionState = updateResponseBody.actions.find { it.action == 'changeTransactionState' }
        changeTransactionState.state == expectedState
        changeTransactionState.transactionId == '8788176c-e42f-4544-aeaf-a155e1232292'

        if (failureExpected) {
            def addInterfaceInteraction = updateResponseBody.actions.find { it.action == 'addInterfaceInteraction' }
            addInterfaceInteraction.type.key == 'isv_payment_failure'
            addInterfaceInteraction.fields.get('transactionId') == '8788176c-e42f-4544-aeaf-a155e1232292'
            addInterfaceInteraction.fields.get('reasonCode') == '102'
        }

        and: 'expected fields were sent to payment service'
        def psRequest = paymentServiceHelper.extractRequestFields(paymentServiceWireMockServer)
        paymentServiceHelper.with {
            validateBillingFields(psRequest)
            validateShippingFields(psRequest)
            validateLineItemFields(psRequest, 0)
            validateLineItemFields(psRequest, 1)
            validatePurchaseTotalFields(psRequest, '1.23')
            validateMerchantFields(psRequest)
            validateToken(psRequest)
            validateDeviceFingerprint(psRequest)
            validateMerchantDefinedFields(psRequest)
            validateAuthServiceRun(psRequest)
            validateDecisionManagerFlag(psRequest, featureFlagValue)
        }

        cleanup:
        configureDecisionManagerFeatureFlag(Optional.of(true))

        where:
        decision | customerId                     | featureFlagValue   | featureFlag    | expectedState
        'Accept' | 'customer-with-accept-address' | Optional.empty()   | 'not set'      | 'Success'
        'Review' | 'customer-with-review-address' | Optional.empty()   | 'not set'      | 'Pending'
        'Reject' | 'customer-with-reject-address' | Optional.of(true)  | 'set to true'  | 'Failure'
        'Reject' | 'customer-with-reject-address' | Optional.empty()   | 'not set'      | 'Failure'
        'Accept' | 'customer-with-accept-address' | Optional.of(true)  | 'set to true'  | 'Success'
        'Review' | 'customer-with-review-address' | Optional.of(true)  | 'set to true'  | 'Pending'
        'Accept' | 'customer-with-accept-address' | Optional.of(false) | 'set to false' | 'Success'
        'Review' | 'customer-with-review-address' | Optional.of(false) | 'set to false' | 'Success'
        'Reject' | 'customer-with-reject-address' | Optional.of(false) | 'set to false' | 'Success'
    }

    def configureDecisionManagerFeatureFlag(Optional<Boolean> featureFlagValue) {
        if (featureFlagValue.isPresent()) {
            testRestTemplate.postForObject(decisionManagerFeatureFlagUrl, new FeatureFlag(featureFlagValue.get()), String)
        } else {
            removeDecisionManagerFeatureFlag()
        }
    }

    def removeDecisionManagerFeatureFlag() {
        testRestTemplate.delete(decisionManagerFeatureFlagUrl)
    }

}
