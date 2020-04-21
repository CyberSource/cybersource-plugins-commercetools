package com.cybersource.commercetools.reference.application.validation.rules.service

import com.cybersource.commercetools.api.extension.model.ErrorCode
import com.cybersource.commercetools.mapping.model.CustomPayment
import io.sphere.sdk.json.SphereJsonUtils
import io.sphere.sdk.payments.Payment
import io.sphere.sdk.payments.Transaction
import io.sphere.sdk.payments.TransactionState
import io.sphere.sdk.payments.TransactionType
import io.sphere.sdk.utils.MoneyImpl
import spock.lang.Specification
import spock.lang.Unroll

class CancelAuthAmountEqualsAuthAmountValidationRuleSpecification extends Specification {

    CancelAuthAmountEqualsAuthAmountValidationRule testObj

    CustomPayment paymentMock = Mock()
    Payment basePaymentMock = Mock()
    Transaction authTransactionMock = Mock()
    Transaction cancelAuthTransactionMock = Mock()

    def setup() {
        testObj = new CancelAuthAmountEqualsAuthAmountValidationRule(SphereJsonUtils.newObjectMapper())

        paymentMock.basePayment >> basePaymentMock

        authTransactionMock.type >> TransactionType.AUTHORIZATION
        authTransactionMock.state >> TransactionState.SUCCESS
        cancelAuthTransactionMock.type >> TransactionType.CANCEL_AUTHORIZATION
        cancelAuthTransactionMock.state >> TransactionState.INITIAL
    }

    def 'should not error when no auth transaction present'() {
        given:
        basePaymentMock.transactions >> [cancelAuthTransactionMock]
        cancelAuthTransactionMock.amount >> MoneyImpl.of('12.34', 'GBP')

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.isEmpty()
    }

    def 'should not error when cancel auth amount matches auth amount'() {
        given:
        basePaymentMock.transactions >> [authTransactionMock, cancelAuthTransactionMock]
        authTransactionMock.amount >> MoneyImpl.of('1', 'GBP')
        cancelAuthTransactionMock.amount >> MoneyImpl.of('1', 'GBP')

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.isEmpty()
    }

    @Unroll
    def 'should error when #description'() {
        given:
        basePaymentMock.transactions >> [authTransactionMock, cancelAuthTransactionMock]
        authTransactionMock.amount >> MoneyImpl.of('1', 'GBP')
        cancelAuthTransactionMock.amount >> cancelAuthAmount

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.size() == 1
        result.get(0).code == ErrorCode.INVALID_INPUT
        result.get(0).message == 'Cancel Authorization amount does not equal Authorization amount'

        where:
        description                      | cancelAuthAmount
        'cancel auth amount more than auth' | MoneyImpl.of('1.01', 'GBP')
        'cancel auth amount less than auth' | MoneyImpl.of('0.99', 'GBP')
    }

}
