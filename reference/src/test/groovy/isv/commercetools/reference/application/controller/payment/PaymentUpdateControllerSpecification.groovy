package isv.commercetools.reference.application.controller.payment

import io.sphere.sdk.commands.UpdateAction
import io.sphere.sdk.payments.Payment
import io.sphere.sdk.payments.PaymentMethodInfo
import isv.commercetools.api.extension.model.ExtensionError
import isv.commercetools.api.extension.model.ExtensionInput
import isv.commercetools.api.extension.model.ExtensionOutput
import isv.commercetools.api.extension.model.Resource
import isv.commercetools.mapping.model.CustomPayment
import isv.commercetools.reference.application.controller.response.ResponseBuilder
import isv.commercetools.reference.application.logging.PayloadLogger
import isv.commercetools.reference.application.service.extension.PaymentUpdateExtensionService
import isv.commercetools.reference.application.validation.ResourceValidator
import org.springframework.http.ResponseEntity
import spock.lang.Specification

class PaymentUpdateControllerSpecification extends Specification {

    PaymentUpdateController testObj

    PayloadLogger payloadLoggerMock = Mock()
    ResponseBuilder responseBuilderMock = Mock()
    ResourceValidator<CustomPayment> paymentValidatorMock = Mock()
    PaymentUpdateExtensionService paymentUpdateExtensionService = Mock()

    ExtensionInput payloadMock = Mock()
    Resource resourceMock = Mock()
    Payment paymentMock = Mock()
    PaymentMethodInfo paymentMethodInfoMock = Mock()
    ExtensionError errorMock = Mock()

    ResponseEntity<ExtensionOutput> errorResponseMock = Mock()
    ExtensionOutput errorExtensionOutputMock = Mock()

    ResponseEntity<ExtensionOutput> successResponseMock = Mock()
    ExtensionOutput successExtensionOutputMock = Mock()

    ResponseEntity<ExtensionOutput> emptySuccessResponseMock = Mock()
    ExtensionOutput emptyExtensionOutputMock = Mock()

    UpdateAction actionMock = Mock()

    def setup() {
        testObj = new PaymentUpdateController(
                paymentUpdateExtensionService,
                responseBuilderMock,
                paymentValidatorMock,
                payloadLoggerMock
        )

        payloadMock.resource >> resourceMock
        resourceMock.obj >> paymentMock
        paymentMock.paymentMethodInfo >> paymentMethodInfoMock

        errorResponseMock.body >> errorExtensionOutputMock
        errorExtensionOutputMock.actions >> []
        errorExtensionOutputMock.errors >> [errorMock]

        successResponseMock.body >> successExtensionOutputMock
        successExtensionOutputMock.actions >> [actionMock]
        successExtensionOutputMock.errors >> []

        emptySuccessResponseMock.body >> emptyExtensionOutputMock
        emptyExtensionOutputMock.actions >> []
        emptyExtensionOutputMock.errors >> []
    }

    def 'should return validation errors if validation fails'() {
        given:
        def validationResponse = [errorMock]

        when:
        def result = testObj.handle(payloadMock)

        then:
        1 * payloadLoggerMock.log('Received payment update', payloadMock)
        1 * paymentValidatorMock.validate { it.basePayment == paymentMock } >> validationResponse
        0 * paymentUpdateExtensionService.process(_)
        1 * responseBuilderMock.buildFailureResponse(validationResponse) >> errorResponseMock
        1 * payloadLoggerMock.log('Returning response', errorExtensionOutputMock)
        result == errorResponseMock

        and:
        result == errorResponseMock
    }

    def 'should continue processing if validation passes'() {
        given:
        def validationResponse = []

        when:
        def result = testObj.handle(payloadMock)

        then:
        1 * payloadLoggerMock.log('Received payment update', payloadMock)
        1 * paymentValidatorMock.validate { it.basePayment == paymentMock } >> validationResponse
        1 * paymentUpdateExtensionService.process { it.basePayment == paymentMock } >> successExtensionOutputMock
        1 * responseBuilderMock.buildSuccessResponse(successExtensionOutputMock) >> successResponseMock
        1 * payloadLoggerMock.log('Returning response', successExtensionOutputMock)

        and:
        result == successResponseMock
    }

    def 'should return errors and a BAD REQUEST response when the extension service returns errors'() {
        given:
        def validationResponse = []

        when:
        def result = testObj.handle(payloadMock)

        then:
        1 * payloadLoggerMock.log('Received payment update', payloadMock)
        1 * paymentValidatorMock.validate { it.basePayment == paymentMock } >> validationResponse
        1 * paymentUpdateExtensionService.process { it.basePayment == paymentMock } >> errorExtensionOutputMock
        1 * responseBuilderMock.buildFailureResponse(errorExtensionOutputMock) >> errorResponseMock
        1 * payloadLoggerMock.log('Returning response', errorExtensionOutputMock)

        and:
        result == errorResponseMock
    }

    def 'Should handle empty response from extension service'() {
        given:
        def validationResponse = []

        when:
        def result = testObj.handle(payloadMock)

        then:
        1 * payloadLoggerMock.log('Received payment update', payloadMock)
        1 * paymentValidatorMock.validate { it.basePayment == paymentMock } >> validationResponse
        1 * paymentUpdateExtensionService.process { it.basePayment == paymentMock } >> emptyExtensionOutputMock
        1 * responseBuilderMock.buildSuccessResponse(emptyExtensionOutputMock) >> emptySuccessResponseMock
        1 * payloadLoggerMock.log('Returning response', emptyExtensionOutputMock)

        and:
        result == emptySuccessResponseMock
    }
}
