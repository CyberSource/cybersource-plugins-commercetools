package isv.commercetools.mapping.transformer.fieldgroup

import io.sphere.sdk.payments.Payment
import io.sphere.sdk.types.CustomFields
import isv.commercetools.mapping.model.CustomPayment
import isv.commercetools.mapping.model.PaymentDetails
import spock.lang.Specification

class RecurringSubscriptionInfoFieldGroupTransformerSpecification extends Specification {

    def testObj = new RecurringSubscriptionInfoFieldGroupTransformer()

    def 'should transform saved token payment to subscription field group'() {
        given: 'we have a payment'
        def ctPayment = Mock(Payment)

        def paymentCustomFields = Mock(CustomFields)
        paymentCustomFields.getFieldAsString('isv_savedToken') >> 'someToken'
        ctPayment.custom >> paymentCustomFields

        def customPayment = new CustomPayment(ctPayment)
        def paymentDetails = new PaymentDetails(customPayment)

        when: 'we transform it'
        def result = testObj.configure(paymentDetails)

        then: 'it has the correct subscription values'
        result.size() == 1
        result[0].subscriptionID == 'someToken'
    }

    def 'should transform payment with request to save token to subscription field group'() {
        given: 'we have a payment'
        def ctPayment = Mock(Payment)

        def paymentCustomFields = Mock(CustomFields)
        paymentCustomFields.getFieldAsString('isv_tokenAlias') >> 'someAlias'
        ctPayment.custom >> paymentCustomFields

        def customPayment = new CustomPayment(ctPayment)
        def paymentDetails = new PaymentDetails(customPayment)

        when: 'we transform it'
        def result = testObj.configure(paymentDetails)

        then: 'it has the correct subscription values'
        result.size() == 1
        result[0].frequency == 'on-demand'
    }

    def 'should transform payment without subscription info to subscription field group'() {
        given: 'we have a payment'
        def ctPayment = Mock(Payment)

        def paymentCustomFields = Mock(CustomFields)
        ctPayment.custom >> paymentCustomFields

        def customPayment = new CustomPayment(ctPayment)
        def paymentDetails = new PaymentDetails(customPayment)

        when: 'we transform it'
        def result = testObj.configure(paymentDetails)

        then: 'it is empty'
        result.isEmpty()
    }

}
