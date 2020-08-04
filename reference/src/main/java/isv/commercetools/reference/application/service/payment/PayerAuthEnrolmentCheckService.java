package isv.commercetools.reference.application.service.payment;

import io.sphere.sdk.carts.Cart;
import io.sphere.sdk.commands.UpdateAction;
import isv.commercetools.api.extension.model.ExtensionError;
import isv.commercetools.mapping.PayerAuthEnrolmentCheckRequestTransformer;
import isv.commercetools.mapping.PayerAuthEnrolmentCheckResponseTransformer;
import isv.commercetools.mapping.model.CustomPayment;
import isv.commercetools.mapping.model.PaymentDetails;
import isv.commercetools.reference.application.factory.payment.PaymentDetailsFactory;
import isv.commercetools.reference.application.validation.ResourceValidator;
import isv.payments.CybersourceClient;
import isv.payments.exception.PaymentException;
import isv.payments.model.CybersourceRequest;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * A PaymentService which handles 3DS Enrolment checks
 */
public class PayerAuthEnrolmentCheckService implements PaymentService {

    private static final Logger LOGGER = LoggerFactory.getLogger(PayerAuthEnrolmentCheckService.class);

    private final PaymentDetailsFactory paymentDetailsFactory;
    private final ResourceValidator<CustomPayment> paymentValidator;
    private final ResourceValidator<Cart> cartValidator;
    private final PayerAuthEnrolmentCheckRequestTransformer requestTransformer;
    private final PayerAuthEnrolmentCheckResponseTransformer responseTransformer;
    private final CybersourceClient cybersourceClient;

    public PayerAuthEnrolmentCheckService(
            PaymentDetailsFactory paymentDetailsFactory,
            ResourceValidator<CustomPayment> paymentValidator,
            ResourceValidator<Cart> cartValidator,
            PayerAuthEnrolmentCheckRequestTransformer requestTransformer,
            PayerAuthEnrolmentCheckResponseTransformer responseTransformer,
            CybersourceClient cybersourceClient) {
        this.paymentDetailsFactory = paymentDetailsFactory;
        this.paymentValidator = paymentValidator;
        this.cartValidator = cartValidator;
        this.requestTransformer = requestTransformer;
        this.responseTransformer = responseTransformer;
        this.cybersourceClient = cybersourceClient;
    }

    @Override
    public PaymentDetails populatePaymentDetails(CustomPayment payment) throws PaymentException {
        return paymentDetailsFactory.paymentDetailsWithCart(payment);
    }

    @Override
    public List<ExtensionError> validate(PaymentDetails paymentDetails) {
        var errors = paymentValidator.validate(paymentDetails.getCustomPayment());
        errors.addAll(cartValidator.validate(paymentDetails.getCart()));
        return errors;
    }

    @Override
    public List<UpdateAction> process(PaymentDetails paymentDetails) {
        try {
            CybersourceRequest request = requestTransformer.transform(paymentDetails);
            Map<String, String> cybersourceResponse = cybersourceClient.makeRequest(request);
            return responseTransformer.transform(cybersourceResponse, paymentDetails.getCustomPayment());
        } catch (PaymentException e) {
            LOGGER.error(String.format("Received PaymentException when trying to check enrolment for Payment with id %s", paymentDetails.getCustomPayment().getId()), e);
            throw new PayerAuthenticationException(e);
        }
    }

}
