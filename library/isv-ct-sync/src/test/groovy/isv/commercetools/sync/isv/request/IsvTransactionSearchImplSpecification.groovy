package isv.commercetools.sync.isv.request

import spock.lang.Specification

class IsvTransactionSearchImplSpecification extends Specification {

    def testObj = new IsvTransactionSearchImpl('someQuery', 'someSort', 10)

    def 'should build a request'() {
        when:
        def result = testObj.buildRequest(5)

        then:
        !result.save
        result.query == 'someQuery'
        result.offset == 5
        result.limit == 10
        result.sort == 'someSort'
    }
}
