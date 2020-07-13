package isv.commercetools.sync.cybersource.request

import spock.lang.Specification

class CsTransactionSearchImplSpecification extends Specification {

    def testObj = new CsTransactionSearchImpl('someQuery', 'someSort', 10)

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
