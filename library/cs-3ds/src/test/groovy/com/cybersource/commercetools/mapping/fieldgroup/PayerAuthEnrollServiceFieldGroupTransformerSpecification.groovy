package com.cybersource.commercetools.mapping.fieldgroup

import com.cybersource.cardinal.service.CardinalService
import com.cybersource.commercetools.mapping.model.PaymentDetails
import com.cybersource.commercetools.mapping.model.CustomPayment
import spock.lang.Specification

class PayerAuthEnrollServiceFieldGroupTransformerSpecification extends Specification {

    PayerAuthEnrollServiceFieldGroupTransformer testObj

    CardinalService cardinalServiceMock = Mock()
    CustomPayment paymentMock = Mock()

    def setup() {
        paymentMock.payerAuthenticationRequestJwt >> 'request jwt'
        paymentMock.payerAuthenticationAcceptHeader >> 'accept header value'
        paymentMock.payerAuthenticationUserAgentHeader >> 'user agent header value'
        cardinalServiceMock.validateJWTAndExtractReferenceId('request jwt') >> 'request reference id'
    }

    def 'should configure field groups for ecommerce order'() {
        given:
        testObj = PayerAuthEnrollServiceFieldGroupTransformer.forECommerceOrder(cardinalServiceMock)

        when:
        def result = testObj.configure(new PaymentDetails(paymentMock))

        then:
        result.size() == 1
        result[0].run == true
        result[0].referenceID == 'request reference id'
        result[0].httpAccept == 'accept header value'
        result[0].httpUserAgent == 'user agent header value'
        result[0].transactionMode == 'S'
    }

    def 'should configure field groups for moto order'() {
        given:
        testObj = PayerAuthEnrollServiceFieldGroupTransformer.forMotoOrder(cardinalServiceMock)

        when:
        def result = testObj.configure(new PaymentDetails(paymentMock))

        then:
        result.size() == 1
        result[0].run == true
        result[0].referenceID == 'request reference id'
        result[0].httpAccept == 'accept header value'
        result[0].httpUserAgent == 'user agent header value'
        result[0].transactionMode == 'M'
    }

    def 'should configure field groups for retail order'() {
        given:
        testObj = PayerAuthEnrollServiceFieldGroupTransformer.forRetailOrder(cardinalServiceMock)

        when:
        def result = testObj.configure(new PaymentDetails(paymentMock))

        then:
        result.size() == 1
        result[0].run == true
        result[0].referenceID == 'request reference id'
        result[0].httpAccept == 'accept header value'
        result[0].httpUserAgent == 'user agent header value'
        result[0].transactionMode == 'R'
    }

    def 'should configure field groups for mobile order'() {
        given:
        testObj = PayerAuthEnrollServiceFieldGroupTransformer.forMobileOrder(cardinalServiceMock)

        when:
        def result = testObj.configure(new PaymentDetails(paymentMock))

        then:
        result.size() == 1
        result[0].run == true
        result[0].referenceID == 'request reference id'
        result[0].httpAccept == 'accept header value'
        result[0].httpUserAgent == 'user agent header value'
        result[0].transactionMode == 'P'
    }

    def 'should configure field groups for tablet order'() {
        given:
        testObj = PayerAuthEnrollServiceFieldGroupTransformer.forTabletOrder(cardinalServiceMock)

        when:
        def result = testObj.configure(new PaymentDetails(paymentMock))

        then:
        result.size() == 1
        result[0].run == true
        result[0].referenceID == 'request reference id'
        result[0].httpAccept == 'accept header value'
        result[0].httpUserAgent == 'user agent header value'
        result[0].transactionMode == 'T'
    }

}
