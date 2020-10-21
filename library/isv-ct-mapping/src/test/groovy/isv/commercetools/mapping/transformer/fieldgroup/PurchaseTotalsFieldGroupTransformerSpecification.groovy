package isv.commercetools.mapping.transformer.fieldgroup

import io.sphere.sdk.payments.Payment
import io.sphere.sdk.payments.Transaction
import io.sphere.sdk.payments.TransactionState
import io.sphere.sdk.utils.MoneyImpl
import isv.commercetools.mapping.model.CustomPayment
import isv.commercetools.mapping.model.PaymentDetails
import spock.lang.Specification

class PurchaseTotalsFieldGroupTransformerSpecification extends Specification {

    def testObj = new PurchaseTotalsFieldGroupTransformer()

    def 'should transform payment to purchase totals field group using payment amount'() {
        given: 'we have a payment'
        def ctPayment = Mock(Payment)
        ctPayment.amountPlanned >> MoneyImpl.of(10.05, 'GBP')
        ctPayment.transactions >> []

        def customPayment = new CustomPayment(ctPayment)
        def paymentDetails = new PaymentDetails(customPayment)

        when: 'we transform it'
        def result = testObj.configure(paymentDetails)

        then: 'it has the correct purchaseTotals values'
        result.size() == 1
        result[0].grandTotalAmount == 10.05
        result[0].currency == 'GBP'
    }

    def 'should transform payment to purchase totals field group using initial transaction amount'() {
        given: 'we have a payment'
        def ctPayment = Mock(Payment)
        def failedTransactionMock = Mock(Transaction)
        def successfulTransactionMock = Mock(Transaction)
        def initialTransactionMock = Mock(Transaction)
        failedTransactionMock.state >> TransactionState.FAILURE
        failedTransactionMock.amount >> MoneyImpl.of(12.34, 'GBP')
        successfulTransactionMock.state >> TransactionState.SUCCESS
        successfulTransactionMock.amount >> MoneyImpl.of(45.67, 'GBP')
        initialTransactionMock.state >> TransactionState.INITIAL
        initialTransactionMock.amount >> MoneyImpl.of(67.89, 'GBP')
        ctPayment.amountPlanned >> MoneyImpl.of(10.05, 'GBP')
        ctPayment.transactions >> [failedTransactionMock, successfulTransactionMock, initialTransactionMock]

        def customPayment = new CustomPayment(ctPayment)
        def paymentDetails = new PaymentDetails(customPayment)

        when: 'we transform it'
        def result = testObj.configure(paymentDetails)

        then: 'it has the correct purchaseTotals values'
        result.size() == 1
        result[0].grandTotalAmount == 67.89
        result[0].currency == 'GBP'
    }

}
