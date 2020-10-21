package isv.commercetools.sync

import Model.*
import isv.commercetools.sync.isv.IsvTransactionSearchService
import isv.commercetools.sync.isv.request.IsvTransactionSearch
import spock.lang.Specification

class SynchronizationRunnerSpecification extends Specification {

    def isvTransMockWithCtRefSaved = Mock(TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries)
    def isvTransMockWithCtRefNotSaved = Mock(TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries)
    def isvTransMockNoCtRef = Mock(TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries)

    def isvTransactionSearchServiceMock = Mock(IsvTransactionSearchService)
    def transactionSearchMock = Mock(IsvTransactionSearch)
    def transactionSynchronizerMock = Mock(TransactionSynchronizer)

    def setup() {
        isvTransMockWithCtRefSaved.id >> 'ref1'
        isvTransMockWithCtRefSaved.clientReferenceInformation >> Mock(TssV2TransactionsPost201ResponseEmbeddedClientReferenceInformation)
        isvTransMockWithCtRefSaved.clientReferenceInformation.code >> '35bed131-8e15-45f7-9415-bfcb7455614e'

        isvTransMockWithCtRefNotSaved.id >> 'ref2'
        isvTransMockWithCtRefNotSaved.clientReferenceInformation >> Mock(TssV2TransactionsPost201ResponseEmbeddedClientReferenceInformation)
        isvTransMockWithCtRefNotSaved.clientReferenceInformation.code >> '35bed131-8e15-45f7-9415-bfcb7455614e'

        isvTransMockNoCtRef.id >> 'ref3'
        isvTransMockNoCtRef.clientReferenceInformation >> Mock(TssV2TransactionsPost201ResponseEmbeddedClientReferenceInformation)
        isvTransMockNoCtRef.clientReferenceInformation.code >> 'someOtherRef'

        transactionSearchMock.buildRequest(_ as Integer) >> Mock(CreateSearchRequest)
    }

    def 'should synchronise payments that have a UUID as a client ref code'() {
        given:
        def searchResult1Mock = createSearchResult(List.of(isvTransMockWithCtRefSaved, isvTransMockWithCtRefNotSaved, isvTransMockNoCtRef))
        def searchResult2Mock = createSearchResult(List.of(isvTransMockWithCtRefSaved))
        def searchResult3Mock = createSearchResult(Collections.emptyList())

        and:
        def testObj = new SynchronizationRunner(isvTransactionSearchServiceMock, transactionSynchronizerMock)

        when:
        testObj.synchronize(transactionSearchMock)

        then:
        3 * isvTransactionSearchServiceMock.doRequest(_ as CreateSearchRequest) >>> [searchResult1Mock, searchResult2Mock, searchResult3Mock]
        2 * transactionSynchronizerMock.synchronizeTransaction(isvTransMockWithCtRefSaved)
        1 * transactionSynchronizerMock.synchronizeTransaction(isvTransMockWithCtRefNotSaved)
        0 * transactionSynchronizerMock.synchronizeTransaction(isvTransMockNoCtRef)
    }

    def 'should handle empty results from ISV search'() {
        given:
        def testObj = new SynchronizationRunner(isvTransactionSearchServiceMock, transactionSynchronizerMock)

        when:
        testObj.synchronize(transactionSearchMock)

        then:
        1 * isvTransactionSearchServiceMock.doRequest(_ as CreateSearchRequest) >>
            createSearchResult(Collections.emptyList())

        0 * transactionSynchronizerMock.synchronizeTransaction(_)
    }

    private createSearchResult(List summaryMocks) {
        def searchResultEmbeddedMock = Mock(TssV2TransactionsPost201ResponseEmbedded)
        searchResultEmbeddedMock.transactionSummaries >> summaryMocks

        def searchResultMock = Mock(TssV2TransactionsPost201Response)
        searchResultMock.count >> summaryMocks.size()
        searchResultMock.offset >> 100
        searchResultMock.totalCount >> 500
        searchResultMock.embedded >> searchResultEmbeddedMock

        searchResultMock
    }
}
