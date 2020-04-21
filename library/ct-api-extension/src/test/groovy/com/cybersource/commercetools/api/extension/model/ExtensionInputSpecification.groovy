package com.cybersource.commercetools.api.extension.model

import io.sphere.sdk.carts.Cart
import io.sphere.sdk.customers.Customer
import io.sphere.sdk.json.SphereJsonUtils
import io.sphere.sdk.models.LocalizedString
import io.sphere.sdk.orders.Order
import io.sphere.sdk.payments.Payment
import io.sphere.sdk.payments.TransactionState
import io.sphere.sdk.payments.TransactionType
import io.sphere.sdk.payments.commands.updateactions.AddInterfaceInteraction
import io.sphere.sdk.payments.commands.updateactions.ChangeTransactionState
import spock.lang.Specification

class ExtensionInputSpecification extends Specification {

    def "should deserialise cart create payload"() {
        given:
        def payload = getClass().getResource('/input/cart/cartCreatePayload.json').text

        when:
        ExtensionInput<Cart> input = SphereJsonUtils.readObject(payload, ExtensionInput)

        then:
        input.action == Action.CREATE
        input.resource.obj instanceof Cart
        input.resource.obj.totalPrice.number == 0
        input.resource.obj.billingAddress.streetName == 'billing street'
        input.resource.obj.customLineItems.size() == 0
    }

    def "should deserialise customer create payload"() {
        given:
        def payload = getClass().getResource('/input/customer/customerCreatePayload.json').text

        when:
        ExtensionInput<Customer> input = SphereJsonUtils.readObject(payload, ExtensionInput)

        then:
        input.action == Action.CREATE
        input.resource.obj instanceof Customer
        input.resource.obj.firstName == 'first'
        input.resource.obj.lastName == 'last'
        input.resource.obj.email == 'cybersource-commercetools-extension@example.com'
        input.resource.obj.addresses.size() == 0
    }

    def "should deserialise order create payload"() {
        given:
        def payload = getClass().getResource('/input/order/orderCreatePayload.json').text

        when:
        ExtensionInput<Order> input = SphereJsonUtils.readObject(payload, ExtensionInput)

        then:
        input.action == Action.CREATE
        input.resource.obj instanceof Order
        input.resource.obj.totalPrice.number == 37.02
        input.resource.obj.billingAddress.streetName == 'billing street'
        input.resource.obj.shippingAddress.streetName == 'shipping street'
        input.resource.obj.customLineItems.size() == 1
        input.resource.obj.customLineItems[0].name.en == 'line item'
        input.resource.obj.customLineItems[0].slug == 'slug'
        input.resource.obj.customLineItems[0].taxRate.amount == 0.2
        input.resource.obj.customLineItems[0].quantity == 3
        input.resource.obj.customLineItems[0].totalPrice.number == 37.02
        input.resource.obj.customLineItems[0].money.number == 12.34
        input.resource.obj.orderNumber == null
    }

    def "should deserialise payment create payload"() {
        given:
        def payload = getClass().getResource('/input/payment/paymentCreatePayload.json').text

        when:
        ExtensionInput<Payment> input = SphereJsonUtils.readObject(payload, ExtensionInput)

        then:
        input.action == Action.CREATE
        input.resource.obj instanceof Payment
        input.resource.obj.amountPlanned.number == 12.34
        input.resource.obj.paymentMethodInfo.paymentInterface == 'cybersource'
        input.resource.obj.paymentMethodInfo.method == 'creditCard'
        input.resource.obj.transactions.size() == 0
    }

    def "should deserialise cart update payload"() {
        given:
        def payload = getClass().getResource('/input/cart/cartUpdatePayload.json').text

        when:
        ExtensionInput<Cart> input = SphereJsonUtils.readObject(payload, ExtensionInput)

        then:
        input.action == Action.UPDATE
        input.resource.obj instanceof Cart
        input.resource.obj.totalPrice.number == 37.02
        input.resource.obj.billingAddress.streetName == 'billing street'
        input.resource.obj.shippingAddress.streetName == 'shipping street'
        input.resource.obj.customLineItems.size() == 1
        input.resource.obj.customLineItems[0].name.en == 'line item'
        input.resource.obj.customLineItems[0].slug == 'slug'
        input.resource.obj.customLineItems[0].taxRate.amount == 0.2
        input.resource.obj.customLineItems[0].quantity == 3
        input.resource.obj.customLineItems[0].totalPrice.number == 37.02
        input.resource.obj.customLineItems[0].money.number == 12.34
    }

    def "should deserialise customer update payload"() {
        given:
        def payload = getClass().getResource('/input/customer/customerUpdatePayload.json').text

        when:
        ExtensionInput<Customer> input = SphereJsonUtils.readObject(payload, ExtensionInput)

        then:
        input.action == Action.UPDATE
        input.resource.obj instanceof Customer
        input.resource.obj.firstName == 'other'
        input.resource.obj.lastName == 'last'
        input.resource.obj.email == 'cybersource-commercetools-extension@example.com'
        input.resource.obj.addresses[0].streetName
    }

    def "should deserialise order update payload"() {
        given:
        def payload = getClass().getResource('/input/order/orderUpdatePayload.json').text

        when:
        ExtensionInput<Order> input = SphereJsonUtils.readObject(payload, ExtensionInput)

        then:
        input.action == Action.UPDATE
        input.resource.obj instanceof Order
        input.resource.obj.totalPrice.number == 37.02
        input.resource.obj.billingAddress.streetName == 'billing street'
        input.resource.obj.shippingAddress.streetName == 'shipping street'
        input.resource.obj.customLineItems.size() == 1
        input.resource.obj.customLineItems[0].name.en == 'line item'
        input.resource.obj.customLineItems[0].slug == 'slug'
        input.resource.obj.customLineItems[0].taxRate.amount == 0.2
        input.resource.obj.customLineItems[0].quantity == 3
        input.resource.obj.customLineItems[0].totalPrice.number == 37.02
        input.resource.obj.customLineItems[0].money.number == 12.34
        input.resource.obj.orderNumber == 'order number'
    }

    def "should deserialise payment update payload"() {
        given:
        def payload = getClass().getResource('/input/payment/paymentUpdatePayload.json').text

        when:
        ExtensionInput<Payment> input = SphereJsonUtils.readObject(payload, ExtensionInput)

        then:
        input.action == Action.UPDATE
        input.resource.obj instanceof Payment
        input.resource.obj.amountPlanned.number == 12.34
        input.resource.obj.transactions[0].amount.number == 12.34
        input.resource.obj.transactions[0].type == TransactionType.AUTHORIZATION
        input.resource.obj.transactions[0].state == TransactionState.SUCCESS
        input.resource.obj.paymentMethodInfo.paymentInterface == 'cybersource'
        input.resource.obj.paymentMethodInfo.method == 'creditCard'
    }

    def "should serialise error output"() {
        given:
        def objectMapper = SphereJsonUtils.newObjectMapper()
        def extraInfo = objectMapper.createObjectNode()
        extraInfo.put('key1', 'value1')
        extraInfo.set('key2', objectMapper.createArrayNode().add('value2').add('value2'))
        def error1 = new ExtensionError(
                ErrorCode.INVALID_OPERATION,
                'error message',
                LocalizedString.of([(Locale.ENGLISH):'english', (Locale.FRENCH):'francais']),
                extraInfo
        )
        def error2 = new ExtensionError(
                ErrorCode.INVALID_INPUT,
                'another error message',
        )
        def output = new ExtensionOutput().withErrors([error1, error2])

        when:
        def payload = SphereJsonUtils.toPrettyJsonString(output)

        then:
        payload == getClass().getResource('/output/errorPayload.json').text
    }

    def "should serialise action output"() {
        given:
        def action1 = ChangeTransactionState.of(TransactionState.SUCCESS, 'tx id')
        def action2 = AddInterfaceInteraction.ofTypeIdAndObjects(
                'interaction type id',
                'interaction key',
                'interaction value')
        def output = new ExtensionOutput().withActions([action1, action2])

        when:
        def payload = SphereJsonUtils.toPrettyJsonString(output)

        then:
        payload == getClass().getResource('/output/actionPayload.json').text
    }

}
