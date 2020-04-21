package com.cybersource.commercetools.reference.application.validation.rules.controller

import com.cybersource.commercetools.api.extension.model.ErrorCode
import com.cybersource.commercetools.mapping.model.CustomPayment
import com.fasterxml.jackson.databind.ObjectMapper
import io.sphere.sdk.payments.Payment
import io.sphere.sdk.payments.Transaction
import io.sphere.sdk.payments.TransactionState
import spock.lang.Specification

class MultipleInitialTransactionsValidationRuleSpecification extends Specification {

    MultipleInitialTransactionsValidationRule testObj

    CustomPayment paymentMock
    Payment basePaymentMock
    Transaction initialTransaction
    Transaction successTransaction

    def 'setup'() {
        testObj = new MultipleInitialTransactionsValidationRule(Mock(ObjectMapper))
        paymentMock = Mock()
        basePaymentMock = Mock()
        initialTransaction = Mock()
        initialTransaction.state >> TransactionState.INITIAL
        successTransaction = Mock()
        successTransaction.state >> TransactionState.SUCCESS
        paymentMock.basePayment >> basePaymentMock
    }

    def 'Should return a validation error if multiple INITIAL transactions exist'() {
        given:
        basePaymentMock.transactions >> [initialTransaction, initialTransaction]

        when:
        def result = testObj.validate(paymentMock)
        then:
        result.size() == 1
        result[0].code == ErrorCode.INVALID_INPUT
        result[0].message == 'Cannot process this payment as it has multiple transactions with Initial state'
    }

    def 'Should not return a validation error if only one transactions exist'() {
        given:
        basePaymentMock.transactions >> [initialTransaction, successTransaction]

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.size() == 0
    }

    def 'Should not return a validation error if only success transactions exist'() {
        given:
        basePaymentMock.transactions >> [successTransaction, successTransaction]

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.size() == 0
    }

    def 'Should not return a validation error if no transactions exist'() {
        given:
        basePaymentMock.transactions >> []

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.size() == 0
    }

}
