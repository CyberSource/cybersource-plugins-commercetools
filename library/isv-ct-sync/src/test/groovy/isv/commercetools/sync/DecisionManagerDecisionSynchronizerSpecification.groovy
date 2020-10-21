package isv.commercetools.sync

import Model.ReportingV3ConversionDetailsGet200Response
import Model.ReportingV3ConversionDetailsGet200ResponseConversionDetails
import io.sphere.sdk.client.SphereClient
import io.sphere.sdk.commands.UpdateAction
import io.sphere.sdk.payments.Payment
import io.sphere.sdk.payments.Transaction
import io.sphere.sdk.payments.TransactionState
import io.sphere.sdk.payments.TransactionType
import io.sphere.sdk.payments.commands.updateactions.ChangeTransactionState
import isv.commercetools.sync.commercetools.CtPaymentSearchService
import isv.commercetools.sync.isv.IsvTransactionSearchService
import org.joda.time.DateTime
import spock.lang.Specification

import java.util.concurrent.CompletableFuture
import java.util.concurrent.CompletionStage

class DecisionManagerDecisionSynchronizerSpecification extends Specification {

    def isvTransactionSearchServiceMock = Mock(IsvTransactionSearchService)
    def ctClientMock = Mock(SphereClient)
    def ctPaymentSearchServiceMock = Mock(CtPaymentSearchService)
    def paymentMock = Mock(Payment)
    def reportingV3ConversionDetailsGet200Response = Mock(ReportingV3ConversionDetailsGet200Response)
    def conversionDetailsMock = Mock(ReportingV3ConversionDetailsGet200ResponseConversionDetails)
    def transactionMock = Mock(Transaction)
    def merchantId = 'someOrgId'

    DecisionManagerDecisionSynchronizer testObj

    def setup() {
        reportingV3ConversionDetailsGet200Response.conversionDetails >> [conversionDetailsMock]
        paymentMock.transactions >> [transactionMock]
        testObj = new DecisionManagerDecisionSynchronizer(isvTransactionSearchServiceMock, ctClientMock, ctPaymentSearchServiceMock, 'someOrgId')
    }

    def cleanup() {
        paymentMock = null
        reportingV3ConversionDetailsGet200Response = null
        conversionDetailsMock = null
    }

    def 'synchronize conversions with new decision as ACCEPT on the commerce tools payment with pending auth transaction'() {
        given: 'a reporting conversion response'
        conversionDetailsMock.merchantReferenceNumber >> 'somePaymentId'
        conversionDetailsMock.newDecision >> 'ACCEPT'

        and: 'a commerce tools payment'
        transactionMock.type >> TransactionType.AUTHORIZATION
        transactionMock.state >> TransactionState.PENDING
        transactionMock.id >> 'someTransactionId'

        and: 'completable future mock'
        def completionStageMock = Mock(CompletionStage)
        def completableFutureMock = Mock(CompletableFuture)
        completionStageMock.toCompletableFuture() >> completableFutureMock
        completableFutureMock.get() >> paymentMock

        when: 'run synchronization feature'
        testObj.synchronizeTransactions(DateTime.now(), DateTime.now().plusDays(1))

        then: 'the payment state on the transaction to be updated'
        1 * ctPaymentSearchServiceMock.findPaymentByPaymentId('somePaymentId') >> Optional.of(paymentMock)
        1 * isvTransactionSearchServiceMock.conversionDetailsGet200Response(_ as DateTime, _ as DateTime, merchantId) >> reportingV3ConversionDetailsGet200Response
        1 * ctClientMock.execute(_) >> { arguments ->
            Payment argumentPayment = arguments.get(0).versioned
            assert argumentPayment instanceof Payment
            assert argumentPayment.transactions.get(0).type == TransactionType.AUTHORIZATION
            assert argumentPayment.transactions.get(0).state == TransactionState.PENDING

            UpdateAction argumentUpdateAction = arguments.get(0).updateActions.get(0)
            assert argumentUpdateAction instanceof ChangeTransactionState
            assert argumentUpdateAction.state == TransactionState.SUCCESS
            assert argumentUpdateAction.transactionId == 'someTransactionId'
            completionStageMock
        }
    }

    def 'synchronize conversions with new decision as REJECT on the commerce tools payment with pending auth transaction'() {
        given: 'a reporting conversion response'
        conversionDetailsMock.merchantReferenceNumber >> 'somePaymentId'
        conversionDetailsMock.newDecision >> 'REJECT'

        and: 'a commerce tools payment'
        transactionMock.type >> TransactionType.AUTHORIZATION
        transactionMock.state >> TransactionState.PENDING
        transactionMock.id >> 'someTransactionId'

        and: 'completable future mock'
        def completionStageMock = Mock(CompletionStage)
        def completableFutureMock = Mock(CompletableFuture)
        completionStageMock.toCompletableFuture() >> completableFutureMock
        completableFutureMock.get() >> paymentMock

        when: 'run synchronization feature'
        testObj.synchronizeTransactions(DateTime.now(), DateTime.now().plusDays(1))

        then: 'the payment state on the transaction to be updated'
        1 * ctPaymentSearchServiceMock.findPaymentByPaymentId('somePaymentId') >> Optional.of(paymentMock)
        1 * isvTransactionSearchServiceMock.conversionDetailsGet200Response(_ as DateTime, _ as DateTime, merchantId) >> reportingV3ConversionDetailsGet200Response
        1 * ctClientMock.execute(_) >> { arguments ->
            Payment argumentPayment = arguments.get(0).versioned
            assert argumentPayment instanceof Payment
            assert argumentPayment.transactions.get(0).type == TransactionType.AUTHORIZATION
            assert argumentPayment.transactions.get(0).state == TransactionState.PENDING

            UpdateAction argumentUpdateAction = arguments.get(0).updateActions.get(0)
            assert argumentUpdateAction instanceof ChangeTransactionState
            assert argumentUpdateAction.state == TransactionState.FAILURE
            assert argumentUpdateAction.transactionId == 'someTransactionId'
            completionStageMock
        }
    }

    def 'does not  synchronize conversions for the success auth transaction'() {
        given: 'a commerce tools payment'
        transactionMock.type >> TransactionType.AUTHORIZATION
        transactionMock.state >> TransactionState.SUCCESS
        transactionMock.id >> 'someTransactionId'

        and: 'a reporting conversion response'
        conversionDetailsMock.merchantReferenceNumber >> 'somePaymentId'
        conversionDetailsMock.newDecision >> 'ACCEPT'

        when: 'run synchronization feature'
        testObj.synchronizeTransactions(DateTime.now(), DateTime.now().plusDays(1))

        then: 'the payment state on the transaction to be updated'
        1 * ctPaymentSearchServiceMock.findPaymentByPaymentId('somePaymentId') >> Optional.empty()
        1 * isvTransactionSearchServiceMock.conversionDetailsGet200Response(_ as DateTime, _ as DateTime, merchantId) >> reportingV3ConversionDetailsGet200Response
        0 * ctClientMock.execute(_)
    }

    def 'does not synchronize conversions for the failure auth transaction'() {
        given: 'a commerce tools payment'
        transactionMock.type >> TransactionType.AUTHORIZATION
        transactionMock.state >> TransactionState.FAILURE
        transactionMock.id >> 'someTransactionId'

        and: 'a reporting conversion response'
        conversionDetailsMock.merchantReferenceNumber >> 'somePaymentId'
        conversionDetailsMock.newDecision >> 'REJECT'

        when: 'run synchronization feature'
        testObj.synchronizeTransactions(DateTime.now(), DateTime.now().plusDays(1))

        then: 'the payment state on the transaction to be updated'
        1 * ctPaymentSearchServiceMock.findPaymentByPaymentId('somePaymentId') >> Optional.of(paymentMock)
        1 * isvTransactionSearchServiceMock.conversionDetailsGet200Response(_ as DateTime, _ as DateTime, merchantId) >> reportingV3ConversionDetailsGet200Response
        0 * ctClientMock.execute(_)
    }

    def 'should not synchronize conversions for the conversions which are still being reviewed'() {
        given: 'a commerce tools payment'
        transactionMock.type >> TransactionType.AUTHORIZATION
        transactionMock.state >> TransactionState.PENDING
        transactionMock.id >> 'someTransactionId'

        and: 'a reporting conversion response'
        conversionDetailsMock.merchantReferenceNumber >> 'somePaymentId'
        conversionDetailsMock.newDecision >> 'REVIEW'

        when: 'run synchronization feature'
        testObj.synchronizeTransactions(DateTime.now(), DateTime.now().plusDays(1))

        then: 'the payment state on the transaction to be updated'
        1 * ctPaymentSearchServiceMock.findPaymentByPaymentId('somePaymentId') >> Optional.of(paymentMock)
        1 * isvTransactionSearchServiceMock.conversionDetailsGet200Response(_ as DateTime, _ as DateTime, merchantId) >> reportingV3ConversionDetailsGet200Response
        0 * ctClientMock.execute(_)
    }

    def 'Should handle the validation errors from payment service'() {
        given: 'a start date'
        def startDate = DateTime.now()

        and: 'an end date'
        def endDate = DateTime.now().plusDays(30)

        when: 'run synchronization feature'
        testObj.synchronizeTransactions(startDate, endDate)

        then:
        1 * isvTransactionSearchServiceMock.conversionDetailsGet200Response(_, _, _) >> null
        0 * ctPaymentSearchServiceMock.findPaymentByPaymentId('somePaymentId') >> Optional.of(paymentMock)
        0 * ctClientMock.execute(_)
    }
}

