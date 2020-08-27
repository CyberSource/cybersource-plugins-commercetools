package isv.commercetools.reference.application.config

import isv.commercetools.reference.application.config.model.CtClientDefinition
import org.springframework.beans.factory.BeanCreationException
import spock.lang.Specification

class CommercetoolsClientConfigurationSpecification extends Specification {

    CtClientConfigurationProperties ctClientConfigurationProperties = new CtClientConfigurationProperties()
    CtClientDefinition ctClientDefinition = new CtClientDefinition()

    CommercetoolsClientConfiguration testObj

    def setup() {
        testObj = new CommercetoolsClientConfiguration(ctClientConfigurationProperties)
    }

    def "should initialise CT client for retrieving types payments"() {
        given:
        ctClientDefinition.clientId = 'client id'
        ctClientDefinition.secret = 'client secret'
        ctClientConfigurationProperties.clientConfig = ['payment':ctClientDefinition]
        ctClientConfigurationProperties.projectKey = 'project key'
        ctClientConfigurationProperties.apiUrl = 'api URL'
        ctClientConfigurationProperties.authUrl = 'auth URL'

        when:
        def result = testObj.paymentSphereClient()

        then:
        result.config.projectKey == 'project key'
        result.config.clientId == 'client id'
        result.config.clientSecret == 'client secret'
        result.config.scopes == ['view_types', 'manage_orders']
    }

    def "should throw BeanCreationException exception if CT client properties is null"() {
        given:
        ctClientConfigurationProperties.projectKey = 'project key'
        ctClientConfigurationProperties.apiUrl = 'api URL'
        ctClientConfigurationProperties.authUrl = 'auth URL'

        when:
        testObj.paymentSphereClient()

        then:
        thrown(BeanCreationException)
    }

    def "should throw BeanCreationException exception if CT client properties are not populated"() {
        given:
        ctClientConfigurationProperties.clientConfig = Collections.emptyMap()
        ctClientConfigurationProperties.projectKey = 'project key'
        ctClientConfigurationProperties.apiUrl = 'api URL'
        ctClientConfigurationProperties.authUrl = 'auth URL'

        when:
        testObj.paymentSphereClient()

        then:
        thrown(BeanCreationException)
    }

}
