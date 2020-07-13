package isv.commercetools.mapping.transformer.fieldgroup

import isv.commercetools.mapping.model.PaymentDetails
import isv.commercetools.mapping.model.PaymentOverrides
import spock.lang.Specification
import spock.lang.Unroll

class DecisionManagerFieldGroupTransformerSpecification extends Specification {

    def testObj = new DecisionManagerFieldGroupTransformer()

    PaymentDetails paymentDetailsMock = Mock()
    PaymentOverrides paymentOverridesMock = Mock()

    def setup() {
        paymentDetailsMock.overrides >> paymentOverridesMock
    }

    def 'should not add flag when override missing'() {
        given:
        paymentOverridesMock.enableDecisionManager >> Optional.empty()

        when:
        def result = testObj.configure(paymentDetailsMock)

        then:
        result.isEmpty()
    }

    @Unroll
    def 'should add flag when override present'() {
        given:
        paymentOverridesMock.enableDecisionManager >> Optional.of(enabled)

        when:
        def result = testObj.configure(paymentDetailsMock)

        then:
        result.size() == 1
        result[0].enabled == enabled

        where:
        enabled << [true, false]
    }

}
