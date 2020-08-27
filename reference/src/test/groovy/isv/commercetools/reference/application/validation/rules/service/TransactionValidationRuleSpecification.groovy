package isv.commercetools.reference.application.validation.rules.service

import io.sphere.sdk.json.SphereJsonUtils
import io.sphere.sdk.payments.Payment
import io.sphere.sdk.payments.Transaction
import io.sphere.sdk.payments.TransactionState
import io.sphere.sdk.payments.TransactionType
import isv.commercetools.api.extension.model.ErrorCode
import isv.commercetools.mapping.model.CustomPayment
import spock.lang.Specification
import spock.lang.Unroll

class TransactionValidationRuleSpecification extends Specification {

    CustomPayment customPaymentMock
    Payment paymentMock
    Transaction transactionMock

    TransactionValidationRule testObj

    def setup() {
        customPaymentMock = Mock()
        transactionMock = Mock()
        paymentMock = Mock()
        customPaymentMock.basePayment >> paymentMock
    }

    @Unroll
    def 'validate should return an error if expected rule does not exist (payment contains #desc)'() {
        given:
        testObj = TransactionValidationRule.expectTransactionValidationRule(SphereJsonUtils.newObjectMapper(), TransactionState.INITIAL, TransactionType.CHARGE)
        transactionMock.interactionId >> null
        transactionMock.type >> type
        transactionMock.state >> state
        paymentMock.transactions >> [transactionMock]

        when:
        def result = testObj.validate(customPaymentMock)

        then:
        result.size() == 1
        result.get(0).code == ErrorCode.INVALID_INPUT
        result.get(0).message == 'Cannot process this payment as no INITIAL CHARGE transaction exists'

        where:
        desc                    | type                          | state
        'Initial Authorization' | TransactionType.AUTHORIZATION | TransactionState.INITIAL
        'Success Charge'        | TransactionType.CHARGE        | TransactionState.SUCCESS
        'Success Authorization' | TransactionType.AUTHORIZATION | TransactionState.SUCCESS
    }

    def 'validate should return an error if unexpected rule exists'() {
        given:
        testObj = TransactionValidationRule.doNotExpectTransactionValidationRule(SphereJsonUtils.newObjectMapper(), TransactionState.SUCCESS, TransactionType.CHARGE)
        transactionMock.interactionId >> null
        transactionMock.type >> TransactionType.CHARGE
        transactionMock.state >> TransactionState.SUCCESS
        paymentMock.transactions >> [transactionMock]

        when:
        def result = testObj.validate(customPaymentMock)

        then:
        result.size() == 1
        result.get(0).code == ErrorCode.INVALID_INPUT
        result.get(0).message == 'Cannot process this payment as SUCCESS CHARGE transaction exists'
    }

    def 'validate should not return an error if expected rule exists'() {
        given:
        testObj = TransactionValidationRule.expectTransactionValidationRule(SphereJsonUtils.newObjectMapper(), TransactionState.INITIAL, TransactionType.CHARGE)
        transactionMock.interactionId >> null
        transactionMock.type >> TransactionType.CHARGE
        transactionMock.state >> TransactionState.INITIAL
        paymentMock.transactions >> [transactionMock]

        when:
        def result = testObj.validate(customPaymentMock)

        then:
        result.isEmpty()
    }

    @Unroll
    def 'validate should not return an error if no un expected rule exists (payment contains #desc)'() {
        given:
        testObj = TransactionValidationRule.doNotExpectTransactionValidationRule(SphereJsonUtils.newObjectMapper(), TransactionState.SUCCESS, TransactionType.REFUND)
        transactionMock.interactionId >> null
        transactionMock.type >> type
        transactionMock.state >> state
        paymentMock.transactions >> [transactionMock]

        when:
        def result = testObj.validate(customPaymentMock)

        then:
        result.isEmpty()

        where:
        desc                    | type                          | state
        'Initial Authorization' | TransactionType.AUTHORIZATION | TransactionState.INITIAL
        'Success Charge'        | TransactionType.CHARGE        | TransactionState.SUCCESS
        'Success Authorization' | TransactionType.AUTHORIZATION | TransactionState.SUCCESS
    }

}
