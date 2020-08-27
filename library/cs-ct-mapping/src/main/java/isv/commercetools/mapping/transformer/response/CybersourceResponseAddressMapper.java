package isv.commercetools.mapping.transformer.response;

import io.sphere.sdk.models.Address;
import isv.payments.model.fields.AddressFieldGroup;
import java.util.Optional;
import javax.annotation.Nullable;

/**
 * A mapper which converts Cybersource address fields to Commercetools addresses.
 */
public interface CybersourceResponseAddressMapper {

    Optional<Address> mapAddress(@Nullable AddressFieldGroup addressFieldGroup);

}
