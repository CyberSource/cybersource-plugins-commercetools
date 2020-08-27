package isv.commercetools.api.extension.validation

import com.fasterxml.jackson.databind.ObjectMapper
import isv.commercetools.api.extension.model.ErrorCode
import isv.commercetools.api.extension.model.ExtensionError
import spock.lang.Specification

class InputValidatorSpecification extends Specification {

    InputValidator testObj = new InputValidatorFixture(new ObjectMapper())

    def 'should add error when required field is null'() {
        given:
        def errors = []

        when:
        testObj.validateRequiredField(errors, null, 'field name')

        then:
        errors.size() == 1
        errors[0].code == ErrorCode.REQUIRED_FIELD_MISSING
        errors[0].message == 'field name is required'
        errors[0].extraInfo.field.textValue() == 'field name'
    }

    def 'should not add error when required field is non-null'() {
        given:
        def errors = []

        when:
        testObj.validateRequiredField(errors, 'value', 'field name')

        then:
        errors.size() == 0
    }

    def 'should create invalid input error'() {
        when:
        def result = testObj.invalidInputError('message')

        then:
        result.code == ErrorCode.INVALID_INPUT
        result.message == 'message'
    }

    def 'should create invalid operation error'() {
        when:
        def result = testObj.invalidOperationError('message')

        then:
        result.code == ErrorCode.INVALID_OPERATION
        result.message == 'message'
    }

    class InputValidatorFixture extends InputValidator<Object> {
        InputValidatorFixture(ObjectMapper objectMapper) {
            super(objectMapper)
        }

        @Override
        List<ExtensionError> validate(Object input) {
        }
    }
}
