package isv.commercetools.reference.application.service.payment.visacheckout

import isv.commercetools.mapping.model.PaymentDetails
import isv.commercetools.mapping.transformer.RequestTransformer
import isv.payments.PaymentServiceClient
import isv.payments.exception.PaymentException
import isv.payments.model.PaymentServiceRequest
import spock.lang.Specification

class VisaCheckoutQueryServiceSpecification extends Specification {

    VisaCheckoutQueryService testObj

    RequestTransformer visaCheckoutDataRequestTransformerMock
    PaymentServiceClient paymentServiceClient
    PaymentDetails paymentDetailsMock
    PaymentServiceRequest paymentServiceRequestMock

    def 'setup'() {
        visaCheckoutDataRequestTransformerMock = Mock()
        paymentServiceClient = Mock()
        paymentDetailsMock = Mock()
        testObj = new VisaCheckoutQueryService(visaCheckoutDataRequestTransformerMock, paymentServiceClient)
    }

    def 'Should query payment service, returning the values in a map'() {
        given:
        visaCheckoutDataRequestTransformerMock.transform(paymentDetailsMock) >> paymentServiceRequestMock
        def responseMap = [
                'test':'testValue',
                'card_something':'someCardValue',
                'card_somethingElse':'someOtherValue',
                'shipTo_something':'something',
        ]
        paymentServiceClient.makeRequest(paymentServiceRequestMock) >> responseMap
        when:
        def result = testObj.getVisaCheckoutData(paymentDetailsMock)
        then:
        result == responseMap
    }

    def 'Should throw any PaymentException raised by the paymentServiceClient'() {
        given:
        PaymentDetails paymentDetailsMock = Mock()
        visaCheckoutDataRequestTransformerMock.transform(paymentDetailsMock) >> Mock(PaymentServiceRequest)
        paymentServiceClient.makeRequest(_) >> { throw new PaymentException('blah') }

        when:
        testObj.getVisaCheckoutData(paymentDetailsMock)

        then:
        thrown PaymentException
    }
}
