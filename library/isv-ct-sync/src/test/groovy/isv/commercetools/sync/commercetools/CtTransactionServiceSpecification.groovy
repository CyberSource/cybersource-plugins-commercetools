package isv.commercetools.sync.commercetools

import Model.TssV2TransactionsGet200ResponseApplicationInformationApplications
import Model.TssV2TransactionsPost201ResponseEmbeddedApplicationInformation
import Model.TssV2TransactionsPost201ResponseEmbeddedClientReferenceInformation
import Model.TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries
import io.sphere.sdk.client.SphereClient
import io.sphere.sdk.payments.Payment
import io.sphere.sdk.payments.Transaction
import io.sphere.sdk.payments.TransactionDraft
import io.sphere.sdk.payments.TransactionType
import io.sphere.sdk.payments.commands.PaymentUpdateCommand
import io.sphere.sdk.payments.commands.updateactions.AddTransaction
import spock.lang.Specification

import java.util.concurrent.CompletableFuture
import java.util.concurrent.CompletionStage

class CtTransactionServiceSpecification extends Specification {

    def addTransactionMapperMock = Mock(AddTransactionMapper)
    def ctClientMock = Mock(SphereClient)
    def transactionTypeMapperMock = Mock(TransactionTypeMapper)
    def actionMock = AddTransaction.of(Mock(TransactionDraft))
    def ctPaymentWithAuthTransactionMock = Mock(Payment)
    def ctPaymentWithCaptureTransactionMock = Mock(Payment)
    def ctPaymentNoRefMock = Mock(Payment)
    def ctTransactionWithAuthRefInteractionMock = Mock(Transaction)
    def ctTransactionWithCaptureRefInteractionMock = Mock(Transaction)
    def ctTransactionWithNoRefInteractionMock = Mock(Transaction)

    def summaryMock = Mock(TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries)
    def applicationMock = Mock(TssV2TransactionsGet200ResponseApplicationInformationApplications)

    def completableFutureMock = Mock(CompletableFuture)
    def completionStageMock = Mock(CompletionStage)

    List<String> synchronizableApplications = List.of('ics_auth', 'ics_bill')

    def testObj = new CtTransactionService(addTransactionMapperMock, ctClientMock, transactionTypeMapperMock, synchronizableApplications)

    def setup() {
        ctPaymentWithAuthTransactionMock.transactions >> Arrays.asList(ctTransactionWithAuthRefInteractionMock)
        ctTransactionWithAuthRefInteractionMock.interactionId >> 'ref1'
        ctTransactionWithAuthRefInteractionMock.type >> TransactionType.AUTHORIZATION

        ctPaymentWithCaptureTransactionMock.transactions >> Arrays.asList(ctTransactionWithCaptureRefInteractionMock)
        ctTransactionWithCaptureRefInteractionMock.interactionId >> 'ref1'
        ctTransactionWithCaptureRefInteractionMock.type >> TransactionType.CHARGE

        ctPaymentNoRefMock.transactions >> Arrays.asList(ctTransactionWithNoRefInteractionMock)
        ctTransactionWithNoRefInteractionMock.interactionId >> 'ref1'
        ctTransactionWithNoRefInteractionMock.type >> TransactionType.AUTHORIZATION

        summaryMock.clientReferenceInformation >> Mock(TssV2TransactionsPost201ResponseEmbeddedClientReferenceInformation)
        summaryMock.clientReferenceInformation.code >> '35bed131-8e15-45f7-9415-bfcb7455614e'

        ctClientMock.execute(_) >> completionStageMock
        completionStageMock.toCompletableFuture() >> completableFutureMock
        completableFutureMock.get() >> null
    }

    def 'Should create a new transaction in a ct payment when transaction type is Authorization'() {
        when:
        testObj.addCtTransactionFromIsvTransaction(summaryMock, ctPaymentWithAuthTransactionMock, applicationMock)

        then:
        1 * transactionTypeMapperMock.mapTransactionType(applicationMock) >> Optional.of(TransactionType.AUTHORIZATION)
        1 * addTransactionMapperMock.createAction(summaryMock, applicationMock, TransactionType.AUTHORIZATION) >> Optional.of(actionMock)
        1 * ctClientMock.execute {
            it instanceof PaymentUpdateCommand &&
                    ((PaymentUpdateCommand) it).updateActions.size() == 1 &&
                    ((PaymentUpdateCommand) it).updateActions[0] == actionMock
        } >> completionStageMock
    }

    def 'Should create a new transaction in a ct payment when transaction type is Charge'() {
        when:
        testObj.addCtTransactionFromIsvTransaction(summaryMock, ctPaymentWithCaptureTransactionMock, applicationMock)

        then:
        1 * transactionTypeMapperMock.mapTransactionType(applicationMock) >> Optional.of(TransactionType.CHARGE)
        1 * addTransactionMapperMock.createAction(summaryMock, applicationMock, TransactionType.CHARGE) >> Optional.of(actionMock)
        1 * ctClientMock.execute {
            it instanceof PaymentUpdateCommand &&
                    ((PaymentUpdateCommand) it).updateActions.size() == 1 &&
                    ((PaymentUpdateCommand) it).updateActions[0] == actionMock
        } >> completionStageMock
    }

    def 'Should not create a new transaction in a ct payment when transaction type is null'() {
        when:
        testObj.addCtTransactionFromIsvTransaction(summaryMock, ctPaymentWithAuthTransactionMock, applicationMock)

        then:
        1 * transactionTypeMapperMock.mapTransactionType(applicationMock) >> Optional.empty()
        0 * addTransactionMapperMock.createAction(summaryMock, applicationMock, null) >> Optional.of(actionMock)
        0 * ctClientMock.execute(_)
    }

    def 'Should return true if the service is capable of creating a transaction on the payment auth transaction'() {
        given:
        def summary = new TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries()
        def application1 = new TssV2TransactionsGet200ResponseApplicationInformationApplications()
        def application2 = new TssV2TransactionsGet200ResponseApplicationInformationApplications()
        summary.applicationInformation = new TssV2TransactionsPost201ResponseEmbeddedApplicationInformation()
        summary.applicationInformation.applications = [application1, application2]
        application1.name = 'ics_auth'
        application1.reasonCode = '100'
        application2.name = 'ics_potato'
        application2.reasonCode = '100'

        when:
        def result = testObj.canCreateCtTransaction(summary)

        then:
        result
    }

    def 'Should return false if the service cannot create a CT transaction due to no applications existing on the summary'() {
        given:
        def summary = new TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries()
        summary.applicationInformation = new TssV2TransactionsPost201ResponseEmbeddedApplicationInformation()
        summary.applicationInformation.applications = null

        when:
        def result = testObj.canCreateCtTransaction(summary)

        then:
        !result
    }

    def 'Should return true if the service is capable of creating a transaction on the payment charge transaction'() {
        given:
        def summary = new TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries()
        def application1 = new TssV2TransactionsGet200ResponseApplicationInformationApplications()
        summary.applicationInformation = new TssV2TransactionsPost201ResponseEmbeddedApplicationInformation()
        summary.applicationInformation.applications = [application1]
        application1.name = 'ics_bill'
        application1.reasonCode = '100'

        when:
        def result = testObj.canCreateCtTransaction(summary)

        then:
        result
    }

    def 'Should return false if service is not capable of creating a transaction on the payment'() {
        given:
        def summary = new TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries()
        def application1 = new TssV2TransactionsGet200ResponseApplicationInformationApplications()
        def application2 = new TssV2TransactionsGet200ResponseApplicationInformationApplications()
        summary.applicationInformation = new TssV2TransactionsPost201ResponseEmbeddedApplicationInformation()
        summary.applicationInformation.applications = [application1, application2]
        application1.name = 'ics_tomato'
        application1.reasonCode = '100'
        application2.name = 'ics_potato'
        application2.reasonCode = '100'

        when:
        def result = testObj.canCreateCtTransaction(summary)

        then:
        !result
    }

    def 'Should return a list of valid applications only for the given transaction'() {
        given:
        def summary = new TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries()
        def application1 = new TssV2TransactionsGet200ResponseApplicationInformationApplications()
        def application2 = new TssV2TransactionsGet200ResponseApplicationInformationApplications()
        def application3 = new TssV2TransactionsGet200ResponseApplicationInformationApplications()
        def application4 = new TssV2TransactionsGet200ResponseApplicationInformationApplications()
        summary.applicationInformation = new TssV2TransactionsPost201ResponseEmbeddedApplicationInformation()
        summary.applicationInformation.applications = Arrays.asList(application1, application2, application3, application4)
        application1.name = 'ics_auth'
        application1.reasonCode = '100'
        application2.name = 'ics_auth'
        application2.reasonCode = '100'
        application3.name = 'ics_potato'
        application3.reasonCode = '100'
        application3.name = 'ics_bill'
        application3.reasonCode = '100'

        when:
        def result = testObj.retrieveSynchronizableApplicationsForTransaction(summary)

        then:
        result.size() == 3
    }

    def 'Should return an empty set for any invalid applications on the transaction'() {
        given:
        def summary = new TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries()
        def application1 = new TssV2TransactionsGet200ResponseApplicationInformationApplications()
        def application2 = new TssV2TransactionsGet200ResponseApplicationInformationApplications()
        def application3 = new TssV2TransactionsGet200ResponseApplicationInformationApplications()
        summary.applicationInformation = new TssV2TransactionsPost201ResponseEmbeddedApplicationInformation()
        summary.applicationInformation.applications = Arrays.asList(application1, application2, application3)
        application1.name = 'ics_abc'
        application1.reasonCode = '100'
        application2.name = 'ics_sdf'
        application2.reasonCode = '100'
        application3.name = 'ics_potato'
        application3.reasonCode = '100'

        when:
        def result = testObj.retrieveSynchronizableApplicationsForTransaction(summary)

        then:
        result.size() == 0
    }

    def 'Should return ics_auth if no ics_decision is present'() {
        given:
        def summary = new TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries()
        def application1 = new TssV2TransactionsGet200ResponseApplicationInformationApplications()
        def application2 = new TssV2TransactionsGet200ResponseApplicationInformationApplications()
        def application3 = new TssV2TransactionsGet200ResponseApplicationInformationApplications()
        summary.applicationInformation = new TssV2TransactionsPost201ResponseEmbeddedApplicationInformation()
        summary.applicationInformation.applications = Arrays.asList(application1, application2, application3)
        application1.name = 'ics_auth'
        application1.reasonCode = '100'
        application2.name = 'ics_sdf'
        application2.reasonCode = '100'
        application3.name = 'ics_potato'
        application3.reasonCode = '100'

        when:
        def result = testObj.retrieveSynchronizableApplicationsForTransaction(summary)

        then:
        result.size() == 1
        result.find { it.name == 'ics_auth' } != null
    }

    def 'Should return ics_decision if ics_decision is present'() {
        given:
        def summary = new TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries()
        def application1 = new TssV2TransactionsGet200ResponseApplicationInformationApplications()
        def application2 = new TssV2TransactionsGet200ResponseApplicationInformationApplications()
        def application3 = new TssV2TransactionsGet200ResponseApplicationInformationApplications()
        summary.applicationInformation = new TssV2TransactionsPost201ResponseEmbeddedApplicationInformation()
        summary.applicationInformation.applications = Arrays.asList(application1, application2, application3)
        application1.name = 'ics_auth'
        application1.reasonCode = '100'
        application2.name = 'ics_decision'
        application2.reasonCode = '100'
        application3.name = 'ics_potato'
        application3.reasonCode = '100'

        when:
        def result = testObj.retrieveSynchronizableApplicationsForTransaction(summary)

        then:
        result.size() == 1
        result.find { it.name == 'ics_auth' } == null
        result.find { it.name == 'ics_decision' } != null
    }

    def 'Should return ics_auth if ics_decision is present but contains no reason code (aka not run)'() {
        given:
        def summary = new TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries()
        def application1 = new TssV2TransactionsGet200ResponseApplicationInformationApplications()
        def application2 = new TssV2TransactionsGet200ResponseApplicationInformationApplications()
        def application3 = new TssV2TransactionsGet200ResponseApplicationInformationApplications()
        summary.applicationInformation = new TssV2TransactionsPost201ResponseEmbeddedApplicationInformation()
        summary.applicationInformation.applications = Arrays.asList(application1, application2, application3)
        application1.name = 'ics_auth'
        application1.reasonCode = '100'
        application2.name = 'ics_decision'
        application2.reasonCode = null
        application3.name = 'ics_potato'
        application3.reasonCode = '100'

        when:
        def result = testObj.retrieveSynchronizableApplicationsForTransaction(summary)

        then:
        result.size() == 1
        result.find { it.name == 'ics_auth' } != null
        result.find { it.name == 'ics_decision' } == null
    }

    def 'Should return boolean true for any existing transaction on the commerce tools payment'() {
        given:
        def summary = new TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries()
        summary.id = 'ref1'
        def application1 = new TssV2TransactionsGet200ResponseApplicationInformationApplications()
        summary.applicationInformation = new TssV2TransactionsPost201ResponseEmbeddedApplicationInformation()
        summary.applicationInformation.applications = Arrays.asList(application1)
        application1.name = 'ics_auth'
        application1.reasonCode = '100'

        when:
        def result = testObj.isvApplicationExistsOnPayment(ctPaymentWithAuthTransactionMock, summary, application1)

        then:
        1 * transactionTypeMapperMock.mapTransactionType(application1) >> Optional.of(TransactionType.AUTHORIZATION)
        result == true
    }

    def 'Should return boolean false for any non-existing transaction on the commerce tools payment'() {
        given:
        def summary = new TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries()
        summary.id = 'ref2'
        def application1 = new TssV2TransactionsGet200ResponseApplicationInformationApplications()
        summary.applicationInformation = new TssV2TransactionsPost201ResponseEmbeddedApplicationInformation()
        summary.applicationInformation.applications = Arrays.asList(application1)
        application1.name = 'ics_auth'
        application1.reasonCode = '100'

        when:
        def result = testObj.isvApplicationExistsOnPayment(ctPaymentNoRefMock, summary, application1)

        then:
        1 * transactionTypeMapperMock.mapTransactionType(application1) >> Optional.of(TransactionType.AUTHORIZATION)
        result == false
    }

    def 'Should return boolean false for any non-existing transaction type capture on the commerce tools payment'() {
        given:
        def summary = new TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries()
        summary.id = 'ref2'
        def application1 = new TssV2TransactionsGet200ResponseApplicationInformationApplications()
        summary.applicationInformation = new TssV2TransactionsPost201ResponseEmbeddedApplicationInformation()
        summary.applicationInformation.applications = Arrays.asList(application1)
        application1.name = 'ics_bill'
        application1.reasonCode = '100'

        when:
        def result = testObj.isvApplicationExistsOnPayment(ctPaymentNoRefMock, summary, application1)

        then:
        1 * transactionTypeMapperMock.mapTransactionType(application1) >> Optional.of(TransactionType.CHARGE)
        result == false
    }
}
