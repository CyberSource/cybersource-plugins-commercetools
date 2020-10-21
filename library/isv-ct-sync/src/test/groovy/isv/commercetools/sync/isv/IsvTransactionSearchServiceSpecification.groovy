package isv.commercetools.sync.isv

import Api.ConversionDetailsApi
import Api.SearchTransactionsApi
import Model.CreateSearchRequest
import Model.ReportingV3ConversionDetailsGet200Response
import Model.ReportingV3ConversionDetailsGet200ResponseConversionDetails
import Model.TssV2TransactionsPost201Response
import isv.commercetools.sync.isv.request.IsvTransactionSearchPagination
import org.joda.time.DateTime
import spock.lang.Specification

class IsvTransactionSearchServiceSpecification extends Specification {

    def searchTransactionApiMock = Mock(SearchTransactionsApi)

    def conversionDetailsApiClientMock = Mock(ConversionDetailsApi)
    def conversionDetailsGet200ResponseMock = Mock(ReportingV3ConversionDetailsGet200Response)
    def conversionDetailsMock = Mock(ReportingV3ConversionDetailsGet200ResponseConversionDetails)

    def testObj = new IsvTransactionSearchService(searchTransactionApiMock, conversionDetailsApiClientMock)

    def 'should return all results for a paginated search'() {
        given:
        def pagedSearch = Mock(IsvTransactionSearchPagination)
        pagedSearch.next() >> Mock(CreateSearchRequest)

        when:
        def result = testObj.getAllResultsForPaginatedSearch(pagedSearch)

        then:
        4 * searchTransactionApiMock.createSearch(_ as CreateSearchRequest) >>> [
                makeSuccessfulResult('d920bee5-a190-410d-99e0-38e47a88ca2d'),
                makeSuccessfulResult('something'),
                makeSuccessfulResult('e823f219-a91b-45d3-81e8-da873bca3d5d'),
                makeEmptyResult(),
        ]

        and:
        result.size() == 3
        result.find { it.clientReferenceInformation.code == 'd920bee5-a190-410d-99e0-38e47a88ca2d' }
        result.find { it.clientReferenceInformation.code == 'something' }
        result.find { it.clientReferenceInformation.code == 'e823f219-a91b-45d3-81e8-da873bca3d5d' }
    }

    def 'should handle no result'() {
        given:
        def pagedSearchMock = Mock(IsvTransactionSearchPagination)
        pagedSearchMock.next() >> Mock(CreateSearchRequest)

        when:
        def result = testObj.getAllResultsForPaginatedSearch(pagedSearchMock)

        then:
        1 * searchTransactionApiMock.createSearch(_ as CreateSearchRequest) >>> [
                makeEmptyResult(),
        ]

        and:
        result.size() == 0
    }

    def makeSuccessfulResult(String code) {
        [
            embedded:[
                transactionSummaries:[
                    [
                        clientReferenceInformation:[
                            code:code
                        ]
                    ],
                ]
            ]
        ]
    }

    def makeEmptyResult() {
        [] as TssV2TransactionsPost201Response
    }

    def 'should return conversion details'() {
        given: 'conversion details api fetches conversion details'
        conversionDetailsApiClientMock.getConversionDetail(_ as DateTime, _ as DateTime, _ as String) >> conversionDetailsGet200ResponseMock
        conversionDetailsGet200ResponseMock.conversionDetails >> [conversionDetailsMock]

        when:
        def result = testObj.conversionDetailsGet200Response(DateTime.now(), DateTime.now(), 'somOrgId')

        then:
        assert result != null
        assert result == conversionDetailsGet200ResponseMock
        assert result.conversionDetails == [conversionDetailsMock]
    }

    def 'should return null result for any api client exception'() {
        given: 'conversion client api encounters an error while fetching conversion details'
        conversionDetailsApiClientMock.getConversionDetail(_ as DateTime, _ as DateTime, _ as String) >> null
        when:
        def result = testObj.conversionDetailsGet200Response(DateTime.now(), DateTime.now(), 'somOrgId')

        then:
        assert result == null
    }
}
