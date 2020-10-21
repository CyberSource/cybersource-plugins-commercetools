package isv.commercetools.mapping.model

import spock.lang.Specification

class PaymentServiceIdsSpecification extends Specification {

    def testObj = new PaymentServiceIds()

    def "should return 0RX6X1BO for the Partner Solution Id"() {
        when:
        def partnerSolutionId = testObj.partnerSolutionId

        then:
        partnerSolutionId == '0RX6X1BO'
    }
}
