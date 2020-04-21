package com.cybersource.commercetools.mapping.transformer.fieldgroup

import com.cybersource.commercetools.mapping.model.PaymentDetails
import com.cybersource.commercetools.mapping.model.CustomPayment
import io.sphere.sdk.payments.Payment
import io.sphere.sdk.payments.Transaction
import io.sphere.sdk.payments.TransactionState
import io.sphere.sdk.payments.TransactionType
import spock.lang.Specification

class AuthReversalServiceFieldGroupTransformerSpecification extends Specification {

    AuthReversalServiceFieldGroupTransformer testObj

    def 'setup'() {
        testObj = new AuthReversalServiceFieldGroupTransformer()
    }

    def 'Should set fields correctly'() {
        given:
        def authTransactionMock = Mock(Transaction)
        authTransactionMock.state >> TransactionState.SUCCESS
        authTransactionMock.type >> TransactionType.AUTHORIZATION
        authTransactionMock.interactionId >> '123'

        def paymentMock = Mock(Payment)
        def customPaymentMock = Mock(CustomPayment)

        paymentMock.transactions >> [authTransactionMock]
        customPaymentMock.basePayment >> paymentMock

        def paymentDetails = new PaymentDetails(customPaymentMock)

        when:
        def result = testObj.configure(paymentDetails)

        then:
        result[0].fieldGroupPrefix == 'ccAuthReversalService_'
        result[0].authRequestID == '123'
        result[0].run
    }
}
