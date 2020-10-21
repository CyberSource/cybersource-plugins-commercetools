package isv.commercetools.reference.application.config

import isv.payments.PaymentServiceClient
import org.springframework.beans.BeanInstantiationException
import spock.lang.Specification

import static java.util.Collections.emptyMap

class PaymentServiceConfigurationSpecification extends Specification {

    CardinalClientConfigurationProperties cardinalClientConfigurationProperties

    PaymentServiceConfiguration testObj

    def setup() {
        cardinalClientConfigurationProperties = new CardinalClientConfigurationProperties()
        cardinalClientConfigurationProperties.apiKey = 'api key'
        cardinalClientConfigurationProperties.apiIdentifier = 'api identifier'
        cardinalClientConfigurationProperties.orgUnitId = 'org unit id'
        cardinalClientConfigurationProperties.ttlMillis = 1000

        testObj = new PaymentServiceConfiguration(cardinalClientConfigurationProperties)
    }

    def 'should initialise flex service'() {
        given:
        Properties paymentServiceProperties = new Properties()
        int connectTimeout = 1234

        when:
        def result = testObj.keyService(paymentServiceProperties, 'target origins', connectTimeout)

        then:
        result.paymentServiceProperties == paymentServiceProperties
        result.targetOrigins == 'target origins'
        result.connectTimeout == connectTimeout
    }

    def 'should initialise cardinal service'() {
        when:
        def result = testObj.cardinalService()

        then:
        result.signingKey != null
        result.apiIdentifier == 'api identifier'
        result.orgUnitId == 'org unit id'
        result.ttlMillis == 1000
        cardinalClientConfigurationProperties.apiKey == null
    }

    def 'should create payment service properties'() {
        given:
        PaymentServiceConfigurationProperties paymentServiceConfigurationProperties = Mock(PaymentServiceConfigurationProperties)
        paymentServiceConfigurationProperties.client >> ['merchantId':'merchantId']

        when:
        def result = testObj.paymentServiceProperties(paymentServiceConfigurationProperties)

        then:
        result.containsKey('merchantId')
    }

    def 'should throw a BeanInstantiationException for empty properties'() {
        given:
        PaymentServiceConfigurationProperties paymentServiceConfigurationProperties = Mock(PaymentServiceConfigurationProperties)
        paymentServiceConfigurationProperties.client >> emptyMap()

        when:
        testObj.paymentServiceProperties(paymentServiceConfigurationProperties)

        then:
        def exception = thrown(BeanInstantiationException)
        exception.message == 'Failed to instantiate [java.util.Properties]: No payment service client configuration provided'
    }

    def 'should create a payment service client'() {
        given:
        Properties propertiesMock = Mock(Properties)

        when:
        def result = testObj.paymentServiceClient(propertiesMock)

        then:
        result != null
        result instanceof PaymentServiceClient
    }

    def 'should set the merchantId and developerId'() {
        given:
        def merchantId = 'Im A MerchantID'
        def developerId = 'Im A DeveloperID'
        Properties paymentServiceProperties = ['merchantID':merchantId, 'developerID':developerId] as Properties

        when:
        def paymentServiceIds = testObj.paymentServiceIds(paymentServiceProperties)

        then:
        paymentServiceIds.merchantId == merchantId
        paymentServiceIds.developerId == developerId
    }

}
