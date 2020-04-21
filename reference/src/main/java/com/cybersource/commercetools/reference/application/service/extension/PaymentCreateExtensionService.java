package com.cybersource.commercetools.reference.application.service.extension;

import com.cybersource.commercetools.api.extension.model.ErrorCode;
import com.cybersource.commercetools.api.extension.model.ExtensionError;
import com.cybersource.commercetools.api.extension.model.ExtensionOutput;
import com.cybersource.commercetools.mapping.model.CustomPayment;
import com.cybersource.commercetools.reference.application.service.payment.PayerAuthenticationException;
import com.cybersource.commercetools.reference.application.service.payment.PaymentService;
import com.cybersource.payments.exception.PaymentException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class PaymentCreateExtensionService implements ExtensionService {

    private static final Logger LOGGER = LoggerFactory.getLogger(PaymentCreateExtensionService.class);

    private final Map<String, PaymentService> paymentCreateServiceMap;

    public PaymentCreateExtensionService(
            @Qualifier("paymentCreateServiceMap") Map<String, PaymentService> paymentCreateServiceMap
    ) {
        this.paymentCreateServiceMap = paymentCreateServiceMap;
    }

    @Override
    public ExtensionOutput process(CustomPayment payment) {
        ExtensionOutput extensionOutput;
        var paymentCreateService = getCreateHandlerServiceForPayment(payment);

        try {
            var paymentDetails = paymentCreateService.populatePaymentDetails(payment);
            var errors = paymentCreateService.validate(paymentDetails);
            if (errors.isEmpty()) {
                var actions = paymentCreateService.process(paymentDetails);
                LOGGER.debug("Returning success response");
                extensionOutput = new ExtensionOutput().withActions(actions);
            } else {
                LOGGER.debug("Returning failure response");
                extensionOutput = new ExtensionOutput().withErrors(errors);
            }
        } catch (PayerAuthenticationException e) {
            LOGGER.error("Failed to check if card is enrolled in payer authentication", e);
            extensionOutput = new ExtensionOutput().withErrors(List.of(
                    new ExtensionError(ErrorCode.INVALID_OPERATION, e.getMessage())
            ));
        } catch (PaymentException e) {
                LOGGER.error("Could not process payment", e);
                extensionOutput = new ExtensionOutput().withErrors(List.of(
                        new ExtensionError(ErrorCode.INVALID_OPERATION, e.getMessage())
                ));
        }
        return extensionOutput;
    }

    private PaymentService getCreateHandlerServiceForPayment(CustomPayment payment) {
        return paymentCreateServiceMap.get(payment.getPaymentMethod());
    }

}
