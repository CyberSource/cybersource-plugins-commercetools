package isv.commercetools.reference.application.service.payment

import io.sphere.sdk.carts.Cart
import io.sphere.sdk.commands.UpdateAction
import isv.commercetools.api.extension.model.ExtensionError
import isv.commercetools.mapping.PayerAuthEnrolmentCheckRequestTransformer
import isv.commercetools.mapping.PayerAuthEnrolmentCheckResponseTransformer
import isv.commercetools.mapping.model.CustomPayment
import isv.commercetools.mapping.model.PaymentDetails
import isv.commercetools.reference.application.factory.payment.PaymentDetailsFactory
import isv.commercetools.reference.application.validation.ResourceValidator
import isv.payments.CybersourceClient
import isv.payments.exception.PaymentException
import isv.payments.model.CybersourceRequest
import spock.lang.Specification

class PayerAuthEnrolmentCheckServiceSpecification extends Specification {

    PayerAuthEnrolmentCheckRequestTransformer requestTransformerMock = Mock()
    PayerAuthEnrolmentCheckResponseTransformer responseTransformerMock = Mock()
    CybersourceClient cybersourceClientMock = Mock()
    ResourceValidator<CustomPayment> paymentValidatorMock = Mock()
    ResourceValidator<Cart> cartValidatorMock = Mock()
    PaymentDetailsFactory paymentDetailsFactoryMock = Mock()

    CustomPayment paymentMock = Mock()
    Cart cartMock = Mock()
    PaymentDetails paymentDetailsMock = Mock()
    CybersourceRequest cybersourceRequestMock = Mock()
    UpdateAction actionMock = Mock()
    ExtensionError errorMock1 = Mock()
    ExtensionError errorMock2 = Mock()

    PayerAuthEnrolmentCheckService testObj = new PayerAuthEnrolmentCheckService(
            paymentDetailsFactoryMock,
            paymentValidatorMock,
            cartValidatorMock,
            requestTransformerMock,
            responseTransformerMock,
            cybersourceClientMock
    )

    def 'should call service with mapped request and return response'() {
        when:
        def result = testObj.process(new PaymentDetails(paymentMock))

        then:
        1 * requestTransformerMock.transform { it.customPayment == paymentMock } >> cybersourceRequestMock
        1 * cybersourceClientMock.makeRequest(cybersourceRequestMock) >> ['cybersource':'response']
        1 * responseTransformerMock.transform(['cybersource':'response'], paymentMock) >> [actionMock]

        and:
        result == [actionMock]
    }

    def 'should throw payer auth exception when enrolment check service call fails'() {
        when:
        testObj.process(new PaymentDetails(paymentMock))

        then:
        1 * requestTransformerMock.transform { it.customPayment == paymentMock } >> cybersourceRequestMock
        1 * cybersourceClientMock.makeRequest(cybersourceRequestMock) >> { throw new PaymentException('message') }

        and:
        thrown(PayerAuthenticationException)
    }

    def 'should throw payer auth exception when enrolment check response transform fails'() {
        when:
        testObj.process(new PaymentDetails(paymentMock))

        then:
        1 * requestTransformerMock.transform { it.customPayment == paymentMock } >> cybersourceRequestMock
        1 * cybersourceClientMock.makeRequest(cybersourceRequestMock) >> ['cybersource':'response']
        1 * responseTransformerMock.transform(['cybersource':'response'], paymentMock) >> {
            throw new PaymentException('message')
        }

        and:
        thrown(PayerAuthenticationException)
    }

    def 'should validate input'() {
        given:
        def paymentDetails = new PaymentDetails(paymentMock, cartMock)

        when:
        def result = testObj.validate(paymentDetails)

        then:
        1 * paymentValidatorMock.validate(paymentMock) >> [errorMock1]
        1 * cartValidatorMock.validate(cartMock) >> [errorMock2]

        and:
        result == [errorMock1, errorMock2]
    }

    def 'should populate payment and cart on PaymentDetails'() {
        when:
        def result = testObj.populatePaymentDetails(paymentMock)

        then:
        1 * paymentDetailsFactoryMock.paymentDetailsWithCart(paymentMock) >> paymentDetailsMock

        and:
        result == paymentDetailsMock
    }

}
