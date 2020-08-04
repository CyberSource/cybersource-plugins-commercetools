package isv.commercetools.reference.application.service.payment

import io.sphere.sdk.carts.Cart
import io.sphere.sdk.commands.UpdateAction
import io.sphere.sdk.payments.Payment
import io.sphere.sdk.payments.Transaction
import io.sphere.sdk.payments.TransactionState
import io.sphere.sdk.payments.TransactionType
import io.sphere.sdk.payments.commands.updateactions.AddInterfaceInteraction
import io.sphere.sdk.payments.commands.updateactions.ChangeTransactionState
import isv.commercetools.api.extension.model.ExtensionError
import isv.commercetools.mapping.model.CustomPayment
import isv.commercetools.mapping.model.PaymentDetails
import isv.commercetools.mapping.model.interactions.EnrolmentData
import isv.commercetools.mapping.transformer.auth.AuthorizationRequestTransformer
import isv.commercetools.mapping.transformer.response.ResponseTransformer
import isv.commercetools.reference.application.factory.payment.PaymentDetailsFactory
import isv.commercetools.reference.application.validation.ResourceValidator
import isv.payments.CybersourceClient
import isv.payments.exception.PaymentException
import isv.payments.model.CybersourceRequest
import org.slf4j.Logger
import spock.lang.Specification

import java.time.ZonedDateTime

class PaymentAuthorizationServiceSpecification extends Specification {

    AuthorizationRequestTransformer requestTransformerMock = Mock()
    ResponseTransformer responseTransformerMock = Mock()
    CybersourceClient cybersourceClientMock = Mock()
    ResourceValidator<CustomPayment> paymentValidatorMock = Mock()
    ResourceValidator<Cart> cartValidatorMock = Mock()
    EnrolmentData enrolmentDataMock = Mock()
    CustomPayment paymentMock = Mock()
    Payment basePaymentMock = Mock()
    PaymentDetails paymentDetailsMock = Mock()
    Cart cartMock = Mock()
    Logger loggerMock = Mock()
    PaymentDetailsFactory paymentDetailsFactoryMock = Mock()

    PaymentAuthorizationService testObj = new PaymentAuthorizationService(
            paymentDetailsFactoryMock,
            paymentValidatorMock,
            cartValidatorMock,
            requestTransformerMock,
            responseTransformerMock,
            cybersourceClientMock,
            loggerMock
    )

    def setup() {
        paymentMock.basePayment >> basePaymentMock
        paymentMock.enrolmentData >> enrolmentDataMock
        paymentMock.id >> 'payment_id'
    }

    def 'Should return an empty list if there is no Initial Auth transaction'() {
        given:
        basePaymentMock.transactions >> [
                mockTransaction(1, TransactionState.SUCCESS, TransactionType.AUTHORIZATION),
                mockTransaction(2, TransactionState.FAILURE, TransactionType.AUTHORIZATION),
                mockTransaction(3, TransactionState.PENDING, TransactionType.AUTHORIZATION),
                mockTransaction(4, TransactionState.INITIAL, TransactionType.CHARGE),
                mockTransaction(5, TransactionState.INITIAL, TransactionType.CHARGEBACK),
                mockTransaction(6, TransactionState.INITIAL, TransactionType.REFUND),
        ]

        when:
        def result = testObj.process(new PaymentDetails(paymentMock))

        then:
        0 * requestTransformerMock.transform(_)
        0 * cybersourceClientMock.makeRequest(_)

        and:
        result.isEmpty()

        and: 'message is logged'
        1 * loggerMock.error('PaymentAuthorizationService called for payment payment_id but payment had no AUTHORIZATION transaction')
    }

    def 'Should validate input'() {
        given:
        def paymentDetails = new PaymentDetails(paymentMock, cartMock)
        def paymentError = Mock(ExtensionError)
        def cartError = Mock(ExtensionError)

        when:
        def result = testObj.validate(paymentDetails)

        then:
        1 * paymentValidatorMock.validate(paymentMock) >> [paymentError]
        1 * cartValidatorMock.validate(cartMock) >> [cartError]
        result == [paymentError, cartError]
    }

    def 'Should return a list of actions on a successful authorization when #description'() {
        given:
        def requestMock = Mock(CybersourceRequest)
        def firstTransaction = mockTransaction(1)
        def secondTransaction = mockTransaction(2)
        basePaymentMock.transactions >> [firstTransaction, secondTransaction]

        and:
        requestTransformerMock.transform { it.customPayment == paymentMock && it.cart == cartMock } >> requestMock
        cybersourceClientMock.makeRequest(requestMock) >> [:]

        and:
        def transaction1Response = Mock(UpdateAction)
        1 * responseTransformerMock.transform(_ as Map, firstTransaction) >> [transaction1Response]
        0 * responseTransformerMock.transform(_ as Map, secondTransaction)

        when:
        def result = testObj.process(new PaymentDetails(paymentMock, cartMock))

        then:
        result.size() == 1
        result[0] == transaction1Response
    }

    def 'Should return an empty list if there is no transactions'() {
        given:
        basePaymentMock.transactions >> []

        when:
        def result = testObj.process(new PaymentDetails(paymentMock))

        then:
        0 * requestTransformerMock.transform(_)
        0 * cybersourceClientMock.makeRequest(_)

        and:
        result.isEmpty()
    }

    def 'Should return a failed transaction state action and an interface interaction action if there is an exception'() {
        given:
        def cybersourceRequestMock = Mock(CybersourceRequest)
        basePaymentMock.transactions >> [mockTransaction()]
        enrolmentDataMock.authorizationAllowed >> Optional.ofNullable(null)

        when:
        def result = testObj.process(new PaymentDetails(paymentMock))

        then:
        1 * requestTransformerMock.transform(_) >> cybersourceRequestMock
        1 * cybersourceClientMock.makeRequest(_) >> {
            throw new PaymentException(new Exception('someExceptionMessage'))
        }

        and:
        result.size() == 2
        def changeTransactionState = result.find { it instanceof ChangeTransactionState } as ChangeTransactionState
        changeTransactionState != null
        changeTransactionState.state == TransactionState.FAILURE
        changeTransactionState.transactionId == '123'

        def addInterfaceInteraction = result.find { it instanceof AddInterfaceInteraction } as AddInterfaceInteraction
        addInterfaceInteraction != null
        addInterfaceInteraction.type.key == 'cybersource_payment_failure'
        addInterfaceInteraction.fields.get('reason').asText() == 'java.lang.Exception: someExceptionMessage'

        and: 'message is logged'
        1 * loggerMock.error('Received PaymentException when trying to process transaction 123 on payment payment_id', _)
    }

    def 'Should only process one transaction'() {
        given:
        def cybersourceRequestMock = Mock(CybersourceRequest)
        def firstTransaction = mockTransaction(1)
        def secondTransaction = mockTransaction(2)
        basePaymentMock.transactions >> [firstTransaction, secondTransaction]
        def successfulResponse = [:]
        def successfulAction = Mock(UpdateAction)
        enrolmentDataMock.authorizationAllowed >> Optional.ofNullable(null)

        when:
        def result = testObj.process(new PaymentDetails(paymentMock))

        then:
        1 * requestTransformerMock.transform(_) >> cybersourceRequestMock
        1 * cybersourceClientMock.makeRequest(_) >> successfulResponse
        1 * responseTransformerMock.transform(successfulResponse, firstTransaction) >> [successfulAction]

        and:
        result.size() == 1

        result.find { it == successfulAction } != null
    }

    def 'should populate payment and cart on PaymentDetails'() {
        when:
        def result = testObj.populatePaymentDetails(paymentMock)

        then:
        1 * paymentDetailsFactoryMock.paymentDetailsWithCart(paymentMock) >> paymentDetailsMock

        and:
        result == paymentDetailsMock
    }

    private Transaction mockTransaction(
            Integer id = 123,
            TransactionState state = TransactionState.INITIAL,
            TransactionType type = TransactionType.AUTHORIZATION
    ) {
        def transactionMock = Mock(Transaction)
        transactionMock.id >> id
        transactionMock.state >> state
        transactionMock.type >> type
        transactionMock.timestamp >> ZonedDateTime.now()
        transactionMock
    }
}
