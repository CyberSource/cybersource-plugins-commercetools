package isv.commercetools.reference.application.service.payment.visacheckout;

import isv.commercetools.mapping.model.PaymentDetails;
import isv.commercetools.mapping.transformer.RequestTransformer;
import isv.payments.PaymentServiceClient;
import isv.payments.exception.PaymentException;
import java.util.Map;

public class VisaCheckoutQueryService {

    private final RequestTransformer visaCheckoutDataRequestTransformer;
    private final PaymentServiceClient paymentServiceClient;

    public VisaCheckoutQueryService(
            RequestTransformer visaCheckoutDataRequestTransformer,
            PaymentServiceClient paymentServiceClient
    ) {
        this.visaCheckoutDataRequestTransformer = visaCheckoutDataRequestTransformer;
        this.paymentServiceClient = paymentServiceClient;
    }

    /**
     * Queries Payment service for the Visa Checkout payment data for the token on the provided PaymentDetails payment object
     */
    public Map<String, Object> getVisaCheckoutData(PaymentDetails paymentDetails) throws PaymentException {
        var paymentRequest = visaCheckoutDataRequestTransformer.transform(paymentDetails);
        return paymentServiceClient.makeRequest(paymentRequest);
    }

}
