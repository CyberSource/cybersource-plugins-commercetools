package isv.commercetools.mapping.transformer.response

import io.sphere.sdk.payments.Transaction
import io.sphere.sdk.payments.commands.updateactions.SetCustomField
import spock.lang.Specification

class SubscriptionCreateResponseTransformerSpecification extends Specification {

    def testObj = new SubscriptionCreateResponseTransformer()

    Transaction transactionMock = Mock()

    def 'should return a SetCustomField update'() {
        given:
        def cybersourceResponse = [
                'paySubscriptionCreateReply_subscriptionID':'subscription id',
        ]

        when:
        def result = testObj.transform(cybersourceResponse, transactionMock)

        then:
        result.size() == 1
        def setCustomFieldUpdate = result.find { it instanceof SetCustomField } as SetCustomField
        setCustomFieldUpdate.name == 'cs_savedToken'
        setCustomFieldUpdate.value.textValue() == 'subscription id'
    }

    def 'should return no updates when there is no subscription create reply'() {
        given:
        def cybersourceResponse = [:]

        when:
        def result = testObj.transform(cybersourceResponse, transactionMock)

        then:
        result.size() == 0
    }

}
