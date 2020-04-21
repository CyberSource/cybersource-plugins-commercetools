package com.cybersource.commercetools.reference.application.config

import com.cybersource.commercetools.mapping.model.CybersourceIds
import com.cybersource.commercetools.reference.application.factory.payment.PaymentDetailsFactory
import com.cybersource.commercetools.reference.application.service.payment.PaymentService
import com.cybersource.commercetools.reference.application.service.payment.visacheckout.VisaCheckoutAuthorizationService
import com.cybersource.payments.CybersourceClient
import com.fasterxml.jackson.databind.ObjectMapper
import io.sphere.sdk.client.SphereClient
import spock.lang.Specification

class PaymentUpdateAuthServiceConfigurationSpecification extends Specification {

    PaymentUpdateAuthServiceConfiguration testObj

    def setup() {
        testObj = new PaymentUpdateAuthServiceConfiguration()
    }

    def 'should create configuration for update payment services'() {
        given:
        def paymentWithoutPayerAuthAuthorizationServiceMock = Mock(PaymentService)
        def paymentWithPayerAuthAuthorizationServiceMock = Mock(PaymentService)
        def visaCheckoutAuthServiceMock = Mock(PaymentService)

        when:
        def result = testObj.paymentUpdateAuthServiceMap(
                paymentWithoutPayerAuthAuthorizationServiceMock,
                paymentWithPayerAuthAuthorizationServiceMock,
                visaCheckoutAuthServiceMock
        )

        then:
        result != null
        result['creditCard'] == paymentWithoutPayerAuthAuthorizationServiceMock
        result['visaCheckout'] == visaCheckoutAuthServiceMock
        result['creditCardWithPayerAuthentication'] == paymentWithPayerAuthAuthorizationServiceMock
    }

    def 'should create visa checkout auth service'() {
        given:
        def objectMapperMock = Mock(ObjectMapper)
        def cybersourceClientMock = Mock(CybersourceClient)
        def paymentSphereClientMock = Mock(SphereClient)
        def paymentDetailsFactoryMock = Mock(PaymentDetailsFactory)
        def cybersourceIdsMock = Mock(CybersourceIds)

        when:
        def result = testObj.visaCheckoutAuthorizationService(
                objectMapperMock,
                cybersourceIdsMock,
                cybersourceClientMock,
                paymentSphereClientMock,
                paymentDetailsFactoryMock
        )

        then:
        result instanceof VisaCheckoutAuthorizationService
    }

}
