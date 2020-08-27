package isv.commercetools.mapping.transformer.transaction

import io.sphere.sdk.payments.TransactionState
import spock.lang.Specification

class StateTransformerSpecification extends Specification {

    def 'should return #state when reasonCode is #reasonCode'() {
        when:
        def state = StateTransformer.mapCSReasonCodeToCTTransactionState(reasonCode)

        then:
        expectedState == state

        where:
        expectedState            | reasonCode
        TransactionState.SUCCESS | '100'
        TransactionState.FAILURE | '84'
        TransactionState.PENDING | '480'
    }
}
