package isv.commercetools.sync

import Invokers.ApiException
import com.github.tomakehurst.wiremock.client.WireMock
import com.github.tomakehurst.wiremock.http.RequestMethod
import com.github.tomakehurst.wiremock.matching.RequestPatternBuilder
import isv.commercetools.config.TestConfiguration
import isv.commercetools.sync.payment.config.ApplicationConfiguration
import isv.commercetools.sync.payment.config.PaymentServiceClientConfigurationProperties
import isv.commercetools.sync.payment.config.CtClientConfigurationProperties
import org.joda.time.DateTime
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles

@SpringBootTest(classes = [ApplicationConfiguration])
@EnableConfigurationProperties([CtClientConfigurationProperties, PaymentServiceClientConfigurationProperties, TestConfiguration])
@ActiveProfiles(['dev', 'integration-test'])
class DecisionManagerSyncSpecification extends BaseSpecification {

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

    def 'Successful synchronisation has been done for multiple conversions with auth as Pending in commerce tools'() {
        given:'A payment service conversion detail transaction search api returns a decisions'
        paymentServiceWireMockServer.addStubMapping(requestStubBuilder.buildStubForPaymentServiceDecisionSearch(
                'multiple_decisions_sync_required/ps_get_conversion_details.json', 200))

        and:'Commerce tools returns a payment with Pending auth on it'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForCTGetPayment(
                'multiple_decisions_sync_required/ct_get_payment1_response.json',
                ctProjectKey, '2fb99cc8-9645-4dd6-a12c-c7b3f33751b0'))
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForCTGetPayment(
                'multiple_decisions_sync_required/ct_get_payment2_response.json',
                ctProjectKey, '3fb99cc8-9645-4dd6-a12c-c7b3f33751b0'))
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForCTGetPayment(
                'multiple_decisions_sync_required/ct_get_payment3_response.json',
                ctProjectKey, '4fb99cc8-9645-4dd6-a12c-c7b3f33751b0'))

        when:'Synchronization call happens'
        decisionManagerDecisionSynchronizer.synchronizeTransactions(new DateTime('2019-11-28T00:00:00.0Z'), new DateTime('2019-11-29T00:00:00.000Z'))

        then:'The conversions will be retrieved'
        def getConversions = paymentServiceWireMockServer.findRequestsMatching(new RequestPatternBuilder(
                RequestMethod.GET, WireMock.urlPathMatching('.*reporting/v3/conversion-details.*')).build())
                .requests
        getConversions.size() == 1

        and:'The payment will be searched for'
        def getRequests = ctWireMockServer.findRequestsMatching(
                new RequestPatternBuilder(RequestMethod.GET, WireMock.urlPathMatching(".*${ctProjectKey}/payments.*")).build()).requests
        getRequests.size() == 3
        def sortedGetRequests = getRequests.toSorted { a, b -> a.bodyAsString <=> b.bodyAsString }
        sortedGetRequests.find { it.url == "/${ctProjectKey}/payments/2fb99cc8-9645-4dd6-a12c-c7b3f33751b0" }
        sortedGetRequests.find { it.url == "/${ctProjectKey}/payments/3fb99cc8-9645-4dd6-a12c-c7b3f33751b0" }
        sortedGetRequests.find { it.url == "/${ctProjectKey}/payments/4fb99cc8-9645-4dd6-a12c-c7b3f33751b0" }

        and:'The commerce tools payments will be updated'
        def postRequests = ctWireMockServer.findRequestsMatching(
                new RequestPatternBuilder(RequestMethod.POST, WireMock.urlPathMatching(".*${ctProjectKey}/payments.*")).build()).requests
        postRequests.size() == 3
        def sortedPostRequests = postRequests.toSorted { a, b -> a.bodyAsString <=> b.bodyAsString }

        validateUpdateActions(sortedPostRequests[0].bodyAsString, '38e2dc51-e650-409a-9ee5-1150934b3ff3', 'Failure')
        validateUpdateActions(sortedPostRequests[1].bodyAsString, '18e2dc51-e650-409a-9ee5-1150934b3ff3', 'Success')
        validateUpdateActions(sortedPostRequests[2].bodyAsString, '28e2dc51-e650-409a-9ee5-1150934b3ff3', 'Success')
    }

    def 'Synchronization is not performed for the empty conversion details'() {
        given:'A payment service conversion detail transaction search api returns an empty response'
        paymentServiceWireMockServer.addStubMapping(requestStubBuilder.buildStubForPaymentServiceDecisionSearch(
                'ps_empty_conversions_get_response.json', 200))

        when:'Synchronization call happens'
        decisionManagerDecisionSynchronizer.synchronizeTransactions(
                new DateTime('2019-11-29T00:00:00.0Z'), new DateTime('2019-11-30T00:00:00.0Z'))

        then:'The conversions will be retrieved'
        def getConversions = paymentServiceWireMockServer.findRequestsMatching(
                new RequestPatternBuilder(RequestMethod.GET, WireMock.urlPathMatching('.*reporting/v3/conversion-details.*')).build()).requests
        getConversions.size() == 1

        and:'No payment will be searched for'
        def getRequests = ctWireMockServer.findRequestsMatching(
                new RequestPatternBuilder(RequestMethod.GET, WireMock.urlPathMatching(".*${ctProjectKey}/payments.*")).build()).requests
        getRequests.size() == 0

        and:'CT payment will not be updated with any POST request'
        def postRequests = ctWireMockServer.findRequestsMatching(
                new RequestPatternBuilder(RequestMethod.POST, WireMock.urlPathMatching(".*${ctProjectKey}/payments.*")).build()).requests
        postRequests.size() == 0

        and:'there was no unmatched requests'
        verifyNoUnmatchedRequests()
    }

    def 'No synchronisation has been performed for the transaction with auth as successful in commerce tools'() {
        given:'A payment service conversion detail transaction search api returns a decisions'
        paymentServiceWireMockServer.addStubMapping(requestStubBuilder.buildStubForPaymentServiceDecisionSearch(
                'decision_sync_not_required_successful_auth/ps_get_conversion_details.json', 200))

        and:'Commerce tools returns a payment with success auth on it'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest(
                'GET', 'decision_sync_not_required_successful_auth/ct_get_payment_response.json', ctProjectKey))

        when:'Synchronization call happens'
        decisionManagerDecisionSynchronizer.synchronizeTransactions(
                new DateTime('2019-11-28T00:00:00.0Z'), new DateTime('2019-11-29T00:00:00.0Z'))

        then:'The conversions will be retrieved'
        def getConversions = paymentServiceWireMockServer.findRequestsMatching(
                new RequestPatternBuilder(RequestMethod.GET, WireMock.urlPathMatching('.*reporting/v3/conversion-details.*')).build()).requests
        getConversions.size() == 1

        and:'The payment will be searched for'
        def getRequests = ctWireMockServer.findRequestsMatching(
                new RequestPatternBuilder(RequestMethod.GET, WireMock.urlPathMatching(".*${ctProjectKey}/payments.*")).build()).requests
        getRequests.size() == 1
        getRequests.every { it.url == "/${ctProjectKey}/payments/2fb99cc8-9645-4dd6-a12c-c7b3f33751b0" }

        and:'CT payment will not be updated with POST request'
        def postRequests = ctWireMockServer.findRequestsMatching(
                new RequestPatternBuilder(RequestMethod.POST, WireMock.urlPathMatching(".*${ctProjectKey}/payments.*")).build()).requests
        postRequests.size() == 0

        and:'there was no unmatched requests'
        verifyNoUnmatchedRequests()
    }

    def 'Synchronization is not performed if the reporting api returns 404-NOT FOUND'() {
        given:'A payment service conversion detail transaction search api returns a response with 404 error code'
        paymentServiceWireMockServer.addStubMapping(
                requestStubBuilder.buildStubForPaymentServiceDecisionSearchFor_400_404_Response(404, $/application/json/$))

        when:'Synchronization call happens'
        decisionManagerDecisionSynchronizer.synchronizeTransactions(new DateTime('2019-12-11T10:22:37.783Z'), new DateTime('2019-12-11T10:22:37.814Z'))

        then:'The conversions will not be retrieved but a call to retrieve conversions will still be made'
        paymentServiceWireMockServer.verify(new RequestPatternBuilder(
                RequestMethod.GET, WireMock.urlPathMatching('.*reporting/v3/conversion-details.*')))

        and:'No GET request will be made to get a payment on CT'
        def getRequests = ctWireMockServer.findRequestsMatching(
                new RequestPatternBuilder(RequestMethod.GET, WireMock.urlPathMatching(".*${ctProjectKey}/payments.*")).build()).requests
        getRequests.size() == 0

        and:'No POST request will be made to update a payment on CT'
        def postRequests = ctWireMockServer.findRequestsMatching(
                new RequestPatternBuilder(RequestMethod.POST, WireMock.urlPathMatching(".*${ctProjectKey}/payments.*")).build()).requests
        postRequests.size() == 0

        and:'No ApiException has been thrown'
        notThrown(ApiException)
    }

    def 'No synchronisation has been performed for the transaction with auth as failure in commerce tools'() {
        given:'A payment service conversion detail transaction search api returns decisions'
        paymentServiceWireMockServer.addStubMapping(requestStubBuilder.buildStubForPaymentServiceDecisionSearch(
                'decision_sync_not_required_auth_failure/ps_get_conversion_details.json', 200))

        and:'Commerce tools returns a payment with Failure auth on it'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest(
                'GET', 'decision_sync_not_required_auth_failure/ct_get_payment_response.json', ctProjectKey))

        when:'Synchronization call happens'
        decisionManagerDecisionSynchronizer.synchronizeTransactions(
                new DateTime('2019-11-28T00:00:00.0Z'), new DateTime('2019-11-29T00:00:00.0Z'))

        then:'The conversions will be retrieved'
        def getConversions = paymentServiceWireMockServer.findRequestsMatching(
                new RequestPatternBuilder(RequestMethod.GET, WireMock.urlPathMatching('.*reporting/v3/conversion-details.*')).build()).requests
        getConversions.size() == 1

        and:'The payment will be searched for'
        def getRequests = ctWireMockServer.findRequestsMatching(
                new RequestPatternBuilder(RequestMethod.GET, WireMock.urlPathMatching(".*${ctProjectKey}/payments.*")).build()).requests
        getRequests.size() == 1
        getRequests.every { it.url == "/${ctProjectKey}/payments/2fb99cc8-9645-4dd6-a12c-c7b3f33751b0" }

        and:'CT payment will not be updated with POST request'
        def postRequests = ctWireMockServer.findRequestsMatching(
                new RequestPatternBuilder(RequestMethod.POST, WireMock.urlPathMatching(".*${ctProjectKey}/payments.*")).build()).requests
        postRequests.size() == 0

        and:'there was no unmatched requests'
        verifyNoUnmatchedRequests()
    }

    def 'No synchronisation has been performed if the payment not found in commerce tools'() {
        given:'A payment service conversion detail transaction search api returns decisions'
        paymentServiceWireMockServer.addStubMapping(requestStubBuilder.buildStubForPaymentServiceDecisionSearch(
                'decision_sync_not_required_ct_payment_not_found/ps_get_conversion_details.json', 200))

        and:'Commerce tools 404-Not found for the merchant reference'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubFor404CtRequest(ctProjectKey))

        when:'Synchronization call happens'
        decisionManagerDecisionSynchronizer.synchronizeTransactions(
                new DateTime('2019-11-28T00:00:00.0Z'), new DateTime('2019-11-29T00:00:00.0Z'))

        then:'The conversions will be retrieved'
        def getConversions = paymentServiceWireMockServer.findRequestsMatching(
                new RequestPatternBuilder(RequestMethod.GET, WireMock.urlPathMatching('.*reporting/v3/conversion-details.*')).build()).requests
        getConversions.size() == 1

        and:'The payment will be searched for'
        def getRequests = ctWireMockServer.findRequestsMatching(
                new RequestPatternBuilder(RequestMethod.GET, WireMock.urlPathMatching(".*${ctProjectKey}/payments.*")).build()).requests
        getRequests.size() == 1
        getRequests.every { it.url == "/${ctProjectKey}/payments/2fb99cc8-9645-4dd6-a12c-c7b3f33751b0" }

        and:'CT payment will not be updated with POST request'
        def postRequests = ctWireMockServer.findRequestsMatching(
                new RequestPatternBuilder(RequestMethod.POST, WireMock.urlPathMatching(".*${ctProjectKey}/payments.*")).build()).requests
        postRequests.size() == 0

        and:'there was no unmatched requests'
        verifyNoUnmatchedRequests()
    }

    def 'Synchronization is not performed if the reporting api returns 400-BAD REQUEST'() {
        given:'A payment service conversion detail transaction search api returns a response wih 400 error code'
        paymentServiceWireMockServer.addStubMapping(requestStubBuilder.buildStubForPaymentServiceDecisionSearchFor_400_404_Response(400, $/application/json/$))

        when:'Synchronization call happens'
        decisionManagerDecisionSynchronizer.synchronizeTransactions(new DateTime('2019-12-11T10:22:37.783Z'), new DateTime('2019-12-11T10:22:37.814Z'))

        then:'The conversions will not be retrieved but a call to retrieve conversions will still be made'
        paymentServiceWireMockServer.verify(new RequestPatternBuilder(RequestMethod.GET, WireMock.urlPathMatching('.*reporting/v3/conversion-details.*')))

        and:'CT payment will not be searched'
        def getRequests = ctWireMockServer.findRequestsMatching(
                new RequestPatternBuilder(RequestMethod.GET, WireMock.urlPathMatching(".*${ctProjectKey}/payments.*")).build()).requests
        getRequests.size() == 0

        and:'CT payment will not be updated'
        def postRequests = ctWireMockServer.findRequestsMatching(
                new RequestPatternBuilder(RequestMethod.POST, WireMock.urlPathMatching(".*${ctProjectKey}/payments.*")).build()).requests
        postRequests.size() == 0

        and:'No ApiException has been thrown'
        notThrown(ApiException)

        and:'there was no unmatched requests'
        verifyNoUnmatchedRequests()
    }

    def 'A successful synchronization is performed if reporting api returns conversions in PENDING state and ACCEPT decision'() {
        given:'A payment service conversion detail transaction search api returns empty conversions'
        paymentServiceWireMockServer.addStubMapping(requestStubBuilder.buildStubForPaymentServiceDecisionSearch(
                'decision_sync_required_single_decision/ps_get_conversion_details.json', 200))

        and:'A commerece tools payment is searched'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest(
                'GET', 'decision_sync_required_single_decision/ct_get_payment_response.json', ctProjectKey))

        when:'Synchronization call happens'
        decisionManagerDecisionSynchronizer.synchronizeTransactions(new DateTime('2019-11-28T00:00:00.0Z'), new DateTime('2019-11-29T00:00:00.0Z'))

        then:'The conversions will be retrieved'
        def getConversions = paymentServiceWireMockServer.findRequestsMatching(
                new RequestPatternBuilder(RequestMethod.GET, WireMock.urlPathMatching('.*reporting/v3/conversion-details.*')).build()).requests
        getConversions.size() == 1

        and:'CT payment will be searched'
        def getRequests = ctWireMockServer.findRequestsMatching(
                new RequestPatternBuilder(RequestMethod.GET, WireMock.urlPathMatching(".*${ctProjectKey}/payments.*")).build()).requests
        getRequests.size() == 1
        getRequests.every { it.url == "/${ctProjectKey}/payments/5fb99cc8-9645-4dd6-a12c-c7b3f33751b0" }

        and:'CT payment will be updated with POST request'
        def postRequests = ctWireMockServer.findRequestsMatching(
                new RequestPatternBuilder(RequestMethod.POST, WireMock.urlPathMatching(".*${ctProjectKey}/payments.*")).build()).requests
        postRequests.size() == 1
        postRequests.every { it.url == "/${ctProjectKey}/payments/5fb99cc8-9645-4dd6-a12c-c7b3f33751b0" }
        validateUpdateActions(postRequests[0].bodyAsString, '18e2dc51-e650-409a-9ee5-1150934b3ff3', 'Success')
    }

    def 'A successful synchronization is performed if reporting api returns conversions in PENDING state and REJECT decision'() {
        given:'A payment service conversion detail transaction search api returns empty conversions'
        paymentServiceWireMockServer.addStubMapping(requestStubBuilder.buildStubForPaymentServiceDecisionSearch(
                'decision_sync_required_auth_failure/ps_get_conversion_details.json', 200))

        and:'A commerece tools payment is searched'
        ctWireMockServer.addStubMapping(requestStubBuilder.buildStubForSuccessfulCtRequest(
                'GET', 'decision_sync_required_auth_failure/ct_get_payment_response.json', ctProjectKey))

        when:'Synchronization call happens'
        decisionManagerDecisionSynchronizer.synchronizeTransactions(new DateTime('2019-11-28T00:00:00.0Z'), new DateTime('2019-11-29T00:00:00.0Z'))

        then:'The conversions will be retrieved'
        def getConversions = paymentServiceWireMockServer.findRequestsMatching(
                new RequestPatternBuilder(RequestMethod.GET, WireMock.urlPathMatching('.*reporting/v3/conversion-details.*')).build()).requests
        getConversions.size() == 1

        and:'CT payment will be searched'
        def getRequests = ctWireMockServer.findRequestsMatching(
                new RequestPatternBuilder(RequestMethod.GET, WireMock.urlPathMatching(".*${ctProjectKey}/payments.*")).build()).requests
        getRequests.size() == 1
        getRequests.every { it.url == "/${ctProjectKey}/payments/5fb99cc8-9645-4dd6-a12c-c7b3f33751b0" }

        and:'CT payment will be updated with POST request'
        def postRequests = ctWireMockServer.findRequestsMatching(
                new RequestPatternBuilder(RequestMethod.POST, WireMock.urlPathMatching(".*${ctProjectKey}/payments.*")).build()).requests
        postRequests.size() == 1
        postRequests.every { it.url == "/${ctProjectKey}/payments/5fb99cc8-9645-4dd6-a12c-c7b3f33751b0" }
        validateUpdateActions(postRequests[0].bodyAsString, '18e2dc51-e650-409a-9ee5-1150934b3ff3', 'Failure')
    }
}

