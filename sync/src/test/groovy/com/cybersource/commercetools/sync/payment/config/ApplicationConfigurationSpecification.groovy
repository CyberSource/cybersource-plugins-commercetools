package com.cybersource.commercetools.sync.payment.config

import Invokers.ApiClient
import com.cybersource.commercetools.sync.SynchronizationRunner
import io.sphere.sdk.client.SphereClient
import org.springframework.beans.BeanInstantiationException
import spock.lang.Specification

import static java.util.Collections.emptyMap

class ApplicationConfigurationSpecification extends Specification {

    def ctClientConfigurationProperties = new CtClientConfigurationProperties()
    def ctPaymentClientConfiguration = new CtClientConfiguration()

    def testObj = new ApplicationConfiguration()

    def setup() {
        ctClientConfigurationProperties.clientConfig = ['payment':ctPaymentClientConfiguration]
        ctClientConfigurationProperties.projectKey = 'project key'
        ctClientConfigurationProperties.apiUrl = 'api URL'
        ctClientConfigurationProperties.authUrl = 'auth URL'
        ctPaymentClientConfiguration.clientId = 'payment client id'
        ctPaymentClientConfiguration.secret = 'client secret'
    }

    def 'should build a sync runner'() {
        given:
        def sphereClientMock = Mock(SphereClient)
        def csTransactionSearchClientMock = Mock(ApiClient)
        def csDecisionSearchClientMock = Mock(ApiClient)

        when:
        def result = testObj.syncRunner(sphereClientMock, csTransactionSearchClientMock, csDecisionSearchClientMock)

        then:
        result instanceof SynchronizationRunner
    }

    def "should initialise CT client for retrieving types payments"() {
        when:
        def result = testObj.paymentSphereClient(ctClientConfigurationProperties)

        then:
        result.config.projectKey == 'project key'
        result.config.clientId == 'payment client id'
        result.config.clientSecret == 'client secret'
        result.config.scopes == ['manage_payments']
    }

    def 'should throw a BeanInstantiationException for empty properties'() {
        given:
        CsClientConfigurationProperties cybersourceConfigurationProperties = Mock(CsClientConfigurationProperties)
        cybersourceConfigurationProperties.client >> emptyMap()

        when:
        testObj.cybersourceClient(cybersourceConfigurationProperties)

        then:
        def exception = thrown(BeanInstantiationException)
        exception.message == 'Failed to instantiate [java.util.Properties]: No Cybersource client configuration provided'
    }

    def 'should create a cybersource client'() {
        given:
        CsClientConfigurationProperties cybersourceConfigurationPropertiesMock = Mock(CsClientConfigurationProperties)
        cybersourceConfigurationPropertiesMock.client >> ['runEnvironment':'SANDBOX']

        when:
        def result = testObj.cybersourceClient(cybersourceConfigurationPropertiesMock)

        then:
        result != null
        result instanceof ApiClient
    }
}
