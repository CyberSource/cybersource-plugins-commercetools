package isv.commercetools.mapping.transformer.fieldgroup

import io.sphere.sdk.carts.Cart
import io.sphere.sdk.carts.LineItem
import io.sphere.sdk.models.LocalizedString
import io.sphere.sdk.products.ProductVariant
import io.sphere.sdk.types.CustomFields
import io.sphere.sdk.utils.MoneyImpl
import isv.commercetools.mapping.model.PaymentDetails
import spock.lang.Specification

class LineItemFieldGroupTransformerSpecification extends Specification {

    def testObj = new LineItemFieldGroupTransformer()

    PaymentDetails paymentDetailsMock = Mock()
    Cart cartMock = Mock()
    LineItem lineItemMock1 = Mock()
    LineItem lineItemMock2 = Mock()
    ProductVariant variantMock1 = Mock()
    ProductVariant variantMock2 = Mock()
    CustomFields customFieldsMock1 = Mock()
    CustomFields customFieldsMock2 = Mock()

    def 'should transform cart line items to line item field groups'() {
        given: 'we have a cart with line items'
        lineItemMock1.quantity >> 1
        lineItemMock1.totalPrice >> MoneyImpl.of(11.11, 'GBP')
        lineItemMock1.name >> LocalizedString.ofEnglish('product name 1')
        lineItemMock1.productId >> 'product id 1'
        lineItemMock1.variant >> variantMock1
        variantMock1.sku >> 'sku 1'

        lineItemMock2.quantity >> 2
        lineItemMock2.totalPrice >> MoneyImpl.of(22.22, 'GBP')
        lineItemMock2.name >> LocalizedString.ofEnglish('product name 2')
        lineItemMock2.productId >> 'product id 2'
        lineItemMock2.variant >> variantMock2
        variantMock2.sku >> 'sku 2'

        cartMock.lineItems >> [lineItemMock1, lineItemMock2]
        cartMock.locale >> Locale.ENGLISH

        paymentDetailsMock.cart >> cartMock

        when: 'we transform it'
        def result = testObj.configure(paymentDetailsMock)

        then: 'it has the correct item values'
        result.size() == 2

        result[0].quantity == 1
        result[0].unitPrice == 11.11
        result[0].productSKU == 'sku 1'
        result[0].productName == 'product name 1'
        result[0].productCode == null
        result[0].productRisk == null

        result[1].quantity == 2
        result[1].unitPrice == 22.22
        result[1].productSKU == 'sku 2'
        result[1].productName == 'product name 2'
        result[1].productCode == null
        result[1].productRisk == null
    }

    def 'should transform cart line items with optional custom fields to line item field groups'() {
        given: 'we have a cart with line items'
        lineItemMock1.quantity >> 1
        lineItemMock1.totalPrice >> MoneyImpl.of(11.11, 'GBP')
        lineItemMock1.name >> LocalizedString.ofEnglish('product name 1')
        lineItemMock1.productId >> 'product id 1'
        lineItemMock1.variant >> variantMock1
        variantMock1.sku >> 'sku 1'
        lineItemMock1.custom >> customFieldsMock1
        customFieldsMock1.getFieldAsString('cs_productCode') >> 'product code 1'
        customFieldsMock1.getFieldAsString('cs_productRisk') >> 'product risk 1'

        lineItemMock2.quantity >> 2
        lineItemMock2.totalPrice >> MoneyImpl.of(22.22, 'GBP')
        lineItemMock2.name >> LocalizedString.ofEnglish('product name 2')
        lineItemMock2.productId >> 'product id 2'
        lineItemMock2.variant >> variantMock2
        variantMock2.sku >> 'sku 2'
        lineItemMock2.custom >> customFieldsMock2
        customFieldsMock2.getFieldAsString('cs_productCode') >> 'product code 2'
        customFieldsMock2.getFieldAsString('cs_productRisk') >> 'product risk 2'

        cartMock.lineItems >> [lineItemMock1, lineItemMock2]
        cartMock.locale >> Locale.ENGLISH

        paymentDetailsMock.cart >> cartMock

        when: 'we transform it'
        def result = testObj.configure(paymentDetailsMock)

        then: 'it has the correct item values'
        result.size() == 2

        result[0].quantity == 1
        result[0].unitPrice == 11.11
        result[0].productSKU == 'sku 1'
        result[0].productName == 'product name 1'
        result[0].productCode == 'product code 1'
        result[0].productRisk == 'product risk 1'

        result[1].quantity == 2
        result[1].unitPrice == 22.22
        result[1].productSKU == 'sku 2'
        result[1].productName == 'product name 2'
        result[1].productCode == 'product code 2'
        result[1].productRisk == 'product risk 2'
    }

}
