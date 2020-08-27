package isv.commercetools.reference.application.service.extension

import io.sphere.sdk.carts.Cart
import io.sphere.sdk.commands.UpdateAction
import io.sphere.sdk.payments.Payment
import io.sphere.sdk.payments.Transaction
import isv.commercetools.api.extension.model.ErrorCode
import isv.commercetools.mapping.model.CustomPayment
import isv.commercetools.mapping.model.PaymentDetails
import isv.commercetools.reference.application.service.payment.PaymentService
import isv.payments.exception.PaymentException
import spock.lang.Specification
import spock.lang.Unroll

import static io.sphere.sdk.payments.TransactionState.*
import static io.sphere.sdk.payments.TransactionType.*
import static java.util.Collections.emptyList

class PaymentUpdateExtensionServiceSpecification extends Specification {

    PaymentUpdateExtensionService testObj
    CustomPayment customPaymentMock
    Payment paymentMock
    Cart cartMock
    Transaction transactionMock
    Transaction transaction2Mock
    PaymentDetails paymentDetailsWithoutCartMock
    PaymentDetails paymentDetailsWithCartMock

    def chargeServiceMock = Mock(PaymentService)
    def authServiceMock = Mock(PaymentService)
    def cancelAuthServiceMock = Mock(PaymentService)
    def refundServiceMock = Mock(PaymentService)

    def actionMock = Mock(UpdateAction)

    def setup() {
        def paymentUpdateServiceMap = [
                (AUTHORIZATION):[
                        'creditCard':authServiceMock,
                ],
                (CHARGE):[
                        'creditCard':chargeServiceMock,
                ],
                (CANCEL_AUTHORIZATION):[
                        'creditCard':cancelAuthServiceMock,
                ],
                (REFUND):[
                        'creditCard':refundServiceMock,
                ],
        ]

        testObj = new PaymentUpdateExtensionService(paymentUpdateServiceMap)

        customPaymentMock = Mock(CustomPayment)
        paymentMock = Mock(Payment)
        cartMock = Mock(Cart)
        transactionMock = Mock(Transaction)
        transaction2Mock = Mock(Transaction)
        paymentDetailsWithoutCartMock = Mock(PaymentDetails)
        paymentDetailsWithCartMock = Mock(PaymentDetails)

        customPaymentMock.basePayment >> paymentMock
        authServiceMock.populatePaymentDetails(customPaymentMock) >> paymentDetailsWithCartMock
        chargeServiceMock.populatePaymentDetails(customPaymentMock) >> paymentDetailsWithoutCartMock
        cancelAuthServiceMock.populatePaymentDetails(customPaymentMock) >> paymentDetailsWithoutCartMock
        refundServiceMock.populatePaymentDetails(customPaymentMock) >> paymentDetailsWithoutCartMock
    }

    def 'Should authorize a payment when there is an INITIAL AUTHORIZATION and payment method exists in map'() {
        given:
        customPaymentMock.paymentMethod >> 'creditCard'

        and:
        transactionMock.type >> AUTHORIZATION
        transactionMock.state >> INITIAL
        paymentMock.transactions >> [transactionMock]

        when:
        def result = testObj.process(customPaymentMock)

        then:
        1 * authServiceMock.validate(paymentDetailsWithCartMock) >> emptyList()
        1 * authServiceMock.process(paymentDetailsWithCartMock) >> [actionMock]

        and:
        !result.actions.isEmpty()
        result.actions.contains(actionMock)

        and:
        result.errors.isEmpty()
    }

    def 'Should charge a payment when there is an INITIAL CHARGE and payment method exists in map'() {
        given:
        customPaymentMock.paymentMethod >> 'creditCard'

        and:
        transactionMock.type >> CHARGE
        transactionMock.state >> INITIAL
        paymentMock.transactions >> [transactionMock]

        when:
        def result = testObj.process(customPaymentMock)

        then:
        1 * chargeServiceMock.validate(paymentDetailsWithoutCartMock) >> emptyList()
        1 * chargeServiceMock.process(paymentDetailsWithoutCartMock) >> [actionMock]

        and:
        !result.actions.isEmpty()
        result.actions.contains(actionMock)

        and:
        result.errors.isEmpty()
    }

    def 'Should cancel the auth of a payment when there is an INITIAL CANCEL_AUTHORIZATION'() {
        given:
        customPaymentMock.paymentMethod >> 'creditCard'

        and:
        transactionMock.type >> CANCEL_AUTHORIZATION
        transactionMock.state >> INITIAL
        paymentMock.transactions >> [transactionMock]

        when:
        def result = testObj.process(customPaymentMock)

        then:
        1 * cancelAuthServiceMock.validate(paymentDetailsWithoutCartMock) >> emptyList()
        1 * cancelAuthServiceMock.process(paymentDetailsWithoutCartMock) >> [actionMock]

        and:
        !result.actions.isEmpty()
        result.actions.contains(actionMock)

        and:
        result.errors.isEmpty()
    }

    def 'Should refund a payment when there is an INITIAL REFUND'() {
        given:
        customPaymentMock.paymentMethod >> 'creditCard'

        and:
        transactionMock.type >> REFUND
        transactionMock.state >> INITIAL
        paymentMock.transactions >> [transactionMock]

        when:
        def result = testObj.process(customPaymentMock)

        then:
        1 * refundServiceMock.validate(paymentDetailsWithoutCartMock) >> emptyList()
        1 * refundServiceMock.process(paymentDetailsWithoutCartMock) >> [actionMock]

        and:
        !result.actions.isEmpty()
        result.actions.contains(actionMock)

        and:
        result.errors.isEmpty()
    }

    @Unroll
    def 'Should do nothing for a #state #type transaction'() {
        given:
        customPaymentMock.paymentMethod >> 'creditCard'

        and:
        transactionMock.type >> type
        transactionMock.state >> state
        paymentMock.transactions >> [transactionMock]

        when:
        def result = testObj.process(customPaymentMock)

        then:
        0 * chargeServiceMock.validate(_)
        0 * chargeServiceMock.process(_)

        and:
        0 * authServiceMock.validate(_)
        0 * authServiceMock.process(_)

        and:
        result.actions.isEmpty()
        result.errors.isEmpty()

        where:
        state   | type
        FAILURE | CHARGE
        SUCCESS | CHARGE
        PENDING | CHARGE
        FAILURE | AUTHORIZATION
        SUCCESS | AUTHORIZATION
        PENDING | AUTHORIZATION
        FAILURE | REFUND
        SUCCESS | REFUND
        PENDING | REFUND
        FAILURE | CHARGEBACK
        SUCCESS | CHARGEBACK
        PENDING | CHARGEBACK
        FAILURE | CANCEL_AUTHORIZATION
        SUCCESS | CANCEL_AUTHORIZATION
        PENDING | CANCEL_AUTHORIZATION
    }

    def 'Should return an INVALID_OPERATION error if a PaymentException occurs when retrieving cart'() {
        given:
        customPaymentMock.paymentMethod >> 'creditCard'

        and:
        transactionMock.type >> AUTHORIZATION
        transactionMock.state >> INITIAL
        paymentMock.transactions >> [transactionMock]

        when:
        def result = testObj.process(customPaymentMock)

        then:
        1 * authServiceMock.populatePaymentDetails(customPaymentMock) >> { throw new PaymentException('message') }
        0 * authServiceMock.validate(_)
        0 * authServiceMock.process(_)

        and:
        result.errors.size() == 1
        result.errors[0].code == ErrorCode.INVALID_OPERATION
        result.errors[0].message == 'message'
        result.actions.isEmpty()
    }
}
