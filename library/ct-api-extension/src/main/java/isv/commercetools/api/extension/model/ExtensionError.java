package isv.commercetools.api.extension.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.sphere.sdk.models.LocalizedString;

public class ExtensionError {

    private final ErrorCode code;
    private final String message;
    private final LocalizedString localizedMessage;

    @JsonProperty("extensionExtraInfo")
    private final ObjectNode extraInfo;

    public ExtensionError(ErrorCode code, String message, LocalizedString localizedMessage, ObjectNode extraInfo) {
        this.code = code;
        this.message = message;
        this.localizedMessage = localizedMessage;
        this.extraInfo = extraInfo;
    }

    public ExtensionError(ErrorCode code, String message, ObjectNode extraInfo) {
        this(code, message, null, extraInfo);
    }

    public ExtensionError(ErrorCode code, String message) {
        this(code, message, null, null);
    }

    public ErrorCode getCode() {
        return this.code;
    }

    public String getMessage() {
        return this.message;
    }

    public LocalizedString getLocalizedMessage() {
        return this.localizedMessage;
    }

    public ObjectNode getExtraInfo() {
        return this.extraInfo;
    }

    @Override
    public String toString() {
        return "ExtensionError(code=" + this.getCode() + ", message=" + this.getMessage() + ", localizedMessage=" + this.getLocalizedMessage() + ", extraInfo=" + this.getExtraInfo() + ")";
    }

}
