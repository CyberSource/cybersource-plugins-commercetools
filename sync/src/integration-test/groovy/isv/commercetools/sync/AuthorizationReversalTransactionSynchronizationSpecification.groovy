package isv.commercetools.sync

import com.github.tomakehurst.wiremock.http.RequestMethod
import com.github.tomakehurst.wiremock.matching.RequestPatternBuilder
import groovy.json.JsonSlurper
import isv.commercetools.config.TestConfiguration
import isv.commercetools.sync.cybersource.request.CsTransactionSearch
import isv.commercetools.sync.cybersource.request.CsTransactionSearchImpl
import isv.commercetools.sync.payment.config.ApplicationConfiguration
import isv.commercetools.sync.payment.config.CsClientConfigurationProperties
import isv.commercetools.sync.payment.config.CtClientConfigurationProperties
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles

import static com.github.tomakehurst.wiremock.client.WireMock.anyUrl

@SpringBootTest(classes = [ApplicationConfiguration])
@EnableConfigurationProperties([CtClientConfigurationProperties, CsClientConfigurationProperties, TestConfiguration])
@ActiveProfiles(['dev', 'integration-test'])
class AuthorizationReversalTransactionSynchronizationSpecification extends BaseSpecification {

    @Value('${commercetools.projectKey}')
    String ctProjectKey

    def setupSpec() {
        csWireMockServer.start()
        ctWireMockServer.start()
    }

    def cleanupSpec() {
        csWireMockServer.stop()
        ctWireMockServer.stop()
    }

    def cleanup() {
        csWireMockServer.resetAll()
        ctWireMockServer.resetAll()
    }

    def 'Successful synchronisation has been done for the missing auth reversal transaction as Success in commerce tools'() {
        given: 'A cybersource search mock returns a list of transactions'
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch(
                'Started', 'sync_required_successful_auth_reversal/cs_post_transaction_auth_reversal_response.json', 'search1'))
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch('search1', 'cs_empty_transactions_post_response.json'))

        and: 'Commerce tools returns payment with no transaction on it'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest(
                'GET', 'sync_required_successful_auth_reversal/ct_get_payment_response.json', ctProjectKey))

        and: 'We are expecting a POST to CT adding a transaction to the payment'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest(
                'POST', 'sync_required_successful_auth_reversal/ct_post_response.json', ctProjectKey))

        when: 'Synchronization call happens'
        CsTransactionSearch transactionSearch = new CsTransactionSearchImpl('submitTimeUtc:[NOW/DAY TO NOW/DAY+1DAY}', 'submitTimeUtc:desc', 50)
        runner.synchronize(transactionSearch)

        then: 'The payment will be searched for'
        def getRequests = ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.GET, anyUrl()).build()).requests
        getRequests.size() == 1
        getRequests.every { it.url == "/${ctProjectKey}/payments/0452380c-b51c-4e91-8bf2-41a97d9b05f3" }

        and: 'A POST request is made to the CT payment'
        def postRequests = ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.POST, anyUrl()).build()).requests
        postRequests.size() == 1
        getRequests.every { it.url == "/${ctProjectKey}/payments/0452380c-b51c-4e91-8bf2-41a97d9b05f3" }

        and: 'A successful cancel authorization transaction is added to the payment in commerce tools'
        validateActions(postRequests[0].bodyAsString, '5740866141356992804012', 'CancelAuthorization', 'Success')
    }

    def 'No synchronization is required for a auth reversal transaction on a payment'() {
        given: 'A cybersource search mock returns a list of transactions'
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch(
                'Started', 'no_sync_required/cs_post_transaction_auth_reversal_response.json', 'search1'))
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch('search1', 'cs_empty_transactions_post_response.json'))

        and: 'Commerce tools returns payment with a successful auth transaction'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest('GET', 'no_sync_required/ct_get_payment_success_cancel_auth.json', ctProjectKey))

        when: 'Synchronization call happens'
        CsTransactionSearch transactionSearch = new CsTransactionSearchImpl('submitTimeUtc:[NOW/DAY TO NOW/DAY+1DAY}', 'submitTimeUtc:desc', 50)
        runner.synchronize(transactionSearch)

        then: 'Nothing to update in commerce tools'
        ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.GET, anyUrl()).build()).requests.size() == 1
        ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.POST, anyUrl()).build()).requests.size() == 0

        and: 'there was no unmatched requests'
        verifyNoUnmatchedRequests()
    }

    def 'Successful synchronisation has been done for the missing transaction with auth reversal as Failure in commerce tools'() {
        given: 'Commerce tools returns payment with no transaction on it'
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch(
                'Started', 'sync_required_failure_auth_reversal/cs_transaction_search_post_response.json', 'search1'))
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch('search1', 'cs_empty_transactions_post_response.json'))

        and: 'Commerce tools returns payment with no transaction on it'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest(
                'GET', 'sync_required_failure_auth_reversal/ct_get_payment_response.json', ctProjectKey))

        and: 'We are expecting to update the payment'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest(
                'POST', 'sync_required_failure_auth_reversal/ct_post_response.json', ctProjectKey))

        when: 'Synchronization call happens'
        CsTransactionSearch transactionSearch = new CsTransactionSearchImpl('submitTimeUtc:[NOW/DAY TO NOW/DAY+1DAY}', 'submitTimeUtc:desc', 50)
        runner.synchronize(transactionSearch)

        then: 'The payment will be searched for'
        def getRequests = ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.GET, anyUrl()).build()).requests
        getRequests.size() == 1
        getRequests.every { it.url == "/${ctProjectKey}/payments/0452380c-b51c-4e91-8bf2-41a97d9b05f3" }

        and: 'The transaction is added with auth as Failure for the payment in commerce tools'
        def postRequests = ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.POST, anyUrl()).build()).requests
        postRequests.size() == 1
        postRequests.every { it.url == "/${ctProjectKey}/payments/0452380c-b51c-4e91-8bf2-41a97d9b05f3" }

        and: 'The update action has the correct values'
        validateActions(postRequests[0].bodyAsString, '5707853176936824904012', 'CancelAuthorization', 'Failure')

        and: 'there was no unmatched requests'
        verifyNoUnmatchedRequests()
    }

    def 'Should add transaction if successful and failure auth reversal exists but has a different interaction ID'() {
        given: 'CS returns a successful auth transaction'
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch(
                'Started', 'multiple_auth_reversal_sync/cs_post_transaction_response.json', 'search1'))
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch('search1', 'cs_empty_transactions_post_response.json'))

        and: 'The transaction references a payment in CT that contains a successful auth reversal with a different interaction ID'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest(
                'GET', 'multiple_auth_reversal_sync/ct_get_payment_response.json', ctProjectKey))

        and: 'The payment will be updated with a new transaction'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest('POST', 'multiple_auth_reversal_sync/ct_post_response.json', ctProjectKey))

        when: 'We try to synchronize'
        CsTransactionSearch transactionSearch = new CsTransactionSearchImpl('submitTimeUtc:[NOW/DAY TO NOW/DAY+1DAY}', 'submitTimeUtc:desc', 50)
        runner.synchronize(transactionSearch)

        then: 'The process will search for CT payments'
        def getRequests = ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.GET, anyUrl()).build()).requests
        getRequests.size() == 2
        getRequests.every { it.url == "/${ctProjectKey}/payments/0452380c-b51c-4e91-8bf2-41a97d9b05f3" }

        and: 'The process will create a new transaction on the CT payment'
        def postRequests = ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.POST, anyUrl()).build()).requests
        postRequests.size() == 2
        postRequests.every { it.url == "/${ctProjectKey}/payments/0452380c-b51c-4e91-8bf2-41a97d9b05f3" }

        and: 'The action will have the correct values'
        def requestBodyFailureReversal = postRequests[0].bodyAsString
        def requestBodySuccessReversal = postRequests[1].bodyAsString

        Map bodyMap = new JsonSlurper().parseText(requestBodyFailureReversal)
        bodyMap.put('actions', new JsonSlurper().parseText(requestBodySuccessReversal))

        validateActions(requestBodyFailureReversal, '1', 'CancelAuthorization', 'Success')
        validateActions(requestBodySuccessReversal, '2', 'CancelAuthorization', 'Failure')

        and: 'there was no unmatched requests'
        verifyNoUnmatchedRequests()
    }
}
