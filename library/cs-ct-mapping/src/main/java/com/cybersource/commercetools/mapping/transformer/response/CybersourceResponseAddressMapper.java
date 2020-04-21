package com.cybersource.commercetools.mapping.transformer.response;

import com.cybersource.payments.model.fields.AddressFieldGroup;
import io.sphere.sdk.models.Address;

import javax.annotation.Nullable;
import java.util.Optional;

/**
 * A mapper which converts Cybersource address fields to Commercetools addresses.
 */
public interface CybersourceResponseAddressMapper {

    Optional<Address> mapAddress(@Nullable AddressFieldGroup addressFieldGroup);

}
