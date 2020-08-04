package isv.commercetools.reference.application.validation

import isv.commercetools.api.extension.model.ExtensionError
import isv.commercetools.api.extension.validation.InputValidator
import isv.commercetools.mapping.model.CustomPayment
import spock.lang.Specification

class ResourceValidatorSpecification extends Specification {

    ResourceValidator<CustomPayment> testObj

    def 'should call all validation rules'() {
        given:
        def validationRule = Mock(InputValidator)
        def paymentMock = Mock(CustomPayment)
        def resultList = [Mock(ExtensionError)]
        testObj = new ResourceValidator<CustomPayment>([validationRule])

        when:
        def result = testObj.validate(paymentMock)

        then:
        1 * validationRule.validate(paymentMock) >> resultList
        result == resultList
    }

}
