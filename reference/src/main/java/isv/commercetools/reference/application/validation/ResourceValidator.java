package isv.commercetools.reference.application.validation;

import isv.commercetools.api.extension.model.ExtensionError;
import isv.commercetools.api.extension.validation.InputValidator;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Validates a resource by calling the configured validation rules and returns the collected list of errors, or an empty
 * list if there were no errors.
 */
public class ResourceValidator<T> {

    private final List<InputValidator<T>> validationRules;

    public ResourceValidator(List<InputValidator<T>> validationRules) {
        this.validationRules = validationRules;
    }

    public List<ExtensionError> validate(T resource) {
        return validationRules.stream()
                .map(rule -> rule.validate(resource))
                .flatMap(Collection::stream)
                .collect(Collectors.toList());
    }
}
