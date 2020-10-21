package isv.commercetools.mapping.transformer.response

import io.sphere.sdk.commands.UpdateAction
import io.sphere.sdk.payments.Transaction
import spock.lang.Specification

class CompositeResponseTransformerSpecification extends Specification {

    ResponseTransformer responseTransformerMock1 = Mock()
    ResponseTransformer responseTransformerMock2 = Mock()
    ResponseTransformer responseTransformerMock3 = Mock()

    Map<String,String> paymentServiceResponseMock = Mock()
    Transaction authTransactionMock = Mock()
    UpdateAction updateActionMock1 = Mock()
    UpdateAction updateActionMock2 = Mock()
    UpdateAction updateActionMock3 = Mock()

    def 'should return merged list of actions'() {
        given:
        responseTransformerMock1.transform(paymentServiceResponseMock, authTransactionMock) >> [updateActionMock1]
        responseTransformerMock2.transform(paymentServiceResponseMock, authTransactionMock) >> []
        responseTransformerMock3.transform(paymentServiceResponseMock, authTransactionMock) >> [updateActionMock2, updateActionMock3]

        def testObj = new CompositeResponseTransformer(responseTransformerMock1, responseTransformerMock2, responseTransformerMock3)

        when:
        def result = testObj.transform(paymentServiceResponseMock, authTransactionMock)

        then:
        result.size() == 3
        result == [updateActionMock1, updateActionMock2, updateActionMock3]
    }

}
