package isv.commercetools.mapping.model

import spock.lang.Specification

class CybersourceIdsSpecification extends Specification {

    def testObj = new CybersourceIds()

    def "should return 0RX6X1BO for the Partner Solution Id"() {
        when:
        def partnerSolutionId = testObj.partnerSolutionId

        then:
        partnerSolutionId == '0RX6X1BO'
    }
}
