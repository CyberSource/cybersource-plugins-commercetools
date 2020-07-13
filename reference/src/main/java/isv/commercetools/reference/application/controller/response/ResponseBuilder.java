package isv.commercetools.reference.application.controller.response;

import io.sphere.sdk.commands.UpdateAction;
import isv.commercetools.api.extension.model.ExtensionError;
import isv.commercetools.api.extension.model.ExtensionOutput;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

/**
 * Builds ResponseEntity objects for Commercetools API Extension responses
 */
@Component
public class ResponseBuilder {

    public ResponseEntity<ExtensionOutput> buildFailureResponse(List<ExtensionError> errors) {
        ResponseEntity<ExtensionOutput> response;
        if (errors == null) {
            response = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } else if (errors.isEmpty()) {
            response = buildFailureResponse(new ExtensionOutput());
        } else {
            response = buildFailureResponse(new ExtensionOutput().withErrors(errors));
        }
        return response;
    }

    public ResponseEntity<ExtensionOutput> buildSuccessResponse(List<UpdateAction> actions) {
        ResponseEntity<ExtensionOutput> response;
        if (actions == null) {
            response = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } else if (actions.isEmpty()) {
            response = buildSuccessResponse(new ExtensionOutput());
        } else {
            response = buildSuccessResponse(new ExtensionOutput().withActions(actions));
        }
        return response;
    }

    public ResponseEntity<ExtensionOutput> buildFailureResponse(ExtensionOutput output) {
        return ResponseEntity.badRequest().body(output);
    }

    public ResponseEntity<ExtensionOutput> buildSuccessResponse(ExtensionOutput output) {
        return ResponseEntity.ok().body(output);
    }

}
