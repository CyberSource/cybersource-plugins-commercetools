package com.cybersource.commercetools.sync

import com.cybersource.commercetools.config.TestConfiguration
import com.cybersource.commercetools.sync.cybersource.request.CsTransactionSearch
import com.cybersource.commercetools.sync.cybersource.request.CsTransactionSearchImpl
import com.cybersource.commercetools.sync.payment.config.ApplicationConfiguration
import com.cybersource.commercetools.sync.payment.config.CsClientConfigurationProperties
import com.cybersource.commercetools.sync.payment.config.CtClientConfigurationProperties
import com.github.tomakehurst.wiremock.http.RequestMethod
import com.github.tomakehurst.wiremock.matching.RequestPatternBuilder
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles

import static com.github.tomakehurst.wiremock.client.WireMock.anyUrl

@SpringBootTest(classes = [ApplicationConfiguration])
@EnableConfigurationProperties([CtClientConfigurationProperties, CsClientConfigurationProperties, TestConfiguration])
@ActiveProfiles(['dev', 'integration-test'])
class RefundTransactionSynchronizationSpecification extends BaseSpecification {

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

    def 'Successful synchronisation has been done for the missing credit transaction as Success in commerce tools'() {
        given: 'A cybersource search mock returns a list of transactions'
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch(
                'Started', 'sync_required_successful_credit/cs_post_transaction_response.json', 'search1'))
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch('search1', 'cs_empty_transactions_post_response.json'))

        and: 'Commerce tools returns payment with no transaction on it'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest(
                'GET', 'sync_required_successful_credit/ct_get_payment_response.json', ctProjectKey))

        and: 'We are expecting a POST to CT adding a transaction to the payment'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest(
                'POST', 'sync_required_successful_credit/ct_post_response.json', ctProjectKey))

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

        and: 'A successful refund transaction is added to the payment in commerce tools'
        validateActions(postRequests[0].bodyAsString, '5740866141356992804012', 'Refund', 'Success')
    }

    def 'No synchronization is required for a credit transaction on a payment'() {
        given: 'A cybersource search mock returns a list of transactions'
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch(
                'Started', 'no_sync_required/cs_post_transaction_credit_response.json', 'search1'))
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch('search1', 'cs_empty_transactions_post_response.json'))

        and: 'Commerce tools returns payment with a successful auth transaction'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest(
                'GET', 'no_sync_required/ct_get_payment_success_refund.json', ctProjectKey))

        when: 'Synchronization call happens'
        CsTransactionSearch transactionSearch = new CsTransactionSearchImpl('submitTimeUtc:[NOW/DAY TO NOW/DAY+1DAY}', 'submitTimeUtc:desc', 50)
        runner.synchronize(transactionSearch)

        then: 'Nothing to update in commerce tools'
        ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.GET, anyUrl()).build()).requests.size() == 1
        ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.POST, anyUrl()).build()).requests.size() == 0

        and: 'there was no unmatched requests'
        verifyNoUnmatchedRequests()
    }

    def 'Successful synchronisation has been done for the missing transaction with credit as Failure in commerce tools'() {
        given: 'Commerce tools returns payment with no transaction on it'
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch(
                'Started', 'sync_required_failure_credit/cs_transaction_search_post_response.json', 'search1'))
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch('search1', 'cs_empty_transactions_post_response.json'))

        and: 'Commerce tools returns payment with no transaction on it'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest(
                'GET', 'sync_required_failure_credit/ct_get_payment_response.json', ctProjectKey))

        and: 'We are expecting to update the payment'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest(
                'POST', 'sync_required_failure_credit/ct_post_response.json', ctProjectKey))

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
        validateActions(postRequests[0].bodyAsString, '5707853176936824904012', 'Refund', 'Failure')

        and: 'there was no unmatched requests'
        verifyNoUnmatchedRequests()
    }

    def 'Should add transaction if successful and failure credit exists but has a different interaction ID'() {
        given: 'CS returns a successful auth transaction'
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch(
                'Started', 'multiple_credit_sync/cs_post_transaction_response.json', 'search1'))
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch('search1', 'cs_empty_transactions_post_response.json'))

        and: 'The transaction references a payment in CT that contains a successful credit with a different interaction ID'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest(
                'GET', 'multiple_credit_sync/ct_get_payment_response.json', ctProjectKey))

        and: 'The payment will be updated with a new transaction'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest(
                'POST', 'multiple_credit_sync/ct_post_response.json', ctProjectKey))

        when: 'We try to synchronize'
        CsTransactionSearch transactionSearch = new CsTransactionSearchImpl('submitTimeUtc:[NOW/DAY TO NOW/DAY+1DAY}', 'submitTimeUtc:desc', 50)
        runner.synchronize(transactionSearch)

        then: 'The process will search for CT payments'
        def getRequests = ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.GET, anyUrl()).build()).requests
        getRequests.size() == 3
        getRequests.every { it.url == "/${ctProjectKey}/payments/0452380c-b51c-4e91-8bf2-41a97d9b05f3" }

        and: 'The process will create a new transaction on the CT payment'
        def postRequests = ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.POST, anyUrl()).build()).requests
        postRequests.size() == 3
        postRequests.every { it.url == "/${ctProjectKey}/payments/0452380c-b51c-4e91-8bf2-41a97d9b05f3" }

        and: 'The action will have the correct values'
        def requestBodyFailureReversal = postRequests[0].bodyAsString
        def requestBodySuccessReversal1 = postRequests[1].bodyAsString
        def requestBodySuccessReversal2 = postRequests[2].bodyAsString

        validateActions(requestBodyFailureReversal, '1', 'Refund', 'Failure')
        validateActions(requestBodySuccessReversal1, '2', 'Refund', 'Success')
        validateActions(requestBodySuccessReversal2, '3', 'Refund', 'Success')

        and: 'there was no unmatched requests'
        verifyNoUnmatchedRequests()
    }

}
