package com.cybersource.commercetools.mapping.transformer.fieldgroup

import com.cybersource.commercetools.mapping.model.PaymentDetails
import com.cybersource.commercetools.mapping.model.CustomPayment
import io.sphere.sdk.payments.Payment
import io.sphere.sdk.types.CustomFields
import spock.lang.Specification

class RecurringSubscriptionInfoFieldGroupTransformerSpecification extends Specification {

    def testObj = new RecurringSubscriptionInfoFieldGroupTransformer()

    def 'should transform payment to subscription field group'() {
        given: 'we have a payment'
        def ctPayment = Mock(Payment)

        def paymentCustomFields = Mock(CustomFields)
        paymentCustomFields.getFieldAsString('cs_token') >> 'someToken'
        ctPayment.custom >> paymentCustomFields

        def customPayment = new CustomPayment(ctPayment)
        def paymentDetails = new PaymentDetails(customPayment)

        when: 'we transform it'
        def result = testObj.configure(paymentDetails)

        then: 'it has the correct subscription values'
        result.size() == 1
        result[0].subscriptionID == 'someToken'
    }

}
