package isv.commercetools.sync

import Model.TssV2TransactionsGet200ResponseApplicationInformationApplications
import Model.TssV2TransactionsPost201ResponseEmbeddedClientReferenceInformation
import Model.TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries
import io.sphere.sdk.payments.Payment
import io.sphere.sdk.payments.Transaction
import isv.commercetools.sync.commercetools.CtPaymentSearchService
import isv.commercetools.sync.commercetools.CtTransactionService
import spock.lang.Specification

class TransactionSynchronizerSpecification extends Specification {

    def isvTransMockWithCtRefSaved = Mock(TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries)
    def isvTransMockWithCtRefNotSaved = Mock(TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries)
    def isvTransMockNoCtRef = Mock(TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries)

    def ctPaymentMock = Mock(Payment)
    def ctTransactionWithRef1InteractionMock = Mock(Transaction)

    def ctPaymentSearchServiceMock = Mock(CtPaymentSearchService)
    def ctAddTransactionServiceMock = Mock(CtTransactionService)

    def isvApplicationMock = Mock(TssV2TransactionsGet200ResponseApplicationInformationApplications)

    def setup() {
        ctTransactionWithRef1InteractionMock.interactionId >> 'ref1'

        isvTransMockWithCtRefSaved.id >> 'ref1'
        isvTransMockWithCtRefSaved.clientReferenceInformation >> Mock(TssV2TransactionsPost201ResponseEmbeddedClientReferenceInformation)
        isvTransMockWithCtRefSaved.clientReferenceInformation.code >> '35bed131-8e15-45f7-9415-bfcb7455614e'

        isvTransMockWithCtRefNotSaved.id >> 'ref2'
        isvTransMockWithCtRefNotSaved.clientReferenceInformation >> Mock(TssV2TransactionsPost201ResponseEmbeddedClientReferenceInformation)
        isvTransMockWithCtRefNotSaved.clientReferenceInformation.code >> '35bed131-8e15-45f7-9415-bfcb7455614e'

        isvTransMockNoCtRef.id >> 'ref3'
        isvTransMockNoCtRef.clientReferenceInformation >> Mock(TssV2TransactionsPost201ResponseEmbeddedClientReferenceInformation)
        isvTransMockNoCtRef.clientReferenceInformation.code >> 'someOtherRef'

        ctPaymentMock.id >> '35bed131-8e15-45f7-9415-bfcb7455614e'
        ctPaymentMock.transactions >> [ctTransactionWithRef1InteractionMock]
    }

    def 'should create a CT transaction when there is no reference to the transaction saved on a payment'() {
        given:
        def testObj = new TransactionSynchronizer(ctPaymentSearchServiceMock, ctAddTransactionServiceMock)

        when:
        testObj.synchronizeTransaction(isvTransMockWithCtRefNotSaved)

        then:
        1 * ctAddTransactionServiceMock.retrieveSynchronizableApplicationsForTransaction(isvTransMockWithCtRefNotSaved) >> Arrays.asList(isvApplicationMock)
        1 * ctAddTransactionServiceMock.canCreateCtTransaction(isvTransMockWithCtRefNotSaved) >> true
        1 * ctAddTransactionServiceMock.isvApplicationExistsOnPayment(ctPaymentMock, isvTransMockWithCtRefNotSaved, isvApplicationMock) >> false
        1 * ctPaymentSearchServiceMock.findPaymentByPaymentId('35bed131-8e15-45f7-9415-bfcb7455614e') >> Optional.of(ctPaymentMock)
        1 * ctAddTransactionServiceMock.addCtTransactionFromIsvTransaction(isvTransMockWithCtRefNotSaved, ctPaymentMock, isvApplicationMock)
    }

    def 'should not create a CT transaction if the ISV reference exists on the payment'() {
        given:
        def testObj = new TransactionSynchronizer(ctPaymentSearchServiceMock, ctAddTransactionServiceMock)

        when:
        testObj.synchronizeTransaction(isvTransMockWithCtRefSaved)

        then:
        1 * ctAddTransactionServiceMock.retrieveSynchronizableApplicationsForTransaction(isvTransMockWithCtRefSaved) >> Arrays.asList(isvApplicationMock)
        1 * ctAddTransactionServiceMock.canCreateCtTransaction(isvTransMockWithCtRefSaved) >> true
        1 * ctAddTransactionServiceMock.isvApplicationExistsOnPayment(ctPaymentMock, isvTransMockWithCtRefSaved, isvApplicationMock) >> true
        1 * ctPaymentSearchServiceMock.findPaymentByPaymentId('35bed131-8e15-45f7-9415-bfcb7455614e') >> Optional.of(ctPaymentMock)
        0 * ctAddTransactionServiceMock.addCtTransactionFromIsvTransaction(isvTransMockWithCtRefSaved, ctPaymentMock, isvApplicationMock)
    }

    def 'Should handle invalid merchant reference'() {
        given:
        def testObj = new TransactionSynchronizer(ctPaymentSearchServiceMock, ctAddTransactionServiceMock)

        when:
        testObj.synchronizeTransaction(isvTransMockNoCtRef)

        then:
        1 * ctAddTransactionServiceMock.canCreateCtTransaction(isvTransMockNoCtRef) >> true
        1 * ctPaymentSearchServiceMock.findPaymentByPaymentId('someOtherRef') >> Optional.empty()
        0 * ctAddTransactionServiceMock.retrieveSynchronizableApplicationsForTransaction(_, _)
        0 * ctAddTransactionServiceMock.addCtTransactionFromIsvTransaction(_, _)
        0 * ctAddTransactionServiceMock.addCtTransactionFromIsvTransaction(_, _)
    }

    def 'Should handle invalid ISV transaction type'() {
        given:
        def testObj = new TransactionSynchronizer(ctPaymentSearchServiceMock, ctAddTransactionServiceMock)

        when:
        testObj.synchronizeTransaction(isvTransMockNoCtRef)

        then:
        1 * ctAddTransactionServiceMock.canCreateCtTransaction(isvTransMockNoCtRef) >> false
        0 * ctAddTransactionServiceMock.retrieveSynchronizableApplicationsForTransaction(_, _) >> []
        0 * ctAddTransactionServiceMock.isvApplicationExistsOnPayment(ctPaymentMock, isvTransMockWithCtRefSaved, isvApplicationMock) >> false
        0 * ctPaymentSearchServiceMock.findPaymentByPaymentId('someOtherRef') >> Optional.empty()
        0 * ctAddTransactionServiceMock.addCtTransactionFromIsvTransaction(_, _)
    }
}
