package isv.commercetools.mapping.transformer.fieldgroup

import io.jsonwebtoken.Jwts
import io.sphere.sdk.payments.Payment
import io.sphere.sdk.types.CustomFields
import isv.commercetools.mapping.model.CustomPayment
import isv.commercetools.mapping.model.PaymentDetails
import spock.lang.Specification

class TokenSourceFieldGroupTransformerSpecification extends Specification {

    def testObj = new TokenSourceFieldGroupTransformer()

    def 'should transform payment to token source field group'() {
        given: 'we have a payment'
        def ctPayment = Mock(Payment)

        def paymentCustomFields = Mock(CustomFields)
        def token = Jwts.builder()
                .claim('jti', 'someToken')
                .compact() + 'signature'
        paymentCustomFields.getFieldAsString('cs_token') >> token
        ctPayment.custom >> paymentCustomFields

        def customPayment = new CustomPayment(ctPayment)
        def paymentDetails = new PaymentDetails(customPayment)

        when: 'we transform it'
        def result = testObj.configure(paymentDetails)

        then: 'it has the correct token value'
        result.size() == 1
        result[0].transientToken == 'someToken'
    }

    def 'should not transform payment to token source field group when no token provided'() {
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
