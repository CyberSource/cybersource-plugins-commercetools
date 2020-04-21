package com.cybersource.commercetools.reference.application.controller.payment;

import com.cybersource.commercetools.api.extension.model.ExtensionInput;
import com.cybersource.commercetools.api.extension.model.ExtensionOutput;
import com.cybersource.commercetools.mapping.model.CustomPayment;
import com.cybersource.commercetools.reference.application.controller.response.ResponseBuilder;
import com.cybersource.commercetools.reference.application.logging.PayloadLogger;
import com.cybersource.commercetools.reference.application.service.extension.ExtensionService;
import com.cybersource.commercetools.reference.application.validation.ResourceValidator;
import io.sphere.sdk.payments.Payment;
import org.springframework.http.ResponseEntity;

public abstract class AbstractPaymentController {

    protected final PayloadLogger payloadLogger;
    protected final ExtensionService extensionService;
    protected final ResponseBuilder responseBuilder;
    protected final ResourceValidator<CustomPayment> paymentValidator;

    public AbstractPaymentController(
            ExtensionService extensionService,
            PayloadLogger payloadLogger,
            ResourceValidator<CustomPayment> paymentValidator,
            ResponseBuilder responseBuilder) {
        this.extensionService = extensionService;
        this.payloadLogger = payloadLogger;
        this.paymentValidator = paymentValidator;
        this.responseBuilder = responseBuilder;
    }

    public abstract ResponseEntity<ExtensionOutput> handle(final ExtensionInput<Payment> input);

    protected ResponseEntity<ExtensionOutput> validateAndProcess(CustomPayment payment) {
        ResponseEntity<ExtensionOutput> response;
        var validationResult = paymentValidator.validate(payment);
        if (validationResult.isEmpty()) {
            response = process(payment);
        } else {
            response = responseBuilder.buildFailureResponse(validationResult);
        }
        return response;
    }

    private ResponseEntity<ExtensionOutput> process(CustomPayment payment) {
        ResponseEntity<ExtensionOutput> response;
        var serviceOutput = extensionService.process(payment);
        if (serviceOutput.getErrors().isEmpty()) {
            response = responseBuilder.buildSuccessResponse(serviceOutput);
        } else {
            response = responseBuilder.buildFailureResponse(serviceOutput);
        }
        return response;
    }
}
