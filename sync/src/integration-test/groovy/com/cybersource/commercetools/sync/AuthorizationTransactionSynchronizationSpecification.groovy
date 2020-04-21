package com.cybersource.commercetools.sync

import com.cybersource.commercetools.config.TestConfiguration
import com.cybersource.commercetools.sync.cybersource.request.CsTransactionSearch
import com.cybersource.commercetools.sync.cybersource.request.CsTransactionSearchImpl
import com.cybersource.commercetools.sync.payment.config.ApplicationConfiguration
import com.cybersource.commercetools.sync.payment.config.CsClientConfigurationProperties
import com.cybersource.commercetools.sync.payment.config.CtClientConfigurationProperties
import com.github.tomakehurst.wiremock.http.RequestMethod
import com.github.tomakehurst.wiremock.matching.RequestPattern
import com.github.tomakehurst.wiremock.matching.RequestPatternBuilder
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import spock.lang.Unroll

import static com.github.tomakehurst.wiremock.client.WireMock.anyUrl

@SpringBootTest(classes = [ApplicationConfiguration])
@EnableConfigurationProperties([CtClientConfigurationProperties, CsClientConfigurationProperties, TestConfiguration])
@ActiveProfiles(['dev', 'integration-test'])
class AuthorizationTransactionSynchronizationSpecification extends BaseSpecification {

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

    def 'Successful synchronisation has been done for the missing transaction with auth as Success in commerce tools'() {
        given: 'A cybersource search mock returns a list of transactions'
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch('Started', 'sync_required_successful_auth/cs_post_transaction_response.json', 'search1'))
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch('search1', 'cs_empty_transactions_post_response.json'))

        and: 'Commerce tools returns payment with no transaction on it'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest(
                'GET', 'sync_required_successful_auth/ct_get_payment_response.json', ctProjectKey))

        and: 'We are expecting a POST to CT adding a transaction to the payment'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest('POST', 'sync_required_successful_auth/ct_post_response.json', ctProjectKey))

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

        and: 'A successful auth transaction is added to the payment in commerce tools'
        validateActions(postRequests[0].bodyAsString, '5707853176936824904012', 'Authorization', 'Success')
    }

    def 'No transactions to synchronize'() {
        given: 'A cybersource search mock returns an empty list of transactions'
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch('Started', 'cs_empty_transactions_post_response.json'))

        when: 'Synchronization call happens'
        CsTransactionSearch transactionSearch = new CsTransactionSearchImpl('submitTimeUtc:[NOW/DAY TO NOW/DAY+1DAY}', 'submitTimeUtc:desc', 50)
        runner.synchronize(transactionSearch)

        then: 'No calls to commerce tools has been made'
        ctWireMockServer.findRequestsMatching(RequestPattern.everything()).requests.size() == 0

        and: 'there was no unmatched requests'
        verifyNoUnmatchedRequests()
    }

    def 'No synchronization is required for a auth transaction on the payment'() {
        given: 'A cybersource search mock returns a list of transactions'
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch('Started', 'no_sync_required/cs_post_transaction_response.json', 'search1'))
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch('search1', 'cs_empty_transactions_post_response.json'))

        and: 'Commerce tools returns payment with a successful auth transaction'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest('GET', 'no_sync_required/ct_get_payment_success_auth.json', ctProjectKey))

        when: 'Synchronization call happens'
        CsTransactionSearch transactionSearch = new CsTransactionSearchImpl('submitTimeUtc:[NOW/DAY TO NOW/DAY+1DAY}', 'submitTimeUtc:desc', 50)
        runner.synchronize(transactionSearch)

        then: 'Nothing to update in commerce tools'
        ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.GET, anyUrl()).build()).requests.size() == 1
        ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.POST, anyUrl()).build()).requests.size() == 0

        and: 'there was no unmatched requests'
        verifyNoUnmatchedRequests()
    }

    def 'Synchronization is not possible as the payment does not exists in the commerce tools'() {
        given: 'A cybersource search returns a list of transactions'
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch('Started', 'no_ct_payment_for_cs_transaction/cs_post_transaction_response.json', 'search1'))
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch('search1', 'cs_empty_transactions_post_response.json'))

        and: 'Commerce tools returns a 404 for the payment ID'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubFor404CtRequest(ctProjectKey))

        when: 'Synchronization call happens'
        CsTransactionSearch transactionSearch = new CsTransactionSearchImpl('submitTimeUtc:[NOW/DAY TO NOW/DAY+1DAY}', 'submitTimeUtc:desc', 50)
        runner.synchronize(transactionSearch)

        then: 'No action was done for the transaction that was missing a payment'
        ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.GET, anyUrl()).build()).requests.size() == 1
        ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.POST, anyUrl()).build()).requests.size() == 0

        and: 'there was no unmatched requests'
        verifyNoUnmatchedRequests()
    }

    def 'Successful synchronisation has been done for the missing transaction with auth as Failure in commerce tools'() {
        given: 'Commerce tools returns payment with no transaction on it'
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch('Started', 'sync_required_failure_auth/cs_transaction_search_post_response.json', 'search1'))
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch('search1', 'cs_empty_transactions_post_response.json'))

        and: 'Commerce tools returns payment with no transaction on it'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest('GET', 'sync_required_failure_auth/ct_get_payment_response.json', ctProjectKey))

        and: 'We are expecting to update the payment'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest('POST', 'sync_required_failure_auth/ct_post_response.json', ctProjectKey))

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
        validateActions(postRequests[0].bodyAsString, '5707853176936824904012', 'Authorization', 'Failure')

        and: 'there was no unmatched requests'
        verifyNoUnmatchedRequests()
    }

    def 'Should add transaction if successful auth exists but has a different interaction ID'() {
        given: 'CS returns a successful auth transaction'
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch('Started', 'multiple_auth_sync/cs_post_transaction_response.json', 'search1'))
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch('search1', 'cs_empty_transactions_post_response.json'))

        and: 'The transaction references a payment in CT that contains a successful auth with a different interaction ID'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest('GET', 'multiple_auth_sync/ct_get_payment_response.json', ctProjectKey))

        and: 'The payment will be updated with a new transaction'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest('POST', 'multiple_auth_sync/ct_post_response.json', ctProjectKey))

        when: 'We try to synchronize'
        CsTransactionSearch transactionSearch = new CsTransactionSearchImpl('submitTimeUtc:[NOW/DAY TO NOW/DAY+1DAY}', 'submitTimeUtc:desc', 50)
        runner.synchronize(transactionSearch)

        then: 'The process will search for CT payments'
        def getRequests = ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.GET, anyUrl()).build()).requests
        getRequests.size() == 2
        getRequests.every { it.url == "/${ctProjectKey}/payments/0452380c-b51c-4e91-8bf2-41a97d9b05f3" }

        and: 'The process will create a new transaction on the CT payment'
        def postRequests = ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.POST, anyUrl()).build()).requests
        postRequests.size() == 1
        postRequests.every { it.url == "/${ctProjectKey}/payments/0452380c-b51c-4e91-8bf2-41a97d9b05f3" }

        and: 'The action will have the correct values'
        validateActions(postRequests[0].bodyAsString, '2', 'Authorization', 'Success')

        and: 'there was no unmatched requests'
        verifyNoUnmatchedRequests()
    }

    def 'Should not do anything for non-auth transactions'() {
        given: 'CS Returns non-auth transactions'
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch('Started', 'non_auth_transaction/cs_post_transaction_response.json', 'search1'))
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch('search1', 'cs_empty_transactions_post_response.json'))

        and: 'CT will return a payment'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest('GET', 'non_auth_transaction/ct_get_payment_response.json', ctProjectKey))

        when: 'We synchronize'
        CsTransactionSearch transactionSearch = new CsTransactionSearchImpl('submitTimeUtc:[NOW/DAY TO NOW/DAY+1DAY}', 'submitTimeUtc:desc', 50)
        runner.synchronize(transactionSearch)

        then: 'CT does not make a GET call'
        def getRequests = ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.GET, anyUrl()).build()).requests
        getRequests.size() == 0

        and: 'there should be no update actions'
        def postRequests = ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.POST, anyUrl()).build()).requests
        postRequests.size() == 0
    }

    def 'Should not do anything for transactions with no applications'() {
        given: 'CS Returns non-auth transactions'
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch('Started', 'no_applications/cs_post_transaction_response.json', 'search1'))
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch('search1', 'cs_empty_transactions_post_response.json'))

        and: 'CT will return a payment'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest('GET', 'no_applications/ct_get_payment_response.json', ctProjectKey))

        when: 'We synchronize'
        CsTransactionSearch transactionSearch = new CsTransactionSearchImpl('submitTimeUtc:[NOW/DAY TO NOW/DAY+1DAY}', 'submitTimeUtc:desc', 50)
        runner.synchronize(transactionSearch)

        then: 'CT does not make a GET call'
        def getRequests = ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.GET, anyUrl()).build()).requests
        getRequests.size() == 0

        and: 'there should be no update actions'
        def postRequests = ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.POST, anyUrl()).build()).requests
        postRequests.size() == 0
    }

    def 'Synchronisation still should happen even if the billing and shipping information on the order information on the CS transaction is empty'() {
        given: 'A cybersource search mock returns a list of transactions with no billing and shipping info on the order information'
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch(
                'Started', 'sync_required_empty_billing_shipping_info/cs_post_transaction_response.json', 'search1'))
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch('search1', 'cs_empty_transactions_post_response.json'))

        and: 'Commerce tools returns payment with no transaction on it'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest(
                'GET', 'sync_required_empty_billing_shipping_info/ct_get_payment_response.json', ctProjectKey))

        and: 'We are expecting a POST to CT adding a transaction to the payment'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest(
                'POST', 'sync_required_empty_billing_shipping_info/ct_post_response.json', ctProjectKey))

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

        and: 'A successful auth transaction is added to the payment in commerce tools'
        validateActions(postRequests[0].bodyAsString, '5707853176936824904012', 'Authorization', 'Success')
    }

    @Unroll
    def 'Successful synchronisation has been done for the missing transaction with auth as Success and a decision manager review in commerce tools'() {
        given: 'A cybersource search mock returns a list of transactions'
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch('Started', "${folder}/cs_post_transaction_response.json", 'search1'))
        csWireMockServer.addStubMapping(requestStubBuilder.buildStubForCsSearch('search1', 'cs_empty_transactions_post_response.json'))

        and: 'Commerce tools returns payment with no transaction on it'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest(
                'GET', 'sync_required_successful_auth/ct_get_payment_response.json', ctProjectKey))

        and: 'We are expecting a POST to CT adding a transaction to the payment'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest('POST', "${folder}/ct_post_response.json", ctProjectKey))

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

        and: 'A successful auth transaction is added to the payment in commerce tools'
        validateActions(postRequests[0].bodyAsString, '5707853176936824904012', 'Authorization', expectedTransactionState)

        where:
        folder                          | expectedTransactionState
        'sync_required_dm_success_auth' | 'Success'
        'sync_required_dm_failed_auth'  | 'Failure'
        'sync_required_dm_reject_auth'  | 'Failure'
        'sync_required_dm_review_auth'  | 'Pending'
    }
}
