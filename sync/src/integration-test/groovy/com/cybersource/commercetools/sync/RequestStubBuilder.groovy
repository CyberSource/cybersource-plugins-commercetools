package com.cybersource.commercetools.sync

import com.github.tomakehurst.wiremock.http.Fault

import static com.github.tomakehurst.wiremock.client.WireMock.*

class RequestStubBuilder {
    def buildStubForSuccessfulCtRequest(String method, String filename, String ctProjectKey) {
        stubFor(request(method, urlMatching(".*/${ctProjectKey}/.*"))
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader('Content-Type', 'application/json')
                        .withBodyFile(filename)
                )
        )
    }

    def buildStubForCTGetPayment(String filename, String ctProjectKey, String paymentId) {
        stubFor(get(urlEqualTo("/${ctProjectKey}/payments/${paymentId}"))
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader('Content-Type', 'application/json')
                        .withBodyFile(filename)
                )
        )
    }

    def buildStubForCsDecisionSearch(String fileName, int status) {
        stubFor(get(urlMatching('.*reporting/v3/conversion-details.*'))
                .willReturn(aResponse()
                        .withStatus(status)
                        .withBodyFile(fileName)
                        .withHeader('Content-Type', $/application/json/$)
                )
        )
    }
    def buildStubFor404CtRequest(String ctProjectKey) {
        stubFor(get(urlMatching(".*${ctProjectKey}.*"))
                .willReturn(aResponse()
                        .withStatus(404)
                        .withHeader('Content-Type', 'application/json')
                )
        )
    }

    def buildStubForCsSearch(String scenarioState, String fileName, String newScenarioState = '') {
        stubFor(post(urlMatching('.*tss/v2.*'))
                .inScenario('twoTerminatingSearches')
                .whenScenarioStateIs(scenarioState)
                .willReturn(aResponse()
                        .withStatus(201)
                        .withBodyFile(fileName)
                        .withHeader('Content-Type', 'application/json')
                )
                .willSetStateTo(newScenarioState)
        )
    }

    /* Fault.CONNECTION_RESET_BY_PEER injects the faulty behaviour in the wiremock
       and sends back the any http response code indicating an error.
       The real Cybersource API client is not letting simulate the 400 and 404 behaviour as one
       always end up with illegalStateException. Fault.CONNECTION_RESET_BY_PEER closes
       connection and hence will be ultimately caught as IOException and APIException will be
       rethrown which is expected when one encounters 400 or 404 situation.
   */
    def buildStubForCsDecisionSearchFor_400_404_Response(int status, String contentType) {
        stubFor(get(urlMatching('.*reporting/v3/conversion-details.*'))
                .willReturn(aResponse()
                        .withStatus(status)
                        .withHeader('Content-Type', contentType)
                        .withFault(Fault.CONNECTION_RESET_BY_PEER)
                )
        )
    }
}
