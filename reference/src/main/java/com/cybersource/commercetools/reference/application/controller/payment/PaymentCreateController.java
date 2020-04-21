package com.cybersource.commercetools.reference.application.controller.payment;

import com.cybersource.commercetools.api.extension.model.ExtensionInput;
import com.cybersource.commercetools.api.extension.model.ExtensionOutput;
import com.cybersource.commercetools.mapping.model.CustomPayment;
import com.cybersource.commercetools.reference.application.controller.response.ResponseBuilder;
import com.cybersource.commercetools.reference.application.logging.PayloadLogger;
import com.cybersource.commercetools.reference.application.service.extension.PaymentCreateExtensionService;
import com.cybersource.commercetools.reference.application.validation.ResourceValidator;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.sphere.sdk.payments.Payment;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/***
 * A REST Controller which listens for Payment Create API Extension calls, validates input, and then delegates to the PaymentCreateExtensionService.
 */
@RestController
@RequestMapping("/api")
@Validated
@Slf4j
@SuppressWarnings("unchecked")
public class PaymentCreateController extends AbstractPaymentController {

    @Autowired
    public PaymentCreateController(
            PaymentCreateExtensionService paymentCreateExtensionService,
            ResourceValidator<CustomPayment> paymentCreateValidator,
            ResponseBuilder responseBuilder,
            ObjectMapper objectMapper
    ) {
        super(
                paymentCreateExtensionService,
                new PayloadLogger(objectMapper, LoggerFactory.getLogger(PaymentCreateController.class)),
                paymentCreateValidator,
                responseBuilder
        );
    }

    protected PaymentCreateController(
            PaymentCreateExtensionService paymentCreateExtensionService,
            ResourceValidator<CustomPayment> paymentCreateValidator,
            ResponseBuilder responseBuilder,
            PayloadLogger payloadLogger
    ) {
        super(
                paymentCreateExtensionService,
                payloadLogger,
                paymentCreateValidator,
                responseBuilder
        );
    }

    @Override
    @RequestMapping(value = "/extension/payment/create", method = RequestMethod.POST)
    public ResponseEntity<ExtensionOutput> handle(@RequestBody final ExtensionInput<Payment> input) {
        payloadLogger.log("Received payment create", input);
        final CustomPayment payment = new CustomPayment(input.getResource().getObj());
        var extensionOutputResponseEntity = validateAndProcess(payment);
        payloadLogger.log("Returning response", extensionOutputResponseEntity.getBody());
        return extensionOutputResponseEntity;
    }
}
