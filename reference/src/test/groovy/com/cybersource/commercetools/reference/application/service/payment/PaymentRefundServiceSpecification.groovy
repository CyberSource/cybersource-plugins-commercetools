package com.cybersource.commercetools.reference.application.service.payment

import com.cybersource.commercetools.api.extension.model.ExtensionError
import com.cybersource.commercetools.mapping.model.CustomPayment
import com.cybersource.commercetools.mapping.model.PaymentDetails
import com.cybersource.commercetools.mapping.transformer.credit.CreditRequestTransformer
import com.cybersource.commercetools.mapping.transformer.response.ResponseTransformer
import com.cybersource.commercetools.reference.application.factory.payment.PaymentDetailsFactory
import com.cybersource.commercetools.reference.application.validation.ResourceValidator
import com.cybersource.payments.CybersourceClient
import com.cybersource.payments.exception.PaymentException
import com.cybersource.payments.model.CybersourceRequest
import io.sphere.sdk.commands.UpdateAction
import io.sphere.sdk.payments.Payment
import io.sphere.sdk.payments.Transaction
import io.sphere.sdk.payments.TransactionState
import io.sphere.sdk.payments.TransactionType
import io.sphere.sdk.payments.commands.updateactions.AddInterfaceInteraction
import io.sphere.sdk.payments.commands.updateactions.ChangeTransactionState
import org.slf4j.Logger
import spock.lang.Specification

class PaymentRefundServiceSpecification extends Specification {

    CustomPayment customPaymentMock
    Payment paymentMock
    Transaction transactionMock
    Logger loggerMock
    PaymentDetails paymentDetailsMock

    CreditRequestTransformer requestTransformerMock = Mock()
    CybersourceClient cybersourceClientMock = Mock()
    ResponseTransformer responseTransformerMock = Mock()
    ResourceValidator<CustomPayment> validatorMock = Mock()
    PaymentDetailsFactory paymentDetailsFactoryMock = Mock()

    def testObj

    def 'setup'() {
        customPaymentMock = Mock()
        paymentMock = Mock()
        transactionMock = Mock()
        loggerMock = Mock()
        paymentDetailsMock = Mock()

        testObj = new PaymentRefundService(paymentDetailsFactoryMock, validatorMock, requestTransformerMock, responseTransformerMock, cybersourceClientMock, loggerMock)

        customPaymentMock.id >> 'payment_id'
        customPaymentMock.basePayment >> paymentMock
        paymentMock.transactions >> [transactionMock]
    }

    def 'process should successfully create and send a request, and transform a response into a list of UpdateActions'() {
        given:
        transactionMock.type >> TransactionType.REFUND
        transactionMock.state >> TransactionState.INITIAL

        def cybersourceRequestMock = Mock(CybersourceRequest)
        def responseMock = ['some':'response']
        def updateActionMock = Mock(UpdateAction)
        def responseUpdateActions = [updateActionMock]

        when:
        def result = testObj.process(new PaymentDetails(customPaymentMock))

        then:
        1 * requestTransformerMock.transform { it.customPayment == customPaymentMock } >> cybersourceRequestMock
        1 * cybersourceClientMock.makeRequest(cybersourceRequestMock) >> responseMock
        1 * responseTransformerMock.transform(responseMock, transactionMock) >> responseUpdateActions

        and:
        result.size() == 1
        result[0] == updateActionMock
    }

    def 'process should return a list of failure UpdateActions if a PaymentException occurs'() {
        given:
        transactionMock.type >> TransactionType.REFUND
        transactionMock.state >> TransactionState.INITIAL
        transactionMock.id >> 'transaction_id'

        def cybersourceRequestMock = Mock(CybersourceRequest)

        when:
        def result = testObj.process(new PaymentDetails(customPaymentMock))

        then:
        1 * requestTransformerMock.transform { it.customPayment == customPaymentMock } >> cybersourceRequestMock
        1 * cybersourceClientMock.makeRequest(cybersourceRequestMock) >> {
            throw new PaymentException('some exception')
        }

        and:
        result.size() == 2

        def addInterfaceInteractionAction = (AddInterfaceInteraction) result.find {
            it instanceof AddInterfaceInteraction
        }
        addInterfaceInteractionAction.action == 'addInterfaceInteraction'
        addInterfaceInteractionAction.fields.get('reason').asText() == 'some exception'

        def changeTransactionStateAction = (ChangeTransactionState) result.find { it instanceof ChangeTransactionState }
        changeTransactionStateAction.action == 'changeTransactionState'
        changeTransactionStateAction.state == TransactionState.FAILURE

        and: 'message is logged'
        1 * loggerMock.error('Received PaymentException when trying to process transaction transaction_id on payment payment_id', _)
    }

    def 'Should validate input'() {
        given:
        def paymentDetails = new PaymentDetails(customPaymentMock)
        def paymentError = Mock(ExtensionError)

        when:
        def result = testObj.validate(paymentDetails)

        then:
        1 * validatorMock.validate(customPaymentMock) >> [paymentError]
        result == [paymentError]
    }

    def 'should log error when no transaction found to process'() {
        given:
        transactionMock.type >> TransactionType.REFUND
        transactionMock.state >> TransactionState.SUCCESS

        when:
        def result = testObj.process(new PaymentDetails(customPaymentMock))

        then:
        0 * requestTransformerMock.transform(_)
        0 * cybersourceClientMock.makeRequest(_)

        and:
        result.isEmpty()

        and:
        1 * loggerMock.error('PaymentRefundService called for payment payment_id but payment had no REFUND transaction')
    }

    def 'should populate payment only on PaymentDetails'() {
        when:
        def result = testObj.populatePaymentDetails(customPaymentMock)

        then:
        1 * paymentDetailsFactoryMock.paymentDetailsWithoutCart(customPaymentMock) >> paymentDetailsMock

        and:
        result == paymentDetailsMock
    }
}
