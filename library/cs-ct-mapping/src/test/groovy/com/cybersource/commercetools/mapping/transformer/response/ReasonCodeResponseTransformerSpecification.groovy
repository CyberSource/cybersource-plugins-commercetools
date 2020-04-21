package com.cybersource.commercetools.mapping.transformer.response

import io.sphere.sdk.payments.Transaction
import io.sphere.sdk.payments.TransactionState
import io.sphere.sdk.payments.commands.updateactions.AddInterfaceInteraction
import io.sphere.sdk.payments.commands.updateactions.ChangeTransactionInteractionId
import io.sphere.sdk.payments.commands.updateactions.ChangeTransactionState
import spock.lang.Specification
import spock.lang.Unroll

class ReasonCodeResponseTransformerSpecification extends Specification {

    def testObj = new ReasonCodeResponseTransformer()

    @Unroll
    def 'Should return a ChangeTransactionState transaction with state #state when Cybersource returns reason code #reasonCode'() {
        given:
        def transactionMock = Mock(Transaction)
        transactionMock.id >> 'someTransactionId'

        and:
        def cybersourceResponse = [
                'reasonCode':reasonCode,
                'requestID':'123',
        ]

        when:
        def result = testObj.transform(cybersourceResponse, transactionMock)

        then:
        result.size() == 2
        def changeTransactionState = result.find { it instanceof ChangeTransactionState } as ChangeTransactionState
        changeTransactionState.transactionId == 'someTransactionId'
        changeTransactionState.state == state

        def changeTransactionInteractionId = result.find {
            it instanceof ChangeTransactionInteractionId
        } as ChangeTransactionInteractionId
        changeTransactionInteractionId.interactionId == '123'
        changeTransactionInteractionId.transactionId == 'someTransactionId'

        where:
        reasonCode | state
        '100'      | TransactionState.SUCCESS
        '480'      | TransactionState.PENDING
    }

    @Unroll
    def 'Should return an extra addInterfaceInteraction action when Cybersource returns a failure reason code (#reasonCode)'() {
        given:
        def transactionMock = Mock(Transaction)
        transactionMock.id >> 'someTransactionId'

        and:
        def cybersourceResponse = [
                'reasonCode':reasonCode,
                'requestID':'123',
        ]

        when:
        def result = testObj.transform(cybersourceResponse, transactionMock)

        then:
        result.size() == 3
        def changeTransactionState = result.find { it instanceof ChangeTransactionState } as ChangeTransactionState
        changeTransactionState.transactionId == 'someTransactionId'
        changeTransactionState.state == state

        def changeTransactionInteractionId = result.find {
            it instanceof ChangeTransactionInteractionId
        } as ChangeTransactionInteractionId
        changeTransactionInteractionId.interactionId == '123'
        changeTransactionInteractionId.transactionId == 'someTransactionId'

        def addInterfaceInteraction = result.find {
            it instanceof AddInterfaceInteraction
        } as AddInterfaceInteraction
        addInterfaceInteraction.type.key == 'cybersource_payment_failure'
        addInterfaceInteraction.fields.get('reasonCode').textValue() == reasonCode
        addInterfaceInteraction.fields.get('transactionId').textValue() == 'someTransactionId'

        where:
        reasonCode | state
        '101'      | TransactionState.FAILURE
        '201'      | TransactionState.FAILURE
        '301'      | TransactionState.FAILURE
        '701'      | TransactionState.FAILURE
    }

}
