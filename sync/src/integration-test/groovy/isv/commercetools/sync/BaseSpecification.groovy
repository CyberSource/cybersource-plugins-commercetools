package isv.commercetools.sync

import com.github.tomakehurst.wiremock.WireMockServer
import groovy.json.JsonSlurper
import org.springframework.beans.factory.annotation.Autowired
import spock.lang.Shared
import spock.lang.Specification

import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig

class BaseSpecification extends Specification {

    @Autowired
    protected SynchronizationRunner runner

    @Autowired
    protected DecisionManagerDecisionSynchronizer decisionManagerDecisionSynchronizer

    @Autowired
    protected RequestStubBuilder requestStubBuilder

    @Shared
    WireMockServer paymentServiceWireMockServer = new WireMockServer(wireMockConfig()
            .port(8080)
            .usingFilesUnderDirectory('src/integration-test/resources')
    )

    @Shared
    WireMockServer ctWireMockServer = new WireMockServer(wireMockConfig()
            .port(8900)
            .usingFilesUnderDirectory('src/integration-test/resources')
    )

    protected verifyNoUnmatchedRequests() {
        ctWireMockServer.findAllUnmatchedRequests().size() == 0 &&
                paymentServiceWireMockServer.findAllUnmatchedRequests().size() == 0
    }

    protected validateActions(String requestBody, String interactionId, String type, String state) {
        Map requestBodyMap = new JsonSlurper().parseText(requestBody)
        assert requestBodyMap.actions.size() == 1
        assert requestBodyMap.actions[0].action == 'addTransaction'
        assert requestBodyMap.actions[0].transaction.interactionId == interactionId
        assert requestBodyMap.actions[0].transaction.type == type
        assert requestBodyMap.actions[0].transaction.state == state
        assert requestBodyMap.actions[0].transaction.amount.centAmount == 549
        assert requestBodyMap.actions[0].transaction.amount.currencyCode == 'GBP'
        true
    }

    protected validateUpdateActions(String requestBody, String transactionId, String state) {
        Map requestBodyMap = new JsonSlurper().parseText(requestBody)
        assert requestBodyMap.actions.size() == 1
        assert requestBodyMap.actions[0].action == 'changeTransactionState'
        assert requestBodyMap.actions[0].transactionId == transactionId
        assert requestBodyMap.actions[0].state == state
        true
    }
}
