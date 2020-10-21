package isv.commercetools.mapping.transformer.fieldgroup;

import io.sphere.sdk.models.Address;
import isv.payments.model.fields.AddressFieldGroup;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Populates AddressFieldGroup from commercetools Address
 */
public class AddressFieldGroupPopulator {

    public void populateFieldGroup(Address address, AddressFieldGroup addressFieldGroup) {
        addressFieldGroup.setFirstName(address.getFirstName());
        addressFieldGroup.setLastName(address.getLastName());
        addressFieldGroup.setStreet1(addressLine1(address));
        addressFieldGroup.setCity(address.getCity());
        addressFieldGroup.setPostalCode(address.getPostalCode());
        addressFieldGroup.setState(address.getRegion());
        addressFieldGroup.setCountry(address.getCountry().getAlpha2());
    }

    protected String addressLine1(Address address) {
        var addressLine1 = Stream.of(address.getStreetNumber(), address.getStreetName())
                .filter(s -> s != null)
                .collect(Collectors.joining(" "));
        return addressLine1.isEmpty() ? null : addressLine1;
    }

}
