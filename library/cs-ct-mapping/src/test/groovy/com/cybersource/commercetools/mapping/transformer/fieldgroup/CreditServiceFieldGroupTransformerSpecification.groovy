package com.cybersource.commercetools.mapping.transformer.fieldgroup

import com.cybersource.commercetools.mapping.model.PaymentDetails
import com.cybersource.commercetools.mapping.model.CustomPayment
import io.sphere.sdk.payments.Payment
import io.sphere.sdk.payments.Transaction
import io.sphere.sdk.payments.TransactionState
import io.sphere.sdk.payments.TransactionType
import spock.lang.Specification

class CreditServiceFieldGroupTransformerSpecification extends Specification {

    CreditServiceFieldGroupTransformer testObj

    def 'setup'() {
        testObj = new CreditServiceFieldGroupTransformer()
    }

    def 'Should set fields correctly'() {
        given:
        def captureTransactionMock = Mock(Transaction)
        captureTransactionMock.state >> TransactionState.SUCCESS
        captureTransactionMock.type >> TransactionType.CHARGE
        captureTransactionMock.interactionId >> '123'

        def paymentMock = Mock(Payment)
        def customPaymentMock = Mock(CustomPayment)

        paymentMock.transactions >> [captureTransactionMock]
        customPaymentMock.basePayment >> paymentMock

        def paymentDetails = new PaymentDetails(customPaymentMock)

        when:
        def result = testObj.configure(paymentDetails)

        then:
        result[0].fieldGroupPrefix == 'ccCreditService_'
        result[0].captureRequestID == '123'
        result[0].run
    }
}
