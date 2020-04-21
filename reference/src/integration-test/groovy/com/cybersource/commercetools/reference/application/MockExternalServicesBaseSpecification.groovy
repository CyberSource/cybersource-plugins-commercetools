package com.cybersource.commercetools.reference.application

import com.github.tomakehurst.wiremock.WireMockServer
import com.github.tomakehurst.wiremock.stubbing.StubMapping
import org.springframework.test.context.ActiveProfiles
import spock.lang.Shared

import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig

@ActiveProfiles(['proxycs', 'proxyct'])
class MockExternalServicesBaseSpecification extends BaseSpecification {

    @Shared
    static WireMockServer csWireMockServer = new WireMockServer(wireMockConfig()
            .port(8080)
            .usingFilesUnderDirectory('src/integration-test/resources/wiremock/cs')
    )

    @Shared
    static WireMockServer ctWireMockServer = new WireMockServer(wireMockConfig()
            .port(8081)
            .usingFilesUnderDirectory('src/integration-test/resources/wiremock/ct')
    )

    def 'setupSpec'() {
        csWireMockServer.start()
        ctWireMockServer.start()
    }

    def 'setup'() {
        csWireMockServer.resetToDefaultMappings()
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
        csWireMockServer.stop()
        ctWireMockServer.stop()
    }

    def loadCsMapping(String path) {
        def jsonMapping = new File(getClass().getResource('/wiremock/cs/testCases/' + path).toURI()).text
        csWireMockServer.addStubMapping(StubMapping.buildFrom(jsonMapping))
    }

    def loadCtMapping(String path) {
        def jsonMapping = new File(getClass().getResource('/wiremock/ct/testCases/' + path).toURI()).text
        ctWireMockServer.addStubMapping(StubMapping.buildFrom(jsonMapping))
    }

}
