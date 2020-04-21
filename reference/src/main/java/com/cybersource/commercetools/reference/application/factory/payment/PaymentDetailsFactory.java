package com.cybersource.commercetools.reference.application.factory.payment;

import com.cybersource.commercetools.mapping.model.PaymentDetails;
import com.cybersource.commercetools.mapping.model.CustomPayment;
import com.cybersource.payments.exception.PaymentException;

public interface PaymentDetailsFactory {

    PaymentDetails paymentDetailsWithoutCart(CustomPayment payment);

    PaymentDetails paymentDetailsWithCart(CustomPayment payment) throws PaymentException;

}
