package com.cybersource.commercetools.mapping.transformer.response

import com.cybersource.payments.model.fields.BillToFieldGroup
import com.cybersource.payments.model.fields.ShipToFieldGroup
import com.neovisionaries.i18n.CountryCode
import spock.lang.Specification
import spock.lang.Unroll

class DefaultCybersourceResponseAddressMapperSpecification extends Specification {

    DefaultCybersourceResponseAddressMapper testObj

    def 'setup'() {
        testObj = new DefaultCybersourceResponseAddressMapper()
    }

    def 'should create update actions for a cart shipping address'() {
        given:
        ShipToFieldGroup shipToFieldGroupMock = Mock()
        shipToFieldGroupMock.firstName >> 'Barry'
        shipToFieldGroupMock.lastName >> 'Barryson'
        shipToFieldGroupMock.street1 >> '21 Something Street'
        shipToFieldGroupMock.city >> 'Brisbane'
        shipToFieldGroupMock.postalCode >> '4165'
        shipToFieldGroupMock.state >> 'Queensland'
        shipToFieldGroupMock.country >> 'AU'

        when:
        def resultOptional = testObj.mapAddress(shipToFieldGroupMock)

        then:
        resultOptional.isPresent()
        def result = resultOptional.get()
        result.firstName == 'Barry'
        result.lastName == 'Barryson'
        result.streetNumber == '21'
        result.streetName == 'Something Street'
        result.city == 'Brisbane'
        result.postalCode == '4165'
        result.state == 'Queensland'
        result.country == CountryCode.AU
    }

    def 'should create update actions for a cart billing address'() {
        given:
        BillToFieldGroup billToFieldGroupMock = Mock()
        billToFieldGroupMock.firstName >> 'Barry'
        billToFieldGroupMock.lastName >> 'Barryson'
        billToFieldGroupMock.street1 >> '21 Something Street'
        billToFieldGroupMock.city >> 'Brisbane'
        billToFieldGroupMock.postalCode >> '4165'
        billToFieldGroupMock.state >> 'Queensland'
        billToFieldGroupMock.country >> 'AU'

        when:
        def resultOptional = testObj.mapAddress(billToFieldGroupMock)

        then:
        resultOptional.isPresent()
        def result = resultOptional.get()
        result.firstName == 'Barry'
        result.lastName == 'Barryson'
        result.streetNumber == '21'
        result.streetName == 'Something Street'
        result.city == 'Brisbane'
        result.postalCode == '4165'
        result.state == 'Queensland'
        result.country == CountryCode.AU
    }

    @Unroll
    def 'Should split street number and street name correctly'() {
        given:
        BillToFieldGroup billToFieldGroupMock = Mock()
        billToFieldGroupMock.street1 >> street1Value
        billToFieldGroupMock.country >> 'GB'

        when:
        def optionalResult = testObj.mapAddress(billToFieldGroupMock)

        then:
        optionalResult.isPresent()
        def result = optionalResult.get()
        result.streetNumber == expectedStreetNumber
        result.streetName == expectedStreetName

        where:
        street1Value           | expectedStreetNumber | expectedStreetName
        '21 Something Street'  | '21'                 | 'Something Street'
        'Something Street'     | null                 | 'Something Street'
        'Something 365'        | null                 | 'Something 365'
        '1/2 Something Street' | '1/2'                | 'Something Street'
        '2'                    | '2'                  | null
        '23456'                | '23456'              | null
        '2 '                   | '2'                  | ''
    }

    def 'Should handle an address that only contains country'() {
        given:
        BillToFieldGroup billToFieldGroupMock = Mock()
        billToFieldGroupMock.country >> 'AU'

        when:
        def resultOptional = testObj.mapAddress(billToFieldGroupMock)

        then:
        resultOptional.isPresent()
        def result = resultOptional.get()
        result.firstName == null
        result.lastName == null
        result.streetNumber == null
        result.streetName == null
        result.city == null
        result.postalCode == null
        result.state == null
        result.country == CountryCode.AU
    }

    def 'Should handle an address with no country'() {
        given:
        BillToFieldGroup billToFieldGroupMock = Mock()

        when:
        def result = testObj.mapAddress(billToFieldGroupMock)

        then:
        result.isEmpty()
    }

}
