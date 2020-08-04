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

    def csTransMockWithCtRefSaved = Mock(TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries)
    def csTransMockWithCtRefNotSaved = Mock(TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries)
    def csTransMockNoCtRef = Mock(TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries)

    def ctPaymentMock = Mock(Payment)
    def ctTransactionWithRef1InteractionMock = Mock(Transaction)

    def ctPaymentSearchServiceMock = Mock(CtPaymentSearchService)
    def ctAddTransactionServiceMock = Mock(CtTransactionService)

    def csApplicationMock = Mock(TssV2TransactionsGet200ResponseApplicationInformationApplications)

    def setup() {
        ctTransactionWithRef1InteractionMock.interactionId >> 'ref1'

        csTransMockWithCtRefSaved.id >> 'ref1'
        csTransMockWithCtRefSaved.clientReferenceInformation >> Mock(TssV2TransactionsPost201ResponseEmbeddedClientReferenceInformation)
        csTransMockWithCtRefSaved.clientReferenceInformation.code >> '35bed131-8e15-45f7-9415-bfcb7455614e'

        csTransMockWithCtRefNotSaved.id >> 'ref2'
        csTransMockWithCtRefNotSaved.clientReferenceInformation >> Mock(TssV2TransactionsPost201ResponseEmbeddedClientReferenceInformation)
        csTransMockWithCtRefNotSaved.clientReferenceInformation.code >> '35bed131-8e15-45f7-9415-bfcb7455614e'

        csTransMockNoCtRef.id >> 'ref3'
        csTransMockNoCtRef.clientReferenceInformation >> Mock(TssV2TransactionsPost201ResponseEmbeddedClientReferenceInformation)
        csTransMockNoCtRef.clientReferenceInformation.code >> 'someOtherRef'

        ctPaymentMock.id >> '35bed131-8e15-45f7-9415-bfcb7455614e'
        ctPaymentMock.transactions >> [ctTransactionWithRef1InteractionMock]
    }

    def 'should create a CT transaction when there is no reference to the transaction saved on a payment'() {
        given:
        def testObj = new TransactionSynchronizer(ctPaymentSearchServiceMock, ctAddTransactionServiceMock)

        when:
        testObj.synchronizeTransaction(csTransMockWithCtRefNotSaved)

        then:
        1 * ctAddTransactionServiceMock.retrieveSynchronizableApplicationsForTransaction(csTransMockWithCtRefNotSaved) >> Arrays.asList(csApplicationMock)
        1 * ctAddTransactionServiceMock.canCreateCtTransaction(csTransMockWithCtRefNotSaved) >> true
        1 * ctAddTransactionServiceMock.csApplicationExistsOnPayment(ctPaymentMock, csTransMockWithCtRefNotSaved, csApplicationMock) >> false
        1 * ctPaymentSearchServiceMock.findPaymentByPaymentId('35bed131-8e15-45f7-9415-bfcb7455614e') >> Optional.of(ctPaymentMock)
        1 * ctAddTransactionServiceMock.addCtTransactionFromCsTransaction(csTransMockWithCtRefNotSaved, ctPaymentMock, csApplicationMock)
    }

    def 'should not create a CT transaction if the CS reference exists on the payment'() {
        given:
        def testObj = new TransactionSynchronizer(ctPaymentSearchServiceMock, ctAddTransactionServiceMock)

        when:
        testObj.synchronizeTransaction(csTransMockWithCtRefSaved)

        then:
        1 * ctAddTransactionServiceMock.retrieveSynchronizableApplicationsForTransaction(csTransMockWithCtRefSaved) >> Arrays.asList(csApplicationMock)
        1 * ctAddTransactionServiceMock.canCreateCtTransaction(csTransMockWithCtRefSaved) >> true
        1 * ctAddTransactionServiceMock.csApplicationExistsOnPayment(ctPaymentMock, csTransMockWithCtRefSaved, csApplicationMock) >> true
        1 * ctPaymentSearchServiceMock.findPaymentByPaymentId('35bed131-8e15-45f7-9415-bfcb7455614e') >> Optional.of(ctPaymentMock)
        0 * ctAddTransactionServiceMock.addCtTransactionFromCsTransaction(csTransMockWithCtRefSaved, ctPaymentMock, csApplicationMock)
    }

    def 'Should handle invalid merchant reference'() {
        given:
        def testObj = new TransactionSynchronizer(ctPaymentSearchServiceMock, ctAddTransactionServiceMock)

        when:
        testObj.synchronizeTransaction(csTransMockNoCtRef)

        then:
        1 * ctAddTransactionServiceMock.canCreateCtTransaction(csTransMockNoCtRef) >> true
        1 * ctPaymentSearchServiceMock.findPaymentByPaymentId('someOtherRef') >> Optional.empty()
        0 * ctAddTransactionServiceMock.retrieveSynchronizableApplicationsForTransaction(_, _)
        0 * ctAddTransactionServiceMock.addCtTransactionFromCsTransaction(_, _)
        0 * ctAddTransactionServiceMock.addCtTransactionFromCsTransaction(_, _)
    }

    def 'Should handle invalid cs transaction type'() {
        given:
        def testObj = new TransactionSynchronizer(ctPaymentSearchServiceMock, ctAddTransactionServiceMock)

        when:
        testObj.synchronizeTransaction(csTransMockNoCtRef)

        then:
        1 * ctAddTransactionServiceMock.canCreateCtTransaction(csTransMockNoCtRef) >> false
        0 * ctAddTransactionServiceMock.retrieveSynchronizableApplicationsForTransaction(_, _) >> []
        0 * ctAddTransactionServiceMock.csApplicationExistsOnPayment(ctPaymentMock, csTransMockWithCtRefSaved, csApplicationMock) >> false
        0 * ctPaymentSearchServiceMock.findPaymentByPaymentId('someOtherRef') >> Optional.empty()
        0 * ctAddTransactionServiceMock.addCtTransactionFromCsTransaction(_, _)
    }
}
