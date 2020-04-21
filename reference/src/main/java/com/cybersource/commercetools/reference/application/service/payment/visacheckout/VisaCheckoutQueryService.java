package com.cybersource.commercetools.reference.application.service.payment.visacheckout;

import com.cybersource.commercetools.mapping.model.PaymentDetails;
import com.cybersource.commercetools.mapping.transformer.RequestTransformer;
import com.cybersource.payments.CybersourceClient;
import com.cybersource.payments.exception.PaymentException;

import java.util.Map;

public class VisaCheckoutQueryService {

    private final RequestTransformer visaCheckoutDataRequestTransformer;
    private final CybersourceClient cybersourceClient;

    public VisaCheckoutQueryService(
            RequestTransformer visaCheckoutDataRequestTransformer,
            CybersourceClient cybersourceClient
    ) {
        this.visaCheckoutDataRequestTransformer = visaCheckoutDataRequestTransformer;
        this.cybersourceClient = cybersourceClient;
    }

    /**
     * Queries Cybersource for the Visa Checkout payment data for the token on the provided PaymentDetails payment object
     */
    public Map<String, Object> getVisaCheckoutData(PaymentDetails paymentDetails) throws PaymentException {
        var cybersourceRequest = visaCheckoutDataRequestTransformer.transform(paymentDetails);
        return cybersourceClient.makeRequest(cybersourceRequest);
    }

}
