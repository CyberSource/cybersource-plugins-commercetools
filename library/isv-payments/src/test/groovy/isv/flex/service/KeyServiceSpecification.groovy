package isv.flex.service

import Api.KeyGenerationApi
import Invokers.ApiClient
import Model.FlexV1KeysPost200Response
import spock.lang.Specification
import spock.lang.Unroll

class KeyServiceSpecification extends Specification {

    KeyService testObj

    ApiClient apiClientMock = Mock()
    KeyGenerationApi keyGenerationApiMock = Mock()
    FlexV1KeysPost200Response flexResponseMock = Mock()
    Properties paymentServicePropertiesMock = Mock()

    def "should generate key"() {
        given:
        testObj = Spy(new KeyService(paymentServicePropertiesMock, 'target origins', 1234))

        and:
        def keyGenerationRequest
        1 * testObj.keyGenerationApi() >> keyGenerationApiMock
        1 * keyGenerationApiMock.generatePublicKey(_, 'JWT') >> { args ->
            keyGenerationRequest = args[0]
            flexResponseMock
        }
        flexResponseMock.keyId >> 'the key id'

        when:
        def result = testObj.generateKey()

        then:
        keyGenerationRequest.encryptionType == 'RsaOaep256'
        keyGenerationRequest.targetOrigin == 'target origins'
        result == 'the key id'
    }

    @Unroll
    def 'should initialise api client for #environment'() {
        given:
        Properties paymentServiceProperties = new Properties()
        paymentServiceProperties.runEnvironment = runEnvironment
        testObj = Spy(new KeyService(paymentServiceProperties, 'target origins', connectTimeout))

        when:
        def result = testObj.apiClient()

        then:
        result.merchantConfig.runEnvironment == runEnvironment
        result.connectTimeout == connectTimeout

        where:
        environment | runEnvironment                    | connectTimeout
        'LIVE'      | 'CyberSource.Environment.LIVE'    | 2000
        'TEST'      | 'CyberSource.Environment.SANDBOX' | 3000
    }
}
