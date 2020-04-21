package com.cybersource.commercetools.reference.application

import com.cybersource.commercetools.reference.application.feature.FeatureFlag
import groovy.json.JsonSlurper
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

        and: 'expected fields were sent to cybersource'
        def csRequest = cybersourceHelper.extractRequestFields(csWireMockServer)
        cybersourceHelper.with {
            validateBillingFields(csRequest)
            validateShippingFields(csRequest)
            validateLineItemFields(csRequest, 0)
            validateLineItemFields(csRequest, 1)
            validatePurchaseTotalFields(csRequest, new BigDecimal(amount).movePointLeft(2).toString())
            validateMerchantFields(csRequest)
            validateToken(csRequest)
            validateDeviceFingerprint(csRequest)
            validateMerchantDefinedFields(csRequest)
            validateAuthServiceRun(csRequest)
            validateSubscriptionUpdateServiceRun(csRequest)
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

        and: 'expected fields were sent to cybersource'
        def csRequest = cybersourceHelper.extractRequestFields(csWireMockServer)
        cybersourceHelper.with {
            validateBillingFields(csRequest)
            validateShippingFields(csRequest)
            validateLineItemFields(csRequest, 0)
            validateLineItemFields(csRequest, 1)
            validatePurchaseTotalFields(csRequest)
            validateMerchantFields(csRequest)
            validateToken(csRequest)
            validateDeviceFingerprint(csRequest)
            validateMerchantDefinedFields(csRequest)
            validateAuthServiceRun(csRequest)
            validateSubscriptionUpdateServiceRun(csRequest)
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
        addInterfaceInteraction.type.key == 'cybersource_payment_failure'
        addInterfaceInteraction.fields.get('transactionId') == '8788176c-e42f-4544-aeaf-a155e1232292'
        addInterfaceInteraction.fields.get('reasonCode') == expectedReasonCode

        and: 'expected fields were sent to cybersource'
        def csRequest = cybersourceHelper.extractRequestFields(csWireMockServer)
        cybersourceHelper.with {
            validateBillingFields(csRequest)
            validateShippingFields(csRequest)
            validateLineItemFields(csRequest, 0)
            validateLineItemFields(csRequest, 1)
            validatePurchaseTotalFields(csRequest, new BigDecimal(amount).movePointLeft(2).setScale(0).toString())
            validateMerchantFields(csRequest)
            validateToken(csRequest)
            validateDeviceFingerprint(csRequest)
            validateMerchantDefinedFields(csRequest)
            validateAuthServiceRun(csRequest)
            validateSubscriptionUpdateServiceRun(csRequest)
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
            addInterfaceInteraction.type.key == 'cybersource_payment_failure'
            addInterfaceInteraction.fields.get('transactionId') == '8788176c-e42f-4544-aeaf-a155e1232292'
            addInterfaceInteraction.fields.get('reasonCode') == '102'
        }

        and: 'expected fields were sent to cybersource'
        def csRequest = cybersourceHelper.extractRequestFields(csWireMockServer)
        cybersourceHelper.with {
            validateBillingFields(csRequest)
            validateShippingFields(csRequest)
            validateLineItemFields(csRequest, 0)
            validateLineItemFields(csRequest, 1)
            validatePurchaseTotalFields(csRequest, '1.23')
            validateMerchantFields(csRequest)
            validateToken(csRequest)
            validateDeviceFingerprint(csRequest)
            validateMerchantDefinedFields(csRequest)
            validateAuthServiceRun(csRequest)
            validateSubscriptionUpdateServiceRun(csRequest)
            validateDecisionManagerFlag(csRequest, featureFlagValue)
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
