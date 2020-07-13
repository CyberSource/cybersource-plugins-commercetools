package isv.commercetools.reference.application.factory.payment;

import isv.commercetools.mapping.model.CustomPayment;
import isv.commercetools.mapping.model.PaymentDetails;
import isv.payments.exception.PaymentException;

public interface PaymentDetailsFactory {

    PaymentDetails paymentDetailsWithoutCart(CustomPayment payment);

    PaymentDetails paymentDetailsWithCart(CustomPayment payment) throws PaymentException;

}
