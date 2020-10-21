package isv.commercetools.sync.isv.request

import Model.CreateSearchRequest
import spock.lang.Specification

class IsvTransactionSearchPaginationSpecification extends Specification {

    def transactionSearchMock = Mock(IsvTransactionSearchImpl)

    def 'setup'() {
        transactionSearchMock.batchSize >> 100
    }

    def 'should correctly get next requests'() {
        when:
        def testObj = new IsvTransactionSearchPagination(transactionSearchMock)
        def nextSearch = testObj.next()

        then:
        1 * transactionSearchMock.buildRequest(0) >> ([limit:20, offset:10] as CreateSearchRequest)
        testObj.currentPage == 1
        nextSearch.limit == 20
        nextSearch.offset == 10

        when:
        nextSearch = testObj.next()

        then:
        1 * transactionSearchMock.buildRequest(100) >> ([limit:20, offset:30] as CreateSearchRequest)
        testObj.currentPage == 2
        nextSearch.limit == 20
        nextSearch.offset == 30

        when:
        nextSearch = testObj.next()

        then:
        1 * transactionSearchMock.buildRequest(200) >> ([limit:20, offset:50] as CreateSearchRequest)
        testObj.currentPage == 3
        nextSearch.limit == 20
        nextSearch.offset == 50
    }

}
