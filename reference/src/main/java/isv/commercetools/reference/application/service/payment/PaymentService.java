package isv.commercetools.reference.application.service.payment;

import io.sphere.sdk.commands.UpdateAction;
import isv.commercetools.api.extension.model.ExtensionError;
import isv.commercetools.mapping.model.CustomPayment;
import isv.commercetools.mapping.model.PaymentDetails;
import isv.payments.exception.PaymentException;
import java.util.List;

/**
 * Should be implemented by any service which will call Cybersource.
 */
public interface PaymentService {

    /**
     * Populates the PaymentDetails object to be used for validate and process calls.
     * If the service requires access to the cart for either of these operations it should be retrieved and populated here
     * @param payment The payment currently being processed
     * @return Populated PaymentDetails
     */
    PaymentDetails populatePaymentDetails(CustomPayment payment) throws PaymentException;

    /**
     * Checks a payment, and returns errors if the PaymentService cannot process this payment. Should be called
     * before any further calls to the process method.
     * @param paymentDetails An object wrapping a commercetools payment and cart
     * @return Errors if the payment cannot be processed by this payment service, an empty list if it can be processed.
     */
    List<ExtensionError> validate(PaymentDetails paymentDetails);

    /**
     * Performs actions in order to 'process' this payment. Any failures in this method should return an AddInterfaceInteraction
     * update action reporting what went wrong, as well as updating any transaction states if needed.
     * @param paymentDetails An object wrapping a commercetools payment and cart
     * @return A list of UpdateActions in order to reflect the actions that were made on the Commercetools payment
     */
    List<UpdateAction> process(PaymentDetails paymentDetails);
}
