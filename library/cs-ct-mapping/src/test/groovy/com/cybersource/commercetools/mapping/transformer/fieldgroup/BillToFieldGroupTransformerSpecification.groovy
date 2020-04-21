package com.cybersource.commercetools.mapping.transformer.fieldgroup

import com.cybersource.commercetools.mapping.model.PaymentDetails
import com.cybersource.commercetools.mapping.model.CustomPayment
import com.neovisionaries.i18n.CountryCode
import io.sphere.sdk.carts.Cart
import io.sphere.sdk.models.Address
import io.sphere.sdk.payments.Payment
import io.sphere.sdk.types.CustomFields
import spock.lang.Specification

class BillToFieldGroupTransformerSpecification extends Specification {

    def testObj = new BillToFieldGroupTransformer()

    Payment paymentMock = Mock()
    CustomFields customFieldsMock = Mock()
    Cart cartMock = Mock()

    def 'should transform payment to billing field group'() {
        given: 'we have payment details with a billing address'
        cartMock.billingAddress >> Address.of(CountryCode.GB)
                .withFirstName('someBillingAddressFirstName')
                .withLastName('someBillingAddressLastName')
                .withStreetNumber('1')
                .withStreetName('someBillingStreet')
                .withPostalCode('someBillingAddressPostalCode')
                .withCity('someBillingAddressCity')
                .withRegion('someBillingAddressState')
                .withEmail('someBillingAddressEmail')

        customFieldsMock.getFieldAsString('cs_customerIpAddress') >> 'someIpAddress'
        paymentMock.custom >> customFieldsMock

        def customPayment = new CustomPayment(paymentMock)
        def paymentDetails = new PaymentDetails(customPayment, cartMock)

        when: 'we transform it'
        def result = testObj.configure(paymentDetails)

        then: 'it has the correct billTo values'
        result.size() == 1
        result[0].firstName == 'someBillingAddressFirstName'
        result[0].lastName == 'someBillingAddressLastName'
        result[0].email == 'someBillingAddressEmail'

        result[0].street1 == '1 someBillingStreet'
        result[0].city == 'someBillingAddressCity'
        result[0].postalCode == 'someBillingAddressPostalCode'
        result[0].state == 'someBillingAddressState'
        result[0].country == 'GB'
        result[0].ipAddress == 'someIpAddress'
    }

}
