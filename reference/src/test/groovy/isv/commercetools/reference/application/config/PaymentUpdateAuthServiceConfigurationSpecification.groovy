package isv.commercetools.reference.application.config

import com.fasterxml.jackson.databind.ObjectMapper
import io.sphere.sdk.client.SphereClient
import isv.commercetools.mapping.model.CybersourceIds
import isv.commercetools.reference.application.factory.payment.PaymentDetailsFactory
import isv.commercetools.reference.application.service.payment.PaymentService
import isv.commercetools.reference.application.service.payment.visacheckout.VisaCheckoutAuthorizationService
import isv.commercetools.reference.application.validation.FlexTokenVerifier
import isv.payments.CybersourceClient
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
        def flexTokenVerifierMock = Mock(FlexTokenVerifier)

        when:
        def result = testObj.visaCheckoutAuthorizationService(
                objectMapperMock,
                cybersourceIdsMock,
                cybersourceClientMock,
                paymentSphereClientMock,
                paymentDetailsFactoryMock,
                flexTokenVerifierMock
        )

        then:
        result instanceof VisaCheckoutAuthorizationService
    }

}
