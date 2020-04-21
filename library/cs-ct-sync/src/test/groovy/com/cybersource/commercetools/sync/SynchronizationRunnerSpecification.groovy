package com.cybersource.commercetools.sync

import Model.*
import com.cybersource.commercetools.sync.cybersource.CsTransactionSearchService
import com.cybersource.commercetools.sync.cybersource.request.CsTransactionSearch
import spock.lang.Specification

class SynchronizationRunnerSpecification extends Specification {

    def csTransMockWithCtRefSaved = Mock(TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries)
    def csTransMockWithCtRefNotSaved = Mock(TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries)
    def csTransMockNoCtRef = Mock(TssV2TransactionsPost201ResponseEmbeddedTransactionSummaries)

    def csTransactionSearchServiceMock = Mock(CsTransactionSearchService)
    def transactionSearchMock = Mock(CsTransactionSearch)
    def transactionSynchronizerMock = Mock(TransactionSynchronizer)

    def setup() {
        csTransMockWithCtRefSaved.id >> 'ref1'
        csTransMockWithCtRefSaved.clientReferenceInformation >> Mock(TssV2TransactionsPost201ResponseEmbeddedClientReferenceInformation)
        csTransMockWithCtRefSaved.clientReferenceInformation.code >> '35bed131-8e15-45f7-9415-bfcb7455614e'

        csTransMockWithCtRefNotSaved.id >> 'ref2'
        csTransMockWithCtRefNotSaved.clientReferenceInformation >> Mock(TssV2TransactionsPost201ResponseEmbeddedClientReferenceInformation)
        csTransMockWithCtRefNotSaved.clientReferenceInformation.code >> '35bed131-8e15-45f7-9415-bfcb7455614e'

        csTransMockNoCtRef.id >> 'ref3'
        csTransMockNoCtRef.clientReferenceInformation >> Mock(TssV2TransactionsPost201ResponseEmbeddedClientReferenceInformation)
        csTransMockNoCtRef.clientReferenceInformation.code >> 'someOtherRef'

        transactionSearchMock.buildRequest(_ as Integer) >> Mock(CreateSearchRequest)
    }

    def 'should synchronise payments that have a UUID as a client ref code'() {
        given:
        def searchResult1Mock = createSearchResult(List.of(csTransMockWithCtRefSaved, csTransMockWithCtRefNotSaved, csTransMockNoCtRef))
        def searchResult2Mock = createSearchResult(List.of(csTransMockWithCtRefSaved))
        def searchResult3Mock = createSearchResult(Collections.emptyList())

        and:
        def testObj = new SynchronizationRunner(csTransactionSearchServiceMock, transactionSynchronizerMock)

        when:
        testObj.synchronize(transactionSearchMock)

        then:
        3 * csTransactionSearchServiceMock.doRequest(_ as CreateSearchRequest) >>> [searchResult1Mock, searchResult2Mock, searchResult3Mock]
        2 * transactionSynchronizerMock.synchronizeTransaction(csTransMockWithCtRefSaved)
        1 * transactionSynchronizerMock.synchronizeTransaction(csTransMockWithCtRefNotSaved)
        0 * transactionSynchronizerMock.synchronizeTransaction(csTransMockNoCtRef)
    }

    def 'should handle empty results from cs search'() {
        given:
        def testObj = new SynchronizationRunner(csTransactionSearchServiceMock, transactionSynchronizerMock)

        when:
        testObj.synchronize(transactionSearchMock)

        then:
        1 * csTransactionSearchServiceMock.doRequest(_ as CreateSearchRequest) >>
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
