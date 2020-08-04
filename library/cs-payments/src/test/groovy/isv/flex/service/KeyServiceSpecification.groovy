package isv.flex.service

import Api.KeyGenerationApi
import Invokers.ApiClient
import Model.FlexV1KeysPost200Response
import spock.lang.Specification

class KeyServiceSpecification extends Specification {

    KeyService testObj

    ApiClient apiClientMock = Mock()
    KeyGenerationApi keyGenerationApiMock = Mock()
    FlexV1KeysPost200Response flexResponseMock = Mock()

    def setup() {
        testObj = Spy(new KeyService(apiClientMock, 'target origins'))
    }

    def "should generate key"() {
        given:
        def keyGenerationRequest
        1 * testObj.keyGenerationApi(apiClientMock) >> keyGenerationApiMock
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
}
