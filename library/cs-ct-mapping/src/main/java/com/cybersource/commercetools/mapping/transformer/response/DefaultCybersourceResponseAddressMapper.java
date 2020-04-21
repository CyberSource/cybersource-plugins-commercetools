package com.cybersource.commercetools.mapping.transformer.response;

import com.cybersource.payments.model.fields.AddressFieldGroup;
import com.neovisionaries.i18n.CountryCode;
import io.sphere.sdk.models.Address;
import io.sphere.sdk.models.AddressBuilder;
import org.apache.commons.lang3.StringUtils;

import java.util.Optional;

/**
 * Default implementation of an address mapper. Expects the street number before street name in the 'street1' field,
 * as well as a first name, last name, city, postcode, state and country.
 */
public class DefaultCybersourceResponseAddressMapper implements CybersourceResponseAddressMapper {

    @Override
    public Optional<Address> mapAddress(AddressFieldGroup addressFieldGroup) {
        Address address = null;
        if (addressFieldGroup != null && addressFieldGroup.getCountry() != null) {
            var addressBuilder = AddressBuilder.of(CountryCode.valueOf(addressFieldGroup.getCountry()));
            if (StringUtils.isNotEmpty(addressFieldGroup.getFirstName())) {
                addressBuilder.firstName(addressFieldGroup.getFirstName());
            }
            if (StringUtils.isNotEmpty(addressFieldGroup.getLastName())) {
                addressBuilder.lastName(addressFieldGroup.getLastName());
            }
            if (StringUtils.isNotEmpty(addressFieldGroup.getStreet1())) {
                mapStreetNumberAndName(addressFieldGroup, addressBuilder);
            }
            if (StringUtils.isNotEmpty(addressFieldGroup.getCity())) {
                addressBuilder.city(addressFieldGroup.getCity());
            }
            if (StringUtils.isNotEmpty(addressFieldGroup.getPostalCode())) {
                addressBuilder.postalCode(addressFieldGroup.getPostalCode());
            }
            if (StringUtils.isNotEmpty(addressFieldGroup.getState())) {
                addressBuilder.state(addressFieldGroup.getState());
            }
            address = addressBuilder.build();
        }
        return Optional.ofNullable(address);
    }

    private void mapStreetNumberAndName(AddressFieldGroup addressFieldGroup, AddressBuilder addressBuilder) {
        var street1 = addressFieldGroup.getStreet1();
        if (Character.isDigit(street1.charAt(0))) {
            var firstSpace = street1.indexOf(" ");
            if (firstSpace == -1) {
                addressBuilder.streetNumber(street1);
            } else {
                addressBuilder.streetNumber(street1.substring(0, firstSpace));
                addressBuilder.streetName(street1.substring(++firstSpace));
            }
        } else {
            addressBuilder.streetName(addressFieldGroup.getStreet1());
        }
    }
}
