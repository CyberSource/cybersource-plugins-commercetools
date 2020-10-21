package isv.commercetools.sync

import com.github.tomakehurst.wiremock.http.RequestMethod
import com.github.tomakehurst.wiremock.matching.RequestPatternBuilder
import isv.commercetools.config.TestConfiguration
import isv.commercetools.sync.isv.request.IsvTransactionSearch
import isv.commercetools.sync.isv.request.IsvTransactionSearchImpl
import isv.commercetools.sync.payment.config.ApplicationConfiguration
import isv.commercetools.sync.payment.config.PaymentServiceClientConfigurationProperties
import isv.commercetools.sync.payment.config.CtClientConfigurationProperties
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles

import static com.github.tomakehurst.wiremock.client.WireMock.anyUrl

@SpringBootTest(classes = [ApplicationConfiguration])
@EnableConfigurationProperties([CtClientConfigurationProperties, PaymentServiceClientConfigurationProperties, TestConfiguration])
@ActiveProfiles(['dev', 'integration-test'])
class CaptureTransactionSynchronisationSpecification extends BaseSpecification {

    @Value('${commercetools.projectKey}')
    String ctProjectKey

    def setupSpec() {
        paymentServiceWireMockServer.start()
        ctWireMockServer.start()
    }

    def cleanupSpec() {
        paymentServiceWireMockServer.stop()
        ctWireMockServer.stop()
    }

    def cleanup() {
        paymentServiceWireMockServer.resetAll()
        ctWireMockServer.resetAll()
    }

    def 'Successful synchronisation has been done for the missing capture transaction as Success in commerce tools'() {
        given: 'A payment service search mock returns a list of transactions'
        paymentServiceWireMockServer.addStubMapping(requestStubBuilder.buildStubForPaymentServiceSearch(
                'Started', 'sync_required_successful_charge/ps_post_transaction_capture_response.json', 'search1'))
        paymentServiceWireMockServer.addStubMapping(requestStubBuilder.buildStubForPaymentServiceSearch('search1', 'ps_empty_transactions_post_response.json'))

        and: 'Commerce tools returns payment with no transaction on it'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest(
                'GET', 'sync_required_successful_charge/ct_get_payment_response.json', ctProjectKey))

        and: 'We are expecting a POST to CT adding a transaction to the payment'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest('POST', 'sync_required_successful_charge/ct_post_response.json', ctProjectKey))

        when: 'Synchronization call happens'
        IsvTransactionSearch transactionSearch = new IsvTransactionSearchImpl('submitTimeUtc:[NOW/DAY TO NOW/DAY+1DAY}', 'submitTimeUtc:desc', 50)
        runner.synchronize(transactionSearch)

        then: 'The payment will be searched for'
        def getRequests = ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.GET, anyUrl()).build()).requests
        getRequests.size() == 1
        getRequests.every { it.url == "/${ctProjectKey}/payments/0452380c-b51c-4e91-8bf2-41a97d9b05f3" }

        and: 'A POST request is made to the CT payment'
        def postRequests = ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.POST, anyUrl()).build()).requests
        postRequests.size() == 1
        getRequests.every { it.url == "/${ctProjectKey}/payments/0452380c-b51c-4e91-8bf2-41a97d9b05f3" }

        and: 'A successful charge transaction is added to the payment in commerce tools'
        validateActions(postRequests[0].bodyAsString, '5740866141356992804012', 'Charge', 'Success')
    }

    def 'No synchronization is required for a capture transaction on a payment'() {
        given: 'A payment service search mock returns a list of transactions'
        paymentServiceWireMockServer.addStubMapping(
                requestStubBuilder.buildStubForPaymentServiceSearch('Started', 'no_sync_required/ps_post_transaction_capture_response.json', 'search1')
        )
        paymentServiceWireMockServer.addStubMapping(requestStubBuilder.buildStubForPaymentServiceSearch('search1', 'ps_empty_transactions_post_response.json'))

        and: 'Commerce tools returns payment with a successful charge transaction'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest('GET', 'no_sync_required/ct_get_payment_success_charge.json', ctProjectKey))

        when: 'Synchronization call happens'
        IsvTransactionSearch transactionSearch = new IsvTransactionSearchImpl('submitTimeUtc:[NOW/DAY TO NOW/DAY+1DAY}', 'submitTimeUtc:desc', 50)
        runner.synchronize(transactionSearch)

        then: 'Nothing to update in commerce tools'
        ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.GET, anyUrl()).build()).requests.size() == 1
        ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.POST, anyUrl()).build()).requests.size() == 0

        and: 'there was no unmatched requests'
        verifyNoUnmatchedRequests()
    }

    def 'Successful synchronisation has been done for the missing transaction with charge as Failure in commerce tools'() {
        given: 'Commerce tools returns payment with no transaction on it'
        paymentServiceWireMockServer.addStubMapping(requestStubBuilder.buildStubForPaymentServiceSearch(
                'Started', 'sync_required_failure_charge/ps_transaction_search_post_response.json', 'search1'))
        paymentServiceWireMockServer.addStubMapping(requestStubBuilder.buildStubForPaymentServiceSearch('search1', 'ps_empty_transactions_post_response.json'))

        and: 'Commerce tools returns payment with no transaction on it'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest('GET', 'sync_required_failure_charge/ct_get_payment_response.json', ctProjectKey))

        and: 'We are expecting to update the payment'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest('POST', 'sync_required_failure_charge/ct_post_response.json', ctProjectKey))

        when: 'Synchronization call happens'
        IsvTransactionSearch transactionSearch = new IsvTransactionSearchImpl('submitTimeUtc:[NOW/DAY TO NOW/DAY+1DAY}', 'submitTimeUtc:desc', 50)
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
        validateActions(postRequests[0].bodyAsString, '5707853176936824904012', 'Charge', 'Failure')

        and: 'there was no unmatched requests'
        verifyNoUnmatchedRequests()
    }

    def 'Should add transaction if successful and failure charge exists but has a different interaction ID'() {
        given: 'payment service returns a successful auth transaction'
        paymentServiceWireMockServer.addStubMapping(
                requestStubBuilder.buildStubForPaymentServiceSearch('Started', 'multiple_charge_sync/ps_post_transaction_response.json', 'search1')
        )
        paymentServiceWireMockServer.addStubMapping(requestStubBuilder.buildStubForPaymentServiceSearch('search1', 'ps_empty_transactions_post_response.json'))

        and: 'The transaction references a payment in CT that contains a successful charge with a different interaction ID'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest('GET', 'multiple_charge_sync/ct_get_payment_response.json', ctProjectKey))

        and: 'The payment will be updated with a new transaction'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest('POST', 'multiple_charge_sync/ct_post_response.json', ctProjectKey))

        when: 'We try to synchronize'
        IsvTransactionSearch transactionSearch = new IsvTransactionSearchImpl('submitTimeUtc:[NOW/DAY TO NOW/DAY+1DAY}', 'submitTimeUtc:desc', 50)
        runner.synchronize(transactionSearch)

        then: 'The process will search for CT payments'
        def getRequests = ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.GET, anyUrl()).build()).requests
        getRequests.size() == 3
        getRequests.every { it.url == "/${ctProjectKey}/payments/0452380c-b51c-4e91-8bf2-41a97d9b05f3" }

        and: 'The process will create a new transaction on the CT payment'
        def postRequests = ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.POST, anyUrl()).build()).requests
        postRequests.size() == 2
        postRequests.every { it.url == "/${ctProjectKey}/payments/0452380c-b51c-4e91-8bf2-41a97d9b05f3" }

        and: 'The action will have the correct values'
        validateActions(postRequests[0].bodyAsString, '2', 'Charge', 'Failure')
        validateActions(postRequests[1].bodyAsString, '3', 'Charge', 'Success')

        and: 'there was no unmatched requests'
        verifyNoUnmatchedRequests()
    }

    def 'Should add transaction if successful and failure auth exists but has a different interaction ID'() {
        given: 'payment service returns a successful auth transaction'
        paymentServiceWireMockServer.addStubMapping(
                requestStubBuilder.buildStubForPaymentServiceSearch('Started', 'multiple_auth_charge_sync/ps_post_transaction_response.json', 'search1')
        )
        paymentServiceWireMockServer.addStubMapping(requestStubBuilder.buildStubForPaymentServiceSearch('search1', 'ps_empty_transactions_post_response.json'))

        and: 'The transaction references a payment in CT that contains a successful and failure auth as well as charge transactions with a different interaction ID'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest('GET', 'multiple_auth_charge_sync/ct_get_payment_response.json', ctProjectKey))

        and: 'The payment will be updated with a new transaction'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest('POST', 'multiple_auth_charge_sync/ct_post_response.json', ctProjectKey))

        when: 'We try to synchronize'
        IsvTransactionSearch transactionSearch = new IsvTransactionSearchImpl('submitTimeUtc:[NOW/DAY TO NOW/DAY+1DAY}', 'submitTimeUtc:desc', 50)
        runner.synchronize(transactionSearch)

        then: 'The process will search for CT payments'
        def getRequests = ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.GET, anyUrl()).build()).requests
        getRequests.size() == 4
        getRequests.every { it.url == "/${ctProjectKey}/payments/0452380c-b51c-4e91-8bf2-41a97d9b05f3" }

        and: 'The process will create a new transaction on the CT payment'
        def postRequests = ctWireMockServer.findRequestsMatching(new RequestPatternBuilder(RequestMethod.POST, anyUrl()).build()).requests
        postRequests.size() == 3
        postRequests.every { it.url == "/${ctProjectKey}/payments/0452380c-b51c-4e91-8bf2-41a97d9b05f3" }

        and: 'The action will have the correct values'
        validateActions(postRequests[0].bodyAsString, '2', 'Charge', 'Failure')
        validateActions(postRequests[1].bodyAsString, '3', 'Charge', 'Success')
        validateActions(postRequests[2].bodyAsString, '4', 'Authorization', 'Failure')

        and: 'there was no unmatched requests'
        verifyNoUnmatchedRequests()
    }
}
