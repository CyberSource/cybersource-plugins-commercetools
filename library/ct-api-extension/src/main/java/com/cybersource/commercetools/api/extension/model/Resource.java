package com.cybersource.commercetools.api.extension.model;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.sphere.sdk.carts.Cart;
import io.sphere.sdk.customers.Customer;
import io.sphere.sdk.orders.Order;
import io.sphere.sdk.payments.Payment;

@SuppressWarnings("PMD.ShortVariable")
public class Resource<T> {

    private String typeId;
    private String id;

    @JsonTypeInfo(
            use = JsonTypeInfo.Id.NAME,
            include = JsonTypeInfo.As.EXTERNAL_PROPERTY,
            property = "typeId")
    @JsonSubTypes({
            @Type(value = Cart.class, name = "cart"),
            @Type(value = Customer.class, name = "customer"),
            @Type(value = Order.class, name = "order"),
            @Type(value = Payment.class, name = "payment")
    })
    private T obj;

    public String getTypeId() {
        return typeId;
    }

    public void setTypeId(String typeId) {
        this.typeId = typeId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public T getObj() {
        return obj;
    }

    public void setObj(T obj) {
        this.obj = obj;
    }

}
