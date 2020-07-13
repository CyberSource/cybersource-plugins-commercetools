package isv.commercetools.mapping.transformer.fieldgroup

import io.sphere.sdk.payments.Payment
import io.sphere.sdk.types.CustomFields
import isv.commercetools.mapping.model.CustomPayment
import isv.commercetools.mapping.model.PaymentDetails
import spock.lang.Specification

class SubscriptionUpdateServiceFieldGroupTransformerSpecification extends Specification {

    def testObj = new SubscriptionUpdateServiceFieldGroupTransformer()

    def 'should transform payment to subscription update service field group'() {
        given: 'we have a payment'
        def ctPayment = Mock(Payment)
        def customPayment = new CustomPayment(ctPayment)
        def paymentDetails = new PaymentDetails(customPayment)

        def paymentCustomFields = Mock(CustomFields)
        paymentCustomFields.getFieldAsString('cs_savedToken') >> 'someToken'
        ctPayment.custom >> paymentCustomFields

        when: 'we transform it'
        def result = testObj.configure(paymentDetails)

        then: 'it has the correct subscription update service values'
        result.run
    }

    def 'should not transform payment to subscription update service field group when no saved token'() {
        given: 'we have a payment'
        def ctPayment = Mock(Payment)
        def customPayment = new CustomPayment(ctPayment)
        def paymentDetails = new PaymentDetails(customPayment)

        when: 'we transform it'
        def result = testObj.configure(paymentDetails)

        then: 'it is empty'
        result.isEmpty()
    }

}
