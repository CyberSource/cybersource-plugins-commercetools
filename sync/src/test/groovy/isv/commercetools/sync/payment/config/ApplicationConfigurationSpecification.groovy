package isv.commercetools.sync.payment.config

import Invokers.ApiClient
import io.sphere.sdk.client.SphereClient
import isv.commercetools.sync.SynchronizationRunner
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
        def paymentServiceTransactionSearchClientMock = Mock(ApiClient)
        def paymentServiceDecisionSearchClientMock = Mock(ApiClient)

        when:
        def result = testObj.syncRunner(sphereClientMock, paymentServiceTransactionSearchClientMock, paymentServiceDecisionSearchClientMock)

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
        PaymentServiceClientConfigurationProperties paymentServiceClientConfigurationProperties = Mock(PaymentServiceClientConfigurationProperties)
        paymentServiceClientConfigurationProperties.client >> emptyMap()

        when:
        testObj.paymentServiceClient(paymentServiceClientConfigurationProperties)

        then:
        def exception = thrown(BeanInstantiationException)
        exception.message == 'Failed to instantiate [java.util.Properties]: No payment service client configuration provided'
    }

    def 'should create a payment service client'() {
        given:
        PaymentServiceClientConfigurationProperties paymentServiceClientConfigurationProperties = Mock(PaymentServiceClientConfigurationProperties)
        paymentServiceClientConfigurationProperties.client >> ['runEnvironment':'SANDBOX']

        when:
        def result = testObj.paymentServiceClient(paymentServiceClientConfigurationProperties)

        then:
        result != null
        result instanceof ApiClient
    }
}
