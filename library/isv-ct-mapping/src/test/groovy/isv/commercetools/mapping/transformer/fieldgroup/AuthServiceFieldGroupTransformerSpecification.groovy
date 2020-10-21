package isv.commercetools.mapping.transformer.fieldgroup

import io.sphere.sdk.payments.Payment
import isv.commercetools.mapping.model.CustomPayment
import isv.commercetools.mapping.model.PaymentDetails
import spock.lang.Specification

class AuthServiceFieldGroupTransformerSpecification extends Specification {

    def testObj = new AuthServiceFieldGroupTransformer()

    def 'should transform payment to auth service field group'() {
        given: 'we have a payment'
        def ctPayment = Mock(Payment)
        def customPayment = new CustomPayment(ctPayment)
        def paymentDetails = new PaymentDetails(customPayment)

        when: 'we transform it'
        def result = testObj.configure(paymentDetails)

        then: 'it has the correct auth service values'
        result.run
    }

}
