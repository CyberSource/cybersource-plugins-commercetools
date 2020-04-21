package com.cybersource.commercetools.reference.application.validation.rules.service

import com.cybersource.commercetools.api.extension.model.ErrorCode
import com.neovisionaries.i18n.CountryCode
import io.sphere.sdk.carts.Cart
import io.sphere.sdk.json.SphereJsonUtils
import io.sphere.sdk.models.Address
import spock.lang.Specification

class PayerAuthEnrolmentCustomerValidationRuleSpecification extends Specification {

    PayerAuthEnrolmentCustomerValidationRule testObj

    Cart cartMock = Mock()

    def setup() {
        testObj = new PayerAuthEnrolmentCustomerValidationRule(SphereJsonUtils.newObjectMapper())
    }

    def 'should return errors when no required fields present'() {
        when:
        def result = testObj.validate(cartMock)

        then:
        result.size() == 1
        result.each { assert it.code == ErrorCode.REQUIRED_FIELD_MISSING }
        result.message.containsAll([
                'Billing address is required',
        ])
    }

    def 'should return errors when billing address present but no required fields populated'() {
        given:
        Address billingAddress = Address.of(CountryCode.GB)
        cartMock.billingAddress >> billingAddress

        when:
        def result = testObj.validate(cartMock)

        then:
        result.size() == 3
        result.each { assert it.code == ErrorCode.REQUIRED_FIELD_MISSING }
        result.message.containsAll([
                'Billing first name is required',
                'Billing last name is required',
                'Billing email is required',
        ])
    }

    def 'should return no errors when all required fields populated'() {
        given:
        Address billingAddress = Address.of(CountryCode.GB).withFirstName('first').withLastName('last').withEmail('email')
        cartMock.billingAddress >> billingAddress

        when:
        def result = testObj.validate(cartMock)

        then:
        result.isEmpty()
    }

}
