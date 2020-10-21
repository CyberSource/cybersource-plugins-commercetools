package isv.commercetools.mapping.transformer.response

import io.sphere.sdk.payments.Transaction
import io.sphere.sdk.payments.commands.updateactions.SetCustomField
import spock.lang.Specification

class SubscriptionCreateResponseTransformerSpecification extends Specification {

    def testObj = new SubscriptionCreateResponseTransformer()

    Transaction transactionMock = Mock()

    def 'should return a SetCustomField update'() {
        given:
        def paymentServiceResponse = [
                'paySubscriptionCreateReply_subscriptionID':'subscription id',
        ]

        when:
        def result = testObj.transform(paymentServiceResponse, transactionMock)

        then:
        result.size() == 1
        def setCustomFieldUpdate = result.find { it instanceof SetCustomField } as SetCustomField
        setCustomFieldUpdate.name == 'isv_savedToken'
        setCustomFieldUpdate.value.textValue() == 'subscription id'
    }

    def 'should return no updates when there is no subscription create reply'() {
        given:
        def paymentServiceResponse = [:]

        when:
        def result = testObj.transform(paymentServiceResponse, transactionMock)

        then:
        result.size() == 0
    }

}
