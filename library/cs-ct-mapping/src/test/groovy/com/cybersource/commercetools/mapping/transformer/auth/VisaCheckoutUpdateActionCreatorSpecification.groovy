package com.cybersource.commercetools.mapping.transformer.auth

import com.cybersource.commercetools.mapping.transformer.auth.visacheckout.VisaCheckoutUpdateActionCreator
import com.cybersource.payments.model.fields.BillToFieldGroup
import com.cybersource.payments.model.fields.CardFieldGroup
import com.cybersource.payments.model.fields.ShipToFieldGroup
import com.cybersource.commercetools.mapping.transformer.response.CybersourceResponseAddressMapper
import com.cybersource.payments.model.fields.VisaCheckoutResponseFieldGroup
import com.neovisionaries.i18n.CountryCode
import io.sphere.sdk.carts.commands.updateactions.SetBillingAddress
import io.sphere.sdk.carts.commands.updateactions.SetShippingAddress
import io.sphere.sdk.models.Address
import io.sphere.sdk.payments.commands.updateactions.SetCustomField
import spock.lang.Specification

@SuppressWarnings('UnnecessaryObjectReferences')
class VisaCheckoutUpdateActionCreatorSpecification extends Specification {

    VisaCheckoutUpdateActionCreator testObj

    CybersourceResponseAddressMapper addressMapper

    def 'setup'() {
        addressMapper = Mock(CybersourceResponseAddressMapper)
        testObj = new VisaCheckoutUpdateActionCreator(addressMapper)
    }

    def 'Should create update actions for a payment'() {
        given:
        CardFieldGroup cardFieldGroupMock = Mock()
        cardFieldGroupMock.prefix >> '123456'
        cardFieldGroupMock.suffix >> '789'
        cardFieldGroupMock.expirationMonth >> '02'
        cardFieldGroupMock.expirationYear >> '21'

        VisaCheckoutResponseFieldGroup visaCheckoutFieldGroupMock = Mock()
        visaCheckoutFieldGroupMock.cardType >> 'VISA'

        when:
        def result = testObj.buildPaymentUpdateActions(cardFieldGroupMock, visaCheckoutFieldGroupMock)

        then:
        result.size() == 4
        List<SetCustomField> setCustomFieldActions = result.findAll { it instanceof SetCustomField }
        setCustomFieldActions.find { it.name == 'cs_maskedPan' && it.value.textValue() == '123456...789' }
        setCustomFieldActions.find { it.name == 'cs_cardType' && it.value.textValue() == 'VISA' }
        setCustomFieldActions.find { it.name == 'cs_cardExpiryMonth' && it.value.textValue() == '02' }
        setCustomFieldActions.find { it.name == 'cs_cardExpiryYear' && it.value.textValue() == '21' }
    }

    def 'should create update actions for a cart shipping address'() {
        given:
        ShipToFieldGroup shipToFieldGroup = new ShipToFieldGroup()
        Address address = Address.of(CountryCode.GB)
        addressMapper.mapAddress(shipToFieldGroup) >> Optional.of(address)

        when:
        def result = testObj.buildShippingCartUpdateActions(shipToFieldGroup)

        then:
        result.size() == 1
        SetShippingAddress action = result.find { it instanceof SetShippingAddress }
        action.address == address
    }

    def 'should create update actions for a cart billing address'() {
        given:
        BillToFieldGroup billToFieldGroup = new BillToFieldGroup()
        Address address = Address.of(CountryCode.GB)
        addressMapper.mapAddress(billToFieldGroup) >> Optional.of(address)

        when:
        def result = testObj.buildBillingCartUpdateActions(billToFieldGroup)

        then:
        result.size() == 1
        SetBillingAddress action = result.find { it instanceof SetBillingAddress }
        action.address == address
    }

    def 'should handle a null cardFieldGroup when building payment update actions'() {
        given:
        VisaCheckoutResponseFieldGroup visaCheckoutFieldGroupMock = Mock()
        visaCheckoutFieldGroupMock.cardType >> 'VISA'

        when:
        def result = testObj.buildPaymentUpdateActions(null, visaCheckoutFieldGroupMock)

        then:
        result.size() == 1
    }
    def 'should handle a null visa checkout field group when building payment update actions'() {
        given:
        CardFieldGroup cardFieldGroupMock = Mock()
        cardFieldGroupMock.prefix >> '123456'
        cardFieldGroupMock.suffix >> '789'
        cardFieldGroupMock.expirationMonth >> '02'
        cardFieldGroupMock.expirationYear >> '21'

        when:
        def result = testObj.buildPaymentUpdateActions(cardFieldGroupMock, null)

        then:
        result.size() == 3
    }

    def 'should handle a null shipToFieldGroup when building cart shipping update actions'() {
        given:
        addressMapper.mapAddress(null) >> Optional.empty()

        when:
        def result = testObj.buildShippingCartUpdateActions(null)

        then:
        result.size() == 0
    }

    def 'should handle a null billToFieldGroup when building cart billing update actions'() {
        given:
        addressMapper.mapAddress(null) >> Optional.empty()

        when:
        def result = testObj.buildBillingCartUpdateActions(null)

        then:
        result.size() == 0
    }

}
