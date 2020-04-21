package com.cybersource.commercetools.mapping.model.interactions;

import io.sphere.sdk.types.CustomFields;

import java.util.Optional;

public class CustomFieldsAccessor {

    protected final Optional<CustomFields> customFields;

    protected CustomFieldsAccessor(Optional<CustomFields> customFields) {
        this.customFields = customFields;
    }

    protected Optional<Boolean> getAsBoolean(String fieldName) {
        return customFields.map(f -> f.getFieldAsBoolean(fieldName));
    }

    protected Optional<String> getAsString(String fieldName) {
        return customFields.map(f -> f.getFieldAsString(fieldName));
    }

}
