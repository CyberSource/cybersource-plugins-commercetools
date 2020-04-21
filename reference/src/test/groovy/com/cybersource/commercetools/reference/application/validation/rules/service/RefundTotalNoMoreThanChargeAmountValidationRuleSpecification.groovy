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

class RefundTotalNoMoreThanChargeAmountValidationRuleSpecification extends Specification {

    RefundTotalNoMoreThanChargeAmountValidationRule testObj

    CustomPayment paymentMock = Mock()
    Payment basePaymentMock = Mock()
    Transaction chargeTransactionMock = Mock()
    Transaction successRefundTransactionMock = Mock()
    Transaction initialRefundTransactionMock = Mock()

    def setup() {
        testObj = new RefundTotalNoMoreThanChargeAmountValidationRule(SphereJsonUtils.newObjectMapper())

        paymentMock.basePayment >> basePaymentMock

        chargeTransactionMock.type >> TransactionType.CHARGE
        successRefundTransactionMock.type >> TransactionType.REFUND
        successRefundTransactionMock.state >> TransactionState.SUCCESS
        initialRefundTransactionMock.type >> TransactionType.REFUND
        initialRefundTransactionMock.state >> TransactionState.INITIAL
    }

    def 'should not error when no charge transaction present'() {
        given:
        basePaymentMock.transactions >> [initialRefundTransactionMock]
        initialRefundTransactionMock.amount >> MoneyImpl.of('12.34', 'GBP')

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.isEmpty()
    }

    @Unroll
    def 'should not error when no successful charge transaction present'() {
        given:
        chargeTransactionMock.state >> state
        basePaymentMock.transactions >> [chargeTransactionMock, initialRefundTransactionMock]
        initialRefundTransactionMock.amount >> MoneyImpl.of('12.34', 'GBP')

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.isEmpty()

        where:
        state << [TransactionState.INITIAL, TransactionState.FAILURE, TransactionState.PENDING]
    }

    def 'should not error when refund less than charge'() {
        given:
        chargeTransactionMock.state >> TransactionState.SUCCESS
        basePaymentMock.transactions >> [chargeTransactionMock, successRefundTransactionMock, initialRefundTransactionMock]
        chargeTransactionMock.amount >> MoneyImpl.of('4', 'GBP')
        successRefundTransactionMock.amount >> MoneyImpl.of('3', 'GBP')
        initialRefundTransactionMock.amount >> MoneyImpl.of('0.99', 'GBP')

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.isEmpty()
    }

    def 'should not error when refund same as charge'() {
        given:
        chargeTransactionMock.state >> TransactionState.SUCCESS
        basePaymentMock.transactions >> [chargeTransactionMock, successRefundTransactionMock, initialRefundTransactionMock]
        chargeTransactionMock.amount >> MoneyImpl.of('4', 'GBP')
        successRefundTransactionMock.amount >> MoneyImpl.of('3', 'GBP')
        initialRefundTransactionMock.amount >> MoneyImpl.of('1', 'GBP')

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.isEmpty()
    }

    def 'should error when refund more than charge'() {
        given:
        chargeTransactionMock.state >> TransactionState.SUCCESS
        basePaymentMock.transactions >> [chargeTransactionMock, successRefundTransactionMock, initialRefundTransactionMock]
        chargeTransactionMock.amount >> MoneyImpl.of('4', 'GBP')
        successRefundTransactionMock.amount >> MoneyImpl.of('3', 'GBP')
        initialRefundTransactionMock.amount >> MoneyImpl.of('1.01', 'GBP')

        when:
        def result = testObj.validate(paymentMock)

        then:
        result.size() == 1
        result.get(0).code == ErrorCode.INVALID_INPUT
        result.get(0).message == 'Sum of refunds exceeds charge'
    }

}
