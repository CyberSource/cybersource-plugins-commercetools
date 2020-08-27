package isv.commercetools.mapping.transformer.response

import io.sphere.sdk.commands.UpdateAction
import io.sphere.sdk.payments.Transaction
import spock.lang.Specification

class CompositeResponseTransformerSpecification extends Specification {

    ResponseTransformer responseTransformerMock1 = Mock()
    ResponseTransformer responseTransformerMock2 = Mock()
    ResponseTransformer responseTransformerMock3 = Mock()

    Map<String,String> cybersourceResponseMock = Mock()
    Transaction authTransactionMock = Mock()
    UpdateAction updateActionMock1 = Mock()
    UpdateAction updateActionMock2 = Mock()
    UpdateAction updateActionMock3 = Mock()

    def 'should return merged list of actions'() {
        given:
        responseTransformerMock1.transform(cybersourceResponseMock, authTransactionMock) >> [updateActionMock1]
        responseTransformerMock2.transform(cybersourceResponseMock, authTransactionMock) >> []
        responseTransformerMock3.transform(cybersourceResponseMock, authTransactionMock) >> [updateActionMock2, updateActionMock3]

        def testObj = new CompositeResponseTransformer(responseTransformerMock1, responseTransformerMock2, responseTransformerMock3)

        when:
        def result = testObj.transform(cybersourceResponseMock, authTransactionMock)

        then:
        result.size() == 3
        result == [updateActionMock1, updateActionMock2, updateActionMock3]
    }

}
