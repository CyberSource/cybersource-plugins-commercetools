package isv.commercetools.mapping.transformer.fieldgroup

import com.neovisionaries.i18n.CountryCode
import io.sphere.sdk.carts.Cart
import io.sphere.sdk.models.Address
import io.sphere.sdk.payments.Payment
import isv.commercetools.mapping.model.CustomPayment
import isv.commercetools.mapping.model.PaymentDetails
import spock.lang.Specification

class ShipToFieldGroupTransformerSpecification extends Specification {

    def testObj = new ShipToFieldGroupTransformer()

    Payment paymentMock = Mock()
    Cart cartMock = Mock()

    def 'should transform cart shipping address to shipping field group'() {
        given: 'we have payment details with a shipping address'
        cartMock.shippingAddress >> Address.of(CountryCode.GB)
            .withFirstName('first')
            .withLastName('last')
            .withStreetNumber('1')
            .withStreetName('street name')
            .withPostalCode('postal code')
            .withCity('city')
            .withRegion('state')

        def customPayment = new CustomPayment(paymentMock)
        def paymentDetails = new PaymentDetails(customPayment, cartMock)

        when: 'we transform it'
        def result = testObj.configure(paymentDetails)

        then: 'it has the correct shipTo values'
        result.size() == 1
        result[0].firstName == 'first'
        result[0].lastName == 'last'
        result[0].street1 == '1 street name'
        result[0].city == 'city'
        result[0].postalCode == 'postal code'
        result[0].state == 'state'
        result[0].country == 'GB'
    }

    def 'should not transform missing cart shipping address to shipping field group'() {
        given: 'we have payment details without a shipping address'
        def customPayment = new CustomPayment(paymentMock)
        def paymentDetails = new PaymentDetails(customPayment, cartMock)

        when: 'we transform it'
        def result = testObj.configure(paymentDetails)

        then: 'no field group returned'
        result.isEmpty()
    }

}
