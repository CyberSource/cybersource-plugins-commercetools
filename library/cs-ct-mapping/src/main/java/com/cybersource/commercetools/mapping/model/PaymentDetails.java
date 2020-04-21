package com.cybersource.commercetools.mapping.model;

import io.sphere.sdk.carts.Cart;

public class PaymentDetails {

    private final CustomPayment customPayment;
    private final Cart cart;
    private final PaymentOverrides overrides;

    public PaymentDetails(CustomPayment customPayment, Cart cart) {
        this.customPayment = customPayment;
        this.cart = cart;
        overrides = new PaymentOverrides();
    }

    public PaymentDetails(CustomPayment payment) {
        this(payment, null);
    }

    public CustomPayment getCustomPayment() {
        return customPayment;
    }

    public Cart getCart() {
        return cart;
    }

    public PaymentOverrides getOverrides() {
        return overrides;
    }
}
