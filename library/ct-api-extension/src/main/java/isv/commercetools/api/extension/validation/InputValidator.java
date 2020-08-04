package isv.commercetools.api.extension.validation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import isv.commercetools.api.extension.model.ErrorCode;
import isv.commercetools.api.extension.model.ExtensionError;
import java.util.List;

public abstract class InputValidator<T> {

    private final ObjectMapper objectMapper;

    public InputValidator(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public abstract List<ExtensionError> validate(T input);

    protected void validateRequiredField(List<ExtensionError> errors, Object field, String fieldName) {
        if (field == null) {
            ObjectNode extraInfo = objectMapper.createObjectNode();
            extraInfo.put("field", fieldName);
            errors.add(new ExtensionError(
                ErrorCode.REQUIRED_FIELD_MISSING, String.format("%s is required", fieldName), extraInfo));
        }
    }

    protected ExtensionError invalidInputError(String message) {
        return new ExtensionError(ErrorCode.INVALID_INPUT, message);
    }

    protected ExtensionError invalidOperationError(String message) {
        return new ExtensionError(ErrorCode.INVALID_OPERATION, message);
    }

}
