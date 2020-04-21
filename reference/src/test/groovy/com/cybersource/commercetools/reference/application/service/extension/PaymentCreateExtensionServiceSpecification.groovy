package com.cybersource.commercetools.reference.application.service.extension

import com.cybersource.commercetools.api.extension.model.ErrorCode
import com.cybersource.commercetools.api.extension.model.ExtensionError
import com.cybersource.commercetools.mapping.model.CustomPayment
import com.cybersource.commercetools.mapping.model.PaymentDetails
import com.cybersource.commercetools.reference.application.service.payment.PayerAuthenticationException
import com.cybersource.commercetools.reference.application.service.payment.PaymentService
import com.cybersource.payments.exception.PaymentException
import io.sphere.sdk.commands.UpdateAction
import spock.lang.Specification

class PaymentCreateExtensionServiceSpecification extends Specification {

    PaymentCreateExtensionService testObj
    Map<String, PaymentService> paymentServiceMap
    PaymentService paymentServiceMock
    CustomPayment paymentMock
    ExtensionError errorMock
    UpdateAction actionMock
    PaymentDetails paymentDetailsMock

    def 'setup'() {
        errorMock = Mock()
        paymentMock = Mock()
        paymentServiceMock = Mock()
        paymentServiceMap = ['creditCard':paymentServiceMock]
        paymentDetailsMock = Mock()
        testObj = new PaymentCreateExtensionService(paymentServiceMap)

        paymentMock.paymentMethod >> 'creditCard'
    }

    def 'Should return an error response if validation fails'() {
        when:
        def result = testObj.process(paymentMock)

        then:
        1 * paymentServiceMock.populatePaymentDetails(paymentMock) >> paymentDetailsMock
        1 * paymentServiceMock.validate(paymentDetailsMock) >> [errorMock]
        0 * paymentServiceMock.process(_)

        and:
        result.errors.size() == 1
        result.errors[0] == errorMock
        result.actions.isEmpty()
    }

    def 'Should return an extension output with actions if validation passes'() {
        when:
        def result = testObj.process(paymentMock)

        then:
        1 * paymentServiceMock.populatePaymentDetails(paymentMock) >> paymentDetailsMock
        1 * paymentServiceMock.validate(paymentDetailsMock) >> []
        1 * paymentServiceMock.process(paymentDetailsMock) >> [actionMock]

        and:
        result.actions.size() == 1
        result.actions[0] == actionMock
    }

    def 'Should return an INVALID_OPERATION error if a PayerAuthenticationException occurs'() {
        when:
        def result = testObj.process(paymentMock)

        then:
        1 * paymentServiceMock.populatePaymentDetails(paymentMock) >> paymentDetailsMock
        1 * paymentServiceMock.validate(paymentDetailsMock) >> []
        1 * paymentServiceMock.process(paymentDetailsMock) >> { throw new PayerAuthenticationException(new Exception('something')) }

        and:
        result.errors.size() == 1
        result.errors[0].code == ErrorCode.INVALID_OPERATION
        result.errors[0].message == 'java.lang.Exception: something'
        result.actions.isEmpty()
    }

    def 'Should return an INVALID_OPERATION error if a PaymentException occurs when retrieving cart'() {
        when:
        def result = testObj.process(paymentMock)

        then:
        1 * paymentServiceMock.populatePaymentDetails(paymentMock) >> { throw new PaymentException('message') }
        0 * paymentServiceMock.validate(_)
        0 * paymentServiceMock.process(_)

        and:
        result.errors.size() == 1
        result.errors[0].code == ErrorCode.INVALID_OPERATION
        result.errors[0].message == 'message'
        result.actions.isEmpty()
    }
}
