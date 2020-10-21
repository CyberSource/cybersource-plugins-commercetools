package isv.commercetools.mapping.transformer.fieldgroup

import com.neovisionaries.i18n.CountryCode
import io.sphere.sdk.models.Address
import isv.payments.model.fields.ShipToFieldGroup
import spock.lang.Specification
import spock.lang.Unroll

class AddressFieldGroupPopulatorSpecification extends Specification {

    def testObj = new AddressFieldGroupPopulator()

    def 'should populate field group from address'() {
        given:
        def address = Address.of(CountryCode.GB)
                .withFirstName('first')
                .withLastName('last')
                .withStreetNumber('1')
                .withStreetName('street name')
                .withPostalCode('postal code')
                .withCity('city')
                .withRegion('state')
        def addressFieldGroup = new ShipToFieldGroup()

        when:
        testObj.populateFieldGroup(address, addressFieldGroup)

        then:
        addressFieldGroup.firstName == 'first'
        addressFieldGroup.lastName == 'last'
        addressFieldGroup.street1 == '1 street name'
        addressFieldGroup.city == 'city'
        addressFieldGroup.postalCode == 'postal code'
        addressFieldGroup.state == 'state'
        addressFieldGroup.country == 'GB'
    }

    @Unroll
    def 'should map address line 1'() {
        given:
        def shippingAddress = Address.of(CountryCode.GB)
                .withStreetNumber(streetNumber)
                .withStreetName(streetName)

        when:
        def result = testObj.addressLine1(shippingAddress)

        then:
        result == expectedResult

        where:
        streetNumber | streetName | expectedResult
        null         | null       | null
        '1'          | null       | '1'
        null         | 'street'   | 'street'
        '1'          | 'street'   | '1 street'
    }

}
