package isv.commercetools.mapping.model.interactions;

import io.sphere.sdk.types.CustomFields;
import isv.commercetools.mapping.constants.EnrolmentCheckDataConstants;
import java.util.Optional;

public class EnrolmentData extends CustomFieldsAccessor {

    public EnrolmentData(Optional<CustomFields> customFields) {
        super(customFields);
    }

    public Optional<Boolean> getAuthenticationRequired() {
        return getAsBoolean(EnrolmentCheckDataConstants.AUTHENTICATION_REQUIRED);
    }

    public Optional<Boolean> getAuthorizationAllowed() {
        return getAsBoolean(EnrolmentCheckDataConstants.AUTHORIZATION_ALLOWED);
    }

    public Optional<String> getAuthenticationTransactionId() {
        return getAsString(EnrolmentCheckDataConstants.AUTHENTICATION_TRANSACTION_ID);
    }

    public Optional<String> getRequestReferenceId() {
        return getAsString(EnrolmentCheckDataConstants.REQUEST_REFERENCE_ID);
    }

    public Optional<String> getProofXml() {
        return getAsString(EnrolmentCheckDataConstants.PROOF_XML);
    }

    public Optional<String> getCommerceIndicator() {
        return getAsString(EnrolmentCheckDataConstants.COMMERCE_INDICATOR);
    }

}
