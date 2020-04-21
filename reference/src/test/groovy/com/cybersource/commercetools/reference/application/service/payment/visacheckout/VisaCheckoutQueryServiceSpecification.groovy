package com.cybersource.commercetools.reference.application.service.payment.visacheckout

import com.cybersource.commercetools.mapping.model.PaymentDetails
import com.cybersource.commercetools.mapping.transformer.RequestTransformer
import com.cybersource.payments.CybersourceClient
import com.cybersource.payments.exception.PaymentException
import com.cybersource.payments.model.CybersourceRequest
import spock.lang.Specification

class VisaCheckoutQueryServiceSpecification extends Specification {

    VisaCheckoutQueryService testObj

    RequestTransformer visaCheckoutDataRequestTransformerMock
    CybersourceClient cybersourceClient
    PaymentDetails paymentDetailsMock
    CybersourceRequest csRequestMock

    def 'setup'() {
        visaCheckoutDataRequestTransformerMock = Mock()
        cybersourceClient = Mock()
        paymentDetailsMock = Mock()
        testObj = new VisaCheckoutQueryService(visaCheckoutDataRequestTransformerMock, cybersourceClient)
    }

    def 'Should query cybersource, returning the values in a map'() {
        given:
        visaCheckoutDataRequestTransformerMock.transform(paymentDetailsMock) >> csRequestMock
        def responseMap = [
                'test':'testValue',
                'card_something':'someCardValue',
                'card_somethingElse':'someOtherValue',
                'shipTo_something':'something',
        ]
        cybersourceClient.makeRequest(csRequestMock) >> responseMap
        when:
        def result = testObj.getVisaCheckoutData(paymentDetailsMock)
        then:
        result == responseMap
    }

    def 'Should throw any PaymentException raised by the CybersourceClient'() {
        given:
        PaymentDetails paymentDetailsMock = Mock()
        visaCheckoutDataRequestTransformerMock.transform(paymentDetailsMock) >> Mock(CybersourceRequest)
        cybersourceClient.makeRequest(_) >> { throw new PaymentException('blah') }

        when:
        testObj.getVisaCheckoutData(paymentDetailsMock)

        then:
        thrown PaymentException
    }
}
