package com.cybersource.commercetools.mapping.transformer.fieldgroup

import com.cybersource.commercetools.mapping.model.PaymentDetails
import com.cybersource.commercetools.mapping.model.CustomPayment
import io.sphere.sdk.payments.Payment
import io.sphere.sdk.payments.Transaction
import io.sphere.sdk.payments.TransactionState
import io.sphere.sdk.payments.TransactionType
import spock.lang.Specification

class CaptureServiceFieldGroupTransformerSpecification extends Specification {

    def testObj = new CaptureServiceFieldGroupTransformer()

    def 'Should create a capture service field group'() {
        given:
        def customPayment = Mock(CustomPayment)
        def paymentDetails = new PaymentDetails(customPayment)
        def payment = Mock(Payment)
        customPayment.basePayment >> payment
        def transactionMock = Mock(Transaction)
        transactionMock.state >> TransactionState.SUCCESS
        transactionMock.type >> TransactionType.AUTHORIZATION
        transactionMock.interactionId >> 'someAuthId'
        payment.transactions >> [transactionMock]

        when:
        def result = testObj.configure(paymentDetails)

        then:
        result.size() == 1
        result[0].run
        result[0].fieldGroupPrefix == 'ccCaptureService_'
        result[0].authRequestID == 'someAuthId'
    }
}
