package isv.commercetools.reference.application.config

import isv.payments.CybersourceClient
import org.springframework.beans.BeanInstantiationException
import spock.lang.Specification
import spock.lang.Unroll

import static java.util.Collections.emptyMap

class CybersourceConfigurationSpecification extends Specification {

    CardinalClientConfigurationProperties cardinalClientConfigurationProperties

    CybersourceConfiguration testObj

    def setup() {
        cardinalClientConfigurationProperties = new CardinalClientConfigurationProperties()
        cardinalClientConfigurationProperties.apiKey = 'api key'
        cardinalClientConfigurationProperties.apiIdentifier = 'api identifier'
        cardinalClientConfigurationProperties.orgUnitId = 'org unit id'
        cardinalClientConfigurationProperties.ttlMillis = 1000

        testObj = new CybersourceConfiguration(cardinalClientConfigurationProperties)
    }

    @Unroll
    def 'should initialise flex service for #environment'() {
        given:
        Properties cybersourceProperties = new Properties()
        cybersourceProperties.runEnvironment = runEnvironment

        when:
        def result = testObj.keyService(cybersourceProperties, 'target origins', connectTimeout)

        then:
        result.targetOrigins == 'target origins'
        result.apiClient.merchantConfig.runEnvironment == runEnvironment
        result.apiClient.connectTimeout == connectTimeout

        where:
        environment | runEnvironment                    | connectTimeout
        'LIVE'      | 'CyberSource.Environment.LIVE'    | 2000
        'TEST'      | 'CyberSource.Environment.SANDBOX' | 3000
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

    def 'should create cybersource properties'() {
        given:
        CybersourceConfigurationProperties cybersourceConfigurationProperties = Mock(CybersourceConfigurationProperties)
        cybersourceConfigurationProperties.client >> ['merchantId':'merchantId']

        when:
        def result = testObj.cybersourceProperties(cybersourceConfigurationProperties)

        then:
        result.containsKey('merchantId')
    }

    def 'should throw a BeanInstantiationException for empty properties'() {
        given:
        CybersourceConfigurationProperties cybersourceConfigurationProperties = Mock(CybersourceConfigurationProperties)
        cybersourceConfigurationProperties.client >> emptyMap()

        when:
        testObj.cybersourceProperties(cybersourceConfigurationProperties)

        then:
        def exception = thrown(BeanInstantiationException)
        exception.message == 'Failed to instantiate [java.util.Properties]: No Cybersource client configuration provided'
    }

    def 'should create a cybersource client'() {
        given:
        Properties propertiesMock = Mock(Properties)

        when:
        def result = testObj.cybersourceClient(propertiesMock)

        then:
        result != null
        result instanceof CybersourceClient
    }

    def 'should set the merchantId and developerId'() {
        given:
        def merchantId = 'Im A MerchantID'
        def developerId = 'Im A DeveloperID'
        Properties cybersourceProperties = ['merchantID':merchantId, 'developerID':developerId] as Properties

        when:
        def cybersourceIds = testObj.cybersourceIds(cybersourceProperties)

        then:
        cybersourceIds.merchantId == merchantId
        cybersourceIds.developerId == developerId
    }

}
