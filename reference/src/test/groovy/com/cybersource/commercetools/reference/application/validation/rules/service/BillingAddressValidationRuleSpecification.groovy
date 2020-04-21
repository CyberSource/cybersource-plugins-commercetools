package com.cybersource.commercetools.reference.application.validation.rules.service

import com.cybersource.commercetools.api.extension.model.ErrorCode
import com.neovisionaries.i18n.CountryCode
import io.sphere.sdk.carts.Cart
import io.sphere.sdk.json.SphereJsonUtils
import io.sphere.sdk.models.Address
import spock.lang.Specification

class BillingAddressValidationRuleSpecification extends Specification {

    BillingAddressValidationRule testObj

    Cart cartMock = Mock()

    def setup() {
        testObj = new BillingAddressValidationRule(SphereJsonUtils.newObjectMapper())
    }

    def 'should return errors when no required fields present'() {
        given:
        def billingAddress = new Address(
                null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                null)
        cartMock.billingAddress >> billingAddress

        when:
        def result = testObj.validate(cartMock)

        then:
        result.size() == 5
        result.each { assert it.code == ErrorCode.REQUIRED_FIELD_MISSING }
        result.message.containsAll([
                'Billing address street is required',
                'Billing address city is required',
                'Billing address post code is required',
                'Billing address state is required',
                'Billing address country is required',
        ])
    }

    def 'should return error when billing address missing'() {
        when:
        def result = testObj.validate(cartMock)

        then:
        result.size() == 1
        result.each { assert it.code == ErrorCode.REQUIRED_FIELD_MISSING }
        result.message.containsAll([
                'Billing address is required',
        ])
    }

    @SuppressWarnings('UnnecessaryObjectReferences')
    def 'should return no errors when all required fields present'() {
        given:
        def billingAddress = Address.of(CountryCode.GB)
                .withStreetName('street')
                .withCity('city')
                .withPostalCode('post code')
                .withRegion('state')
        cartMock.billingAddress >> billingAddress

        when:
        def result = testObj.validate(cartMock)

        then:
        result.size() == 0
    }
}
