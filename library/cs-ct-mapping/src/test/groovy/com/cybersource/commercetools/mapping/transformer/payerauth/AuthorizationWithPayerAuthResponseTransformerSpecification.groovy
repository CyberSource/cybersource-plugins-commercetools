package com.cybersource.commercetools.mapping.transformer.payerauth

import com.cybersource.commercetools.mapping.transformer.response.ReasonCodeResponseTransformer
import io.sphere.sdk.commands.UpdateAction
import io.sphere.sdk.payments.Transaction
import spock.lang.Specification

class AuthorizationWithPayerAuthResponseTransformerSpecification extends Specification {

    AuthorizationWithPayerAuthResponseTransformer testObj

    ReasonCodeResponseTransformer authorizationResponseTransformerMock = Mock()
    PayerAuthValidateResponseTransformer payerAuthValidateResponseTransformerMock = Mock()

    Transaction transactionMock = Mock()
    UpdateAction actionMock1
    UpdateAction actionMock2
    UpdateAction actionMock3

    def setup() {
        testObj = new AuthorizationWithPayerAuthResponseTransformer(authorizationResponseTransformerMock, payerAuthValidateResponseTransformerMock)
    }

    def 'should include actions from component transformers'() {
        given:
        def cybersourceResponse = [:]
        1 * authorizationResponseTransformerMock.transform(cybersourceResponse, transactionMock) >> [actionMock1]
        1 * payerAuthValidateResponseTransformerMock.transform(cybersourceResponse) >> [actionMock2, actionMock3]

        when:
        def result = testObj.transform(cybersourceResponse, transactionMock)

        then:
        result == [actionMock1, actionMock2, actionMock3]
    }

}
