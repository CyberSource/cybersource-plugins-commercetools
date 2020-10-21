package isv.commercetools.reference.application

import com.github.tomakehurst.wiremock.WireMockServer
import com.github.tomakehurst.wiremock.stubbing.StubMapping
import org.springframework.test.context.ActiveProfiles
import spock.lang.Shared

import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig

@ActiveProfiles(['proxyps', 'proxyct'])
class MockExternalServicesBaseSpecification extends BaseSpecification {

    @Shared
    static WireMockServer paymentServiceWireMockServer = new WireMockServer(wireMockConfig()
            .port(8080)
            .usingFilesUnderDirectory('src/integration-test/resources/wiremock/ps')
    )

    @Shared
    static WireMockServer ctWireMockServer = new WireMockServer(wireMockConfig()
            .port(8081)
            .usingFilesUnderDirectory('src/integration-test/resources/wiremock/ct')
    )

    def 'setupSpec'() {
        paymentServiceWireMockServer.start()
        ctWireMockServer.start()
    }

    def 'setup'() {
        paymentServiceWireMockServer.resetToDefaultMappings()
        ctWireMockServer.resetToDefaultMappings()

        // load potential responses for cart lookup
        loadCtMapping('retrieveAcceptAddressCart.json')
        loadCtMapping('retrieveReviewAddressCart.json')
        loadCtMapping('retrieveRejectAddressCart.json')
        loadCtMapping('retrieveMissingAuthFieldsCart.json')
        loadCtMapping('retrieveMissingBillingAddressFieldsCart.json')
        loadCtMapping('retrieveAcceptAddressCartForAnonymousUser.json')
    }

    def 'cleanupSpec'() {
        paymentServiceWireMockServer.stop()
        ctWireMockServer.stop()
    }

    def loadPsMapping(String path) {
        def jsonMapping = new File(getClass().getResource('/wiremock/ps/testCases/' + path).toURI()).text
        paymentServiceWireMockServer.addStubMapping(StubMapping.buildFrom(jsonMapping))
    }

    def loadCtMapping(String path) {
        def jsonMapping = new File(getClass().getResource('/wiremock/ct/testCases/' + path).toURI()).text
        ctWireMockServer.addStubMapping(StubMapping.buildFrom(jsonMapping))
    }

}
