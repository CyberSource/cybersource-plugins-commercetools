package isv.commercetools.api.extension.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Action {

    UPDATE("Update"),
    CREATE("Create");

    private final String code;

    Action(final String code) {
        this.code = code;
    }

    @JsonValue
    public String getCode() {
        return code;
    }

}
