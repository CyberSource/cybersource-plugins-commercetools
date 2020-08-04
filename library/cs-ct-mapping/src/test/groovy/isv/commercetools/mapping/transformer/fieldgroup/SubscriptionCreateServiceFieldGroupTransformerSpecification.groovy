package isv.commercetools.mapping.transformer.fieldgroup

import io.sphere.sdk.payments.Payment
import io.sphere.sdk.types.CustomFields
import isv.commercetools.mapping.model.CustomPayment
import isv.commercetools.mapping.model.PaymentDetails
import spock.lang.Specification

class SubscriptionCreateServiceFieldGroupTransformerSpecification extends Specification {

    def testObj = new SubscriptionCreateServiceFieldGroupTransformer()

    def 'should transform payment to subscription create service field group'() {
        given: 'we have a payment'
        def ctPayment = Mock(Payment)
        def customPayment = new CustomPayment(ctPayment)
        def paymentDetails = new PaymentDetails(customPayment)

        def paymentCustomFields = Mock(CustomFields)
        paymentCustomFields.getFieldAsString('cs_tokenAlias') >> 'someToken'
        ctPayment.custom >> paymentCustomFields

        when: 'we transform it'
        def result = testObj.configure(paymentDetails)

        then: 'it has the correct subscription create service values'
        result.run
    }

    def 'should not transform payment to subscription create service field group when no request to save token'() {
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
