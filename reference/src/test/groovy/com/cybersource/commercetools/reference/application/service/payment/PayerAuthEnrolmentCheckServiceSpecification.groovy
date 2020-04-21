package com.cybersource.commercetools.reference.application.service.payment

import com.cybersource.commercetools.api.extension.model.ExtensionError
import com.cybersource.commercetools.mapping.PayerAuthEnrolmentCheckRequestTransformer
import com.cybersource.commercetools.mapping.PayerAuthEnrolmentCheckResponseTransformer
import com.cybersource.commercetools.mapping.model.CustomPayment
import com.cybersource.commercetools.mapping.model.PaymentDetails
import com.cybersource.commercetools.reference.application.factory.payment.PaymentDetailsFactory
import com.cybersource.commercetools.reference.application.validation.ResourceValidator
import com.cybersource.payments.CybersourceClient
import com.cybersource.payments.exception.PaymentException
import com.cybersource.payments.model.CybersourceRequest
import io.sphere.sdk.carts.Cart
import io.sphere.sdk.commands.UpdateAction
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
