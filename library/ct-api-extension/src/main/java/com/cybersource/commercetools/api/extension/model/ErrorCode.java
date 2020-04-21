package com.cybersource.commercetools.api.extension.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum ErrorCode {

    GENERAL("General"),
    REQUIRED_FIELD_MISSING("RequiredField"),
    INVALID_INPUT("InvalidInput"),
    INVALID_FIELD("InvalidField"),
    INVALID_OPERATION("InvalidOperation"),
    UNAUTHORIZED("Unauthorized");

    private final String code;

    ErrorCode(final String code) {
        this.code = code;
    }

    @JsonValue
    public String getCode() {
        return code;
    }

}
