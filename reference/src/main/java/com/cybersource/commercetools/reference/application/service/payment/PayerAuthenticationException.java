package com.cybersource.commercetools.reference.application.service.payment;

public class PayerAuthenticationException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public PayerAuthenticationException(Exception cause) {
        super(cause);
    }
}
